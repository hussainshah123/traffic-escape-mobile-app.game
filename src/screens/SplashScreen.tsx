import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { SvgCar } from '../components/icons';
import { useGame } from '../state/GameContext';
import { getTheme } from '../theme/themes';

const { width: W } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const CARS = [
  { body: '#e63946', bodyDark: '#b6222e', window: '#bfe3ff' },
  { body: '#ffb703', bodyDark: '#d29500', window: '#fff3cf' },
  { body: '#2a9d8f', bodyDark: '#1e7268', window: '#d2f4ef' },
];

export const SplashScreen = ({ navigation }: Props) => {
  const { ready, selectedTheme } = useGame();
  const theme = getTheme(selectedTheme);
  const title = useRef(new Animated.Value(0)).current;
  const carAnims = useRef(CARS.map(() => new Animated.Value(0))).current;
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      170,
      carAnims.map(a =>
        Animated.timing(a, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ),
    ).start();
    Animated.timing(title, {
      toValue: 1,
      duration: 650,
      delay: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dots, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dots, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, [carAnims, title, dots]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => navigation.replace('Home'), 2100);
    return () => clearTimeout(t);
  }, [ready, navigation]);

  return (
    <ScreenShell>
      <View style={styles.center}>
        <View style={styles.carsRow}>
          {CARS.map((c, i) => (
            <Animated.View
              key={c.body}
              style={{
                marginHorizontal: 4,
                opacity: carAnims[i],
                transform: [
                  {
                    translateX: carAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-W * 0.7, 0],
                    }),
                  },
                ],
              }}
            >
              <SvgCar width={84} body={c.body} bodyDark={c.bodyDark} window={c.window} />
            </Animated.View>
          ))}
        </View>
        <Animated.View
          style={{
            opacity: title,
            transform: [
              {
                translateY: title.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <Text style={[styles.title, { color: theme.text }]}>TRAFFIC</Text>
          <Text style={[styles.title, { color: theme.accent }]}>ESCAPE</Text>
        </Animated.View>
        <Animated.Text style={[styles.loading, { color: theme.textDim, opacity: dots }]}>
          Loading...
        </Animated.Text>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  carsRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 26 },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 6,
    textAlign: 'center',
    lineHeight: 60,
  },
  loading: { marginTop: 40, fontSize: 16, letterSpacing: 2 },
});
