"use client";

import { Moon, Sun } from "lucide-react";
import * as styles from "./ThemeToggle.css";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}

export function ThemeToggle() {
  return (
    <button type="button" className={styles.toggle} onClick={toggleTheme} aria-label="Toggle theme">
      <Sun className={styles.sun} aria-hidden />
      <Moon className={styles.moon} aria-hidden />
    </button>
  );
}
