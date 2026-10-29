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
import { MobileMoneyCard } from '@/components/payment-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import {
  MOBILE_NETWORKS,
  MOBILE_NETWORK_LABEL,
  usePaymentMethods,
  type MobileMoneyPaymentMethod,
  type MobileNetwork,
} from '@/store/payment-methods';

export default function AddMobileMoneyScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { addMethod } = usePaymentMethods();

  const [network, setNetwork] = useState<MobileNetwork>('mtn');
  const [holder, setHolder] = useState('Albert Kay');
  const [phone, setPhone] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);

  const preview: MobileMoneyPaymentMethod = {
    kind: 'mobile',
    id: 'preview',
    network,
    phone: phone.trim() || '000 000 0000',
    holder: holder.trim() || 'Your name',
    isDefault: makeDefault,
  };

  const save = () => {
    if (!holder.trim()) {
      Alert.alert('Account name required', 'Enter the name registered to this number.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      Alert.alert('Check the phone number', 'Enter a valid mobile money number.');
      return;
    }

    addMethod({
      kind: 'mobile',
      network,
      phone: phone.trim(),
      holder: holder.trim(),
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
            subtitle="Link a mobile money account"
            title="Mobile money"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <MobileMoneyCard compact method={preview} />

              <View className="rounded-3xl border border-[#eef2f6] bg-element px-5 py-2">
                <View className="mb-2 mt-3 gap-0.5">
                  <ThemedText className="text-[15px] font-bold">Mobile money details</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Select your provider and enter the number linked to your wallet.
                  </ThemedText>
                </View>

                <View className="mb-3 mt-2 gap-2">
                  <ThemedText type="small" themeColor="textSecondary" className="font-semibold">
                    Provider
                  </ThemedText>
                  <View className="flex-row flex-wrap gap-2">
                    {MOBILE_NETWORKS.map((option) => {
                      const selected = option === network;
                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          key={option}
                          onPress={() => setNetwork(option)}
                          style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
                          className={`rounded-xl border px-3 py-2.5 ${
                            selected
                              ? 'border-brand-500 bg-brand-500'
                              : 'border-[#e2e8f0] bg-background'
                          }`}>
                          <ThemedText
                            type="small"
                            className={`font-semibold ${selected ? 'text-white' : ''}`}
                            themeColor={selected ? undefined : 'textSecondary'}>
                            {MOBILE_NETWORK_LABEL[option]}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="mt-1">
                  <FormField
                    autoCapitalize="words"
                    label="Account name"
                    onChangeText={setHolder}
                    placeholder="Name on the account"
                    value={holder}
                  />
                  <FormField
                    autoComplete="tel"
                    keyboardType="phone-pad"
                    label="Mobile money number"
                    onChangeText={setPhone}
                    placeholder="e.g. +256 77 000 0000"
                    value={phone}
                  />
                </View>
              </View>

              <View className="min-h-[64px] flex-row items-center gap-3 rounded-3xl border border-[#eef2f6] bg-element px-5">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                  <Ionicons name="star-outline" size={18} color="#16a34a" />
                </View>
                <View className="flex-1 gap-0.5">
                  <ThemedText className="font-semibold">Set as default</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Use this account first at checkout
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
                accessibilityLabel="Save mobile money account"
                className="items-center rounded-2xl bg-brand-500 py-4"
                onPress={save}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <ThemedText className="text-[16px] font-bold text-white">Save account</ThemedText>
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
