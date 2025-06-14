import { uploadPostImage } from "@/camera-function/camera-picker";
import { PostForm } from "@/store/post-store";
import { supabase } from "@/utils/SupaLegend";
import { DateUtils } from "@/utils/constants";
import { getUserId, getUserRole } from "@/utils/persist-storage";
import moment from "moment";

type CreateHabitSchema = {
  habitName: string;
  category: string;
  reminderTime: string;
  frequency: number[];
  notificationEnable: boolean;
  habitColor: string;
  googleNotificationEnable: boolean;
  end_date: string | null;
  description: string;
};


// this should ignore the completed habits in the count
export const getHabitCount = async (): Promise<number> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
    .or("end_date.is.null,end_date.gt.now()"); // exclude completed habits

  if (error) {
    console.error("Error fetching habit count for user:", userId, error.message);
    return 0;
  }

  return data?.length ?? 0;
};


// this function returns habit names in lowercase..
export const getHabitNames = async ()=>{
  const userId = await getUserId();
  const {data, error} = await supabase.from("habit").select("habit_name").eq("user_id", userId)
  if(error){
    console.error("Error fetching habit count:", error);
    return [];
  }
  return data?.map(({ habit_name }) => habit_name?.trim().toLowerCase()) ?? [];
}

export const createOrUpdateHabit = async (
  formData: CreateHabitSchema,
  habitId?: string // Optional: If provided, update instead of insert
) => {
  const userId = await getUserId();

  // Build habit data object dynamically
  const habitData: any = {
    user_id: userId,
    habit_name: formData.habitName,
    category: formData.category,
    reminder_time: formData.reminderTime,
    frequency: formData.frequency,
    notification_enable: formData.notificationEnable,
    habit_color: formData.habitColor,
    google_notification_enable: formData.googleNotificationEnable,
    updated_at: DateUtils.getCurrentUtcTimestamp(), // Always update timestamp
    end_date: formData.end_date,
    habit_description: formData.description?.length
      ? formData.description
      : null,
  };

  // Include 'id' only if updating an existing habit
  if (habitId) {
    habitData.id = habitId;
  } else {
    habitData.created_at = DateUtils.getCurrentUtcTimestamp();
  }

  const { data, error: upsertError } = await supabase
    .from("habit")
    .upsert([habitData], { onConflict: "id" }) // Conflict resolution
    .select(); // Ensures inserted/updated data is returned

  if (upsertError) {
    console.error("Error inserting/updating habit:", upsertError);
    throw new Error("Failed to insert/update habit: " + upsertError.message);
  }

  return data;
};

export const deleteHabit = async (habitId: string) => {
  const userId = await getUserId();

  const { error: deleteError } = await supabase
    .from("habit")
    .delete()
    .eq("id", habitId)
    .eq("user_id", userId); // Ensures the user can only delete their own habits

  if (deleteError) {
    console.error("Error deleting habit:", deleteError);
    throw new Error("Failed to delete habit: " + deleteError.message);
  }

  return { message: "Habit deleted successfully" };
};

export const markHabitStatus = async (
  habitId: string,
  status: boolean,
  habitDate: string
) => {
  const userId = await getUserId();

  const today = new Date();
  const todayStr = DateUtils.getCurrentLocalDate();

  // 🔹 Validate that habitDate is today
  if (habitDate !== todayStr) {
    throw {
      message: "You can only update today's habit status",
      type: "warning",
    };
  }

  // 🔹 Fetch existing habit progress record for today
  const { data: existingRecord, error: fetchError } = await supabase
    .from("habit_progress")
    .select("id, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("date", habitDate)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching habit progress:", fetchError);
    throw {
      message: "Error fetching habit progress. Try again later.",
      type: "danger",
    };
  }

  if (existingRecord) {
    // 🔹 If today's status is true → DELETE the record
    if (existingRecord.status === true) {
      const { error: deleteError } = await supabase
        .from("habit_progress")
        .delete()
        .eq("id", existingRecord.id);

      if (deleteError) {
        console.error("Error deleting habit progress:", deleteError);
        throw {
          message: "Failed to delete habit progress. Try again later.",
          type: "danger",
        };
      }
    } else {
      // 🔹 If today's status is false → UPDATE it to true
      const { error: updateError } = await supabase
        .from("habit_progress")
        .update({ status: true })
        .eq("id", existingRecord.id);

      if (updateError) {
        console.error("Error updating habit status:", updateError);
        throw {
          message: "Failed to update habit. Try again later.",
          type: "danger",
        };
      }
    }
  } else {
    // 🔹 If no record exists for today → INSERT a new record with the given status
    const { error: insertError } = await supabase
      .from("habit_progress")
      .insert([
        {
          habit_id: habitId,
          user_id: userId,
          date: habitDate,
          status,
        },
      ]);

    if (insertError) {
      console.error("Error inserting habit progress:", insertError);
      throw {
        message: "Failed to log habit progress. Try again later.",
        type: "danger",
      };
    }
  }

  return { success: true };
};

