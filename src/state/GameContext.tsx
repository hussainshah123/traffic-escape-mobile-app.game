import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundManager } from '../audio/SoundManager';

export interface LevelResult {
  stars: number;
  bestMoves: number;
}

export interface GameState {
  progress: Record<number, LevelResult>;
  coins: number;
  ownedSkins: string[];
  selectedSkin: string;
  ownedThemes: string[];
  selectedTheme: string;
  soundOn: boolean;
  unlimitedMoves: boolean;
}

const DEFAULT_STATE: GameState = {
  progress: {},
  coins: 0,
  ownedSkins: ['classic'],
  selectedSkin: 'classic',
  ownedThemes: ['city'],
  selectedTheme: 'city',
  soundOn: true,
  unlimitedMoves: false,
};

const STORAGE_KEY = '@trafficescape/state.v1';

interface GameContextValue extends GameState {
  ready: boolean;
  completeLevel: (levelId: number, stars: number, moves: number, coins: number) => void;
  buySkin: (id: string, price: number) => boolean;
  selectSkin: (id: string) => void;
  buyTheme: (id: string, price: number) => boolean;
  selectTheme: (id: string) => void;
  setSoundOn: (on: boolean) => void;
  setUnlimitedMoves: (on: boolean) => void;
  resetProgress: () => void;
  unlockedLevel: number;
}

const GameContext = createContext<GameContextValue>({
  ...DEFAULT_STATE,
  ready: false,
  completeLevel: () => {},
  buySkin: () => false,
  selectSkin: () => {},
  buyTheme: () => false,
  selectTheme: () => {},
  setSoundOn: () => {},
  setUnlimitedMoves: () => {},
  resetProgress: () => {},
  unlockedLevel: 1,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    SoundManager.init();
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) {
          const saved = JSON.parse(raw);
          setState({ ...DEFAULT_STATE, ...saved });
        }
      })
      .catch(() => {})
      .finally(() => {
        hydrated.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    SoundManager.setEnabled(state.soundOn);
    if (hydrated.current) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state]);

  const completeLevel = useCallback(
    (levelId: number, stars: number, moves: number, coins: number) => {
      setState(prev => {
        const old = prev.progress[levelId];
        const merged: LevelResult = {
          stars: Math.max(old?.stars ?? 0, stars),
          bestMoves: old ? Math.min(old.bestMoves, moves) : moves,
        };
        return {
          ...prev,
          coins: prev.coins + coins,
          progress: { ...prev.progress, [levelId]: merged },
        };
      });
    },
    [],
  );

  const buySkin = useCallback((id: string, price: number) => {
    let ok = false;
    setState(prev => {
      if (prev.ownedSkins.includes(id) || prev.coins < price) return prev;
      ok = true;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedSkins: [...prev.ownedSkins, id],
        selectedSkin: id,
      };
    });
    return ok;
  }, []);

  const buyTheme = useCallback((id: string, price: number) => {
    let ok = false;
    setState(prev => {
      if (prev.ownedThemes.includes(id) || prev.coins < price) return prev;
      ok = true;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedThemes: [...prev.ownedThemes, id],
        selectedTheme: id,
      };
    });
    return ok;
  }, []);

  const selectSkin = useCallback((id: string) => {
    setState(prev =>
      prev.ownedSkins.includes(id) ? { ...prev, selectedSkin: id } : prev,
    );
  }, []);

  const selectTheme = useCallback((id: string) => {
    setState(prev =>
      prev.ownedThemes.includes(id) ? { ...prev, selectedTheme: id } : prev,
    );
  }, []);

  const setSoundOn = useCallback(
    (on: boolean) => setState(prev => ({ ...prev, soundOn: on })),
    [],
  );
  const setUnlimitedMoves = useCallback(
    (on: boolean) => setState(prev => ({ ...prev, unlimitedMoves: on })),
    [],
  );
  const resetProgress = useCallback(() => setState(DEFAULT_STATE), []);

  const unlockedLevel = useMemo(() => {
    let max = 0;
    Object.keys(state.progress).forEach(k => {
      max = Math.max(max, Number(k));
    });
    return max + 1;
  }, [state.progress]);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      completeLevel,
      buySkin,
      selectSkin,
      buyTheme,
      selectTheme,
      setSoundOn,
      setUnlimitedMoves,
      resetProgress,
      unlockedLevel,
    }),
    [
      state,
      ready,
      completeLevel,
      buySkin,
      selectSkin,
      buyTheme,
      selectTheme,
      setSoundOn,
      setUnlimitedMoves,
      resetProgress,
      unlockedLevel,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
