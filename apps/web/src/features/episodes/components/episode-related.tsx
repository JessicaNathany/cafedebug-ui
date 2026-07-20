import type { Episode } from "../types";
import { EpisodeCard } from "./episode-card";

type EpisodeRelatedProps = {
  episodes: Episode[];
};

export function EpisodeRelated({ episodes }: EpisodeRelatedProps) {
  if (!episodes.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Episódios relacionados</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {episodes.map((episode) => (
          <EpisodeCard episode={episode} key={episode.slug} />
        ))}
      </div>
    </section>
  );
}
