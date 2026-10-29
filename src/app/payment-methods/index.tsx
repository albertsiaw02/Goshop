import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaymentMethodVisual } from '@/components/payment-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPaymentMethodLabel, usePaymentMethods } from '@/store/payment-methods';

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { methods } = usePaymentMethods();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/profile"
            subtitle={`${methods.length} saved ${methods.length === 1 ? 'method' : 'methods'}`}
            title="Payment methods"
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 14, paddingBottom: insets.bottom + 32 }}
            showsVerticalScrollIndicator={false}>
            {methods.length === 0 ? (
              <View className="items-center gap-3 rounded-3xl border border-[#eef2f6] bg-element px-6 py-12">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                  <Ionicons name="card-outline" size={30} color="#16a34a" />
                </View>
                <ThemedText className="text-[17px] font-bold">No payment methods yet</ThemedText>
                <ThemedText themeColor="textSecondary" className="text-center">
                  Add a card or mobile money account to check out faster.
                </ThemedText>
              </View>
            ) : (
              <>
                {methods.map((method) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${getPaymentMethodLabel(method)}`}
                    accessibilityHint="Opens payment method details"
                    key={method.id}
                    onPress={() =>
                      router.push({
                        pathname: '/payment-methods/[id]',
                        params: { id: method.id },
                      })
                    }
                    style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
                    <PaymentMethodVisual method={method} />
                  </Pressable>
                ))}
                <ThemedText type="small" themeColor="textSecondary" className="text-center">
                  Tap a payment method to edit it or change your default.
                </ThemedText>
              </>
            )}

            <View className="flex-row gap-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add card"
                className="min-h-[56px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-500 bg-brand-50/60 px-3"
                onPress={() => router.push('/payment-methods/add')}
                style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
                <Ionicons name="card-outline" size={19} color="#16a34a" />
                <ThemedText className="font-semibold text-brand-600">Add card</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add mobile money"
                className="min-h-[56px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-500 bg-brand-50/60 px-3"
                onPress={() => router.push('/payment-methods/add-mobile-money')}
                style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
                <Ionicons name="phone-portrait-outline" size={19} color="#16a34a" />
                <ThemedText className="font-semibold text-brand-600">Mobile money</ThemedText>
              </Pressable>
            </View>

            <View className="mt-2 flex-row items-center justify-center gap-2">
              <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
              <ThemedText type="small" themeColor="textSecondary">
                Payment details are encrypted and stored securely.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