export const getHabitStreak = async (habitId: string) => {
  const userId = await getUserId();

  const { data, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("status", true) // Ensure only completed habits are considered
    .order("date", { ascending: false });

  if (fetchError) {
    console.error("Error fetching streak:", fetchError);
    return 0;
  }

  if (!data || data.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Remove time part

  for (let i = 0; i < data.length; i++) {
    const habitDate = new Date(data[i].date);
    habitDate.setHours(0, 0, 0, 0); // Normalize date

    // If the habit date matches the current date, increase streak
    if (habitDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
    } else if (habitDate.getTime() === currentDate.getTime() - 86400000) {
      // Allow for skipping one day in a streak
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Streak is broken
    }
  }

  return streak;
};

export const getHabitStats = async (habitId: string) => {
  // const userId = await getUserId();

  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency, end_date")
    .eq("id", habitId)
    // .eq("user_id", userId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Local-normalized start & end dates
  const habitStartDate = moment
    .utc(habitData.created_at)
    .local()
    .startOf("day");
  const endDate = habitData.end_date
    ? moment.utc(habitData.end_date).local().startOf("day")
    : null;

  const frequencyDays: number[] = habitData.frequency || [];

  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    // .eq("user_id", userId)
    .order("date", { ascending: true });

  if (progressError) {
    console.error("Error fetching habit progress:", progressError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    const dateStr = moment.utc(entry.date).local().format("YYYY-MM-DD");
    progressMap.set(dateStr, entry.status);
  });

  const { data: archiveLogs, error: archiveError } = await supabase
    .from("habit_archive_log")
    .select("action, action_date")
    .eq("habit_id", habitId)
    // .eq("user_id", userId)
    .order("action_date", { ascending: true });

  if (archiveError) {
    console.error("Error fetching archive logs:", archiveError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  const archiveEvents = archiveLogs.map((log) => ({
    date: moment.utc(log.action_date).local().startOf("day"),
    action: log.action,
  }));

  let isActive = true;
  let archiveIndex = 0;

  const today = moment().local().startOf("day");
  const finalDate = endDate && endDate.isBefore(today) ? endDate : today;

  let currentDate = moment(habitStartDate);
  let completedCount = 0;
  let notCompletedCount = 0;
  let currentStreak = 0;
  let highestStreak = 0;
  let lastCompletedDate: string | null = null;
  let lastScheduledCompleted = false;

  while (currentDate.isSameOrBefore(finalDate)) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    const dayOfWeek = currentDate.day(); // 0 = Sunday

    // Process archive logs
    while (
      archiveIndex < archiveEvents.length &&
      archiveEvents[archiveIndex].date.isSameOrBefore(currentDate)
    ) {
      isActive = archiveEvents[archiveIndex].action === "restored";
      archiveIndex++;
    }

    if (!isActive || !frequencyDays.includes(dayOfWeek)) {
      currentDate.add(1, "day");
      continue;
    }

    if (progressMap.has(dateStr)) {
      if (progressMap.get(dateStr)) {
        completedCount++;
        lastScheduledCompleted = true;

        if (lastCompletedDate && lastScheduledCompleted) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        highestStreak = Math.max(highestStreak, currentStreak);
        lastCompletedDate = dateStr;
      } else {
        notCompletedCount++;
        lastScheduledCompleted = false;
        currentStreak = 0;
      }
    } else {
      // Not completed if no entry and date is in past
      if (currentDate.isBefore(today)) {
        notCompletedCount++;
        lastScheduledCompleted = false;
        currentStreak = 0;
      }
    }

    currentDate.add(1, "day");
  }

  return {
    completed: completedCount,
    notCompleted: notCompletedCount,
    streak: currentStreak,
    highestStreak,
  };
};

export const getHabitsByDate = async (date: string) => {
  const userId = await getUserId();

  // Convert the given date into a timestamp range for the full day
  const endOfDay = `${date}T23:59:59.999Z`; // End of the given date

  // Query habits with progress for the given date using LEFT JOIN
  const { data, error } = await supabase
    .from("habit")
    .select(
      `
      id, habit_name, category, reminder_time, frequency, habit_color, created_at,
      habit_progress(status, date)
    `
    )
    .eq("user_id", userId)
    .eq("habit_progress.date", date) // Get status for the given date
    .lte("created_at", endOfDay) // Ensure habit was created before the next day starts
    .order("reminder_time", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  // Transform data to include status for the given date
  return data.map((habit: any) => ({
    ...habit,
    isCompleted: habit.habit_progress?.[0]?.status || false, // Default to false if no record
  }));
};

export const getAllHabits = async (
  sortBy: "latest" | "alphabetical",
  page: number = 1,
  limit: number = 5
) => {
  const userId = await getUserId();
  const todayUtc = DateUtils.getCurrentUtcDate();

  const offset = (page - 1) * limit;
  const from = offset;
  const to = offset + limit - 1;

  let query = supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .or(`end_date.gte.${todayUtc},end_date.is.null`);

  // Apply sorting
  if (sortBy === "latest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "alphabetical") {
    query = query.order("habit_name", { ascending: true });
  }

  // Add pagination range
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching habits:", error);
    throw new Error("Error fetching habits: " + error.message);
  }

  // 🔹 Fetch last 7 days' progress and stats for each habit
  const habitsWithDetails = await Promise.all(
    data.map(async (habit) => {
      const [progressData, stats] = await Promise.all([
        fetchLast7DaysHabitProgress(habit.id),
        getHabitStats(habit.id),
      ]);

      return {
        ...habit,
        progress: progressData?.data || [],
        stats, // includes completed, notCompleted, streak, highestStreak
      };
    })
  );

  return habitsWithDetails;
};

export const getAllHabitsArchived = async () => {
  const todayUtc = DateUtils.getCurrentUtcDate();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", true)
    .or(`end_date.gte.${todayUtc},end_date.is.null`)
    .order("reminder_time", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Attach stats to each habit
  const habitsWithStats = await Promise.all(
    data.map(async (habit) => {
      const stats = await getHabitStats(habit.id);
      return {
        ...habit,
        stats,
      };
    })
  );

  return habitsWithStats;
};


export const archiveHabit = async (habitId: string): Promise<boolean> => {
  const archiveDate = DateUtils.getCurrentUtcTimestamp();

  const userId = await getUserId();

  // 2️⃣ Fetch last active date using RPC
  let lastActiveDate: string | null = null;
  const { data: fetchedLastActiveDate, error: lastActiveError } =
    await supabase.rpc("get_last_active_date", { habit_id: habitId });

  if (lastActiveError) {
    console.warn(
      "Error fetching last active date, proceeding without it:",
      lastActiveError
    );
  } else if (typeof fetchedLastActiveDate === "string") {
    lastActiveDate = fetchedLastActiveDate; // Ensure it's a valid string
  } else {
    console.warn(
      "Unexpected format for last active date, proceeding without it:",
      fetchedLastActiveDate
    );
  }

  // 3️⃣ Update the habit table to mark as archived
  const { error: habitError } = await supabase
    .from("habit")
    .update({
      archived: true,
      archive_date: archiveDate,
      updated_at: archiveDate,
      last_active_date: lastActiveDate || null, // Nullable, will be null if RPC fails
    })
    .eq("id", habitId);

  if (habitError) {
    console.error("Error archiving habit:", habitError);
    return false;
  }

  // 4️⃣ Log the archive action in habit_archive_log
  const { error: logError } = await supabase.from("habit_archive_log").insert([
    {
      habit_id: habitId,
      user_id: userId,
      action: "archived",
      action_date: archiveDate,
    },
  ]);

  if (logError) {
    console.error("Error inserting archive log:", logError);
    return false;
  }

  return true;
};

export const unarchiveHabit = async (habitId: string): Promise<boolean> => {
  const restoreDate = DateUtils.getCurrentUtcTimestamp();
  const userId = await getUserId();

  // 2️⃣ Update the habit table to mark as active again
  const { error: habitError } = await supabase
    .from("habit")
    .update({
      archived: false,
      archive_date: null,
      updated_at: restoreDate,
    })
    .eq("id", habitId);

  if (habitError) {
    console.error("Error unarchiving habit:", habitError);
    return false;
  }

  // 3️⃣ Log the restore action in habit_archive_log
  const { error: logError } = await supabase.from("habit_archive_log").insert([
    {
      habit_id: habitId,
      user_id: userId,
      action: "restored", // ✅ Make sure to use "restored" as per the constraint
      action_date: restoreDate,
    },
  ]);

  if (logError) {
    console.error("Error inserting unarchive log:", logError);
    return false;
  }

  return true;
};

export const getHabitById = async (habitId: string) => {
  // const userId = await getUserId();
  const { data, error } = await supabase
    .from("habit")
    .select("*")
    // .eq("user_id", userId)
    .eq("id", habitId)
    .single(); // Ensures only one habit is returned

  if (error) {
    console.error("Error fetching habit:", error.message);
    return null; // Return `null` instead of an empty array when there's an error
  }

  return data; // Return the habit object
};

export interface HabitProgressResponse {
  habitId: string;
  data: HabitProgressEntry[];
}

export const fetchLast7DaysHabitProgress = async (
  habitId: string
): Promise<HabitProgressResponse | null> => {
  // 🔹 Use UTC today & 6 days before for querying
  const todayUTC = moment().utc().startOf("day");
  const startOfRangeUTC = moment().utc().startOf("day").subtract(6, "days");

  // 🔹 Get string versions for Supabase query
  const todayUTCStr = todayUTC.format("YYYY-MM-DD");
  const startUTCStr = startOfRangeUTC.format("YYYY-MM-DD");

  // 🔹 Get habit creation info
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit details:", habitError);
    return null;
  }

  // Convert created_at to local
  const habitStartDate = moment
    .utc(habitData.created_at)
    .local()
    .format("YYYY-MM-DD");
  const frequencyDays: number[] = habitData.frequency || [];

  // 🔹 Get last active date
  const { data: fetchedLastActiveDate, error: lastActiveError } =
    await supabase.rpc("get_last_active_date", { habit_id: habitId });

  if (lastActiveError) {
    console.error("Error fetching last active date:", lastActiveError);
    return null;
  }

  const lastActiveDate = fetchedLastActiveDate
    ? moment.utc(fetchedLastActiveDate).local().format("YYYY-MM-DD")
    : null;

  // 🔹 Archive/restore history
  const { data: archiveLog, error: archiveError } = await supabase
    .from("habit_archive_log")
    .select("action, action_date")
    .eq("habit_id", habitId)
    .order("action_date", { ascending: true });

  if (archiveError) {
    console.error("Error fetching habit archive log:", archiveError);
    return null;
  }

  let isArchived = false;
  let validActivePeriods: { start: string; end: string | null }[] = [];
  let currentStart: string | null = habitStartDate;

  for (const entry of archiveLog) {
    const actionDate = moment
      .utc(entry.action_date)
      .local()
      .format("YYYY-MM-DD");

    if (entry.action === "archived") {
      if (!isArchived && currentStart) {
        validActivePeriods.push({ start: currentStart, end: actionDate });
        isArchived = true;
      }
    } else if (entry.action === "restored") {
      if (isArchived) {
        currentStart = actionDate;
        isArchived = false;
      }
    }
  }

  if (!isArchived && currentStart) {
    validActivePeriods.push({ start: currentStart, end: null }); // still active
  }

  // 🔹 Fetch habit progress (UTC dates in DB)
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startUTCStr)
    .lte("date", todayUTCStr);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // 🔹 Map progress with local date keys
  const progressMap = new Map(
    progressData.map((entry) => [
      moment.utc(entry.date).local().format("YYYY-MM-DD"),
      entry.status,
    ])
  );

  // 🔹 Generate local dates from local start to today (7 days)
  const result: HabitProgressEntry[] = [];
  let currentDate = moment().local().startOf("day").subtract(6, "days");
  const todayLocalStr = moment().local().format("YYYY-MM-DD");

  while (currentDate.format("YYYY-MM-DD") <= todayLocalStr) {
    const dateString = currentDate.format("YYYY-MM-DD");
    const dayOfWeek = currentDate.day(); // 0 = Sunday

    let status: boolean | null = null;

    const isWithinActivePeriod = validActivePeriods.some(({ start, end }) => {
      return dateString >= start && (!end || dateString <= end);
    });

    if (!isWithinActivePeriod || !frequencyDays.includes(dayOfWeek)) {
      status = null;
    } else {
      status = progressMap.get(dateString) ?? false;
    }

    result.push({ date: dateString, status });
    currentDate.add(1, "day");
  }

  return { habitId, data: result };
};

export type CompletedHabits = {
  id: string;
  user_id: string;
  habit_name: string;
  category: string;
  reminder_time: string; // Format: HH:MM:SS
  frequency: number[]; // 0 (Sunday) to 6 (Saturday)
  notification_enable: boolean;
  habit_color: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  google_notification_enable: boolean;
  archived: boolean;
  archive_date: string | null;
  end_date: string; // Format: YYYY-MM-DD
  last_active_date: string; // ISO date string
  restored_at: string | null;
  habit_description: string | null;
  public: boolean;
};

export const getAllCompletedHabits = async (): Promise<CompletedHabits[]> => {
  const userId = await getUserId();

  const todayUTC = DateUtils.getCurrentUtcDate(); // Format: YYYY-MM-DD

  const { data, error } = await supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
    .lte("end_date", todayUTC); // <= end_date

  if (error) {
    console.error("Error fetching completed habits:", error);
    throw new Error("Error fetching completed habits: " + error.message);
  }

  return data;
};

export type CompletedHabitWithStreak = CompletedHabits & {
  highestStreak: number;
  rewardImageUrl?: string;
};

export const getAllCompletedHabitsWithStreaks = async (): Promise<CompletedHabitWithStreak[]> => {
  const habits = await getAllCompletedHabits();

  // Fetch all rewards from DB
  const { data: rewards, error: rewardError } = await supabase
    .from("rewards")
    .select("*");

  if (rewardError) {
    console.error("Error fetching rewards:", rewardError);
    throw new Error("Could not fetch rewards.");
  }

  // Sort rewards by day descending for matching highest reward for streak
  const sortedRewards = (rewards ?? []).sort((a, b) => b.day - a.day);

  // Map habits to include highest streak and reward image
  const enrichedHabits: CompletedHabitWithStreak[] = [];

  for (const habit of habits) {
    const stats = await getHabitStats(habit.id);
    const highestStreak = stats.highestStreak;
    

    // Find the most relevant reward for this streak
    const matchingReward = sortedRewards.find((r) => highestStreak >= r.day);

    enrichedHabits.push({
      ...habit,
      highestStreak,
      rewardImageUrl: matchingReward?.reward_image_url,
    });
  }

  return enrichedHabits;
};


export const updateHabitPublicStatus = async (
  habitId: string,
  isPublic: boolean
) => {
  const { data, error } = await supabase
    .from("habit")
    .update({ public: isPublic })
    .eq("id", habitId);

  if (error) {
    console.error("Error updating public status:", error);
    return null;
  }

  return data;
};

// *************************Analytics*************************

export interface HabitProgressEntry {
  date: string;
  status: boolean | null; // true = completed, false = not completed, null = no entry
}

export interface HabitProgressResponse {
  habitId: string;
  data: HabitProgressEntry[];
}

export const fetchHabitProgressFromCreation = async (
  habitId: string
): Promise<HabitProgressResponse | null> => {
  // Get today's local date at midnight
  const today = moment().startOf("day").toDate();

  // Fetch habit details including created_at, frequency, and end_date
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency, end_date")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return null;
  }

  // Convert habit creation date and end date to local midnight
  const habitStartDate = moment(habitData.created_at).startOf("day").toDate();
  const rawEndDate = habitData.end_date
    ? moment(habitData.end_date).startOf("day").toDate()
    : null;

  const habitEndDate = rawEndDate && rawEndDate <= today ? rawEndDate : today;

  // Parse frequency days (e.g., [0,1,2] where 0=Sunday, ..., 6=Saturday)
  const frequencyDays: number[] = habitData.frequency || [];

  // Fetch all archive/unarchive events for this habit
  const { data: archiveLogs, error: archiveError } = await supabase
    .from("habit_archive_log")
    .select("action, action_date")
    .eq("habit_id", habitId)
    .order("action_date", { ascending: true });

  if (archiveError) {
    console.error("Error fetching archive logs:", archiveError);
    return null;
  }

  // Convert logs into structured archive periods
  let archivePeriods: { start: Date; end: Date | null }[] = [];
  let lastArchiveStart: Date | null = null;

  archiveLogs.forEach((log) => {
    const actionDate = moment(log.action_date).startOf("day").toDate();

    if (log.action === "archived") {
      lastArchiveStart = actionDate;
    } else if (log.action === "restored" && lastArchiveStart) {
      archivePeriods.push({ start: lastArchiveStart, end: actionDate });
      lastArchiveStart = null;
    }
  });

  if (lastArchiveStart) {
    archivePeriods.push({ start: lastArchiveStart, end: null });
  }

  // Fetch habit progress entries between start and end
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", moment(habitStartDate).format("YYYY-MM-DD"))
    .lte("date", moment(habitEndDate).format("YYYY-MM-DD"));

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  const progressMap = new Map(
    progressData.map((entry) => [entry.date, entry.status])
  );

  // Generate progress list
  const result: HabitProgressEntry[] = [];
  let currentDate = moment(habitStartDate).startOf("day");

  while (currentDate.toDate() <= habitEndDate) {
    const dateString = currentDate.format("YYYY-MM-DD");
    const dayOfWeek = currentDate.day(); // Local day of week

    const archiveRecord = archivePeriods.find(
      ({ start, end }) =>
        currentDate.toDate() >= start &&
        (end === null || currentDate.toDate() < end)
    );

    let status: boolean | null = null;

    if (frequencyDays.includes(dayOfWeek)) {
      if (progressMap.has(dateString)) {
        status = progressMap.get(dateString)!;
      } else {
        status = false; // Not completed
      }

      if (archiveRecord) {
        const archiveStart = moment(archiveRecord.start).format("YYYY-MM-DD");

        if (dateString === archiveStart) {
          // Only count the first day of archive if marked complete
          status =
            progressMap.has(dateString) && progressMap.get(dateString) === true
              ? true
              : null;
        } else {
          status = null; // Archived
        }
      }

      result.push({ date: dateString, status });
    }

    currentDate.add(1, "day");
  }

  return { habitId, data: result };
};

export const getCompletedHabitStats = async (habitId: string) => {
  // const userId = await getUserId();

  // Fetch habit progress directly from habit_progress table
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    // .eq("user_id", userId)
    .order("date", { ascending: true });

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return getDefaultStats();
  }

  if (!progressData || progressData.length === 0) {
    return getDefaultStats();
  }

  // Store progress in a Map for quick lookup
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    progressMap.set(entry.date.split("T")[0], entry.status);
  });

  // Initialize tracking variables
  let completedCount = 0,
    notCompletedCount = 0;
  let highestStreak = 0,
    currentStreak = 0;
  let weeklyCompleted = 0,
    weeklyNotCompleted = 0;
  let monthlyCompleted = 0,
    monthlyNotCompleted = 0;
  let yearlyCompleted = 0,
    yearlyNotCompleted = 0;

  // Get current date info
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - 6); // Last 7 days

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Iterate over fetched habit progress
  for (const { date, status } of progressData) {
    const entryDate = new Date(date);
    entryDate.setUTCHours(0, 0, 0, 0);

    const isCompleted = !!status;

    if (isCompleted) {
      completedCount++;
      currentStreak++;
      highestStreak = Math.max(highestStreak, currentStreak);
    } else {
      notCompletedCount++;
      currentStreak = 0;
    }

    // Check for weekly, monthly, and yearly counts
    if (entryDate >= startOfWeek) {
      isCompleted ? weeklyCompleted++ : weeklyNotCompleted++;
    }

    if (entryDate >= startOfMonth) {
      isCompleted ? monthlyCompleted++ : monthlyNotCompleted++;
    }

    if (entryDate >= startOfYear) {
      isCompleted ? yearlyCompleted++ : yearlyNotCompleted++;
    }
  }

  return {
    completed: completedCount,
    notCompleted: notCompletedCount,
    streak: currentStreak,
    highestStreak,
    weekly: { completed: weeklyCompleted, notCompleted: weeklyNotCompleted },
    monthly: { completed: monthlyCompleted, notCompleted: monthlyNotCompleted },
    yearly: { completed: yearlyCompleted, notCompleted: yearlyNotCompleted },
  };
};

