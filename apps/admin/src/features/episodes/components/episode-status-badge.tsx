import type { EpisodeDisplayStatus } from "../types/episode.types";
import { EPISODE_STATUS_BADGES } from "./episode-status-badge.config";

type EpisodeStatusBadgeProps = {
  status: EpisodeDisplayStatus;
};

export function EpisodeStatusBadge({ status }: EpisodeStatusBadgeProps) {
  const badge = EPISODE_STATUS_BADGES[status] ?? EPISODE_STATUS_BADGES.unknown;

  return <span className={badge.className}>{badge.label}</span>;
}
