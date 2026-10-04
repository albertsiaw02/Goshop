import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function CheckoutScreen() {
  const theme = useTheme();
  const [address, setAddress] = useState('12 Fresh Lane, Downtown');
  const [payment, setPayment] = useState('Visa •••• 4242');

  const subtotal = 24.5;
  const delivery = 2.5;
  const total = subtotal + delivery;

  const placeOrder = () => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    router.replace({ pathname: '/order-tracking/[id]', params: { id: orderId, placed: '1' } });
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-8 p-6">
          <View className="gap-2">
            <Text className="mb-0.5 text-base font-bold text-content dark:text-content-dark">
              Delivery Address
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={theme.textSecondary}
              className="rounded-lg bg-element px-4 py-4 text-base text-content dark:bg-element-dark dark:text-content-dark"
            />
          </View>

          <View className="gap-2">
            <Text className="mb-0.5 text-base font-bold text-content dark:text-content-dark">
              Payment
            </Text>
            <TextInput
              value={payment}
              onChangeText={setPayment}
              placeholderTextColor={theme.textSecondary}
              className="rounded-lg bg-element px-4 py-4 text-base text-content dark:bg-element-dark dark:text-content-dark"
            />
          </View>

          <View className="gap-2">
            <Text className="mb-0.5 text-base font-bold text-content dark:text-content-dark">
              Order Summary
            </Text>
            <View className="flex-row justify-between py-0.5">
              <ThemedText>Subtotal</ThemedText>
              <ThemedText>${subtotal.toFixed(2)}</ThemedText>
            </View>
            <View className="flex-row justify-between py-0.5">
              <ThemedText>Delivery</ThemedText>
              <ThemedText>${delivery.toFixed(2)}</ThemedText>
            </View>
            <View className="mb-4 flex-row justify-between pt-1">
              <ThemedText type="smallBold">Total</ThemedText>
              <ThemedText type="smallBold">${total.toFixed(2)}</ThemedText>
            </View>

            <Pressable
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
              onPress={placeOrder}>
              <View className="items-center rounded-3xl bg-brand-500 py-4">
                <Text className="text-[18px] font-bold text-white">Place Order</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}