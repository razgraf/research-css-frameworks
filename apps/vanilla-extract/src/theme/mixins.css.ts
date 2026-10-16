import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const surface = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.large,
  boxShadow: vars.shadow.card,
});

export const focusRing = style({
  ":focus-visible": {
    outline: `2px solid ${vars.color.focusRing}`,
    outlineOffset: "2px",
  },
});
