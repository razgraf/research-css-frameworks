import { createContainer } from "@vanilla-extract/css";

export const media = {
  lg: "(width >= 1024px)",
  md: "(width >= 768px)",
  sm: "(width >= 640px)",
};

export const cardContainer = createContainer();

// Measured on the card's content box.
export const container = {
  cardWide: `${cardContainer} (width >= 400px)`,
};
