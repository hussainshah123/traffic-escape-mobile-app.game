import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../ads/adUnits';

/**
 * Adaptive banner that fades in once Google actually returns a creative, and
 * collapses to nothing (no reserved space / no placeholder box) if the ad
 * fails to load — e.g. offline, or no fill.
 */
export const AdBanner = () => {
  const [loaded, setLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <View style={loaded ? styles.wrap : styles.hidden}>
      <Animated.View style={{ opacity }}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdLoaded={() => {
            setLoaded(true);
            Animated.timing(opacity, {
              toValue: 1,
              duration: 320,
              useNativeDriver: true,
            }).start();
          }}
          onAdFailedToLoad={() => setLoaded(false)}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  hidden: { height: 0, overflow: 'hidden' },
});
