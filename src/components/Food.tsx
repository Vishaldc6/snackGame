import React from "react";
import { StyleSheet, Text } from "react-native";

import { CoOrdinates } from "../types/types";

const Food = ({ x, y }: CoOrdinates) => {
  return (
    <Text style={[styles.food, { top: y * 10, left: x * 10 }]}>{"🍎"}</Text>
  );
};

export default Food;

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 22,
  },
});
