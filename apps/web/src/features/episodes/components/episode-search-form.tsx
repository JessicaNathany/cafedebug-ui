import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { EpisodeListActiveQuery } from "../types";

export function EpisodeSearchForm({ activeQuery }: { activeQuery: EpisodeListActiveQuery }) {
  return (
    <form action="/episodes" aria-label="Buscar episódios" className="flex w-full min-w-0 flex-col gap-3 sm:flex-row" method="get" role="search">
      {activeQuery.category ? <input name="categoria" type="hidden" value={activeQuery.category} /> : null}
      {activeQuery.sort ? <input name="ordenar" type="hidden" value={activeQuery.sort} /> : null}
      <label className="sr-only" htmlFor="episode-search">
        Buscar episódios, convidados ou temas
      </label>
      <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-pill border border-border bg-card px-4">
        <Search aria-hidden className="shrink-0 text-muted-foreground" size={18} />
        <input
          className="min-w-0 flex-1 bg-transparent font-secondary text-sm text-foreground outline-none placeholder:text-muted-foreground"
          defaultValue={activeQuery.q}
          id="episode-search"
          maxLength={100}
          name="q"
          placeholder="Buscar episódios, convidados ou temas…"
          type="search"
        />
      </div>
      <Button className="h-12 px-5 lg:sr-only" type="submit">
        Buscar
      </Button>
    </form>
  );
}
