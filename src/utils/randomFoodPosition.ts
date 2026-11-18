import { Boundaries, CoOrdinates } from "../types/types";

export const randomFoodPosition = (
  boundaries: Boundaries,
  snake?: CoOrdinates[]
): CoOrdinates => {
  const minX = boundaries.xMin + 1;
  const maxX = Math.max(minX, boundaries.xMax - 1);
  const minY = boundaries.yMin + 1;
  const maxY = Math.max(minY, boundaries.yMax - 1);

  const xSpan = maxX - minX + 1;
  const ySpan = maxY - minY + 1;

  let pos: CoOrdinates;
  let attempts = 0;
  const head = snake && snake.length > 0 ? snake[0] : null;

  do {
    pos = {
      x: minX + Math.floor(Math.random() * xSpan),
      y: minY + Math.floor(Math.random() * ySpan),
    };
    attempts++;
  } while (
    snake &&
    attempts < 80 &&
    (
      snake.some((s) => s.x === pos.x && s.y === pos.y) ||
      (head && Math.abs(head.x - pos.x) <= 2 && Math.abs(head.y - pos.y) <= 2)
    )
  );

  return pos;
};
