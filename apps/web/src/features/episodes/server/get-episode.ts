import type { Episode } from "../types";
import { listEpisodes } from "./list-episodes";

export async function getEpisode(slug: string): Promise<Episode | null> {
  // TODO(api): replace mock with @cafedebug/api-client + "use cache"/cacheTag.
  const episodes = await listEpisodes();
  return episodes.find((episode) => episode.slug === slug) ?? null;
}
