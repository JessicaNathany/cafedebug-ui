import Image from "next/image";

import { PlayButton } from "./play-button";
import type { Episode } from "../types";

type EpisodeHeroProps = {
  episode: Episode;
};

export function EpisodeHero({ episode }: EpisodeHeroProps) {
  return (
    <section className="grid gap-8 md:grid-cols-[380px_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden rounded-[--radius-m] border border-border">
        <Image alt={episode.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 380px" src={episode.artworkUrl} />
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">{episode.category}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">EPISÓDIO {episode.number}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">{episode.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{episode.dateLabel}</span>
          <span>{episode.durationMinutes} min</span>
          <span>{episode.plays}</span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {episode.guestName} · <span className="text-foreground">{episode.guestRole}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PlayButton episode={episode} label="Reproduzir episódio" />
        </div>
      </div>
    </section>
  );
}
