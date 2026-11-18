import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CoOrdinates } from "../types/types";

const Food = React.memo(({ x, y }: CoOrdinates) => {
  return (
    <View style={[styles.foodContainer, { top: y * 10 - 6, left: x * 10 - 6 }]}>
      <Text style={styles.foodEmoji}>🍎</Text>
    </View>
  );
});

export default Food;

const styles = StyleSheet.create({
  foodContainer: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  foodEmoji: {
    fontSize: 22,
    lineHeight: 28,
    includeFontPadding: false,
    textAlign: "center",
  },
});
