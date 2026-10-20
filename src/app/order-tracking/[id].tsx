import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function OrderTrackingScreen() {
  const { id, placed, status, address } = useLocalSearchParams<{
    id: string;
    placed?: string;
    status?: string;
    address?: string;
  }>();

  const delivered = status === "delivered";
  const currentStep = placed === "1" && !delivered ? 0 : 2;
  const statusTitle = delivered
    ? "Order delivered!"
    : "Your groceries are on the way";
  const statusDescription = delivered
    ? "We hope you enjoy your fresh picks."
    : placed === "1"
      ? "We’ve received your order and are getting it ready."
      : "Your fresh picks are on their way to you.";
  const steps = [
    "Order confirmed",
    "Packing your groceries",
    delivered ? "Delivered" : "Out for delivery",
  ];

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="mx-auto w-full max-w-[680px] flex-1">
          <View className="h-12 justify-center px-5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full bg-element"
              onPress={() =>
                router.canGoBack()
                  ? router.back()
                  : router.replace("/(tabs)/orders")
              }
            >
              <Ionicons name="chevron-back" size={20} color="#0f172a" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center pb-7 pt-8">
              <View className="mb-5 h-28 w-28 items-center justify-center rounded-full bg-brand-50">
                <Text className="text-[58px]">{delivered ? "🛍️" : "🛵"}</Text>
                {!delivered && (
                  <View className="absolute -bottom-1 -right-1 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-white">
                    <Text className="text-[23px]">🥬</Text>
                  </View>
                )}
              </View>
              <ThemedText className="text-center text-[27px] font-extrabold leading-9">
                {statusTitle}
              </ThemedText>
              <ThemedText
                className="mt-1 max-w-[300px] text-center text-[15px]"
                themeColor="textSecondary"
              >
                {statusDescription}
              </ThemedText>
              {!delivered && (
                <View className="mt-4 flex-row items-center gap-2 rounded-full bg-brand-50 px-4 py-2">
                  <Ionicons name="time-outline" size={16} color="#15803d" />
                  <Text className="text-[13px] font-semibold text-brand-700">
                    Estimated delivery in 30–45 min
                  </Text>
                </View>
              )}
            </View>

            <View className="border-y border-[#eef2f6] py-5">
              <View className="flex-row items-center gap-4">
                <View className="h-[68px] w-[68px] items-center justify-center rounded-2xl bg-element">
                  <Text className="text-[35px]">🧺</Text>
                </View>
                <View className="flex-1">
                  <ThemedText className="text-[16px] font-bold">
                    Fresh grocery order
                  </ThemedText>
                  <ThemedText
                    className="mt-1 text-[13px]"
                    themeColor="textSecondary"
                  >
                    Picked fresh and packed with care
                  </ThemedText>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[20px]">🍎</Text>
                  <Text className="text-[20px]">🥛</Text>
                  <Text className="text-[20px]">🥕</Text>
                </View>
              </View>
            </View>

            <View className="py-5">
              <ThemedText className="mb-5 text-[18px] font-bold">
                Delivery progress
              </ThemedText>
              {steps.map((step, index) => {
                const complete = index <= currentStep;
                const isLast = index === steps.length - 1;
                return (
                  <View key={step} className="flex-row gap-3">
                    <View className="w-7 items-center">
                      <View
                        className={`h-7 w-7 items-center justify-center rounded-full ${
                          complete ? "bg-brand-500" : "bg-element"
                        }`}
                      >
                        <Ionicons
                          name={complete ? "checkmark" : "ellipse-outline"}
                          size={15}
                          color={complete ? "#ffffff" : "#94a3b8"}
                        />
                      </View>
                      {!isLast && (
                        <View
                          className={`my-1 h-7 w-0.5 ${
                            index < currentStep ? "bg-brand-500" : "bg-element"
                          }`}
                        />
                      )}
                    </View>
                    <ThemedText
                      className={`pt-1 text-[14px] ${
                        complete ? "font-semibold" : ""
                      }`}
                      themeColor={complete ? "text" : "textSecondary"}
                    >
                      {step}
                    </ThemedText>
                  </View>
                );
              })}
            </View>

            <View className="border-t border-[#eef2f6] pt-5">
              <ThemedText className="mb-4 text-[18px] font-bold">
                Order details
              </ThemedText>
              <View className="gap-4">
                <View className="flex-row justify-between gap-4">
                  <ThemedText
                    className="text-[14px]"
                    themeColor="textSecondary"
                  >
                    Order ID
                  </ThemedText>
                  <ThemedText className="text-right text-[14px] font-semibold">
                    {id ?? "—"}
                  </ThemedText>
                </View>
                <View className="flex-row justify-between gap-4">
                  <ThemedText
                    className="text-[14px]"
                    themeColor="textSecondary"
                  >
                    Delivery to
                  </ThemedText>
                  <ThemedText className="text-right text-[14px] font-semibold">
                    {typeof address === "string"
                      ? address
                      : "Address saved at checkout"}
                  </ThemedText>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              className="mt-7 flex-row items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4"
              onPress={() => router.replace("/(tabs)/browse")}
              style={({ pressed }) => (pressed ? { opacity: 0.88 } : undefined)}
            >
              <Ionicons name="basket-outline" size={19} color="#ffffff" />
              <Text className="text-[16px] font-bold text-white">
                Continue shopping
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
