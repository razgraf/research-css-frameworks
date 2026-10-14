import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { css, cx } from "styled-system/css";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, items, footer, className }: Props) {
  return (
    <article className={cx(styles.card, className)}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <MapPin aria-hidden className={styles.icon} />
            <div>
              <span className={styles.itemTitle}>{item.title}</span>
              <p className={styles.itemText}>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}

const styles = {
  card: css({
    layerStyle: "surface",
    containerType: "inline-size",
    p: { base: "6", md: "8" },
    transitionProperty: "border-color",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    _hover: { borderColor: "accent" },
  }),
  title: css({ m: "0", mb: "6", fontSize: "large", fontWeight: "bold" }),
  list: css({
    display: "grid",
    gap: "4",
    gridTemplateColumns: { md: "repeat(2, 1fr)" },
    m: "0",
    p: "0",
    listStyle: "none",
  }),
  item: css({ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3" }),
  icon: css({ width: "iconMedium", height: "iconMedium", color: "accent" }),
  itemTitle: css({ fontWeight: "medium" }),
  itemText: css({
    m: "0",
    mt: "1",
    color: "text.secondary",
    fontSize: "small",
    lineHeight: "[1.5]",
  }),
  footer: css({
    display: "flex",
    flexDirection: { base: "column-reverse", "@/cardWide": "row" },
    justifyContent: { "@/cardWide": "flex-end" },
    gap: "3",
    mt: "8",
  }),
};
