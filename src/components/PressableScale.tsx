import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';
import { SoundManager } from '../audio/SoundManager';

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  silent?: boolean;
  children: React.ReactNode;
}

/** Button with a smooth native-driver press-scale animation and click sfx. */
export const PressableScale = ({ onPress, disabled, style, silent, children }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const to = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => to(0.94)}
      onPressOut={() => to(1)}
      onPress={() => {
        if (!silent) SoundManager.play('click');
        onPress?.();
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }, disabled && { opacity: 0.5 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
