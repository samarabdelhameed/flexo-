/**
 * Exercise Types - Similar to ExerciseType enum in Pep project
 */

export enum ExerciseType {
  FINGER_SPREADS = 'fingerSpreads',
  MOBILITY_TOUCHES = 'mobilityTouches',
  FIST_MAKING = 'fistMaking',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  name: string;
  description: string;
  difficulty: 'Best Match' | 'Progression' | 'Regression';
  duration?: number; // in seconds
}

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    type: ExerciseType.FINGER_SPREADS,
    name: 'Finger Spreads',
    description: 'Best Match - Spread your fingers wide to improve flexibility',
    difficulty: 'Best Match',
    duration: 30,
  },
  {
    id: '2',
    type: ExerciseType.MOBILITY_TOUCHES,
    name: 'Mobility Touches',
    description: 'Progression - Touch each finger to your thumb',
    difficulty: 'Progression',
    duration: 45,
  },
  {
    id: '3',
    type: ExerciseType.FIST_MAKING,
    name: 'Make a Fist',
    description: 'Regression - Gently make a fist',
    difficulty: 'Regression',
    duration: 20,
  },
];
