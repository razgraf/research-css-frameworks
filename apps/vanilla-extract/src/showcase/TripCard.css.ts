import { createTheme, style } from "@vanilla-extract/css";
import { vars } from "@/theme";

const { mars, neutral, white } = vars.palette;

const tokens = {
  accent: neutral[50],
  accentHover: white,
  background: mars[700],
  border: mars[500],
  focusRing: white,
  surface: mars[700],
  surfaceHover: mars[600],
  textOnAccent: mars[700],
  textPrimary: white,
  textSecondary: mars[300],
};

// Re-skins every semantic color inside the subtree. The unchanged Card picks it up through the same
// variables, and every key of the contract needs a value.
export const featured = createTheme(vars.color, tokens);

export const root = style({ color: vars.color.textPrimary });

// Never called: the build would also throw "Tokens don't match contract".
const { focusRing: _, ...incomplete } = tokens;
// @ts-expect-error a theme without `focusRing` breaks the contract
const _rejected = () => createTheme(vars.color, incomplete);
