/**
 * ExerciseReportView - Exercise completion report screen
 * Exact replica of ExerciseReportView.swift from Pep project
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Exercise } from '../types/Exercise';
import { ProgressManager } from '../managers/ProgressManager';
import { NotificationManager } from '../managers/NotificationManager';
import type { RootStackParamList } from '../types/navigation';

// Header Section Component
const HeaderSection: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.headerTitle}>Exercise Report</Text>
      <Text style={styles.headerDate}>{date.toLocaleDateString()}</Text>
    </View>
  );
};

// Feedback Section Component
interface FeedbackSectionProps {
  title: string;
  content: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, content }) => {
  return (
    <View style={styles.feedbackSection}>
      <Text style={styles.feedbackTitle}>{title}</Text>
      <Text style={styles.feedbackContent}>{content}</Text>
      <View style={styles.divider} />
    </View>
  );
};

// Exercise Stats Component
interface ExerciseStatsProps {
  duration: number;
  completed: boolean;
}

const ExerciseStats: React.FC<ExerciseStatsProps> = ({ duration, completed }) => {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Exercise Statistics</Text>
      <Text style={styles.statsText}>Duration: {duration} seconds</Text>
      <Text style={styles.statsText}>
        Completion: {completed ? 'Completed' : 'Partial'}
      </Text>
      <View style={styles.divider} />
    </View>
  );
};

// Progress Board Section Component
const ProgressBoardSection: React.FC<{ dayStreak: number; totalSessions: number; totalMinutes: number }> = ({ 
  dayStreak, 
  totalSessions, 
  totalMinutes 
}) => {
  return (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>Progress Board</Text>
      <View style={styles.progressCards}>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{dayStreak}</Text>
          <Text style={styles.progressLabel}>Day Streak</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{totalSessions}</Text>
          <Text style={styles.progressLabel}>Total Sessions</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{totalMinutes}</Text>
          <Text style={styles.progressLabel}>Minutes</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

// Motivational Message Section Component
const MotivationalMessageSection: React.FC = () => {
  return (
    <View style={styles.motivationSection}>
      <Text style={styles.sectionTitle}>Motivation</Text>
      <Text style={styles.motivationText}>
        Great progress! You are one step closer to recovering from RSI and getting back to
        technical mountain climbing! Hey, mountains are always there for you.
      </Text>
      <View style={styles.divider} />
    </View>
  );
};

// Generate PT Report Button Component
const GeneratePTReportButton: React.FC = () => {
  const handleGenerateReport = () => {
    Alert.alert(
      'Generate PT Report',
      'This feature will generate a comprehensive report for your Physical Therapist. Would you like to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Generate',
          onPress: () => {
            console.log('Generating PT Report');
            // TODO: Implement report generation logic
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
      <Text style={styles.reportButtonIcon}>📄</Text>
      <Text style={styles.reportButtonText}>Generate PT Visit Report</Text>
    </TouchableOpacity>
  );
};

// Congratulations Overlay Component
const CongratulationsOverlay: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.congratsOverlay}>
      <Text style={styles.congratsEmoji}>🎉</Text>
      <Text style={styles.congratsText}>Fantastic Work!</Text>
    </View>
  );
};

// Main Exercise Report View
export const ExerciseReportView: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ExerciseReport'>>();
  const { exercise } = route.params;

  const [showingCongrats, setShowingCongrats] = useState(true);
  const [progressManager] = useState(() => new ProgressManager());
  const [notificationManager] = useState(() => new NotificationManager());
  const [progressStats, setProgressStats] = useState({
    currentStreak: 0,
    totalSessions: 0,
    totalMinutes: 0,
  });

  const date = new Date();
  const duration = exercise.duration || 30;

  useEffect(() => {
    // Record this exercise session
    const recordSession = async () => {
      await progressManager.recordExerciseSession(exercise, duration, true, 2, 4);
      const stats = progressManager.getProgressStats();
      setProgressStats(stats);
      
      // Schedule next reminder
      await notificationManager.scheduleDailyReminder();
    };

    recordSession();
  }, []);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Close Button */}
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <HeaderSection date={date} />

        <FeedbackSection
          title="General Feeling"
          content="Better than before, feeling fingers more flexible and can do exercise without pain."
        />

        <FeedbackSection
          title="Tension Level"
          content="MRC: scale 4/5 - still feeling tension in pinky but with good range of motion."
        />

        <FeedbackSection
          title="Pain Report"
          content="No more pain in daily activities. No more pain during exercise."
        />

        <ExerciseStats duration={duration} completed={true} />

        <ProgressBoardSection 
          dayStreak={progressStats.currentStreak} 
          totalSessions={progressStats.totalSessions}
          totalMinutes={progressStats.totalMinutes}
        />

        <MotivationalMessageSection />

        <GeneratePTReportButton />
      </ScrollView>

      {showingCongrats && (
        <CongratulationsOverlay onComplete={() => setShowingCongrats(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 30,
    color: '#8E8E93',
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerDate: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  feedbackContent: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginTop: 10,
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 5,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  progressCard: {
    flex: 1,
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressEmoji: {
    fontSize: 40,
  },
  progressLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 5,
  },
  motivationSection: {
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    color: '#8E8E93',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  reportButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  reportButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  congratsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
