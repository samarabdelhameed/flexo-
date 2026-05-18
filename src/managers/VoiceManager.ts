/**
 * VoiceManager - Handles voice conversations using ElevenLabs SDK
 * Uses the real @elevenlabs/react-native SDK with WebRTC
 */

import { useState, useEffect, useCallback } from 'react';
import { useConversation, useConversationControls } from '@elevenlabs/react-native';

export enum VoiceStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

const AGENT_ID = 'agent_1001krv6c4n1fa796d1723ax76c8';

export function useVoiceManager() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [suggestedExercise, setSuggestedExercise] = useState<string | null>(null);

  const { status, isSpeaking, startSession, endSession, sendUserMessage } = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('VoiceManager: Connected, conversationId:', conversationId);
    },
    onDisconnect: () => {
      console.log('VoiceManager: Disconnected');
    },
    onMessage: (message) => {
      console.log('VoiceManager: Message received:', message);
      if (message && message.text) {
        setMessages((prev) => [
          ...prev,
          { text: message.text, isUser: message.source === 'user' },
        ]);
      }
    },
    onError: (error) => {
      console.error('VoiceManager: Error:', error);
    },
  });

  const getStatus = useCallback((): VoiceStatus => {
    switch (status) {
      case 'connected':
        return VoiceStatus.CONNECTED;
      case 'connecting':
        return VoiceStatus.CONNECTING;
      case 'error':
        return VoiceStatus.ERROR;
      default:
        return VoiceStatus.DISCONNECTED;
    }
  }, [status]);

  const startConversation = useCallback(async () => {
    try {
      console.log('VoiceManager: Starting conversation...');
      setMessages([]);
      await startSession({ agentId: AGENT_ID });
    } catch (error) {
      console.error('VoiceManager: Error starting conversation:', error);
    }
  }, [startSession]);

  const stopConversation = useCallback(async () => {
    try {
      console.log('VoiceManager: Stopping conversation...');
      await endSession();
    } catch (error) {
      console.error('VoiceManager: Error stopping conversation:', error);
    }
  }, [endSession]);

  const sendText = useCallback(
    (text: string) => {
      setSuggestedExercise(null);
      setMessages((prev) => [...prev, { text, isUser: true }]);
      sendUserMessage(text);
    },
    [sendUserMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    status: getStatus(),
    isSpeaking,
    messages,
    suggestedExercise,
    startConversation,
    stopConversation,
    sendText,
    clearMessages,
  };
}
