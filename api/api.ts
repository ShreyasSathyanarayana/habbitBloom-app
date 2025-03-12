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
    .upsert([habitData], { onConflict: ["id"] }) // Conflict resolution
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
