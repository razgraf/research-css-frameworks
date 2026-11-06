import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";
import { style } from "@/theme";

export default function Home() {
  return (
    <main {...styles.page()}>
      <header {...styles.header()}>
        <ThemeToggle />
      </header>
      <section {...styles.hero()}>
        <div>
          <p {...styles.eyebrow()}>{content.eyebrow}</p>
          <h1 {...styles.heading()}>{content.heading}</h1>
          <p {...styles.description()}>{content.description}</p>
        </div>
        <Card
          title={content.card.title}
          items={content.card.items}
          footer={
            <>
              <Button variant="secondary" size="medium">
                <Download aria-hidden />
                {content.actions.secondary}
              </Button>
              <Button variant="primary" size="large">
                <Rocket aria-hidden />
                {content.actions.primary}
              </Button>
            </>
          }
        />
      </section>
    </main>
  );
}

namespace styles {
  export const page = style({
    marginInline: "auto !custom",
    maxWidth: "1152px !custom",
    paddingBlock: "8",
    paddingInline: "6",
    "@media >=md": { paddingInline: "12" },
  });

  export const header = style({
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "8",
  });

  export const hero = style({
    display: "grid",
    gap: "8",
    "@media >=lg": { alignItems: "center", gap: "16", gridTemplateColumns: "1fr 1fr" },
  });

  export const eyebrow = style({
    color: "accent",
    fontFamily: "mono",
    fontSize: "small",
    fontWeight: "bold",
    letterSpacing: "1px",
    margin: "0px !custom",
    marginBottom: "3",
    textTransform: "uppercase",
  });

  export const heading = style({
    fontSize: "headingSmall",
    fontWeight: "bold",
    lineHeight: 1.1,
    margin: "0px !custom",
    marginBottom: "4",
    "@media >=md": { fontSize: "headingMedium" },
    "@media >=lg": { fontSize: "headingLarge" },
  });

  export const description = style({
    color: "textSecondary",
    fontSize: "large",
    lineHeight: 1.6,
    margin: "0px !custom",
    maxWidth: "560px !custom",
  });
}
