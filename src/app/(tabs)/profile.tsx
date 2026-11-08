import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  description: string;
  value?: string;
  onPress: () => void;
};

function ProfileRow({ icon, label, description, value, onPress }: ProfileRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}${value ? `, ${value}` : ''}`}
      className="min-h-[72px] flex-row items-center gap-3.5"
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-50">
        <Ionicons name={icon} size={21} color="#15803d" />
      </View>
      <View className="flex-1 gap-0.5">
        <ThemedText className="text-[14px] font-semibold">{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="text-[12px]">
          {description}
        </ThemedText>
      </View>
      <View className="max-w-[42%] flex-row items-center gap-1">
        {value ? (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            numberOfLines={1}
            className="text-right text-[12px]">
            {value}
          </ThemedText>
        ) : null}
        <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <View className="gap-2">
      <ThemedText className="px-1 text-[15px] font-bold">{title}</ThemedText>
      <ThemedView
        type="backgroundElement"
        className="rounded-[24px] border px-4"
        style={{ borderColor: theme.backgroundSelected }}>
        {children}
      </ThemedView>
    </View>
  );
}

function QuickLink({
  icon,
  label,
  description,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  description: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="min-h-[104px] flex-1 justify-between rounded-[22px] border p-4"
      style={({ pressed }) => [
        { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
        pressed ? { opacity: 0.7 } : undefined,
      ]}>
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-50">
        <Ionicons name={icon} size={20} color="#15803d" />
      </View>
      <View className="gap-0.5">
        <ThemedText className="text-[14px] font-bold">{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="text-[11px]">
          {description}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { defaultMethod } = usePaymentMethods();
  const { language } = useLanguage();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          <View className="mx-auto w-full max-w-[680px] gap-6 px-5 pt-3">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <ThemedText className="text-[26px] font-extrabold leading-8 tracking-tight">
                  My account
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Your details and preferences
                </ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
                onPress={() => router.push('/settings')}
                className="h-11 w-11 items-center justify-center rounded-full border border-[#eef2f6] bg-white"
                style={({ pressed }) => [
                  { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                  pressed ? { opacity: 0.65 } : undefined,
                ]}>
                <Ionicons name="create-outline" size={21} color={theme.text} />
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => router.push('/settings')}
              style={({ pressed }) => (pressed ? { opacity: 0.92 } : undefined)}>
              <LinearGradient
                colors={['#15803d', '#166534']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileCard}>
                <View style={styles.profileCardDecor} />
                <View className="flex-row items-center gap-4">
                  <View className="h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-white/40 bg-white/15">
                    <Text className="text-[22px] font-extrabold text-white">{INITIALS}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-white/75">
                      Welcome back
                    </Text>
                    <Text className="text-[21px] font-extrabold leading-7 text-white">
                      {PROFILE.name}
                    </Text>
                    <Text className="text-[13px] font-medium text-white/80">{PROFILE.email}</Text>
                  </View>
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Ionicons name="chevron-forward" size={18} color="#ffffff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>

            <View className="flex-row gap-3">
              <QuickLink
                icon="receipt-outline"
                label="My orders"
                description="Track your purchases"
                onPress={() => router.push('/orders')}
              />
              <QuickLink
                icon="card-outline"
                label="Payments"
                description="Manage your cards"
                onPress={() => router.push('/payment-methods')}
              />
            </View>

            <ProfileSection title="Account">
              <ProfileRow
                icon="location-outline"
                label="Delivery address"
                description="Where should we deliver?"
                value="Home"
                onPress={() => router.push('/delivery')}
              />
              <View className="h-px" style={{ backgroundColor: theme.backgroundSelected }} />
              <ProfileRow
                icon="card-outline"
                label="Payment methods"
                description="Your preferred way to pay"
                value={defaultMethod ? getPaymentMethodLabel(defaultMethod) : 'Add method'}
                onPress={() => router.push('/payment-methods')}
              />
            </ProfileSection>

            <ProfileSection title="Preferences">
              <ProfileRow
                icon="notifications-outline"
                label="Notifications"
                description="Choose what you hear from us"
                value="Manage"
                onPress={() => router.push('/notifications')}
              />
              <View className="h-px" style={{ backgroundColor: theme.backgroundSelected }} />
              <ProfileRow
                icon="language-outline"
                label="Language"
                description="App display language"
                value={language.label}
                onPress={() => router.push('/language')}
              />
            </ProfileSection>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/(onboarding)')}
              className="min-h-[58px] flex-row items-center justify-center gap-2 rounded-2xl border border-[#fee2e2]"
              style={({ pressed }) => [
                { backgroundColor: theme.backgroundElement },
                pressed ? { opacity: 0.65 } : undefined,
              ]}>
              <Ionicons name="log-out-outline" size={19} color="#dc2626" />
              <Text className="text-[14px] font-bold text-danger">Sign out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    overflow: 'hidden',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  profileCardDecor: {
    position: 'absolute',
    top: -38,
    right: -22,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
});
