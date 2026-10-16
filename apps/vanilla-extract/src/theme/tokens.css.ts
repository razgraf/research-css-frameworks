import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css";

const palette = {
  mars: { 300: "#f4a37e", 400: "#ee7d4f", 500: "#e2612e", 600: "#c24e1f", 700: "#9a3c17" },
  neutral: {
    50: "#f7f8fa",
    100: "#eceef2",
    200: "#d5d8e0",
    400: "#8a90a0",
    600: "#4a5060",
    700: "#2a2f3a",
    800: "#1c2029",
    900: "#12151c",
    950: "#0b0d12",
  },
  white: "#ffffff",
};

const tokens = {
  color: {
    accent: palette.mars[400],
    accentHover: palette.mars[300],
    background: palette.neutral[950],
    border: palette.neutral[700],
    focusRing: palette.mars[300],
    surface: palette.neutral[900],
    surfaceHover: palette.neutral[800],
    textOnAccent: palette.neutral[950],
    textPrimary: palette.neutral[50],
    textSecondary: palette.neutral[400],
  },
  duration: { fast: "150ms" },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
  fontFamily: {
    mono: "var(--font-geist-mono), ui-monospace, monospace",
    sans: "var(--font-geist-sans), system-ui, sans-serif",
  },
  fontSize: {
    body: "12pt",
    headingLarge: "42pt",
    headingMedium: "33pt",
    headingSmall: "24pt",
    large: "15pt",
    small: "10.5pt",
  },
  fontWeight: { bold: "700", medium: "500", regular: "400" },
  iconSize: { medium: "20px", small: "16px" },
  palette,
  radius: { full: "9999px", large: "20px", medium: "12px", small: "6px" },
  shadow: { card: "0 8px 24px rgb(0 0 0 / 0.4)" },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    8: "32px",
    12: "48px",
    16: "64px",
  },
};

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// Stable names (`--color-accent`, `--spacing-6`) instead of hashes, so every app emits the same
// variables and the inline theme script only has to flip `data-theme`.
export const vars = createGlobalThemeContract(tokens, (_value, path) =>
  kebab(path.filter((key) => key !== "palette").join("-")),
);

createGlobalTheme(":root", vars, tokens);

globalStyle(":root", { colorScheme: "dark" });

globalStyle(':root[data-theme="light"]', {
  colorScheme: "light",
  vars: {
    ...assignVars(vars.color, {
      accent: vars.palette.mars[700],
      accentHover: vars.palette.mars[600],
      background: vars.palette.neutral[50],
      border: vars.palette.neutral[200],
      focusRing: vars.palette.mars[600],
      surface: vars.palette.white,
      surfaceHover: vars.palette.neutral[100],
      textOnAccent: vars.palette.white,
      textPrimary: vars.palette.neutral[950],
      textSecondary: vars.palette.neutral[600],
    }),
    ...assignVars(vars.shadow, { card: "0 8px 24px rgb(16 18 24 / 0.08)" }),
  },
});
