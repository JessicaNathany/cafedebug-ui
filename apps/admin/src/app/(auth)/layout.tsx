import type { ReactNode } from "react";

import { ThemeToggle } from "@/features/admin-shell/theme-toggle";
import { getThemeCookie, resolveDataTheme } from "@/lib/auth/theme";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const theme = await getThemeCookie();
  const currentTheme = resolveDataTheme(theme);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-surface">
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 backdrop-blur-md">
          <span className="font-display text-xl font-bold tracking-tight text-on-surface">
            Café Debug
          </span>
          <ThemeToggle currentTheme={currentTheme} />
        </header>

        <main className="relative flex flex-grow items-center justify-center overflow-hidden p-6">
          {/* Decorative ambient background tuned to match the light login reference */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div className="absolute -left-[14%] -top-[14%] h-[52%] w-[52%] rounded-full bg-auth-ambient-strong/55 blur-3xl" />
            <div className="absolute -bottom-[14%] -right-[14%] h-[52%] w-[52%] rounded-full bg-auth-ambient-soft blur-3xl" />
          </div>

          <div className="relative z-10 w-full">
            {children}
          </div>
        </main>

        <footer className="flex flex-col items-center gap-4 py-8">
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
            >
              Support
            </a>
          </div>
          <p className="text-xs text-on-surface-variant">
            © 2026 Café Debug Admin. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
