import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Dir } from '../game/types';

export interface CarColors {
  body: string;
  bodyDark: string;
  roof: string;
  window: string;
  stripe?: string;
}

interface Props {
  dir: Dir;
  len: number;
  cell: number;
  colors: CarColors;
  isHero?: boolean;
}

/**
 * Top-down vehicle rendered as SVG with a gradient body so it stays crisp
 * at any cell size. Drawn horizontally (front = right) and rotated for
 * vertical cars.
 */
export const CarView = ({ dir, len, cell, colors, isHero }: Props) => {
  const L = len * cell; // long axis
  const W = cell; // short axis
  const m = Math.max(3, Math.round(cell * 0.09));
  const bw = L - m * 2;
  const bh = W - m * 2;
  const r = bh * 0.3;
  const isTruck = len >= 3;
  const gid = `body${colors.body.replace(/[^a-zA-Z0-9]/g, '')}${isHero ? 'h' : ''}`;

  const body = (
    <View style={[styles.shadow, { width: L, height: W }]}>
      <Svg width={L} height={W} viewBox={`0 0 ${L} ${W}`}>
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.body} />
            <Stop offset="0.55" stopColor={colors.body} />
            <Stop offset="1" stopColor={colors.bodyDark} />
          </LinearGradient>
        </Defs>
        {/* body */}
        <Rect
          x={m}
          y={m}
          width={bw}
          height={bh}
          rx={r}
          fill={`url(#${gid})`}
          stroke={colors.bodyDark}
          strokeWidth={1}
        />
        {isTruck ? (
          <>
            {/* cargo box */}
            <Rect
              x={m + bw * 0.03}
              y={m + bh * 0.07}
              width={bw * 0.6}
              height={bh * 0.86}
              rx={r * 0.6}
              fill={colors.roof}
              stroke={colors.bodyDark}
              strokeWidth={1}
            />
            {/* cab windshield */}
            <Rect
              x={m + bw * 0.72}
              y={m + bh * 0.14}
              width={bw * 0.1}
              height={bh * 0.72}
              rx={2}
              fill={colors.window}
            />
          </>
        ) : (
          <>
            {/* rear window */}
            <Rect
              x={m + bw * 0.14}
              y={m + bh * 0.15}
              width={bw * 0.11}
              height={bh * 0.7}
              rx={2}
              fill={colors.window}
              opacity={0.9}
            />
            {/* roof */}
            <Rect
              x={m + bw * 0.28}
              y={m + bh * 0.1}
              width={bw * 0.34}
              height={bh * 0.8}
              rx={r * 0.7}
              fill={colors.roof}
            />
            {/* windshield */}
            <Rect
              x={m + bw * 0.65}
              y={m + bh * 0.13}
              width={bw * 0.13}
              height={bh * 0.74}
              rx={3}
              fill={colors.window}
            />
            {/* hood shine */}
            <Path
              d={`M${m + bw * 0.8} ${m + bh * 0.18} q ${bw * 0.08} ${bh * 0.32} 0 ${bh * 0.64}`}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.4}
              fill="none"
            />
          </>
        )}
        {colors.stripe ? (
          <Rect
            x={m + (isTruck ? bw * 0.2 : bw * 0.36)}
            y={m + bh * 0.38}
            width={isTruck ? bw * 0.26 : bw * 0.18}
            height={bh * 0.24}
            rx={2}
            fill={colors.stripe}
          />
        ) : null}
        {/* headlights */}
        <Rect x={m + bw * 0.9} y={m + bh * 0.15} width={Math.max(3, bw * 0.06)} height={Math.max(3, bh * 0.2)} rx={2} fill="#ffe9a3" />
        <Rect x={m + bw * 0.9} y={m + bh * 0.65} width={Math.max(3, bw * 0.06)} height={Math.max(3, bh * 0.2)} rx={2} fill="#ffe9a3" />
        {/* tail lights */}
        <Rect x={m + bw * 0.025} y={m + bh * 0.18} width={Math.max(2, bw * 0.035)} height={Math.max(3, bh * 0.2)} rx={1.5} fill="#ff8a80" />
        <Rect x={m + bw * 0.025} y={m + bh * 0.62} width={Math.max(2, bw * 0.035)} height={Math.max(3, bh * 0.2)} rx={1.5} fill="#ff8a80" />
        {isHero ? (
          <Rect
            x={m - 1}
            y={m - 1}
            width={bw + 2}
            height={bh + 2}
            rx={r}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1.5}
          />
        ) : null}
      </Svg>
    </View>
  );

  if (dir === 'H') {
    return <View style={{ width: L, height: W }}>{body}</View>;
  }
  // Vertical: rotate the horizontal drawing 90° (front points down).
  return (
    <View style={{ width: W, height: L }}>
      <View
        style={{
          position: 'absolute',
          left: (W - L) / 2,
          top: (L - W) / 2,
          width: L,
          height: W,
          transform: [{ rotate: '90deg' }],
        }}
      >
        {body}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
