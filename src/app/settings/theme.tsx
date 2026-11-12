import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { SettingsSection } from '@/components/settings-rows';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference } from '@/store/theme';

export default function ThemeSettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { themes, preference, setTheme } = useThemePreference();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/settings"
            subtitle="Choose how GoShop looks"
            title="Theme"
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
            showsVerticalScrollIndicator={false}>
            <SettingsSection
              title="Appearance"
              description="Applies instantly across the app.">
              {themes.map((option) => {
                const active = option.key === preference;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={option.label}
                    key={option.key}
                    onPress={() => setTheme(option.key)}
                    style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}
                    className="min-h-[56px] flex-row items-center gap-3">
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-xl ${
                        active ? 'bg-brand-500' : 'bg-brand-soft'
                      }`}>
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

            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={theme.textSecondary}
              />
              <ThemedText type="small" themeColor="textSecondary">
                System default follows your device settings.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
