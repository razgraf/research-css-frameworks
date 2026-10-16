import { style } from "@vanilla-extract/css";
import { media, vars } from "@/theme";

export const grid = style({
  "@media": { [media.lg]: { gridTemplateColumns: "1fr 1fr" } },
  display: "grid",
  gap: vars.spacing[12],
  marginInline: "auto",
  maxWidth: "1152px",
  padding: `${vars.spacing[12]} ${vars.spacing[6]}`,
});
