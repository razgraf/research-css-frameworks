import { globalStyle, style } from "@vanilla-extract/css";
import { focusRing, vars } from "@/theme";

export const toggle = style([
  focusRing,
  {
    ":hover": { background: vars.color.surfaceHover },
    background: "transparent",
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    color: vars.color.textPrimary,
    cursor: "pointer",
    display: "grid",
    height: "40px",
    placeItems: "center",
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    width: "40px",
  },
]);

globalStyle(`${toggle} svg`, { height: vars.iconSize.medium, width: vars.iconSize.medium });

export const sun = style({});
export const moon = style({});

globalStyle(`[data-theme="light"] ${sun}, :root:not([data-theme="light"]) ${moon}`, {
  display: "none",
});
