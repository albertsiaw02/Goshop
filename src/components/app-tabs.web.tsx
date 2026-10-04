import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

const TABS = [
  { name: 'home', href: '/(tabs)', emoji: '🏠', label: 'Home' },
  { name: 'browse', href: '/browse', emoji: '🛍️', label: 'Browse' },
  { name: 'cart', href: '/cart', emoji: '🛒', label: 'Cart' },
  { name: 'orders', href: '/orders', emoji: '📦', label: 'Orders' },
  { name: 'profile', href: '/profile', emoji: '👤', label: 'Profile' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <TabButtonGroup />
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButtonGroup() {
  return (
    <View className="flex-row items-center justify-around rounded-3xl py-2">
      {TABS.map((tab) => (
        <TabTrigger name={tab.name} href={tab.href} key={tab.name} asChild>
          <TabButton emoji={tab.emoji} label={tab.label} />
        </TabTrigger>
      ))}
    </View>
  );
}

function TabButton({
  children,
  isFocused,
  emoji,
  label,
  ...props
}: TabTriggerSlotProps & { emoji: string; label: string }) {
  return (
    <Pressable {...props} className="items-center gap-0.5 px-4 py-1">
      <Text className="text-[22px]">{emoji}</Text>
      {isFocused ? (
        <Text className="text-sm font-bold text-brand-600">{label}</Text>
      ) : (
        <Text className="text-sm text-muted dark:text-muted-dark">{label}</Text>
      )}
    </Pressable>
  );
}