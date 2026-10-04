import { router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// SVG social icons (imported as components via metro transformer)
import GoogleLogo from '@/assets/expo.icon/google-icon-svgrepo-com.svg';
import AppleLogo from '@/assets/expo.icon/apple-173-svgrepo-com.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function SignupScreen() {
  const theme = useTheme();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center justify-center px-6 pt-16">
        <View className="items-center mb-6">
          <Text className="text-[28px] font-extrabold">Create Your Account</Text>
          <Text className="mt-1 text-sm text-center text-muted">Best Way to Manage Your Finances.</Text>
        </View>

        <View className="mt-4 gap-4">
          <View className="rounded-lg bg-element px-3 py-3 flex-row items-center">
            <MaterialIcons name="person" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={theme.textSecondary}
              className="flex-1 text-base text-content dark:text-content-dark"
            />
          </View>

          <View className="rounded-lg bg-element px-3 py-3 flex-row items-center">
            <MaterialIcons name="email" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter Your Email"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-base text-content dark:text-content-dark"
            />
          </View>

          <View className="rounded-lg bg-element px-3 py-3 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter Your Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              className="flex-1 text-base text-content dark:text-content-dark"
            />
            <Pressable hitSlop={8}>
              <Ionicons name="eye-off" size={18} color={theme.textSecondary} style={{ marginLeft: 12 }} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="h-4 w-4 rounded-full border border-muted" />
            <Text className="text-sm text-muted">I agree with the Terms and Conditions</Text>
          </View>

          <Pressable
            style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
            onPress={() => router.replace('/(tabs)')}
            className="mt-2 overflow-hidden rounded-2xl">
            <LinearGradient colors={['#000000', '#222222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="items-center py-4">
                <Text className="text-[18px] font-bold text-white">Sign Up</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        <View className="mt-6 items-center">
          <Text className="text-sm text-muted">— Or Continue With —</Text>
          <View className="mt-4 flex-row gap-4">
            <Pressable className="flex-row items-center rounded-full bg-element px-4 py-3">
              <View className="mr-3" style={{ width: 20, height: 20 }}>
                <GoogleLogo width={20} height={20} />
              </View>
              <Text>Google</Text>
            </Pressable>
            <Pressable className="flex-row items-center rounded-full bg-element px-4 py-3">
              <View className="mr-3" style={{ width: 20, height: 20 }}>
                <AppleLogo width={20} height={20} />
              </View>
              <Text>Apple</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-5 flex-row justify-center">
          <ThemedText>Already have an account? </ThemedText>
          <Pressable onPress={() => router.push('/(onboarding)/login')} hitSlop={8}>
            <Text className="text-sm font-bold text-brand-600">Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}