import { defineConfig, defineVars } from "zyzz";

const tokens = defineVars(
  {
    breakpoint: { lg: "1024px", md: "768px", sm: "640px" },
    color: {
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
    },
    // Measured on the card's content box.
    container: { cardWide: "400px" },
    containerNames: ["card"],
    duration: { fast: "150ms" },
    ease: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
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
    fontWeight: { bold: 700, medium: 500, regular: 400 },
    iconSize: { medium: "20px", small: "16px" },
    radius: { full: "9999px", large: "20px", medium: "12px", small: "6px" },
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
  },
  (vars) => ({
    color: {
      accent: { dark: vars.color.mars[400], light: vars.color.mars[700] },
      accentHover: { dark: vars.color.mars[300], light: vars.color.mars[600] },
      background: { dark: vars.color.neutral[950], light: vars.color.neutral[50] },
      border: { dark: vars.color.neutral[700], light: vars.color.neutral[200] },
      focusRing: { dark: vars.color.mars[300], light: vars.color.mars[600] },
      shadow: { dark: "rgb(0 0 0 / 0.4)", light: "rgb(16 18 24 / 0.08)" },
      surface: { dark: vars.color.neutral[900], light: vars.color.white },
      surfaceHover: { dark: vars.color.neutral[800], light: vars.color.neutral[100] },
      textOnAccent: { dark: vars.color.neutral[950], light: vars.color.white },
      textPrimary: { dark: vars.color.neutral[50], light: vars.color.neutral[950] },
      textSecondary: { dark: vars.color.neutral[400], light: vars.color.neutral[600] },
    },
  }),
);

export const { appearance, script, style, variants, vars } = defineConfig({ vars: tokens });
