import type { Track } from "@/features/player/types";

import type { Episode } from "./types";

export function episodeToTrack(episode: Episode): Track {
  return {
    id: `${episode.number}`,
    slug: episode.slug,
    title: episode.title,
    artist: episode.guestName,
    artworkUrl: episode.artworkUrl,
    src: episode.audioUrl,
    durationSeconds: episode.durationMinutes * 60
  };
}
