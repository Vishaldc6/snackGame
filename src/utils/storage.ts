// src/utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const BEST_SCORE_KEY = "@snake_game_best_score";
let cachedBestScore = 0;

/**
 * Loads the saved best score from persistent storage.
 */
export const loadBestScore = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem(BEST_SCORE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        cachedBestScore = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Could not read best score from storage:", error);
  }
  return cachedBestScore;
};

/**
 * Saves a new best score to persistent storage.
 */
export const saveBestScore = async (newScore: number): Promise<void> => {
  if (newScore <= cachedBestScore) return;
  cachedBestScore = newScore;

  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, newScore.toString());
  } catch (error) {
    console.warn("Could not save best score to storage:", error);
  }
};
