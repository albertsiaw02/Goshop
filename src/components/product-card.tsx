import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import type { Product } from '@/data/products';

export function ProductCard({ product }: { product: Product }) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.backgroundElement,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
      <View style={styles.imageWrap}>
        <Text style={styles.emoji}>{product.emoji}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{product.category.toUpperCase()}</Text>
        </View>
        <View style={styles.favourite}>
          <Ionicons name="heart-outline" size={16} color="#33423a" />
        </View>
        <View style={styles.add}>
          <Ionicons name="add" size={21} color="#ffffff" />
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
          <Text style={[styles.price, { color: theme.text }]}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.unit, { color: theme.textSecondary }]}>/ {product.unit}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  imageWrap: {
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f4ef',
  },
  emoji: {
    fontSize: 46,
  },
  tag: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  tagText: {
    color: '#3b754e',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.45,
  },
  favourite: {
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
  add: {
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
  info: {
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 11,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
  },
  weight: {
    fontSize: 10,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
  },
  unit: {
    fontSize: 9,
  },
  pressed: {
    opacity: 0.84,
  },
});