import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const COLORS = ['#FFC93C', '#FF6B6B', '#4ECDC4', '#8F7BFF', '#6DD400', '#59C2D6'];

const Piece = ({ index }: { index: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const cfg = useMemo(() => {
    const rnd = (n: number) => (((index + 1) * 7919 * (n + 3)) % 1000) / 1000;
    return {
      startX: rnd(1) * 280 - 140,
      driftX: rnd(2) * 160 - 80,
      fall: 200 + rnd(3) * 140,
      size: 6 + rnd(4) * 6,
      spin: rnd(5) > 0.5 ? 1 : -1,
      delay: rnd(6) * 350,
      duration: 1300 + rnd(7) * 700,
      color: COLORS[index % COLORS.length],
      round: rnd(8) > 0.6,
    };
  }, [index]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(cfg.delay),
      Animated.timing(anim, {
        toValue: 1,
        duration: cfg.duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [anim, cfg]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: cfg.size,
        height: cfg.round ? cfg.size : cfg.size * 0.55,
        borderRadius: cfg.round ? cfg.size / 2 : 1.5,
        backgroundColor: cfg.color,
        opacity: anim.interpolate({
          inputRange: [0, 0.1, 0.75, 1],
          outputRange: [0, 1, 1, 0],
        }),
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [cfg.startX, cfg.startX + cfg.driftX] }) },
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, cfg.fall] }) },
          { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${cfg.spin * 420}deg`] }) },
        ],
      }}
    />
  );
};

/** One-shot confetti burst falling from the top of its parent. */
export const Confetti = ({ count = 18 }: { count?: number }) => (
  <View pointerEvents="none" style={styles.fill}>
    {Array.from({ length: count }, (_, i) => (
      <Piece key={i} index={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 24,
  },
});
