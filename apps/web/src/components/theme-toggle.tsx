"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { THEME_COOKIE } from "@/lib/theme-constants";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.cookie = `${THEME_COOKIE}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setTheme(nextTheme);
  }

  return (
    <button aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"} className="rounded-pill bg-secondary p-2 text-secondary-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={toggleTheme} type="button">
      {isDark ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </button>
  );
}
