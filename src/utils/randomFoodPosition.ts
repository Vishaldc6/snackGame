import { Boundaries } from "../types/types";

export const randomFoodPosition = ({ xMax, yMax }: Boundaries) => {
  return {
    x: Math.floor(Math.random() * xMax),
    y: Math.floor(Math.random() * yMax),
  };
};
