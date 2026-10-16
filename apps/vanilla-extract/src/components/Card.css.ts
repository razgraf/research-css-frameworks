import { globalStyle, style } from "@vanilla-extract/css";
import { cardContainer, container, media, surface, vars } from "@/theme";

export const card = style([
  surface,
  {
    ":hover": { borderColor: vars.color.accent },
    "@media": { [media.md]: { padding: vars.spacing[8] } },
    containerName: cardContainer,
    containerType: "inline-size",
    padding: vars.spacing[6],
    transition: `border-color ${vars.duration.fast} ${vars.easing.standard}`,
  },
]);

export const title = style({
  fontSize: vars.fontSize.large,
  fontWeight: vars.fontWeight.bold,
  margin: `0 0 ${vars.spacing[6]}`,
});

export const list = style({
  "@media": { [media.md]: { gridTemplateColumns: "repeat(2, 1fr)" } },
  display: "grid",
  gap: vars.spacing[4],
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const item = style({
  display: "grid",
  gap: vars.spacing[3],
  gridTemplateColumns: "auto 1fr",
});

globalStyle(`${item} svg`, {
  color: vars.color.accent,
  height: vars.iconSize.medium,
  width: vars.iconSize.medium,
});

export const itemTitle = style({ fontWeight: vars.fontWeight.medium });

export const itemText = style({
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.small,
  lineHeight: 1.5,
  margin: `${vars.spacing[1]} 0 0`,
});

export const footer = style({
  "@container": { [container.cardWide]: { flexDirection: "row", justifyContent: "flex-end" } },
  display: "flex",
  flexDirection: "column-reverse",
  gap: vars.spacing[3],
  marginTop: vars.spacing[8],
});
