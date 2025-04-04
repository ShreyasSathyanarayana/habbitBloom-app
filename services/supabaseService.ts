
import { supabase } from '@/utils/SupaLegend';
import { Habit } from './types';
import { getUserId } from '@/utils/persist-storage';
import { DateUtils } from '@/utils/constants';

export const fetchHabits = async (): Promise<Habit[]> => {
  const userId = await getUserId()
   const todayUtc = DateUtils.getCurrentUtcDate();
  const { data, error } = await supabase.from('habit').select('id,  habit_name, reminder_time').eq('notification_enable',true).eq('archived', false).eq("user_id", userId).or(`end_date.gte.${todayUtc},end_date.is.null`);;
  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }
  return data || [];
};

export const fetchHabitIds = async (): Promise<string[]> => {
  const userId = await getUserId();
   const todayUtc = DateUtils.getCurrentUtcDate();
  const { data, error } = await supabase.from('habit').select('id').eq('notification_enable',true).eq('archived', false).eq("user_id", userId).or(`end_date.gte.${todayUtc},end_date.is.null`);
  if (error) {
    console.error('Error fetching habit IDs:', error);
    return [];
  }
  return data ? data.map(habit => habit.id) : [];
};
