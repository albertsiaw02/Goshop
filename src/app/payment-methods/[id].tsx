import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
import { MobileMoneyCard, PaymentCard } from '@/components/payment-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import {
  MOBILE_NETWORKS,
  MOBILE_NETWORK_LABEL,
  getPaymentMethodLabel,
  usePaymentMethods,
  type MobileNetwork,
} from '@/store/payment-methods';

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

export default function EditPaymentMethodScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMethod, updateMethod, removeMethod } = usePaymentMethods();
  const method = getMethod(id);

  const [holder, setHolder] = useState(method?.holder ?? '');
  const [expiry, setExpiry] = useState(method?.kind === 'card' ? method.expiry : '');
  const [phone, setPhone] = useState(method?.kind === 'mobile' ? method.phone : '');
  const [network, setNetwork] = useState<MobileNetwork>(
    method?.kind === 'mobile' ? method.network : 'mtn',
  );
  const [makeDefault, setMakeDefault] = useState(false);

  if (!method) {
    return (
      <ThemedView className="flex-1">
        <SafeAreaView edges={['top']} className="flex-1">
          <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
            <ScreenHeader fallback="/payment-methods" title="Payment method" />
            <View className="mt-8 items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-element">
                <Ionicons name="card-outline" size={30} color={theme.textSecondary} />
              </View>
              <ThemedText className="text-[17px] font-bold">Payment method not found</ThemedText>
              <ThemedText themeColor="textSecondary" className="text-center">
                This payment method may have been removed.
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                className="mt-2 items-center rounded-2xl bg-brand-500 px-6 py-3"
                onPress={() => router.replace('/payment-methods')}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <ThemedText className="font-semibold text-white">
                  Back to payment methods
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const isDefault = method.isDefault || makeDefault;
  const isCard = method.kind === 'card';

  const save = () => {
    if (!holder.trim()) {
      Alert.alert('Account name required', 'Enter the name on this payment method.');
      return;
    }

    if (isCard) {
      if (!isValidExpiry(expiry)) {
        Alert.alert('Check the expiry date', 'Enter a valid expiry date in MM/YY format.');
        return;
      }
      updateMethod(method.id, { holder: holder.trim(), expiry, isDefault });
    } else {
      if (phone.replace(/\D/g, '').length < 9) {
        Alert.alert('Check the phone number', 'Enter a valid mobile money number.');
        return;
      }
      updateMethod(method.id, {
        holder: holder.trim(),
        phone: phone.trim(),
        network,
        isDefault,
      });
    }

    router.back();
  };

  const confirmRemove = () => {
    Alert.alert(
      'Remove payment method',
      `Remove ${getPaymentMethodLabel(method)}? You can add it again later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeMethod(method.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/payment-methods"
            subtitle={getPaymentMethodLabel(method)}
            title="Edit payment method"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {method.kind === 'card' ? (
                <PaymentCard
                  compact
                  method={{
                    ...method,
                    holder: holder.trim() || method.holder,
                    expiry: expiry || method.expiry,
                    isDefault,
                  }}
                />
              ) : (
                <MobileMoneyCard
                  compact
                  method={{
                    ...method,
                    holder: holder.trim() || method.holder,
                    phone: phone.trim() || method.phone,
                    network,
                    isDefault,
                  }}
                />
              )}

              <View className="rounded-3xl border border-[#eef2f6] bg-element px-5 py-2">
                <View className="mb-2 mt-3 gap-0.5">
                  <ThemedText className="text-[15px] font-bold">
                    {isCard ? 'Card details' : 'Mobile money details'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {isCard
                      ? 'Update the name or expiry date on this card.'
                      : 'Update your provider or the number linked to this wallet.'}
                  </ThemedText>
                </View>

                <View className="mt-2">
                  <FormField
                    autoCapitalize="words"
                    autoComplete="cc-name"
                    label={isCard ? 'Cardholder name' : 'Account name'}
                    onChangeText={setHolder}
                    placeholder="Name on account"
                    value={holder}
                  />

                  {isCard ? (
                    <FormField
                      autoComplete="cc-exp"
                      keyboardType="number-pad"
                      label="Expiry date"
                      maxLength={5}
                      onChangeText={(value) => setExpiry(formatExpiry(value))}
                      placeholder="MM/YY"
                      value={expiry}
                    />
                  ) : (
                    <>
                      <View className="mb-3 gap-2">
                        <ThemedText
                          type="small"
                          themeColor="textSecondary"
                          className="font-semibold">
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
                                style={({ pressed }) =>
                                  pressed ? { opacity: 0.75 } : undefined
                                }
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
                      <FormField
                        autoComplete="tel"
                        keyboardType="phone-pad"
                        label="Mobile money number"
                        onChangeText={setPhone}
                        placeholder="e.g. +256 77 000 0000"
                        value={phone}
                      />
                    </>
                  )}
                </View>
              </View>

              <View className="min-h-[64px] flex-row items-center gap-3 rounded-3xl border border-[#eef2f6] bg-element px-5">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                  <Ionicons name="star-outline" size={18} color="#16a34a" />
                </View>
                <View className="flex-1 gap-0.5">
                  <ThemedText className="font-semibold">
                    {method.isDefault ? 'Default payment method' : 'Set as default'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {method.isDefault
                      ? 'This method is used first at checkout'
                      : 'Use this method first at checkout'}
                  </ThemedText>
                </View>
                <Switch
                  accessibilityLabel="Set as default payment method"
                  disabled={method.isDefault}
                  onValueChange={setMakeDefault}
                  thumbColor="#ffffff"
                  trackColor={{ false: theme.backgroundSelected, true: '#16a34a' }}
                  value={isDefault}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save payment method"
                className="items-center rounded-2xl bg-brand-500 py-4"
                onPress={save}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <ThemedText className="text-[16px] font-bold text-white">Save changes</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove payment method"
                className="min-h-[56px] flex-row items-center justify-center gap-2 rounded-2xl border border-[#fecaca] bg-[#fef2f2]"
                onPress={confirmRemove}
                style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
                <ThemedText className="font-semibold text-danger">Remove payment method</ThemedText>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
