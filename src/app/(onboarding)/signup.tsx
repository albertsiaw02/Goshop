import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// SVG social icons (imported as components via metro transformer)
import GoogleLogo from '@/assets/expo.icon/google-icon-svgrepo-com.svg';
import AppleLogo from '@/assets/expo.icon/apple-173-svgrepo-com.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export default function SignupScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center justify-center px-6 pt-16">
        <View className="items-center mb-6">
          <Text className="text-[28px] font-extrabold text-content">Create Your Account</Text>
          <Text className="mt-1 text-sm text-center text-muted">Join us and start shopping in seconds.</Text>
        </View>

        <View className="mt-4 gap-4">
          <View className="rounded-xl bg-element border border-border px-4 py-3.5 flex-row items-center">
            <MaterialIcons name="person" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={theme.placeholder}
              value={name}
              onChangeText={setName}
              className="flex-1 text-base text-content"
            />
          </View>

          <View className="rounded-xl bg-element border border-border px-4 py-3.5 flex-row items-center">
            <MaterialIcons name="email" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter Your Email"
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              className="flex-1 text-base text-content"
            />
          </View>

          <View className="rounded-xl bg-element border border-border px-4 py-3.5 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter Your Password"
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1 text-base text-content"
            />
            <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={theme.textSecondary} style={{ marginLeft: 12 }} />
            </Pressable>
          </View>

          <Pressable className="flex-row items-center gap-2 mt-1" onPress={() => setAgreeTerms(!agreeTerms)} hitSlop={8}>
            <View className={`h-5 w-5 rounded border items-center justify-center ${agreeTerms ? 'bg-brand-500 border-brand-500' : 'border-border'}`}>
              {agreeTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text className="text-sm text-muted">I agree with the Terms and Conditions</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
            onPress={() => router.replace('/(tabs)')}
            className="mt-4 overflow-hidden rounded-2xl">
            <LinearGradient colors={['#16a34a', '#15803d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="items-center py-4">
                <Text className="text-[18px] font-bold text-white shadow-sm">Sign Up</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-sm text-muted font-medium">— Or Continue With —</Text>
          <View className="mt-5 flex-row gap-4">
            <Pressable className="flex-row items-center justify-center flex-1 rounded-2xl bg-background border border-border py-3.5 shadow-sm">
              <View className="mr-3" style={{ width: 20, height: 20 }}>
                <GoogleLogo width={20} height={20} />
              </View>
              <Text className="font-semibold text-content">Google</Text>
            </Pressable>
            <Pressable className="flex-row items-center justify-center flex-1 rounded-2xl bg-background border border-border py-3.5 shadow-sm">
              <View className="mr-3" style={{ width: 20, height: 20 }}>
                <AppleLogo width={20} height={20} />
              </View>
              <Text className="font-semibold text-content">Apple</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-sm text-muted">Already have an account? </Text>
          <Pressable onPress={() => router.push('/(onboarding)/login')} hitSlop={8}>
            <Text className="text-sm font-bold text-brand-ink">Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}