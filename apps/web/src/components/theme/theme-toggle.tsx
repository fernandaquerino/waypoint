"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "waypoint-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = getInitialTheme();

    applyTheme(currentTheme);
    setTheme(currentTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
      className="inline-flex min-h-10 items-center gap-2 rounded-control border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-9 items-center rounded-full border border-border bg-surface-muted p-0.5"
      >
        <span
          className={[
            "block h-4 w-4 rounded-full bg-primary transition-transform",
            isDark ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </span>
      {isDark ? "Escuro" : "Claro"}
    </button>
  );
}

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
