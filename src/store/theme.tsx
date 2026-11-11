import { Ionicons } from '@expo/vector-icons';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeScheme = 'light' | 'dark';

export type ThemeOption = {
  key: ThemePreference;
  label: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

export const THEME_OPTIONS: ThemeOption[] = [
  {
    key: 'system',
    label: 'System default',
    description: 'Match your device appearance',
    icon: 'phone-portrait-outline',
  },
  {
    key: 'light',
    label: 'Light',
    description: 'Bright and fresh',
    icon: 'sunny-outline',
  },
  {
    key: 'dark',
    label: 'Dark',
    description: 'Easy on the eyes',
    icon: 'moon-outline',
  },
];

type ThemeContextValue = {
  themes: ThemeOption[];
  preference: ThemePreference;
  scheme: ThemeScheme;
  setTheme: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(preference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference]);

  const scheme: ThemeScheme = colorScheme === 'dark' ? 'dark' : 'light';

  // On web, keep the `dark` class on <html> in sync with the resolved scheme
  // so the CSS variables and `dark:` variants apply, including for `system`.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', scheme === 'dark');
  }, [scheme]);

  const setTheme = useCallback((next: ThemePreference) => setPreference(next), []);

  const value = useMemo(
    () => ({ themes: THEME_OPTIONS, preference, scheme, setTheme }),
    [preference, scheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used within a ThemeProvider');
  }
  return context;
}
