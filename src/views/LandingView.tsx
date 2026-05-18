/**
 * LandingView - Main landing screen
 * Exact replica of LandingView.swift from Pep project
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { VoiceManager, VoiceStatus } from '../managers/VoiceManager';
import { UserProfileManager } from '../managers/UserProfileManager';
import { OnboardManager } from '../managers/OnboardManager';
import type { RootStackParamList } from '../types/navigation';

// Lottie animation for welcome screen (similar to WelcomeAnimation in Swift)
const WelcomeAnimation: React.FC = () => {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        source={require('../../assets/greeting_dog.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

// Message Bubble Component (similar to MessageBubble in Swift)
const MessageBubble: React.FC<{ message: string }> = ({ message }) => {
  return (
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

// Messages View Component (similar to MessagesView in Swift)
const MessagesView: React.FC<{ messages: string[] }> = ({ messages }) => {
  return (
    <ScrollView style={styles.messagesContainer}>
      <View style={styles.messagesContent}>
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </View>
    </ScrollView>
  );
};

// Main Landing View
export const LandingView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State Objects and Dependencies
  const [userProfileManager] = useState(() => new UserProfileManager());
  const [voiceManager] = useState(() => new VoiceManager());
  const [onboardManager] = useState(
    () => new OnboardManager(userProfileManager, voiceManager)
  );

  // Local state
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [showLottie, setShowLottie] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState<VoiceStatus>(VoiceStatus.DISCONNECTED);

  // Computed property: shouldShowContinueButton
  const shouldShowContinueButton = isOnboarded
    ? status === VoiceStatus.CONNECTED
    : status === VoiceStatus.CONNECTED;

  // Start appropriate conversation on mount
  useEffect(() => {
    startAppropriateConversation();
    return () => {
      endCurrentConversation();
    };
  }, []);

  // Update messages and status
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnboarded) {
        setMessages(voiceManager.getMessages());
        setStatus(voiceManager.getStatus());
      } else {
        setMessages(onboardManager.getMessages());
        setStatus(onboardManager.getStatus());
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOnboarded]);

  // Check onboarded status
  useEffect(() => {
    const checkOnboarded = async () => {
      await userProfileManager.loadUserData();
      setIsOnboarded(userProfileManager.isOnboarded());
    };
    checkOnboarded();
  }, []);

  // Helper Methods
  const startAppropriateConversation = async () => {
    try {
      await userProfileManager.loadUserData();
      const onboarded = userProfileManager.isOnboarded();
      setIsOnboarded(onboarded);

      if (onboarded) {
        await voiceManager.startConversation();
      } else {
        await onboardManager.startOnboardingConversation();
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const endCurrentConversation = () => {
    if (isOnboarded) {
      voiceManager.stopConversation();
    } else {
      onboardManager.stopOnboardingConversation();
    }
  };

  const handleContinuePress = () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to ExerciseSelectionView
    navigation.navigate('ExerciseSelection', { userProfileManager });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showLottie && (
          <View style={styles.animationWrapper}>
            <WelcomeAnimation />
          </View>
        )}

        <MessagesView messages={messages} />

        {shouldShowContinueButton && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
            <Text style={styles.continueButtonText}>Continue to Exercises</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  animationWrapper: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  messagesContainer: {
    height: 200,
    marginVertical: 20,
  },
  messagesContent: {
    padding: 10,
  },
  messageBubble: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
