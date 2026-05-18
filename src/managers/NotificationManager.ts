/**
 * NotificationManager - Handles exercise reminders and notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationManager {
  private hasPermission: boolean = false;

  constructor() {
    this.requestPermissions();
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      this.hasPermission = finalStatus === 'granted';
      console.log('NotificationManager: Permission status:', finalStatus);
      return this.hasPermission;
    } catch (error) {
      console.error('NotificationManager: Error requesting permissions:', error);
      return false;
    }
  }

  async scheduleExerciseReminder(title: string, body: string, seconds: number = 3600): Promise<string | null> {
    if (!this.hasPermission) {
      console.warn('NotificationManager: No permission to send notifications');
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { type: 'exercise_reminder' },
        },
        trigger: { seconds },
      });

      console.log('NotificationManager: Scheduled notification:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('NotificationManager: Error scheduling notification:', error);
      return null;
    }
  }

  async scheduleDailyReminder(): Promise<void> {
    await this.scheduleExerciseReminder(
      'Time for your exercises! 💪',
      'Your daily physical therapy session is ready. Let\'s keep up the great progress!',
      24 * 60 * 60 // 24 hours
    );
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('NotificationManager: All notifications cancelled');
    } catch (error) {
      console.error('NotificationManager: Error cancelling notifications:', error);
    }
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    if (!this.hasPermission) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('NotificationManager: Error sending immediate notification:', error);
    }
  }
}