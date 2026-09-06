import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <section aria-labelledby="related-episodes-title" className="grid w-full gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-primary text-2xl font-bold leading-tight text-foreground" id="related-episodes-title">Episódios relacionados</h2>
        <Link className="inline-flex h-10 items-center gap-2 font-secondary text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
          Ver todos
          <ArrowRight aria-hidden size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {episodes.map((episode) => (
          <EpisodeCard episode={episode} key={episode.slug} />
        ))}
      </div>
    </section>
  );
}
