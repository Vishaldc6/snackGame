import React from "react";
import { StyleSheet, View } from "react-native";

import { Direction } from "../constants/GameConstants";

const GRID_STEP = 10;
const BODY_SIZE = 18;
const HEAD_SIZE = 24;
const OFFSET = (BODY_SIZE - HEAD_SIZE) / 2; // -3px offset to center 24px head over 18px body

const SNAKE_COLOR = "#3F8FE8";
const SNAKE_OUTLINE = "#3B2414";

interface SnakeProps {
  snake: { x: number; y: number }[];
  direction: Direction;
}

const Snake = ({ snake, direction }: SnakeProps) => {
  return (
    <>
      {snake.map((val, ind) => {
        const isHead = ind === 0;
        const size = isHead ? HEAD_SIZE : BODY_SIZE;
        const segmentStyle = {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: isHead ? val.x * GRID_STEP + OFFSET : val.x * GRID_STEP,
          top: isHead ? val.y * GRID_STEP + OFFSET : val.y * GRID_STEP,
          zIndex: snake.length - ind, // head on top, tail underneath
        };

        return (
          <View
            key={ind}
            style={[styles.segment, segmentStyle, isHead && styles.head]}
          >
            {isHead && <Eyes direction={direction} />}
          </View>
        );
      })}
    </>
  );
};

const Eyes = ({ direction }: { direction: Direction }) => {
  const vertical = direction === Direction.UP || direction === Direction.DOWN;
  const front =
    direction === Direction.UP || direction === Direction.LEFT
      ? "flex-start"
      : "flex-end";

  return (
    <View
      style={[
        styles.eyesContainer,
        { flexDirection: vertical ? "row" : "column", alignItems: front },
      ]}
    >
      <Eye />
      <Eye />
    </View>
  );
};

const Eye = () => (
  <View style={styles.eye}>
    <View style={styles.pupil} />
  </View>
);

export default Snake;

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
    backgroundColor: SNAKE_COLOR,
    borderWidth: 2,
    borderColor: SNAKE_OUTLINE,
  },
  head: {
    backgroundColor: SNAKE_COLOR,
    borderWidth: 2,
    borderColor: SNAKE_OUTLINE,
  },
  eyesContainer: {
    flex: 1,
    justifyContent: "space-around",
    padding: 1,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: SNAKE_OUTLINE,
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: SNAKE_OUTLINE,
  },
});
