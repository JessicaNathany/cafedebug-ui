import { mockEpisodes } from "../mock/episodes.mock";
import type { Episode } from "../types";

export async function listEpisodes(): Promise<Episode[]> {
  return mockEpisodes;
}
