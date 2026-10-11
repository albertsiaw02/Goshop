import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, Pressable, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

const STORES = [
  { name: 'FreshMart', mark: 'F', color: '#e9f7ec', ink: '#23934a' },
  { name: 'Green Basket', mark: 'G', color: '#fff2df', ink: '#c98222' },
  { name: 'Daily Market', mark: 'D', color: '#e9efff', ink: '#4968bd' },
  { name: 'Local Harvest', mark: 'L', color: '#f9e9e8', ink: '#b5544c' },
];

const FEATURED_PRODUCTS = [
  { id: '6', image: 'photo-1445282768818-728615cc910a', tag: 'FRESH PICK' },
  { id: '3', image: 'photo-1547514701-42782101795e', tag: 'VITAMIN C' },
  { id: '5', image: 'photo-1546094096-0df4bcaaa337', tag: 'FARM FRESH' },
  { id: '4', image: 'photo-1459411621453-7b03977f4bfc', tag: 'FRESH PICK' },
  { id: '1', image: 'photo-1570913149827-d2ac84ab3f9a', tag: 'ORCHARD FRESH' },
  { id: '2', image: 'photo-1571771894821-ce9b6c11b08e', tag: 'RIPE & READY' },
];

const photoUrl = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export default function HomeScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth, 680) - 40;
  const productCardWidth = (contentWidth - 16) / 3;
  const featured = FEATURED_PRODUCTS.map((item) => ({
    ...item,
    product: PRODUCTS.find((product) => product.id === item.id)!,
  }));

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.location}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location" size={17} color="#168443" />
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
              <Text style={[styles.searchPlaceholder, { color: theme.textSecondary }]}>Search fresh groceries</Text>
              <View style={styles.searchDivider} />
              <Ionicons name="options-outline" size={19} color="#168443" />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Shop this week's fresh deals"
              onPress={() => router.push('/browse')}
              style={styles.hero}>
              <Image
                source={{
                  uri: photoUrl('photo-1540420773420-3366772f4999', 900),
                }}
                contentFit="cover"
                transition={250}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['rgba(10, 62, 34, 0.96)', 'rgba(14, 82, 42, 0.78)', 'rgba(14, 82, 42, 0.05)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.heroCopy}>
                <View style={styles.offerPill}>
                  <Text style={styles.offerPillText}>THIS WEEK ONLY</Text>
                </View>
                <Text style={styles.heroTitle}>Good food,{'\n'}great savings.</Text>
                <Text style={styles.heroCaption}>Up to 25% off fresh picks</Text>
                <View style={styles.heroCta}>
                  <Text style={styles.heroCtaText}>Shop deals</Text>
                  <Ionicons name="arrow-forward" size={15} color="#176e3c" />
                </View>
              </View>
              <View style={styles.heroPagination}>
                <View style={styles.activePageDot} />
                <View style={styles.pageDot} />
                <View style={styles.pageDot} />
              </View>
            </Pressable>

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
                <Ionicons name="flash" size={17} color="#168443" />
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
              <View style={styles.productGrid}>
                {featured.map(({ product, image, tag }) => (
                  <Pressable
                    key={product.id}
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/product/[id]',
                        params: { id: product.id },
                      })
                    }
                    style={({ pressed }) => [
                      styles.productCard,
                      { width: productCardWidth },
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.backgroundElement,
                      },
                      pressed && styles.pressed,
                    ]}>
                    <View style={styles.productImageWrap}>
                      <Image
                        source={{ uri: photoUrl(image, 600) }}
                        contentFit="cover"
                        transition={200}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.productTag}>
                        <Text style={styles.productTagText}>{tag}</Text>
                      </View>
                      <View style={styles.favouriteButton}>
                        <Ionicons name="heart-outline" size={16} color="#33423a" />
                      </View>
                      <View style={styles.addButton}>
                        <Ionicons name="add" size={21} color="#ffffff" />
                      </View>
                    </View>
                    <View style={styles.productInfo}>
                      <Text numberOfLines={1} style={[styles.productName, { color: theme.text }]}>
                        {product.name}
                      </Text>
                      <Text style={[styles.productWeight, { color: theme.textSecondary }]}>
                        {product.weight} · {product.category}
                      </Text>
                      <View style={styles.productPriceRow}>
                        <Text style={[styles.productPrice, { color: theme.text }]}>${product.price.toFixed(2)}</Text>
                        <Text style={[styles.productUnit, { color: theme.textSecondary }]}>/ {product.unit}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
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
    backgroundColor: '#e8f5ec',
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
  },
  cartDot: {
    position: 'absolute',
    right: 9,
    top: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#21a453',
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
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
  },
  searchDivider: {
    width: 1,
    height: 21,
    backgroundColor: '#d7ddd8',
    marginHorizontal: 2,
  },
  hero: {
    height: 190,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 27,
    backgroundColor: '#145a34',
  },
  heroCopy: {
    paddingLeft: 20,
    alignItems: 'flex-start',
  },
  offerPill: {
    backgroundColor: 'rgba(255,255,255,0.17)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 9,
  },
  offerPillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroCaption: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  heroCta: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCtaText: {
    color: '#176e3c',
    fontSize: 11,
    fontWeight: '700',
  },
  heroPagination: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activePageDot: {
    width: 15,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  pageDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
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
    color: '#168443',
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
    backgroundColor: '#dff1e4',
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
  productCard: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderWidth: StyleSheet.hairlineWidth,
  },
  productImageWrap: {
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: '#f1f4ef',
  },
  productTag: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  productTagText: {
    color: '#3b754e',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.45,
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#1b9a4b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#137c3a',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productInfo: {
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 11,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
  },
  productWeight: {
    fontSize: 10,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  productUnit: {
    fontSize: 9,
  },
  pressed: {
    opacity: 0.84,
  },
});
