import { useEffect } from "react";
import mobileAds from 'react-native-google-mobile-ads';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Game from "@/src/components/Game";

export default function Index() {

  useEffect(() => {
    mobileAds().initialize().then(adapterStatuses => {
      console.log({ adapterStatuses });
    });
  }, []);

  return (
    <GestureHandlerRootView>
      <Game />
    </GestureHandlerRootView>
  );
}
