/**
 * The app supports light and dark themes, chosen from the settings screen
 * (system default, light, or dark).
 * See https://docs.expo.dev/guides/color-schemes/ for details on color schemes.
 */

import { useColorScheme } from 'nativewind';

import { Colors } from '@/constants/theme';

export function useTheme() {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? Colors.dark : Colors.light;
}
