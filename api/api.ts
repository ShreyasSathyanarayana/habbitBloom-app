import { supabase } from "@/utils/SupaLegend";
import { DateUtils } from "@/utils/constants";
import { getUserId } from "@/utils/persist-storage";
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
  const todayStr = today.toISOString().split("T")[0];

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
  const userId = await getUserId();

  // Fetch habit details
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency, end_date")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Normalize `created_at` and `end_date`
  const habitCreatedAt = new Date(habitData.created_at);
  habitCreatedAt.setUTCHours(0, 0, 0, 0);

  let endDate = habitData.end_date ? new Date(habitData.end_date) : null;
  if (endDate) endDate.setUTCHours(0, 0, 0, 0);

  // Parse frequency (e.g., [0,1,2] for Sunday, Monday, Tuesday)
  const frequencyDays: number[] = habitData.frequency || [];

  // Fetch habit progress
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (progressError) {
    console.error("Error fetching habit progress:", progressError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Store progress in a Map for quick lookup
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    const formattedDate = entry.date.split("T")[0]; // Normalize format
    progressMap.set(formattedDate, entry.status);
  });

  // 🔹 Fetch Archive Logs to determine active periods
  const { data: archiveLogs, error: archiveError } = await supabase
    .from("habit_archive_log")
    .select("action, action_date")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("action_date", { ascending: true });

  if (archiveError) {
    console.error("Error fetching archive logs:", archiveError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Convert archive log dates to a sorted list of events
  let isActive = true; // By default, habit is active
  let archiveEvents: { date: Date; action: string }[] = archiveLogs.map(
    (log) => ({
      date: new Date(log.action_date),
      action: log.action,
    })
  );

  // 🔹 Initialize tracking variables
  let completedCount = 0;
  let notCompletedCount = 0;
  let currentStreak = 0;
  let highestStreak = 0;

  // Normalize today's date to UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const lastDate = endDate && endDate < today ? endDate : today; // Use `end_date` if it's earlier

  let currentDate = new Date(habitCreatedAt);
  let lastCompletedDate: Date | null = null;
  let lastScheduledCompleted = false; // Tracks if the last scheduled habit day was completed

  // Process archive events sequentially while iterating
  let archiveIndex = 0;

  while (currentDate <= lastDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay();

    // Process archive/unarchive logs dynamically
    while (
      archiveIndex < archiveEvents.length &&
      archiveEvents[archiveIndex].date <= currentDate
    ) {
      isActive = archiveEvents[archiveIndex].action === "restored";
      archiveIndex++;
    }

    // Skip days when habit was archived
    if (!isActive) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      continue;
    }

    if (!frequencyDays.includes(dayOfWeek)) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      continue;
    }

    if (progressMap.has(dateString)) {
      if (progressMap.get(dateString)) {
        completedCount++;
        lastScheduledCompleted = true; // ✅ Mark last scheduled day as completed

        // If lastCompletedDate is the previous scheduled habit day, increment streak
        if (lastCompletedDate && lastScheduledCompleted) {
          currentStreak++;
        } else {
          currentStreak = 1; // Reset to 1 for a new streak
        }

        highestStreak = Math.max(highestStreak, currentStreak);
        lastCompletedDate = new Date(currentDate);
      } else {
        notCompletedCount++;
        lastScheduledCompleted = false; // ❌ No completion on a past scheduled day
        currentStreak = 0; // Streak breaks on an explicitly marked failure
      }
    } else {
      if (currentDate < today) {
        notCompletedCount++;
        lastScheduledCompleted = false; // ❌ Last scheduled day was not completed
        currentStreak = 0; // Streak breaks on an uncompleted past day
      }
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
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

export const getAllHabits = async (sortBy: "latest" | "alphabetical") => {
  const userId = await getUserId();
  const todayUtc = DateUtils.getCurrentUtcDate();

  let query = supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .or(`end_date.gte.${todayUtc},end_date.is.null`);

  // Apply sorting based on the parameter
  if (sortBy === "latest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "alphabetical") {
    query = query.order("habit_name", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching habits:", error);
    throw new Error("Error fetching habits: " + error.message);
  }

  // 🔹 Fetch last 7 days' progress for each habit
  const habitsWithProgress = await Promise.all(
    data.map(async (habit) => {
      const progressData = await fetchLast7DaysHabitProgress(habit.id);
      return {
        ...habit,
        progress: progressData ? progressData.data : [],
      };
    })
  );

  return habitsWithProgress;
};

export const getAllHabitsArchived = async () => {
  const todayUtc = DateUtils.getCurrentUtcDate();
  const userId = await getUserId();

  // Fetch all habits for the user
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

  return data;
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
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("habit")
    .select("*")
    .eq("user_id", userId)
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
  // Get today's local date (start of the day)
  const todayLocal = DateUtils.getCurrentLocalDate();

  // Calculate the start date (6 days before today)
  const startOfRange = moment().subtract(6, "days").format("YYYY-MM-DD");

  // Fetch habit creation date & frequency
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit details:", habitError);
    return null;
  }

  const habitStartDate = DateUtils.convertUtcToLocalDate(habitData.created_at);

  const frequencyDays: number[] = habitData.frequency || [];

  // Fetch last active date using stored procedure
  const { data: fetchedLastActiveDate, error: lastActiveError } =
    await supabase.rpc("get_last_active_date", { habit_id: habitId });

  if (lastActiveError) {
    console.error("Error fetching last active date:", lastActiveError);
    return null;
  }

  let lastActiveDate: string | null = fetchedLastActiveDate
    ? DateUtils.convertUtcToLocalDate(fetchedLastActiveDate)
    : null;

  // 🔹 Fetch archive & restore history
  const { data: archiveLog, error: archiveError } = await supabase
    .from("habit_archive_log")
    .select("action, action_date")
    .eq("habit_id", habitId)
    .order("action_date", { ascending: true }); // Get actions in order

  if (archiveError) {
    console.error("Error fetching habit archive log:", archiveError);
    return null;
  }

  let isArchived = false;
  let validActivePeriods: { start: string; end: string | null }[] = [];
  let currentStart: string | null = habitStartDate;

  for (const entry of archiveLog) {
    const actionDate = DateUtils.convertUtcToLocalDate(entry.action_date);

    if (entry.action === "archived") {
      if (!isArchived) {
        if (currentStart) {
          validActivePeriods.push({ start: currentStart, end: actionDate });
        }
        isArchived = true;
      }
    } else if (entry.action === "restored") {
      if (isArchived) {
        currentStart = actionDate;
        isArchived = false;
      }
    }
  }

  // If still active, keep tracking
  if (!isArchived && currentStart) {
    validActivePeriods.push({ start: currentStart, end: null }); // End is null = active till today
  }

  // Fetch habit progress
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfRange)
    .lte("date", todayLocal);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  const progressMap = new Map(
    progressData.map((entry) => [
      DateUtils.convertUtcToLocalDate(entry.date),
      entry.status,
    ])
  );

  // Generate last 7 days list
  const result: HabitProgressEntry[] = [];
  let currentDate = moment(startOfRange);

  while (currentDate.isSameOrBefore(todayLocal)) {
    const dateString = currentDate.format("YYYY-MM-DD");
    const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday

    let status: boolean | null = null;

    // Check if the date is within any valid active period
    const isWithinActivePeriod = validActivePeriods.some(({ start, end }) => {
      return dateString >= start && (!end || dateString <= end);
    });

    if (!isWithinActivePeriod) {
      status = null; // Ignore if outside active period
    } else if (!frequencyDays.includes(dayOfWeek)) {
      status = null; // Not a habit day
    } else {
      status = progressMap.get(dateString) ?? false; // Use progress data or default to false
    }

    result.push({ date: dateString, status });
    currentDate.add(1, "day"); // Move to next day
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
  // Get today's date and normalize to UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Fetch habit details including created_at and frequency
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return null;
  }

  // Convert habit creation date to midnight UTC
  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setUTCHours(0, 0, 0, 0);

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
    const actionDate = new Date(log.action_date);
    actionDate.setUTCHours(0, 0, 0, 0);

    if (log.action === "archived") {
      lastArchiveStart = actionDate;
    } else if (log.action === "restored" && lastArchiveStart) {
      archivePeriods.push({ start: lastArchiveStart, end: actionDate });
      lastArchiveStart = null;
    }
  });

  // If the last action was "archived" but never restored, mark as still archived
  if (lastArchiveStart) {
    archivePeriods.push({ start: lastArchiveStart, end: null });
  }

  // Fetch habit progress
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", habitStartDate.toISOString().split("T")[0])
    .lte("date", today.toISOString().split("T")[0]); // Track up to today

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(
    progressData.map((entry) => [entry.date, entry.status])
  );

  // Generate progress list, excluding archived periods
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(habitStartDate);

  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay();

    // Check if the date falls within an archived period
    const archiveRecord = archivePeriods.find(
      ({ start, end }) =>
        currentDate >= start && (end === null || currentDate < end)
    );

    let status: boolean | null = null;
    let completed = false;

    if (frequencyDays.includes(dayOfWeek)) {
      if (progressMap.has(dateString)) {
        status = progressMap.get(dateString)!;
        completed = status === true;
      } else {
        status = false; // Default to false for missing records
      }

      // Check if archived **after** completion
      if (archiveRecord) {
        const archiveStart = archiveRecord.start.toISOString().split("T")[0];

        if (dateString === archiveStart) {
          // If the habit was **completed** before archive, keep the completed status
          completed =
            progressMap.has(dateString) && progressMap.get(dateString) === true;
        } else {
          status = null; // Mark as archived
        }
      }

      result.push({ date: dateString, status });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to next day
  }

  return { habitId, data: result };
};

