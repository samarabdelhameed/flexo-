/**
 * ExerciseView - Exercise execution screen (simplified for Expo Go)
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
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { ExerciseManager } from '../managers/ExerciseManager';
import { HandSkeletonOverlay } from '../components/HandSkeletonOverlay';
import { Exercise } from '../types/Exercise';
import type { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

export const ExerciseView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Exercise'>>();
  const { exercise } = route.params;

  const [exerciseManager] = useState(() => new ExerciseManager());
  const [messages, setMessages] = useState<string[]>([]);
  const [handPosePoints, setHandPosePoints] = useState<any[]>([]);

  useEffect(() => {
    // Keep screen awake during exercise
    activateKeepAwakeAsync();

    // Start exercise session
    const startExercise = async () => {
      console.log('🚀 Starting exercise...');
      
      // Simulate exercise flow
      setTimeout(() => {
        setMessages(prev => [...prev, `Today we'll start with ${exercise.name}.`]);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, 'Can you see your hand in the camera view?']);
      }, 3000);

      setTimeout(() => {
        setMessages(prev => [...prev, 'Perfect! Let\'s begin the exercise.']);
      }, 5000);

      setTimeout(() => {
        console.log('👋 Simulating hand detection...');
        exerciseManager.simulateHandDetection();
        setMessages(prev => [...prev, 'Great! I can see your hand. Keep your fingers spread wide.']);
      }, 7000);

      setTimeout(() => {
        setMessages(prev => [...prev, 'Make sure your fingers are fully extended like a fan.']);
      }, 9000);

      setTimeout(() => {
        setMessages(prev => [...prev, 'Keep your wrist straight and relaxed.']);
      }, 11000);

      setTimeout(() => {
        setMessages(prev => [...prev, 'Excellent form! You\'re doing great! 💪']);
      }, 13000);
    };

    startExercise();

    // Update hand pose points
    const interval = setInterval(() => {
      setHandPosePoints(exerciseManager.getHandPosePoints());
    }, 100);

    return () => {
      clearInterval(interval);
      exerciseManager.stopSession();
      deactivateKeepAwake();
    };
  }, []);

  const handleCompleteExercise = () => {
    navigation.navigate('ExerciseReport', { exercise });
  };

  return (
    <View style={styles.container}>
      {/* Camera Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderTitle}>📷 Camera View</Text>
        <Text style={styles.placeholderText}>
          Camera is not available in Expo Go demo
        </Text>
        <Text style={styles.placeholderSubtext}>
          Features in full version:
        </Text>
        <Text style={styles.featureText}>✅ Real-time camera feed</Text>
        <Text style={styles.featureText}>✅ Hand pose detection</Text>
        <Text style={styles.featureText}>✅ Skeleton overlay</Text>
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
