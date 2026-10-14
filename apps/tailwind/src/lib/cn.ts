import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["small", "body", "large", "heading-small", "heading-medium", "heading-large"],
      radius: ["small", "medium", "large", "full"],
      "font-weight": ["regular", "medium", "bold"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