export const getCompletedHabitStats = async (habitId: string) => {
  const userId = await getUserId();

  // Fetch habit progress directly from habit_progress table
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
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
  // Get today's date and normalize to UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Get the first and last day of the current month
  const startOfMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
  );
  const endOfMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0)
  );

  // Fetch habit progress for the current month
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfMonth.toISOString().split("T")[0]) // ✅ Always from the 1st
    .lte("date", endOfMonth.toISOString().split("T")[0]);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(
    progressData.map((entry) => [entry.date, entry.status])
  );

  // Generate full month's dates (from 1st to last day)
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(startOfMonth);

  while (currentDate <= endOfMonth) {
    const dateString = currentDate.toISOString().split("T")[0];

    // Check if progress exists; otherwise, set default to `false`
    let status: boolean = progressMap.get(dateString) ?? false;

    result.push({ date: dateString, status });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to next day
  }

  return { habitId, data: result };
};

export const fetchWeeklyHabitProgressForYear = async (
  habitId: string
): Promise<{ week: string; completed: number }[]> => {
  const today = new Date();
  const startOfYear = new Date(today.getUTCFullYear(), 0, 1);
  const endOfYear = new Date(today.getUTCFullYear(), 11, 31);

  // Fetch habit progress for the current year
  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfYear.toISOString().split("T")[0])
    .lte("date", endOfYear.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Map to store weekly progress
  const weeklyProgress: Record<string, number> = {};

  // Generate weekly labels for the year (starting from Sunday)
  let currentWeekStart = new Date(startOfYear);
  currentWeekStart.setUTCDate(
    startOfYear.getUTCDate() - startOfYear.getUTCDay()
  );

  while (currentWeekStart <= endOfYear) {
    const weekLabel = `${currentWeekStart.toLocaleString("en-US", {
      month: "short",
    })} ${currentWeekStart.getUTCDate()}`;
    weeklyProgress[weekLabel] = 0;
    currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7);
  }

  // Process progress data
  for (const entry of progressData) {
    const entryDate = new Date(entry.date);
    entryDate.setUTCHours(0, 0, 0, 0);

    // Get the Sunday of that week (week start)
    const weekStart = new Date(entryDate);
    weekStart.setUTCDate(entryDate.getUTCDate() - entryDate.getUTCDay());

    const weekLabel = `${weekStart.toLocaleString("en-US", {
      month: "short",
    })} ${weekStart.getUTCDate()}`;

    if (weeklyProgress[weekLabel] !== undefined) {
      weeklyProgress[weekLabel] += entry.status ? 1 : 0;
    }
  }

  // Convert the object to an array
  return Object.keys(weeklyProgress).map((week) => ({
    week,
    completed: weeklyProgress[week],
  }));
};

