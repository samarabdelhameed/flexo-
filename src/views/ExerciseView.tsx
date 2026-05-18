/**
 * ExerciseView - Exercise execution screen with REAL camera and hand tracking
 * Exact replica of ExerciseView.swift from Pep project with MediaPipe integration
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, CameraView } from 'expo-camera';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { VoiceManager } from '../managers/VoiceManager';
import { ExerciseManager, HandPosePoint } from '../managers/ExerciseManager';
import { HandSkeletonOverlay } from '../components/HandSkeletonOverlay';
import { Exercise } from '../types/Exercise';
import type { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

export const ExerciseView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Exercise'>>();
  const { exercise } = route.params;

  const [voiceManager] = useState(() => new VoiceManager());
  const [exerciseManager] = useState(() => new ExerciseManager());
  const [messages, setMessages] = useState<string[]>([]);
  const [handPosePoints, setHandPosePoints] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const cameraRef = useRef<any>(null);
  const frameProcessingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request camera permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Keep screen awake during exercise
    activateKeepAwakeAsync();

    // Start exercise and voice managers
    const startManagers = async () => {
      console.log('🚀 Starting ExerciseManager and VoiceManager concurrently...');
      
      // Start exercise session
      await exerciseManager.startSession();
      
      // Check if MediaPipe is ready
      const checkMediaPipe = setInterval(() => {
        if (exerciseManager.isMediaPipeReady()) {
          setIsMediaPipeReady(true);
          console.log('✅ MediaPipe is ready for REAL hand tracking!');
          clearInterval(checkMediaPipe);
        }
      }, 500);

      // Start voice conversation after 1.5 seconds
      setTimeout(async () => {
        console.log('🎙 Starting VoiceManager...');
        await voiceManager.startConversation();
        
        // Exercise-specific conversation flow (like Pep video)
        setTimeout(() => {
          voiceManager.addMessage(`Today we'll start with ${exercise.name}.`);
        }, 9000);

        setTimeout(() => {
          voiceManager.addMessage('Can you see your hand in the camera view?');
        }, 11000);

        setTimeout(() => {
          voiceManager.addMessage('Perfect! Let\'s begin the exercise.');
        }, 13000);

        // Start hand detection feedback loop
        setTimeout(() => {
          startHandDetectionFeedback();
        }, 15000);
      }, 1500);
    };

    startManagers();

    // Update messages and hand pose periodically
    const interval = setInterval(() => {
      setMessages(voiceManager.getMessages());
      setHandPosePoints(exerciseManager.getHandPosePoints());
    }, 100); // Update at 10 FPS for smooth visualization

    return () => {
      clearInterval(interval);
      if (frameProcessingInterval.current) {
        clearInterval(frameProcessingInterval.current);
      }
      exerciseManager.stopSession();
      voiceManager.stopConversation();
      deactivateKeepAwake();
    };
  }, []);

  const startHandDetectionFeedback = () => {
    let lastHandDetected = false;
    let feedbackTimer = 0;

    const feedbackLoop = setInterval(() => {
      const handDetected = exerciseManager.isHandDetected();
      
      if (handDetected && !lastHandDetected) {
        voiceManager.addMessage('Great! I can see your hand. Keep your fingers spread wide.');
        console.log('👋 Hand detected!');
      } else if (!handDetected && lastHandDetected) {
        voiceManager.addMessage('I lost sight of your hand. Please position it in the camera view.');
        console.log('❌ Hand lost');
      }

      // Periodic encouragement
      if (handDetected) {
        feedbackTimer++;
        if (feedbackTimer === 30) { // Every 3 seconds
          const encouragements = [
            'Make sure your fingers are fully extended like a fan.',
            'Keep your wrist straight and relaxed.',
            'Excellent form! You\'re doing great! 💪',
            'Perfect! Hold that position.',
            'Great job! Keep it up!',
          ];
          const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
          voiceManager.addMessage(randomMsg);
          feedbackTimer = 0;
        }
      }

      lastHandDetected = handDetected;
    }, 100);

    return () => clearInterval(feedbackLoop);
  };

  const handleCompleteExercise = () => {
    setShowReport(true);
    navigation.navigate('ExerciseReport', { exercise });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>No access to camera</Text>
        <Text style={styles.statusSubtext}>Please enable camera permissions in Settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Layer - REAL camera feed */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {/* MediaPipe Status Indicator */}
      {!isMediaPipeReady && (
        <View style={styles.statusOverlay}>
          <Text style={styles.statusText}>🔧 Initializing hand tracking...</Text>
        </View>
      )}

      {/* Hand Pose Visualization Layer - REAL hand tracking data */}
      {handPosePoints.length > 0 && (
        <HandSkeletonOverlay points={handPosePoints} />
      )}

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
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  handPoseOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
