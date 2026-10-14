import { Download, Rocket } from "lucide-react";
import { css } from "styled-system/css";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <ThemeToggle />
      </header>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1 className={styles.heading}>{content.heading}</h1>
          <p className={styles.description}>{content.description}</p>
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

const styles = {
  page: css({ maxWidth: "page", mx: "auto", py: "8", px: { base: "6", md: "12" } }),
  header: css({ display: "flex", justifyContent: "flex-end", mb: "8" }),
  hero: css({
    display: "grid",
    gap: { base: "8", lg: "16" },
    gridTemplateColumns: { lg: "1fr 1fr" },
    alignItems: { lg: "center" },
  }),
  eyebrow: css({
    m: "0",
    mb: "3",
    color: "accent",
    fontFamily: "mono",
    fontSize: "small",
    fontWeight: "bold",
    letterSpacing: "[1px]",
    textTransform: "uppercase",
  }),
  heading: css({
    m: "0",
    mb: "4",
    fontSize: { base: "headingSmall", md: "headingMedium", lg: "headingLarge" },
    fontWeight: "bold",
    lineHeight: "[1.1]",
  }),
  description: css({
    maxWidth: "[560px]",
    m: "0",
    color: "text.secondary",
    fontSize: "large",
    lineHeight: "[1.6]",
  }),
};
