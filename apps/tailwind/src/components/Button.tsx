import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const button = cva(
  "focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-medium border border-transparent font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-accent text-text-on-accent hover:bg-accent-hover",
        secondary: "border-border bg-transparent text-text-primary hover:bg-surface-hover",
      },
      size: {
        medium: "min-h-[40px] px-4 py-2 text-small [&_svg]:size-icon-small",
        large: "min-h-12 px-6 py-3 text-body [&_svg]:size-icon-medium",
      },
    },
    defaultVariants: { variant: "primary", size: "medium" },
  },
);

type Props = ComponentProps<"button"> & VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: Props) {
  return <button type="button" className={cn(button({ variant, size }), className)} {...props} />;
}
