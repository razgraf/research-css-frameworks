import { css } from "@linaria/core";
import { color, font } from "./tokens";

export const globals = css`
  :global() {
    :root {
      --neutral-950: #0b0d12;
      --neutral-900: #12151c;
      --neutral-800: #1c2029;
      --neutral-700: #2a2f3a;
      --neutral-600: #4a5060;
      --neutral-400: #8a90a0;
      --neutral-200: #d5d8e0;
      --neutral-100: #eceef2;
      --neutral-50: #f7f8fa;
      --white: #ffffff;
      --mars-300: #f4a37e;
      --mars-400: #ee7d4f;
      --mars-500: #e2612e;
      --mars-600: #c24e1f;
      --mars-700: #9a3c17;

      color-scheme: dark;
      --color-background: var(--neutral-950);
      --color-surface: var(--neutral-900);
      --color-surface-hover: var(--neutral-800);
      --color-border: var(--neutral-700);
      --color-text-primary: var(--neutral-50);
      --color-text-secondary: var(--neutral-400);
      --color-accent: var(--mars-400);
      --color-accent-hover: var(--mars-300);
      --color-text-on-accent: var(--neutral-950);
      --color-focus-ring: var(--mars-300);
      --shadow-card: 0 8px 24px rgb(0 0 0 / 0.4);
    }

    :root[data-theme="light"] {
      color-scheme: light;
      --color-background: var(--neutral-50);
      --color-surface: var(--white);
      --color-surface-hover: var(--neutral-100);
      --color-border: var(--neutral-200);
      --color-text-primary: var(--neutral-950);
      --color-text-secondary: var(--neutral-600);
      --color-accent: var(--mars-700);
      --color-accent-hover: var(--mars-600);
      --color-text-on-accent: var(--white);
      --color-focus-ring: var(--mars-600);
      --shadow-card: 0 8px 24px rgb(16 18 24 / 0.08);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: ${color.background};
      color: ${color.textPrimary};
      font-family: ${font.familySans};
      font-size: ${font.sizeBody};
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    button {
      font: inherit;
      color: inherit;
    }
  }
`;
