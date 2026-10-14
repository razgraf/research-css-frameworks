// Showcase: the styled-components API with zero runtime CSS-in-JS. `${Wrapper}:hover ${Title}`
// targets components from another file as selectors, and `$progress` is a dynamic prop that yak
// compiles to a CSS custom property set inline, so no styles are generated at runtime.
import { styled } from "next-yak";
import { Card, Title, Wrapper } from "@/components/Card";
import { content } from "@/content";
import { color, font, motion, radius, spacing } from "@/theme/tokens";

const Root = styled.div`
  ${Wrapper}:hover ${Title} {
    color: ${color.accent};
  }
`;

const Countdown = styled.div`
  display: grid;
  flex: 1;
  gap: ${spacing.s2};
  color: ${color.textSecondary};
  font-size: ${font.sizeSmall};
`;

const Progress = styled.div<{ $progress: number }>`
  height: 8px;
  overflow: hidden;
  border-radius: ${radius.full};
  background: ${color.surfaceHover};

  &::after {
    content: "";
    display: block;
    width: ${({ $progress }) => `${$progress}%`};
    height: 100%;
    background: ${color.accent};
    transition: width ${motion.durationFast} ${motion.easingStandard};
  }
`;

export function TripCard({ progress }: { progress: number }) {
  return (
    <Root>
      <Card
        title={content.card.title}
        items={content.card.items}
        footer={
          <Countdown>
            Launch prep {progress}% complete
            <Progress $progress={progress} />
          </Countdown>
        }
      />
    </Root>
  );
}
