"use client";

import { Moon, Sun } from "lucide-react";
import { stylex, theme } from "@/theme/index.stylex";
import { mixins } from "@/theme/mixins";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      sx={[mixins.focusRing, styles.toggle]}
    >
      <Sun aria-hidden {...stylex.props(styles.icon, styles.sun)} />
      <Moon aria-hidden {...stylex.props(styles.icon, styles.moon)} />
    </button>
  );
}

const styles = stylex.create({
  toggle: {
    display: "grid",
    placeItems: "center",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    borderRadius: theme.sizes.radius.full,
    backgroundColor: { default: "transparent", ":hover": theme.colors.surfaceHover },
    color: theme.colors.textPrimary,
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: theme.motion.durationFast,
    transitionTimingFunction: theme.motion.easingStandard,
  },
  icon: { width: theme.sizes.icon.medium, height: theme.sizes.icon.medium },
  sun: { display: { default: "block", [stylex.when.ancestor('[data-theme="light"]')]: "none" } },
  moon: { display: { default: "none", [stylex.when.ancestor('[data-theme="light"]')]: "block" } },
});
