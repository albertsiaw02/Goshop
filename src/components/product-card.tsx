import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

import type { Product } from '@/data/products';

const CATEGORY_TINT: Record<string, string> = {
  fruits: '#f5f1ed',
  vegetables: '#edf6ef',
  dairy: '#f5f8ff',
  bakery: '#fffaf0',
  meat: '#fff4f4',
  snacks: '#fffef2',
  drinks: '#eef6ff',
};

function ProductArt({ product }: { product: Product }) {
  const variant = product.id;

  if (variant === '5') {
    return (
      <Svg width="170" height="120" viewBox="0 0 170 120">
        <G>
          <Ellipse cx="38" cy="94" rx="34" ry="10" fill="#d8f0d0" opacity={0.8} />
          <Ellipse cx="78" cy="88" rx="40" ry="12" fill="#d8f0d0" opacity={0.9} />
          <Ellipse cx="120" cy="92" rx="33" ry="10" fill="#d8f0d0" opacity={0.8} />
          <Path d="M38 50c12-18 30-26 32-26 10 3 18 12 20 28-11 9-24 12-39 7-9-2-16-5-18-9z" fill="#f4d1d1" opacity={0.7} />
          <Circle cx="46" cy="58" r="18" fill="#d81f2d"/>
          <Circle cx="74" cy="54" r="20" fill="#e93031"/>
          <Circle cx="98" cy="60" r="18" fill="#dd1b2d"/>
          <Circle cx="70" cy="78" r="17" fill="#ea3d3d"/>
          <Circle cx="116" cy="74" r="16" fill="#d93b35"/>
          <Path d="M35 58c-9-6-16-16-18-26 11-5 22-3 29 9 3 5 4 10 0 17-5 0-8 0-11 0z" fill="#4d9a45"/>
          <Path d="M74 40c2-12 15-18 23-20 4 9 4 17-3 26-7 1-14 0-20-6z" fill="#5eb35d"/>
          <Path d="M87 56c9-12 24-17 31-18 6 10 3 19-5 27-8 1-17-1-26-9z" fill="#53a24b"/>
          <Path d="M49 86c2-8 8-13 14-18 9 3 14 9 15 18-9 7-18 8-29 0z" fill="#78b66a"/>
          <Path d="M110 84c4-11 15-17 23-18 4 8 3 16-4 24-8 2-14 0-19-6z" fill="#5a9d4d"/>
        </G>
      </Svg>
    );
  }

  if (variant === '4') {
    return (
      <Svg width="170" height="120" viewBox="0 0 170 120">
        <G>
          <Ellipse cx="84" cy="96" rx="52" ry="10" fill="#dfeecf" opacity={0.8} />
          <Path d="M52 29c-6 23-1 46 13 59 15-1 26-10 31-27 4-13 1-29-11-38-11-8-27 0-33 6z" fill="#8bc25f"/>
          <Path d="M84 25c4 25 8 42 27 56 18-4 30-18 32-37-8-18-25-25-42-24-8 1-12 2-17 5z" fill="#7bbd5d"/>
          <Path d="M32 63c17 9 31 12 44 8 4 18 0 26-15 35-18-7-31-22-29-43z" fill="#7bc96c"/>
          <Path d="M87 60c15 9 32 10 48 2 5 14 1 31-15 40-17-4-31-18-33-42z" fill="#87cb5d"/>
          <Path d="M68 40c-5-14-17-20-26-21 7 13 6 27 26 29z" fill="#7ac774"/>
          <Path d="M90 35c13-13 27-17 39-17-4 14-18 22-39 19z" fill="#75c76d"/>
          <Path d="M64 57c-6 9-8 18-8 30 10 1 19-2 25-9-5-9-10-15-17-21z" fill="#75bf63"/>
          <Path d="M99 54c7 10 10 19 9 32-11 0-20-5-27-12 5-8 10-15 18-20z" fill="#72af57"/>
        </G>
      </Svg>
    );
  }

  if (variant === '2') {
    return (
      <Svg width="170" height="120" viewBox="0 0 170 120">
        <G>
          <Ellipse cx="84" cy="95" rx="54" ry="10" fill="#dfeecf" opacity={0.8} />
          <Path d="M18 69c17-17 29-29 52-29 14 0 27 5 38 18 14 17 14 31 6 49H33c-12-14-17-24-15-38z" fill="#7bd032"/>
          <Path d="M34 65c18-18 39-26 59-20 9 3 20 14 25 31-10 12-24 18-40 16-18-2-33-12-44-27z" fill="#95d85f"/>
          <Path d="M53 42c-4-10-15-20-25-24 6 14 12 28 25 32z" fill="#6eb63d"/>
          <Path d="M79 33c9-12 20-18 30-19 0 13-8 25-30 24z" fill="#68ae3d"/>
          <Path d="M103 44c11-8 20-8 30-6-2 14-10 22-30 24z" fill="#67b342"/>
          <Path d="M58 70c6-5 12-8 19-10 5 11 2 20-10 29-10-5-13-11-9-19z" fill="#8bce5f"/>
          <Path d="M91 70c8-5 17-7 25-7 3 10 1 20-9 29-11-5-15-11-16-22z" fill="#83c563"/>
        </G>
      </Svg>
    );
  }

  if (variant === '6') {
    return (
      <Svg width="170" height="120" viewBox="0 0 170 120">
        <G>
          <Ellipse cx="80" cy="96" rx="52" ry="10" fill="#e4eec9" />
          <Path d="M30 78c13-8 23-18 32-35 12 3 20 17 19 31-15 16-34 19-51 4z" fill="#7fbd3e"/>
          <Path d="M72 73c5-10 15-22 29-30 14 2 25 15 28 32-19 15-39 18-57-2z" fill="#6fb438"/>
          <Path d="M112 77c10-10 20-19 31-25 7 12 7 29-2 42-15 8-26 10-29-17z" fill="#7cbf43"/>
          <Path d="M44 68c-10-5-17-17-20-29 10-1 18 4 25 14 3 7 2 12-5 15z" fill="#7ec546"/>
          <Path d="M79 58c-2-13-16-24-28-30 9 16 17 28 28 34z" fill="#75ba3d"/>
          <Path d="M92 58c9-14 26-20 37-19-3 13-13 24-37 24z" fill="#7ec444"/>
          <Path d="M126 61c8-11 19-19 31-21-3 15-15 25-31 25z" fill="#74b740"/>
          <G>
            <Ellipse cx="64" cy="78" rx="10" ry="16" fill="#f4d23d"/>
            <Ellipse cx="82" cy="80" rx="10" ry="16" fill="#f2d140"/>
            <Ellipse cx="100" cy="78" rx="10" ry="16" fill="#f0d34c"/>
            <Ellipse cx="72" cy="65" rx="10" ry="16" fill="#f6d951"/>
            <Ellipse cx="90" cy="64" rx="10" ry="16" fill="#f3d74a"/>
            <Ellipse cx="108" cy="66" rx="10" ry="16" fill="#f6d53e"/>
          </G>
        </G>
      </Svg>
    );
  }

  return (
    <Svg width="170" height="120" viewBox="0 0 170 120">
      <G>
        <Circle cx="82" cy="65" r="34" fill="#d3f3d1"/>
        <Circle cx="82" cy="65" r="22" fill="#a5d36d"/>
      </G>
    </Svg>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const theme = useTheme();
  const tint = CATEGORY_TINT[product.category] ?? '#f1f5f9';
  const mrp = product.mrp ?? product.price * 1.45;
  const isFreshTomato = product.id === '5';
  const isSpinach = product.id === '2';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.imageWrap, { backgroundColor: tint }]}>
        <View style={styles.artFrame}>
          <ProductArt product={product} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Save ${product.name}`}
          hitSlop={10}
          onPress={(event) => event.stopPropagation()}
          style={styles.favourite}>
          <Ionicons name="heart-outline" size={15} color="#f0679f" />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.meta}>{product.weight}</Text>
        <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
          {product.name}
        </Text>
        <Text style={styles.metaLabel}>{isFreshTomato || isSpinach ? '10 MINS' : '10 MINS'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price.toFixed(0)}</Text>
          <Text style={[styles.mrp, { color: '#6b7280' }]}>MRP ₹{mrp.toFixed(0)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name}`}
            onPress={(event) => event.stopPropagation()}
            style={styles.addButton}>
            <Ionicons name="add" size={19} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 246,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#edf1f3',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  imageWrap: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  artFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  favourite: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff4f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f8dfe7',
  },
  info: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  meta: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: -0.15,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.25,
    marginBottom: 4,
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.35,
  },
  mrp: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1eaf6d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a9d62',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.96,
  },
});
