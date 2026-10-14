import { defineRecipe } from "@pandacss/dev";
import { focusRing } from "./mixins";

export const buttonRecipe = defineRecipe({
  className: "button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "medium",
    fontWeight: "medium",
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    ...focusRing,
  },
  variants: {
    variant: {
      primary: { bg: "accent", color: "text.onAccent", _hover: { bg: "accent.hover" } },
      secondary: {
        bg: "transparent",
        borderColor: "border",
        color: "text.primary",
        _hover: { bg: "surface.hover" },
      },
    },
    size: {
      medium: {
        minHeight: "[40px]",
        px: "4",
        py: "2",
        fontSize: "small",
        "& svg": { width: "iconSmall", height: "iconSmall" },
      },
      large: {
        minHeight: "[48px]",
        px: "6",
        py: "3",
        fontSize: "body",
        "& svg": { width: "iconMedium", height: "iconMedium" },
      },
    },
  },
  defaultVariants: { variant: "primary", size: "medium" },
});
