import Link from "next/link";

import { appRoutes } from "@/lib/routes";

type UsersEmptyStateProps = {
  searchTerm: string;
  onClearSearch: () => void;
};

export function UsersEmptyState({
  searchTerm,
  onClearSearch
}: UsersEmptyStateProps) {
  const title = searchTerm
    ? "No users match your search"
    : "No users available yet";

  const description = searchTerm
    ? "Try a different keyword or clear the search input."
    : "Create your first user to populate this table.";

  return (
    <div className="space-y-3 rounded-lg border border-outline-variant/60 bg-surface-container p-6">
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
      <p className="text-sm text-on-surface-variant">{description}</p>

      <div className="flex flex-wrap gap-3">
        {searchTerm ? (
          <button
            className="inline-flex h-10 items-center rounded-lg bg-surface-container-high px-4 text-sm font-semibold text-on-surface"
            onClick={onClearSearch}
            type="button"
          >
            Clear search
          </button>
        ) : (
          <Link
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary"
            href={appRoutes.newUser}
          >
            Create first user
          </Link>
        )}
      </div>
    </div>
  );
}
