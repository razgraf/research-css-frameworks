import type { ReactNode } from "react";
import { cx, type Props } from "zyzz";
import { focusRing, variants, vars } from "@/theme";

type ButtonProps = Props.Variants<typeof styles.button> & { children: ReactNode };

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button type="button" {...cx(focusRing(), styles.button(props))}>
      {children}
    </button>
  );
}

namespace styles {
  export const button = variants({
    base: {
      alignItems: "center",
      borderColor: "transparent !custom",
      borderRadius: "medium",
      borderStyle: "solid",
      borderWidth: "1px",
      cursor: "pointer",
      display: "inline-flex",
      fontFamily: "inherit !custom",
      fontWeight: "medium",
      justifyContent: "center",
      transition: `background-color ${vars.duration.fast} ${vars.ease.standard}`,
    },
    defaultVariants: { size: "medium", variant: "primary" },
    variants: {
      size: {
        large: {
          fontSize: "body",
          minHeight: "48px !custom",
          paddingBlock: "3",
          paddingInline: "6",
          selectors: { "& svg": { height: vars.iconSize.medium, width: vars.iconSize.medium } },
        },
        medium: {
          fontSize: "small",
          minHeight: "40px !custom",
          paddingBlock: "2",
          paddingInline: "4",
          selectors: { "& svg": { height: vars.iconSize.small, width: vars.iconSize.small } },
        },
      },
      variant: {
        primary: {
          backgroundColor: "accent",
          color: "textOnAccent",
          ":hover": { backgroundColor: "accentHover" },
        },
        secondary: {
          backgroundColor: "transparent !custom",
          borderColor: "border",
          color: "textPrimary",
          ":hover": { backgroundColor: "surfaceHover" },
        },
      },
    },
  });
}
