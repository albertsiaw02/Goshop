import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { PaymentCard } from '@/components/payment-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import {
  detectCardBrand,
  usePaymentMethods,
  type CardPaymentMethod,
} from '@/store/payment-methods';

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function isValidExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return false;
  const expiry = new Date(2000 + Number(match[2]), month);
  return expiry > new Date();
}

export default function AddPaymentMethodScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { addMethod } = usePaymentMethods();

  const [holder, setHolder] = useState('Albert Kay');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);

  const digits = number.replace(/\D/g, '');
  const preview: CardPaymentMethod = {
    kind: 'card',
    id: 'preview',
    brand: detectCardBrand(digits),
    last4: digits.slice(-4) || '0000',
    holder: holder.trim() || 'Your name',
    expiry: expiry || 'MM/YY',
    isDefault: makeDefault,
  };

  const save = () => {
    if (!holder.trim()) {
      Alert.alert('Cardholder name required', 'Enter the name printed on your card.');
      return;
    }
    if (digits.length < 15 || digits.length > 16) {
      Alert.alert('Check your card number', 'Enter a valid 15 or 16 digit card number.');
      return;
    }
    if (!isValidExpiry(expiry)) {
      Alert.alert('Check the expiry date', 'Enter a valid expiry date in MM/YY format.');
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      Alert.alert('Check the security code', 'Enter the 3 or 4 digit code on your card.');
      return;
    }

    addMethod({
      kind: 'card',
      brand: detectCardBrand(digits),
      last4: digits.slice(-4),
      holder: holder.trim(),
      expiry,
      isDefault: makeDefault,
    });
    router.back();
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/payment-methods"
            subtitle="Save a card for faster checkout"
            title="Add payment method"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <PaymentCard compact method={preview} />

              <View className="rounded-3xl border border-[#eef2f6] bg-element px-5 py-2">
                <View className="mb-2 mt-3 gap-0.5">
                  <ThemedText className="text-[15px] font-bold">Card details</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    We only store the last 4 digits of your card.
                  </ThemedText>
                </View>

                <View className="mt-2">
                  <FormField
                    autoCapitalize="words"
                    autoComplete="cc-name"
                    label="Cardholder name"
                    onChangeText={setHolder}
                    placeholder="Name on card"
                    value={holder}
                  />
                  <FormField
                    autoComplete="cc-number"
                    keyboardType="number-pad"
                    label="Card number"
                    maxLength={19}
                    onChangeText={(value) => setNumber(formatCardNumber(value))}
                    placeholder="1234 5678 9012 3456"
                    value={number}
                  />
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <FormField
                        autoComplete="cc-exp"
                        keyboardType="number-pad"
                        label="Expiry date"
                        maxLength={5}
                        onChangeText={(value) => setExpiry(formatExpiry(value))}
                        placeholder="MM/YY"
                        value={expiry}
                      />
                    </View>
                    <View className="flex-1">
                      <FormField
                        autoComplete="cc-csc"
                        keyboardType="number-pad"
                        label="Security code"
                        maxLength={4}
                        onChangeText={(value) => setCvv(value.replace(/\D/g, ''))}
                        placeholder="CVV"
                        secureTextEntry
                        value={cvv}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View className="min-h-[64px] flex-row items-center gap-3 rounded-3xl border border-[#eef2f6] bg-element px-5">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                  <Ionicons name="star-outline" size={18} color="#16a34a" />
                </View>
                <View className="flex-1 gap-0.5">
                  <ThemedText className="font-semibold">Set as default</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Use this card first at checkout
                  </ThemedText>
                </View>
                <Switch
                  accessibilityLabel="Set as default payment method"
                  onValueChange={setMakeDefault}
                  thumbColor="#ffffff"
                  trackColor={{ false: theme.backgroundSelected, true: '#16a34a' }}
                  value={makeDefault}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save payment method"
                className="items-center rounded-2xl bg-brand-500 py-4"
                onPress={save}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <ThemedText className="text-[16px] font-bold text-white">Save card</ThemedText>
              </Pressable>

              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
                <ThemedText type="small" themeColor="textSecondary">
                  Your payment details are encrypted.
                </ThemedText>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
