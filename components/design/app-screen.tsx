import { ReactNode } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export function AppScreen({
  children,
  scroll = true,
  contentContainerStyle,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  const backgroundColor = useThemeColor({}, 'surface');

  if (!scroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[{ paddingBottom: 40 }, contentContainerStyle]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
