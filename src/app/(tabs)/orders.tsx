import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

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
  const theme = useTheme();

  return (
    <ThemedView className="flex-1">
      <View className="w-full max-w-[800px] flex-1 self-center p-6">
        <ThemedText className="mb-5 pt-4 text-[26px] font-extrabold leading-8 tracking-tight text-content">
          My Orders
        </ThemedText>

        <FlatList
          data={ORDERS}
          keyExtractor={(o) => o.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => {
            const inTransit = item.status === 'In Transit';
            return (
              <Pressable
                style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
                onPress={() =>
                  router.push({ pathname: '/order-tracking/[id]', params: { id: item.id } })
                }>
                <View className="flex-row items-center gap-4 rounded-2xl border border-[#eef2f6] bg-white p-4">
                  <View
                    className="h-[52px] w-[52px] items-center justify-center rounded-2xl"
                    style={{ backgroundColor: theme.backgroundElement }}>
                    <Text className="text-[26px]">📦</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <ThemedText type="smallBold" className="text-[14px]">
                      {item.id}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.date}
                    </ThemedText>
                    <ThemedText type="smallBold" className="text-brand-600">
                      ${item.total.toFixed(2)}
                    </ThemedText>
                  </View>
                  <View className="items-end gap-2">
                    <View
                      className={`rounded-full px-2.5 py-1 ${
                        inTransit ? 'bg-brand-50' : 'bg-[#e8f9ee]'
                      }`}>
                      <Text
                        className={`text-[10px] font-bold ${
                          inTransit ? 'text-brand-600' : 'text-success'
                        }`}>
                        {item.status}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </ThemedView>
  );
}
