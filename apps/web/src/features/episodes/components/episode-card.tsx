import Image from "next/image";
import { Headphones } from "lucide-react";

import { PlayButton } from "./play-button";
import type { Episode } from "../types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="overflow-hidden rounded-[--radius-m] border border-border bg-card shadow-card">
      <div className="relative h-[200px]">
        <Image
          alt={`Capa do episódio ${episode.number}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={episode.artworkUrl}
        />

        <span className="absolute left-3 top-3 rounded-pill bg-background/80 px-3 py-1 font-mono text-[11px] font-semibold text-primary">
          {episode.category}
        </span>

        <div className="absolute inset-0 grid place-items-center">
          <PlayButton className="h-14 w-14 shadow-float" episode={episode} iconOnly iconSize={20} label={`Reproduzir episódio ${episode.number}`} />
        </div>

        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-pill bg-background/85 px-3 py-1 text-xs text-foreground">
          <Headphones aria-hidden size={12} />
          <span>{episode.durationMinutes} min</span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="font-mono text-xs text-primary">
          EP {episode.number} · {episode.dateLabel}
        </p>
        <h2 className="text-lg font-semibold">{episode.title}</h2>
        <p className="text-sm text-muted-foreground">{episode.summary}</p>
        <p className="text-sm text-muted-foreground">
          com <span className="text-foreground">{episode.guestName}</span>
        </p>
      </div>
    </article>
  );
}
