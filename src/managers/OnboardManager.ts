/**
 * OnboardManager - Handles onboarding conversation flow
 * Similar to OnboardManager.swift in Pep project
 */

import { VoiceManager, VoiceStatus } from './VoiceManager';
import { UserProfileManager } from './UserProfileManager';

export class OnboardManager {
  private voiceManager: VoiceManager;
  private userProfileManager: UserProfileManager;
  private messages: string[] = [];
  private status: VoiceStatus = VoiceStatus.DISCONNECTED;

  constructor(userProfileManager: UserProfileManager, voiceManager: VoiceManager) {
    this.userProfileManager = userProfileManager;
    this.voiceManager = voiceManager;
    console.log('OnboardManager initialized');
  }

  getMessages(): string[] {
    return this.messages;
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  async startOnboardingConversation(): Promise<void> {
    try {
      console.log('OnboardManager: Starting onboarding conversation...');
      this.status = VoiceStatus.CONNECTING;
      
      // Simulate realistic onboarding conversation
      setTimeout(() => {
        this.status = VoiceStatus.CONNECTED;
        this.messages.push('Welcome to Flexo! 🎉');
        console.log('OnboardManager: Onboarding conversation started');
      }, 1500);

      setTimeout(() => {
        this.messages.push('I\'m your compassionate Physical Therapy companion.');
      }, 3000);

      setTimeout(() => {
        this.messages.push('I\'ll help you stay motivated and track your progress.');
      }, 4500);

      setTimeout(() => {
        this.messages.push('What\'s your name?');
      }, 6000);
      
    } catch (error) {
      console.error('OnboardManager: Error starting onboarding:', error);
      this.status = VoiceStatus.ERROR;
    }
  }

  stopOnboardingConversation(): void {
    console.log('OnboardManager: Stopping onboarding conversation...');
    this.status = VoiceStatus.DISCONNECTED;
  }

  async completeOnboarding(userName: string): Promise<void> {
    try {
      await this.userProfileManager.setUserName(userName);
      await this.userProfileManager.setOnboarded(true);
      console.log('OnboardManager: Onboarding completed for', userName);
    } catch (error) {
      console.error('OnboardManager: Error completing onboarding:', error);
    }
  }

  addMessage(message: string): void {
    this.messages.push(message);
  }
}
