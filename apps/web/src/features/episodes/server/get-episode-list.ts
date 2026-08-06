import { mockEpisodeCatalog } from "../services/episode-catalog.service";
import type { EpisodeListQuery, EpisodeListResult } from "../types";

export async function getEpisodeList(query: EpisodeListQuery): Promise<EpisodeListResult> {
  return mockEpisodeCatalog.list(query);
}
