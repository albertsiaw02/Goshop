import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-3 p-6">
          <View className="flex-row items-center gap-4 pb-6 pt-4">
            <ThemedView type="backgroundElement" className="h-16 w-16 items-center justify-center rounded-full">
              <Text className="text-[30px]">👤</Text>
            </ThemedView>
            <View>
              <ThemedText type="smallBold">Albert Kay</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                albert@example.com
              </ThemedText>
            </View>
          </View>

          {[
            { label: 'Delivery Addresses', value: 'Home' },
            { label: 'Payment Methods', value: 'Visa •••• 4242' },
            { label: 'Notifications', value: 'On' },
          ].map((row) => (
            <ThemedView key={row.label} type="backgroundElement" className="flex-row items-center justify-between rounded-3xl p-4">
              <ThemedText>{row.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {row.value}
              </ThemedText>
            </ThemedView>
          ))}

          <Pressable
            style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            onPress={() => router.replace('/(onboarding)')}>
            <ThemedView type="backgroundElement" className="flex-row items-center justify-between rounded-3xl p-4">
              <Text className="font-bold text-danger">Sign Out</Text>
            </ThemedView>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}