"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useRef, useEffect, useState } from "react";

import { appRoutes } from "@/lib/routes";
import { logger, observabilityEvents } from "@/lib/observability";

import { episodesListDefaultParams } from "./defaults";
import { useEpisodesList } from "./hooks/use-episodes-list";
import { useDebouncedSearch } from "./hooks/use-debounced-search";
import { EpisodesSearchBar } from "./components/episodes-search-bar";
import { EpisodesTable } from "./components/episodes-table";
import { EpisodesPagination } from "./components/episodes-pagination";
import { EpisodesEmptyState } from "./components/episodes-empty-state";
import { EpisodesErrorState } from "./components/episodes-error-state";
import type { AdminRouteError, EpisodesQueryParams } from "./types/episode.types";

const getErrorDetail = (error: unknown): AdminRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as AdminRouteError;
  }

  return {
    status: 500,
    title: "Request failed",
    detail: "Unable to load episodes."
  };
};

export function EpisodesListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(episodesListDefaultParams.page);
  const [pageSize] = useState<number>(episodesListDefaultParams.pageSize);
  const [sortBy] = useState<string>(episodesListDefaultParams.sortBy);
  const [descending] = useState<boolean>(episodesListDefaultParams.descending);
  const previousErrorKeyRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);

  const { searchInput, setSearchInput, debouncedSearch } = useDebouncedSearch(
    searchParams.get("search") ?? ""
  );

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    setPage(1);
  }, [debouncedSearch, router, pathname]);

  const queryParams = useMemo<EpisodesQueryParams>(
    () => ({
      page,
      pageSize,
      sortBy,
      descending,
      ...(debouncedSearch ? { search: debouncedSearch } : {})
    }),
    [page, pageSize, sortBy, descending, debouncedSearch]
  );

  const episodesQuery = useEpisodesList(queryParams);

  const normalizedError = episodesQuery.error
    ? getErrorDetail(episodesQuery.error)
    : null;

  useEffect(() => {
    if (!normalizedError) {
      previousErrorKeyRef.current = null;
      return;
    }

    const errorKey = [
      normalizedError.status,
      normalizedError.title,
      normalizedError.detail,
      normalizedError.traceId ?? "-"
    ].join(":");

    if (previousErrorKeyRef.current === errorKey) return;

    previousErrorKeyRef.current = errorKey;

    logger.warn(observabilityEvents.episodesFetchFailed, {
      module: "episodes",
      action: "list",
      status: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
    });
  }, [normalizedError]);

  const handleRetry = async () => {
    logger.info(observabilityEvents.episodesActionExecuted, {
      module: "episodes",
      action: "retry-fetch"
    });

    await episodesQuery.refetch();
  };

  const items = episodesQuery.data?.items ?? [];
  const showTable = !episodesQuery.isLoading && !normalizedError && items.length > 0;
  const showEmpty = !episodesQuery.isLoading && !normalizedError && items.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[32px] font-semibold leading-tight text-on-surface">
            Episodes
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Manage, edit, and publish your podcast content.
          </p>
        </div>

        <Link
          className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 font-display text-sm font-medium text-on-primary shadow-ambient transition-colors hover:bg-primary-strong"
          href={appRoutes.newEpisode}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            add
          </span>
          New Episode
        </Link>
      </header>

      <EpisodesSearchBar onChange={setSearchInput} value={searchInput} />

      {episodesQuery.isLoading ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <EpisodesTable isLoading items={[]} />
        </div>
      ) : null}

      {!episodesQuery.isLoading && normalizedError ? (
        <EpisodesErrorState error={normalizedError} onRetry={handleRetry} />
      ) : null}

      {showEmpty ? (
        <EpisodesEmptyState
          onClearSearch={() => setSearchInput("")}
          searchTerm={debouncedSearch}
        />
      ) : null}

      {showTable ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <EpisodesTable isLoading={false} items={items} />

          <EpisodesPagination
            hasPrevious={episodesQuery.data?.hasPrevious ?? false}
            hasNext={episodesQuery.data?.hasNext ?? false}
            isFetching={episodesQuery.isFetching}
            onNext={() => setPage((previous) => previous + 1)}
            onPrevious={() => setPage((previous) => Math.max(1, previous - 1))}
            page={episodesQuery.data?.page ?? page}
            pageSize={pageSize}
            totalCount={episodesQuery.data?.totalCount ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}
