"use client";

import * as stylex from "@stylexjs/stylex";
import { Moon, Sun } from "lucide-react";
import { mixins } from "@/theme/mixins";
import { colors, iconSize, motion, radius } from "@/theme/tokens.stylex";

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
      {...stylex.props(mixins.focusRing, styles.toggle)}
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
    borderColor: colors.border,
    borderRadius: radius.full,
    backgroundColor: { default: "transparent", ":hover": colors.surfaceHover },
    color: colors.textPrimary,
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: motion.durationFast,
    transitionTimingFunction: motion.easingStandard,
  },
  icon: { width: iconSize.medium, height: iconSize.medium },
  sun: { display: { default: "block", [stylex.when.ancestor('[data-theme="light"]')]: "none" } },
  moon: { display: { default: "none", [stylex.when.ancestor('[data-theme="light"]')]: "block" } },
});
