import * as stylex from "@stylexjs/stylex";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { container, media } from "@/theme/breakpoints.stylex";
import { mixins } from "@/theme/mixins";
import { colors, font, iconSize, motion, spacing } from "@/theme/tokens.stylex";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  style?: stylex.StyleXStyles;
};

export function Card({ title, items, footer, style }: Props) {
  return (
    <article {...stylex.props(mixins.surface, styles.card, style)}>
      <h2 {...stylex.props(styles.title)}>{title}</h2>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => (
          <li key={item.title} {...stylex.props(styles.item)}>
            <MapPin aria-hidden {...stylex.props(styles.icon)} />
            <div>
              <span {...stylex.props(styles.itemTitle)}>{item.title}</span>
              <p {...stylex.props(styles.itemText)}>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
    </article>
  );
}

const styles = stylex.create({
  card: {
    containerType: "inline-size",
    padding: { default: spacing[6], [media.md]: spacing[8] },
    borderColor: { default: colors.border, ":hover": colors.accent },
    transitionProperty: "border-color",
    transitionDuration: motion.durationFast,
    transitionTimingFunction: motion.easingStandard,
  },
  title: {
    margin: 0,
    marginBottom: spacing[6],
    fontSize: font.sizeLarge,
    fontWeight: font.weightBold,
  },
  list: {
    display: "grid",
    gap: spacing[4],
    gridTemplateColumns: { default: null, [media.md]: "repeat(2, 1fr)" },
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: spacing[3],
  },
  icon: {
    width: iconSize.medium,
    height: iconSize.medium,
    color: colors.accent,
  },
  itemTitle: { fontWeight: font.weightMedium },
  itemText: {
    margin: 0,
    marginTop: spacing[1],
    color: colors.textSecondary,
    fontSize: font.sizeSmall,
    lineHeight: 1.5,
  },
  footer: {
    display: "flex",
    flexDirection: { default: "column-reverse", [container.cardWide]: "row" },
    justifyContent: { default: null, [container.cardWide]: "flex-end" },
    gap: spacing[3],
    marginTop: spacing[8],
  },
});
