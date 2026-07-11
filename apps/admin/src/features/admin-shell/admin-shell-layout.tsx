"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { appRoutes } from "@/lib/routes";

import { AdminShellHeader } from "./admin-shell-header";
import { AdminShellSidebar } from "./admin-shell-sidebar";

type AdminShellLayoutProps = {
  children: ReactNode;
  currentTheme: "light" | "dark";
};

export function AdminShellLayout({ children, currentTheme }: AdminShellLayoutProps) {
  const pathname = usePathname() ?? "/";
  const isEpisodeEditorRoute = pathname === appRoutes.newEpisode || /^\/episodes\/[^/]+\/edit$/.test(pathname);
  const isBannerEditorRoute = pathname === appRoutes.newBanner || /^\/banners\/[^/]+\/edit$/.test(pathname);
  const showShellHeader = !(pathname === appRoutes.episodes || pathname.startsWith("/episodes/") || isBannerEditorRoute);
  const contentClassName = isEpisodeEditorRoute || isBannerEditorRoute
    ? "flex min-h-screen w-full flex-col"
    : "mx-auto flex w-full max-w-[1024px] flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10";

  return (
    <div className="flex min-h-screen">
        <AdminShellSidebar pathname={pathname} currentTheme={currentTheme} />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <section className={contentClassName}>
            {showShellHeader ? <AdminShellHeader pathname={pathname} /> : null}
            {children}
          </section>
        </main>
    </div>
  );
}
