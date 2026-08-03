export type NavigationItem =
  | { active?: boolean; href: string; label: string }
  | { disabled: true; label: string };

export const primaryNavigationItems: readonly NavigationItem[] = [
  { label: "Início", href: "/", active: true },
  { label: "Episódios", href: "/#episodios" },
  { label: "Time", disabled: true },
  { label: "Sobre", disabled: true }
];
