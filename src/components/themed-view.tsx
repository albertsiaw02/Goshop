import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
  className?: string;
};

const BACKGROUND_BY_TYPE: Record<ThemeColor, string> = {
  background: 'bg-background',
  backgroundElement: 'bg-element',
  backgroundSelected: 'bg-selected',
  text: 'bg-content',
  textSecondary: 'bg-muted',
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
