import type { ComponentProps } from "react";
import { type ButtonVariants, button } from "./Button.css";

type Props = ComponentProps<"button"> & ButtonVariants;

export function Button({ variant, size, className, ...props }: Props) {
  const classes = className
    ? `${button({ variant, size })} ${className}`
    : button({ variant, size });
  return <button type="button" className={classes} {...props} />;
}
