import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, getProductsByCategory, PRODUCTS } from '@/data/products';

export default function BrowseScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const active = typeof category === 'string' ? category : '';
  const products = active ? getProductsByCategory(active) : PRODUCTS;
  const activeName = CATEGORIES.find((c) => c.id === active)?.name ?? 'All Products';

  return (
    <ThemedView className="flex-1">
      <View className="flex-1 w-full max-w-[800px] self-center p-6">
        <ThemedText type="subtitle" className="mb-2 pt-4">
          {activeName}
        </ThemedText>

        <FlatList
          horizontal
          data={[{ id: '', name: 'All', emoji: '🛒' }, ...CATEGORIES]}
          keyExtractor={(item) => item.id || 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          extraData={active}
          renderItem={({ item }) => {
            const selected = (item.id || 'all') === (active || 'all');
            return (
              <Pressable
                style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
                onPress={() => router.setParams({ category: item.id })}>
                <ThemedView
                  type={selected ? 'backgroundSelected' : 'backgroundElement'}
                  className="flex-row items-center gap-1 rounded-2xl px-4 py-2">
                  <Text className="text-[16px]">{item.emoji}</Text>
                  <ThemedText type="small" className={selected ? 'font-bold' : ''}>
                    {item.name}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          }}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-6 pb-8">
            {products.map((product) => (
              <View key={product.id} className="w-[31%] grow">
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
}