// Helper function to return default stats
const getDefaultStats = () => ({
  completed: 0,
  notCompleted: 0,
  streak: 0,
  highestStreak: 0,
  weekly: { completed: 0, notCompleted: 0 },
  monthly: { completed: 0, notCompleted: 0 },
  yearly: { completed: 0, notCompleted: 0 },
});

export const fetchHabitProgressForCurrentMonth = async (
  habitId: string
): Promise<HabitProgressResponse | null> => {
  const today = moment().local().startOf("day");

  // Start and end of the current month in local time
  const startOfMonth = today.clone().startOf("month");
  const endOfMonth = today.clone().endOf("month");

  // Convert to UTC strings for querying the DB
  const startDateUTC = startOfMonth.clone().utc().format("YYYY-MM-DD");
  const endDateUTC = endOfMonth.clone().utc().format("YYYY-MM-DD");

  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startDateUTC)
    .lte("date", endDateUTC);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Create a map using local date keys
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    const localDateStr = moment.utc(entry.date).local().format("YYYY-MM-DD");
    progressMap.set(localDateStr, entry.status);
  });

  // Generate all days in the current month (local timezone)
  const result: HabitProgressEntry[] = [];
  let currentDate = startOfMonth.clone();

  while (currentDate.isSameOrBefore(endOfMonth)) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    const status = progressMap.get(dateStr) ?? false;

    result.push({ date: dateStr, status });

    currentDate.add(1, "day");
  }

  return { habitId, data: result };
};

