import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import { getPos, slideRange } from '../game/engine';
import { EXIT_ROW, GRID_SIZE, Hint, RED_ID, Vehicle } from '../game/types';
import { Theme } from '../theme/themes';
import { TRAFFIC_COLORS } from '../theme/skins';
import { CarColors, CarView } from './CarView';
import { ChevronRightIcon } from './icons';

const PAD = 12; // road padding inside the curb
const CURB = 4;

type HintDir = 'left' | 'right' | 'up' | 'down' | null;

interface BoardProps {
  vehicles: Vehicle[];
  cell: number;
  theme: Theme;
  heroColors: CarColors;
  disabled?: boolean;
  hint: Hint | null;
  exiting: boolean;
  onMove: (index: number, pos: number) => void;
  onBlocked: () => void;
  onExitDone: () => void;
}

interface ItemProps {
  v: Vehicle;
  index: number;
  cell: number;
  colors: CarColors;
  isHero: boolean;
  disabled: boolean;
  hintDir: HintDir;
  exiting: boolean;
  getRange: (index: number) => { min: number; max: number };
  onMoved: (index: number, pos: number) => void;
  onBlocked: () => void;
  onExitDone: () => void;
}

const HINT_ROTATION: Record<Exclude<HintDir, null>, string> = {
  right: '0deg',
  down: '90deg',
  left: '180deg',
  up: '270deg',
};

const VehicleItem = React.memo((props: ItemProps) => {
  const { v, cell } = props;
  const val = useRef(new Animated.Value(getPos(v) * cell)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState(false);

  // Latest props for the stable PanResponder closures.
  const ref = useRef(props);
  ref.current = props;
  const grabbed = useRef({ startPx: 0, startCell: 0, minPx: 0, maxPx: 0 });

  // Keep the animated value in sync with the logical position (reset, etc.).
  const targetPx = getPos(v) * cell;
  useEffect(() => {
    if (ref.current.exiting) return;
    Animated.spring(val, {
      toValue: targetPx,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  }, [targetPx, val]);

  // Hint pulse loop.
  useEffect(() => {
    if (props.hintDir) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 480,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 480,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(0);
  }, [props.hintDir, pulse]);

  // Red car exit drive-out animation.
  useEffect(() => {
    if (props.exiting && props.isHero) {
      Animated.timing(val, {
        toValue: (GRID_SIZE + 0.6) * cell,
        duration: 560,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => ref.current.onExitDone());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.exiting]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !ref.current.disabled,
      onMoveShouldSetPanResponder: () => !ref.current.disabled,
      onPanResponderGrant: () => {
        const p = ref.current;
        const range = p.getRange(p.index);
        const startCell = getPos(p.v);
        grabbed.current = {
          startPx: startCell * p.cell,
          startCell,
          minPx: range.min * p.cell,
          maxPx: range.max * p.cell,
        };
        setDragging(true);
        Animated.spring(lift, {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 4,
        }).start();
      },
      onPanResponderMove: (_e, g) => {
        const p = ref.current;
        const delta = p.v.dir === 'H' ? g.dx : g.dy;
        const { startPx, minPx, maxPx } = grabbed.current;
        const px = Math.min(maxPx, Math.max(minPx, startPx + delta));
        val.setValue(px);
      },
      onPanResponderRelease: (_e, g) => {
        const p = ref.current;
        const delta = p.v.dir === 'H' ? g.dx : g.dy;
        const { startPx, startCell, minPx, maxPx } = grabbed.current;
        const raw = startPx + delta;
        const px = Math.min(maxPx, Math.max(minPx, raw));
        const cellIdx = Math.round(px / p.cell);
        setDragging(false);
        Animated.parallel([
          Animated.spring(val, {
            toValue: cellIdx * p.cell,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6,
          }),
          Animated.spring(lift, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
          }),
        ]).start();
        if (cellIdx !== startCell) {
          p.onMoved(p.index, cellIdx);
        } else if (Math.abs(raw - px) > p.cell * 0.35) {
          p.onBlocked();
        }
      },
      onPanResponderTerminate: () => {
        const p = ref.current;
        setDragging(false);
        Animated.parallel([
          Animated.spring(val, {
            toValue: grabbed.current.startCell * p.cell,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6,
          }),
          Animated.spring(lift, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
          }),
        ]).start();
      },
    }),
  ).current;

  const isH = v.dir === 'H';
  const w = isH ? v.len * cell : cell;
  const h = isH ? cell : v.len * cell;
  const left = PAD + (isH ? 0 : v.col * cell);
  const top = PAD + (isH ? v.row * cell : 0);
  const scale = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <Animated.View
      {...pan.panHandlers}
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        height: h,
        zIndex: dragging || props.exiting ? 10 : 1,
        transform: [isH ? { translateX: val } : { translateY: val }, { scale }],
      }}
    >
      <CarView
        dir={v.dir}
        len={v.len}
        cell={cell}
        colors={props.colors}
        isHero={props.isHero}
      />
      {props.hintDir ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.hintWrap,
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
              transform: [
                {
                  scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.hintArrow,
              { transform: [{ rotate: HINT_ROTATION[props.hintDir] }] },
            ]}
          >
            <ChevronRightIcon size={26} color="#ffffff" />
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
});

