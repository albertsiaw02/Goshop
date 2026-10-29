import { TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = {
  label: string;
  hint?: string;
} & Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'keyboardType'
  | 'maxLength'
  | 'onChangeText'
  | 'placeholder'
  | 'secureTextEntry'
  | 'textContentType'
  | 'value'
>;

export function FormField({ label, hint, ...inputProps }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View className="mb-3 gap-2">
      <ThemedText type="small" themeColor="textSecondary" className="font-semibold">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        className="rounded-xl border border-[#e2e8f0] bg-background px-4 py-3 text-base text-content"
        placeholderTextColor={theme.textSecondary}
        {...inputProps}
      />
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary" className="text-[11px]">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}