export const fetchWeeklyHabitProgressForYear = async (
  habitId: string
): Promise<{ week: string; completed: number }[]> => {
  const today = moment().local().startOf("day");
  const startOfYear = today.clone().startOf("year");
  const endOfYear = today.clone().endOf("year");

  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfYear.clone().utc().format("YYYY-MM-DD"))
    .lte("date", endOfYear.clone().utc().format("YYYY-MM-DD"));

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Map to store weekly progress
  const weeklyProgress: Record<string, number> = {};

  // Generate all week labels from Jan 1 to Dec 31
  let currentWeekStart = startOfYear.clone().startOf("week"); // Start on Sunday

  while (currentWeekStart.isSameOrBefore(endOfYear)) {
    const weekLabel = currentWeekStart.format("MMM D"); // eg. Jan 7
    weeklyProgress[weekLabel] = 0;
    currentWeekStart.add(1, "week");
  }

  // Count completed entries grouped by week
  for (const entry of progressData) {
    const localDate = moment.utc(entry.date).local().startOf("day");

    const weekStart = localDate.clone().startOf("week"); // Sunday
    const weekLabel = weekStart.format("MMM D");

    if (weeklyProgress[weekLabel] !== undefined && entry.status === true) {
      weeklyProgress[weekLabel]++;
    }
  }

  // Convert the object to an array
  return Object.entries(weeklyProgress).map(([week, completed]) => ({
    week,
    completed,
  }));
};

