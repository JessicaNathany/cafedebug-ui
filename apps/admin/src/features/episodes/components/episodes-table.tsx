"use client";

import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/routes";

import type { EpisodeRecord } from "../types/episode.types";
import { EpisodeStatusBadge } from "./episode-status-badge";

const formatPublishDate = (publishedAt?: string): string => {
  if (!publishedAt) return "—";

  const parsed = new Date(publishedAt);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsed);
};

const tableHeadCellClassName =
  "px-6 py-4 font-display text-sm font-semibold text-on-surface";

const tableCellClassName = "px-6 py-4";

const skeletonRows = Array.from({ length: 5 }, (_, index) => index + 1);

function EpisodesTableSkeleton() {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant/60 bg-table-header-surface">
          <th className={`${tableHeadCellClassName} w-16`}>Number</th>
          <th className={tableHeadCellClassName}>Title</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Status</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Publish Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/40">
        {skeletonRows.map((rowIndex) => (
          <tr key={`skeleton-${rowIndex}`}>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-10 animate-pulse rounded bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-56 animate-pulse rounded bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-6 w-24 animate-pulse rounded-md bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-24 animate-pulse rounded bg-surface-container-high" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type EpisodesTableProps = {
  items: EpisodeRecord[];
  isLoading: boolean;
};

export function EpisodesTable({ items, isLoading }: EpisodesTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <EpisodesTableSkeleton />;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant/60 bg-table-header-surface">
          <th className={`${tableHeadCellClassName} w-16`}>Number</th>
          <th className={tableHeadCellClassName}>Title</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Status</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Publish Date</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-outline-variant/40 font-body">
        {items.map((episode) => (
          <tr
            className="group cursor-pointer transition-colors duration-150 hover:bg-table-row-hover"
            key={episode.id}
            onClick={() => router.push(appRoutes.editEpisode(String(episode.id)))}
          >
            <td className={`${tableCellClassName} text-sm font-medium text-on-surface`}>
              {typeof episode.number === "number" ? `#${episode.number}` : "—"}
            </td>

            <td className={tableCellClassName}>
              <div className="flex flex-col">
                <span className="font-medium text-on-surface transition-colors group-hover:text-primary">
                  {episode.title}
                </span>
                {episode.shortDescription || episode.description ? (
                  <span className="mt-0.5 text-sm text-on-surface-variant">
                    {episode.shortDescription || episode.description}
                  </span>
                ) : null}
              </div>
            </td>

            <td className={tableCellClassName}>
              <EpisodeStatusBadge status={episode.status} />
            </td>

            <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
              {formatPublishDate(episode.publishedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
