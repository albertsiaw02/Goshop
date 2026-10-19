import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type Promotion = {
  image: string;
  pill: string;
  title: string;
  caption: string;
  cta: string;
};

const PROMOTIONS: Promotion[] = [
  {
    image: 'photo-1540420773420-3366772f4999',
    pill: 'THIS WEEK ONLY',
    title: 'Good food,\ngreat savings.',
    caption: 'Up to 25% off fresh picks',
    cta: 'Shop deals',
  },
  {
    image: 'photo-1570913149827-d2ac84ab3f9a',
    pill: 'ORCHARD FRESH',
    title: 'Fruit that\nfeels this fresh.',
    caption: 'Hand-picked produce, delivered today',
    cta: 'Browse fruits',
  },
  {
    image: 'photo-1459411621453-7b03977f4bfc',
    pill: 'FARM TO PANTRY',
    title: 'Straight from\nthe farm.',
    caption: 'Free delivery on orders over $35',
    cta: 'Order now',
  },
];

const photoUrl = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=90`;

export function PromotionCarousel({ compact = false }: { compact?: boolean }) {
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (width === 0 || PROMOTIONS.length < 2) return undefined;
    const id = setInterval(() => {
      const next = (activeRef.current + 1) % PROMOTIONS.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setActive(next);
    }, 4500);
    return () => clearInterval(id);
  }, [width]);

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) return;
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    setActive(Math.max(0, Math.min(next, PROMOTIONS.length - 1)));
  };

  return (
    <View
      style={[styles.wrap, compact ? styles.wrapCompact : styles.wrapFull]}
      onLayout={(event) => {
        const next = event.nativeEvent.layout.width;
        if (Math.abs(next - width) > 1) setWidth(next);
      }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}>
        {PROMOTIONS.map((promo) => (
          <Pressable
            key={promo.pill}
            accessibilityRole="button"
            accessibilityLabel={promo.title.replace('\n', ' ')}
            onPress={() => router.push('/browse')}
            style={[styles.page, { width }]}>
            <Image
              source={{ uri: photoUrl(promo.image, compact ? 700 : 900) }}
              contentFit="cover"
              transition={250}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(10, 62, 34, 0.92)', 'rgba(14, 82, 42, 0.55)', 'rgba(14, 82, 42, 0)']}
              locations={[0, 0.55, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.copy, compact && styles.copyCompact]}>
              <View style={[styles.pill, compact && styles.pillCompact]}>
                <Text style={[styles.pillText, compact && styles.pillTextCompact]}>{promo.pill}</Text>
              </View>
              <Text style={[styles.title, compact && styles.titleCompact]}>{promo.title}</Text>
              <Text style={[styles.caption, compact && styles.captionCompact]}>{promo.caption}</Text>
              <View style={[styles.cta, compact && styles.ctaCompact]}>
                <Text style={[styles.ctaText, compact && styles.ctaTextCompact]}>{promo.cta}</Text>
                <Ionicons name="arrow-forward" size={compact ? 13 : 15} color="#176e3c" />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {width > 0 && (
        <View style={styles.dots}>
          {PROMOTIONS.map((promo, index) => (
            <View key={promo.pill} style={[styles.pageDot, index === active && styles.activeDot]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#145a34',
  },
  wrapFull: {
    height: 190,
    marginBottom: 27,
  },
  wrapCompact: {
    height: 156,
    marginBottom: 24,
  },
  page: {
    height: '100%',
    justifyContent: 'center',
  },
  copy: {
    paddingLeft: 20,
    paddingRight: 16,
    alignItems: 'flex-start',
  },
  copyCompact: {
    paddingLeft: 17,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.17)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 9,
  },
  pillCompact: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 7,
  },
  pillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pillTextCompact: {
    fontSize: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleCompact: {
    fontSize: 19,
    lineHeight: 22,
  },
  caption: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  captionCompact: {
    fontSize: 11,
    marginTop: 5,
    marginBottom: 9,
  },
  cta: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaCompact: {
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  ctaText: {
    color: '#176e3c',
    fontSize: 11,
    fontWeight: '700',
  },
  ctaTextCompact: {
    fontSize: 10,
  },
  dots: {
    position: 'absolute',
    bottom: 11,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pageDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  activeDot: {
    width: 15,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
});