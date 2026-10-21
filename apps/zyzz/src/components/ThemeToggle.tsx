"use client";

import { Moon, Sun } from "lucide-react";
import { cx } from "zyzz";
import { appearance, focusRing, style, vars } from "@/theme";

function toggleTheme() {
  const { colorScheme } = appearance.get();
  const dark =
    colorScheme === "dark" ||
    (colorScheme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  appearance.set({ colorScheme: dark ? "light" : "dark" });
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      {...cx(focusRing(), styles.toggle())}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun {...styles.sun()} aria-hidden />
      <Moon {...styles.moon()} aria-hidden />
    </button>
  );
}

// zyzz has no dark/light condition. The scheme classes that `appearance` sets on <html> are the
// only hook, plus the OS preference while the scheme is still "light dark".
namespace styles {
  export const toggle = style({
    backgroundColor: "transparent !custom",
    borderColor: "border",
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "1px",
    color: "textPrimary",
    cursor: "pointer",
    display: "grid",
    height: "40px !custom",
    placeItems: "center",
    transition: `background-color ${vars.duration.fast} ${vars.ease.standard}`,
    width: "40px !custom",
    ":hover": { backgroundColor: "surfaceHover" },
    selectors: { "& svg": { height: vars.iconSize.medium, width: vars.iconSize.medium } },
  });

  export const sun = style({
    selectors: {
      ".z_scheme-light &": { display: "none" },
      ".z_scheme-light-dark &": { "@media (prefers-color-scheme: light)": { display: "none" } },
    },
  });

  export const moon = style({
    selectors: {
      ".z_scheme-dark &": { display: "none" },
      ".z_scheme-light-dark &": { "@media (prefers-color-scheme: dark)": { display: "none" } },
    },
  });
}
