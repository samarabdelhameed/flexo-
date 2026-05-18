/**
 * NotificationManager - Handles exercise reminders and notifications
 * Note: Notifications require native modules, not available in Expo Go
 * This is a stub implementation for compatibility
 */

export class NotificationManager {
  private hasPermission: boolean = false;

  constructor() {
    console.log('NotificationManager: Initialized (stub - notifications not available in Expo Go)');
  }

  async requestPermissions(): Promise<boolean> {
    console.warn('NotificationManager: Notifications not available in Expo Go');
    return false;
  }

  async scheduleExerciseReminder(title: string, body: string, seconds: number = 3600): Promise<string | null> {
    console.warn('NotificationManager: Notifications not available in Expo Go');
    return null;
  }

  async scheduleDailyReminder(): Promise<void> {
    console.warn('NotificationManager: Notifications not available in Expo Go');
  }

  async cancelAllNotifications(): Promise<void> {
    console.warn('NotificationManager: Notifications not available in Expo Go');
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    console.warn('NotificationManager: Notifications not available in Expo Go');
  }
}
