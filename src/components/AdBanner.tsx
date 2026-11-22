import React from "react";
import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

// Uses official Google test banner in development to avoid invalid clicks,
// and your production banner ad unit in release builds.
const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-1094381619101505/5309131915";

export default function AdBanner() {
  return (
    <View style={{ alignItems: "center" }}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error: any) => {
          console.warn("Banner ad failed to load:", error);
        }}
      />
    </View>
  );
}
