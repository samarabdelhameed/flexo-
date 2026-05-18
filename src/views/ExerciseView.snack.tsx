/**
 * ExerciseView - SNACK DEMO VERSION (No Camera)
 * This is a simplified version for Snack.expo.dev preview
 * For full version with camera and hand tracking, see main branch
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Exercise } from '../types/Exercise';
import type { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

export const ExerciseView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Exercise'>>();
  const { exercise } = route.params;

  const [messages, setMessages] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Simulate voice conversation
    const messageTimings = [
      { delay: 1000, text: "Good to see you! I'm Flexo 🐕" },
      { delay: 3000, text: `Today we'll start with ${exercise.name}.` },
      { delay: 5000, text: '⚠️ Camera not available in Snack demo' },
      { delay: 7000, text: 'In the full version, you would see your hand here!' },
      { delay: 9000, text: 'The app tracks your hand movements in real-time.' },
      { delay: 11000, text: 'Clone from GitHub to try the full experience!' },
    ];

    const timers = messageTimings.map(({ delay, text }) =>
      setTimeout(() => {
        setMessages(prev => [...prev, text]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [exercise]);

  const handleCompleteExercise = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowReport(true);
    navigation.navigate('ExerciseReport', { exercise });
  };

  return (
    <View style={styles.container}>
      {/* Camera Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderTitle}>📷 Camera View</Text>
        <Text style={styles.placeholderText}>
          Camera and hand tracking are not available in Snack demo
        </Text>
        <Text style={styles.placeholderSubtext}>
          Clone the repo and run locally to see:
        </Text>
        <Text style={styles.featureText}>✅ Real-time camera feed</Text>
        <Text style={styles.featureText}>✅ Hand pose detection</Text>
        <Text style={styles.featureText}>✅ Skeleton overlay</Text>
        <Text style={styles.featureText}>✅ Voice feedback</Text>
        
        <View style={styles.githubBox}>
          <Text style={styles.githubText}>
            github.com/samarabdelhameed/flexo-
          </Text>
        </View>
      </View>

      {/* Messages Overlay */}
      <View style={styles.messagesOverlay}>
        <ScrollView style={styles.messagesScroll}>
          {messages.map((message, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Complete Exercise Button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteExercise}
        >
          <Text style={styles.completeButtonText}>Complete Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  placeholderTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4CAF50',
    marginVertical: 4,
  },
  githubBox: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  githubText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  messagesScroll: {
    maxHeight: 200,
    paddingHorizontal: 15,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
