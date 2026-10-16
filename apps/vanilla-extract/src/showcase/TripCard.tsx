// Showcase: typed theme contracts. `featured` is a scoped theme built with `createTheme(vars.color,
// …)`: it re-skins the unchanged Card through the same variables, and TypeScript rejects a theme that
// misses any token, so a new color can't be added without updating every theme.
import { Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { content } from "@/content";
import * as styles from "./TripCard.css";

export function TripCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={featured ? `${styles.root} ${styles.featured}` : styles.root}>
      <Card
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