export const fetchMonthlyHabitProgressForYear = async (
  habitId: string
): Promise<{ month: string; completed: number }[]> => {
  const today = new Date();
  const startOfYear = new Date(today.getUTCFullYear(), 0, 1);
  const endOfYear = new Date(today.getUTCFullYear(), 11, 31);

  // Fetch habit progress for the current year
  const { data: progressData, error } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfYear.toISOString().split("T")[0])
    .lte("date", endOfYear.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching habit progress:", error);
    return [];
  }

  // Initialize months with zero completed count
  const monthlyProgress: Record<string, number> = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  // Process progress data
  for (const entry of progressData) {
    const entryDate = new Date(entry.date);
    const monthLabel = entryDate.toLocaleString("en-US", { month: "short" });

    if (entry.status) {
      monthlyProgress[monthLabel] += 1;
    }
  }

  // Convert to an array
  return Object.keys(monthlyProgress).map((month) => ({
    month,
    completed: monthlyProgress[month],
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

  // Fetch habit details
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

  // Parse dates
  const habitCreatedAt = new Date(habitData.created_at);
  habitCreatedAt.setUTCHours(0, 0, 0, 0);

  let habitEndDate = habitData.end_date
    ? new Date(habitData.end_date)
    : new Date();
  habitEndDate.setUTCHours(0, 0, 0, 0);

  // Fetch habit progress
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("date", habitCreatedAt.toISOString().split("T")[0])
    .lte("date", habitEndDate.toISOString().split("T")[0]);

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return { completed: 0, pending: 0 };
  }

  // Parse frequency (e.g., [0,1,2] where 0=Sunday, ..., 6=Saturday)
  const frequencyDays: number[] = habitData.frequency || [];

  // Store progress in a Map
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    progressMap.set(entry.date.split("T")[0], entry.status);
  });

  let completedCount = 0,
    pendingCount = 0;
  let currentDate = new Date(habitCreatedAt);

  // Iterate from habit creation date to end date
  while (currentDate <= habitEndDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay();

    // Count only if the day matches the habit's scheduled frequency
    if (frequencyDays.includes(dayOfWeek)) {
      if (progressMap.has(dateString)) {
        if (progressMap.get(dateString)) completedCount++;
        else pendingCount++;
      } else if (currentDate < new Date()) {
        pendingCount++; // Mark as pending if no record exists for past days
      }
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return { completed: completedCount, pending: pendingCount };
};

export const getCompletedAndPendingDays = async (habitId: string) => {
  const userId = await getUserId();

  // Fetch habit details
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, end_date, frequency")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit data:", habitError);
    return { completedDays: 0, pendingDays: 0 };
  }

  // Parse dates
  const habitCreatedAt = new Date(habitData.created_at);
  habitCreatedAt.setUTCHours(0, 0, 0, 0);

  let habitEndDate = habitData.end_date
    ? new Date(habitData.end_date)
    : new Date();
  habitEndDate.setUTCHours(0, 0, 0, 0);

  // Fetch completed habit progress
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("date", habitCreatedAt.toISOString().split("T")[0])
    .lte("date", habitEndDate.toISOString().split("T")[0]);

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return { completedDays: 0, pendingDays: 0 };
  }

  // Parse frequency (e.g., [0,1,2] where 0=Sunday, ..., 6=Saturday)
  const frequencyDays: number[] = habitData.frequency || [];

  // Store progress in a Map for quick lookup
  const completedDaysSet = new Set<string>();
  progressData.forEach((entry) => {
    if (entry.status) {
      completedDaysSet.add(entry.date.split("T")[0]);
    }
  });

  let completedDays = 0;
  let pendingDays = 0;
  let currentDate = new Date(habitCreatedAt);

  // Iterate from start date to end date
  while (currentDate <= habitEndDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay();

    // Check if the day matches the habit's scheduled frequency
    if (frequencyDays.includes(dayOfWeek)) {
      if (completedDaysSet.has(dateString)) {
        completedDays++; // Count as completed
      } else {
        pendingDays++; // Count as pending
      }
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
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



export const updateUserProfileInfo = async(fullName: string, profileBio: string)=>{
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
}