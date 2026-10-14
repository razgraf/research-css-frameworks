import * as stylex from "@stylexjs/stylex";

export const media = stylex.defineConsts({
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
});

export const container = stylex.defineConsts({
  cardWide: "@container (min-width: 400px)",
});
