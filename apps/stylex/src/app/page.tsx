import * as stylex from "@stylexjs/stylex";
import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";
import { media } from "@/theme/breakpoints.stylex";
import { colors, font, spacing } from "@/theme/tokens.stylex";

export default function Home() {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <ThemeToggle />
      </header>
      <section {...stylex.props(styles.hero)}>
        <div>
          <p {...stylex.props(styles.eyebrow)}>{content.eyebrow}</p>
          <h1 {...stylex.props(styles.heading)}>{content.heading}</h1>
          <p {...stylex.props(styles.description)}>{content.description}</p>
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
    paddingBlock: spacing[8],
    paddingInline: { default: spacing[6], [media.md]: spacing[12] },
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: spacing[8],
  },
  hero: {
    display: "grid",
    gap: { default: spacing[8], [media.lg]: spacing[16] },
    gridTemplateColumns: { default: null, [media.lg]: "1fr 1fr" },
    alignItems: { default: null, [media.lg]: "center" },
  },
  eyebrow: {
    margin: 0,
    marginBottom: spacing[3],
    color: colors.accent,
    fontFamily: font.familyMono,
    fontSize: font.sizeSmall,
    fontWeight: font.weightBold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    marginBottom: spacing[4],
    fontSize: {
      default: font.sizeHeadingSmall,
      [media.md]: font.sizeHeadingMedium,
      [media.lg]: font.sizeHeadingLarge,
    },
    fontWeight: font.weightBold,
    lineHeight: 1.1,
  },
  description: {
    maxWidth: 560,
    margin: 0,
    color: colors.textSecondary,
    fontSize: font.sizeLarge,
    lineHeight: 1.6,
  },
});
