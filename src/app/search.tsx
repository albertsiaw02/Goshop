import { useMemo, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';

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
      <View className="mx-auto flex-1 w-full max-w-[800px] p-6">
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Search products…"
          placeholderTextColor={theme.textSecondary}
          className="mb-4 rounded-3xl bg-element px-4 py-4 text-base text-content dark:bg-element-dark dark:text-content-dark"
        />

        {results.length === 0 ? (
          <View className="items-center pt-16">
            <ThemedText themeColor="textSecondary">No results for “{query}”</ThemedText>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 16 }}
            contentContainerStyle={{ gap: 16 }}
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