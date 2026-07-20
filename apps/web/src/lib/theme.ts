import { cookies } from "next/headers";

import { DEFAULT_THEME, THEME_COOKIE, type ThemePref } from "./theme-constants";

export { DEFAULT_THEME, THEME_COOKIE, type ThemePref } from "./theme-constants";

export function resolveThemePref(value: string | undefined): ThemePref {
  return value === "light" || value === "dark" || value === "system" ? value : DEFAULT_THEME;
}

export async function getThemePref(): Promise<ThemePref> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return resolveThemePref(value);
}

export function resolveInitialThemeClass(theme: ThemePref): "" | "dark" {
  return theme === "light" ? "" : "dark";
}

export function resolveInitialThemeClassFromCookie(value: string | undefined): "" | "dark" {
  return resolveInitialThemeClass(resolveThemePref(value));
}
