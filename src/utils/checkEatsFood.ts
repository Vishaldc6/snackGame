import { CoOrdinates } from "../types/types";

export const checkEatsFood = ({
  head,
  food,
  area,
}: {
  head: CoOrdinates;
  food: CoOrdinates;
  area: number;
}) => {
  const distBetweenFoodAndSnakeX = Math.abs(head.x - food.x);
  const distBetweenFoodAndSnakeY = Math.abs(head.y - food.y);

  return distBetweenFoodAndSnakeX < area && distBetweenFoodAndSnakeY < area;
};
