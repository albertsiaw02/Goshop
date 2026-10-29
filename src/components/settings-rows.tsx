import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type SettingsRowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  tone?: 'default' | 'danger';
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  label,
  value,
  tone = 'default',
  onPress,
}: SettingsRowProps) {
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

type ToggleRowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
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
