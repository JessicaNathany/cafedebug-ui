import Link from "next/link";
import { Mic, Search } from "lucide-react";

import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-header text-header-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link className="font-mono text-xl font-bold" href="/">
            Café<span className="text-primary">Debug</span>
          </Link>
          <Nav />
        </div>

        <div className="flex items-center gap-2">
          <Button aria-label="Pesquisar" className="hidden md:inline-flex" size="icon" variant="secondary">
            <Search aria-hidden size={16} />
          </Button>
          <Button className="hidden md:inline-flex" variant="primary">
            <Mic aria-hidden size={16} />
            Assinar
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
