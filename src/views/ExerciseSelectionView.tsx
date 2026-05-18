/**
 * ExerciseSelectionView - Exercise selection screen
 * Exact replica of ExerciseSelectionView.swift from Pep project
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { EXERCISES, Exercise, ExerciseType } from '../types/Exercise';
import { UserProfileManager } from '../managers/UserProfileManager';
import type { RootStackParamList } from '../types/navigation';

// Exercise Card Component (similar to ExerciseCard in Swift)
interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Best Match':
        return '#007AFF'; // blue
      case 'Progression':
        return '#34C759'; // green
      case 'Regression':
        return '#FF9500'; // orange
      default:
        return '#007AFF';
    }
  };

  const difficultyColor = getDifficultyColor(exercise.difficulty);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{exercise.name}</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: `${difficultyColor}1A` }, // 10% opacity
            ]}
          >
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{exercise.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Exercise Selection View
export const ExerciseSelectionView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ExerciseSelection'>>();
  const { userProfileManager } = route.params;
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleExercisePress = (exercise: Exercise) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercise(exercise);
    // Navigate to ExerciseView
    navigation.navigate('Exercise', { exercise });
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Exercise</Text>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Select the exercise that matches your comfort level
      </Text>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {EXERCISES.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() => handleExercisePress(exercise)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
