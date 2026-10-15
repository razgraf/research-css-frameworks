import * as stylex from "@stylexjs/stylex";

export { stylex }; // FYI This breaks a documented rule that we cannot export anything other than tokens from a tokens file

export const palette = stylex.defineConsts({
  neutral950: "#0b0d12",
  neutral900: "#12151c",
  neutral800: "#1c2029",
  neutral700: "#2a2f3a",
  neutral600: "#4a5060",
  neutral400: "#8a90a0",
  neutral200: "#d5d8e0",
  neutral100: "#eceef2",
  neutral50: "#f7f8fa",
  white: "#ffffff",
  mars300: "#f4a37e",
  mars400: "#ee7d4f",
  mars500: "#e2612e",
  mars600: "#c24e1f",
  mars700: "#9a3c17",
});

// light-dark(light, dark) resolves from `color-scheme`, which globals.css sets from [data-theme]
export const theme = stylex.unstable_defineVarsNested({
  colors: {
    background: `light-dark(${palette.neutral50}, ${palette.neutral950})`,
    surface: `light-dark(${palette.white}, ${palette.neutral900})`,
    surfaceHover: `light-dark(${palette.neutral100}, ${palette.neutral800})`,
    border: `light-dark(${palette.neutral200}, ${palette.neutral700})`,
    textPrimary: `light-dark(${palette.neutral950}, ${palette.neutral50})`,
    textSecondary: `light-dark(${palette.neutral600}, ${palette.neutral400})`,
    accent: `light-dark(${palette.mars700}, ${palette.mars400})`,
    accentHover: `light-dark(${palette.mars600}, ${palette.mars300})`,
    textOnAccent: `light-dark(${palette.white}, ${palette.neutral950})`,
    focusRing: `light-dark(${palette.mars600}, ${palette.mars300})`,
  },
  font: {
    sizeSmall: "10.5pt",
    sizeBody: "12pt",
    sizeLarge: "15pt",
    sizeHeadingSmall: "24pt",
    sizeHeadingMedium: "33pt",
    sizeHeadingLarge: "42pt",
    weightRegular: "400",
    weightMedium: "500",
    weightBold: "700",
    familySans: "var(--font-geist-sans), system-ui, sans-serif",
    familyMono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  sizes: {
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
    radius: { small: "6px", medium: "12px", large: "20px", full: "9999px" },
    icon: { small: "16px", medium: "20px" },
  },
  motion: {
    durationFast: "150ms",
    easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
  },
  shadows: {
    card: "0 8px 24px light-dark(rgb(16 18 24 / 0.08), rgb(0 0 0 / 0.4))",
  },
});

export const media = stylex.defineConsts({
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
});

export const container = stylex.defineConsts({
  cardWide: "@container (min-width: 400px)",
});
