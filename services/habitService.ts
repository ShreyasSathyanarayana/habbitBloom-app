import { fetchHabits, fetchHabitIds } from './supabaseService';
import { scheduleNotification, cancelNotification, notificationKey } from './notificationService';
import * as SecureStore from 'expo-secure-store';
import { storage } from '@/utils/storage';

// Schedule all habit notifications
export const syncHabitNotifications = async (): Promise<void> => {
  const habits = await fetchHabits();
  for (const habit of habits) {
    await scheduleNotification(habit);
  }
};

// Handle habit deletions
export const handleDeletedHabits = async (): Promise<void> => {
  const storedNotifications = JSON.parse(storage.getString(notificationKey.scheduledNotifications) || '{}');
  const currentHabitIds = await fetchHabitIds();

  for (const habitId of Object.keys(storedNotifications)) {
    if (!currentHabitIds.includes(habitId)) {
      await cancelNotification(habitId);
    }
  }
};

// Sync habits (Schedule & Remove Deleted)
export const syncHabits = async (): Promise<void> => {
  if(!storage.getString(notificationKey.scheduledNotifications)) {
  await syncHabitNotifications();
  await handleDeletedHabits();
  }
};
