"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayerProvider } from "@/features/player/player-provider";
import type { ThemePref } from "@/lib/theme-constants";

export function Providers({ children, initialTheme }: { children: ReactNode; initialTheme: ThemePref }) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <PlayerProvider>{children}</PlayerProvider>
    </ThemeProvider>
  );
}
