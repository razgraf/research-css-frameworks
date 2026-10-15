import type { StyleXStyles } from "@stylexjs/stylex";

// The StyleX Babel plugin compiles `sx` on lowercase JSX elements into `{...stylex.props(…)}`.
declare module "react" {
  interface HTMLAttributes<T> {
    sx?: StyleXStyles;
  }
}
