"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function EpisodesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="w-full bg-background px-4 py-16 text-foreground sm:px-6 md:px-10 lg:px-16">
      <section aria-labelledby="episodes-error-title" className="mx-auto grid w-full max-w-xl gap-4 rounded-m bg-card p-6 ring-1 ring-inset ring-border">
        <p className="font-primary text-xs font-semibold tracking-widest text-primary">EPISÓDIOS</p>
        <h1 className="font-secondary text-2xl font-bold" id="episodes-error-title">
          Não foi possível carregar os episódios
        </h1>
        <p className="font-secondary text-sm leading-relaxed text-muted-foreground">Tente novamente ou volte ao catálogo para continuar navegando.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Tentar novamente</Button>
          <Link className="inline-flex h-10 items-center justify-center rounded-pill border border-border bg-background px-4 font-primary text-sm font-medium text-foreground hover:bg-secondary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
            Voltar ao catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
