import type { Episode, EpisodeDetail } from "../types";
import { mockEpisodeCatalog } from "../services/episode-catalog.service";

export async function getEpisode(slug: string): Promise<Episode | null> {
  return mockEpisodeCatalog.getBySlug(slug);
}

export async function getEpisodeDetail(slug: string): Promise<EpisodeDetail | null> {
  return mockEpisodeCatalog.getDetailBySlug(slug);
}
