import Link from "next/link";

import { buildEpisodesUrl } from "../episode-list-query";
import { getVisiblePageItems } from "../episode-pagination-items";
import type { EpisodeListResult } from "../types";

type EpisodePaginationProps = Pick<EpisodeListResult, "activeQuery" | "page" | "totalPages">;

const navigationControlClass =
  "inline-flex h-10 items-center justify-center rounded-pill px-4 font-primary text-sm font-medium leading-5 text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const disabledNavigationControlClass =
  "inline-flex h-10 cursor-default items-center justify-center rounded-pill px-4 font-primary text-sm font-medium leading-5 text-foreground";

const activePageClass =
  "inline-flex size-10 items-center justify-center rounded-pill bg-background font-secondary text-sm font-medium leading-5 text-foreground ring-1 ring-inset ring-border shadow-pencil-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const defaultPageClass =
  "inline-flex size-10 items-center justify-center rounded-pill font-secondary text-sm font-medium leading-5 text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function pageHref({ activeQuery, page }: Pick<EpisodePaginationProps, "activeQuery"> & { page: number }) {
  return buildEpisodesUrl({ ...activeQuery, page });
}

export function EpisodePagination({ activeQuery, page, totalPages }: EpisodePaginationProps) {
  if (totalPages < 2) {
    return null;
  }

  return (
    <nav aria-label="Paginação de episódios" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link aria-label="Página anterior" className={navigationControlClass} href={pageHref({ activeQuery, page: page - 1 })}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" aria-label="Página anterior indisponível" className={disabledNavigationControlClass}>
          Previous
        </span>
      )}
      {getVisiblePageItems(page, totalPages).map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span aria-hidden="true" className="inline-flex size-10 items-center justify-center font-secondary text-sm font-medium leading-5 text-foreground" key={`ellipsis-${index}`}>
              …
            </span>
          );
        }

        const pageNumber = item;
        const isCurrentPage = pageNumber === page;
        return (
          <Link
            aria-current={isCurrentPage ? "page" : undefined}
            aria-label={`Página ${pageNumber}`}
            className={isCurrentPage ? activePageClass : defaultPageClass}
            href={pageHref({ activeQuery, page: pageNumber })}
            key={pageNumber}
          >
            {pageNumber}
          </Link>
        );
      })}
      {page < totalPages ? (
        <Link aria-label="Próxima página" className={navigationControlClass} href={pageHref({ activeQuery, page: page + 1 })}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" aria-label="Próxima página indisponível" className={disabledNavigationControlClass}>
          Next
        </span>
      )}
    </nav>
  );
}
