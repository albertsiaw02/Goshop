import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type ProfileRowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
};

function ProfileRow({ icon, label, value, onPress }: ProfileRowProps) {
  const theme = useTheme();
  const content = (
    <>
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
        <Ionicons name={icon} size={20} color="#16a34a" />
      </View>
      <ThemedText className="flex-1">{label}</ThemedText>
      {value ? (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      ) : null}
      {onPress ? <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        className="min-h-[58px] flex-row items-center gap-3"
        onPress={onPress}
        style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
        {content}
      </Pressable>
    );
  }

  return <View className="min-h-[58px] flex-row items-center gap-3">{content}</View>;
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <ThemedView type="backgroundElement" className="rounded-3xl border border-[#eef2f6] px-5 py-3">
      <ThemedText type="smallBold" className="mb-1 mt-2 text-[16px]">
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const [name, setName] = useState('Albert Kay');
  const [email, setEmail] = useState('albert@example.com');
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [editing, setEditing] = useState(false);

  const startEditing = () => {
    setDraftName(name);
    setDraftEmail(email);
    setEditing(true);
  };

  const saveProfile = () => {
    if (!draftName.trim() || !draftEmail.trim() || !draftEmail.includes('@')) {
      Alert.alert('Check your details', 'Enter a name and a valid email address.');
      return;
    }

    setName(draftName.trim());
    setEmail(draftEmail.trim());
    setEditing(false);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[800px] self-center gap-5 px-5 pb-8 pt-7"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="items-center pb-3 pt-2">
          <View className="mb-3 h-[92px] w-[92px] items-center justify-center rounded-full bg-[#dcfce7]">
            <Ionicons name="person" size={46} color="#16a34a" />
          </View>
          <ThemedText className="text-[25px] font-bold leading-8">{name}</ThemedText>
          <ThemedText themeColor="textSecondary" className="mt-1">
            {email}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            className="mt-5 min-w-[150px] items-center rounded-full border border-[#16a34a] px-6 py-2.5"
            onPress={startEditing}
            style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
            <ThemedText className="font-semibold text-[#15803d]">Edit profile</ThemedText>
          </Pressable>
        </View>

        <ProfileSection title="Shopping">
          <ProfileRow
            icon="receipt-outline"
            label="My orders"
            onPress={() => router.push('/orders')}
          />
          <ProfileRow icon="card-outline" label="Payment methods" value="Visa •••• 4242" />
        </ProfileSection>

        <ProfileSection title="Preferences">
          <ProfileRow
            icon="settings-outline"
            label="Account settings"
            onPress={() => router.push('/settings')}
          />
          <ProfileRow icon="location-outline" label="Delivery address" value="Home" />
          <ProfileRow icon="notifications-outline" label="Notifications" value="On" />
          <ProfileRow icon="language-outline" label="Language" value="English" />
        </ProfileSection>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(onboarding)')}
          style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
          <ThemedView
            type="backgroundElement"
            className="min-h-[58px] flex-row items-center gap-3 rounded-2xl px-5">
            <Ionicons name="log-out-outline" size={20} color="#d64545" />
            <ThemedText className="font-semibold text-danger">Sign out</ThemedText>
          </ThemedView>
        </Pressable>
      </ScrollView>

      <Modal
        visible={editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(false)}>
        <KeyboardAvoidingView
          className="flex-1 justify-center bg-black/40 px-5"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ThemedView type="background" className="w-full max-w-[480px] self-center rounded-3xl p-6">
            <ThemedText type="smallBold" className="mb-5 text-[20px]">
              Edit profile
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" className="mb-2">
              Name
            </ThemedText>
            <TextInput
              accessibilityLabel="Name"
              autoCapitalize="words"
              className="mb-4 rounded-xl border border-[#e2e8f0] bg-element px-4 py-3 text-base text-content"
              onChangeText={setDraftName}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
              value={draftName}
            />
            <ThemedText type="small" themeColor="textSecondary" className="mb-2">
              Email
            </ThemedText>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              className="mb-6 rounded-xl border border-[#e2e8f0] bg-element px-4 py-3 text-base text-content"
              keyboardType="email-address"
              onChangeText={setDraftEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.textSecondary}
              value={draftEmail}
            />
            <View className="flex-row gap-3">
              <Pressable
                accessibilityRole="button"
                className="flex-1 items-center rounded-xl border border-[#16a34a] py-3"
                onPress={() => setEditing(false)}>
                <ThemedText className="font-semibold text-[#15803d]">Cancel</ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="flex-1 items-center rounded-xl bg-brand-500 py-3"
                onPress={saveProfile}>
                <ThemedText className="font-semibold text-white">Save</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}
