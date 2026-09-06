import { EpisodeCard } from "./episode-card";
import { EpisodeBreadcrumb } from "./episode-breadcrumb";
import { EpisodeCategoryFilters } from "./episode-category-filters";
import { EpisodePagination } from "./episode-pagination";
import { EpisodeSearchForm } from "./episode-search-form";
import { EpisodeSortSelector } from "./episode-sort-selector";
import { EpisodesEmptyState } from "./episodes-empty-state";
import type { EpisodeListResult } from "../types";

export function EpisodesListPage({ result }: { result: EpisodeListResult }) {
  const { activeQuery, items, page, totalItems, totalPages } = result;

  return (
    <main className="w-full bg-background px-4 pb-20 pt-14 text-foreground sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1312px] gap-10 lg:w-[calc(100vw-8rem)]">
        <div className="sr-only">
          <EpisodeBreadcrumb />
        </div>
        <header className="grid min-h-40 max-w-3xl gap-3">
          <p className="font-primary text-xs font-semibold tracking-widest text-primary">PODCAST</p>
          <h1 className="font-secondary text-4xl font-bold leading-tight text-foreground sm:text-5xl">Episódios</h1>
          <p className="font-secondary text-base leading-relaxed text-muted-foreground">Mais de 140 episódios para maratonar, aprender e se inspirar.</p>
        </header>
        <section aria-label="Busca e filtros" className="grid gap-11">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 lg:w-full lg:max-w-130">
              <EpisodeSearchForm activeQuery={activeQuery} />
            </div>
            <EpisodeSortSelector activeQuery={activeQuery} />
          </div>
          <EpisodeCategoryFilters activeQuery={activeQuery} />
        </section>
        <section aria-labelledby="episodes-results-title" className="grid gap-10">
          <div className="sr-only">
            <h2 id="episodes-results-title">Episódios do CaféDebug</h2>
            <p aria-live="polite">
              {totalItems === 0 ? "Nenhum episódio encontrado" : `${totalItems} ${totalItems === 1 ? "episódio encontrado" : "episódios encontrados"}${totalPages > 1 ? ` · Página ${page} de ${totalPages}` : ""}`}
            </p>
          </div>
          {items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((episode) => (
                <EpisodeCard episode={episode} key={episode.slug} />
              ))}
            </div>
          ) : (
            <EpisodesEmptyState activeQuery={activeQuery} />
          )}
          {totalPages > 1 ? (
            <div className="flex h-16 items-end justify-center">
              <EpisodePagination activeQuery={activeQuery} page={page} totalPages={totalPages} />
            </div>
          ) : (
            <EpisodePagination activeQuery={activeQuery} page={page} totalPages={totalPages} />
          )}
        </section>
      </div>
    </main>
  );
}
