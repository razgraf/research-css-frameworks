import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Props = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "medium" | "large";
};

export function Button({ variant = "primary", size = "medium", className, ...props }: Props) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean);
  return <button type="button" className={classes.join(" ")} {...props} />;
}
