import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductById } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

const CATEGORY_TINT: Record<string, string> = {
  fruits: '#fff1f2',
  vegetables: '#f0fdf4',
  dairy: '#eff6ff',
  bakery: '#fffbeb',
  meat: '#fef2f2',
  snacks: '#fefce8',
  drinks: '#eef2ff',
};

export default function ProductDetailsScreen() {
  const theme = useTheme();
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

  const tint = CATEGORY_TINT[product.category] ?? theme.backgroundElement;

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-7 p-6">
          <View
            className="aspect-square items-center justify-center rounded-3xl border border-[#eef2f6]"
            style={{ backgroundColor: tint }}>
            <Text className="text-[120px]">{product.emoji}</Text>
          </View>

          <View className="gap-1">
            <ThemedText className="text-[26px] font-extrabold leading-8 tracking-tight">
              {product.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {product.weight} · {product.category}
            </ThemedText>
            <View className="mt-2 flex-row items-baseline gap-1.5">
              <Text className="text-[22px] font-extrabold text-brand-600">
                ${product.price.toFixed(2)}
              </Text>
              <Text className="text-sm font-medium text-muted">/ {product.unit}</Text>
            </View>
            <ThemedText className="mt-3 leading-[22px]" themeColor="textSecondary">
              {product.description}
            </ThemedText>
          </View>

          <View className="flex-row items-center gap-4 pb-8">
            <View className="flex-row items-center gap-3 rounded-full border border-[#eef2f6] bg-white px-2 py-1.5">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                className="h-9 w-9 items-center justify-center rounded-full"
                onPress={() => setQty((q) => Math.max(1, q - 1))}>
                <Ionicons name="remove" size={18} color={theme.text} />
              </Pressable>
              <Text className="min-w-[24px] text-center text-lg font-bold text-content">{qty}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                className="h-9 w-9 items-center justify-center rounded-full bg-brand-500"
                onPress={() => setQty((q) => q + 1)}>
                <Ionicons name="add" size={18} color="#ffffff" />
              </Pressable>
            </View>

            <Pressable
              className="grow"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
              onPress={() => router.push('/(tabs)/cart')}>
              <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4">
                <Ionicons name="bag-add-outline" size={18} color="#ffffff" />
                <Text className="text-[16px] font-bold text-white">
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
