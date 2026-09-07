export type NavigationItem =
  | { active?: boolean; href: string; label: string }
  | { disabled: true; label: string };

export const primaryNavigationItems: readonly NavigationItem[] = [
  { label: "Início", href: "/" },
  { label: "Episódios", href: "/episodes" },
  { label: "Time", disabled: true },
  { label: "Sobre", href: "/about" }
];
