import { GestureHandlerRootView } from "react-native-gesture-handler";

import Game from "@/src/components/Game";

export default function Index() {
  return (
    <GestureHandlerRootView>
      <Game />
    </GestureHandlerRootView>
  );
}
