import * as stylex from "@stylexjs/stylex";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { mixins } from "@/theme/mixins";
import { colors, font, iconSize, motion, radius, spacing } from "@/theme/tokens.stylex";

type Variant = "primary" | "secondary";
type Size = "medium" | "large";

type Props = Omit<ComponentProps<"button">, "className" | "style"> & {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
};

export function Button({
  variant = "primary",
  size = "medium",
  icon: Icon,
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      {...props}
      {...stylex.props(mixins.focusRing, styles.base, variants[variant], sizes[size])}
    >
      {Icon && <Icon aria-hidden {...stylex.props(icons[size])} />}
      {children}
    </button>
  );
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: radius.medium,
    fontWeight: font.weightMedium,
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: motion.durationFast,
    transitionTimingFunction: motion.easingStandard,
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: colors.accent, ":hover": colors.accentHover },
    color: colors.textOnAccent,
  },
  secondary: {
    backgroundColor: { default: "transparent", ":hover": colors.surfaceHover },
    borderColor: colors.border,
    color: colors.textPrimary,
  },
});

const sizes = stylex.create({
  medium: {
    minHeight: 40,
    paddingBlock: spacing[2],
    paddingInline: spacing[4],
    fontSize: font.sizeSmall,
  },
  large: {
    minHeight: 48,
    paddingBlock: spacing[3],
    paddingInline: spacing[6],
    fontSize: font.sizeBody,
  },
});

const icons = stylex.create({
  medium: { width: iconSize.small, height: iconSize.small },
  large: { width: iconSize.medium, height: iconSize.medium },
});
