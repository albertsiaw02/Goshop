import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getProductById } from "@/data/products";
import { useTheme } from "@/hooks/use-theme";
import { useCart } from "@/store/cart";

const DELIVERY_FEE = 2.5;

export default function CartScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { items, setQty, removeItem } = useCart();

  const rows = items.flatMap((item) => {
    const product = getProductById(item.id);
    return product ? [{ item, product }] : [];
  });

  const subtotal = rows.reduce(
    (sum, row) => sum + row.product.price * row.item.qty,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <View
          className="mx-auto w-full max-w-[800px] flex-1 px-5 pt-3"
          style={{
            paddingBottom: insets.bottom + (Platform.OS === "ios" ? 50 : 56),
          }}
        >
          <View className="mb-5 h-12 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full border border-[#eef2f6]"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/browse")
              }
            >
              <Ionicons name="chevron-back" size={20} color={theme.text} />
            </Pressable>
            <View className="items-center">
              <ThemedText className="text-[18px] font-bold">My Cart</ThemedText>
              {rows.length > 0 && (
                <ThemedText className="text-[11px]" themeColor="textSecondary">
                  {rows.length} {rows.length === 1 ? "item" : "items"}
                </ThemedText>
              )}
            </View>
            <View className="h-10 w-10" />
          </View>

          {rows.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-4">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                <Ionicons name="cart-outline" size={38} color="#16a34a" />
              </View>
              <ThemedText className="text-[18px] font-bold">
                Your cart is empty
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                Add something fresh to get started.
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/browse")}
                style={({ pressed }) =>
                  pressed ? { opacity: 0.85 } : undefined
                }
              >
                <View className="mt-1 rounded-2xl bg-brand-500 px-7 py-3.5">
                  <Text className="text-[15px] font-bold text-white">
                    Start Shopping
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <>
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  {rows.map(({ item, product }, index) => (
                    <View
                      key={product.id}
                      className={`flex-row items-center gap-3 py-4 ${
                        index < rows.length - 1
                          ? "border-b border-[#eef2f6]"
                          : ""
                      }`}
                    >
                      <View
                        className="h-[82px] w-[82px] items-center justify-center rounded-[20px]"
                        style={{ backgroundColor: theme.backgroundElement }}
                      >
                        <Text className="text-[38px]">{product.emoji}</Text>
                      </View>

                      <View className="min-w-0 flex-1">
                        <View className="flex-row items-start justify-between gap-2">
                          <ThemedText
                            numberOfLines={1}
                            className="flex-1 text-[15px] font-semibold leading-5"
                          >
                            {product.name}
                          </ThemedText>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${product.name} from cart`}
                            className="h-6 w-6 items-center justify-center"
                            onPress={() => removeItem(product.id)}
                          >
                            <Ionicons
                              name="close"
                              size={18}
                              color={theme.textSecondary}
                            />
                          </Pressable>
                        </View>
                        <ThemedText
                          className="mt-0.5 text-[12px]"
                          themeColor="textSecondary"
                        >
                          {product.weight}
                        </ThemedText>
                        <View className="mt-2.5 flex-row items-center justify-between gap-2">
                          <ThemedText className="text-[15px] font-bold">
                            ${(product.price * item.qty).toFixed(2)}
                          </ThemedText>
                          <View className="flex-row items-center gap-2">
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Decrease ${product.name} quantity`}
                              className="h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb]"
                              onPress={() => setQty(product.id, item.qty - 1)}
                            >
                              <Ionicons
                                name="remove"
                                size={17}
                                color={theme.text}
                              />
                            </Pressable>
                            <ThemedText className="min-w-[18px] text-center text-[14px] font-semibold">
                              {item.qty}
                            </ThemedText>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Increase ${product.name} quantity`}
                              className="h-9 w-9 items-center justify-center rounded-xl border border-brand-400"
                              onPress={() => setQty(product.id, item.qty + 1)}
                            >
                              <Ionicons name="add" size={17} color="#16a34a" />
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View className="mt-3 gap-3 border-t border-[#eef2f6] pt-5">
                  <View className="flex-row justify-between">
                    <ThemedText
                      className="text-[14px]"
                      themeColor="textSecondary"
                    >
                      Subtotal
                    </ThemedText>
                    <ThemedText className="text-[14px] font-semibold">
                      ${subtotal.toFixed(2)}
                    </ThemedText>
                  </View>
                  <View className="flex-row justify-between">
                    <ThemedText
                      className="text-[14px]"
                      themeColor="textSecondary"
                    >
                      Delivery fee
                    </ThemedText>
                    <ThemedText className="text-[14px] font-semibold">
                      ${DELIVERY_FEE.toFixed(2)}
                    </ThemedText>
                  </View>
                  <View className="mt-1 flex-row justify-between border-t border-[#eef2f6] pt-4">
                    <ThemedText className="text-[16px] font-bold">
                      Total
                    </ThemedText>
                    <ThemedText className="text-[16px] font-bold text-brand-600">
                      ${total.toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              </ScrollView>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) =>
                  pressed ? { opacity: 0.88 } : undefined
                }
                onPress={() => router.push("/checkout")}
              >
                <View className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl bg-brand-500 py-[17px]">
                  <Text className="text-[16px] font-bold text-white">
                    Checkout · ${total.toFixed(2)}
                  </Text>
                  <Ionicons name="arrow-forward" size={17} color="#ffffff" />
                </View>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
