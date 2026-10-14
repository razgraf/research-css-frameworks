import { styled } from "@linaria/react";
import type { ComponentProps } from "react";
import { focusRing } from "@/theme/mixins";
import { color, font, iconSize, motion, radius, spacing } from "@/theme/tokens";

const Base = styled.button`
  ${focusRing};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  border: 1px solid transparent;
  border-radius: ${radius.medium};
  font-weight: ${font.weightMedium};
  cursor: pointer;
  transition: background-color ${motion.durationFast} ${motion.easingStandard};

  &[data-variant="primary"] {
    background: ${color.accent};
    color: ${color.textOnAccent};

    &:hover {
      background: ${color.accentHover};
    }
  }

  &[data-variant="secondary"] {
    background: transparent;
    border-color: ${color.border};
    color: ${color.textPrimary};

    &:hover {
      background: ${color.surfaceHover};
    }
  }

  &[data-size="medium"] {
    min-height: 40px;
    padding: ${spacing[2]} ${spacing[4]};
    font-size: ${font.sizeSmall};

    & svg {
      width: ${iconSize.small};
      height: ${iconSize.small};
    }
  }

  &[data-size="large"] {
    min-height: 48px;
    padding: ${spacing[3]} ${spacing[6]};
    font-size: ${font.sizeBody};

    & svg {
      width: ${iconSize.medium};
      height: ${iconSize.medium};
    }
  }
`;

type Props = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "medium" | "large";
};

export function Button({ variant = "primary", size = "medium", ...props }: Props) {
  return <Base type="button" data-variant={variant} data-size={size} {...props} />;
}
