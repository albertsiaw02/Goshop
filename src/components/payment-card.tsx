import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import {
  CARD_BRAND_LABEL,
  MOBILE_NETWORK_LABEL,
  type CardBrand,
  type CardPaymentMethod,
  type MobileMoneyPaymentMethod,
  type MobileNetwork,
  type PaymentMethod,
} from '@/store/payment-methods';

const CARD_GRADIENTS: Record<CardBrand, [string, string, string]> = {
  visa: ['#1e3a8a', '#2563eb', '#60a5fa'],
  mastercard: ['#111827', '#374151', '#6b7280'],
  amex: ['#115e59', '#0d9488', '#2dd4bf'],
  other: ['#334155', '#475569', '#94a3b8'],
};

const MOBILE_GRADIENTS: Record<MobileNetwork, [string, string, string]> = {
  mtn: ['#78350f', '#b45309', '#f59e0b'],
  airtel: ['#7f1d1d', '#dc2626', '#f87171'],
  mpesa: ['#064e3b', '#047857', '#34d399'],
  orange: ['#7c2d12', '#ea580c', '#fb923c'],
};

type CardVisualProps = {
  compact?: boolean;
};

function DefaultBadge() {
  return (
    <View className="rounded-full bg-white/20 px-2.5 py-1">
      <Text className="text-[9px] font-extrabold uppercase tracking-wider text-white">Default</Text>
    </View>
  );
}

export function PaymentCard({
  method,
  compact = false,
}: CardVisualProps & { method: CardPaymentMethod }) {
  return (
    <LinearGradient
      colors={CARD_GRADIENTS[method.brand]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{
        borderRadius: compact ? 20 : 24,
        padding: compact ? 16 : 20,
        minHeight: compact ? 132 : 176,
        justifyContent: 'space-between',
      }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-[13px] font-extrabold uppercase tracking-widest text-white">
          {CARD_BRAND_LABEL[method.brand]}
        </Text>
        {method.isDefault ? <DefaultBadge /> : null}
      </View>

      <View className="mt-4 h-7 w-9 rounded-md bg-[#f4d06f]" />

      <Text
        className={`text-white ${compact ? 'mt-3 text-[18px]' : 'mt-4 text-[22px]'} font-semibold tracking-[2px]`}>
        •••• •••• •••• {method.last4}
      </Text>

      <View className={`flex-row items-end justify-between ${compact ? 'mt-3' : 'mt-5'}`}>
        <View className="flex-1 gap-0.5">
          <Text className="text-[8px] font-bold uppercase tracking-widest text-white/60">
            Card holder
          </Text>
          <Text numberOfLines={1} className="text-[12px] font-semibold uppercase text-white">
            {method.holder}
          </Text>
        </View>
        <View className="items-end gap-0.5">
          <Text className="text-[8px] font-bold uppercase tracking-widest text-white/60">
            Expires
          </Text>
          <Text className="text-[12px] font-semibold text-white">{method.expiry}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export function MobileMoneyCard({
  method,
  compact = false,
}: CardVisualProps & { method: MobileMoneyPaymentMethod }) {
  return (
    <LinearGradient
      colors={MOBILE_GRADIENTS[method.network]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{
        borderRadius: compact ? 20 : 24,
        padding: compact ? 16 : 20,
        minHeight: compact ? 132 : 158,
        justifyContent: 'space-between',
      }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="phone-portrait-outline" size={16} color="#ffffff" />
          <Text className="text-[13px] font-extrabold uppercase tracking-widest text-white">
            {MOBILE_NETWORK_LABEL[method.network]}
          </Text>
        </View>
        {method.isDefault ? <DefaultBadge /> : null}
      </View>

      <View className={compact ? 'mt-3 gap-1' : 'mt-5 gap-1.5'}>
        <Text className="text-[9px] font-bold uppercase tracking-widest text-white/60">
          Mobile money number
        </Text>
        <Text className={`font-semibold text-white ${compact ? 'text-[18px]' : 'text-[21px]'}`}>
          {method.phone}
        </Text>
      </View>

      <View className={`flex-row items-end justify-between ${compact ? 'mt-3' : 'mt-5'}`}>
        <View className="flex-1 gap-0.5">
          <Text className="text-[8px] font-bold uppercase tracking-widest text-white/60">
            Account name
          </Text>
          <Text numberOfLines={1} className="text-[12px] font-semibold uppercase text-white">
            {method.holder}
          </Text>
        </View>
        <Text className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
          Mobile money
        </Text>
      </View>
    </LinearGradient>
  );
}

export function PaymentMethodVisual({
  method,
  compact = false,
}: CardVisualProps & { method: PaymentMethod }) {
  if (method.kind === 'mobile') {
    return <MobileMoneyCard compact={compact} method={method} />;
  }
  return <PaymentCard compact={compact} method={method} />;
}
