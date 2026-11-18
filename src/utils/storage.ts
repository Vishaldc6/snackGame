// src/utils/storage.ts
let cachedBestScore = 0;

/**
 * Loads the saved best score from persistent storage.
 * Supports localStorage (Hermes/Web) and in-memory cache.
 */
export const loadBestScore = async (): Promise<number> => {
  try {
    if (typeof localStorage !== "undefined" && localStorage.getItem) {
      const stored = localStorage.getItem("@snake_game_best_score");
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          cachedBestScore = parsed;
          return parsed;
        }
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
    if (typeof localStorage !== "undefined" && localStorage.setItem) {
      localStorage.setItem("@snake_game_best_score", newScore.toString());
    }
  } catch (error) {
    console.warn("Could not save best score to storage:", error);
  }
};

