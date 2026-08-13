import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { PressableScale } from '../components/PressableScale';
import { BackIcon, LockIcon, StarIcon } from '../components/icons';
import { useGame } from '../state/GameContext';
import { getTheme } from '../theme/themes';
import { LEVELS } from '../game/levels';

type Props = NativeStackScreenProps<RootStackParamList, 'Levels'>;

const COLS = 3;
const { width: W } = Dimensions.get('window');
const TILE = Math.floor((Math.min(W, 430) - 24 * 2 - 12 * (COLS - 1)) / COLS);

export const LevelSelectScreen = ({ navigation }: Props) => {
  const { progress, unlockedLevel, selectedTheme } = useGame();
  const theme = getTheme(selectedTheme);

  return (
    <ScreenShell>
      <View style={styles.header}>
        <PressableScale
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}
        >
          <BackIcon size={26} color={theme.text} />
        </PressableScale>
        <Text style={[styles.title, { color: theme.text }]}>LEVELS</Text>
        <View style={styles.backBtn} />
      </View>
      <FlatList
        data={LEVELS}
        numColumns={COLS}
        keyExtractor={l => String(l.id)}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const locked = item.id > unlockedLevel;
          const stars = progress[item.id]?.stars ?? 0;
          return (
            <PressableScale
              disabled={locked}
              onPress={() => navigation.navigate('Game', { levelId: item.id })}
              style={[
                styles.tile,
                {
                  width: TILE,
                  height: TILE,
                  backgroundColor: locked ? theme.bgBottom : theme.card,
                  borderColor: stars === 3 ? theme.accent : 'transparent',
                },
              ]}
            >
              {locked ? (
                <LockIcon size={26} color={theme.textDim} />
              ) : (
                <>
                  <Text style={[styles.num, { color: theme.text }]}>
                    {String(item.id).padStart(2, '0')}
                  </Text>
                  <View style={styles.tileStars}>
                    {[0, 1, 2].map(i => (
                      <StarIcon key={i} size={14} outline={i >= stars} />
                    ))}
                  </View>
                </>
              )}
            </PressableScale>
          );
        }}
      />
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
  list: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 },
  row: { gap: 12, marginBottom: 12 },
  tile: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  num: { fontSize: 26, fontWeight: '900' },
  tileStars: { flexDirection: 'row', marginTop: 6, gap: 1 },
});
