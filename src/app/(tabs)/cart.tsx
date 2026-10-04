import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductById } from '@/data/products';

type CartItem = { id: string; qty: number };

const INITIAL: CartItem[] = [
  { id: '1', qty: 2 },
  { id: '7', qty: 1 },
  { id: '15', qty: 3 },
];

export default function CartScreen() {
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
      <View className="flex-1 w-full max-w-[800px] self-center p-6">
        <ThemedText type="subtitle" className="mb-4 pt-4">
          My Cart
        </ThemedText>

        {rows.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-[60px]">🛒</Text>
            <ThemedText themeColor="textSecondary">Your cart is empty</ThemedText>
            <Pressable
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
              onPress={() => router.push('/browse')}>
              <View className="items-center rounded-2xl bg-brand-500 py-4">
                <Text className="text-[18px] font-bold text-white">Start Shopping</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <FlatList
              data={rows}
              keyExtractor={(r) => r.product!.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
              renderItem={({ item: r }) => (
                <ThemedView type="backgroundElement" className="flex-row items-center gap-6 rounded-2xl p-4">
                  <Text className="text-[36px]">{r.product!.emoji}</Text>
                  <View className="flex-1 gap-0.5">
                    <ThemedText type="smallBold">{r.product!.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {r.product!.weight}
                    </ThemedText>
                    <ThemedText type="smallBold">
                      ${(r.product!.price * r.item.qty).toFixed(2)}
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Pressable
                      className="h-[30px] w-[30px] items-center justify-center rounded-lg"
                      onPress={() => setQty(r.product!.id, -1)}>
                      <ThemedText>−</ThemedText>
                    </Pressable>
                    <ThemedText type="smallBold">{r.item.qty}</ThemedText>
                    <Pressable
                      className="h-[30px] w-[30px] items-center justify-center rounded-lg"
                      onPress={() => setQty(r.product!.id, 1)}>
                      <ThemedText>+</ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              )}
            />

            <View className="gap-1 pt-4">
              <View className="flex-row justify-between">
                <ThemedText>Subtotal</ThemedText>
                <ThemedText>${subtotal.toFixed(2)}</ThemedText>
              </View>
              <View className="flex-row justify-between">
                <ThemedText>Delivery</ThemedText>
                <ThemedText>${delivery.toFixed(2)}</ThemedText>
              </View>
              <View className="mb-2 flex-row justify-between pt-1">
                <ThemedText type="smallBold">Total</ThemedText>
                <ThemedText type="smallBold">${total.toFixed(2)}</ThemedText>
              </View>

              <Pressable
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                onPress={() => router.push('/checkout')}>
                <View className="items-center rounded-2xl bg-brand-500 py-4">
                  <Text className="text-[18px] font-bold text-white">Checkout</Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}