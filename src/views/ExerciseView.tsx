/**
 * ExerciseView - Exercise execution screen with REAL camera and hand tracking
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useVoiceManager, VoiceStatus } from '../managers/VoiceManager';
import { ExerciseManager } from '../managers/ExerciseManager';
import { HandSkeletonOverlay } from '../components/HandSkeletonOverlay';
import { Exercise } from '../types/Exercise';
import type { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

export const ExerciseView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Exercise'>>();
  const { exercise } = route.params;

  const voiceManager = useVoiceManager();
  const [exerciseManager] = useState(() => new ExerciseManager());
  const [handPosePoints, setHandPosePoints] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showReport, setShowReport] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    activateKeepAwakeAsync();

    const startManagers = async () => {
      console.log('Starting ExerciseManager and VoiceManager...');

      await exerciseManager.startSession();

      setTimeout(async () => {
        console.log('Starting VoiceManager...');
        await voiceManager.startConversation();
      }, 1500);
    };

    startManagers();

    const interval = setInterval(() => {
      setHandPosePoints(exerciseManager.getHandPosePoints());
    }, 100);

    return () => {
      clearInterval(interval);
      exerciseManager.stopSession();
      voiceManager.stopConversation();
      deactivateKeepAwake();
    };
  }, []);

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
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {handPosePoints.length > 0 && (
        <HandSkeletonOverlay points={handPosePoints} />
      )}

      <View style={styles.messagesOverlay}>
        <ScrollView style={styles.messagesScroll}>
          {voiceManager.messages.map((message, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

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
