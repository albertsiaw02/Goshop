import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, Switch, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <ThemedView type="backgroundElement" className="rounded-3xl border border-border px-5 py-2">
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

export function SettingsField({
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
        className="rounded-xl border border-border bg-background px-4 py-3 text-base text-content"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
      />
    </View>
  );
}

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
          danger ? 'bg-danger-soft' : 'bg-brand-soft'
        }`}>
        <Ionicons name={icon} size={18} color={danger ? '#dc2626' : theme.brandInk} />
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
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
        <Ionicons name={icon} size={18} color={theme.brandInk} />
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
