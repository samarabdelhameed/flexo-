/**
 * Main App Entry Point
 * Sets up navigation and connects all views
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingView } from './src/views/LandingView';
import { ExerciseSelectionView } from './src/views/ExerciseSelectionView';
import { ExerciseView } from './src/views/ExerciseView';
import { ExerciseReportView } from './src/views/ExerciseReportView';
import { SettingsView } from './src/views/SettingsView';
import { UserProfileManager } from './src/managers/UserProfileManager';

const Stack = createNativeStackNavigator();

export default function App() {
  const userProfileManager = new UserProfileManager();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingView} />
        <Stack.Screen
          name="ExerciseSelection"
          component={ExerciseSelectionView}
          initialParams={{ userProfileManager }}
        />
        <Stack.Screen name="Exercise" component={ExerciseView} />
        <Stack.Screen
          name="ExerciseReport"
          component={ExerciseReportView}
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsView}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
