import { Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  className?: string;
};

const TEXT_BY_TYPE: Record<NonNullable<ThemedTextProps['type']>, string> = {
  small: 'text-sm leading-[20px] font-medium',
  smallBold: 'text-sm leading-[20px] font-bold',
  default: 'text-base leading-6 font-medium',
  title: 'text-[48px] leading-[52px] font-semibold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  link: 'text-sm leading-[30px]',
  linkPrimary: 'text-sm leading-[30px] text-link',
  code: 'text-xs font-mono font-medium',
};

const TEXT_COLOR_BY_THEME: Record<ThemeColor, string> = {
  text: 'text-content dark:text-content-dark',
  textSecondary: 'text-muted dark:text-muted-dark',
  background: 'text-background dark:text-background-dark',
  backgroundElement: 'text-element dark:text-element-dark',
  backgroundSelected: 'text-selected dark:text-selected-dark',
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = themeColor ? TEXT_COLOR_BY_THEME[themeColor] : 'text-content dark:text-content-dark';

  return (
    <Text className={`${TEXT_BY_TYPE[type]} ${color} ${className}`.trim()} style={style} {...rest} />
  );
}