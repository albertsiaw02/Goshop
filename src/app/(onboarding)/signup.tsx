import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/store/auth';

export default function SignupScreen() {
  const theme = useTheme();
  const { initializationError, isLoading, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async () => {
    if (isLoading || isSubmitting) return;
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedName) {
      setErrorMessage('Enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Your password must be at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms and Conditions to continue.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await register(normalizedName, normalizedEmail, password);
      router.replace('/(tabs)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              autoComplete="name"
              textContentType="name"
              editable={!isSubmitting}
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
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isSubmitting}
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
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={submit}
              editable={!isSubmitting}
              value={password}
              onChangeText={setPassword}
              className="flex-1 text-base text-content"
            />
            <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={theme.textSecondary} style={{ marginLeft: 12 }} />
            </Pressable>
          </View>

          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agreeTerms }} className="flex-row items-center gap-2 mt-1" onPress={() => setAgreeTerms(!agreeTerms)} hitSlop={8}>
            <View className={`h-5 w-5 rounded border items-center justify-center ${agreeTerms ? 'bg-brand-500 border-brand-500' : 'border-border'}`}>
              {agreeTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text className="text-sm text-muted">I agree with the Terms and Conditions</Text>
          </Pressable>

          {(errorMessage || initializationError) ? (
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
            className="mt-4 overflow-hidden rounded-2xl">
            <LinearGradient colors={['#16a34a', '#15803d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="items-center py-4">
                <Text className="text-[18px] font-bold text-white shadow-sm">
                  {isLoading ? 'Restoring Session...' : isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
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