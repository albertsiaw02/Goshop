import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
  { key: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

type RowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  tone?: 'default' | 'danger';
  onPress?: () => void;
};

function SettingsRow({ icon, label, value, tone = 'default', onPress }: RowProps) {
  const theme = useTheme();
  const danger = tone === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className="min-h-[56px] flex-row items-center gap-3"
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
      <View
        className={`h-9 w-9 items-center justify-center rounded-xl ${
          danger ? 'bg-[#fee2e2]' : 'bg-brand-50'
        }`}>
        <Ionicons name={icon} size={18} color={danger ? '#dc2626' : '#16a34a'} />
      </View>
      <ThemedText className={`flex-1 ${danger ? 'font-semibold text-danger' : ''}`}>
        {label}
      </ThemedText>
      {value ? (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const theme = useTheme();

  return (
    <View className="min-h-[64px] flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
        <Ionicons name={icon} size={18} color="#16a34a" />
      </View>
      <View className="flex-1 gap-0.5">
        <ThemedText className="font-semibold">{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
      <Switch
        accessibilityLabel={label}
        onValueChange={onValueChange}
        thumbColor="#ffffff"
        trackColor={{ false: theme.backgroundSelected, true: '#16a34a' }}
        value={value}
      />
    </View>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <ThemedView type="backgroundElement" className="rounded-3xl border border-[#eef2f6] px-5 py-2">
      <View className="mb-1 mt-3 gap-0.5">
        <ThemedText className="text-[15px] font-bold">{title}</ThemedText>
        {description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </ThemedView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words';
}) {
  const theme = useTheme();

  return (
    <View className="mb-3 gap-2">
      <ThemedText type="small" themeColor="textSecondary" className="font-semibold">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        className="rounded-xl border border-[#e2e8f0] bg-background px-4 py-3 text-base text-content"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  const [name, setName] = useState('Albert Kay');
  const [email, setEmail] = useState('albert@example.com');
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);

  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const initials = useMemo(() => {
    const parts = draftName.trim().split(/\s+/).filter(Boolean);
    const value = parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
    return value || 'A';
  }, [draftName]);

  const isDirty =
    draftName.trim() !== name || draftEmail.trim() !== email || draftPhone.trim() !== phone;

  const saveProfile = () => {
    if (!draftName.trim() || !/\S+@\S+\.\S+/.test(draftEmail.trim())) {
      Alert.alert('Check your details', 'Enter your name and a valid email address.');
      return;
    }

    setName(draftName.trim());
    setEmail(draftEmail.trim());
    setPhone(draftPhone.trim());
    Alert.alert('Profile updated', 'Your changes have been saved.');
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <View className="mb-4 h-11 flex-row items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full border border-[#eef2f6]"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
              style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
              <Ionicons name="chevron-back" size={20} color={theme.text} />
            </Pressable>
            <View className="flex-1 items-center">
              <ThemedText className="text-[18px] font-bold">Settings</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Manage your account
              </ThemedText>
            </View>
            <View className="h-10 w-10" />
          </View>

          <View className="mb-4 flex-row rounded-2xl bg-element p-1">
            {TABS.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
                  className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                    active ? 'bg-background' : ''
                  }`}>
                  <Ionicons
                    name={tab.icon}
                    size={15}
                    color={active ? '#16a34a' : theme.textSecondary}
                  />
                  <ThemedText
                    type="small"
                    className={`font-semibold ${active ? 'text-brand-600' : ''}`}
                    themeColor={active ? undefined : 'textSecondary'}>
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {activeTab === 'profile' ? (
                <>
                  <View className="items-center pb-1 pt-2">
                    <View className="mb-3 h-[88px] w-[88px] items-center justify-center rounded-full bg-brand-100">
                      <ThemedText className="text-[30px] font-extrabold text-brand-600">
                        {initials}
                      </ThemedText>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Change profile photo"
                      onPress={() =>
                        Alert.alert('Profile photo', 'Photo uploads are coming soon.')
                      }
                      style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
                      <ThemedText type="small" className="font-semibold text-brand-600">
                        Change photo
                      </ThemedText>
                    </Pressable>
                  </View>

                  <Section title="Personal information" description="This is how we reach you.">
                    <View className="mt-3">
                      <Field
                        autoCapitalize="words"
                        label="Full name"
                        onChangeText={setDraftName}
                        placeholder="Your name"
                        value={draftName}
                      />
                      <Field
                        autoCapitalize="none"
                        keyboardType="email-address"
                        label="Email address"
                        onChangeText={setDraftEmail}
                        placeholder="you@example.com"
                        value={draftEmail}
                      />
                      <Field
                        keyboardType="phone-pad"
                        label="Phone number"
                        onChangeText={setDraftPhone}
                        placeholder="+971 50 000 0000"
                        value={draftPhone}
                      />
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ disabled: !isDirty }}
                      className={`mb-3 mt-1 items-center rounded-xl py-3 ${
                        isDirty ? 'bg-brand-500' : 'bg-selected'
                      }`}
                      disabled={!isDirty}
                      onPress={saveProfile}
                      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                      <ThemedText
                        className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                        themeColor={isDirty ? undefined : 'textSecondary'}>
                        Save changes
                      </ThemedText>
                    </Pressable>
                  </Section>

                  <Section title="Account">
                    <SettingsRow
                      icon="lock-closed-outline"
                      label="Change password"
                      onPress={() => setActiveTab('security')}
                    />
                    <SettingsRow
                      icon="notifications-outline"
                      label="Notification preferences"
                      onPress={() => setActiveTab('notifications')}
                    />
                    <SettingsRow
                      icon="trash-outline"
                      label="Delete account"
                      onPress={() =>
                        Alert.alert(
                          'Delete account',
                          'This will permanently remove your account and order history.',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive' },
                          ],
                        )
                      }
                      tone="danger"
                    />
                  </Section>
                </>
              ) : null}

              {activeTab === 'notifications' ? (
                <>
                  <Section title="Order updates" description="Keep up with your deliveries.">
                    <ToggleRow
                      description="Status changes and delivery reminders"
                      icon="bag-check-outline"
                      label="Order updates"
                      onValueChange={setOrderUpdates}
                      value={orderUpdates}
                    />
                    <ToggleRow
                      description="Text messages for time-sensitive updates"
                      icon="chatbubble-ellipses-outline"
                      label="SMS alerts"
                      onValueChange={setSmsAlerts}
                      value={smsAlerts}
                    />
                  </Section>

                  <Section title="Deals and news" description="Choose what lands in your inbox.">
                    <ToggleRow
                      description="Weekly offers and fresh deals"
                      icon="pricetag-outline"
                      label="Offers"
                      onValueChange={setOffers}
                      value={offers}
                    />
                    <ToggleRow
                      description="Product news and seasonal recipes"
                      icon="mail-outline"
                      label="Newsletter"
                      onValueChange={setNewsletter}
                      value={newsletter}
                    />
                  </Section>
                </>
              ) : null}

              {activeTab === 'security' ? (
                <>
                  <Section title="Sign-in" description="Protect access to your account.">
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
                  </Section>

                  <Section title="Sessions">
                    <SettingsRow
                      icon="phone-portrait-outline"
                      label="This device"
                      value="Active now"
                      onPress={() => Alert.alert('This device', 'You are signed in on this device.')}
                    />
                    <SettingsRow
                      icon="laptop-outline"
                      label="Sign out other devices"
                      onPress={() =>
                        Alert.alert('Signed out', 'All other devices have been signed out.')
                      }
                    />
                  </Section>
                </>
              ) : null}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
