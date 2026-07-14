"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { logger, observabilityEvents } from "@/lib/observability";
import { trackApiFailure } from "@/lib/observability/telemetry";
import { appRoutes } from "@/lib/routes";

import { bannersListDefaultParams } from "./defaults";
import { BannersEmptyState } from "./components/banners-empty-state";
import { BannersErrorState } from "./components/banners-error-state";
import { BannersPagination } from "./components/banners-pagination";
import { BannersSearchBar } from "./components/banners-search-bar";
import { BannersTable } from "./components/banners-table";
import { useBannersList } from "./hooks/use-banners-list";
import { useDebouncedBannerSearch } from "./hooks/use-debounced-banner-search";
import type { BannerRouteError, BannersQueryParams } from "./types/banner.types";

const getErrorDetail = (error: unknown): BannerRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as BannerRouteError;
  }

  return {
    status: 500,
    title: "Request failed",
    detail: "Unable to load banners."
  };
};

export function BannersListPage() {
  const router = useRouter();
  const [page, setPage] = useState<number>(bannersListDefaultParams.page);
  const [pageSize] = useState<number>(bannersListDefaultParams.pageSize);
  const [sortBy] = useState<string>(bannersListDefaultParams.sortBy);
  const [descending] = useState<boolean>(bannersListDefaultParams.descending);
  const previousErrorKeyRef = useRef<string | null>(null);

  const queryParams = useMemo<BannersQueryParams>(
    () => ({ page, pageSize, sortBy, descending }),
    [page, pageSize, sortBy, descending]
  );

  const bannersQuery = useBannersList(queryParams);
  const { searchInput, setSearchInput, searchTerm, filteredItems } = useDebouncedBannerSearch(
    bannersQuery.data?.items ?? []
  );

  const normalizedError = bannersQuery.error ? getErrorDetail(bannersQuery.error) : null;

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

    if (previousErrorKeyRef.current === errorKey) {
      return;
    }

    previousErrorKeyRef.current = errorKey;

    trackApiFailure({
      module: "banners",
      action: "list",
      endpoint: "/api/admin/banners",
      method: "GET",
      error: normalizedError,
      fallbackStatus: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
    });
  }, [normalizedError]);

  const handleRetry = async () => {
    logger.info(observabilityEvents.bannersActionExecuted, {
      module: "banners",
      action: "retry-fetch"
    });

    await bannersQuery.refetch();
  };

  const showTable = !bannersQuery.isLoading && !normalizedError && filteredItems.length > 0;
  const showEmpty = !bannersQuery.isLoading && !normalizedError && filteredItems.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[32px] font-semibold leading-tight text-on-surface">
            Banners
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Manage, edit, and publish your banner content.
          </p>
        </div>

        <Link
          className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 font-display text-sm font-medium text-on-primary shadow-ambient transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href={appRoutes.newBanner}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            add
          </span>
          New Banner
        </Link>
      </header>

      <BannersSearchBar onChange={setSearchInput} value={searchInput} />

      {bannersQuery.isLoading ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <BannersTable isLoading items={[]} onRowSelect={() => undefined} />
        </div>
      ) : null}

      {!bannersQuery.isLoading && normalizedError ? (
        <BannersErrorState error={normalizedError} onRetry={() => void handleRetry()} />
      ) : null}

      {showEmpty ? (
        <BannersEmptyState onClearSearch={() => setSearchInput("")} searchTerm={searchTerm} />
      ) : null}

      {showTable ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <BannersTable
            isLoading={false}
            items={filteredItems}
            onRowSelect={(id) => router.push(appRoutes.editBanner(String(id)))}
          />

          <BannersPagination
            hasNext={bannersQuery.data?.hasNext ?? false}
            hasPrevious={bannersQuery.data?.hasPrevious ?? false}
            isFetching={bannersQuery.isFetching}
            onNext={() => setPage((previous) => previous + 1)}
            onPrevious={() => setPage((previous) => Math.max(1, previous - 1))}
            page={bannersQuery.data?.page ?? page}
            pageSize={pageSize}
            totalCount={bannersQuery.data?.totalCount ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}
