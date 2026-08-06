import type { Episode } from "../types";
import { mockEpisodeCatalog } from "../services/episode-catalog.service";

export async function listEpisodes(): Promise<Episode[]> {
  return mockEpisodeCatalog.listAll();
}
