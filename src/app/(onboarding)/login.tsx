import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/store/auth";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

export default function LoginScreen() {
  const theme = useTheme();
  const { initializationError, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async () => {
    if (isLoading || isSubmitting) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password) {
      setErrorMessage("Enter a valid email address and password.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login(normalizedEmail, password, rememberMe);
      router.replace("/(tabs)");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center px-6">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-6">
            <Text className="text-[28px] font-extrabold text-content">
              Welcome Back!
            </Text>
            <Text className="mt-1 text-sm text-center text-muted">
              Your favorite groceries, delivered fast.
            </Text>
          </View>

          <View className="mt-4 gap-4">
            <View className="rounded-xl bg-element border border-border px-4 py-3.5 flex-row items-center">
              <MaterialIcons
                name="email"
                size={20}
                color={theme.textSecondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Enter Your Email"
                placeholderTextColor={theme.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isSubmitting}
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-base text-content"
              />
            </View>

            <View className="rounded-xl bg-element border border-border px-4 py-3.5 flex-row items-center">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.textSecondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Enter Your Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={submit}
                editable={!isSubmitting}
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-base text-content"
              />
              <Pressable
                hitSlop={8}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={theme.textSecondary}
                  style={{ marginLeft: 12 }}
                />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between px-1">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                className="flex-row items-center gap-2"
                onPress={() => setRememberMe(!rememberMe)}
                hitSlop={8}
              >
                <View
                  className={`h-5 w-5 rounded border items-center justify-center ${rememberMe ? "bg-brand-500 border-brand-500" : "border-border"}`}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text className="text-sm text-muted">Remember me</Text>
              </Pressable>
            </View>

            {errorMessage || initializationError ? (
              <Text accessibilityRole="alert" className="text-sm text-danger">
                {errorMessage ?? initializationError}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading || isSubmitting }}
              disabled={isLoading || isSubmitting}
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              onPress={submit}
              className="mt-4 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#16a34a", "#15803d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View className="items-center py-4">
                  <Text className="text-[18px] font-bold text-white shadow-sm">
                    {isLoading
                      ? "Restoring Session..."
                      : isSubmitting
                        ? "Signing In..."
                        : "Log In"}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          <SocialAuthButtons />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/(tabs)")}
            className="mt-4 items-center py-2"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
          >
            <Text className="text-sm font-semibold text-brand-ink">
              Continue as guest
            </Text>
          </Pressable>

          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-sm text-muted">Don't have an account? </Text>
            <Pressable
              onPress={() => router.push("/(onboarding)/signup")}
              hitSlop={8}
            >
              <Text className="text-sm font-bold text-brand-ink">Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
