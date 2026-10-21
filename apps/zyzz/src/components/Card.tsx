import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { style, surface, vars } from "@/theme";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
};

export function Card({ title, items, footer }: Props) {
  return (
    <article {...styles.card()}>
      <h2 {...styles.title()}>{title}</h2>
      <ul {...styles.list()}>
        {items.map((item) => (
          <li key={item.title} {...styles.item()}>
            <MapPin aria-hidden />
            <div>
              <span {...styles.itemTitle()}>{item.title}</span>
              <p {...styles.itemText()}>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && <div {...styles.footer()}>{footer}</div>}
    </article>
  );
}

namespace styles {
  export const card = style([
    surface,
    {
      containerName: "card",
      containerType: "inline-size",
      padding: "6",
      transition: `border-color ${vars.duration.fast} ${vars.ease.standard}`,
      ":hover": { borderColor: "accent" },
      "@media >=md": { padding: "8" },
    },
  ]);

  export const title = style({
    fontSize: "large",
    fontWeight: "bold",
    marginBlock: "0px !custom",
    marginBottom: "6",
  });

  export const list = style({
    display: "grid",
    gap: "4",
    listStyle: "none",
    margin: "0px !custom",
    padding: "0px !custom",
    "@media >=md": { gridTemplateColumns: "repeat(2, 1fr)" },
  });

  export const item = style({
    display: "grid",
    gap: "3",
    gridTemplateColumns: "auto 1fr",
    selectors: {
      "& svg": {
        color: "accent",
        height: vars.iconSize.medium,
        width: vars.iconSize.medium,
      },
    },
  });

  export const itemTitle = style({ fontWeight: "medium" });

  export const itemText = style({
    color: "textSecondary",
    fontSize: "small",
    lineHeight: 1.5,
    margin: "0px !custom",
    marginTop: "1",
  });

  export const footer = style({
    display: "flex",
    flexDirection: "column-reverse",
    gap: "3",
    marginTop: "8",
    "@container card >=cardWide": { flexDirection: "row", justifyContent: "flex-end" },
  });
}
