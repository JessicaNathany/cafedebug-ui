"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import type { ThemePref } from "@/lib/theme-constants";

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: ThemePref }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme={initialTheme} enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
