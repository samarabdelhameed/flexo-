/**
 * Navigation Types
 */

import { Exercise } from './Exercise';
import { UserProfileManager } from '../managers/UserProfileManager';

export type RootStackParamList = {
  Landing: undefined;
  ExerciseSelection: { userProfileManager: UserProfileManager };
  Exercise: { exercise: Exercise };
  ExerciseReport: { exercise: Exercise };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
