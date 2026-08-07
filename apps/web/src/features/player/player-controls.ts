import type { Track } from "./types";

export const playbackRates = [1, 1.25, 1.5] as const;

export function formatDuration(seconds: number) {
  const normalizedSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(normalizedSeconds / 3600);
  const minutes = Math.floor((normalizedSeconds % 3600) / 60);
  const rest = normalizedSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function clampPosition(position: number, track: Track) {
  return Math.min(track.durationSeconds, Math.max(0, position));
}

export function getNextPlaybackRate(rate: number) {
  const currentIndex = playbackRates.indexOf(rate as (typeof playbackRates)[number]);

  return playbackRates[(currentIndex + 1) % playbackRates.length] ?? playbackRates[0];
}
