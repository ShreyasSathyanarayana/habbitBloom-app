
import { supabase } from '@/utils/SupaLegend';
import { Habit } from './types';
import { getUserId } from '@/utils/persist-storage';

export const fetchHabits = async (): Promise<Habit[]> => {
  const userId = await getUserId()
  const { data, error } = await supabase.from('habit').select('id,  habit_name, reminder_time').eq('archived', false).eq("user_id", userId);
  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }
  return data || [];
};

export const fetchHabitIds = async (): Promise<string[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('habit').select('id').eq('archived', false).eq("user_id", userId);
  if (error) {
    console.error('Error fetching habit IDs:', error);
    return [];
  }
  return data ? data.map(habit => habit.id) : [];
};
