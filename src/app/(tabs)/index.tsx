import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, PRODUCTS } from '@/data/products';

const FEATURED = PRODUCTS.slice(0, 6);

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[800px] gap-4">
          <View className="flex-row items-center justify-between pt-4">
            <View>
              <ThemedText themeColor="textSecondary">Deliver to</ThemedText>
              <ThemedText type="smallBold">Home</ThemedText>
            </View>
            <ThemedText type="subtitle">GoShop</ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            onPress={() => router.push('/search')}>
            <ThemedView type="backgroundElement" className="rounded-2xl px-3 py-3">
              <ThemedText themeColor="textSecondary">🔍  Search groceries…</ThemedText>
            </ThemedView>
          </Pressable>

          <Text className="text-[18px] font-bold text-content dark:text-content-dark">
            Categories
          </Text>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
                onPress={() => router.push(`/browse?category=${item.id}`)}>
                <ThemedView type="backgroundElement" className="items-center rounded-2xl px-4 py-4">
                  <Text className="mb-1 text-[26px]">{item.emoji}</Text>
                  <Text className="text-xs text-content dark:text-content-dark">{item.name}</Text>
                </ThemedView>
              </Pressable>
            )}
          />

          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-content dark:text-content-dark">
              Popular this week
            </Text>
            <Pressable onPress={() => router.push('/browse')} hitSlop={8}>
              <ThemedText themeColor="textSecondary">See all</ThemedText>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-6">
            {FEATURED.map((product) => (
              <View key={product.id} className="w-[31%] grow">
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}