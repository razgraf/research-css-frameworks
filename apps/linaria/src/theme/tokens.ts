export const mars = {
  300: "#f4a37e",
  400: "#ee7d4f",
  500: "#e2612e",
  600: "#c24e1f",
  700: "#9a3c17",
} as const;

export const color = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  surfaceHover: "var(--color-surface-hover)",
  border: "var(--color-border)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  accent: "var(--color-accent)",
  accentHover: "var(--color-accent-hover)",
  textOnAccent: "var(--color-text-on-accent)",
  focusRing: "var(--color-focus-ring)",
} as const;

export const shadow = { card: "var(--shadow-card)" } as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
} as const;

export const radius = { small: "6px", medium: "12px", large: "20px", full: "9999px" } as const;

export const font = {
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
} as const;

export const motion = {
  durationFast: "150ms",
  easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

export const iconSize = { small: "16px", medium: "20px" } as const;
