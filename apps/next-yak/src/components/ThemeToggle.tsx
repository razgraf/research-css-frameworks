"use client";

import { Moon, Sun } from "lucide-react";
import { styled } from "next-yak";
import { focusRing } from "@/theme/mixins";
import { color, iconSize, motion, radius } from "@/theme/tokens";

const Toggle = styled.button`
  ${focusRing};
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${color.border};
  border-radius: ${radius.full};
  background: transparent;
  color: ${color.textPrimary};
  cursor: pointer;
  transition: background-color ${motion.durationFast} ${motion.easingStandard};

  &:hover {
    background: ${color.surfaceHover};
  }

  & svg {
    width: ${iconSize.medium};
    height: ${iconSize.medium};
  }

  :root[data-theme="light"] & .sun,
  :root:not([data-theme="light"]) & .moon {
    display: none;
  }
`;

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}

export function ThemeToggle() {
  return (
    <Toggle onClick={toggleTheme} aria-label="Toggle theme">
      <Sun className="sun" aria-hidden />
      <Moon className="moon" aria-hidden />
    </Toggle>
  );
}
