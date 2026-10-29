import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { CartProvider } from "@/store/cart";
import { PaymentMethodsProvider } from "@/store/payment-methods";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar style="dark" />
      <CartProvider>
        <PaymentMethodsProvider>
          <AnimatedSplashOverlay />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#ffffff" },
              headerStyle: { backgroundColor: "#ffffff" },
              headerTintColor: "#0f172a",
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="product/[id]"
              options={{ headerShown: true, title: "Product" }}
            />
            <Stack.Screen
              name="checkout"
              options={{ headerShown: true, title: "Checkout" }}
            />
            <Stack.Screen
              name="order-tracking/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="payment-methods/index" options={{ headerShown: false }} />
            <Stack.Screen name="payment-methods/add" options={{ headerShown: false }} />
            <Stack.Screen
              name="payment-methods/add-mobile-money"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="payment-methods/[id]" options={{ headerShown: false }} />
          </Stack>
        </PaymentMethodsProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
