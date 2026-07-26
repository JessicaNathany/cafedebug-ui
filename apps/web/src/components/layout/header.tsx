import Link from "next/link";
import { Mic, Search } from "lucide-react";

import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="dark h-18 overflow-x-clip border-b border-border bg-background text-foreground">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 md:w-screen md:px-10">
        <div className="flex min-w-0 items-center gap-10">
          <Link className="shrink-0 font-primary text-xl font-bold leading-none text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/">
            Café<span className="text-primary">Debug</span>
          </Link>
          <Nav />
        </div>

        <div className="flex shrink-0 items-center gap-3.5">
          <Button aria-label="Pesquisar" className="inline-flex" size="icon" variant="secondary">
            <Search aria-hidden className="text-muted-foreground" size={18} />
          </Button>
          <Button className="gap-2 px-4.5 font-secondary font-semibold" variant="primary">
            <Mic aria-hidden size={16} />
            Assinar
          </Button>
        </div>
      </div>
    </header>
  );
}
