import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/store/language';

export default function LanguageScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { languages, language, setLanguage } = useLanguage();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/profile"
            subtitle="Choose your app language"
            title="Language"
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
            showsVerticalScrollIndicator={false}>
            <ThemedView
              type="backgroundElement"
              className="rounded-3xl border border-[#eef2f6] px-5 py-2">
              <View className="mb-1 mt-3 gap-0.5">
                <ThemedText className="text-[15px] font-bold">App language</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Your choice applies across the whole app.
                </ThemedText>
              </View>

              {languages.map((item) => {
                const active = item.code === language.code;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${item.label}, ${item.nativeLabel}`}
                    key={item.code}
                    onPress={() => setLanguage(item.code)}
                    style={({ pressed }) => (pressed ? { opacity: 0.65 } : undefined)}
                    className="min-h-[56px] flex-row items-center gap-3">
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-xl ${
                        active ? 'bg-brand-500' : 'bg-brand-50'
                      }`}>
                      <ThemedText
                        type="smallBold"
                        className={`text-[12px] uppercase ${
                          active ? 'text-white' : 'text-brand-600'
                        }`}>
                        {item.code}
                      </ThemedText>
                    </View>
                    <View className="flex-1 gap-0.5">
                      <ThemedText className="font-semibold">{item.label}</ThemedText>
                      {item.nativeLabel !== item.label ? (
                        <ThemedText type="small" themeColor="textSecondary">
                          {item.nativeLabel}
                        </ThemedText>
                      ) : null}
                    </View>
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={active ? '#16a34a' : theme.textSecondary}
                    />
                  </Pressable>
                );
              })}
            </ThemedView>

            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="information-circle-outline" size={14} color="#94a3b8" />
              <ThemedText type="small" themeColor="textSecondary">
                More languages are on the way.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
