import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ToggleRow } from '@/components/settings-rows';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <ThemedView type="backgroundElement" className="rounded-3xl border border-[#eef2f6] px-5 py-2">
      <View className="mb-1 mt-3 gap-0.5">
        <ThemedText className="text-[15px] font-bold">{title}</ThemedText>
        {description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </ThemedView>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader
            fallback="/profile"
            subtitle="Choose what you hear about"
            title="Notifications"
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 32 }}
            showsVerticalScrollIndicator={false}>
            <Section title="Order updates" description="Keep up with your deliveries.">
              <ToggleRow
                description="Status changes and delivery reminders"
                icon="bag-check-outline"
                label="Order updates"
                onValueChange={setOrderUpdates}
                value={orderUpdates}
              />
              <ToggleRow
                description="Text messages for time-sensitive updates"
                icon="chatbubble-ellipses-outline"
                label="SMS alerts"
                onValueChange={setSmsAlerts}
                value={smsAlerts}
              />
            </Section>

            <Section title="Deals and news" description="Choose what lands in your inbox.">
              <ToggleRow
                description="Weekly offers and fresh deals"
                icon="pricetag-outline"
                label="Offers"
                onValueChange={setOffers}
                value={offers}
              />
              <ToggleRow
                description="Product news and seasonal recipes"
                icon="mail-outline"
                label="Newsletter"
                onValueChange={setNewsletter}
                value={newsletter}
              />
            </Section>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
