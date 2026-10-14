// Showcase: platform-native CSS with zero tooling. `:has()` reacts to children, `@scope` bounds
// element selectors to this card, and a container style query toggles the "featured" look from a
// custom property instead of a JS prop.
import { Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { content } from "@/content";
import styles from "./TripCard.module.css";

export function TripCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={featured ? `${styles.root} ${styles.featured}` : styles.root}>
      <span className={styles.badge}>Featured</span>
      <Card
        className={styles.card}
        title={content.card.title}
        items={content.card.items}
        footer={
          <Button variant="primary" size="medium">
            <Rocket aria-hidden />
            {content.actions.primary}
          </Button>
        }
      />
    </div>
  );
}
