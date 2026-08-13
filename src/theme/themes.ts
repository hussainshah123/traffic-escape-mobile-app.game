import { ThemeIconId } from '../components/icons';

export interface Theme {
  id: string;
  name: string;
  icon: ThemeIconId;
  price: number;
  /** App background gradient (top, bottom approximated with two views). */
  bgTop: string;
  bgBottom: string;
  /** Board (road) colors. */
  road: string;
  roadLine: string;
  curb: string;
  /** UI accents. */
  card: string;
  text: string;
  textDim: string;
  accent: string;
  /** Second stop for accent gradients. */
  accent2: string;
  /** Weather particles rendered over the board. */
  particles: 'none' | 'rain' | 'snow' | 'stars';
  particleColor: string;
}

export const THEMES: Theme[] = [
  {
    id: 'city',
    name: 'City',
    icon: 'city',
    price: 0,
    bgTop: '#20304c',
    bgBottom: '#131c30',
    road: '#39404d',
    roadLine: '#4b5563',
    curb: '#f0b429',
    card: '#273754',
    text: '#f4f7fb',
    textDim: '#9fb0c9',
    accent: '#ffcb47',
    accent2: '#ff9518',
    particles: 'none',
    particleColor: 'transparent',
  },
  {
    id: 'night',
    name: 'Night',
    icon: 'night',
    price: 400,
    bgTop: '#0d1026',
    bgBottom: '#05060f',
    road: '#23263a',
    roadLine: '#343a56',
    curb: '#7c6cff',
    card: '#181c36',
    text: '#eef0ff',
    textDim: '#8b90bd',
    accent: '#a18fff',
    accent2: '#6f54f0',
    particles: 'stars',
    particleColor: '#c9c2ff',
  },
  {
    id: 'rain',
    name: 'Rain',
    icon: 'rain',
    price: 600,
    bgTop: '#2b3a46',
    bgBottom: '#16202a',
    road: '#31414d',
    roadLine: '#41545f',
    curb: '#59c2d6',
    card: '#25343f',
    text: '#eff6f9',
    textDim: '#93aab6',
    accent: '#5fdcf2',
    accent2: '#26a8c4',
    particles: 'rain',
    particleColor: '#9fd8ea',
  },
  {
    id: 'snow',
    name: 'Snow',
    icon: 'snow',
    price: 800,
    bgTop: '#5a7fa8',
    bgBottom: '#33506f',
    road: '#8797ab',
    roadLine: '#9dabbd',
    curb: '#eef4fb',
    card: '#46628a',
    text: '#f7fafd',
    textDim: '#c3d2e4',
    accent: '#d4ecff',
    accent2: '#8fc4f2',
    particles: 'snow',
    particleColor: '#ffffff',
  },
  {
    id: 'desert',
    name: 'Desert',
    icon: 'desert',
    price: 1000,
    bgTop: '#d99a4e',
    bgBottom: '#8c5426',
    road: '#a97c48',
    roadLine: '#bd9159',
    curb: '#5c3a17',
    card: '#b17b3c',
    text: '#fff6e8',
    textDim: '#f0dcbd',
    accent: '#ffe6a1',
    accent2: '#f2b94d',
    particles: 'none',
    particleColor: 'transparent',
  },
];

export const getTheme = (id: string): Theme =>
  THEMES.find(t => t.id === id) ?? THEMES[0];
