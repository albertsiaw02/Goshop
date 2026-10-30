import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/store/language';
import { getPaymentMethodLabel, usePaymentMethods } from '@/store/payment-methods';

const PROFILE = {
  name: 'Albert Kay',
  email: 'albert@example.com',
};

const INITIALS = PROFILE.name
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

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

function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
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
  const { defaultMethod } = usePaymentMethods();
  const { language } = useLanguage();

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[800px] self-center gap-5 px-5 pb-8 pt-7"
        showsVerticalScrollIndicator={false}>
        <View className="items-center pb-3 pt-2">
          <View className="mb-3 h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#dcfce7]">
            <ThemedText className="text-[32px] font-extrabold leading-10 text-brand-600">
              {INITIALS}
            </ThemedText>
          </View>
          <ThemedText className="text-[25px] font-bold leading-8">{PROFILE.name}</ThemedText>
          <ThemedText themeColor="textSecondary" className="mt-1">
            {PROFILE.email}
          </ThemedText>
        </View>

        <ProfileSection title="Shopping">
          <ProfileRow
            icon="receipt-outline"
            label="My orders"
            onPress={() => router.push('/orders')}
          />
          <ProfileRow
            icon="card-outline"
            label="Payment methods"
            value={defaultMethod ? getPaymentMethodLabel(defaultMethod) : 'Add method'}
            onPress={() => router.push('/payment-methods')}
          />
        </ProfileSection>

        <ProfileSection title="Preferences">
          <ProfileRow
            icon="person-circle-outline"
            label="Profile"
            onPress={() => router.push('/settings')}
          />
          <ProfileRow icon="location-outline" label="Delivery address" value="Home" />
          <ProfileRow
            icon="notifications-outline"
            label="Notifications"
            value="Manage"
            onPress={() => router.push('/notifications')}
          />
          <ProfileRow
            icon="language-outline"
            label="Language"
            value={language.label}
            onPress={() => router.push('/language')}
          />
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
    </ThemedView>
  );
}
