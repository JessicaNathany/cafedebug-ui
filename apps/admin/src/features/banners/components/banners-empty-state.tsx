import Link from "next/link";

import { appRoutes } from "@/lib/routes";

type BannersEmptyStateProps = {
  searchTerm: string;
  onClearSearch: () => void;
};

export function BannersEmptyState({ searchTerm, onClearSearch }: BannersEmptyStateProps) {
  const title = searchTerm ? "No banners match your search" : "No banners available yet";
  const description = searchTerm
    ? "Try a different search term or clear the current filter."
    : "Create your first banner to populate this table.";

  return (
    <div className="space-y-3 rounded-lg border border-outline-variant/60 bg-surface-container p-6">
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
      <p className="text-sm text-on-surface-variant">{description}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary"
          href={appRoutes.newBanner}
        >
          Create first banner
        </Link>

        {searchTerm ? (
          <button
            className="inline-flex h-10 items-center rounded-lg bg-surface-container-high px-4 text-sm font-semibold text-on-surface"
            onClick={onClearSearch}
            type="button"
          >
            Clear search
          </button>
        ) : null}
      </div>
    </div>
  );
}
