import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/utils/SupaLegend";

type CreateHabitSchema = {
  habitName: string;
  category: string;
  reminderTime: string;
  frequency: number[];
  notificationEnable: boolean;
  habitColor: string;
  googleNotificationEnable:boolean
};



export const createOrUpdateHabit = async (
  formData: CreateHabitSchema,
  habitId?: string // Optional: If provided, update instead of insert
) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error("Failed to fetch user: " + userError?.message);
  }

  const userId = userData.user.id;

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
    updated_at: new Date().toISOString(), // Always update timestamp
  };

  // Include 'id' only if updating an existing habit
  if (habitId) {
    habitData.id = habitId;
  }
  else{
    habitData.created_at = new Date().toISOString();
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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error("Failed to fetch user: " + userError?.message);
  }

  const userId = userData.user.id;

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



export const markHabitStatus = async (habitId: string, status: boolean, habitDate: string) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    throw { message: "Authentication error. Please log in again.", type: "danger" };
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // 🔹 Validate that habitDate is either today or yesterday
  if (habitDate !== todayStr ) {
    throw {
      message: "You can only update today's habit status",
      type: "warning",
    };
  }

  // 🔹 Fetch existing habit progress record
  const { data: existingRecord, error: fetchError } = await supabase
    .from("habit_progress")
    .select("id")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("date", habitDate)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching habit progress:", fetchError);
    throw { message: "Error fetching habit progress. Try again later.", type: "danger" };
  }

  // 🔹 Update if record exists, else insert
  if (existingRecord) {
    const { error: updateError } = await supabase
      .from("habit_progress")
      .update({ status })
      .eq("id", existingRecord.id);

    if (updateError) {
      console.error("Error updating habit status:", updateError);
      throw { message: "Failed to update habit. Try again later.", type: "danger" };
    }
  } else {
    const { error: insertError } = await supabase
      .from("habit_progress")
      .insert([
        {
          habit_id: habitId,
          user_id: user.id,
          date: habitDate,
          status,
        },
      ]);

    if (insertError) {
      console.error("Error inserting habit progress:", insertError);
      throw { message: "Failed to log habit progress. Try again later.", type: "danger" };
    }
  }

  return { success: true };
};





export const getHabitStreak = async (habitId: string) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return 0;
  }

  const { data, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
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
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Fetch habit details
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency, end_date")
    .eq("id", habitId)
    .eq("user_id", user.id)
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

  // Fetch progress data
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Store progress in a Map for quick lookup
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    const formattedDate = entry.date.split("T")[0]; // Normalize format
    progressMap.set(formattedDate, entry.status);
  });

  // 🔹 Initialize tracking variables
  let completedCount = 0;
  let notCompletedCount = 0;
  let streak = 0;
  let highestStreak = 0;
  let currentStreak = 0;
  let lastCompletedDate: string | null = null;

  // Normalize today's date to UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const lastDate = endDate && endDate < today ? endDate : today; // Use `end_date` if it's earlier

  let currentDate = new Date(habitCreatedAt);

  while (currentDate <= lastDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay();

    // Skip if not a habit day
    if (!frequencyDays.includes(dayOfWeek)) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      continue;
    }

    if (progressMap.has(dateString)) {
      if (progressMap.get(dateString)) {
        completedCount++;
        currentStreak++;
        highestStreak = Math.max(highestStreak, currentStreak);
        lastCompletedDate = dateString; // Update last completed day
      } else {
        notCompletedCount++;
        currentStreak = 0; // Reset streak if a day is explicitly marked not completed
      }
    } else {
      if (currentDate < today) {
        notCompletedCount++;
        currentStreak = 0; // Reset streak
      }
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  // ✅ Fix: Don't double count today's completion
  const todayString = today.toISOString().split("T")[0];
  const todayDayOfWeek = today.getUTCDay();

  if (frequencyDays.includes(todayDayOfWeek)) {
    if (progressMap.has(todayString)) {
      if (progressMap.get(todayString)) {
        completedCount++;
        // Streak should **only** increase if yesterday was also completed
        if (!lastCompletedDate || lastCompletedDate === todayString) {
          currentStreak = 1; // Ensure streak starts at 1 for first-time habits
        } else {
          currentStreak++;
        }
        highestStreak = Math.max(highestStreak, currentStreak);
      } else {
        notCompletedCount++;
        currentStreak = 0;
      }
    }
  }

  return { completed: completedCount, notCompleted: notCompletedCount, streak: currentStreak, highestStreak };
};









