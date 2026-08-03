"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { logger, observabilityEvents } from "@/lib/observability";
import { appRoutes } from "@/lib/routes";

import { teamMembersListDefaultParams } from "./defaults";
import { TeamMembersEmptyState } from "./components/team-members-empty-state";
import { TeamMembersErrorState } from "./components/team-members-error-state";
import { TeamMembersPagination } from "./components/team-members-pagination";
import { TeamMembersSearchBar } from "./components/team-members-search-bar";
import { TeamMembersTable } from "./components/team-members-table";
import { useDebouncedTeamMemberSearch } from "./hooks/use-debounced-team-member-search";
import { useTeamMembersList } from "./hooks/use-team-members-list";
import type {
  TeamMembersQueryParams,
  TeamMembersRouteError
} from "./types/team-member.types";

const getErrorDetail = (error: unknown): TeamMembersRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as TeamMembersRouteError;
  }

  return {
    status: 500,
    title: "Request failed",
    detail: "Unable to load team members."
  };
};

export function TeamMembersListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(teamMembersListDefaultParams.page);
  const [pageSize] = useState<number>(teamMembersListDefaultParams.pageSize);
  const [sortBy] = useState<string>(teamMembersListDefaultParams.sortBy);
  const [descending] = useState<boolean>(teamMembersListDefaultParams.descending);
  const previousErrorKeyRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);

  const { searchInput, setSearchInput, debouncedSearch } = useDebouncedTeamMemberSearch(
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

  const queryParams = useMemo<TeamMembersQueryParams>(
    () => ({
      page,
      pageSize,
      sortBy,
      descending,
      ...(debouncedSearch ? { search: debouncedSearch } : {})
    }),
    [page, pageSize, sortBy, descending, debouncedSearch]
  );

  const teamMembersQuery = useTeamMembersList(queryParams);
  const normalizedError = teamMembersQuery.error
    ? getErrorDetail(teamMembersQuery.error)
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

    if (previousErrorKeyRef.current === errorKey) {
      return;
    }

    previousErrorKeyRef.current = errorKey;

    logger.warn(observabilityEvents.teamMembersFetchFailed, {
      module: "team-members",
      action: "list",
      status: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
    });
  }, [normalizedError]);

  const handleRetry = async () => {
    logger.info(observabilityEvents.teamMembersActionExecuted, {
      module: "team-members",
      action: "retry-fetch"
    });

    await teamMembersQuery.refetch();
  };

  const items = teamMembersQuery.data?.items ?? [];
  const showTable = !teamMembersQuery.isLoading && !normalizedError && items.length > 0;
  const showEmpty = !teamMembersQuery.isLoading && !normalizedError && items.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[32px] font-semibold leading-tight text-on-surface">
            Team Members
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Browse, search, and reopen the people records managed by the admin team.
          </p>
        </div>

        <Link
          className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 font-display text-sm font-medium text-on-primary shadow-ambient transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href={appRoutes.newTeamMember}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            add
          </span>
          New Team Member
        </Link>
      </header>

      <TeamMembersSearchBar onChange={setSearchInput} value={searchInput} />

      {teamMembersQuery.isLoading ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <TeamMembersTable isLoading items={[]} onRowSelect={() => undefined} />
        </div>
      ) : null}

      {!teamMembersQuery.isLoading && normalizedError ? (
        <TeamMembersErrorState error={normalizedError} onRetry={() => void handleRetry()} />
      ) : null}

      {showEmpty ? (
        <TeamMembersEmptyState
          onClearSearch={() => setSearchInput("")}
          searchTerm={debouncedSearch}
        />
      ) : null}

      {showTable ? (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
          <TeamMembersTable
            isLoading={false}
            items={items}
            onRowSelect={(id) => router.push(appRoutes.editTeamMember(String(id)))}
          />

          <TeamMembersPagination
            hasNext={teamMembersQuery.data?.hasNext ?? false}
            hasPrevious={teamMembersQuery.data?.hasPrevious ?? false}
            isFetching={teamMembersQuery.isFetching}
            onNext={() => setPage((previous) => previous + 1)}
            onPrevious={() => setPage((previous) => Math.max(1, previous - 1))}
            page={teamMembersQuery.data?.page ?? page}
            pageSize={pageSize}
            totalCount={teamMembersQuery.data?.totalCount ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}