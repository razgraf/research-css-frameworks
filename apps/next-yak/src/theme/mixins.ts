import { css } from "next-yak";
import { color, radius, shadow } from "./tokens";

export const surface = css`
  background: ${color.surface};
  border: 1px solid ${color.border};
  border-radius: ${radius.large};
  box-shadow: ${shadow.card};
`;

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${color.focusRing};
    outline-offset: 2px;
  }
`;
