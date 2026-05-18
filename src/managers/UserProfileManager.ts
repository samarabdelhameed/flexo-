/**
 * UserProfileManager - Manages user profile and onboarding status
 * Similar to UserProfileManager.swift in Pep project
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDED_KEY = '@flexo_onboarded';
const USER_NAME_KEY = '@flexo_user_name';

export class UserProfileManager {
  private onboarded: boolean = false;
  private userName: string = '';

  constructor() {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      const onboardedValue = await AsyncStorage.getItem(ONBOARDED_KEY);
      const nameValue = await AsyncStorage.getItem(USER_NAME_KEY);
      
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
      await AsyncStorage.setItem(ONBOARDED_KEY, value.toString());
      console.log('UserProfileManager: Onboarded status set to', value);
    } catch (error) {
      console.error('UserProfileManager: Error setting onboarded status:', error);
    }
  }

  async setUserName(name: string): Promise<void> {
    try {
      this.userName = name;
      await AsyncStorage.setItem(USER_NAME_KEY, name);
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
      await AsyncStorage.multiRemove([ONBOARDED_KEY, USER_NAME_KEY]);
      this.onboarded = false;
      this.userName = '';
      console.log('UserProfileManager: User data cleared');
    } catch (error) {
      console.error('UserProfileManager: Error clearing user data:', error);
    }
  }
}
