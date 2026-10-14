import * as stylex from "@stylexjs/stylex";
import { colors, radius, shadows } from "./tokens.stylex";

export const mixins = stylex.create({
  surface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: radius.large,
    boxShadow: shadows.card,
  },
  focusRing: {
    outline: {
      default: null,
      ":focus-visible": `2px solid ${colors.focusRing}`,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": 2,
    },
  },
});
