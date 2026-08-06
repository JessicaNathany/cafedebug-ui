import Link from "next/link";
import { Mic, Search } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Nav } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { ThemePref } from "@/lib/theme-constants";
import { cn } from "@/lib/utils";

type FixedDarkHeaderProps = {
  initialTheme?: never;
  variant?: "fixed-dark";
};

type BetaHeaderProps = {
  initialTheme: ThemePref;
  variant: "beta";
};

export type HeaderProps = BetaHeaderProps | FixedDarkHeaderProps;

export function SubscriptionAction() {
  return (
    <Button className="gap-2 px-4.5 font-secondary font-semibold" variant="primary">
      <Mic aria-hidden size={16} />
      Assinar
    </Button>
  );
}

export function Header(props: HeaderProps = {}) {
  const isBeta = props.variant === "beta";

  return (
    <header className={cn(!isBeta && "dark", "relative h-18 border-b border-border bg-background text-foreground")}>
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 md:px-10">
        <div className="flex min-w-0 items-center gap-3 lg:gap-10">
          <Link className="inline-flex h-10 shrink-0 items-center font-primary text-xl font-bold leading-none text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/">
            Café<span className="text-primary">Debug</span>
          </Link>
          <MobileNav />
          <Nav />
        </div>

        <div className="flex shrink-0 items-center gap-3.5">
          <Button aria-label="Pesquisar" className="inline-flex" size="icon" variant="secondary">
            <Search aria-hidden className="text-muted-foreground" size={18} />
          </Button>
          {isBeta ? <ThemeToggle initialTheme={props.initialTheme} /> : <SubscriptionAction />}
        </div>
      </div>
    </header>
  );
}
