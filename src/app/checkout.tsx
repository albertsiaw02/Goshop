import { Ionicons } from '@expo/vector-icons';
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
        <View className="mx-auto w-full max-w-[800px] gap-5 p-6">
          <View className="gap-3 rounded-3xl border border-[#eef2f6] bg-white p-5">
            <ThemedText type="smallBold" className="text-[14px]">
              Delivery Address
            </ThemedText>
            <View className="flex-row items-center gap-3 rounded-2xl border border-[#eef2f6] bg-element px-4">
              <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholderTextColor={theme.textSecondary}
                className="flex-1 py-4 text-base text-content"
              />
            </View>
          </View>

          <View className="gap-3 rounded-3xl border border-[#eef2f6] bg-white p-5">
            <ThemedText type="smallBold" className="text-[14px]">
              Payment
            </ThemedText>
            <View className="flex-row items-center gap-3 rounded-2xl border border-[#eef2f6] bg-element px-4">
              <Ionicons name="card-outline" size={18} color={theme.textSecondary} />
              <TextInput
                value={payment}
                onChangeText={setPayment}
                placeholderTextColor={theme.textSecondary}
                className="flex-1 py-4 text-base text-content"
              />
            </View>
          </View>

          <View className="gap-3 rounded-3xl border border-[#eef2f6] bg-white p-5">
            <ThemedText type="smallBold" className="text-[14px]">
              Order Summary
            </ThemedText>
            <View className="flex-row justify-between py-0.5">
              <ThemedText themeColor="textSecondary">Subtotal</ThemedText>
              <ThemedText type="smallBold">${subtotal.toFixed(2)}</ThemedText>
            </View>
            <View className="flex-row justify-between py-0.5">
              <ThemedText themeColor="textSecondary">Delivery</ThemedText>
              <ThemedText type="smallBold">${delivery.toFixed(2)}</ThemedText>
            </View>
            <View className="mt-1 border-t border-[#eef2f6] pt-3">
              <View className="flex-row justify-between">
                <ThemedText className="font-extrabold text-[16px]">Total</ThemedText>
                <ThemedText className="font-extrabold text-[16px] text-brand-600">
                  ${total.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            onPress={placeOrder}>
            <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4">
              <Ionicons name="lock-closed-outline" size={17} color="#ffffff" />
              <Text className="text-[16px] font-bold text-white">Place Order</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
