import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
            subtitle="Set where your groceries should go"
            title="Delivery address"
          />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <ThemedView
                type="backgroundElement"
                className="rounded-3xl border border-[#eef2f6] px-5 py-2">
                <View className="mb-1 mt-3 gap-0.5">
                  <ThemedText className="text-[15px] font-bold">Delivery details</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Add your address and a phone number for the courier.
                  </ThemedText>
                </View>

                <View className="mt-3">
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
                  <FormField
                    label="Delivery instructions (optional)"
                    onChangeText={(value) => updateField('instructions', value)}
                    placeholder="Gate code, landmarks, or other notes"
                    value={draftDetails.instructions}
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !isDirty }}
                  className={`mb-3 mt-1 items-center rounded-xl py-3 ${
                    isDirty ? 'bg-brand-500' : 'bg-selected'
                  }`}
                  disabled={!isDirty}
                  onPress={saveDeliveryDetails}
                  style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                  <ThemedText
                    className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                    themeColor={isDirty ? undefined : 'textSecondary'}>
                    Save delivery details
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
