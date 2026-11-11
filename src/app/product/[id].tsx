import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductById } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';
import { useCart } from '@/store/cart';

function OrangeArtwork() {
  return (
    <Svg width="280" height="210" viewBox="0 0 280 210">
      <Defs>
        <LinearGradient id="orange" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffb02e" />
          <Stop offset="1" stopColor="#f36a0b" />
        </LinearGradient>
        <LinearGradient id="cut-orange" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffdb58" />
          <Stop offset="1" stopColor="#ff9a13" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="140" cy="183" rx="100" ry="12" fill="#d9a68c" opacity={0.28} />
      <Path d="M142 78c17-41 47-59 70-55-3 31-23 51-65 65z" fill="#68a83d" />
      <Path d="M149 76c28-31 60-36 81-24-15 28-42 38-79 35z" fill="#83bd4c" />
      <Path d="M119 76c-8-29 1-51 17-64 17 20 17 43-8 71z" fill="#5d9c39" />
      <Circle cx="119" cy="104" r="44" fill="url(#orange)" />
      <Circle cx="167" cy="120" r="50" fill="url(#orange)" />
      <Circle cx="82" cy="127" r="39" fill="url(#orange)" />
      <Path d="M117 60c4-5 9-7 14-7-2 7-7 11-14 11z" fill="#568b33" />
      <Path d="M164 68c4-5 9-7 14-7-2 7-7 11-14 11z" fill="#568b33" />
      <Path d="M78 88c3-4 7-5 11-5-1 6-5 9-11 9z" fill="#568b33" />
      <Path d="M57 155a36 36 0 0 1 61-26l-31 34z" fill="url(#cut-orange)" />
      <Path d="M57 155a36 36 0 0 1 61-26l-31 34z" fill="none" stroke="#fff4cc" strokeWidth="4" />
      <Path d="m88 163 5-18m10 11-15-2m24-12-15 7" stroke="#fff4cc" strokeWidth="2" opacity={0.9} />
      <Circle cx="52" cy="157" r="2" fill="#fff2c7" />
    </Svg>
  );
}

export default function ProductDetailsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <ThemedView className="flex-1">
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedText className="p-6 text-center">Product not found</ThemedText>
      </ThemedView>
    );
  }

  const mrp = product.mrp ?? Math.round(product.price * 1.4);

  return (
    <ThemedView className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="mx-auto w-full max-w-[600px] flex-1 bg-background">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}>
            <View
              className="items-center justify-center bg-[#fff0e8] dark:bg-[#2a211c]"
              style={{ height: Math.min(windowHeight * 0.45, 380) }}>
              <View className="absolute left-5 right-5 top-4 z-10 flex-row items-center justify-between">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  className="h-11 w-11 items-center justify-center rounded-full bg-background"
                  onPress={() =>
                    router.canGoBack() ? router.back() : router.replace('/browse')
                  }>
                  <Ionicons name="chevron-back" size={21} color={theme.text} />
                </Pressable>
                <View className="flex-row gap-3">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Search products"
                    className="h-11 w-11 items-center justify-center rounded-full bg-background"
                    onPress={() => router.push('/browse')}>
                    <Ionicons name="search-outline" size={20} color={theme.text} />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className="h-11 w-11 items-center justify-center rounded-full bg-background"
                    onPress={() => setIsFavorite((favorite) => !favorite)}>
                    <Ionicons
                      name={isFavorite ? 'heart' : 'heart-outline'}
                      size={20}
                      color={isFavorite ? '#ed547e' : theme.text}
                    />
                  </Pressable>
                </View>
              </View>
              {product.id === '3' ? (
                <OrangeArtwork />
              ) : (
                <Text className="text-[118px]">{product.emoji}</Text>
              )}
            </View>

            <View className="-mt-3 rounded-t-[24px] bg-background px-5 pb-3 pt-4">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#1f9b67]" />
                  <Text className="text-[11px] font-semibold text-muted">10 MINS</Text>
                </View>
                <View className="rounded-md bg-[#edf7ff] px-2.5 py-1 dark:bg-[#1c2a3a]">
                  <Text className="text-[11px] font-bold text-[#3d8ac7] dark:text-[#7fb8e8]">
                    {product.weight}
                  </Text>
                </View>
              </View>

              <ThemedText className="text-[23px] font-extrabold leading-7 tracking-tight">
                {product.name}
              </ThemedText>
              <View className="mt-1 flex-row items-baseline gap-2">
                <Text className="text-[17px] font-extrabold text-brand-ink">
                  ₹{product.price.toFixed(0)}
                </Text>
                <Text className="text-[10px] text-muted">
                  MRP <Text className="line-through">₹{mrp.toFixed(0)}</Text>
                </Text>
              </View>

              <View className="my-3 border-t border-border" />
              <ThemedText className="text-[14px] font-bold">About this product</ThemedText>
              <ThemedText className="mt-1 text-[12px] leading-[17px]" themeColor="textSecondary">
                {product.id === '3'
                  ? 'Naturally sweet, juicy, and packed with freshness, these oranges are carefully sourced from trusted farms. Fresh from local orchards and hand-picked at peak ripeness, they are perfect for snacking, juicing, or adding a refreshing touch to your meals.'
                  : product.description}
              </ThemedText>

              <ThemedText className="mt-3 text-[14px] font-bold">Why you’ll love it</ThemedText>
              <View className="mt-1 gap-1">
                {['Fresh quality, selected with care', 'Packed fresh for your order'].map((reason) => (
                  <View key={reason} className="flex-row items-center gap-2">
                    <Ionicons name="checkmark-circle" size={14} color="#1f9b67" />
                    <ThemedText className="text-[11px]" themeColor="textSecondary">
                      {reason}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View
            className="flex-row items-center gap-3 border-t border-border bg-background px-5 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
            <View className="h-12 flex-row items-center rounded-full border border-border px-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                className="h-9 w-8 items-center justify-center"
                onPress={() => setQty((current) => Math.max(1, current - 1))}>
                <Ionicons name="remove" size={17} color={theme.textSecondary} />
              </Pressable>
              <Text className="min-w-[24px] text-center text-[12px] font-semibold text-content">
                {String(qty).padStart(2, '0')}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                className="h-8 w-8 items-center justify-center rounded-full bg-[#185a45]"
                onPress={() => setQty((current) => current + 1)}>
                <Ionicons name="add" size={17} color="#ffffff" />
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-full bg-[#185a45]"
              style={({ pressed }) => (pressed ? { opacity: 0.88 } : undefined)}
              onPress={() => addItem(product.id, qty)}>
              <Text className="text-[14px] font-bold text-white">Add to cart</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
