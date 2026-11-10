import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { useTheme } from "@/hooks/use-theme";
import { CartProvider } from "@/store/cart";
import { LanguageProvider } from "@/store/language";
import { PaymentMethodsProvider } from "@/store/payment-methods";
import { ThemeProvider, useThemePreference } from "@/store/theme";

function AppShell() {
  const theme = useTheme();
  const { scheme } = useThemePreference();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <CartProvider>
        <PaymentMethodsProvider>
          <LanguageProvider>
            <AnimatedSplashOverlay />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background },
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
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
              <Stack.Screen name="delivery" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
              <Stack.Screen name="language" options={{ headerShown: false }} />
              <Stack.Screen name="payment-methods/index" options={{ headerShown: false }} />
              <Stack.Screen name="payment-methods/add" options={{ headerShown: false }} />
              <Stack.Screen
                name="payment-methods/add-mobile-money"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="payment-methods/[id]" options={{ headerShown: false }} />
            </Stack>
          </LanguageProvider>
        </PaymentMethodsProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
