import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { SettingsRow, SettingsSection, ToggleRow } from '@/components/settings-rows';
import { ThemedView } from '@/components/themed-view';

export default function SecuritySettingsScreen() {
  const insets = useSafeAreaInsets();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/settings"
            subtitle="Protect access to your account"
            title="Security"
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
            showsVerticalScrollIndicator={false}>
            <SettingsSection title="Sign-in">
              <SettingsRow
                icon="key-outline"
                label="Change password"
                value="Last changed 3 months ago"
                onPress={() =>
                  Alert.alert('Change password', 'A reset link has been sent to your email.')
                }
              />
              <ToggleRow
                description="Require a one-time code at sign-in"
                icon="shield-checkmark-outline"
                label="Two-factor authentication"
                onValueChange={setTwoFactor}
                value={twoFactor}
              />
              <ToggleRow
                description="Unlock with Face ID or fingerprint"
                icon="finger-print-outline"
                label="Biometric sign-in"
                onValueChange={setBiometrics}
                value={biometrics}
              />
            </SettingsSection>

            <SettingsSection title="Sessions">
              <SettingsRow
                icon="phone-portrait-outline"
                label="This device"
                value="Active now"
                onPress={() =>
                  Alert.alert('This device', 'You are signed in on this device.')
                }
              />
              <SettingsRow
                icon="laptop-outline"
                label="Sign out other devices"
                onPress={() =>
                  Alert.alert('Signed out', 'All other devices have been signed out.')
                }
              />
            </SettingsSection>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
