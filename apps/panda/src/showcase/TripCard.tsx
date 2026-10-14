// Showcase: typed multi-part recipes and strict tokens. `tripCard` is a slot recipe: one object
// styles every part of the card, and the `tone` variant restyles several slots at once. With
// `strictTokens: true`, raw values like "#f00" are type errors; only tokens (or explicit `[...]`) pass.
import { MapPin } from "lucide-react";
import { type RecipeVariantProps, sva } from "styled-system/css";
import type { SystemStyleObject } from "styled-system/types";
import { content } from "@/content";

const tripCard = sva({
  slots: ["root", "title", "list", "item", "icon"],
  base: {
    root: { layerStyle: "surface", p: "8" },
    title: { m: "0", mb: "6", fontSize: "large", fontWeight: "bold" },
    list: { display: "grid", gap: "3", m: "0", p: "0", listStyle: "none" },
    item: { display: "flex", alignItems: "center", gap: "3", fontWeight: "medium" },
    icon: { width: "iconMedium", height: "iconMedium", color: "text.secondary" },
  },
  variants: {
    tone: {
      default: {},
      featured: {
        root: { borderColor: "accent" },
        title: { color: "accent" },
        icon: { color: "accent" },
      },
    },
  },
  defaultVariants: { tone: "default" },
});

// @ts-expect-error raw hex values aren't tokens under strictTokens
const _rejected: SystemStyleObject = { color: "#f00" };

export function TripCard(props: RecipeVariantProps<typeof tripCard>) {
  const classes = tripCard(props);
  return (
    <article className={classes.root}>
      <h2 className={classes.title}>{content.card.title}</h2>
      <ul className={classes.list}>
        {content.card.items.map((item) => (
          <li key={item.title} className={classes.item}>
            <MapPin aria-hidden className={classes.icon} />
            {item.title}
          </li>
        ))}
      </ul>
    </article>
  );
}
