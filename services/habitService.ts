import { fetchHabits, fetchHabitIds } from './supabaseService';
import { scheduleNotification, cancelNotification } from './notificationService';
import * as SecureStore from 'expo-secure-store';

// Schedule all habit notifications
export const syncHabitNotifications = async (): Promise<void> => {
  const habits = await fetchHabits();
  for (const habit of habits) {
    await scheduleNotification(habit);
  }
};

// Handle habit deletions
export const handleDeletedHabits = async (): Promise<void> => {
  const storedNotifications = JSON.parse(await SecureStore.getItemAsync('scheduledNotifications') || '{}');
  const currentHabitIds = await fetchHabitIds();

  for (const habitId of Object.keys(storedNotifications)) {
    if (!currentHabitIds.includes(habitId)) {
      await cancelNotification(habitId);
    }
  }
};

// Sync habits (Schedule & Remove Deleted)
export const syncHabits = async (): Promise<void> => {
  await syncHabitNotifications();
  await handleDeletedHabits();
};
