import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { type ButtonVariantProps, button } from "styled-system/recipes";

type Props = ComponentProps<"button"> & ButtonVariantProps;

export function Button({ variant, size, className, ...props }: Props) {
  return <button type="button" className={cx(button({ variant, size }), className)} {...props} />;
}
