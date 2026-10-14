"use client";

import { Moon, Sun } from "lucide-react";
import { css } from "styled-system/css";
import { focusRing } from "@/theme/mixins";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}

export function ThemeToggle() {
  return (
    <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className={styles.toggle}>
      <Sun aria-hidden className={styles.sun} />
      <Moon aria-hidden className={styles.moon} />
    </button>
  );
}

const styles = {
  toggle: css(focusRing, {
    display: "grid",
    placeItems: "center",
    width: "[40px]",
    height: "[40px]",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "full",
    bg: "transparent",
    color: "text.primary",
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    _hover: { bg: "surface.hover" },
    "& svg": { width: "iconMedium", height: "iconMedium" },
  }),
  sun: css({ _light: { display: "none" } }),
  moon: css({ display: "none", _light: { display: "block" } }),
};
