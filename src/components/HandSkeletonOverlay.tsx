/**
 * HandSkeletonOverlay - Draws hand skeleton on camera feed
 * Using simple View for Expo Go compatibility (no SVG)
 */

import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export interface HandPosePoint {
  x: number;
  y: number;
  confidence: number;
}

interface HandSkeletonOverlayProps {
  points: HandPosePoint[];
}

export const HandSkeletonOverlay: React.FC<HandSkeletonOverlayProps> = ({ points }) => {
  if (points.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>
        👋 Hand detected: {points.length} landmarks
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
});
