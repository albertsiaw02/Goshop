import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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
  const content = (
    <>
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-background">
        <Ionicons name={icon} size={20} color={theme.brandInk} />
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
    <ThemedView type="backgroundElement" className="rounded-3xl border border-border px-5 py-3">
      <ThemedText type="smallBold" className="mb-1 mt-2 text-[16px]">
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { defaultMethod } = usePaymentMethods();
  const { language } = useLanguage();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 24) + 80,
            gap: 20,
            paddingHorizontal: 20,
            paddingTop: 12,
            maxWidth: 760,
            width: '100%',
            alignSelf: 'center',
          }}
          showsVerticalScrollIndicator={false}>
          {/* Nice Modern Avatar Card */}
          <ThemedView
            type="backgroundElement"
            className="items-center rounded-3xl border border-border px-6 py-6 shadow-sm">
            <View className="relative mb-3">
              <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-brand-soft shadow-md">
                <ThemedText className="text-[34px] font-extrabold leading-10 text-brand-ink">
                  {INITIALS}
                </ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile in settings"
                onPress={() => router.push('/settings')}
                className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-brand-500 shadow"
                style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
                <Ionicons name="camera" size={14} color="#ffffff" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-1.5">
              <ThemedText className="text-[24px] font-bold tracking-tight">
                {PROFILE.name}
              </ThemedText>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            </View>

            <ThemedText themeColor="textSecondary" className="mt-0.5 text-sm">
              {PROFILE.email}
            </ThemedText>

            <View className="mt-3 flex-row items-center gap-2">
              <View className="flex-row items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1">
                <View className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                <ThemedText className="text-[10px] font-bold uppercase tracking-wider text-brand-ink">
                  Verified Member
                </ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Manage settings"
                onPress={() => router.push('/settings')}
                className="rounded-full border border-border bg-background px-3 py-1"
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
                <ThemedText className="text-xs font-semibold text-brand-ink">
                  Edit Details
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

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
              icon="settings-outline"
              label="Settings"
              value="Account, security, appearance"
              onPress={() => router.push('/settings')}
            />
            <ProfileRow
              icon="location-outline"
              label="Delivery address"
              value="Home"
              onPress={() => router.push('/delivery')}
            />
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
              className="min-h-[58px] flex-row items-center gap-3 rounded-2xl border border-border px-5">
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <ThemedText className="font-semibold text-danger">Sign out</ThemedText>
            </ThemedView>
          </Pressable>
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
