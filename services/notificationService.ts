import * as Notifications from 'expo-notifications';
// import * as SecureStore from 'expo-secure-store';
import { Habit, ScheduledNotifications } from './types';
import { storage } from '@/utils/storage';

export const notificationKey={
  scheduledNotifications: 'scheduledNotifications',
}

// Request notification permissions
export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Get stored notifications securely
const getStoredNotifications = (): ScheduledNotifications => {
  const data = storage.getString(notificationKey.scheduledNotifications);
  return data ? JSON.parse(data) : {};
};

// Save updated notifications securely
const saveStoredNotifications = (notifications: ScheduledNotifications): void => {
  // await SecureStore.setItemAsync('scheduledNotifications', JSON.stringify(notifications));
  storage.set(notificationKey.scheduledNotifications, JSON.stringify(notifications));
};

// Schedule a notification
export const scheduleNotification = async (habit: Habit): Promise<void> => {
  if (!(await requestPermissions())) return;

  const scheduledNotifications = getStoredNotifications();

  // Prevent duplicate notifications
  if (scheduledNotifications[habit.id]) {
    console.log(`Notification for "${habit.habit_name}" is already scheduled.`);
    return;
  }

  // Cancel previous notification if time changed
  if (scheduledNotifications[habit.id]) {
    await Notifications.cancelScheduledNotificationAsync(scheduledNotifications[habit.id]);
  }

  // Schedule new notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title: 'Progress Reminder', body: `Stay consistent! Your streak for ${habit.habit_name} is at ${habit.reminder_time} ` },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: parseInt(habit.reminder_time.split(':')[0], 10), 
      minute: parseInt(habit.reminder_time.split(':')[1], 10), 
    //   repeats: true,
    },
  });

  // Save new notification securely
  scheduledNotifications[habit.id] = notificationId;
 saveStoredNotifications(scheduledNotifications);

  console.log(`Scheduled notification for "${habit.habit_name}" at ${habit.reminder_time}`);
};

// Cancel a notification
export const cancelNotification = async (habitId: string): Promise<void> => {
  const scheduledNotifications = getStoredNotifications();

  if (scheduledNotifications[habitId]) {
    await Notifications.cancelScheduledNotificationAsync(scheduledNotifications[habitId]);
    delete scheduledNotifications[habitId];
   saveStoredNotifications(scheduledNotifications);
    console.log(`Cancelled notification for habit ID: ${habitId}`);
  }
};
