import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { Theme } from '../theme/themes';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface DropProps {
  theme: Theme;
  index: number;
}

const Particle = ({ theme, index }: DropProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  const cfg = useMemo(() => {
    const seed = (index * 9301 + 49297) % 233280;
    const rnd = (n: number) => ((seed * (n + 1) * 8121 + 28411) % 134456) / 134456;
    return {
      x: rnd(1) * SCREEN_W,
      delay: rnd(2) * 2600,
      duration:
        theme.particles === 'rain' ? 750 + rnd(3) * 500 : 5200 + rnd(3) * 3200,
      size: theme.particles === 'rain' ? 2 : 3 + rnd(4) * 4,
      drift: (rnd(5) - 0.5) * 70,
    };
  }, [index, theme.particles]);

  useEffect(() => {
    if (theme.particles === 'stars') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(cfg.delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(cfg.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: cfg.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, cfg, theme.particles]);

  if (theme.particles === 'stars') {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: cfg.x,
          top: (cfg.delay / 2600) * SCREEN_H * 0.5,
          width: 2.5,
          height: 2.5,
          borderRadius: 1.25,
          backgroundColor: theme.particleColor,
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.9] }),
        }}
      />
    );
  }

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, SCREEN_H + 40],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cfg.drift],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: cfg.x,
        top: 0,
        width: cfg.size,
        height: theme.particles === 'rain' ? 16 : cfg.size,
        borderRadius: cfg.size,
        backgroundColor: theme.particleColor,
        opacity: theme.particles === 'rain' ? 0.4 : 0.8,
        transform: [{ translateY }, { translateX }],
      }}
    />
  );
};

/** Lightweight animated weather layer (rain / snow / stars) for themes. */
export const WeatherOverlay = ({ theme }: { theme: Theme }) => {
  if (theme.particles === 'none') return null;
  const count = theme.particles === 'rain' ? 14 : theme.particles === 'snow' ? 12 : 18;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }, (_, i) => (
        <Particle key={`${theme.id}-${i}`} theme={theme} index={i} />
      ))}
    </View>
  );
};
