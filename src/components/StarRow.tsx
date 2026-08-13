import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SoundManager } from '../audio/SoundManager';
import { StarIcon } from './icons';

interface Props {
  count: number; // earned stars 0-3
  size?: number;
  animated?: boolean;
}

const Star = ({
  earned,
  size,
  delay,
  animated,
}: {
  earned: boolean;
  size: number;
  delay: number;
  animated: boolean;
}) => {
  const anim = useRef(new Animated.Value(animated && earned ? 0 : 1)).current;

  useEffect(() => {
    if (animated && earned) {
      const timer = setTimeout(() => {
        SoundManager.play('star');
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 16,
        }).start();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [animated, earned, delay, anim]);

  return (
    <Animated.View
      style={{
        marginHorizontal: 5,
        opacity: anim,
        transform: [
          { scale: anim },
          {
            rotate: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['-90deg', '0deg'],
            }),
          },
        ],
      }}
    >
      <StarIcon size={size} outline={!earned} />
    </Animated.View>
  );
};

export const StarRow = ({ count, size = 40, animated = false }: Props) => (
  <View style={styles.row}>
    {[0, 1, 2].map(i => (
      <Star
        key={i}
        earned={i < count}
        size={size}
        delay={350 + i * 380}
        animated={animated}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
