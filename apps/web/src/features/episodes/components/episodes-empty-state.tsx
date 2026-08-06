import Link from "next/link";

import type { EpisodeListActiveQuery } from "../types";

export function EpisodesEmptyState({ activeQuery }: { activeQuery: EpisodeListActiveQuery }) {
  const detail = activeQuery.q ? ` para “${activeQuery.q}”` : activeQuery.category ? " nesta categoria" : "";

  return (
    <section aria-labelledby="empty-episodes-title" className="grid min-h-72 content-center justify-items-center gap-4 rounded-m bg-card p-6 text-center ring-1 ring-inset ring-border">
      <p className="font-primary text-xs font-semibold tracking-widest text-primary">CATÁLOGO</p>
      <h2 className="font-secondary text-2xl font-bold" id="empty-episodes-title">
        Nenhum episódio encontrado
      </h2>
      <p className="max-w-lg font-secondary text-sm leading-relaxed text-muted-foreground">Não encontramos episódios{detail}. Tente outra busca ou limpe os filtros.</p>
      <Link className="inline-flex h-10 items-center justify-center rounded-pill bg-primary px-4 font-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
        Limpar filtros
      </Link>
    </section>
  );
}
