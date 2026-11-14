import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import type { ComponentProps, ComponentRef } from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import {
  SettingsField,
  SettingsRow,
  SettingsSection,
  ToggleRow,
} from '@/components/settings-rows';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/store/language';
import { getPaymentMethodLabel, usePaymentMethods } from '@/store/payment-methods';
import { useThemePreference } from '@/store/theme';

type TabKey = 'personal' | 'security' | 'appearance';

type TabItem = {
  key: TabKey;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

const SETTINGS_TABS: TabItem[] = [
  { key: 'personal', label: 'Personal', icon: 'person-outline' },
  { key: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
  { key: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { themes, preference, setTheme } = useThemePreference();
  const { language } = useLanguage();
  const { defaultMethod } = usePaymentMethods();

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  // Initial tab selection (can be deep-linked via ?tab=security or ?tab=appearance)
  const initialTab: TabKey =
    params.tab === 'security' || params.tab === 'appearance'
      ? params.tab
      : 'personal';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Profile data
  const [name, setName] = useState('Albert Kay');
  const [email, setEmail] = useState('albert@example.com');
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);

  // Security preferences
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const initials = useMemo(() => {
    const parts = (isEditing ? draftName : name).trim().split(/\s+/).filter(Boolean);
    const value = parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
    return value || 'A';
  }, [isEditing, draftName, name]);

  const isDirty =
    draftName.trim() !== name ||
    draftEmail.trim() !== email ||
    draftPhone.trim() !== phone;

  const toggleEditor = () => {
    if (isEditing) {
      setDraftName(name);
      setDraftEmail(email);
      setDraftPhone(phone);
      setIsEditing(false);
      return;
    }

    if (activeTab !== 'personal') {
      setActiveTab('personal');
    }
    setIsEditing(true);
  };

  const cancelEditor = () => {
    setDraftName(name);
    setDraftEmail(email);
    setDraftPhone(phone);
    setIsEditing(false);
  };

  const saveProfile = () => {
    if (!draftName.trim() || !/\S+@\S+\.\S+/.test(draftEmail.trim())) {
      Alert.alert(
        'Check your details',
        'Please enter your full name and a valid email address.',
      );
      return;
    }

    setName(draftName.trim());
    setEmail(draftEmail.trim());
    setPhone(draftPhone.trim());
    setIsEditing(false);
    Alert.alert('Profile updated', 'Your changes have been saved successfully.');
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an action to update your profile photo:',
      [
        {
          text: 'Take photo',
          onPress: () =>
            Alert.alert('Camera', 'Camera upload will be available soon.'),
        },
        {
          text: 'Choose from library',
          onPress: () =>
            Alert.alert('Photos', 'Photo selection will be available soon.'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <ThemedView className="flex-1">
      {/* Safe Area View handling top notch / dynamic island */}
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <View className="w-full max-w-[760px] flex-1 self-center px-5 pt-2">
          {/* Clean Screen Header */}
          <ScreenHeader
            fallback="/(tabs)"
            subtitle="Account, security and appearance"
            title="Settings"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              ref={scrollRef}
              className="flex-1"
              contentContainerStyle={{
                gap: 16,
                paddingBottom: Math.max(insets.bottom, 20) + 36,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Nice Modern Avatar & Profile Header Section */}
              <View className="overflow-hidden rounded-3xl border border-border bg-element/70 shadow-sm">
                {/* Subtle soft gradient banner accent */}
                <LinearGradient
                  colors={[
                    'rgba(22, 163, 74, 0.22)',
                    'rgba(22, 163, 74, 0.04)',
                    'transparent',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ height: 68 }}
                />

                <View className="px-5 pb-5">
                  <View className="-mt-10 flex-row items-end justify-between">
                    {/* Avatar with Camera badge */}
                    <View className="relative">
                      <View className="h-[84px] w-[84px] items-center justify-center rounded-full border-4 border-background bg-brand-soft shadow-md">
                        <ThemedText className="text-[28px] font-extrabold text-brand-ink">
                          {initials}
                        </ThemedText>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Change profile photo"
                        className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-brand-500 shadow"
                        onPress={handleAvatarPress}
                        style={({ pressed }) =>
                          pressed
                            ? { opacity: 0.75, transform: [{ scale: 0.95 }] }
                            : undefined
                        }
                      >
                        <Ionicons name="camera" size={14} color="#ffffff" />
                      </Pressable>
                    </View>

                    {/* Quick Edit Profile Button */}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        isEditing ? 'Cancel editing' : 'Edit profile details'
                      }
                      className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 border ${
                        isEditing
                          ? 'border-border bg-background'
                          : 'border-brand-500/30 bg-brand-soft/80'
                      }`}
                      onPress={toggleEditor}
                      style={({ pressed }) =>
                        pressed ? { opacity: 0.75 } : undefined
                      }
                    >
                      <Ionicons
                        name={isEditing ? 'close' : 'create-outline'}
                        size={15}
                        color={isEditing ? theme.textSecondary : theme.brandInk}
                      />
                      <ThemedText
                        className={`text-xs font-bold ${
                          isEditing ? 'text-muted' : 'text-brand-ink'
                        }`}
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </ThemedText>
                    </Pressable>
                  </View>

                  {/* Profile Identity Details */}
                  <View className="mt-3.5">
                    <View className="flex-row items-center gap-2">
                      <ThemedText className="text-[22px] font-bold tracking-tight">
                        {name}
                      </ThemedText>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16a34a"
                      />
                    </View>

                    {/* Verified & Plan status badges */}
                    <View className="mt-1.5 flex-row items-center gap-2">
                      <View className="flex-row items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5">
                        <View className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        <ThemedText className="text-[10px] font-bold uppercase tracking-wider text-brand-ink">
                          Verified Member
                        </ThemedText>
                      </View>
                      <ThemedText type="small" themeColor="textSecondary">
                        • Standard Account
                      </ThemedText>
                    </View>

                    {/* Contact Badges */}
                    <View className="mt-3.5 flex-row flex-wrap gap-2">
                      <View className="flex-row items-center gap-1.5 rounded-xl border border-border bg-background/90 px-3 py-1.5">
                        <Ionicons
                          name="mail-outline"
                          size={13}
                          color={theme.textSecondary}
                        />
                        <ThemedText type="small" themeColor="textSecondary">
                          {email}
                        </ThemedText>
                      </View>
                      <View className="flex-row items-center gap-1.5 rounded-xl border border-border bg-background/90 px-3 py-1.5">
                        <Ionicons
                          name="call-outline"
                          size={13}
                          color={theme.textSecondary}
                        />
                        <ThemedText type="small" themeColor="textSecondary">
                          {phone}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Segmented Tab Divisions */}
              <View className="flex-row rounded-2xl border border-border bg-element/80 p-1">
                {SETTINGS_TABS.map((tab) => {
                  const active = tab.key === activeTab;
                  return (
                    <Pressable
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={tab.label}
                      key={tab.key}
                      onPress={() => setActiveTab(tab.key)}
                      style={({ pressed }) =>
                        pressed ? { opacity: 0.75 } : undefined
                      }
                      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                        active ? 'bg-background' : ''
                      }`}
                    >
                      <Ionicons
                        name={tab.icon}
                        size={16}
                        color={active ? theme.brandInk : theme.textSecondary}
                      />
                      <ThemedText
                        className={`text-xs font-semibold ${
                          active ? 'font-bold text-brand-ink' : ''
                        }`}
                        themeColor={active ? undefined : 'textSecondary'}
                      >
                        {tab.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {/* TAB 1: PERSONAL / PROFILE */}
              {activeTab === 'personal' && (
                <>
                  {isEditing ? (
                    <SettingsSection
                      title="Edit Personal Information"
                      description="Update the contact details associated with your account."
                    >
                      <View className="mt-3">
                        <SettingsField
                          autoCapitalize="words"
                          icon="person-outline"
                          label="Full name"
                          onChangeText={setDraftName}
                          placeholder="Your full name"
                          value={draftName}
                        />
                        <SettingsField
                          autoCapitalize="none"
                          icon="mail-outline"
                          keyboardType="email-address"
                          label="Email address"
                          onChangeText={setDraftEmail}
                          placeholder="you@example.com"
                          value={draftEmail}
                        />
                        <SettingsField
                          icon="call-outline"
                          keyboardType="phone-pad"
                          label="Phone number"
                          onChangeText={setDraftPhone}
                          placeholder="+971 50 000 0000"
                          value={draftPhone}
                        />
                      </View>

                      {/* Action buttons */}
                      <View className="mb-2 mt-2 flex-row items-center gap-3">
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Cancel editing"
                          className="rounded-xl border border-border bg-background px-4 py-3"
                          onPress={cancelEditor}
                          style={({ pressed }) =>
                            pressed ? { opacity: 0.7 } : undefined
                          }
                        >
                          <ThemedText className="font-semibold" themeColor="textSecondary">
                            Cancel
                          </ThemedText>
                        </Pressable>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ disabled: !isDirty }}
                          className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                            isDirty ? 'bg-brand-500' : 'bg-selected'
                          }`}
                          disabled={!isDirty}
                          onPress={saveProfile}
                          style={({ pressed }) =>
                            pressed ? { opacity: 0.85 } : undefined
                          }
                        >
                          <Ionicons
                            name="checkmark-outline"
                            size={16}
                            color={isDirty ? '#ffffff' : theme.textSecondary}
                          />
                          <ThemedText
                            className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                            themeColor={isDirty ? undefined : 'textSecondary'}
                          >
                            Save changes
                          </ThemedText>
                        </Pressable>
                      </View>
                    </SettingsSection>
                  ) : (
                    <SettingsSection
                      title="Personal information"
                      description="Your contact details and delivery preferences."
                    >
                      <SettingsRow
                        icon="person-outline"
                        label="Full name"
                        value={name}
                        onPress={toggleEditor}
                      />
                      <SettingsRow
                        icon="mail-outline"
                        label="Email address"
                        value={email}
                        onPress={toggleEditor}
                      />
                      <SettingsRow
                        icon="call-outline"
                        label="Phone number"
                        value={phone}
                        onPress={toggleEditor}
                      />
                      <SettingsRow
                        icon="location-outline"
                        label="Delivery address"
                        value="Home"
                        onPress={() => router.push('/delivery')}
                      />
                    </SettingsSection>
                  )}

                  <SettingsSection
                    title="Shopping & payment"
                    description="Connected methods and past orders."
                  >
                    <SettingsRow
                      icon="card-outline"
                      label="Payment method"
                      value={defaultMethod ? getPaymentMethodLabel(defaultMethod) : 'Add method'}
                      onPress={() => router.push('/payment-methods')}
                    />
                    <SettingsRow
                      icon="receipt-outline"
                      label="Order history"
                      value="View all"
                      onPress={() => router.push('/orders')}
                    />
                  </SettingsSection>

                  <SettingsSection title="Account">
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
                  </SettingsSection>
                </>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === 'security' && (
                <>
                  {/* Security Overview Shield Card */}
                  <View className="flex-row items-center gap-3.5 rounded-3xl border border-brand-500/30 bg-brand-soft/40 p-4">
                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-500">
                      <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <ThemedText className="font-bold text-brand-ink">
                        Account Protected
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        Two-factor verification and sessions are currently monitored.
                      </ThemedText>
                    </View>
                  </View>

                  <SettingsSection
                    title="Sign-in & Authentication"
                    description="Protect access to your account and devices."
                  >
                    <SettingsRow
                      icon="key-outline"
                      label="Change password"
                      value="Last updated 3 mos ago"
                      onPress={() =>
                        Alert.alert(
                          'Change password',
                          'A password reset link has been sent to your email.',
                        )
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

                  <SettingsSection
                    title="Active Sessions"
                    description="Review devices currently authorized on your account."
                  >
                    <SettingsRow
                      icon="phone-portrait-outline"
                      label="This device"
                      value="Active now"
                      onPress={() =>
                        Alert.alert('This device', 'You are currently active on this device.')
                      }
                    />
                    <SettingsRow
                      icon="laptop-outline"
                      label="Sign out other devices"
                      onPress={() =>
                        Alert.alert(
                          'Sign out devices',
                          'Are you sure you want to sign out of all other devices?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Sign out',
                              style: 'destructive',
                              onPress: () =>
                                Alert.alert('Signed out', 'All other devices have been signed out.'),
                            },
                          ],
                        )
                      }
                    />
                  </SettingsSection>
                </>
              )}

              {/* TAB 3: APPEARANCE & PREFERENCES */}
              {activeTab === 'appearance' && (
                <>
                  <SettingsSection
                    title="Appearance"
                    description="Choose how GoShop looks on your device."
                  >
                    {themes.map((option) => {
                      const active = option.key === preference;
                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ selected: active }}
                          accessibilityLabel={option.label}
                          key={option.key}
                          onPress={() => setTheme(option.key)}
                          style={({ pressed }) =>
                            pressed ? { opacity: 0.65 } : undefined
                          }
                          className="min-h-[56px] flex-row items-center gap-3"
                        >
                          <View
                            className={`h-9 w-9 items-center justify-center rounded-xl ${
                              active ? 'bg-brand-500' : 'bg-brand-soft'
                            }`}
                          >
                            <Ionicons
                              name={option.icon}
                              size={16}
                              color={active ? '#ffffff' : theme.brandInk}
                            />
                          </View>
                          <View className="flex-1 gap-0.5">
                            <ThemedText className="font-semibold">{option.label}</ThemedText>
                            <ThemedText type="small" themeColor="textSecondary">
                              {option.description}
                            </ThemedText>
                          </View>
                          <Ionicons
                            name={active ? 'checkmark-circle' : 'ellipse-outline'}
                            size={22}
                            color={active ? theme.brandInk : theme.textSecondary}
                          />
                        </Pressable>
                      );
                    })}
                  </SettingsSection>

                  <SettingsSection
                    title="Regional & Notifications"
                    description="Language and notification preferences."
                  >
                    <SettingsRow
                      icon="language-outline"
                      label="Language"
                      value={language.label}
                      onPress={() => router.push('/language')}
                    />
                    <SettingsRow
                      icon="notifications-outline"
                      label="Notifications"
                      value="Manage"
                      onPress={() => router.push('/notifications')}
                    />
                  </SettingsSection>

                  <View className="flex-row items-center justify-center gap-2 py-1">
                    <Ionicons
                      name="information-circle-outline"
                      size={15}
                      color={theme.textSecondary}
                    />
                    <ThemedText type="small" themeColor="textSecondary">
                      System default follows your device display settings.
                    </ThemedText>
                  </View>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
