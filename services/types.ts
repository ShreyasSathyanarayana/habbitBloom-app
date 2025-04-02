export interface Habit {
  id: string;
   habit_name: string;
  reminder_time: string;
}

export type ScheduledNotifications = Record<string, string>;
