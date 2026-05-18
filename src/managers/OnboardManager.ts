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
      
      // Simulate onboarding conversation
      setTimeout(() => {
        this.status = VoiceStatus.CONNECTED;
        this.messages.push('Welcome to Flexo! 🎉');
        this.messages.push('I\'m here to help you with your physical therapy exercises.');
        this.messages.push('What\'s your name?');
        console.log('OnboardManager: Onboarding conversation started');
      }, 1500);
      
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
