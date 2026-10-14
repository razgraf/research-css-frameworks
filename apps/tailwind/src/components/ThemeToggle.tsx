"use client";

import { Moon, Sun } from "lucide-react";

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
      className="focus-ring grid size-[40px] cursor-pointer place-items-center rounded-full border border-border text-text-primary transition-colors hover:bg-surface-hover [&_svg]:size-icon-medium"
    >
      <Sun className="light:hidden" aria-hidden />
      <Moon className="hidden light:block" aria-hidden />
    </button>
  );
}
