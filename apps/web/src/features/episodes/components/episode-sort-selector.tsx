import { Check, ChevronDown } from "lucide-react";

import { buildEpisodesUrl } from "../episode-list-query";
import { episodeSortOptions } from "../types";
import type { EpisodeListActiveQuery } from "../types";

export function EpisodeSortSelector({ activeQuery }: { activeQuery: EpisodeListActiveQuery }) {
  const selectedSort = activeQuery.sort ?? "recentes";
  const selectedOption = episodeSortOptions.find((option) => option.key === selectedSort) ?? episodeSortOptions[0];
  const retainedQuery = {
    ...(activeQuery.q === undefined ? {} : { q: activeQuery.q }),
    ...(activeQuery.category === undefined ? {} : { category: activeQuery.category })
  };

  return (
    <details className="group relative w-full shrink-0 lg:w-fit">
      <summary aria-label={`Ordenar episódios: ${selectedOption.label}`} className="flex h-[50px] cursor-pointer list-none items-center gap-2 rounded-pill border border-border bg-card px-[18px] font-secondary text-[15px] text-muted-foreground hover:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span>Ordenar:</span>
        <span className="font-semibold text-foreground">{selectedOption.label}</span>
        <ChevronDown aria-hidden className="ml-auto shrink-0 transition-transform group-open:rotate-180 lg:ml-0" size={18} />
      </summary>
      <ul aria-label="Opções de ordenação" className="absolute right-0 z-20 mt-2 grid w-full min-w-56 gap-1 rounded-m border border-border bg-popover p-2 shadow-float">
        {episodeSortOptions.map((option) => {
          const selected = option.key === selectedSort;
          const href = option.key === "recentes" ? buildEpisodesUrl(retainedQuery) : buildEpisodesUrl({ ...retainedQuery, sort: option.key });
          return (
            <li key={option.key}>
              <a
                aria-current={selected ? "true" : undefined}
                aria-label={`Ordenar episódios por ${option.label}`}
                className={selected ? "flex h-10 items-center justify-between rounded-m bg-secondary px-3 font-secondary text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" : "flex h-10 items-center justify-between rounded-m px-3 font-secondary text-sm text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"}
                href={href}
              >
                {option.label}
                {selected ? <Check aria-hidden size={16} /> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
