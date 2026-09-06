import Image from "next/image";
import { CalendarDays, Headphones, Timer } from "lucide-react";

import { PlayButton } from "./play-button";
import { EpisodeHeroActions } from "./episode-hero-actions";
import type { Episode } from "../types";

type EpisodeHeroProps = {
  episode: Episode;
};

export function EpisodeHero({ episode }: EpisodeHeroProps) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-11">
      <div className="relative aspect-square overflow-hidden rounded-m border border-border">
        <Image alt={`Capa do episódio ${episode.number}: ${episode.title}`} className="object-cover" fill sizes="(max-width: 768px) 100vw, 380px" src={episode.artworkUrl} />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="inline-flex h-8 w-fit items-center rounded-pill bg-info px-3 font-primary text-[11px] font-semibold tracking-[0.15em] text-info-foreground">{episode.category}</span>
        <p className="mt-4 font-primary text-[13px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">EPISÓDIO {episode.number}</p>
        <h1 className="mt-3 font-primary text-3xl font-bold leading-[1.2] text-foreground md:text-[38px]">{episode.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-secondary text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden size={16} />{episode.dateLabel}</span>
          <span className="inline-flex items-center gap-2"><Timer aria-hidden size={16} />{episode.durationMinutes} min</span>
          <span className="inline-flex items-center gap-2"><Headphones aria-hidden size={16} />{episode.plays}</span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Image alt={episode.guestName} className="size-12 rounded-pill object-cover" height={48} sizes="48px" src={episode.guestAvatarUrl} width={48} />
          <div className="min-w-0 font-secondary">
            <p className="truncate text-[15px] font-semibold text-foreground">{episode.guestName}</p>
            <p className="truncate text-[13px] text-muted-foreground">{episode.guestRole}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PlayButton className="h-12 w-[215px] gap-2 font-secondary text-sm font-semibold" episode={episode} iconSize={18} label="Reproduzir episódio" />
          <EpisodeHeroActions episode={episode} />
        </div>
      </div>
    </section>
  );
}