export const fetchMonthlyHabitProgressForYear = async (
  habitId: string
): Promise<{ month: string; completed: number }[]> => {
  const today = moment().local().startOf("day");
  const startOfYear = today.clone().startOf("year");
  const endOfYear = today.clone().endOf("year");

  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfYear.clone().utc().format("YYYY-MM-DD"))
    .lte("date", endOfYear.clone().utc().format("YYYY-MM-DD"));

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Create empty month stats
  const monthlyProgress: Record<string, number> = {};
  for (let i = 0; i < 12; i++) {
    const month = moment().month(i).format("MMM");
    monthlyProgress[month] = 0;
  }

  // Count completed entries per month
  for (const entry of progressData) {
    const localDate = moment.utc(entry.date).local().startOf("day");
    const month = localDate.format("MMM");

    if (entry.status) {
      monthlyProgress[month]++;
    }
  }

  // Return as array
  return Object.entries(monthlyProgress).map(([month, completed]) => ({
    month,
    completed,
  }));
};

export const fetchYearlyHabitProgressForLastThreeYears = async (
  habitId: string
): Promise<{ year: number; completed: number }[]> => {
  const today = new Date();
  const startYear = today.getUTCFullYear() - 2; // Start from 3 years ago
  const endYear = today.getUTCFullYear();

  const startOfPeriod = new Date(startYear, 0, 1); // Jan 1st of 3 years ago
  const endOfPeriod = new Date(endYear, 11, 31); // Dec 31st of current year

  // Fetch habit progress for the last 3 years
  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfPeriod.toISOString().split("T")[0])
    .lte("date", endOfPeriod.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Initialize progress object for each year
  const yearlyProgress: Record<number, number> = {};
  for (let year = startYear; year <= endYear; year++) {
    yearlyProgress[year] = 0;
  }

  // Process habit progress
  for (const entry of progressData) {
    const entryDate = new Date(entry.date);
    const year = entryDate.getUTCFullYear();

    if (entry.status) {
      yearlyProgress[year] += 1;
    }
  }

  // Convert to array format
  return Object.keys(yearlyProgress).map((year) => ({
    year: parseInt(year),
    completed: yearlyProgress[parseInt(year)],
  }));
};

export const fetchYearlyHabitProgressForLastFiveYears = async (
  habitId: string
): Promise<{ year: number; completed: number }[]> => {
  const today = new Date();
  const startYear = today.getUTCFullYear() - 4; // Start from 5 years ago
  const endYear = today.getUTCFullYear(); // Current year

  const startOfPeriod = new Date(startYear, 0, 1); // Jan 1st of 5 years ago
  const endOfPeriod = new Date(endYear, 11, 31); // Dec 31st of current year

  // Fetch habit progress for the last 5 years
  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfPeriod.toISOString().split("T")[0])
    .lte("date", endOfPeriod.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Initialize progress object for each year
  const yearlyProgress: Record<number, number> = {};
  for (let year = startYear; year <= endYear; year++) {
    yearlyProgress[year] = 0;
  }

  // Process habit progress
  for (const entry of progressData) {
    const entryDate = new Date(entry.date);
    const year = entryDate.getUTCFullYear();

    if (entry.status) {
      yearlyProgress[year] += 1;
    }
  }

  // Convert to array format
  return Object.keys(yearlyProgress).map((year) => ({
    year: parseInt(year),
    completed: yearlyProgress[parseInt(year)],
  }));
};

export const getHabitCompletionStats = async (habitId: string) => {
  const userId = getUserId();

  // Step 1: Fetch habit details
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, end_date, frequency")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return { completed: 0, pending: 0 };
  }

  // Step 2: Convert to local start of day
  const start = moment.utc(habitData.created_at).local().startOf("day");
  const end = habitData.end_date
    ? moment.utc(habitData.end_date).local().startOf("day")
    : moment().local().startOf("day");

  // Step 3: Fetch progress data
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("date", start.clone().utc().format("YYYY-MM-DD"))
    .lte("date", end.clone().utc().format("YYYY-MM-DD"));

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return { completed: 0, pending: 0 };
  }

  // Step 4: Convert progress entries to local date map
  const progressMap = new Map<string, boolean>();
  for (const entry of progressData) {
    const localDate = moment.utc(entry.date).local().format("YYYY-MM-DD");
    progressMap.set(localDate, entry.status);
  }

  // Step 5: Parse frequency
  const frequencyDays: number[] = habitData.frequency || [];

  // Step 6: Count completion and pending
  let completedCount = 0;
  let pendingCount = 0;
  const today = moment().local().startOf("day");

  let current = start.clone();
  while (current <= end) {
    const dayOfWeek = current.day(); // 0 (Sun) - 6 (Sat)
    const dateStr = current.format("YYYY-MM-DD");

    if (frequencyDays.includes(dayOfWeek)) {
      if (progressMap.has(dateStr)) {
        if (progressMap.get(dateStr)) completedCount++;
        else pendingCount++;
      } else if (current.isBefore(today)) {
        pendingCount++; // Missed day
      }
    }

    current.add(1, "day");
  }

  return { completed: completedCount, pending: pendingCount };
};

