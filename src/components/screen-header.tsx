import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  fallback?: Href;
  trailing?: ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  fallback = '/profile',
  trailing,
}: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View className="mb-4 h-11 flex-row items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="h-10 w-10 items-center justify-center rounded-full border border-[#eef2f6]"
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
        style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}>
        <Ionicons name="chevron-back" size={20} color={theme.text} />
      </Pressable>
      <View className="flex-1 items-center">
        <ThemedText className="text-[18px] font-bold">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <View className="h-10 w-10 items-center justify-end">{trailing}</View>
    </View>
  );
}
