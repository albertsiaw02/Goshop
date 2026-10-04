import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import type { Product } from '@/data/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Pressable
      className="grow"
      style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
      <ThemedView type="backgroundElement" className="mb-1 aspect-square items-center justify-center rounded-2xl">
        <Text className="text-[44px]">{product.emoji}</Text>
      </ThemedView>
      <View className="gap-0.5">
        <ThemedText type="smallBold" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {product.weight}
        </ThemedText>
        <ThemedText type="smallBold">${product.price.toFixed(2)}</ThemedText>
      </View>
    </Pressable>
  );
}