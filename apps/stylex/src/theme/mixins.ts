import { stylex, theme } from "@/theme/index.stylex";

export const mixins = stylex.create({
  surface: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    borderRadius: theme.sizes.radius.large,
    boxShadow: theme.shadows.card,
  },
  focusRing: {
    outline: {
      default: null,
      ":focus-visible": `2px solid ${theme.colors.focusRing}`,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": 2,
    },
  },
});
