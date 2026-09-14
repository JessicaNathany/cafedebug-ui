"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { logger, observabilityEvents } from "@/lib/observability";
import { appRoutes } from "@/lib/routes";

import { usersListDefaultParams } from "./defaults";
import { UsersEmptyState } from "./components/users-empty-state";
import { UsersErrorState } from "./components/users-error-state";
import { UsersPagination } from "./components/users-pagination";
import { UsersSearchBar } from "./components/users-search-bar";
import { UsersTable } from "./components/users-table";
import { useDebouncedUserSearch } from "./hooks/use-debounced-user-search";
import { useUsersList } from "./hooks/use-users-list";
import type { UsersQueryParams, UsersRouteError } from "./types/users.types";

const getErrorDetail = (error: unknown): UsersRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as UsersRouteError;
  }

  return {
    status: 500,
    title: "Request failed",
    detail: "Unable to load users."
  };
};

export function UsersListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(usersListDefaultParams.page);
  const [pageSize] = useState<number>(usersListDefaultParams.pageSize);
  const [sortBy] = useState<string>(usersListDefaultParams.sortBy);
  const [descending] = useState<boolean>(usersListDefaultParams.descending);
  const previousErrorKeyRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);

  const { searchInput, setSearchInput, debouncedSearch } = useDebouncedUserSearch(
    searchParams.get("search") ?? ""
  );

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    setPage(1);
  }, [debouncedSearch, pathname, router]);

  const queryParams = useMemo<UsersQueryParams>(
    () => ({
      page,
      pageSize,
      sortBy,
      descending,
      ...(debouncedSearch ? { search: debouncedSearch } : {})
    }),
    [page, pageSize, sortBy, descending, debouncedSearch]
  );

  const usersQuery = useUsersList(queryParams);
  const normalizedError = usersQuery.error ? getErrorDetail(usersQuery.error) : null;

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

    logger.warn(observabilityEvents.teamMembersFetchFailed, {
      module: "users",
      action: "list",
      status: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
    });
  }, [normalizedError]);

  const handleRetry = async () => {
    logger.info(observabilityEvents.teamMembersActionExecuted, {
      module: "users",
      action: "retry-fetch"
    });

    await usersQuery.refetch();
  };

  const items = usersQuery.data?.items ?? [];
  const showTable = !usersQuery.isLoading && !normalizedError && items.length > 0;
  const showEmpty = !usersQuery.isLoading && !normalizedError && items.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[32px] font-semibold leading-tight text-on-surface">
            Users
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Browse, search, and reopen user records managed by the admin team.
          </p>
        </div>

        <Link
          className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 font-display text-sm font-medium text-on-primary shadow-ambient transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href={appRoutes.newUser}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            add
          </span>
          New User
        </Link>
      </header>

      <UsersSearchBar onChange={setSearchInput} value={searchInput} />

      {usersQuery.isLoading ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <UsersTable isLoading items={[]} onRowSelect={() => undefined} />
        </div>
      ) : null}

      {!usersQuery.isLoading && normalizedError ? (
        <UsersErrorState error={normalizedError} onRetry={() => void handleRetry()} />
      ) : null}

      {showEmpty ? (
        <UsersEmptyState
          onClearSearch={() => setSearchInput("")}
          searchTerm={debouncedSearch}
        />
      ) : null}

      {showTable ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <UsersTable
            isLoading={false}
            items={items}
            onRowSelect={(id) => router.push(appRoutes.editUser(String(id)))}
          />

          <UsersPagination
            hasNext={usersQuery.data?.hasNext ?? false}
            hasPrevious={usersQuery.data?.hasPrevious ?? false}
            isFetching={usersQuery.isFetching}
            onNext={() => setPage((previous) => previous + 1)}
            onPrevious={() => setPage((previous) => Math.max(1, previous - 1))}
            page={usersQuery.data?.page ?? page}
            pageSize={pageSize}
            totalCount={usersQuery.data?.totalCount ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}
