import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { PressableScale } from '../components/PressableScale';
import { GradientButton } from '../components/GradientButton';
import { Board } from '../components/Board';
import { StarRow } from '../components/StarRow';
import { Confetti } from '../components/Confetti';
import {
  BackIcon,
  BulbIcon,
  ChevronRightIcon,
  CoinIcon,
  ResetIcon,
  SkullIcon,
  StarIcon,
  TrophyIcon,
} from '../components/icons';
import { isWin, moveVehicle } from '../game/engine';
import { solve } from '../game/solver';
import { coinsFor, getLevel, LEVELS, moveLimit, starsFor } from '../game/levels';
import { EXIT_ROW, Hint, Vehicle } from '../game/types';
import { useGame } from '../state/GameContext';
import { getTheme } from '../theme/themes';
import { getSkin } from '../theme/skins';
import { SoundManager } from '../audio/SoundManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;
type Status = 'playing' | 'exiting' | 'won' | 'failed';

const { width: W } = Dimensions.get('window');
const BOARD_PAD = 12;
const CELL = Math.floor((Math.min(W, 430) - 40 - BOARD_PAD * 2) / 6);
const BOARD_SIZE = CELL * 6 + BOARD_PAD * 2;

const Overlay = ({ visible, children }: { visible: boolean; children: React.ReactNode }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      anim.setValue(0);
    }
  }, [visible, anim]);
  if (!visible) return null;
  return (
    <Animated.View style={[styles.overlay, { opacity: anim }]}>
      <Animated.View
        style={{
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) },
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export const GameScreen = ({ navigation, route }: Props) => {
  const levelId = route.params.levelId;
  const level = getLevel(levelId);
  const { selectedTheme, selectedSkin, unlimitedMoves, completeLevel } = useGame();
  const theme = getTheme(selectedTheme);
  const skin = getSkin(selectedSkin);

  const initialVehicles = useMemo(
    () => level.vehicles.map(v => ({ ...v })),
    [level],
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<Hint | null>(null);
  const [status, setStatus] = useState<Status>('playing');
  const awarded = useRef(false);
  const failTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (failTimer.current) clearTimeout(failTimer.current);
    },
    [],
  );

  const limit = moveLimit(level);
  const stars = starsFor(level, moves, hintsUsed);
  const coins = coinsFor(stars);

  const handleMove = useCallback(
    (index: number, pos: number) => {
      SoundManager.play('move');
      setHint(null);
      const next = moveVehicle(vehicles, index, pos);
      const nextMoves = moves + 1;
      setVehicles(next);
      setMoves(nextMoves);
      if (isWin(next)) {
        SoundManager.play('win');
        setStatus('exiting');
      } else if (!unlimitedMoves && nextMoves >= limit) {
        failTimer.current = setTimeout(() => {
          SoundManager.play('lose');
          setStatus('failed');
        }, 450);
      }
    },
    [vehicles, moves, limit, unlimitedMoves],
  );

  const handleExitDone = useCallback(() => {
    if (!awarded.current) {
      awarded.current = true;
      const s = starsFor(level, moves, hintsUsed);
      completeLevel(level.id, s, moves, coinsFor(s));
      setTimeout(() => SoundManager.play('coin'), 1500);
    }
    setStatus('won');
  }, [level, moves, hintsUsed, completeLevel]);

  const handleBlocked = useCallback(() => SoundManager.play('blocked'), []);

  const useHint = useCallback(() => {
    const res = solve(vehicles);
    if (res?.hint) {
      setHintsUsed(h => h + 1);
      setHint(res.hint);
    }
  }, [vehicles]);

  const reset = useCallback(() => {
    if (failTimer.current) {
      clearTimeout(failTimer.current);
      failTimer.current = null;
    }
    setVehicles(initialVehicles.map(v => ({ ...v })));
    setMoves(0);
    setHintsUsed(0);
    setHint(null);
    setStatus('playing');
    awarded.current = false;
  }, [initialVehicles]);

  const goNext = () => {
    if (levelId < LEVELS.length) {
      navigation.replace('Game', { levelId: levelId + 1 });
    } else {
      navigation.navigate('Levels');
    }
  };

  return (
    <ScreenShell>
      <View style={styles.header}>
        <PressableScale
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { backgroundColor: theme.card }]}
        >
          <BackIcon size={26} color={theme.text} />
        </PressableScale>
        <Text style={[styles.levelTitle, { color: theme.text }]}>
          LEVEL {String(levelId).padStart(2, '0')}
        </Text>
        <PressableScale
          onPress={reset}
          style={[styles.iconBtn, { backgroundColor: theme.card }]}
        >
          <ResetIcon size={22} color={theme.text} />
        </PressableScale>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statPill, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.textDim }]}>MOVES</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {moves}
            {unlimitedMoves ? '' : ` / ${limit}`}
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: theme.card }]}>
          <View style={styles.statStars}>
            {[0, 1, 2].map(i => (
              <StarIcon key={i} size={11} />
            ))}
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>≤ {level.minMoves}</Text>
        </View>
        <GradientButton
          onPress={useHint}
          disabled={status !== 'playing'}
          colors={[theme.accent, theme.accent2]}
          contentStyle={styles.hintBtn}
        >
          <BulbIcon size={18} color="#1c1508" />
          <Text style={styles.hintTxt}>HINT</Text>
        </GradientButton>
      </View>

      <View style={styles.boardWrap}>
        <View style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
          <Board
            vehicles={vehicles}
            cell={CELL}
            theme={theme}
            heroColors={skin}
            disabled={status !== 'playing'}
            hint={hint}
            exiting={status === 'exiting'}
            onMove={handleMove}
            onBlocked={handleBlocked}
            onExitDone={handleExitDone}
          />
          <View
            pointerEvents="none"
            style={[styles.exitTag, { top: BOARD_PAD + EXIT_ROW * CELL + CELL / 2 - 30 }]}
          >
            {'EXIT'.split('').map((ch, i) => (
              <Text key={i} style={[styles.exitTxt, { color: theme.accent }]}>
                {ch}
              </Text>
            ))}
            <View style={styles.exitChevron}>
              <ChevronRightIcon size={14} color={theme.accent} />
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.tip, { color: theme.textDim }]}>
        Slide the cars — free the red one!
      </Text>

      <Overlay visible={status === 'won'}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Confetti />
          <TrophyIcon size={44} />
          <Text style={[styles.cardTitle, { color: theme.accent }]}>LEVEL COMPLETE</Text>
          <StarRow count={stars} animated size={44} />
          <View style={styles.resultRows}>
            <Text style={[styles.resultTxt, { color: theme.text }]}>
              Moves : {moves}
            </Text>
            <View style={styles.coinLine}>
              <Text style={[styles.resultTxt, { color: theme.text }]}>
                Coins : +{coins}
              </Text>
              <CoinIcon size={18} />
            </View>
          </View>
          <GradientButton
            onPress={goNext}
            colors={[theme.accent, theme.accent2]}
            style={styles.cardBtnWrap}
            contentStyle={styles.cardBtn}
          >
            <Text style={styles.cardBtnTxt}>
              {levelId < LEVELS.length ? 'NEXT LEVEL' : 'ALL LEVELS'}
            </Text>
          </GradientButton>
          <PressableScale onPress={() => navigation.navigate('Levels')} style={styles.cardLink}>
            <Text style={[styles.cardLinkTxt, { color: theme.textDim }]}>LEVELS</Text>
          </PressableScale>
        </View>
      </Overlay>

      <Overlay visible={status === 'failed'}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.failIcon}>
            <SkullIcon size={44} color={theme.textDim} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>OUT OF MOVES</Text>
          <GradientButton
            onPress={reset}
            colors={[theme.accent, theme.accent2]}
            style={styles.cardBtnWrap}
            contentStyle={styles.cardBtn}
          >
            <Text style={styles.cardBtnTxt}>RETRY</Text>
          </GradientButton>
          <PressableScale
            onPress={() => navigation.navigate('Home')}
            style={styles.cardLink}
          >
            <Text style={[styles.cardLinkTxt, { color: theme.textDim }]}>HOME</Text>
          </PressableScale>
        </View>
      </Overlay>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTxt: { fontSize: 22, color: '#fff' },
  backTxt: { fontSize: 30, fontWeight: '800', marginTop: -3 },
  levelTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  statPill: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 86,
  },
  statLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statStars: { flexDirection: 'row', gap: 1 },
  statValue: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  hintBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  hintTxt: { fontSize: 14, fontWeight: '900', color: '#1c1508', letterSpacing: 1 },
  boardWrap: { alignItems: 'center' },
  exitTag: {
    position: 'absolute',
    left: '100%',
    marginLeft: 4,
    width: 14,
    alignItems: 'center',
  },
  exitTxt: {
    fontSize: 10,
    lineHeight: 11.5,
    fontWeight: '900',
    textAlign: 'center',
  },
  exitChevron: { marginTop: 2 },
  tip: { textAlign: 'center', marginTop: 18, fontSize: 14 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,8,15,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  card: {
    width: Math.min(W - 56, 360),
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRows: { marginTop: 16, marginBottom: 20, alignItems: 'center', gap: 6 },
  resultTxt: { fontSize: 17, fontWeight: '700' },
  cardBtnWrap: { alignSelf: 'stretch' },
  cardBtn: {
    borderRadius: 16,
    paddingVertical: 15,
  },
  cardBtnTxt: { fontSize: 17, fontWeight: '900', color: '#1c1508', letterSpacing: 2 },
  cardLink: { marginTop: 14, padding: 6 },
  cardLinkTxt: { fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  failIcon: { marginBottom: 10 },
  coinLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
