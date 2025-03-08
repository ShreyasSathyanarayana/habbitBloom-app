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


export const markHabitAsCompleted = async (habitId: string) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return { success: false, error };
  }

  const { data, error: insertError } = await supabase
    .from("habit_progress")
    .upsert([
      {
        habit_id: habitId,
        user_id: user.id,
        date: new Date().toISOString().split("T")[0], // Store only YYYY-MM-DD
        status: true, // Marked as completed
      },
    ]);

  if (insertError) {
    console.error("Error marking habit as completed:", insertError);
    return { success: false, error: insertError };
  }

  return { success: true, data };
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
    .order("date", { ascending: false });

  if (fetchError) {
    console.error("Error fetching streak:", fetchError);
    return 0;
  }

  let streak = 0;
  let today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (let i = 0; i < data.length; i++) {
    const habitDate = new Date(data[i].date);
    if (habitDate.toDateString() === today.toDateString() || habitDate.toDateString() === yesterday.toDateString()) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
