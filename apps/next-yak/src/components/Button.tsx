import { css, styled } from "next-yak";
import type { ComponentProps } from "react";
import { focusRing } from "@/theme/mixins";
import { color, font, iconSize, motion, radius, spacing } from "@/theme/tokens";

type Variant = "primary" | "secondary";
type Size = "medium" | "large";

const Base = styled.button<{ $variant: Variant; $size: Size }>`
  ${focusRing};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.s2};
  border: 1px solid transparent;
  border-radius: ${radius.medium};
  font-weight: ${font.weightMedium};
  cursor: pointer;
  transition: background-color ${motion.durationFast} ${motion.easingStandard};

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          background: ${color.accent};
          color: ${color.textOnAccent};

          &:hover {
            background: ${color.accentHover};
          }
        `
      : css`
          background: transparent;
          border-color: ${color.border};
          color: ${color.textPrimary};

          &:hover {
            background: ${color.surfaceHover};
          }
        `}

  ${({ $size }) =>
    $size === "medium"
      ? css`
          min-height: 40px;
          padding: ${spacing.s2} ${spacing.s4};
          font-size: ${font.sizeSmall};

          & svg {
            width: ${iconSize.small};
            height: ${iconSize.small};
          }
        `
      : css`
          min-height: 48px;
          padding: ${spacing.s3} ${spacing.s6};
          font-size: ${font.sizeBody};

          & svg {
            width: ${iconSize.medium};
            height: ${iconSize.medium};
          }
        `}
`;

type Props = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({
  variant = "primary",
  size = "medium",
  ...props
}: Props) {
  return <Base type="button" $variant={variant} $size={size} {...props} />;
}
