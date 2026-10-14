import { styled } from "@linaria/react";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { container, media } from "@/theme/breakpoints";
import { surface } from "@/theme/mixins";
import { color, font, iconSize, motion, spacing } from "@/theme/tokens";

export const Wrapper = styled.article`
  ${surface};
  container-type: inline-size;
  padding: ${spacing[6]};
  transition: border-color ${motion.durationFast} ${motion.easingStandard};

  &:hover {
    border-color: ${color.accent};
  }

  ${media.md} {
    padding: ${spacing[8]};
  }
`;

export const Title = styled.h2`
  margin: 0 0 ${spacing[6]};
  font-size: ${font.sizeLarge};
  font-weight: ${font.weightBold};
`;

const List = styled.ul`
  display: grid;
  gap: ${spacing[4]};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  & > li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: ${spacing[3]};
  }

  & svg {
    width: ${iconSize.medium};
    height: ${iconSize.medium};
    color: ${color.accent};
  }

  & span {
    font-weight: ${font.weightMedium};
  }

  & p {
    margin: ${spacing[1]} 0 0;
    color: ${color.textSecondary};
    font-size: ${font.sizeSmall};
    line-height: 1.5;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${spacing[3]};
  margin-top: ${spacing[8]};

  ${container.cardWide} {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, items, footer, className }: Props) {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      <List>
        {items.map((item) => (
          <li key={item.title}>
            <MapPin aria-hidden />
            <div>
              <span>{item.title}</span>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </List>
      {footer && <Footer>{footer}</Footer>}
    </Wrapper>
  );
}
