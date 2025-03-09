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
};

export const createHabit = async (formData: CreateHabitSchema) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("Error fetching user:", error);
    
    throw new Error("Failed to fetch user: " + error?.message);
  }
//   console.log("user id==>",user.id);
  

  const { data, error: insertError } = await supabase
    .from("habit")
    .insert([
      {
        user_id: user.id,
        habit_name: formData.habitName,
        category: formData.category,
        reminder_time: formData.reminderTime,
        frequency: formData.frequency,
        notification_enable: formData.notificationEnable,
        habit_color: formData.habitColor,
      },
    ])
    .select(); // Ensures inserted data is returned

  if (insertError) {
    console.log("Error inserting habit:", insertError);
    
    throw new Error("Failed to insert habit: " + insertError.message);
  }

  return data;
};


export const markHabitStatus = async (habitId: string, status: boolean) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return { success: false, error };
  }

  const today = new Date().toISOString().split("T")[0]; // Store YYYY-MM-DD format

  // Check if a record exists for today
  const { data: existingRecord, error: fetchError } = await supabase
    .from("habit_progress")
    .select("id")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // Ignore "PGRST116" error as it means no record found
    console.error("Error fetching habit progress:", fetchError);
    return { success: false, error: fetchError };
  }

  if (existingRecord) {
    // If record exists, update the status
    const { error: updateError } = await supabase
      .from("habit_progress")
      .update({ status })
      .eq("id", existingRecord.id);

    if (updateError) {
      console.error("Error updating habit status:", updateError);
      return { success: false, error: updateError };
    }
  } else {
    // If no record exists, insert a new one
    const { error: insertError } = await supabase
      .from("habit_progress")
      .insert([
        {
          habit_id: habitId,
          user_id: user.id,
          date: today,
          status,
        },
      ]);

    if (insertError) {
      console.error("Error inserting habit progress:", insertError);
      return { success: false, error: insertError };
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




export const getHabitsByFrequency = async (frequency:number) => {
  // Get the currently authenticated user
  const { data: userData, error: userIdError } = await supabase.auth.getUser();

  if (userIdError || !userData?.user) {
    console.error("Error fetching user:", userIdError);
    return [];
  }

  const userId = userData.user.id;

  // Query habits with progress status using a LEFT JOIN
  const { data, error } = await supabase
    .from("habit")
    .select(
      `
      id, habit_name, category, reminder_time, frequency, habit_color,
      habit_progress(status)
    `
    )
    .eq("user_id", userId)
    .contains("frequency", [frequency]) // Ensure the frequency array contains the given value
    .order("reminder_time", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  // Transform data to check if the habit is completed
  return data.map((habit:any) => ({
    ...habit,
    isCompleted: habit.habit_progress ? habit.habit_progress.status : false,
  }));
};
