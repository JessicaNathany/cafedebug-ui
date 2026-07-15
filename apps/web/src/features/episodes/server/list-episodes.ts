import { mockEpisodes } from "../mock/episodes.mock";
import { episodeSchema } from "../schemas";
import type { Episode } from "../types";

export async function listEpisodes(): Promise<Episode[]> {
  // TODO(api): replace mock with @cafedebug/api-client + "use cache"/cacheTag.
  return mockEpisodes.map((episode) => episodeSchema.parse(episode));
}
