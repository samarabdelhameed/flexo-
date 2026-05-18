/**
 * ExerciseView - Exercise execution screen with camera and hand tracking
 * Exact replica of ExerciseView.swift from Pep project
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
import { Camera, CameraView } from 'expo-camera';
import { VoiceManager } from '../managers/VoiceManager';
import { ExerciseManager } from '../managers/ExerciseManager';
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

  useEffect(() => {
    // Request camera permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Start exercise and voice managers
    const startManagers = async () => {
      console.log('🚀 Starting ExerciseManager and VoiceManager concurrently...');
      
      // Start exercise session
      await exerciseManager.startSession();
      
      // Start voice conversation after 1.5 seconds
      setTimeout(async () => {
        console.log('🎙 Starting VoiceManager...');
        await voiceManager.startConversation();
      }, 1500);
    };

    startManagers();

    // Update messages periodically
    const interval = setInterval(() => {
      setMessages(voiceManager.getMessages());
      setHandPosePoints(exerciseManager.getHandPosePoints());
    }, 500);

    return () => {
      clearInterval(interval);
      exerciseManager.stopSession();
      voiceManager.stopConversation();
    };
  }, []);

  const handleCompleteExercise = () => {
    setShowReport(true);
    navigation.navigate('ExerciseReport', { exercise });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Layer */}
      <CameraView
        style={styles.camera}
        facing="front"
      />

      {/* Hand Pose Visualization Layer */}
      {handPosePoints.length > 0 && (
        <View style={styles.handPoseOverlay}>
          {/* TODO: Implement hand skeleton drawing using SVG or Canvas */}
          {handPosePoints.map((point, index) => (
            <View
              key={index}
              style={[
                styles.jointPoint,
                {
                  left: point.x * width,
                  top: point.y * height,
                },
              ]}
            />
          ))}
        </View>
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
  handPoseOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  jointPoint: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#34C759',
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
