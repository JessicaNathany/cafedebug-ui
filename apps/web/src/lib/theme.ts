import { cookies } from "next/headers";

import { THEME_COOKIE, type ThemePref } from "./theme-constants";

export { THEME_COOKIE, type ThemePref } from "./theme-constants";

export async function getThemePref(): Promise<ThemePref> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return value === "light" || value === "dark" || value === "system" ? value : "dark";
}

export function resolveInitialThemeClass(theme: ThemePref): "" | "dark" {
  return theme === "light" ? "" : "dark";
}
