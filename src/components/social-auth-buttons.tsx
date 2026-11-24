import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export function SocialAuthButtons() {
  const theme = useTheme();

  return (
    <View className="mt-5">
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-xs font-medium text-muted">OR CONTINUE WITH</Text>
        <View className="h-px flex-1 bg-border" />
      </View>
      <View className="gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert("Coming soon", "Google sign-in is not configured yet.")
          }
          className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-background"
          style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
        >
          <Ionicons name="logo-google" size={18} color={theme.text} />
          <Text className="text-sm font-semibold text-content">
            Continue with Google
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert("Coming soon", "Apple sign-in is not configured yet.")
          }
          className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-background"
          style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
        >
          <Ionicons name="logo-apple" size={19} color={theme.text} />
          <Text className="text-sm font-semibold text-content">
            Continue with Apple
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
