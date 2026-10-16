import { style } from "@vanilla-extract/css";
import { media, vars } from "@/theme";

export const page = style({
  "@media": { [media.md]: { paddingInline: vars.spacing[12] } },
  marginInline: "auto",
  maxWidth: "1152px",
  padding: `${vars.spacing[8]} ${vars.spacing[6]}`,
});

export const header = style({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: vars.spacing[8],
});

export const hero = style({
  "@media": {
    [media.lg]: { alignItems: "center", gap: vars.spacing[16], gridTemplateColumns: "1fr 1fr" },
  },
  display: "grid",
  gap: vars.spacing[8],
});

export const eyebrow = style({
  color: vars.color.accent,
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "1px",
  margin: `0 0 ${vars.spacing[3]}`,
  textTransform: "uppercase",
});

export const heading = style({
  "@media": {
    [media.md]: { fontSize: vars.fontSize.headingMedium },
    [media.lg]: { fontSize: vars.fontSize.headingLarge },
  },
  fontSize: vars.fontSize.headingSmall,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.1,
  margin: `0 0 ${vars.spacing[4]}`,
});

export const description = style({
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.large,
  lineHeight: 1.6,
  margin: 0,
  maxWidth: "560px",
});
