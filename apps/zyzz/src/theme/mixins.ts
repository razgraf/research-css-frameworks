import { style, vars } from "./zyzz.config";

export const surface = style({
  backgroundColor: "surface",
  borderColor: "border",
  borderRadius: "large",
  borderStyle: "solid",
  borderWidth: "1px",
  boxShadow: `0px 8px 24px ${vars.color.shadow} !custom`,
});

export const focusRing = style({
  ":focus-visible": {
    outlineColor: "focusRing",
    outlineOffset: "2px",
    outlineStyle: "solid",
    outlineWidth: "2px",
  },
});
