/**
 * ExerciseManager - Handles camera and hand pose detection for exercises
 * ⚠️ NOTE: Real hand tracking requires native implementation
 * MediaPipe doesn't work with React Native - using simulation for demo
 */

import { Camera } from 'expo-camera';

export interface HandPosePoint {
  x: number;
  y: number;
  confidence: number;
}

export class ExerciseManager {
  private handPosePoints: HandPosePoint[] = [];
  private isAuthorized: boolean = false;
  private error: string | null = null;
  private confidenceThreshold: number = 0.7;
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('✅ ExerciseManager initialized');
    this.initializeCamera();
  }

  private async initializeCamera(): Promise<void> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      this.isAuthorized = status === 'granted';
      console.log('✅ ExerciseManager: Camera permission:', status);
    } catch (error) {
      console.error('❌ ExerciseManager: Error initializing camera:', error);
      this.error = 'Camera initialization failed';
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      console.log('✅ ExerciseManager: Checking camera permissions...');
      const { status } = await Camera.getCameraPermissionsAsync();
      this.isAuthorized = status === 'granted';
      
      if (!this.isAuthorized) {
        const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
        this.isAuthorized = newStatus === 'granted';
      }
      
      console.log('✅ ExerciseManager: Permission check complete. Authorized:', this.isAuthorized);
      return this.isAuthorized;
    } catch (error) {
      console.error('❌ ExerciseManager: Error checking permissions:', error);
      this.error = 'Camera access denied';
      this.isAuthorized = false;
      return false;
    }
  }

  async startSession(): Promise<void> {
    try {
      if (!this.isAuthorized) {
        const hasPermission = await this.checkPermissions();
        if (!hasPermission) {
          throw new Error('Camera permission not granted');
        }
      }

      console.log('✅ ExerciseManager: Camera session started');
      console.log('⚠️ ExerciseManager: Using simulated hand tracking (MediaPipe not compatible with React Native)');
      
      // Start continuous simulation
      this.startContinuousSimulation();
      
    } catch (error) {
      console.error('❌ ExerciseManager: Error starting session:', error);
      this.error = error instanceof Error ? error.message : 'Failed to start session';
    }
  }

  stopSession(): void {
    console.log('✅ ExerciseManager: Stopping camera session...');
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.handPosePoints = [];
  }

  getHandPosePoints(): HandPosePoint[] {
    return this.handPosePoints;
  }

  isSessionAuthorized(): boolean {
    return this.isAuthorized;
  }

  getError(): string | null {
    return this.error;
  }

  /**
   * Start continuous hand simulation (updates every 100ms)
   */
  private startContinuousSimulation(): void {
    let time = 0;
    this.simulationInterval = setInterval(() => {
      time += 0.1;
      this.simulateHandDetection(time);
    }, 100);
  }

  /**
   * Simulate hand detection with animated movement
   * This mimics what real hand tracking would provide
   */
  simulateHandDetection(time: number = 0): void {
    // Simulate 21 hand landmarks (MediaPipe format)
    // Animated to show "movement"
    const simulatedLandmarks = Array.from({ length: 21 }, (_, i) => ({
      x: 0.3 + Math.sin(i * 0.3 + time) * 0.15,
      y: 0.4 + Math.cos(i * 0.3 + time) * 0.15,
      z: 0.8 + Math.random() * 0.2,
      confidence: 0.85 + Math.random() * 0.15,
    }));

    this.processHandPose(simulatedLandmarks);
  }

  /**
   * Process hand pose detection results
   */
  processHandPose(landmarks: any[]): void {
    try {
      if (!landmarks || landmarks.length === 0) {
        this.handPosePoints = [];
        return;
      }

      const points: HandPosePoint[] = landmarks
        .map((landmark: any) => ({
          x: landmark.x || 0,
          y: landmark.y || 0,
          confidence: landmark.z || landmark.confidence || 0.7,
        }))
        .filter((point: HandPosePoint) => point.confidence > this.confidenceThreshold);

      this.handPosePoints = points;
    } catch (error) {
      console.error('❌ ExerciseManager: Error processing hand pose:', error);
    }
  }

  isHandDetected(): boolean {
    return this.handPosePoints.length > 0;
  }

  isMediaPipeReady(): boolean {
    // Always return true for simulation
    return true;
  }
}
