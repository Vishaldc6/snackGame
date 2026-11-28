import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants, { ExecutionEnvironment } from "expo-constants";

import Game from "@/src/components/Game";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function Index() {
  useEffect(() => {
    if (!isExpoGo) {
      try {
        const {
          default: mobileAds,
          MaxAdContentRating,
        } = require("react-native-google-mobile-ads");
        mobileAds()
          .setRequestConfiguration({
            maxAdContentRating: MaxAdContentRating.G,
            tagForChildDirectedTreatment: true,
            tagForUnderAgeOfConsent: true,
          })
          .then(() => mobileAds().initialize())
          .then((adapterStatuses: any) => {
            console.log({ adapterStatuses });
          })
          .catch((error: any) => {
            console.warn("mobileAds initialize error:", error);
          });
      } catch (error) {
        console.warn("Could not load Google Mobile Ads:", error);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Game />
    </GestureHandlerRootView>
  );
}
