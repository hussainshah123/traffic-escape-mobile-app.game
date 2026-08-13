import React from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { PressableScale } from '../components/PressableScale';
import { BackIcon, InfinityIcon, SoundIcon, TrashIcon } from '../components/icons';
import { useGame } from '../state/GameContext';
import { getTheme } from '../theme/themes';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Row = ({
  label,
  icon,
  value,
  theme,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: boolean;
  theme: ReturnType<typeof getTheme>;
  onChange: (v: boolean) => void;
}) => (
  <View style={[styles.row, { backgroundColor: theme.card }]}>
    <View style={styles.rowIcon}>{icon}</View>
    <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: theme.accent, false: theme.bgBottom }}
      thumbColor="#ffffff"
    />
  </View>
);

export const SettingsScreen = ({ navigation }: Props) => {
  const game = useGame();
  const theme = getTheme(game.selectedTheme);

  return (
    <ScreenShell>
      <View style={styles.header}>
        <PressableScale
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}
        >
          <BackIcon size={26} color={theme.text} />
        </PressableScale>
        <Text style={[styles.title, { color: theme.text }]}>SETTINGS</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        <Row
          label="Sound Effects"
          icon={<SoundIcon size={20} color={theme.accent} />}
          value={game.soundOn}
          theme={theme}
          onChange={game.setSoundOn}
        />
        <Row
          label="Unlimited Moves"
          icon={<InfinityIcon size={20} color={theme.accent} />}
          value={game.unlimitedMoves}
          theme={theme}
          onChange={game.setUnlimitedMoves}
        />

        <PressableScale
          onPress={() =>
            Alert.alert(
              'Reset Progress',
              'All stars, coins and unlocks will be lost. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: game.resetProgress },
              ],
            )
          }
          style={styles.resetBtn}
        >
          <TrashIcon size={18} />
          <Text style={styles.resetTxt}>RESET PROGRESS</Text>
        </PressableScale>

        <Text style={[styles.about, { color: theme.textDim }]}>
          Traffic Escape v1.0{'\n'}Slide the traffic, free the red car!
        </Text>
      </View>
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
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  body: { paddingHorizontal: 24, paddingTop: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
  },
  rowIcon: { width: 32, alignItems: 'flex-start' },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '700' },
  resetBtn: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e63946',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  resetTxt: { color: '#e63946', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  about: { textAlign: 'center', marginTop: 40, fontSize: 13, lineHeight: 20 },
});
