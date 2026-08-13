import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PressableScale } from './PressableScale';

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  colors: string[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Press-scale button with a linear-gradient background. */
export const GradientButton = ({
  onPress,
  disabled,
  colors,
  style,
  contentStyle,
  children,
}: Props) => (
  <PressableScale onPress={onPress} disabled={disabled} style={style}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.grad, contentStyle]}
    >
      {children}
    </LinearGradient>
  </PressableScale>
);

const styles = StyleSheet.create({
  grad: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
