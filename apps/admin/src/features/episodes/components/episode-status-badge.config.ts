import type { EpisodeDisplayStatus } from "../types/episode.types";

export type EpisodeStatusBadgeDefinition = {
  label: string;
  className: string;
};

const badgeBaseClassName =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 font-display text-sm font-semibold leading-none";

export const EPISODE_STATUS_BADGES: Record<
  EpisodeDisplayStatus,
  EpisodeStatusBadgeDefinition
> = {
  draft: {
    label: "Draft",
    className: `${badgeBaseClassName} border border-status-draft-border bg-status-draft-surface text-status-draft-on`
  },
  scheduled: {
    label: "Scheduled",
    className: `${badgeBaseClassName} border border-status-scheduled-border bg-status-scheduled-surface text-status-scheduled-on`
  },
  published: {
    label: "Published",
    className: `${badgeBaseClassName} bg-status-published-surface text-status-published-on`
  },
  archived: {
    label: "Archived",
    className: `${badgeBaseClassName} border border-status-archived-border bg-status-archived-surface text-status-archived-on`
  },
  unknown: {
    label: "Unknown",
    className: `${badgeBaseClassName} border border-status-unknown-border bg-status-unknown-surface text-status-unknown-on`
  }
};
