import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
}

const Wrap = ({
  size = 24,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {children}
  </Svg>
);

export const PlayIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path d="M8 5v14l11-7z" fill={color} />
  </Wrap>
);

export const MapIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"
      fill={color}
    />
  </Wrap>
);

export const CarSideIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
      fill={color}
    />
  </Wrap>
);

export const GearIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
      fill={color}
    />
  </Wrap>
);

const STAR_PATH =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

export const StarIcon = ({
  size,
  color = '#FFC93C',
  outline = false,
}: IconProps & { outline?: boolean }) => (
  <Wrap size={size}>
    {outline ? (
      <Path d={STAR_PATH} fill="none" stroke={color} strokeWidth={1.6} opacity={0.45} />
    ) : (
      <>
        <Defs>
          <LinearGradient id="starG" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFE382" />
            <Stop offset="1" stopColor="#FFB300" />
          </LinearGradient>
        </Defs>
        <Path d={STAR_PATH} fill="url(#starG)" stroke="#E09B00" strokeWidth={0.8} />
      </>
    )}
  </Wrap>
);

export const CoinIcon = ({ size = 24 }: IconProps) => (
  <Wrap size={size}>
    <Defs>
      <LinearGradient id="coinG" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFE182" />
        <Stop offset="1" stopColor="#F5A600" />
      </LinearGradient>
    </Defs>
    <Circle cx={12} cy={12} r={10} fill="url(#coinG)" stroke="#C97F00" strokeWidth={1.2} />
    <Circle cx={12} cy={12} r={6.8} fill="none" stroke="#C97F00" strokeWidth={1} opacity={0.55} />
    <G transform="scale(0.42) translate(16.5 16.5)">
      <Path d={STAR_PATH} fill="#C97F00" opacity={0.85} />
    </G>
  </Wrap>
);

export const LockIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
      fill={color}
    />
  </Wrap>
);

export const BulbIcon = ({ size, color = '#1c1508' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
      fill={color}
    />
  </Wrap>
);

export const ResetIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      fill={color}
    />
  </Wrap>
);

export const BackIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill={color} />
  </Wrap>
);

export const ChevronRightIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill={color} />
  </Wrap>
);

export const HomeIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
  </Wrap>
);

export const SkullIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M12 2C6.48 2 2 6.04 2 11c0 2.9 1.56 5.47 4 7.11V21c0 .55.45 1 1 1h2v-2h2v2h2v-2h2v2h2c.55 0 1-.45 1-1v-2.89c2.44-1.64 4-4.21 4-7.11 0-4.96-4.48-9-10-9zM8.5 13.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
      fill={color}
    />
  </Wrap>
);

export const TrophyIcon = ({ size, color = '#FFC93C' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M19 3h-2V2c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v2c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1h-3v-4.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zM5 7V5h2v4.82C5.84 9.4 5 8.3 5 7zm14 0c0 1.3-.84 2.4-2 2.82V5h2v2z"
      fill={color}
    />
  </Wrap>
);

export const SoundIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
      fill={color}
    />
  </Wrap>
);

export const InfinityIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"
      fill={color}
    />
  </Wrap>
);

export const TrashIcon = ({ size, color = '#e63946' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      fill={color}
    />
  </Wrap>
);

export const CheckIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color} />
  </Wrap>
);

/* ---- theme icons ---- */

export const CityIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"
      fill={color}
    />
  </Wrap>
);

export const MoonIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
      fill={color}
    />
  </Wrap>
);

export const RainIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M19.35 8.04C18.67 4.59 15.64 2 12 2 9.11 2 6.6 3.64 5.35 6.04 2.34 6.36 0 8.91 0 12c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
      fill={color}
    />
    <Path
      d="M7 20l-1.2 2.2M12 20l-1.2 2.2M17 20l-1.2 2.2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Wrap>
);

export const SnowIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"
      fill={color}
    />
  </Wrap>
);

export const SunIcon = ({ size, color = '#fff' }: IconProps) => (
  <Wrap size={size}>
    <Path
      d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
      fill={color}
    />
  </Wrap>
);

export type ThemeIconId = 'city' | 'night' | 'rain' | 'snow' | 'desert';

export const ThemeIcon = ({
  id,
  size,
  color,
}: IconProps & { id: ThemeIconId }) => {
  switch (id) {
    case 'night':
      return <MoonIcon size={size} color={color} />;
    case 'rain':
      return <RainIcon size={size} color={color} />;
    case 'snow':
      return <SnowIcon size={size} color={color} />;
    case 'desert':
      return <SunIcon size={size} color={color} />;
    default:
      return <CityIcon size={size} color={color} />;
  }
};

/* ---- decorative side-view car (splash / home logo) ---- */

export const SvgCar = ({
  width = 96,
  body = '#e63946',
  bodyDark = '#b6222e',
  window = '#bfe3ff',
}: {
  width?: number;
  body?: string;
  bodyDark?: string;
  window?: string;
}) => {
  const gid = `carG${body.replace('#', '')}`;
  return (
    <Svg width={width} height={width / 2} viewBox="0 0 64 32">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={body} />
          <Stop offset="1" stopColor={bodyDark} />
        </LinearGradient>
      </Defs>
      <Path
        d="M7 21c0-1.2.7-2.2 1.8-2.6L14 16.6l4.4-6.2C19.3 9 20.6 8.2 22 8.2h9.4c1.5 0 3 .7 4 1.9l4.6 5.5 8.6 1.7c1.9.4 3.4 2 3.4 4v2.2c0 1.4-1.1 2.5-2.5 2.5h-40C8.1 26 7 24.9 7 23.5V21z"
        fill={`url(#${gid})`}
      />
      <Path d="M21.5 10.5h4.5v5.5h-8.2z" fill={window} opacity={0.95} />
      <Path d="M28 10.5h4.6c.8 0 1.6.4 2.1 1l3 4.5H28z" fill={window} opacity={0.95} />
      <Circle cx={18} cy={25} r={4.4} fill="#22252b" />
      <Circle cx={18} cy={25} r={2} fill="#9aa3ad" />
      <Circle cx={46} cy={25} r={4.4} fill="#22252b" />
      <Circle cx={46} cy={25} r={2} fill="#9aa3ad" />
      <Rect x={50.5} y={17.5} width={2.6} height={2} rx={0.8} fill="#ffe9a3" />
    </Svg>
  );
};
