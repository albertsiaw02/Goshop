import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function DeliverySection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <ThemedView
      type="backgroundElement"
      className="rounded-2xl border border-[#eef2f6] px-4 pb-1 pt-4">
      <View className="mb-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <Ionicons name={icon} size={19} color="#15803d" />
        </View>
        <View className="flex-1 gap-0.5">
          <ThemedText className="text-[15px] font-bold">{title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        </View>
      </View>
      <View className="mt-3">{children}</View>
    </ThemedView>
  );
}

type DeliveryDetails = {
  recipient: string;
  phone: string;
  address: string;
  unit: string;
  city: string;
  instructions: string;
};

const EMPTY_DETAILS: DeliveryDetails = {
  recipient: '',
  phone: '',
  address: '',
  unit: '',
  city: '',
  instructions: '',
};

export default function DeliveryScreen() {
  const insets = useSafeAreaInsets();
  const [deliveryDetails, setDeliveryDetails] = useState(EMPTY_DETAILS);
  const [draftDetails, setDraftDetails] = useState(EMPTY_DETAILS);
  const isDirty =
    deliveryDetails.recipient !== draftDetails.recipient ||
    deliveryDetails.phone !== draftDetails.phone ||
    deliveryDetails.address !== draftDetails.address ||
    deliveryDetails.unit !== draftDetails.unit ||
    deliveryDetails.city !== draftDetails.city ||
    deliveryDetails.instructions !== draftDetails.instructions;

  const updateField = (field: keyof DeliveryDetails, value: string) => {
    setDraftDetails((details) => ({ ...details, [field]: value }));
  };

  const saveDeliveryDetails = () => {
    if (
      !draftDetails.recipient.trim() ||
      !draftDetails.phone.trim() ||
      !draftDetails.address.trim() ||
      !draftDetails.city.trim()
    ) {
      Alert.alert(
        'Check your delivery details',
        'Enter a recipient, phone number, street address, and city.',
      );
      return;
    }

    const savedDetails: DeliveryDetails = {
      recipient: draftDetails.recipient.trim(),
      phone: draftDetails.phone.trim(),
      address: draftDetails.address.trim(),
      unit: draftDetails.unit.trim(),
      city: draftDetails.city.trim(),
      instructions: draftDetails.instructions.trim(),
    };
    setDeliveryDetails(savedDetails);
    setDraftDetails(savedDetails);
    Alert.alert('Delivery details saved', 'Your delivery address has been updated.');
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/profile"
            subtitle="Your drop-off details"
            title="Delivery address"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <ThemedView
                className="flex-row items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-4">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-background">
                  <Ionicons name="location" size={21} color="#15803d" />
                </View>
                <View className="flex-1 gap-0.5">
                  <ThemedText className="text-base font-bold">Where should we bring it?</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Add an address and a way for your courier to reach you.
                  </ThemedText>
                </View>
              </ThemedView>

              <DeliverySection
                icon="person-outline"
                subtitle="Who should the courier ask for?"
                title="Contact details">
                  <FormField
                    autoCapitalize="words"
                    label="Recipient name"
                    onChangeText={(value) => updateField('recipient', value)}
                    placeholder="Name at the delivery address"
                    value={draftDetails.recipient}
                  />
                  <FormField
                    keyboardType="phone-pad"
                    label="Phone number"
                    onChangeText={(value) => updateField('phone', value)}
                    placeholder="+971 50 000 0000"
                    value={draftDetails.phone}
                  />
              </DeliverySection>

              <DeliverySection
                icon="navigate-outline"
                subtitle="A precise address helps avoid delays."
                title="Drop-off location">
                  <FormField
                    autoCapitalize="words"
                    label="Street address"
                    onChangeText={(value) => updateField('address', value)}
                    placeholder="Building and street"
                    value={draftDetails.address}
                  />
                  <FormField
                    autoCapitalize="words"
                    label="Apartment, suite, etc. (optional)"
                    onChangeText={(value) => updateField('unit', value)}
                    placeholder="Apartment or unit number"
                    value={draftDetails.unit}
                  />
                  <FormField
                    autoCapitalize="words"
                    label="City"
                    onChangeText={(value) => updateField('city', value)}
                    placeholder="City"
                    value={draftDetails.city}
                  />
              </DeliverySection>

              <DeliverySection
                icon="chatbox-ellipses-outline"
                subtitle="Optional details for the courier."
                title="Drop-off notes">
                  <FormField
                    label="Instructions (optional)"
                    onChangeText={(value) => updateField('instructions', value)}
                    placeholder="Gate code, landmark, or safe place"
                    value={draftDetails.instructions}
                  />
              </DeliverySection>
            </ScrollView>

            <View
              className="border-t border-[#eef2f6] bg-background px-1 pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !isDirty }}
                className={`h-12 flex-row items-center justify-center gap-2 rounded-xl ${
                  isDirty ? 'bg-brand-500' : 'bg-selected'
                }`}
                disabled={!isDirty}
                onPress={saveDeliveryDetails}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <Ionicons
                  name={isDirty ? 'checkmark-circle-outline' : 'checkmark-circle'}
                  size={19}
                  color={isDirty ? '#ffffff' : '#64748b'}
                />
                <ThemedText
                  className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                  themeColor={isDirty ? undefined : 'textSecondary'}>
                  {isDirty ? 'Save delivery details' : 'No changes to save'}
                </ThemedText>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
