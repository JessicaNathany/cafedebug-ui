import Link from "next/link";

import { buildEpisodesUrl } from "../episode-list-query";
import { episodeCategories } from "../types";
import type { EpisodeListActiveQuery } from "../types";

const filterLinkClass =
  "inline-flex h-10 items-center rounded-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const activeFilterLabelClass =
  "inline-flex h-8 items-center rounded-pill bg-background px-3 font-secondary text-sm font-medium leading-5 text-foreground shadow-pencil-subtle";

const inactiveFilterLabelClass =
  "inline-flex h-8 items-center rounded-pill px-3 font-secondary text-sm font-medium leading-5 text-muted-foreground hover:text-foreground";

export function EpisodeCategoryFilters({ activeQuery }: { activeQuery: EpisodeListActiveQuery }) {
  const retainedQuery = {
    ...(activeQuery.q === undefined ? {} : { q: activeQuery.q }),
    ...(activeQuery.sort === undefined ? {} : { sort: activeQuery.sort })
  };
  const allHref = buildEpisodesUrl(retainedQuery);

  return (
    <nav aria-label="Filtrar episódios por categoria" className="overflow-x-auto pb-1">
      <ul className="flex min-w-max gap-2.5">
        <li>
          <Link
            aria-current={activeQuery.category === undefined ? "page" : undefined}
            className={filterLinkClass}
            href={allHref}
          >
            <span className={activeQuery.category === undefined ? activeFilterLabelClass : inactiveFilterLabelClass}>Todos</span>
          </Link>
        </li>
        {episodeCategories.map((category) => {
          const selected = activeQuery.category === category.key;
          return (
            <li key={category.key}>
              <Link
                aria-current={selected ? "page" : undefined}
                className={filterLinkClass}
                href={buildEpisodesUrl({ ...retainedQuery, category: category.key })}
              >
                <span className={selected ? activeFilterLabelClass : inactiveFilterLabelClass}>{category.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
