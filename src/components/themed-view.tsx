import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
  className?: string;
};

const BACKGROUND_BY_TYPE: Record<ThemeColor, string> = {
  background: 'bg-background dark:bg-background-dark',
  backgroundElement: 'bg-element dark:bg-element-dark',
  backgroundSelected: 'bg-selected dark:bg-selected-dark',
  text: 'bg-content dark:bg-content-dark',
  textSecondary: 'bg-muted dark:bg-muted-dark',
};

export function ThemedView({ style, type, className = '', ...otherProps }: ThemedViewProps) {
  return (
    <View
      className={`${BACKGROUND_BY_TYPE[type ?? 'background']} ${className}`.trim()}
      style={style}
      {...otherProps}
    />
  );
}