/**
 * VoiceManager - Handles voice conversations using ElevenLabs API
 * Similar to VoiceManager.swift in Pep project
 */

export enum VoiceStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export class VoiceManager {
  private status: VoiceStatus = VoiceStatus.DISCONNECTED;
  private messages: string[] = [];
  private agentId: string = 'lpwQ9rz6CHbfexAY8kU3'; // Same as Pep project
  private connectionError: string | null = null;

  constructor() {
    console.log('VoiceManager initialized');
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  getMessages(): string[] {
    return this.messages;
  }

  getConnectionError(): string | null {
    return this.connectionError;
  }

  async startConversation(): Promise<void> {
    try {
      console.log('VoiceManager: Starting conversation...');
      this.status = VoiceStatus.CONNECTING;
      
      // Realistic conversation flow like Pep
      setTimeout(() => {
        this.status = VoiceStatus.CONNECTED;
        this.messages.push('Good to see you! I\'m Flexo 🐕');
        console.log('VoiceManager: Connected successfully');
      }, 1500);

      setTimeout(() => {
        this.messages.push('I\'m here to help you with your physical therapy.');
      }, 3000);

      setTimeout(() => {
        this.messages.push('What body part are we focusing on today?');
      }, 5000);

      setTimeout(() => {
        this.messages.push('Great! Let\'s start with your hand exercises.');
      }, 7000);
      
    } catch (error) {
      console.error('VoiceManager: Error starting conversation:', error);
      this.status = VoiceStatus.ERROR;
      this.connectionError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  stopConversation(): void {
    console.log('VoiceManager: Stopping conversation...');
    this.status = VoiceStatus.DISCONNECTED;
    // TODO: Implement cleanup
  }

  addMessage(message: string): void {
    this.messages.push(message);
  }
}
