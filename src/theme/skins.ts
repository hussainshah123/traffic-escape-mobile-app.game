export interface CarSkin {
  id: string;
  name: string;
  price: number;
  body: string;
  bodyDark: string;
  roof: string;
  window: string;
  stripe?: string;
}

/** Skins for the player's (red/hero) car. */
export const SKINS: CarSkin[] = [
  {
    id: 'classic',
    name: 'Classic',
    price: 0,
    body: '#e63946',
    bodyDark: '#b6222e',
    roof: '#c92a37',
    window: '#bfe3ff',
  },
  {
    id: 'suv',
    name: 'SUV',
    price: 200,
    body: '#2a9d8f',
    bodyDark: '#1e7268',
    roof: '#21867a',
    window: '#d2f4ef',
  },
  {
    id: 'taxi',
    name: 'Taxi',
    price: 300,
    body: '#ffb703',
    bodyDark: '#d29500',
    roof: '#eaa800',
    window: '#fff3cf',
    stripe: '#1d1d1d',
  },
  {
    id: 'police',
    name: 'Police',
    price: 500,
    body: '#1d3557',
    bodyDark: '#122340',
    roof: '#16294a',
    window: '#cfe3ff',
    stripe: '#ffffff',
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    price: 500,
    body: '#f1f5f9',
    bodyDark: '#c9d4de',
    roof: '#e2e8f0',
    window: '#bcd9f5',
    stripe: '#e63946',
  },
  {
    id: 'sports',
    name: 'Sports Car',
    price: 1000,
    body: '#ff4d00',
    bodyDark: '#c93c00',
    roof: '#e04400',
    window: '#ffe0b8',
    stripe: '#ffffff',
  },
];

export const getSkin = (id: string): CarSkin =>
  SKINS.find(s => s.id === id) ?? SKINS[0];

/** Palette used for the non-player traffic vehicles. */
export const TRAFFIC_COLORS: { body: string; bodyDark: string; roof: string; window: string }[] = [
  { body: '#577590', bodyDark: '#40586e', roof: '#4a6480', window: '#cfe3f5' },
  { body: '#8d99ae', bodyDark: '#6d7a90', roof: '#7d8aa0', window: '#e8eef7' },
  { body: '#b5838d', bodyDark: '#92616b', roof: '#a5737d', window: '#f5e3e7' },
  { body: '#6d9f71', bodyDark: '#527c56', roof: '#5f9163', window: '#dff0e0' },
  { body: '#c9a227', bodyDark: '#a2811a', roof: '#b8931f', window: '#f7edc4' },
  { body: '#7d6b91', bodyDark: '#615276', roof: '#6f5d83', window: '#e9e2f2' },
  { body: '#4d908e', bodyDark: '#387371', roof: '#428280', window: '#d7efee' },
  { body: '#bc6c25', bodyDark: '#96541a', roof: '#aa5f1f', window: '#f5e2cc' },
];
