import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Order = {
  id: string;
  date: string;
  status: string;
  total: number;
};

const ORDERS: Order[] = [
  { id: 'ORD-1042', date: 'Aug 28, 2026', status: 'Delivered', total: 24.5 },
  { id: 'ORD-1031', date: 'Aug 20, 2026', status: 'Delivered', total: 12.1 },
  { id: 'ORD-1020', date: 'Aug 12, 2026', status: 'Delivered', total: 31.8 },
  { id: 'ORD-1015', date: 'Aug 04, 2026', status: 'In Transit', total: 18.4 },
];

export default function OrdersScreen() {
  return (
    <ThemedView className="flex-1">
      <View className="flex-1 w-full max-w-[800px] self-center p-6">
        <ThemedText type="subtitle" className="mb-4 pt-4">
          My Orders
        </ThemedText>

        <FlatList
          data={ORDERS}
          keyExtractor={(o) => o.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
              onPress={() =>
                router.push({ pathname: '/order-tracking/[id]', params: { id: item.id } })
              }>
              <ThemedView type="backgroundElement" className="flex-row items-center gap-6 rounded-2xl p-6">
                <Text className="text-[34px]">📦</Text>
                <View className="flex-1 gap-0.5">
                  <ThemedText type="smallBold">{item.id}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.date}
                  </ThemedText>
                  <ThemedText type="smallBold">${item.total.toFixed(2)}</ThemedText>
                </View>
                <Text
                  className={`text-sm font-bold ${
                    item.status === 'In Transit' ? 'text-brand-600' : 'text-success'
                  }`}>
                  {item.status}
                </Text>
              </ThemedView>
            </Pressable>
          )}
        />
      </View>
    </ThemedView>
  );
}