import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import type { Product } from '@/data/products';

const CATEGORY_TINT: Record<string, string> = {
  fruits: '#fff1f2',
  vegetables: '#f0fdf4',
  dairy: '#eff6ff',
  bakery: '#fffbeb',
  meat: '#fef2f2',
  snacks: '#fefce8',
  drinks: '#eef2ff',
};

export function ProductCard({ product }: { product: Product }) {
  const theme = useTheme();
  const tint = CATEGORY_TINT[product.category] ?? '#f1f5f9';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
      <View style={[styles.imageWrap, { backgroundColor: tint }]}>
        <Text style={styles.emoji}>{product.emoji}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Save ${product.name}`}
          hitSlop={6}
          style={styles.favourite}>
          <Ionicons name="heart-outline" size={15} color="#475569" />
        </Pressable>
        <View style={styles.add}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </View>
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={[styles.weight, { color: theme.textSecondary }]}>
          {product.weight} · {product.category}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.unit, { color: theme.textSecondary }]}>/ {product.unit}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8edf2',
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  imageWrap: {
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 50,
  },
  favourite: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803d',
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  weight: {
    fontSize: 10.5,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 9,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: -0.2,
  },
  unit: {
    fontSize: 9.5,
  },
  pressed: {
    opacity: 0.9,
  },
});
