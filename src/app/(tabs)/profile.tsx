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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { defaultMethod } = usePaymentMethods();
  const { language } = useLanguage();

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[800px] self-center gap-5 px-5 pb-8 pt-7"
        showsVerticalScrollIndicator={false}>
        <View className="items-center pb-3 pt-2">
          <View className="mb-3 h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border-4 border-background bg-brand-soft">
            <ThemedText className="text-[32px] font-extrabold leading-10 text-brand-ink">
              {INITIALS}
            </ThemedText>
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
