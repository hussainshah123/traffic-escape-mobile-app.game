import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../state/GameContext';
import { getTheme } from '../theme/themes';
import { WeatherOverlay } from './WeatherOverlay';

/** Theme-aware screen background (linear gradient + weather particles). */
export const ScreenShell = ({ children }: { children: React.ReactNode }) => {
  const { selectedTheme } = useGame();
  const theme = getTheme(selectedTheme);
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[theme.bgTop, theme.bgBottom]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <WeatherOverlay theme={theme} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
});
