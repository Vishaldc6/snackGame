import { Boundaries, CoOrdinates } from "../types/types";

export const SNAKE_INIT_POS: CoOrdinates[] = [{ x: 5, y: 5 }];
export const FOOD_INIT_POS: CoOrdinates = { x: 15, y: 15 };
export const GAME_BOUNDS: Boundaries = {
  xMin: 0,
  xMax: 36,
  yMin: 0,
  yMax: 68,
};
export const MOVE_INTERNAL: number = 100;
export const SCORE_INCREMENT: number = 5;

export enum Direction {
  RIGHT,
  LEFT,
  UP,
  DOWN,
}
