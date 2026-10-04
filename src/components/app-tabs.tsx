import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="browse">
        <Label>Browse</Label>
        <Icon sf={{ default: 'bag', selected: 'bag.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <Label>Cart</Label>
        <Icon sf={{ default: 'cart', selected: 'cart.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <Label>Orders</Label>
        <Icon sf={{ default: 'shippingbox', selected: 'shippingbox.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