export const getCompletedAndPendingDays = async (habitId: string) => {
  // const userId = await getUserId();

  // 1. Fetch habit metadata
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, end_date, frequency")
    .eq("id", habitId)
    // .eq("user_id", userId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return { completedDays: 0, pendingDays: 0 };
  }

  // 2. Normalize start and end dates to local timezone
  const start = moment.utc(habitData.created_at).local().startOf("day");
  const end = habitData.end_date
    ? moment.utc(habitData.end_date).local().endOf("day")
    : moment().local().endOf("day");

  // 3. Fetch completed habit entries
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    // .eq("user_id", userId)
    .gte("date", start.clone().utc().format())
    .lte("date", end.clone().utc().format());

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return { completedDays: 0, pendingDays: 0 };
  }

  // 4. Build a Set of completed dates (in local YYYY-MM-DD)
  const completedDaysSet = new Set<string>();
  progressData.forEach((entry) => {
    if (entry.status) {
      const localDateStr = moment.utc(entry.date).local().format("YYYY-MM-DD");
      completedDaysSet.add(localDateStr);
    }
  });

  // 5. Count completed and pending based on frequency
  const frequencyDays: number[] = habitData.frequency || [];
  let completedDays = 0;
  let pendingDays = 0;

  let current = start;
  const today = moment().local().startOf("day");

  while (current <= end) {
    const dateStr = current.local().format("YYYY-MM-DD");
    const dayOfWeek = current.day(); // 0 (Sun) - 6 (Sat)

    if (frequencyDays.includes(dayOfWeek)) {
      if (completedDaysSet.has(dateStr)) {
        completedDays++;
      } else {
        pendingDays++;
      }
    }

    current.add(1, "day");
  }

  return { completedDays, pendingDays };
};

/********************************** Profile Api ***************************************** */

export const getUserProfile = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return {
      id: "",
      full_name: "",
      mobile: "",
      email: "",
      created_at: "",
      updated_at: "",
      profile_pic: "NULL",
      profile_bio: "NULL",
    };
  }

  return data;
};

export const updateUserProfileInfo = async (
  fullName: string,
  profileBio: string
) => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("profile")
    .update({
      full_name: fullName,
      profile_bio: profileBio,
    })
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return {
      id: "",
      full_name: "",
      mobile: "",
      email: "",
      created_at: "",
      updated_at: "",
      profile_pic: "NULL",
      profile_bio: "NULL",
    };
  }

  return data;
};

export const getAvatarImages = async () => {
 const { data, error } = await supabase
  .from("avatars")
  .select("*")
  .order("id", { ascending: true }); // use false for descending

  if (error) {
    console.error("Error listing avatars:", error.message);
    return [];
  }

  return data;
};

export const updateProfilePic = async (imageUrl: string,isAvatar=true) => {
  const userId = await getUserId();
  await deleteOldProfilePic(); // Delete old profile picture if exists
  const { data, error } = await supabase
    .from("profile")
    .update({
      profile_pic: imageUrl,
      isAvatar:isAvatar
    })
    .eq("id", userId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const deleteOldProfilePic = async () => {
  const userId = await getUserId();
  const { data: userData, error: userError } = await supabase.from('profile').select('profile_pic,isAvatar').eq('id', userId).single();
  if(userError){
    throw new Error(userError.message);
  }
  if(!userData?.isAvatar){
    const fileName = userData?.profile_pic?.split('/').pop() || '';
    const filePath = `${userId}/${fileName}`;
      const { error } = await supabase.storage.from('avatars').remove([filePath]);

  if (error) {
    console.error('Image delete failed:', error.message);
    throw error;
  }
  }
}

export const deleteProfilePic = async () => {
  const userId = await getUserId();
  await deleteOldProfilePic(); // Delete old profile picture if exists
  const { data, error } = await supabase
    .from("profile")
    .update({
      profile_pic: null,
      isAvatar:true
    })
    .eq("id", userId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

type SuggestionDetails = {
  categories: string;
  title: string;
  description: string;
};

export const insertSuggestion = async (suggestionDetails: SuggestionDetails) => {
  const userId = await getUserId();
  const { title, description, categories } = suggestionDetails;
  console.log(userId, title, description, categories);
  
  const { data, error } = await supabase.from("suggestions").insert([
    {
      user_id: userId,
      title:title,
      description:description,
      category:categories,
    },
  ]);

  if (error) throw error;
  return data;
};

export const getMySuggestions = async (status:string)=>{
  const userId = await getUserId();
  const { data, error } = await supabase.from("suggestions").select("*").eq("user_id", userId).eq('status',status).order("created_at", { ascending: false }); // Most recent first;
  if (error) throw error;
  return data;
}

export const deleteSuggestionById = async (id: string) => {
  const userId = await getUserId();
  const { error } = await supabase.from("suggestions").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
  return true
};

export type SuggestionWithProfile = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  status:  "pending" | "approved" | "rejected"|"in_progress";
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  profile: {
    id: string;
    email: string;
    mobile: string;
    full_name: string;
  };
};


export type Reward = {
  id: string;
  day: number;
  reward_image_url: string;
  created_at: string;
};

export const getStreakChallengeDetails = async (): Promise<Reward[]> => {

    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .order("day", { ascending: true });

    if (error) {
      console.error("Error fetching rewards:", error.message);
      throw new Error("Failed to fetch streak challenge details");
    }

    return data as Reward[]??[];
  
};





/***************************************** Super User Suggestion *****************************************/

export const getAllSuggestions = async (
  page: number = 1,
  limit: number = 10,
  status:string='pending',
): Promise<SuggestionWithProfile[]> => {
  const role = getUserRole();
  if (role !== "admin") return [];

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("suggestions")
    .select(
      `
      *,
      profile (
        id,
        full_name,
        email,
        mobile
      )
    `
    )
    .order("created_at", { ascending: false }) // optional: latest first
    .eq('status',status)
    // .eq('category',category)
    .range(from, to); // 👈 this handles pagination

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};


export const deleteSuggestionByAdmin = async (id: string) => {
  const role = getUserRole();
  if(role!='admin'){
    throw Error('You are not authorized to delete this suggestion')
  }
  const { error } = await supabase.from("suggestions").delete().eq("id", id);
  if (error) throw error;
  return true
};


export const updateSuggestionStatus = async (id: string, status: string) => {
  const role = getUserRole();
  if(role!='admin'){
    throw Error('You are not authorized to update this suggestion')
  }
  
  const { error } = await supabase.from("suggestions").update({ status,updated_at:new Date().toISOString()}).eq("id", id);
  if (error) throw error;
  return true
};

export const getAboutUs = async ()=>{
  const {data,error} =await supabase.from('profile').select('*').eq('role','admin');
  if(error){
    throw error;
  }
  return data;
}

export const getSuggestionCount = async () => {
  const { count, error } = await supabase
    .from("suggestions")
    .select("*", { count: "exact", head: true }) // head: true to avoid fetching data

  if (error) {
    console.error("Error fetching suggestion count:", error);
    return 0;
  }

  return count ?? 0;
};




//************************ Streak Challenge Api *********************************** */


export type TopStreakUser = {
  user_id: string;
  habit_id: string;
  habit_name: string;
  current_streak: number;
  best_streak: number;
  last_date: string; // ISO date string
  rank: number;
  full_name: string;
  email: string;
  profile_pic: string;
  profile_created_at: string; // ISO timestamp
};

export async function getUserStreaks(): Promise<TopStreakUser[]> {
  const { data, error } = await supabase
    .rpc('get_user_streaks');

  if (error) {
    console.error('Error fetching streaks:', error);
    return [];
  }

  return data ?? [];
}

export type TopCompletedUser = {
  user_id: string;
  habit_id: string;
  habit_name: string;
  total_completions: number;
  best_streak: number;
  last_date: string; // ISO date string
  rank: number;
  full_name: string;
  email: string;
  profile_pic: string;
  profile_created_at: string; // ISO timestamp
};

export async function getHighestCompletedHabitList(): Promise<TopCompletedUser[]> {
  const { data, error } = await supabase
    .rpc('get_user_top_completed_habit_with_streak');

  if (error) {
    console.error('Error fetching highest completed habits:', error);
    return [];
  }

  return data ?? [];
}

export async function getNearestRewardBadge(streakDay: number) {
  const { data, error } = await supabase
    .from('rewards')
    .select('reward_image_url')
    .lte('day', streakDay) // <= streakDay
    .order('day', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching reward badge:', error.message);
    return null;
  }

  return data; // returns { id, day, reward_image_url, created_at }
}



/***************************************** Other User View *****************************************/

export type OtherUserProfile ={
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  created_at: string;
  updated_at: string;
  profile_pic: string;
  profile_bio: string;
  role: 'admin' | 'user'; // update if more roles exist
  isAvatar: boolean;
}

// Function to get other user profile by ID
export async function getOtherUserProfile(userId: string): Promise<OtherUserProfile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching other user profile:', error);
    return null;
  }

  return data;
}

// Define the type for a Habit
export interface OtherUserHabit {
  id: string;
  user_id: string;
  habit_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  category: string;
  // Add other fields if your table has them
}

// Function to get public habits for another user
export async function getOtherUserHabits(userId: string): Promise<OtherUserHabit[]|null> {
  const { data, error } = await supabase
    .from('habit')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false) // Assuming you want only active habits
    .eq('public', true)
    .order('habit_name', { ascending: true });

  if (error) {
    console.error('Error fetching other user habits:', error);
    return [];
  }

  return data || [];
}


