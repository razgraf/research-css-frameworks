import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";
import styles from "./page.module.css";

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
