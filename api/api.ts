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

  const { data, error: fetchError } = await supabase
    .from("habit_progress")
    .select("date, status") // Fetch both date and status
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (fetchError) {
    console.error("Error fetching habit stats:", fetchError);
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  if (!data || data.length === 0) {
    return { completed: 0, notCompleted: 0, streak: 0, highestStreak: 0 };
  }

  // Count completed and not completed habits
  const completedCount = data.filter((entry) => entry.status === true).length;
  const notCompletedCount = data.filter((entry) => entry.status === false).length;

  // Calculate current streak and highest streak
  let streak = 0;
  let highestStreak = 0;
  let currentStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < data.length; i++) {
    const habitDate = new Date(data[i].date);
    habitDate.setHours(0, 0, 0, 0);

    if (habitDate.getTime() === currentDate.getTime() && data[i].status) {
      currentStreak++;
      streak = currentStreak;
      highestStreak = Math.max(highestStreak, currentStreak);
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (habitDate.getTime() === currentDate.getTime() - 86400000 && data[i].status) {
      currentStreak++;
      highestStreak = Math.max(highestStreak, currentStreak);
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (data[i].status) {
      currentStreak = 1;
      highestStreak = Math.max(highestStreak, currentStreak);
      currentDate = habitDate;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentStreak = 0;
      currentDate = habitDate;
    }
  }

  return { completed: completedCount, notCompleted: notCompletedCount, streak, highestStreak };
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


// *************************Analytics*************************




export interface HabitProgressEntry {
  date: string;
  status: boolean | null; // true = completed, false = not completed, null = no entry
}

export interface HabitProgressResponse {
  habitId: string;
  data: HabitProgressEntry[];
}
export const fetchYearlyHabitProgress = async (habitId: string): Promise<HabitProgressResponse | null> => {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();
  
  const startOfYear = new Date(`${currentYear}-01-01`);
  startOfYear.setHours(0, 0, 0, 0);

  const endOfYear = new Date(`${currentYear}-12-31`);
  endOfYear.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch habit's creation date
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit creation date:", habitError);
    return null;
  }

  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setHours(0, 0, 0, 0);

  // Fetch habit progress data for the whole year
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfYear.toISOString().split("T")[0])
    .lte("date", endOfYear.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(progressData.map(entry => [entry.date, entry.status]));

  // Generate the full year and fill missing days
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(startOfYear);

  while (currentDate <= endOfYear) {
    const dateString = currentDate.toISOString().split("T")[0];

    let status: boolean | null = null;

    // ✅ Before habit creation, status should be `null`
    if (currentDate < habitStartDate) {
      status = null;
    } 
    // ✅ Use existing status if available
    else if (progressMap.has(dateString)) {
      status = progressMap.get(dateString)!; // Use existing status (true/false)
    } 

    result.push({ date: dateString, status });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { habitId, data: result };
};


export interface HabitProgressEntry {
  date: string;
  status: boolean | null; // true = completed, false = not completed, null = no entry
}

export interface HabitProgressResponse {
  habitId: string;
  data: HabitProgressEntry[];
}

export const fetchMonthlyHabitProgress = async (habitId: string): Promise<HabitProgressResponse | null> => {
  // Get the current year and month dynamically
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based index

  // First and last day of the month
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch habit's creation date
  const { data: habitData, error: habitError } = await supabase
    .from("habit")
    .select("created_at")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    console.error("Error fetching habit creation date:", habitError);
    return null;
  }

  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setHours(0, 0, 0, 0);

  // Fetch habit progress data for the current month
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfMonth.toISOString().split("T")[0])
    .lte("date", endOfMonth.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(progressData.map(entry => [entry.date, entry.status]));

  // Generate the full month and fill missing days
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(startOfMonth);

  while (currentDate <= endOfMonth) {
    const dateString = currentDate.toISOString().split("T")[0];

    let status: boolean | null = null;

    // ✅ Before habit creation, status should be `null`
    if (currentDate < habitStartDate) {
      status = null;
    } 
    // ✅ Use existing status if available
    else if (progressMap.has(dateString)) {
      status = progressMap.get(dateString)!; // Use existing status (true/false)
    } 

    result.push({ date: dateString, status });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { habitId, data: result };
};




export interface HabitProgressEntry {
  date: string;
  status: boolean | null; // true = completed, false = not completed, null = no entry
}

export interface HabitProgressResponse {
  habitId: string;
  data: HabitProgressEntry[];
}

export const fetchWeeklyHabitProgress = async (habitId: string): Promise<HabitProgressResponse | null> => {
  // Get today's date and normalize time to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine the start (Monday) and end (Sunday) of the current week
  const currentDay = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Move to Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Sunday
  endOfWeek.setHours(23, 59, 59, 999);

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

  // Convert the timestamp to a date and normalize to midnight
  const habitStartDate = new Date(habitData.created_at);
  habitStartDate.setHours(0, 0, 0, 0);

  // Fetch habit progress for the current week
  const { data: progressData, error: progressError } = await supabase
    .from("habit_progress")
    .select("date, status")
    .eq("habit_id", habitId)
    .gte("date", startOfWeek.toISOString().split("T")[0])
    .lte("date", endOfWeek.toISOString().split("T")[0]);

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Convert progress data into a Map for quick lookup
  const progressMap = new Map(progressData.map(entry => [entry.date, entry.status]));

  // Generate the full week and ensure Monday starts first
  const result: HabitProgressEntry[] = [];
  let currentDate = new Date(startOfWeek);

  while (currentDate <= endOfWeek) {
    const dateString = currentDate.toISOString().split("T")[0];

    let status: boolean | null = null;

    // ✅ Before habit creation, status should be `null`
    if (currentDate < habitStartDate) {
      status = null;
    } 
    // ✅ Use existing status if available
    else if (progressMap.has(dateString)) {
      status = progressMap.get(dateString)!; // Use existing status (true/false)
    }

    result.push({ date: dateString, status });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // ✅ Ensure Monday is first and Sunday is last
  const orderedResult = result.sort((a, b) => {
    const dayA = new Date(a.date).getDay();
    const dayB = new Date(b.date).getDay();

    // Convert Sunday (0) to 7 so it appears last
    const adjustedDayA = dayA === 0 ? 7 : dayA;
    const adjustedDayB = dayB === 0 ? 7 : dayB;

    return adjustedDayA - adjustedDayB;
  });

  return { habitId, data: orderedResult };
};