/****************************************** Create or edit Post    **************************************/




export async function createPost({habitId=null,description,images,rewardPostMode}:PostForm){
  const userId = await getUserId();
  // console.log("post details ==>", {habitId,description,images,rewardPostMode});
  
   // Upload all images and get public URLs
  let imageUrls: string[] = [];
  if(images?.length!==0&&!rewardPostMode){
      imageUrls = await Promise.all(
      images.map(async (uri) => await uploadPostImage(uri))
  );
  }
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        user_id: userId,
        habit_id: habitId,
        content: description,
        image_urls: rewardPostMode?images: imageUrls,
        reward_post: rewardPostMode
      },
    ])
    .select()
    .single();

    if (error) {
      console.log("Post creation failed:", error.message);
      
    return { success: false, error: error.message };
  }
  // console.log("Post created successfully:", data);
  
  return { success: true };

}


export async function editPost({habitId=null,postId,description,images}:PostForm){
  const userId = await getUserId()
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      habit_id: habitId,
      content: description,
      image_urls: images, // this is key
    })
    .eq("id", postId)
    .eq("user_id", userId);

  if (updateError) {
    console.error("Post update failed:", updateError.message);
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

//******************************************  Insights   **************************************/


type PostComment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  profile_pic: string | null;
};

export type PostWithDetails = {
  id: string;
  content: string;
  image_urls: string[] | null;
  created_at: string;
  reward_post: boolean;
  habit_name:string;
  comment_enable: boolean;
  user_id: string;
  habit_id: string | null;
  likeCount: number;
  commentCount: number;
  latestComment?: PostComment | null;
  likedByCurrentUser: boolean;
  user: {
    full_name: string | null;
    profile_pic: string | null;
  };
};

export async function getPostsWithDetails({
  page = 1,
  pageSize = 10,
  // currentUserId,
}: {
  page?: number;
  pageSize?: number;
  // currentUserId: string;
}): Promise<PostWithDetails[]> {
  const currentUserId = await getUserId()
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // ✅ Clean select (NO aggregate + field mix)
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_urls,
      comment_enable,
      reward_post,
      created_at,
      user_id,
      habit_id,
      habit(habit_name),
      post_likes(user_id),
      post_comments (
        id,
        content,
        created_at,
        user_id
      )
    `)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (postError || !posts) {
    console.error("Error fetching posts:", postError);
    return [];
  }

  const userIds = [...new Set(posts.map((p: any) => p.user_id))];

  const { data: profiles, error: profileError } = await supabase
    .from("profile")
    .select("id, full_name, profile_pic")
    .in("id", userIds);

  if (profileError || !profiles) {
    console.error("Error fetching profiles:", profileError);
    return [];
  }

  const profileMap = new Map<string, Profile>(
    profiles.map((p) => [p.id, p])
  );

  return posts.map((post: any): PostWithDetails => {
    const actualComments = (post.post_comments ?? []).filter(
      (c: any) => typeof c === "object" && "id" in c
    ) as PostComment[];

    const latestComment = actualComments.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0];

    const likeCount = post.post_likes?.length ?? 0;
    const commentCount = actualComments.length ?? 0;

    const likedByCurrentUser = post.post_likes?.some(
      (like: { user_id: string }) => like.user_id === currentUserId
    ) ?? false;

    const userProfile = profileMap.get(post.user_id);

    return {
      id: post.id,
      content: post.content,
      image_urls: post.image_urls,
      reward_post: post.reward_post,
      created_at: post.created_at,
      habit_name: post.habit?.habit_name ?? null,
      comment_enable: post.comment_enable,
      user_id: post.user_id,
      habit_id: post.habit_id,
      likeCount,
      commentCount,
      latestComment: latestComment ?? null,
      likedByCurrentUser,
      user: {
        full_name: userProfile?.full_name ?? null,
        profile_pic: userProfile?.profile_pic ?? null,
      },
    };
  });
}


export async function getCurrentUserPostsWithDetails({
  page = 1,
  pageSize = 10,
  currentUserId,
}: {
  page?: number;
  pageSize?: number;
  currentUserId: string;
}): Promise<PostWithDetails[]> {
  // const currentUserId = await getUserId()
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // ✅ Clean select (NO aggregate + field mix)
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_urls,
      reward_post,
      comment_enable,
      created_at,
      user_id,
      habit_id,
       habit(habit_name),
      post_likes(user_id),
      post_comments (
        id,
        content,
        created_at,
        user_id
      )
    `)
    .eq('user_id', currentUserId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (postError || !posts) {
    console.error("Error fetching posts:", postError);
    return [];
  }

  const userIds = [...new Set(posts.map((p: any) => p.user_id))];

  const { data: profiles, error: profileError } = await supabase
    .from("profile")
    .select("id, full_name, profile_pic")
    .in("id", userIds);

  if (profileError || !profiles) {
    console.error("Error fetching profiles:", profileError);
    return [];
  }

  const profileMap = new Map<string, Profile>(
    profiles.map((p) => [p.id, p])
  );

  return posts.map((post: any): PostWithDetails => {
    const actualComments = (post.post_comments ?? []).filter(
      (c: any) => typeof c === "object" && "id" in c
    ) as PostComment[];

    const latestComment = actualComments.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0];

    const likeCount = post.post_likes?.length ?? 0;
    const commentCount = actualComments.length ?? 0;

    const likedByCurrentUser = post.post_likes?.some(
      (like: { user_id: string }) => like.user_id === currentUserId
    ) ?? false;

    const userProfile = profileMap.get(post.user_id);

    return {
      id: post.id,
      content: post.content,
      image_urls: post.image_urls,
      created_at: post.created_at,
      reward_post: post.reward_post,
      comment_enable: post.comment_enable,
      habit_name: post.habit?.habit_name??null,
      user_id: post.user_id,
      habit_id: post.habit_id,
      likeCount,
      commentCount,
      latestComment: latestComment ?? null,
      likedByCurrentUser,
      user: {
        full_name: userProfile?.full_name ?? null,
        profile_pic: userProfile?.profile_pic ?? null,
      },
    };
  });
}

