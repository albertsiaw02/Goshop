import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductById } from '@/data/products';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(id);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <ThemedView className="flex-1">
        <ThemedText className="p-6 text-center">Product not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-8 p-6">
          <ThemedView type="backgroundElement" className="aspect-square items-center justify-center rounded-3xl">
            <Text className="text-[120px]">{product.emoji}</Text>
          </ThemedView>

          <View className="gap-0.5">
            <ThemedText type="subtitle">{product.name}</ThemedText>
            <ThemedText themeColor="textSecondary">{product.weight}</ThemedText>
            <Text className="text-lg font-bold text-brand-600">
              ${product.price.toFixed(2)} / {product.unit}
            </Text>
            <ThemedText className="mt-2 leading-[22px]">{product.description}</ThemedText>
          </View>

          <View className="flex-row items-center gap-4 pb-8">
            <View className="flex-row items-center gap-2">
              <Pressable className="h-10 w-10 items-center justify-center rounded-xl" onPress={() => setQty((q) => Math.max(1, q - 1))}>
                <Text className="text-[22px] font-bold text-content dark:text-content-dark">−</Text>
              </Pressable>
              <Text className="min-w-[32px] text-center text-lg font-bold text-content dark:text-content-dark">
                {qty}
              </Text>
              <Pressable className="h-10 w-10 items-center justify-center rounded-xl" onPress={() => setQty((q) => q + 1)}>
                <Text className="text-[22px] font-bold text-content dark:text-content-dark">+</Text>
              </Pressable>
            </View>

            <Pressable
              className="grow"
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
              onPress={() => router.push('/(tabs)/cart')}>
              <View className="items-center rounded-3xl bg-brand-500 py-4">
                <Text className="text-base font-bold text-white">
                  Add to Cart · ${(product.price * qty).toFixed(2)}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}