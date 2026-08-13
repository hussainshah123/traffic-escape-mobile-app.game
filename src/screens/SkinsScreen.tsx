import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { PressableScale } from '../components/PressableScale';
import { CarView } from '../components/CarView';
import { BackIcon, CheckIcon, CoinIcon, ThemeIcon } from '../components/icons';
import { useGame } from '../state/GameContext';
import { getTheme, THEMES } from '../theme/themes';
import { SKINS } from '../theme/skins';
import { SoundManager } from '../audio/SoundManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Skins'>;

export const SkinsScreen = ({ navigation }: Props) => {
  const game = useGame();
  const theme = getTheme(game.selectedTheme);

  const Badge = ({
    owned,
    selected,
    price,
  }: {
    owned: boolean;
    selected: boolean;
    price: number;
  }) => (
    <View style={styles.badgeRow}>
      {selected ? (
        <CheckIcon size={15} color={theme.accent} />
      ) : owned ? null : (
        <CoinIcon size={15} />
      )}
      <Text
        style={[
          styles.cardBadge,
          { color: selected ? theme.accent : theme.textDim },
        ]}
      >
        {selected ? 'SELECTED' : owned ? 'SELECT' : String(price)}
      </Text>
    </View>
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <PressableScale
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}
        >
          <BackIcon size={26} color={theme.text} />
        </PressableScale>
        <Text style={[styles.title, { color: theme.text }]}>GARAGE</Text>
        <View style={[styles.coinBadge, { backgroundColor: theme.card }]}>
          <CoinIcon size={16} />
          <Text style={[styles.coinTxt, { color: theme.text }]}>{game.coins}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.section, { color: theme.textDim }]}>CAR SKINS</Text>
        {SKINS.map(skin => {
          const owned = game.ownedSkins.includes(skin.id);
          const selected = game.selectedSkin === skin.id;
          return (
            <PressableScale
              key={skin.id}
              onPress={() => {
                if (owned) {
                  game.selectSkin(skin.id);
                } else if (game.buySkin(skin.id, skin.price)) {
                  SoundManager.play('coin');
                } else {
                  SoundManager.play('blocked');
                }
              }}
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: selected ? theme.accent : 'transparent' },
              ]}
            >
              <View style={styles.preview}>
                <CarView dir="H" len={2} cell={34} colors={skin} isHero />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardName, { color: theme.text }]}>
                  {skin.name}
                </Text>
                <Badge owned={owned} selected={selected} price={skin.price} />
              </View>
            </PressableScale>
          );
        })}

        <Text style={[styles.section, { color: theme.textDim, marginTop: 24 }]}>
          THEMES
        </Text>
        {THEMES.map(t => {
          const owned = game.ownedThemes.includes(t.id);
          const selected = game.selectedTheme === t.id;
          return (
            <PressableScale
              key={t.id}
              onPress={() => {
                if (owned) {
                  game.selectTheme(t.id);
                } else if (game.buyTheme(t.id, t.price)) {
                  SoundManager.play('coin');
                } else {
                  SoundManager.play('blocked');
                }
              }}
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: selected ? theme.accent : 'transparent' },
              ]}
            >
              <View style={[styles.themeSwatch, { backgroundColor: t.bgTop }]}>
                <ThemeIcon id={t.icon} size={24} color={t.accent} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardName, { color: theme.text }]}>
                  {t.name}
                </Text>
                <Badge owned={owned} selected={selected} price={t.price} />
              </View>
            </PressableScale>
          );
        })}
      </ScrollView>
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
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coinTxt: { fontSize: 14, fontWeight: '800' },
  scroll: { paddingHorizontal: 24, paddingBottom: 36 },
  section: { fontSize: 13, fontWeight: '900', letterSpacing: 2, marginVertical: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    padding: 14,
    marginBottom: 10,
  },
  preview: { width: 74, alignItems: 'center' },
  themeSwatch: {
    width: 74,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: 14 },
  cardName: { fontSize: 17, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  cardBadge: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
