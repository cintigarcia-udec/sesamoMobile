import { ReactNode } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import { AppText } from '@/components/design/app-text';

export function TopAppBar({
  title,
  left,
  right,
  style,
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const background = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'outlineVariant');
  const insets = useSafeAreaInsets();

  const Container = Platform.OS === 'web' ? View : BlurView;
  const containerProps =
    Platform.OS === 'web'
      ? {}
      : {
          intensity: 25,
          tint: 'light' as const,
        };

  return (
    <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }, style]}>
      <Container
        {...containerProps}
        style={{
          backgroundColor: Platform.OS === 'web' ? `${background}cc` : undefined,
          paddingHorizontal: 20,
          paddingTop: 12 + insets.top,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: `${border}26`,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          {left}
          {title ? (
            <AppText variant="title" colorName="primary" numberOfLines={1} style={{ flexShrink: 1 }}>
              {title}
            </AppText>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>{right}</View>
      </Container>
    </View>
  );
}
