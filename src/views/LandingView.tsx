/**
 * LandingView - Main landing screen
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardManager } from '../managers/OnboardManager';
import { UserProfileManager } from '../managers/UserProfileManager';
import type { RootStackParamList } from '../types/navigation';

const WelcomeAnimation: React.FC = () => {
  return (
    <View style={styles.animationContainer}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.welcomeIcon}
      />
    </View>
  );
};

const MessageBubble: React.FC<{ message: string }> = ({ message }) => {
  return (
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const MessagesView: React.FC<{ messages: string[] }> = ({ messages }) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.messagesContainer}
      contentContainerStyle={styles.messagesContent}
    >
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </ScrollView>
  );
};

export const LandingView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userProfileManager] = useState(() => new UserProfileManager());
  const [onboardManager] = useState(() => new OnboardManager(userProfileManager, null as any));
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const init = async () => {
      await userProfileManager.loadUserData();
      setIsOnboarded(userProfileManager.isOnboarded());

      // Start onboarding conversation
      await onboardManager.startOnboardingConversation();
      
      // Update messages every 500ms
      updateInterval.current = setInterval(() => {
        const currentMessages = onboardManager.getMessages();
        setMessages([...currentMessages]);
        
        // Check if connected
        if (currentMessages.length > 0) {
          setIsConnected(true);
        }
      }, 500);
    };
    init();

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      onboardManager.stopOnboardingConversation();
    };
  }, []);

  const handleContinuePress = () => {
    console.log('Continue button pressed');
    navigation.navigate('ExerciseSelection', { userProfileManager });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationWrapper}>
          <WelcomeAnimation />
        </View>

        <MessagesView messages={messages} />

        {isConnected && (
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
  welcomeIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