export async function toggleLikePost(postId: string): Promise<"liked" | "unliked" | "error"> {
  const userId = await getUserId()
  // Step 1: Check if the like already exists
  const { data: existingLike, error: fetchError } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single(); // Only one should exist due to unique constraint

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to check like status:", fetchError.message);
    return "error";
  }

  // Step 2: If exists → Unlike (delete it)
  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Failed to unlike post:", deleteError.message);
      return "error";
    }

    return "unliked";
  }

  // Step 3: If not exists → Like (insert)
  const { error: insertError } = await supabase
    .from("post_likes")
    .insert([
      {
        post_id: postId,
        user_id: userId,
        liked_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    console.error("Failed to like post:", insertError.message);
    return "error";
  }

  return "liked";
}


export async function setCommentEnabled(postId: string, enabled: boolean) {
  const { data, error } = await supabase
    .from("posts")
    .update({ comment_enable: enabled })
    .eq("id", postId)
    .select(); // optional: returns updated row(s)

  if (error) {
    console.error("Error updating comment status:", error.message);
    throw error;
  }

  return data; // optional
}




// Helper to extract path from public URL
function getStoragePathFromUrl(url: string): string {
  const match = url.match(/\/post-images\/(.+)$/);
  return match?.[1] ?? "";
}

export async function deletePost(postId: string) {
  console.log("the post id==>",postId);
  const userId = await getUserId()
  
  // Step 1: Fetch image URLs from the post
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("image_urls")
    .eq("id", postId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch post:", fetchError.message);
    throw fetchError;
  }

  // Step 2: Delete images from storage if any
  if (post?.image_urls?.length) {
    const pathsToDelete = post.image_urls.map(getStoragePathFromUrl);
    // console.log("pathsToDelete==>",pathsToDelete);
    

    const { error: deleteError,data } = await supabase
      .storage
      .from("post-images")
      .remove(pathsToDelete);
    // console.log("deleted data==>",data);
    
    if (deleteError) {
      console.error("Failed to delete images:", deleteError.message);
      throw deleteError;
    }
  }

  // Step 3: Delete the post itself
  const { error: deletePostError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq('user_id',userId);

  if (deletePostError) {
    console.error("Failed to delete post:", deletePostError.message);
    throw deletePostError;
  }

  return true;
}



type PostCommentInput = {
  postId: string;
  content: string;
  parentCommentId?: string; // optional for nested comments
};

export async function postComment({ postId, content, parentCommentId }: PostCommentInput) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");

    const { data, error } = await supabase.from("post_comments").insert([
      {
        post_id: postId,
        content,
        user_id: userId,
        parent_comment_id: parentCommentId ?? null,
      },
    ]).select("*").single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error posting comment:", error.message);
    return { success: false, error: error.message };
  }
}



export async function toggleCommentLike(commentId: string) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "User not logged in" };

  const { data: existingLike, error: findError } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError) return { success: false, error: findError.message };

  if (existingLike) {
    // Unlike
    const { error: deleteError } = await supabase
      .from("comment_likes")
      .delete()
      .eq("id", existingLike.id);
    if (deleteError) return { success: false, error: deleteError.message };
    return { success: true, liked: false };
  } else {
    // Like
    const { error: insertError } = await supabase.from("comment_likes").insert([
      {
        comment_id: commentId,
        user_id: userId,
      },
    ]);
    if (insertError) return { success: false, error: insertError.message };
    return { success: true, liked: true };
  }
}



// types.ts
export interface PostCommentDetails {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_comment_id: string | null;
  full_name: string;
  profile_pic: string | null;
  like_count: number;
  liked_by_me: boolean;
  children: PostCommentDetails[];
}



const PAGE_SIZE = 10;

export async function getPaginatedNestedComments(
  postId: string,
  page: number,
  // currentUserId: string
): Promise<PostCommentDetails[]> {
  const currentUserId = await getUserId()??"";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

 const baseSelect = `
  id,
  content,
  created_at,
  user_id,
  parent_comment_id,
  profile:profile (
    full_name,
    profile_pic
  ),
  comment_likes (
    id
  ),
  liked_by_me:comment_likes!comment_likes_comment_id_fkey (
    user_id
  )
`;


  // 1. Fetch top-level comments
  const { data: topLevel, error: topError } = await supabase
    .from("post_comments")
    .select(baseSelect)
    .eq("post_id", postId)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .range(from, to)
    .eq("comment_likes.user_id", currentUserId)
    .eq("liked_by_me.user_id", currentUserId);

  if (topError){
    console.log("topError==>",topError);
    
     throw topError;}

  const topIds = topLevel.map((c) => c.id);

  // 2. Fetch children
  const { data: replies, error: childError } = await supabase
    .from("post_comments")
    .select(baseSelect)
    .eq("post_id", postId)
    .in("parent_comment_id", topIds)
    .order("created_at", { ascending:false })
    .eq("comment_likes.user_id", currentUserId)
    .eq("liked_by_me.user_id", currentUserId);

  if (childError){ 
    console.log("childError==>",childError);
    
    throw childError};

  // 3. Normalize
  const allComments = [...topLevel, ...replies].map((c: any) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    user_id: c.user_id,
    parent_comment_id: c.parent_comment_id,
    full_name: c.profile?.full_name  ?? "Anonymous",
    profile_pic:  c.profile?.profile_pic ?? null,
    like_count: c.comment_likes?.length ?? 0,
    liked_by_me: Array.isArray(c.liked_by_me) && c.liked_by_me.length > 0,
    children: [] as PostCommentDetails[],
  }));

  const map = new Map<string, PostCommentDetails>();
  allComments.forEach((c) => map.set(c.id, c));

  const nested: PostCommentDetails[] = [];
  allComments.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id);
      if (parent) parent.children.push(comment);
    } else {
      nested.push(comment);
    }
  });

  return nested;
}

