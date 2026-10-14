import { defineConfig } from "@pandacss/dev";
import { buttonRecipe } from "./src/theme/button.recipe";

export default defineConfig({
  presets: ["@pandacss/preset-base"],
  preflight: false,
  strictTokens: true,
  include: ["./src/**/*.{ts,tsx}"],
  outdir: "styled-system",
  jsxFramework: "react",

  conditions: {
    extend: { light: '[data-theme="light"] &' },
  },

  globalCss: {
    ":root": { colorScheme: "dark" },
    ':root[data-theme="light"]': { colorScheme: "light" },
    "*, *::before, *::after": { boxSizing: "border-box" },
    body: {
      margin: "0",
      bg: "background",
      color: "text.primary",
      fontFamily: "sans",
      fontSize: "body",
      lineHeight: "[1.5]",
      WebkitFontSmoothing: "antialiased",
    },
    button: { font: "inherit", color: "inherit" },
  },

  theme: {
    breakpoints: { sm: "640px", md: "768px", lg: "1024px" },
    containers: { cardWide: "400px" },
    tokens: {
      colors: {
        neutral: {
          950: { value: "#0b0d12" },
          900: { value: "#12151c" },
          800: { value: "#1c2029" },
          700: { value: "#2a2f3a" },
          600: { value: "#4a5060" },
          400: { value: "#8a90a0" },
          200: { value: "#d5d8e0" },
          100: { value: "#eceef2" },
          50: { value: "#f7f8fa" },
        },
        white: { value: "#ffffff" },
        transparent: { value: "transparent" },
        mars: {
          300: { value: "#f4a37e" },
          400: { value: "#ee7d4f" },
          500: { value: "#e2612e" },
          600: { value: "#c24e1f" },
          700: { value: "#9a3c17" },
        },
      },
      spacing: {
        0: { value: "0" },
        1: { value: "4px" },
        2: { value: "8px" },
        3: { value: "12px" },
        4: { value: "16px" },
        6: { value: "24px" },
        8: { value: "32px" },
        12: { value: "48px" },
        16: { value: "64px" },
      },
      sizes: {
        iconSmall: { value: "16px" },
        iconMedium: { value: "20px" },
        page: { value: "1152px" },
      },
      radii: {
        small: { value: "6px" },
        medium: { value: "12px" },
        large: { value: "20px" },
        full: { value: "9999px" },
      },
      fontSizes: {
        small: { value: "10.5pt" },
        body: { value: "12pt" },
        large: { value: "15pt" },
        headingSmall: { value: "24pt" },
        headingMedium: { value: "33pt" },
        headingLarge: { value: "42pt" },
      },
      fontWeights: {
        regular: { value: "400" },
        medium: { value: "500" },
        bold: { value: "700" },
      },
      fonts: {
        sans: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        mono: { value: "var(--font-geist-mono), ui-monospace, monospace" },
      },
      durations: { fast: { value: "150ms" } },
      easings: { standard: { value: "cubic-bezier(0.2, 0, 0, 1)" } },
    },
    semanticTokens: {
      colors: {
        background: { value: { base: "{colors.neutral.950}", _light: "{colors.neutral.50}" } },
        surface: {
          DEFAULT: { value: { base: "{colors.neutral.900}", _light: "{colors.white}" } },
          hover: { value: { base: "{colors.neutral.800}", _light: "{colors.neutral.100}" } },
        },
        border: { value: { base: "{colors.neutral.700}", _light: "{colors.neutral.200}" } },
        text: {
          primary: { value: { base: "{colors.neutral.50}", _light: "{colors.neutral.950}" } },
          secondary: { value: { base: "{colors.neutral.400}", _light: "{colors.neutral.600}" } },
          onAccent: { value: { base: "{colors.neutral.950}", _light: "{colors.white}" } },
        },
        accent: {
          DEFAULT: { value: { base: "{colors.mars.400}", _light: "{colors.mars.700}" } },
          hover: { value: { base: "{colors.mars.300}", _light: "{colors.mars.600}" } },
        },
        focusRing: { value: { base: "{colors.mars.300}", _light: "{colors.mars.600}" } },
      },
      shadows: {
        card: {
          value: { base: "0 8px 24px rgb(0 0 0 / 0.4)", _light: "0 8px 24px rgb(16 18 24 / 0.08)" },
        },
      },
    },
    layerStyles: {
      surface: {
        value: {
          bg: "surface",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border",
          borderRadius: "large",
          boxShadow: "card",
        },
      },
    },
    recipes: { button: buttonRecipe },
  },
});
