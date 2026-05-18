/**
 * HandSkeletonOverlay - Draws hand skeleton on camera feed
 * Exact replica of hand drawing from Pep ExerciseView
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export interface HandPosePoint {
  x: number;
  y: number;
  confidence: number;
}

interface HandSkeletonOverlayProps {
  points: HandPosePoint[];
}

// Hand skeleton connections (21 landmarks)
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky finger
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm connections
  [5, 9], [9, 13], [13, 17],
];

export const HandSkeletonOverlay: React.FC<HandSkeletonOverlayProps> = ({ points }) => {
  if (points.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Draw skeleton connections (yellow lines) */}
        {HAND_CONNECTIONS.map((connection, idx) => {
          const point1 = points[connection[0]];
          const point2 = points[connection[1]];

          if (!point1 || !point2) return null;

          const x1 = point1.x * width;
          const y1 = point1.y * height;
          const x2 = point2.x * width;
          const y2 = point2.y * height;

          return (
            <Line
              key={`line-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFFF00"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw joint points (green circles) */}
        {points.map((point, idx) => {
          const cx = point.x * width;
          const cy = point.y * height;

          return (
            <Circle
              key={`circle-${idx}`}
              cx={cx}
              cy={cy}
              r="8"
              fill="#34C759"
              opacity={point.confidence}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});