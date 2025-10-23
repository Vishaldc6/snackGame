import React from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "../constants/Colors";
import { Direction } from "../constants/GameConstants";

interface SnackProps {
  snake: { x: number; y: number }[];
  direction: Direction;
}

const Snake = ({ snake, direction }: SnackProps) => {
  return (
    <>
      {snake.map((val, ind) => {
        const segmentStyle = {
          left: val.x * 10,
          top: val.y * 10,
          zIndex: 0,
        };
        return (
          <View
            style={[styles.snake, segmentStyle, ind == 0 && styles.head]}
            key={ind}
          >
            {ind === 0 && (
              <View
                style={[
                  styles.eysContainer,
                  direction == Direction.DOWN || direction == Direction.UP
                    ? { flexDirection: "row-reverse" }
                    : { flexDirection: "column" },
                ]}
              >
                {Array(2)
                  .fill(0)
                  .map(() => (
                    <View style={styles.eyes} />
                  ))}
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};

export default Snake;

const styles = StyleSheet.create({
  snake: {
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: Colors.secondary,
    position: "absolute",
    borderWidth: 1,
  },
  head: {
    backgroundColor: "red",
    borderWidth: 1.5,
    zIndex: 1
  },
  eysContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    padding: 2,
  },
  eyes: {
    backgroundColor: "black",
    height: 2.5,
    width: 2.5,
    borderRadius: 5,
  },
});
