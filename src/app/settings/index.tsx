import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ComponentRef } from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
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
} from '@/components/settings-rows';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemePreference } from '@/store/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { themes, preference } = useThemePreference();
  const themeLabel = themes.find((option) => option.key === preference)?.label;
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const personalInfoY = useRef(0);

  const [name, setName] = useState('Albert Kay');
  const [email, setEmail] = useState('albert@example.com');
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);

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

    setIsEditing(true);
  };

  const saveProfile = () => {
    if (!draftName.trim() || !/\S+@\S+\.\S+/.test(draftEmail.trim())) {
      Alert.alert(
        'Check your details',
        'Enter your name and a valid email address.',
      );
      return;
    }

    setName(draftName.trim());
    setEmail(draftEmail.trim());
    setPhone(draftPhone.trim());
    setIsEditing(false);
    Alert.alert('Profile updated', 'Your changes have been saved.');
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/profile"
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
                paddingBottom: insets.bottom + 32,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="overflow-hidden rounded-[28px] border border-border">
                <ImageBackground
                  source={require('../../../assets/images/onboardimg2.jpg')}
                  resizeMode="cover"
                  style={{ height: 112 }}
                >
                  <LinearGradient
                    colors={['rgba(7, 45, 28, 0.2)', 'rgba(5, 37, 22, 0.72)']}
                    style={{
                      flex: 1,
                      justifyContent: 'flex-start',
                      padding: 16,
                    }}
                  >
                    <View className="flex-row items-center gap-2 self-start rounded-full border border-white/25 bg-black/20 px-3 py-1.5">
                      <Ionicons
                        name="person-circle-outline"
                        size={16}
                        color="#ffffff"
                      />
                      <ThemedText className="text-[11px] font-bold uppercase tracking-[1.2px] text-white">
                        Profile
                      </ThemedText>
                    </View>
                  </LinearGradient>
                </ImageBackground>

                <ThemedView type="backgroundElement" className="px-5 pb-5">
                  <View className="flex-row items-end justify-between">
                    <View className="relative -mt-10">
                      <View className="h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-element bg-brand-soft shadow-md">
                        <ThemedText className="text-[27px] font-extrabold text-brand-ink">
                          {initials}
                        </ThemedText>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Change profile photo"
                        className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-element bg-brand-500"
                        onPress={() =>
                          Alert.alert(
                            'Profile photo',
                            'Photo uploads are coming soon.',
                          )
                        }
                        style={({ pressed }) =>
                          pressed ? { opacity: 0.75 } : undefined
                        }
                      >
                        <Ionicons name="camera" size={14} color="#ffffff" />
                      </Pressable>
                    </View>
                  </View>

                  {!isEditing ? (
                    <>
                      <View className="mt-3">
                        <ThemedText type="small" themeColor="textSecondary">
                          Hello,
                        </ThemedText>
                        <ThemedText className="text-[22px] font-bold leading-7">
                          {name}
                        </ThemedText>
                      </View>

                      <View className="mt-4 gap-3">
                        <View className="flex-row items-center gap-3">
                          <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                            <Ionicons
                              name="mail-outline"
                              size={17}
                              color="#15803d"
                            />
                          </View>
                          <ThemedText
                            type="small"
                            themeColor="textSecondary"
                            className="flex-1"
                          >
                            {email}
                          </ThemedText>
                        </View>
                        <View className="flex-row items-center gap-3">
                          <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                            <Ionicons
                              name="call-outline"
                              size={17}
                              color="#15803d"
                            />
                          </View>
                          <ThemedText
                            type="small"
                            themeColor="textSecondary"
                            className="flex-1"
                          >
                            {phone}
                          </ThemedText>
                        </View>
                      </View>
                    </>
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      isEditing
                        ? 'Close profile editor'
                        : 'Edit profile details'
                    }
                    className="mt-5 min-h-11 flex-row items-center justify-center gap-2 rounded-xl bg-brand-500 px-4"
                    onPress={toggleEditor}
                    style={({ pressed }) =>
                      pressed ? { opacity: 0.85 } : undefined
                    }
                  >
                    <Ionicons
                      name={isEditing ? 'close-outline' : 'create-outline'}
                      size={17}
                      color="#ffffff"
                    />
                    <ThemedText className="font-semibold text-white">
                      {isEditing ? 'Close editor' : 'Edit profile'}
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </View>

              {isEditing ? (
                <View
                  onLayout={(event) => {
                    personalInfoY.current = event.nativeEvent.layout.y;
                    scrollRef.current?.scrollTo({
                      y: personalInfoY.current,
                      animated: true,
                    });
                  }}
                >
                  <SettingsSection
                    title="Personal information"
                    description="Update the details associated with your account."
                  >
                    <View className="mt-3">
                      <SettingsField
                        autoCapitalize="words"
                        label="Full name"
                        onChangeText={setDraftName}
                        placeholder="Your name"
                        value={draftName}
                      />
                      <SettingsField
                        autoCapitalize="none"
                        keyboardType="email-address"
                        label="Email address"
                        onChangeText={setDraftEmail}
                        placeholder="you@example.com"
                        value={draftEmail}
                      />
                      <SettingsField
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
                      style={({ pressed }) =>
                        pressed ? { opacity: 0.85 } : undefined
                      }
                    >
                      <ThemedText
                        className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                        themeColor={isDirty ? undefined : 'textSecondary'}
                      >
                        Save changes
                      </ThemedText>
                    </Pressable>
                  </SettingsSection>
                </View>
              ) : null}

              <SettingsSection
                title="Preferences"
                description="Tune GoShop to your taste."
              >
                <SettingsRow
                  icon="color-palette-outline"
                  label="Theme"
                  value={themeLabel}
                  onPress={() => router.push('/settings/theme')}
                />
                <SettingsRow
                  icon="shield-checkmark-outline"
                  label="Security"
                  value="Sign-in & sessions"
                  onPress={() => router.push('/settings/security')}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
