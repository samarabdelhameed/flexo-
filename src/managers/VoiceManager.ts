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
      
      // TODO: Implement ElevenLabs API integration
      // For now, simulate connection
      setTimeout(() => {
        this.status = VoiceStatus.CONNECTED;
        this.messages.push('Welcome to Flexo! How are you feeling today?');
        console.log('VoiceManager: Connected successfully');
      }, 1500);
      
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
