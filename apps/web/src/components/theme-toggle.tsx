"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { THEME_COOKIE, type ThemePref } from "@/lib/theme-constants";

export function ThemeToggle({ initialTheme }: { initialTheme: ThemePref }) {
  const { resolvedTheme, setTheme } = useTheme();
  const serverResolvedTheme = initialTheme === "light" ? "light" : "dark";
  const isDark = (resolvedTheme ?? serverResolvedTheme) === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.cookie = `${THEME_COOKIE}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setTheme(nextTheme);
  }

  return (
    <Button
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className="text-muted-foreground"
      onClick={toggleTheme}
      size="icon"
      variant="secondary"
    >
      {isDark ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </Button>
  );
}