export const getHabitsByDate = async (date: string) => {
  // Get the currently authenticated user
  const { data: userData, error: userIdError } = await supabase.auth.getUser();

  if (userIdError || !userData?.user) {
    console.error("Error fetching user:", userIdError);
    return [];
  }

  const userId = userData.user.id;

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


export const getAllHabits = async () => {
  // Get the currently authenticated user
  const { data: userData, error: userIdError } = await supabase.auth.getUser();

  if (userIdError || !userData?.user) {
    console.error("Error fetching user:", userIdError);
    return [];
  }

  const userId = userData.user.id;

  // Fetch all habits for the user
  const { data, error } = await supabase
    .from("habit")
    .select(
      `
      id, habit_name, category, reminder_time, frequency, habit_color, created_at,archived
    `
    )
    .eq("user_id", userId)
    .eq("archived", false)
    .order("reminder_time", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  return data;
};

  export const getAllHabitsArchived = async () => {
    // Get the currently authenticated user
    const { data: userData, error: userIdError } = await supabase.auth.getUser();

    if (userIdError || !userData?.user) {
      console.error("Error fetching user:", userIdError);
      return [];
    }

    const userId = userData.user.id;

    // Fetch all habits for the user
    const { data, error } = await supabase
      .from("habit")
      .select(
        `
        id, habit_name, category, reminder_time, frequency, habit_color, created_at,archived
      `
      )
      .eq("user_id", userId)
      .eq("archived", true)
      .order("reminder_time", { ascending: true });

    if (error) {
      console.error("Error fetching habits:", error);
      return [];
    }

    return data;
  }

export const archiveHabit = async (habitId: string): Promise<boolean> => {
  const archiveDate = new Date().toISOString();

  // 1️⃣ Fetch user ID
  const { data, error: userIdError } = await supabase.auth.getUser();
  if (userIdError || !data?.user?.id) {
    console.error("Error fetching user ID:", userIdError);
    return false;
  }
  const userId = data.user.id;

  // 2️⃣ Fetch last active date using RPC
  let lastActiveDate: string | null = null;
  const { data: fetchedLastActiveDate, error: lastActiveError } = await supabase
  .rpc("get_last_active_date", { habit_id: habitId });

  if (lastActiveError) {
    console.warn("Error fetching last active date, proceeding without it:", lastActiveError);
  } else if (typeof fetchedLastActiveDate === "string") {
    lastActiveDate = fetchedLastActiveDate; // Ensure it's a valid string
  } else {
    console.warn("Unexpected format for last active date, proceeding without it:", fetchedLastActiveDate);
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
  const { error: logError } = await supabase
    .from("habit_archive_log")
    .insert([
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
  const restoreDate = new Date().toISOString();

  // 1️⃣ Fetch user ID
  const { data, error: userIdError } = await supabase.auth.getUser();
  if (userIdError || !data?.user?.id) {
    console.error("Error fetching user ID:", userIdError);
    return false;
  }
  const userId = data.user.id;

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
  const { error: logError } = await supabase
    .from("habit_archive_log")
    .insert([
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
  const { data: userData, error: userIdError } = await supabase.auth.getUser();

  if (userIdError || !userData?.user) {
    console.error("Error fetching user:", userIdError?.message || "User not found");
    return null; // Return `null` instead of an empty array when there's an error
  }

  const userId = userData.user.id;
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
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Calculate the start date (6 days before today)
  const startOfRange = new Date(today);
  startOfRange.setUTCDate(today.getUTCDate() - 6);

  // Fetch habit creation date & frequency
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at, frequency")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit creation timestamp:", habitError);
    return null;
  }

  // Convert `created_at` (already in ISO format) to Date object
  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setUTCHours(0, 0, 0, 0);

  // Parse frequency (array like [0, 2, 4])
  const frequencyDays: number[] = habitData.frequency || [];

  // 🔹 Fetch last active date using stored procedure
  const { data: fetchedLastActiveDate, error: lastActiveError } = await supabase
    .rpc("get_last_active_date", { habit_id: habitId });

  if (lastActiveError) {
    console.error("Error fetching last active date:", lastActiveError);
    return null;
  }

  let lastActiveDate: Date | null = fetchedLastActiveDate
    ? new Date(fetchedLastActiveDate)
    : null;

  if (lastActiveDate) {
    lastActiveDate.setUTCHours(0, 0, 0, 0);
  }

  // Fetch habit progress
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfRange.toISOString().split("T")[0])
    .lte("date", today.toISOString().split("T")[0]);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  const progressMap = new Map(progressData.map(entry => [entry.date, entry.status]));

  // Generate last 7 days list
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(startOfRange);

  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

    let status: boolean | null = null;

    // 1️⃣ Ensure date is **after or equal to habit creation date**
    if (dateString < habitData.created_at.split("T")[0]) {
      status = null;
    }
    // 2️⃣ Check if within last active range
    else if (lastActiveDate && dateString > lastActiveDate.toISOString().split("T")[0]) {
      status = null; // Ignore progress after last active date
    }
    // 3️⃣ Ensure 'false' is assigned only if it's a habit day
    else if (!frequencyDays.includes(dayOfWeek)) {
      status = null; // Not a habit day
    } 
    // 4️⃣ Use progress data or default to false
    else {
      status = progressMap.get(dateString) ?? false;
    }

    result.push({ date: dateString, status });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return { habitId, data: result };
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
  // Get today's date and normalize to midnight (UTC)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Fetch habit's creation timestamp
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit creation timestamp:", habitError);
    return null;
  }

  // Convert the habit creation timestamp to a Date object and normalize to midnight (UTC)
  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setUTCHours(0, 0, 0, 0);

  // Fetch habit progress from habit creation till today
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", habitStartDate.toISOString().split("T")[0]) // Start from habit creation
    .lte("date", today.toISOString().split("T")[0]); // Up to today

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(progressData.map(entry => [entry.date, entry.status]));

  // Generate date range from habit creation to today
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(habitStartDate);

  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split("T")[0];

    let status: boolean | null = null;

    if (progressMap.has(dateString)) {
      // ✅ Use recorded status (true/false)
      status = progressMap.get(dateString)!;
    } else {
      // ✅ Default to false after habit creation
      status = false;
    }

    result.push({ date: dateString, status });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to next day
  }

  return { habitId, data: result };
};


export const getCompletedHabitStats = async (habitId: string) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return {
      completed: 0,
      notCompleted: 0,
      streak: 0,
      highestStreak: 0,
      weekly: { completed: 0, notCompleted: 0 },
      monthly: { completed: 0, notCompleted: 0 },
      yearly: { completed: 0, notCompleted: 0 },
    };
  }

  // Fetch habit creation date
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit creation date:", habitError);
    return {
      completed: 0,
      notCompleted: 0,
      streak: 0,
      highestStreak: 0,
      weekly: { completed: 0, notCompleted: 0 },
      monthly: { completed: 0, notCompleted: 0 },
      yearly: { completed: 0, notCompleted: 0 },
    };
  }

  // Convert habit creation timestamp to a proper date
  const habitCreatedAt = new Date(habitData.created_at);
  habitCreatedAt.setUTCHours(0, 0, 0, 0); // Normalize to midnight (UTC)

  // Fetch habit progress data
  const { data: progressData, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (fetchError) {
    console.error("Error fetching habit progress:", fetchError);
    return {
      completed: 0,
      notCompleted: 0,
      streak: 0,
      highestStreak: 0,
      weekly: { completed: 0, notCompleted: 0 },
      monthly: { completed: 0, notCompleted: 0 },
      yearly: { completed: 0, notCompleted: 0 },
    };
  }

  // Store progress in a Map for quick lookup
  const progressMap = new Map<string, boolean>();
  progressData.forEach((entry) => {
    const formattedDate = entry.date.split("T")[0]; // Ensure date format
    progressMap.set(formattedDate, entry.status);
  });

  // Initialize tracking variables
  let completedCount = 0, notCompletedCount = 0;
  let streak = 0, highestStreak = 0, currentStreak = 0;
  
  let weeklyCompleted = 0, weeklyNotCompleted = 0;
  let monthlyCompleted = 0, monthlyNotCompleted = 0;
  let yearlyCompleted = 0, yearlyNotCompleted = 0;

  // Get current date info
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - 6); // 7-day window

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  let currentDate = new Date(habitCreatedAt);

  // Iterate from habit creation date to today
  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split("T")[0];

    let isCompleted = false;
    let isCounted = false;

    if (progressMap.has(dateString)) {
      if (progressMap.get(dateString)) {
        completedCount++;
        isCompleted = true;
        currentStreak++;
        highestStreak = Math.max(highestStreak, currentStreak);
      } else {
        notCompletedCount++;
        currentStreak = 0;
      }
      isCounted = true;
    } else if (currentDate < today) {
      notCompletedCount++; // Default to false if no entry exists before today
      currentStreak = 0;
      isCounted = true;
    }

    // Check for weekly, monthly, and yearly count
    if (currentDate >= startOfWeek && currentDate <= today) {
      if (isCompleted) weeklyCompleted++;
      else if (isCounted) weeklyNotCompleted++;
    }

    if (currentDate >= startOfMonth && currentDate <= today) {
      if (isCompleted) monthlyCompleted++;
      else if (isCounted) monthlyNotCompleted++;
    }

    if (currentDate >= startOfYear && currentDate <= today) {
      if (isCompleted) yearlyCompleted++;
      else if (isCounted) yearlyNotCompleted++;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to next day
  }

  return {
    completed: completedCount,
    notCompleted: notCompletedCount,
    streak,
    highestStreak,
    weekly: { completed: weeklyCompleted, notCompleted: weeklyNotCompleted },
    monthly: { completed: monthlyCompleted, notCompleted: monthlyNotCompleted },
    yearly: { completed: yearlyCompleted, notCompleted: yearlyNotCompleted },
  };
};


