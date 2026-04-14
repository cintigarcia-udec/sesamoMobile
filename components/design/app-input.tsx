import { TextInput, type TextInputProps, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export function AppInput(props: TextInputProps) {
  const background = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const placeholder = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <View
      style={{
        backgroundColor: background,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
      }}>
      <TextInput
        {...props}
        placeholderTextColor={`${placeholder}99`}
        style={[
          {
            color: onSurface,
            fontSize: 14,
            padding: 0,
          },
          props.style,
        ]}
        selectionColor={primary}
      />
    </View>
  );
}
