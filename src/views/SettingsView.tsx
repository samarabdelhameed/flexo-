/**
 * SettingsView - App settings and preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserProfileManager } from '../managers/UserProfileManager';
import { ProgressManager } from '../managers/ProgressManager';
import { NotificationManager } from '../managers/NotificationManager';

export const SettingsView: React.FC = () => {
  const navigation = useNavigation();
  const [userProfileManager] = useState(() => new UserProfileManager());
  const [progressManager] = useState(() => new ProgressManager());
  const [notificationManager] = useState(() => new NotificationManager());

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    await userProfileManager.loadUserData();
    setUserName(userProfileManager.getUserName());
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    console.log('Notifications toggled:', value);
    
    if (value) {
      await notificationManager.scheduleDailyReminder();
    } else {
      await notificationManager.cancelAllNotifications();
    }
  };

  const handleHapticToggle = (value: boolean) => {
    setHapticEnabled(value);
    console.log('Haptic feedback toggled:', value);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await progressManager.clearProgress();
            console.log('Progress reset');
            Alert.alert('Success', 'Progress has been reset.');
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset your profile and you\'ll need to go through onboarding again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await userProfileManager.clearUserData();
            console.log('Onboarding reset');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Name</Text>
            <Text style={styles.settingValue}>{userName || 'Not set'}</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Daily Reminders</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={hapticEnabled}
              onValueChange={handleHapticToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetProgress}>
            <Text style={styles.dangerButtonText}>Reset Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={handleResetOnboarding}>
            <Text style={styles.dangerButtonText}>Reset Onboarding</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Build</Text>
            <Text style={styles.settingValue}>Expo SDK 54</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
  settingValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});