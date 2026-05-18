/**
 * ProgressManager - Tracks user progress and statistics
 * Note: Using in-memory storage instead of AsyncStorage (Expo Go limitation)
 */

import { Exercise } from '../types/Exercise';

const PROGRESS_KEY = '@flexo_progress';
const STREAK_KEY = '@flexo_streak';
const LAST_EXERCISE_KEY = '@flexo_last_exercise';

// In-memory storage for Expo Go compatibility
const memoryStorage: { [key: string]: string } = {};

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  duration: number;
  completed: boolean;
  painLevel?: number; // 1-10 scale
  difficultyRating?: number; // 1-5 scale
}

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  averagePainLevel: number;
  lastExerciseDate: string;
}

export class ProgressManager {
  private sessions: ExerciseSession[] = [];
  private currentStreak: number = 0;

  constructor() {
    this.loadProgress();
  }

  async loadProgress(): Promise<void> {
    try {
      const progressData = memoryStorage[PROGRESS_KEY];
      const streakData = memoryStorage[STREAK_KEY];

      if (progressData) {
        this.sessions = JSON.parse(progressData);
      }

      if (streakData) {
        this.currentStreak = parseInt(streakData, 10);
      }

      console.log('ProgressManager: Loaded progress data', {
        sessions: this.sessions.length,
        streak: this.currentStreak,
      });
    } catch (error) {
      console.error('ProgressManager: Error loading progress:', error);
    }
  }

  async saveProgress(): Promise<void> {
    try {
      memoryStorage[PROGRESS_KEY] = JSON.stringify(this.sessions);
      memoryStorage[STREAK_KEY] = this.currentStreak.toString();
      console.log('ProgressManager: Progress saved');
    } catch (error) {
      console.error('ProgressManager: Error saving progress:', error);
    }
  }

  async recordExerciseSession(
    exercise: Exercise,
    duration: number,
    completed: boolean,
    painLevel?: number,
    difficultyRating?: number
  ): Promise<void> {
    const session: ExerciseSession = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      date: new Date().toISOString(),
      duration,
      completed,
      painLevel,
      difficultyRating,
    };

    this.sessions.push(session);
    
    // Update streak
    if (completed) {
      await this.updateStreak();
    }

    // Save last exercise date
    memoryStorage[LAST_EXERCISE_KEY] = new Date().toISOString();

    await this.saveProgress();
    console.log('ProgressManager: Recorded exercise session:', session);
  }

  private async updateStreak(): Promise<void> {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    const lastExerciseDate = memoryStorage[LAST_EXERCISE_KEY];
    
    if (!lastExerciseDate) {
      this.currentStreak = 1;
    } else {
      const lastDate = new Date(lastExerciseDate).toDateString();
      
      if (lastDate === yesterday) {
        this.currentStreak += 1;
      } else if (lastDate !== today) {
        this.currentStreak = 1;
      }
      // If lastDate === today, don't change streak (already exercised today)
    }
  }

  getProgressStats(): ProgressStats {
    const completedSessions = this.sessions.filter(s => s.completed);
    const totalMinutes = this.sessions.reduce((sum, s) => sum + s.duration, 0);
    const painLevels = this.sessions.filter(s => s.painLevel).map(s => s.painLevel!);
    const averagePainLevel = painLevels.length > 0 
      ? painLevels.reduce((sum, p) => sum + p, 0) / painLevels.length 
      : 0;

    const streaks = this.calculateStreaks();
    const longestStreak = Math.max(...streaks, 0);

    return {
      totalSessions: this.sessions.length,
      completedSessions: completedSessions.length,
      currentStreak: this.currentStreak,
      longestStreak,
      totalMinutes: Math.round(totalMinutes / 60), // Convert to minutes
      averagePainLevel: Math.round(averagePainLevel * 10) / 10,
      lastExerciseDate: this.sessions.length > 0 
        ? this.sessions[this.sessions.length - 1].date 
        : '',
    };
  }

  private calculateStreaks(): number[] {
    const streaks: number[] = [];
    let currentStreak = 0;
    
    const dates = this.sessions
      .filter(s => s.completed)
      .map(s => new Date(s.date).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates
      .sort();

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          streaks.push(currentStreak);
          currentStreak = 1;
        }
      }
    }
    
    if (currentStreak > 0) {
      streaks.push(currentStreak);
    }
    
    return streaks;
  }

  getRecentSessions(limit: number = 10): ExerciseSession[] {
    return this.sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async clearProgress(): Promise<void> {
    try {
      this.sessions = [];
      this.currentStreak = 0;
      delete memoryStorage[PROGRESS_KEY];
      delete memoryStorage[STREAK_KEY];
      delete memoryStorage[LAST_EXERCISE_KEY];
      console.log('ProgressManager: Progress cleared');
    } catch (error) {
      console.error('ProgressManager: Error clearing progress:', error);
    }
  }
}