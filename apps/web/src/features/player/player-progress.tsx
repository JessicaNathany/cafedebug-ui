"use client";

import { clampPosition, formatDuration } from "./player-controls";
import type { Track } from "./types";

type PlayerProgressProps = {
  className?: string;
  onPositionChange: (position: number) => void;
  position: number;
  track: Track;
};

export function PlayerProgress({ className, onPositionChange, position, track }: PlayerProgressProps) {
  const currentPosition = clampPosition(position, track);
  const accessibleLabel = `Progresso de ${track.title}: ${formatDuration(currentPosition)} de ${formatDuration(track.durationSeconds)}`;

  return (
    <input
      aria-label={accessibleLabel}
      className={className}
      max={track.durationSeconds}
      min={0}
      onChange={(event) => onPositionChange(Number(event.currentTarget.value))}
      step={1}
      type="range"
      value={currentPosition}
    />
  );
}