export const Board = ({
  vehicles,
  cell,
  theme,
  heroColors,
  disabled = false,
  hint,
  exiting,
  onMove,
  onBlocked,
  onExitDone,
}: BoardProps) => {
  const size = GRID_SIZE * cell + PAD * 2;
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;

  const getRange = useCallback(
    (index: number) => slideRange(vehiclesRef.current, index),
    [],
  );

  const trafficColor = useMemo(() => {
    const map = new Map<string, CarColors>();
    let i = 0;
    vehicles.forEach(v => {
      if (v.id !== RED_ID && !map.has(v.id)) {
        map.set(v.id, TRAFFIC_COLORS[i % TRAFFIC_COLORS.length]);
        i++;
      }
    });
    return map;
  }, // colors only depend on the id set, which never changes within a level
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [vehicles.map(v => v.id).join()]);

  const hintDirFor = (v: Vehicle): HintDir => {
    if (!hint || hint.vehicleId !== v.id) return null;
    const pos = getPos(v);
    if (hint.to === pos) return null;
    if (v.dir === 'H') return hint.to > pos ? 'right' : 'left';
    return hint.to > pos ? 'down' : 'up';
  };

  const lines: React.ReactNode[] = [];
  for (let i = 1; i < GRID_SIZE; i++) {
    lines.push(
      <View
        key={`v${i}`}
        style={{
          position: 'absolute',
          left: PAD + i * cell,
          top: PAD,
          width: 1,
          height: GRID_SIZE * cell,
          backgroundColor: theme.roadLine,
          opacity: 0.55,
        }}
      />,
      <View
        key={`h${i}`}
        style={{
          position: 'absolute',
          top: PAD + i * cell,
          left: PAD,
          height: 1,
          width: GRID_SIZE * cell,
          backgroundColor: theme.roadLine,
          opacity: 0.55,
        }}
      />,
    );
  }

  return (
    <View
      style={[
        styles.board,
        { width: size, height: size, backgroundColor: theme.road },
      ]}
    >
      {lines}
      {vehicles.map((v, i) => (
        <VehicleItem
          key={v.id}
          v={v}
          index={i}
          cell={cell}
          colors={v.id === RED_ID ? heroColors : trafficColor.get(v.id)!}
          isHero={v.id === RED_ID}
          disabled={disabled || (exiting && v.id !== RED_ID)}
          hintDir={hintDirFor(v)}
          exiting={exiting && v.id === RED_ID}
          getRange={getRange}
          onMoved={onMove}
          onBlocked={onBlocked}
          onExitDone={onExitDone}
        />
      ))}
      {/* curb frame above the cars so the red car slides "under" it at the gap */}
      <View
        pointerEvents="none"
        style={[styles.curb, { borderColor: theme.curb, width: size, height: size }]}
      />
      {/* exit gap cut into the curb */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 0,
          top: PAD + EXIT_ROW * cell + cell * 0.08,
          width: CURB,
          height: cell * 0.84,
          backgroundColor: theme.road,
          zIndex: 21,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  curb: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderWidth: CURB,
    borderRadius: 18,
    zIndex: 20,
  },
  hintWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintArrow: {
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
});
