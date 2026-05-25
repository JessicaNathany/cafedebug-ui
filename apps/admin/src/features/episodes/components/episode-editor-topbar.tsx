"use client";

import type { EpisodeDisplayStatus } from "../types/episode.types";
import { EpisodeStatusBadge } from "./episode-status-badge";

type EpisodeEditorTopBarProps = {
  status: EpisodeDisplayStatus;
  mode: "new" | "edit";
  onBack: () => void;
};

export function EpisodeEditorTopBar({ status, mode, onBack }: EpisodeEditorTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest px-6 py-5 lg:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="Back to episodes"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
            arrow_back
          </span>
        </button>

        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
            Episodes
          </span>
          <span className="text-sm font-medium text-on-surface">
            {mode === "new" ? "Creating Episode" : "Editing Episode"}
          </span>
        </div>
      </div>

      <EpisodeStatusBadge status={status} />
    </header>
  );
}
