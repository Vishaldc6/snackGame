import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import {
  Direction,
  FOOD_INIT_POS,
  GAME_BOUNDS,
  MOVE_INTERNAL,
  SCORE_INCREMENT,
  SNAKE_INIT_POS,
} from "../constants/GameConstants";
import Food from "./Food";
import Snake from "./Snake";
import { Colors } from "../constants/Colors";
import { checkGameOver } from "../utils/checkGameOver";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition } from "../utils/randomFoodPosition";

const Game = () => {
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [snake, setSnake] = useState(SNAKE_INIT_POS);
  const [food, setFood] = useState(FOOD_INIT_POS);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPause && moveSnake();
      }, MOVE_INTERNAL);
      return () => clearInterval(intervalId);
    } else {
      Alert.alert("Game over!", "Your snake is going out of boundries !!");
    }
  }, [snake, isGameOver, isPause]);

  const handleGesture = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    const { translationX, translationY } = event.nativeEvent;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.RIGHT);
      } else {
        setDirection(Direction.LEFT);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.DOWN);
      } else {
        setDirection(Direction.UP);
      }
    }
  };

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver(true);
      return;
    }

    switch (direction) {
      case Direction.DOWN:
        newHead.y += 1;
        break;
      case Direction.UP:
        newHead.y -= 1;
        break;
      case Direction.RIGHT:
        newHead.x += 1;
        break;
      case Direction.LEFT:
        newHead.x -= 1;
        break;
      default:
        break;
    }

    if (checkEatsFood({ head: newHead, food: food, area: 2 })) {
      setFood(randomFoodPosition(GAME_BOUNDS));
      setSnake([newHead, ...snake]);
      setScore((prev) => prev + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const reloadGame = () => {
    setIsGameOver(false);
    setIsPause(false);
    setSnake(SNAKE_INIT_POS);
    setFood(FOOD_INIT_POS);
    setScore(0);
    setDirection(Direction.RIGHT);
  };

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={styles.container}>
        <View style={styles.board}>
          <Snake snake={snake} direction={direction} />
          <Food x={food.x} y={food.y} />
        </View>
        <View style={styles.options}>
          <Ionicons
            name="reload-circle"
            size={35}
            color={Colors.primary}
            onPress={reloadGame}
          />
          <Ionicons
            name={isPause ? "play-circle" : "pause-circle"}
            size={35}
            color={Colors.primary}
            onPress={() => {
              setIsPause((prev) => !prev);
            }}
          />
          <Text style={styles.score}>
            {"🍎"}
            {score}
          </Text>
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  board: {
    flex: 1,
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
    borderWidth: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  options: {
    height: "8%",
    marginHorizontal: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  score: {
    color: Colors.primary,
    fontWeight: "500",
  },
});
