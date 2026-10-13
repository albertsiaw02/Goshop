import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product-card';
import { PromotionCarousel } from '@/components/promotion-carousel';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, getProductsByCategory, PRODUCTS } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

export default function BrowseScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth, 680) - 40;
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const cardWidth = gridWidth ? (gridWidth - 8) / 2 : 0;
  const { category } = useLocalSearchParams<{ category?: string }>();
  const active = typeof category === 'string' ? category : '';
  const products = active ? getProductsByCategory(active) : PRODUCTS;
  const activeName = CATEGORIES.find((c) => c.id === active)?.name ?? 'All Products';

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Browse</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Find your everyday favourites
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open cart"
                onPress={() => router.push('/(tabs)/cart')}
                style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="bag-outline" size={21} color={theme.text} />
                <View style={styles.cartDot} />
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="search"
              onPress={() => router.push('/search')}
              style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.searchPlaceholder, { color: theme.textSecondary }]}>
                Search fresh groceries
              </Text>
            </Pressable>

            <PromotionCarousel compact />

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Shop by category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipList}>
                {[{ id: '', name: 'All', emoji: '🛒' }, ...CATEGORIES].map((item) => {
                  const selected = (item.id || 'all') === (active || 'all');
                  return (
                    <Pressable
                      key={item.id || 'all'}
                      accessibilityRole="button"
                      accessibilityLabel={`Browse ${item.name}`}
                      onPress={() => router.setParams({ category: item.id })}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selected ? '#dcfce7' : theme.backgroundElement,
                          borderColor: selected ? '#bbf7d0' : 'transparent',
                        },
                      ]}>
                      <Text style={styles.chipEmoji}>{item.emoji}</Text>
                      <Text
                        style={[
                          styles.chipText,
                          selected ? styles.chipTextSelected : { color: theme.textSecondary },
                        ]}>
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{activeName}</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    {products.length} {products.length === 1 ? 'item' : 'items'} available
                  </Text>
                </View>
              </View>
              <View style={styles.productGrid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
                {products.map((product) => (
                  <View key={product.id} style={{ width: cardWidth }}>
                    <ProductCard product={product} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 3,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e8f0',
  },
  cartDot: {
    position: 'absolute',
    right: 9,
    top: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  searchBar: {
    minHeight: 50,
    borderRadius: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e8f0',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.25,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  chipList: {
    gap: 8,
    paddingRight: 4,
    paddingTop: 13,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#15803d',
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
});