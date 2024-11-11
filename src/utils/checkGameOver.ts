import { Boundaries, CoOrdinates } from "../types/types";

export const checkGameOver = (
  snakeHead: CoOrdinates,
  boundaries: Boundaries
) => {
  return (
    snakeHead.x <= boundaries.xMin ||
    snakeHead.x >= boundaries.xMax ||
    snakeHead.y >= boundaries.yMax ||
    snakeHead.y <= boundaries.yMin
  );
};
