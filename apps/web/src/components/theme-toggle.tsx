"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
    <Button aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"} onClick={toggleTheme} size="icon" variant="secondary">
      {isDark ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </Button>
  );
}
