"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayerProvider } from "@/features/player/player-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </ThemeProvider>
  );
}
