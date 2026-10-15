import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { stylex, theme } from "@/theme/index.stylex";
import { mixins } from "@/theme/mixins";

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
      sx={[mixins.focusRing, styles.base, variants[variant], sizes[size]]}
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
    gap: theme.sizes.spacing[2],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: theme.sizes.radius.medium,
    fontWeight: theme.font.weightMedium,
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: theme.motion.durationFast,
    transitionTimingFunction: theme.motion.easingStandard,
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: theme.colors.accent, ":hover": theme.colors.accentHover },
    color: theme.colors.textOnAccent,
  },
  secondary: {
    backgroundColor: { default: "transparent", ":hover": theme.colors.surfaceHover },
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
});

const sizes = stylex.create({
  medium: {
    minHeight: 40,
    paddingBlock: theme.sizes.spacing[2],
    paddingInline: theme.sizes.spacing[4],
    fontSize: theme.font.sizeSmall,
  },
  large: {
    minHeight: 48,
    paddingBlock: theme.sizes.spacing[3],
    paddingInline: theme.sizes.spacing[6],
    fontSize: theme.font.sizeBody,
  },
});

const icons = stylex.create({
  medium: { width: theme.sizes.icon.small, height: theme.sizes.icon.small },
  large: { width: theme.sizes.icon.medium, height: theme.sizes.icon.medium },
});
