import Link from "next/link";

import {
  ADMIN_SHELL_NAV_ITEMS,
  isAdminShellNavItemActive,
  resolveAdminShellNavInteraction
} from "./admin-shell-nav-items.js";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

type AdminShellSidebarProps = {
  pathname: string;
  currentTheme: "light" | "dark";
};

type AdminShellNavItemProps = {
  href: string;
  label: string;
  icon: string;
  disabled: boolean;
  statusLabel?: string;
  pathname: string;
};

const navItemBaseClassName =
  "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm";

function AdminShellNavItem({
  href,
  label,
  icon,
  disabled,
  statusLabel,
  pathname
}: AdminShellNavItemProps) {
  const isActive = isAdminShellNavItemActive({ href, label, disabled }, pathname);
  const navInteraction = resolveAdminShellNavInteraction({ href, label, disabled });
  const navItemClassName = [
    navItemBaseClassName,
    isActive
      ? "border-l-2 border-primary bg-nav-active-surface font-semibold text-primary"
      : "text-on-surface",
    navInteraction.interactive
      ? "transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      : "cursor-not-allowed opacity-60"
  ].join(" ");

  const iconClassName = [
    "material-symbols-outlined text-[20px] leading-none",
    isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
  ].join(" ");

  const iconStyle = isActive && label === "Episodes"
    ? ({ fontVariationSettings: "'FILL' 1" } as const)
    : undefined;
  const statusLabelClassName = navInteraction.interactive
    ? "ml-auto shrink-0 whitespace-nowrap rounded-full border border-outline-variant/60 bg-surface-container-low px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-on-surface-variant"
    : "ml-auto shrink-0 whitespace-nowrap rounded-full border border-outline-variant/50 bg-surface-container-low px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/90";

  if (!navInteraction.interactive) {
    return (
      <span
        aria-current={isActive ? "page" : undefined}
        aria-disabled={navInteraction.ariaDisabled}
        aria-label={`${label}. Navigation disabled in this milestone.`}
        className={navItemClassName}
        role="link"
        tabIndex={navInteraction.tabIndex}
      >
        <span aria-hidden="true" className={iconClassName} style={iconStyle}>
          {icon}
        </span>
        <span className="font-body text-sm font-medium">{label}</span>
        {statusLabel ? (
          <span className={statusLabelClassName}>
            {statusLabel}
          </span>
        ) : null}
        <span className="sr-only">
          Navigation disabled in V1. Route remains directly accessible.
        </span>
      </span>
    );
  }

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={navItemClassName}
      href={href}
    >
      <span aria-hidden="true" className={iconClassName} style={iconStyle}>
        {icon}
      </span>
      <span className="font-body text-sm font-medium">{label}</span>
      {statusLabel ? (
        <span className={statusLabelClassName}>
          {statusLabel}
        </span>
      ) : null}
    </Link>
  );
}

export function AdminShellSidebar({ pathname, currentTheme }: AdminShellSidebarProps) {
  return (
    <aside className="w-full shrink-0 border-b border-outline-variant/60 bg-surface-container-lowest md:h-screen md:w-60 md:border-b-0 md:border-r md:sticky md:top-0">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                mic
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h1 className="font-display text-base font-bold leading-tight text-on-surface">
                Café Debug
              </h1>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Admin
              </p>
            </div>
            <ThemeToggle currentTheme={currentTheme} />
          </div>

          <nav aria-label="Admin primary" className="flex flex-col gap-1">
            {ADMIN_SHELL_NAV_ITEMS.map((item) => (
              <AdminShellNavItem key={item.href} {...item} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div className="mt-6 border-t border-outline-variant/60 px-2 pt-4">
          <UserMenu
            userName="Jéssica Nathany"
            email="jessica@cafedebug.com"
            initials="JN"
          />
        </div>
      </div>
    </aside>
  );
}
