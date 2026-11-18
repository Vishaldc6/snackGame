import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdBanner from "./AdBanner";

import {
  Direction,
  MOVE_INTERNAL,
  SCORE_INCREMENT,
  SNAKE_INIT_POS,
} from "../constants/GameConstants";
import { Boundaries, CoOrdinates } from "../types/types";
import Food from "./Food";
import Snake from "./Snake";
import { Colors } from "../constants/Colors";
import { checkGameOver } from "../utils/checkGameOver";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import { loadBestScore, saveBestScore } from "../utils/storage";

const checkeredGrassPattern = require("../../assets/images/checkered-grass.png");

const GRID_STEP = 10;
const SNAKE_SIZE = 20;

const Game = () => {
  const insets = useSafeAreaInsets();

  const [moveInternal, setMoveInternal] = useState(MOVE_INTERNAL);
  const [direction, setDirection] = useState(Direction.DOWN);
  const [snake, setSnake] = useState<CoOrdinates[]>(SNAKE_INIT_POS);
  const [food, setFood] = useState<CoOrdinates>({ x: 10, y: 10 });
  const foodRef = useRef(food);
  foodRef.current = food;

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);

  // Dynamic board boundaries based on actual device screen dimensions
  const [bounds, setBounds] = useState<Boundaries>({
    xMin: 0,
    xMax: 30,
    yMin: 0,
    yMax: 42,
  });

  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  // Load persistent best score on mount
  useEffect(() => {
    loadBestScore().then((savedScore) => {
      if (savedScore > 0) {
        setBestScore(savedScore);
      }
    });
  }, []);

  // Save best score to persistent storage only when Game Over occurs
  useEffect(() => {
    if (isGameOver && bestScore > 0) {
      saveBestScore(bestScore);
    }
  }, [isGameOver, bestScore]);

  // Main game loop
  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPause && moveSnake();
      }, moveInternal);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPause, moveInternal]);

  // Responsive board calculation on layout
  const handleBoardLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      const calculatedXMax = Math.max(
        5,
        Math.floor((width - SNAKE_SIZE) / GRID_STEP),
      );
      const calculatedYMax = Math.max(
        5,
        Math.floor((height - SNAKE_SIZE) / GRID_STEP),
      );

      const newBounds: Boundaries = {
        xMin: 0,
        xMax: calculatedXMax,
        yMin: 0,
        yMax: calculatedYMax,
      };

      setBounds(newBounds);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const { translationX, translationY } = event;

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
    })
    .runOnJS(true);

  const moveSnake = () => {
    const currentBounds = boundsRef.current;
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    // Apply direction to get the NEW head position first
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

    // Check boundary collision on the NEW position (fixes off-by-one)
    if (checkGameOver(newHead, currentBounds)) {
      setIsGameOver(true);
      return;
    }

    if (checkEatsFood({ head: newHead, food: foodRef.current, area: 1.8 })) {
      const updatedSnake = [newHead, ...snake];
      const newFood = randomFoodPosition(currentBounds, updatedSnake);
      foodRef.current = newFood;
      setFood(newFood);
      setSnake(updatedSnake);
      setScore((prev) => {
        const nextScore = prev + SCORE_INCREMENT;
        setBestScore((prevBest) => Math.max(prevBest, nextScore));
        return nextScore;
      });
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const reloadGame = () => {
    setIsGameOver(false);
    setIsPause(false);
    setSnake(SNAKE_INIT_POS);
    const newFood = randomFoodPosition(boundsRef.current, SNAKE_INIT_POS);
    foodRef.current = newFood;
    setFood(newFood);
    setScore(0);
    setDirection(Direction.RIGHT);
    setMoveInternal(MOVE_INTERNAL);
  };

  const handleMoveInterval = () => {
    setMoveInternal((prev) => (prev <= 25 ? MOVE_INTERNAL : prev / 2));
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}
      >
        {/* Top Header with Score and Best Score (Symmetrical 2-pill layout) */}
        <View style={styles.headerRow}>
          {/* Score Pill */}
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🍎</Text>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          </View>

          {/* Best Score Pill */}
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>BEST</Text>
              <Text style={styles.bestValue}>{bestScore}</Text>
            </View>
          </View>
        </View>

        {/* Main Checkered Game Board (measures own layout dynamically) */}
        <View style={styles.boardContainer} onLayout={handleBoardLayout}>
          <ImageBackground
            source={checkeredGrassPattern}
            resizeMode="repeat"
            style={StyleSheet.absoluteFill}
          />
          <Snake snake={snake} direction={direction} />
          <Food x={food.x} y={food.y} />
        </View>

        {/* Bottom Options Bar */}
        <View style={styles.optionsDeck}>
          {/* Reload / Restart Button */}
          <Pressable onPress={reloadGame} style={styles.circleActionButton}>
            <Ionicons name="reload" size={22} color="#FFFFFF" />
          </Pressable>

          {/* Big Yellow 3D Pause Button */}
          <Pressable
            onPress={() => setIsPause((prev) => !prev)}
            style={styles.pauseBtn3dShadow}
          >
            <View style={styles.pauseBtn3dFace}>
              <Ionicons
                name={isPause ? "play" : "pause"}
                size={30}
                color="#0E2417"
              />
            </View>
          </Pressable>

          {/* Speed Multiplier Button */}
          <Pressable
            onPress={handleMoveInterval}
            style={styles.circleActionButton}
          >
            <Text style={styles.speedButtonText}>{100 / moveInternal}x</Text>
          </Pressable>
        </View>

        {/* Ad Slot Section */}
        <View style={{ marginBottom: Math.max(insets.bottom, 10) }}>
          <AdBanner />
        </View>

        {/* Game Over Bottom Sheet Modal */}
        <Modal
          visible={isGameOver}
          animationType="slide"
          transparent={true}
          onRequestClose={reloadGame}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBottomSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.gameOverTitle}>💀 GAME OVER</Text>
              <View style={styles.gameOverScoreRow}>
                <View style={styles.gameOverScorePill}>
                  <Text style={styles.gameOverPillLabel}>🍎 SCORE</Text>
                  <Text style={styles.gameOverPillValue}>{score}</Text>
                </View>
                <View style={styles.gameOverScorePill}>
                  <Text style={styles.gameOverPillLabel}>🏆 BEST</Text>
                  <Text style={styles.gameOverPillValue}>{bestScore}</Text>
                </View>
              </View>
              {score > 0 && score >= bestScore && (
                <Text style={styles.newBestBadge}>🎉 NEW BEST!</Text>
              )}
              <Pressable style={styles.playAgainButton} onPress={reloadGame}>
                <Text style={styles.playAgainText}>🔄 PLAY AGAIN</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </GestureDetector>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  statTextContainer: {
    flexDirection: "column",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  scoreValue: {
    color: Colors.accentYellow,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  bestValue: {
    color: Colors.textWhite,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  boardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderColor: Colors.boardBorder,
    borderWidth: 4,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  optionsDeck: {
    backgroundColor: Colors.cardBg,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  circleActionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cardInner,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBtn3dShadow: {
    width: 64,
    height: 70,
    borderRadius: 32,
    backgroundColor: Colors.accentYellowShadow,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pauseBtn3dFace: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  speedButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  adSlotText: {
    color: Colors.adSlotText,
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(14, 36, 23, 0.5)",
  },
  modalBottomSheet: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 20,
  },
  gameOverTitle: {
    color: Colors.accentYellow,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  gameOverScoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  gameOverScorePill: {
    flex: 1,
    backgroundColor: Colors.cardInner,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  gameOverPillLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 4,
  },
  gameOverPillValue: {
    color: Colors.textWhite,
    fontSize: 24,
    fontWeight: "900",
  },
  newBestBadge: {
    color: Colors.accentYellow,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 16,
  },
  playAgainButton: {
    backgroundColor: Colors.accentYellow,
    borderBottomWidth: 4,
    borderBottomColor: Colors.accentYellowShadow,
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
  },
  playAgainText: {
    color: "#0E2417",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
