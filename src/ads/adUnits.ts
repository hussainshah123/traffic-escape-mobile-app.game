import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Real AdMob identifiers for this app. In development builds we serve
 * Google's test ad units instead — using live ad unit IDs on a dev/simulator
 * build risks invalid-traffic flags on the AdMob account.
 */
export const ADMOB_APP_ID = 'ca-app-pub-9318693466829633~2730617418';

const HOME_BANNER_UNIT_ID = 'ca-app-pub-9318693466829633/3085840632';

export const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : HOME_BANNER_UNIT_ID;
