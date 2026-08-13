import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { PressableScale } from '../components/PressableScale';
import { GradientButton } from '../components/GradientButton';
import { AdBanner } from '../components/AdBanner';
import {
  CarSideIcon,
  CoinIcon,
  GearIcon,
  MapIcon,
  PlayIcon,
  SvgCar,
} from '../components/icons';
import { useGame } from '../state/GameContext';
import { getTheme, Theme } from '../theme/themes';
import { getSkin } from '../theme/skins';
import { LEVELS } from '../game/levels';

const { width: W } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MenuButton = ({
  label,
  icon,
  theme,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  theme: Theme;
  onPress: () => void;
}) => (
  <PressableScale
    onPress={onPress}
    style={[styles.btn, { backgroundColor: theme.card }]}
  >
    <View style={styles.btnIcon}>{icon}</View>
    <Text style={[styles.btnLabel, { color: theme.text }]}>{label}</Text>
  </PressableScale>
);

/** Hero car endlessly driving across a road strip under the title. */
const DrivingCar = ({ theme }: { theme: Theme }) => {
  const { selectedSkin } = useGame();
  const skin = getSkin(selectedSkin);
  const drive = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driveLoop = Animated.loop(
      Animated.timing(drive, {
        toValue: 1,
        duration: 5200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 260, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 260, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    driveLoop.start();
    bobLoop.start();
    return () => {
      driveLoop.stop();
      bobLoop.stop();
    };
  }, [drive, bob]);

  return (
    <View style={styles.roadStrip}>
      <View style={[styles.roadLine, { backgroundColor: theme.textDim }]} />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 4,
          transform: [
            {
              translateX: drive.interpolate({
                inputRange: [0, 1],
                outputRange: [-90, W + 20],
              }),
            },
            { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -1.5] }) },
          ],
        }}
      >
        <SvgCar width={72} body={skin.body} bodyDark={skin.bodyDark} window={skin.window} />
      </Animated.View>
    </View>
  );
};

export const HomeScreen = ({ navigation }: Props) => {
  const { coins, unlockedLevel, selectedTheme } = useGame();
  const theme = getTheme(selectedTheme);
  const playLevel = Math.min(unlockedLevel, LEVELS.length);
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  return (
    <ScreenShell>
      <View style={styles.root}>
        <View style={styles.coinRow}>
          <View style={[styles.coinBadge, { backgroundColor: theme.card }]}>
            <CoinIcon size={18} />
            <Text style={[styles.coinText, { color: theme.text }]}>{coins}</Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.titleWrap,
            {
              opacity: enter,
              transform: [
                { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
              ],
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>TRAFFIC</Text>
          <Text style={[styles.title, { color: theme.accent }]}>ESCAPE</Text>
          <DrivingCar theme={theme} />
        </Animated.View>

        <Animated.View
          style={[
            styles.menu,
            {
              opacity: enter,
              transform: [
                { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
              ],
            },
          ]}
        >
          <GradientButton
            colors={[theme.accent, theme.accent2]}
            style={styles.playShadow}
            contentStyle={styles.playBtn}
            onPress={() => navigation.navigate('Game', { levelId: playLevel })}
          >
            <PlayIcon size={26} color="#1c1508" />
            <Text style={styles.playLabel}>
              {playLevel > 1 ? `PLAY  ·  LEVEL ${playLevel}` : 'PLAY'}
            </Text>
          </GradientButton>
          <MenuButton
            label="LEVELS"
            icon={<MapIcon size={22} color={theme.accent} />}
            theme={theme}
            onPress={() => navigation.navigate('Levels')}
          />
          <MenuButton
            label="CAR SKINS"
            icon={<CarSideIcon size={22} color={theme.accent} />}
            theme={theme}
            onPress={() => navigation.navigate('Skins')}
          />
          <MenuButton
            label="SETTINGS"
            icon={<GearIcon size={22} color={theme.accent} />}
            theme={theme}
            onPress={() => navigation.navigate('Settings')}
          />
        </Animated.View>
      </View>
      <View style={styles.adWrap}>
        <AdBanner />
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 28 },
  coinRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 8 },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  coinText: { fontSize: 16, fontWeight: '800' },
  titleWrap: { alignItems: 'center', marginTop: 40 },
  title: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 5,
    lineHeight: 54,
  },
  roadStrip: {
    width: '100%',
    height: 52,
    marginTop: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  roadLine: {
    height: 2,
    borderRadius: 1,
    opacity: 0.4,
  },
  menu: { marginTop: 42, gap: 14 },
  playShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  playBtn: {
    paddingVertical: 17,
    paddingHorizontal: 22,
    gap: 12,
    justifyContent: 'flex-start',
  },
  playLabel: { fontSize: 20, fontWeight: '900', letterSpacing: 2, color: '#1c1508' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  btnIcon: { width: 36, alignItems: 'flex-start' },
  btnLabel: { fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  adWrap: { alignItems: 'center', paddingBottom: 4 },
});
