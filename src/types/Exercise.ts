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

// Exercise instructions (like Pep provides)
export const EXERCISE_INSTRUCTIONS = {
  [ExerciseType.FINGER_SPREADS]: {
    setup: 'Position your hand in front of the camera with palm facing forward.',
    execution: [
      'Spread your fingers wide apart like a fan',
      'Keep your fingers fully extended',
      'Keep your wrist straight and relaxed',
      'Hold for 5 seconds',
      'Relax and repeat',
    ],
    tips: [
      'Make sure your fingers are fully extended',
      'Keep your wrist straight',
      'Don\'t force the stretch if you feel pain',
      'Breathe normally throughout',
    ],
    progression: 'If you\'re not feeling much pain, increase repetitions or hold time before moving to harder exercises.',
  },
  [ExerciseType.MOBILITY_TOUCHES]: {
    setup: 'Hold your hand up with palm facing you.',
    execution: [
      'Touch your thumb to your index finger',
      'Touch your thumb to your middle finger',
      'Touch your thumb to your ring finger',
      'Touch your thumb to your pinky',
      'Repeat in reverse order',
    ],
    tips: [
      'Move slowly and deliberately',
      'Make full contact with each finger',
      'Keep other fingers relaxed',
    ],
    progression: 'Increase speed while maintaining control.',
  },
  [ExerciseType.FIST_MAKING]: {
    setup: 'Start with your hand open and relaxed.',
    execution: [
      'Slowly curl your fingers into your palm',
      'Make a gentle fist',
      'Hold for 3 seconds',
      'Slowly open your hand',
      'Repeat',
    ],
    tips: [
      'Don\'t squeeze too hard',
      'Keep your wrist neutral',
      'Stop if you feel sharp pain',
    ],
    progression: 'Gradually increase the firmness of your grip.',
  },
};
