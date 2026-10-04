import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SLIDES = [
  {
    image: require('@/assets/images/onboardimg1.jpg'),
    title: 'Fresh, every day',
    description: 'Handpicked fruits, vegetables, dairy and more — quality groceries without leaving home.',
  },
  {
    image: require('@/assets/images/onboardimg2.jpg'),
    title: 'Shop in seconds',
    description: 'Search thousands of products, add to cart and check out with just a few taps.',
  },
  {
    image: require('@/assets/images/onboardimg3.jpg'),
    title: 'Delivered to your door',
    description: 'Track your order live and get your groceries delivered in under an hour.',
  },
];

const SWIPE_THUMB = 52;
const SWIPE_PAD = 6;

function SwipeToGetStarted({ onComplete }: { onComplete: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const widthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const maxTravel = (w: number) => Math.max(0, w - SWIPE_THUMB - SWIPE_PAD * 2);

  const animateTo = (target: number, cb?: () => void) => {
    Animated.timing(translateX, {
      toValue: target,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) cb?.();
    });
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.stopAnimation();
        setIsDragging(true);
      },
      onPanResponderMove: (_e, g) => {
        const max = maxTravel(widthRef.current);
        translateX.setValue(Math.max(0, Math.min(max, g.dx)));
      },
      onPanResponderRelease: (_e, g) => {
        setIsDragging(false);
        const max = maxTravel(widthRef.current);
        const isTap = Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6;
        if (isTap || g.dx >= max * 0.5) {
          animateTo(max, () => onCompleteRef.current());
        } else {
          animateTo(0);
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        animateTo(0);
      },
    }),
  ).current;

  const labelOpacity = translateX.interpolate({
    inputRange: [0, 36],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      className="relative h-16 w-full overflow-hidden rounded-full bg-white"
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
      }}
      {...responder.panHandlers}>
      {/* Left sliding thumb (animated) */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="absolute left-1.5 top-1.5 bottom-1.5 w-12 h-12 items-center justify-center rounded-full bg-emerald-500">
      <Ionicons name="chevron-forward" size={20} color="#fff" />
      </Animated.View>

      {/* Center label */}
      <View className="flex-1 items-center justify-center">
        <Animated.Text
          style={{ opacity: labelOpacity }}
          className="text-base font-bold text-content dark:text-content-dark">
          Get Started
        </Animated.Text>
      </View>

      {/* Right check circle */}
      <View className="absolute right-2 top-1.5 bottom-1.5 items-center justify-center">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-white bg-white/0">
        <Ionicons name="checkmark" size={18} color="#10b981" />
        </View>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [pageWidth, setPageWidth] = useState(windowWidth);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    if (next !== index && next >= 0 && next < SLIDES.length) {
      setIndex(next);
    }
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    }
  };

  const controlsHeight = isLast ? insets.bottom + 20 + 40 + 16 + 64 : insets.bottom + 20 + 40;

  return (
    <View className="flex-1">
      <View
        className="flex-1 w-full max-w-[800px] self-center"
        onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          snapToInterval={pageWidth}
          disableIntervalMomentum
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({ length: pageWidth, offset: pageWidth * i, index: i })}
          renderItem={({ item }) => (
                      <View style={{ width: pageWidth }} className="flex-1">
                        <Image source={item.image} resizeMode="cover" className="absolute inset-0 h-full w-full" />

                        {/* Title at top-left like the provided UI */}
                        <View className="absolute inset-x-0 top-20 px-6">
                          <Text className="text-[40px] font-extrabold text-white leading-tight">
                            {item.title}
                          </Text>
                          <Text className="mt-3 text-[16px] text-white/90 max-w-[520px]">
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    )}
        />

        <View
          style={{ paddingBottom: insets.bottom + 20 }}
          className="absolute inset-x-0 bottom-0 px-6"
          pointerEvents="box-none">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row gap-2">
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  className={`h-2 rounded-full ${i === index ? 'w-6 bg-brand-400' : 'w-2 bg-white/50'}`}
                />
              ))}
            </View>
            {!isLast && (
              <Pressable onPress={goNext} hitSlop={8}>
                <View className="rounded-full bg-black/45 px-4 py-2">
                  <Text className="text-sm font-bold text-white">Next →</Text>
                </View>
              </Pressable>
            )}
          </View>

          {isLast && <SwipeToGetStarted onComplete={() => router.push('/(onboarding)/login')} />}
        </View>
      </View>
    </View>
  );
}