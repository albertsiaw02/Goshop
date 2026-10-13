import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PRODUCTS } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

export default function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <ThemedView className="flex-1">
      <View className="mx-auto w-full max-w-[800px] flex-1 p-6">
        <View className="mb-2 flex-row items-center gap-3 rounded-2xl border border-[#eef2f6] bg-element px-4">
          <Ionicons name="search-outline" size={19} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="Search products…"
            placeholderTextColor={theme.textSecondary}
            className="flex-1 py-4 text-base text-content"
          />
        </View>

        <ThemedText type="small" themeColor="textSecondary" className="mb-4">
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </ThemedText>

        {results.length === 0 ? (
          <View className="items-center pt-16">
            <Text className="mb-3 text-[44px]">🔍</Text>
            <ThemedText themeColor="textSecondary">No results for “{query}”</ThemedText>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 14 }}
            contentContainerStyle={{ gap: 14, paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View className="grow">
                <ProductCard product={item} />
              </View>
            )}
          />
        )}
      </View>
    </ThemedView>
  );
}
