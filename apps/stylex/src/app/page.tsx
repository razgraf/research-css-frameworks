import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";
import { media, stylex, theme } from "@/theme/index.stylex";

export default function Home() {
  return (
    <main sx={styles.page}>
      <header sx={styles.header}>
        <ThemeToggle />
      </header>
      <section sx={styles.hero}>
        <div>
          <p sx={styles.eyebrow}>{content.eyebrow}</p>
          <h1 sx={styles.heading}>{content.heading}</h1>
          <p sx={styles.description}>{content.description}</p>
        </div>
        <Card
          title={content.card.title}
          items={content.card.items}
          footer={
            <>
              <Button variant="secondary" size="medium" icon={Download}>
                {content.actions.secondary}
              </Button>
              <Button variant="primary" size="large" icon={Rocket}>
                {content.actions.primary}
              </Button>
            </>
          }
        />
      </section>
    </main>
  );
}

const styles = stylex.create({
  page: {
    maxWidth: 1152,
    marginInline: "auto",
    paddingBlock: theme.sizes.spacing[8],
    paddingInline: { default: theme.sizes.spacing[6], [media.md]: theme.sizes.spacing[12] },
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.sizes.spacing[8],
  },
  hero: {
    display: "grid",
    gap: { default: theme.sizes.spacing[8], [media.lg]: theme.sizes.spacing[16] },
    gridTemplateColumns: { default: null, [media.lg]: "1fr 1fr" },
    alignItems: { default: null, [media.lg]: "center" },
  },
  eyebrow: {
    margin: 0,
    marginBottom: theme.sizes.spacing[3],
    color: theme.colors.accent,
    fontFamily: theme.font.familyMono,
    fontSize: theme.font.sizeSmall,
    fontWeight: theme.font.weightBold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    marginBottom: theme.sizes.spacing[4],
    fontSize: {
      default: theme.font.sizeHeadingSmall,
      [media.md]: theme.font.sizeHeadingMedium,
      [media.lg]: theme.font.sizeHeadingLarge,
    },
    fontWeight: theme.font.weightBold,
    lineHeight: 1.1,
  },
  description: {
    maxWidth: 560,
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: theme.font.sizeLarge,
    lineHeight: 1.6,
  },
});
