import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const STEPS = [
  { label: 'Order Placed', emoji: '✅' },
  { label: 'Packed', emoji: '📦' },
  { label: 'Out for Delivery', emoji: '🛵' },
  { label: 'Delivered', emoji: '🏠' },
];

export default function OrderTrackingScreen() {
  const { id, placed, status } = useLocalSearchParams<{
    id: string;
    placed?: string;
    status?: string;
  }>();

  let currentStep = 2;
  if (status === 'delivered') currentStep = 3;
  else if (placed === '1') currentStep = 0;
  else if (status === 'transit') currentStep = 2;

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ title: `Order ${id ?? ''}` }} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-4 p-6 pt-6">
          <ThemedText type="subtitle">Order {id}</ThemedText>
          <ThemedText themeColor="textSecondary" className="mb-4">
            Estimated delivery in 45 min
          </ThemedText>

          <ThemedView type="backgroundElement" className="rounded-3xl p-6">
            {STEPS.map((step, index) => {
              const done = index <= currentStep;
              const isLast = index === STEPS.length - 1;
              return (
                <View key={step.label} className="flex-row items-start gap-4">
                  <View className="w-8 items-center">
                    <View
                      className={`h-8 w-8 items-center justify-center rounded-full ${
                        done ? 'bg-brand-500' : 'bg-selected dark:bg-selected-dark'
                      }`}>
                      <Text className="text-[16px]">{step.emoji}</Text>
                    </View>
                    {!isLast && (
                      <View
                        className={`min-h-[34px] w-0.5 flex-1 ${
done ? 'bg-brand-500' : 'bg-selected dark:bg-selected-dark'
                        }`}
                      />
                    )}
                  </View>
                  <ThemedText
                    type={done ? 'smallBold' : 'small'}
                    themeColor={done ? 'text' : 'textSecondary'}
                    className="mb-[26px] pt-1">
                    {step.label}
                  </ThemedText>
                </View>
              );
            })}
          </ThemedView>

          <ThemedView type="backgroundElement" className="flex-row items-center gap-4 rounded-3xl p-4">
            <Text className="text-[34px]">🛵</Text>
            <View className="flex-1 gap-0.5">
              <ThemedText type="smallBold">Your courier is on the way</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Alex · 8 min away
              </ThemedText>
            </View>
            <Text className="font-bold text-brand-600">45 min</Text>
          </ThemedView>

          <View className="pt-4">
            <ThemedText themeColor="textSecondary">
              Need help? Contact support or view delivery details from the orders tab.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}