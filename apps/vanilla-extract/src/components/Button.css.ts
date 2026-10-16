import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { type RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { focusRing, vars } from "@/theme";

const iconSize = createVar();

const base = style([
  focusRing,
  {
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: vars.radius.medium,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: "inherit",
    fontWeight: vars.fontWeight.medium,
    justifyContent: "center",
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
  },
]);

globalStyle(`${base} svg`, { height: iconSize, width: iconSize });

export const button = recipe({
  base,
  defaultVariants: { size: "medium", variant: "primary" },
  variants: {
    size: {
      large: {
        fontSize: vars.fontSize.body,
        minHeight: "48px",
        padding: `${vars.spacing[3]} ${vars.spacing[6]}`,
        vars: { [iconSize]: vars.iconSize.medium },
      },
      medium: {
        fontSize: vars.fontSize.small,
        minHeight: "40px",
        padding: `${vars.spacing[2]} ${vars.spacing[4]}`,
        vars: { [iconSize]: vars.iconSize.small },
      },
    },
    variant: {
      primary: {
        ":hover": { background: vars.color.accentHover },
        background: vars.color.accent,
        color: vars.color.textOnAccent,
      },
      secondary: {
        ":hover": { background: vars.color.surfaceHover },
        background: "transparent",
        borderColor: vars.color.border,
        color: vars.color.textPrimary,
      },
    },
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
