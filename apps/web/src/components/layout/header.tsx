import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="bg-header text-header-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="font-mono text-lg font-bold" href="/">Café<span className="text-primary">Debug</span></Link>
        <nav aria-label="Navegação principal" className="flex items-center gap-5 text-sm">
          <Link href="/">Início</Link>
          <Link href="/#episodios">Episódios</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
