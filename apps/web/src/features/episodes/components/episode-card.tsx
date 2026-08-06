import Image from "next/image";
import Link from "next/link";
import { Headphones } from "lucide-react";

import { PlayButton } from "./play-button";
import type { Episode } from "../types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const episodeHref = `/episodes/${episode.slug}`;

  return (
    <article className="flex h-103 w-full min-w-0 flex-col overflow-hidden rounded-m bg-card text-card-foreground ring-1 ring-inset ring-border shadow-card dark:shadow-none">
      <div className="relative h-50 shrink-0">
        <Link aria-label={`Abrir episódio ${episode.number}: ${episode.title}`} className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={episodeHref}>
          <Image
            alt={`Capa do episódio ${episode.number}: ${episode.title}`}
            className="object-cover"
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1439px) 33vw, 421px"
            src={episode.artworkUrl}
          />
        </Link>

        <span className="absolute left-4 top-4 z-10 rounded-pill bg-header/80 px-3 py-1.5 font-primary text-[11px] font-semibold leading-[15px] tracking-[1px] text-primary">
          {episode.category}
        </span>

        <div className="absolute inset-0 z-10 grid place-items-center">
          <PlayButton className="h-14 w-14" episode={episode} iconOnly iconSize={22} label={`Reproduzir episódio ${episode.number}`} />
        </div>

        <div className="absolute bottom-[18px] right-4 z-10 inline-flex items-center gap-[5px] rounded-pill bg-header/80 px-2.5 py-[5px] font-secondary text-[11px] font-medium leading-[14px] text-header-foreground">
          <Headphones aria-hidden size={12} />
          <span>{episode.durationLabel}</span>
        </div>
      </div>

      <div className="grid flex-1 content-start gap-2.5 overflow-hidden p-5">
        <p className="flex items-center gap-2 font-secondary text-xs leading-4 text-muted-foreground">
          <span className="font-primary font-semibold text-primary">EP {episode.number}</span>
          <span aria-hidden>·</span>
          <span>{episode.dateLabel}</span>
        </p>
        <h2 className="line-clamp-2 font-secondary text-lg font-semibold leading-[1.35] text-foreground">
          <Link className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={episodeHref}>
            {episode.title}
          </Link>
        </h2>
        <p className="line-clamp-2 font-secondary text-sm leading-[1.55] text-muted-foreground">{episode.summary}</p>
        <div className="flex items-center gap-2.5 pt-1.5">
          <Image alt={episode.guestName} className="size-7 rounded-pill object-cover" height={28} sizes="28px" src={episode.guestAvatarUrl} width={28} />
          <p className="font-secondary text-[13px] text-muted-foreground">com {episode.guestName}</p>
        </div>
      </div>
    </article>
  );
}
