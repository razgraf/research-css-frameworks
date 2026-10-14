import { styled } from "@linaria/react";
import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";
import { media } from "@/theme/breakpoints";
import { color, font, spacing } from "@/theme/tokens";

const Page = styled.main`
  max-width: 1152px;
  margin-inline: auto;
  padding: ${spacing[8]} ${spacing[6]};

  ${media.md} {
    padding-inline: ${spacing[12]};
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${spacing[8]};
`;

const Hero = styled.section`
  display: grid;
  gap: ${spacing[8]};

  ${media.lg} {
    grid-template-columns: 1fr 1fr;
    gap: ${spacing[16]};
    align-items: center;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 ${spacing[3]};
  color: ${color.accent};
  font-family: ${font.familyMono};
  font-size: ${font.sizeSmall};
  font-weight: ${font.weightBold};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Heading = styled.h1`
  margin: 0 0 ${spacing[4]};
  font-size: ${font.sizeHeadingSmall};
  font-weight: ${font.weightBold};
  line-height: 1.1;

  ${media.md} {
    font-size: ${font.sizeHeadingMedium};
  }

  ${media.lg} {
    font-size: ${font.sizeHeadingLarge};
  }
`;

const Description = styled.p`
  max-width: 560px;
  margin: 0;
  color: ${color.textSecondary};
  font-size: ${font.sizeLarge};
  line-height: 1.6;
`;

export default function Home() {
  return (
    <Page>
      <Header>
        <ThemeToggle />
      </Header>
      <Hero>
        <div>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading>{content.heading}</Heading>
          <Description>{content.description}</Description>
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
      </Hero>
    </Page>
  );
}
