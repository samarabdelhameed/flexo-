/**
 * UserProfileManager - Manages user profile and onboarding status
 * Similar to UserProfileManager.swift in Pep project
 * Note: Using in-memory storage instead of AsyncStorage (Expo Go limitation)
 */

const ONBOARDED_KEY = '@flexo_onboarded';
const USER_NAME_KEY = '@flexo_user_name';

// In-memory storage for Expo Go compatibility
const memoryStorage: { [key: string]: string } = {};

export class UserProfileManager {
  private onboarded: boolean = false;
  private userName: string = '';

  constructor() {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      const onboardedValue = memoryStorage[ONBOARDED_KEY];
      const nameValue = memoryStorage[USER_NAME_KEY];
      
      this.onboarded = onboardedValue === 'true';
      this.userName = nameValue || '';
      
      console.log('UserProfileManager: User data loaded', {
        onboarded: this.onboarded,
        userName: this.userName,
      });
    } catch (error) {
      console.error('UserProfileManager: Error loading user data:', error);
    }
  }

  async setOnboarded(value: boolean): Promise<void> {
    try {
      this.onboarded = value;
      memoryStorage[ONBOARDED_KEY] = value.toString();
      console.log('UserProfileManager: Onboarded status set to', value);
    } catch (error) {
      console.error('UserProfileManager: Error setting onboarded status:', error);
    }
  }

  async setUserName(name: string): Promise<void> {
    try {
      this.userName = name;
      memoryStorage[USER_NAME_KEY] = name;
      console.log('UserProfileManager: User name set to', name);
    } catch (error) {
      console.error('UserProfileManager: Error setting user name:', error);
    }
  }

  isOnboarded(): boolean {
    return this.onboarded;
  }

  getUserName(): string {
    return this.userName;
  }

  async clearUserData(): Promise<void> {
    try {
      delete memoryStorage[ONBOARDED_KEY];
      delete memoryStorage[USER_NAME_KEY];
      this.onboarded = false;
      this.userName = '';
      console.log('UserProfileManager: User data cleared');
    } catch (error) {
      console.error('UserProfileManager: Error clearing user data:', error);
    }
  }
}
