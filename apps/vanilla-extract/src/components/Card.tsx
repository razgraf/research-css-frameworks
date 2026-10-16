import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import * as styles from "./Card.css";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, items, footer, className }: Props) {
  return (
    <article className={className ? `${styles.card} ${className}` : styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <MapPin aria-hidden />
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
