import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductById } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

type CartItem = { id: string; qty: number };

const INITIAL: CartItem[] = [
  { id: '1', qty: 2 },
  { id: '7', qty: 1 },
  { id: '15', qty: 3 },
];

export default function CartScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<CartItem[]>(INITIAL);

  const setQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const rows = items
    .map((item) => ({ item, product: getProductById(item.id) }))
    .filter((r) => r.product);

  const subtotal = rows.reduce((sum, r) => sum + r.product!.price * r.item.qty, 0);
  const delivery = 2.5;
  const total = subtotal + delivery;

  return (
    <ThemedView className="flex-1">
      <View className="w-full max-w-[800px] flex-1 self-center p-6">
        <View className="mb-5 flex-row items-end justify-between pt-4">
          <ThemedText className="text-[26px] font-extrabold leading-8 tracking-tight text-content">
            My Cart
          </ThemedText>
          {rows.length > 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              {rows.length} {rows.length === 1 ? 'item' : 'items'}
            </ThemedText>
          )}
        </View>

        {rows.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-[60px]">🛒</Text>
            <ThemedText themeColor="textSecondary">Your cart is empty</ThemedText>
            <Pressable
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
              onPress={() => router.push('/browse')}>
              <View className="items-center rounded-2xl bg-brand-500 px-8 py-4">
                <Text className="text-[16px] font-bold text-white">Start Shopping</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <FlatList
              data={rows}
              keyExtractor={(r) => r.product!.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
              renderItem={({ item: r }) => (
                <View className="flex-row items-center gap-4 rounded-2xl border border-[#eef2f6] bg-white p-3.5">
                  <View
                    className="h-[62px] w-[62px] items-center justify-center rounded-2xl"
                    style={{ backgroundColor: theme.backgroundElement }}>
                    <Text className="text-[30px]">{r.product!.emoji}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <ThemedText type="smallBold" className="text-[14px]">
                      {r.product!.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {r.product!.weight}
                    </ThemedText>
                    <ThemedText type="smallBold" className="text-brand-600">
                      ${(r.product!.price * r.item.qty).toFixed(2)}
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center gap-3 rounded-full border border-[#eef2f6] bg-white px-1.5 py-1">
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                      className="h-7 w-7 items-center justify-center rounded-full"
                      onPress={() => setQty(r.product!.id, -1)}>
                      <Ionicons name="remove" size={16} color={theme.text} />
                    </Pressable>
                    <ThemedText type="smallBold">{r.item.qty}</ThemedText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                      className="h-7 w-7 items-center justify-center rounded-full bg-brand-500"
                      onPress={() => setQty(r.product!.id, 1)}>
                      <Ionicons name="add" size={16} color="#ffffff" />
                    </Pressable>
                  </View>
                </View>
              )}
            />

            <View className="gap-2 rounded-3xl border border-[#eef2f6] bg-white p-5">
              <View className="flex-row justify-between">
                <ThemedText themeColor="textSecondary">Subtotal</ThemedText>
                <ThemedText type="smallBold">${subtotal.toFixed(2)}</ThemedText>
              </View>
              <View className="flex-row justify-between">
                <ThemedText themeColor="textSecondary">Delivery</ThemedText>
                <ThemedText type="smallBold">${delivery.toFixed(2)}</ThemedText>
              </View>
              <View className="my-1 border-t border-[#eef2f6] pt-3">
                <View className="flex-row justify-between">
                  <ThemedText className="font-extrabold text-[16px]">Total</ThemedText>
                  <ThemedText className="font-extrabold text-[16px] text-brand-600">
                    ${total.toFixed(2)}
                  </ThemedText>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
                onPress={() => router.push('/checkout')}>
                <View className="mt-1 flex-row items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4">
                  <Text className="text-[16px] font-bold text-white">Proceed to Checkout</Text>
                  <Ionicons name="arrow-forward" size={17} color="#ffffff" />
                </View>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}
