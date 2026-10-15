import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { container, media, stylex, theme } from "@/theme/index.stylex";
import { mixins } from "@/theme/mixins";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  sx?: stylex.StyleXStyles;
};

export function Card({ title, items, footer, sx }: Props) {
  return (
    <article sx={[mixins.surface, styles.card, sx]}>
      <h2 sx={styles.title}>{title}</h2>
      <ul sx={styles.list}>
        {items.map((item) => (
          <li key={item.title} sx={styles.item}>
            <MapPin aria-hidden {...stylex.props(styles.icon)} />
            <div>
              <span sx={styles.itemTitle}>{item.title}</span>
              <p sx={styles.itemText}>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && <div sx={styles.footer}>{footer}</div>}
    </article>
  );
}

const styles = stylex.create({
  card: {
    containerType: "inline-size",
    padding: { default: theme.sizes.spacing[6], [media.md]: theme.sizes.spacing[8] },
    borderColor: { default: theme.colors.border, ":hover": theme.colors.accent },
    transitionProperty: "border-color",
    transitionDuration: theme.motion.durationFast,
    transitionTimingFunction: theme.motion.easingStandard,
  },
  title: {
    margin: 0,
    marginBottom: theme.sizes.spacing[6],
    fontSize: theme.font.sizeLarge,
    fontWeight: theme.font.weightBold,
  },
  list: {
    display: "grid",
    gap: theme.sizes.spacing[4],
    gridTemplateColumns: { default: null, [media.md]: "repeat(2, 1fr)" },
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: theme.sizes.spacing[3],
  },
  icon: {
    width: theme.sizes.icon.medium,
    height: theme.sizes.icon.medium,
    color: theme.colors.accent,
  },
  itemTitle: { fontWeight: theme.font.weightMedium },
  itemText: {
    margin: 0,
    marginTop: theme.sizes.spacing[1],
    color: theme.colors.textSecondary,
    fontSize: theme.font.sizeSmall,
    lineHeight: 1.5,
  },
  footer: {
    display: "flex",
    flexDirection: { default: "column-reverse", [container.cardWide]: "row" },
    justifyContent: { default: null, [container.cardWide]: "flex-end" },
    gap: theme.sizes.spacing[3],
    marginTop: theme.sizes.spacing[8],
  },
});
