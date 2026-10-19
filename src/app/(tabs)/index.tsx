import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, Pressable, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product-card';
import { PromotionCarousel } from '@/components/promotion-carousel';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';
import { useCart } from '@/store/cart';

const STORES = [
  { name: 'FreshMart', mark: 'F', color: '#e9f7ec', ink: '#23934a' },
  { name: 'Green Basket', mark: 'G', color: '#fff2df', ink: '#c98222' },
  { name: 'Daily Market', mark: 'D', color: '#e9efff', ink: '#4968bd' },
  { name: 'Local Harvest', mark: 'L', color: '#f9e9e8', ink: '#b5544c' },
];

const FEATURED_PRODUCT_IDS = ['5', '4', '2', '6'];

export default function HomeScreen() {
  const theme = useTheme();
  const { count } = useCart();
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth, 680) - 40;
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const productCardWidth = gridWidth ? (gridWidth - 8) / 2 : 0;
  const [query, setQuery] = useState('');
  const searchQuery = query.trim();
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);
  const featured = FEATURED_PRODUCT_IDS.map((id) => PRODUCTS.find((product) => product.id === id)!).filter(
    Boolean,
  );

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.location}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location" size={17} color="#16a34a" />
                </View>
                <View>
                  <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>DELIVERING TO</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Choose delivery address"
                    onPress={() => router.push('/profile')}
                    style={styles.address}>
                    <Text style={[styles.addressText, { color: theme.text }]}>Home · Dubai</Text>
                    <Ionicons name="chevron-down" size={15} color={theme.textSecondary} />
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open cart, ${count} items`}
                onPress={() => router.push('/(tabs)/cart')}
                style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="bag-outline" size={21} color={theme.text} />
                {count > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{count > 99 ? '99+' : count}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View
              accessibilityRole="search"
              style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search fresh groceries"
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text }]}
                returnKeyType="search"
              />
              {searchQuery.length > 0 ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                </Pressable>
              ) : (
                <>
                  <View style={styles.searchDivider} />
                  <Ionicons name="options-outline" size={19} color="#16a34a" />
                </>
              )}
            </View>

            {searchQuery.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeading}>
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Search results</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                      {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} for “{searchQuery}”
                    </Text>
                  </View>
                </View>
                {searchResults.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>🔍</Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      No results for “{searchQuery}”
                    </Text>
                  </View>
                ) : (
                  <View style={styles.productGrid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
                    {searchResults.map((product) => (
                      <View key={product.id} style={{ width: productCardWidth }}>
                        <ProductCard product={product} />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <>
                <PromotionCarousel />

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Shop by category</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Find your everyday favourites
                  </Text>
                </View>
                <Pressable accessibilityRole="button" onPress={() => router.push('/browse')} hitSlop={8}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                {CATEGORIES.slice(0, 6).map((category, index) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Browse ${category.name}`}
                    key={category.id}
                    onPress={() => router.push(`/browse?category=${category.id}`)}
                    style={styles.categoryItem}>
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor: CATEGORY_BACKGROUNDS[index % CATEGORY_BACKGROUNDS.length],
                        },
                      ]}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.categoryName, { color: theme.text }]}>
                      {category.name.replace(' & Eggs', '')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular stores</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Loved by shoppers nearby</Text>
                </View>
                <Pressable accessibilityRole="button" onPress={() => router.push('/browse')} hitSlop={8}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storeList}>
                {STORES.map((store) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Shop at ${store.name}`}
                    key={store.name}
                    onPress={() => router.push('/browse')}
                    style={styles.storeItem}>
                    <View style={[styles.storeLogo, { backgroundColor: store.color }]}>
                      <Text style={[styles.storeMark, { color: store.ink }]}>{store.mark}</Text>
                      <View style={[styles.storeLeaf, { backgroundColor: store.ink }]} />
                    </View>
                    <Text numberOfLines={1} style={[styles.storeName, { color: theme.text }]}>
                      {store.name}
                    </Text>
                    <View style={styles.storeRating}>
                      <Ionicons name="star" size={11} color="#f4a623" />
                      <Text style={[styles.storeRatingText, { color: theme.textSecondary }]}>4.8</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={[styles.deliveryStrip, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.deliveryIcon}>
                <Ionicons name="flash" size={17} color="#16a34a" />
              </View>
              <View style={styles.deliveryCopy}>
                <Text style={[styles.deliveryTitle, { color: theme.text }]}>Fresh to your door</Text>
                <Text style={[styles.deliveryCaption, { color: theme.textSecondary }]}>
                  Free delivery on orders over $35
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Fresh picks for you</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    Quality produce, picked today
                  </Text>
                </View>
                <Pressable accessibilityRole="button" onPress={() => router.push('/browse')} hitSlop={8}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
              <View style={styles.productGrid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
                {featured.map((product) => (
                  <View key={product.id} style={{ width: productCardWidth }}>
                    <ProductCard product={product} />
                  </View>
                ))}
              </View>
            </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const CATEGORY_BACKGROUNDS = ['#fff0e5', '#e8f5e9', '#eff0ff', '#fff5dc', '#ffe9e8', '#e5f4f0'];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
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
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '700',
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
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
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
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  searchDivider: {
    width: 1,
    height: 21,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
  seeAll: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryList: {
    gap: 14,
    paddingRight: 4,
  },
  categoryItem: {
    width: 66,
    alignItems: 'center',
    gap: 7,
  },
  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryName: {
    width: 72,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },
  storeList: {
    gap: 16,
    paddingRight: 4,
  },
  storeItem: {
    width: 75,
    alignItems: 'center',
  },
  storeLogo: {
    width: 54,
    height: 54,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 7,
  },
  storeMark: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -1,
  },
  storeLeaf: {
    position: 'absolute',
    width: 8,
    height: 4,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    right: 11,
    top: 10,
    transform: [{ rotate: '-28deg' }],
  },
  storeName: {
    width: 75,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  storeRatingText: {
    fontSize: 9,
  },
  deliveryStrip: {
    minHeight: 64,
    paddingHorizontal: 13,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 25,
  },
  deliveryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryCopy: {
    flex: 1,
    gap: 2,
  },
  deliveryTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  deliveryCaption: {
    fontSize: 10,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
