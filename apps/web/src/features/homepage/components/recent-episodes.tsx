import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EpisodeCard } from "@/features/episodes/components/episode-card";
import type { Episode } from "@/features/episodes/types";

export function RecentEpisodes({ episodes }: { episodes: Episode[] }) {
  return (
    <section className="box-border w-full bg-background px-4 py-18 text-foreground sm:px-6 md:px-10 lg:h-[1084px] lg:px-16" id="episodios">
      <div className="mx-auto grid w-full max-w-[1312px] gap-7 lg:w-[calc(100vw-8rem)]">
        <div className="flex min-h-16 flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-1.5">
            <h2 className="font-secondary text-[30px] font-bold leading-[1.3] tracking-normal text-foreground">Episódios Recentes</h2>
            <p className="font-secondary text-[15px] leading-[19px] text-muted-foreground">Novas conversas toda semana com a comunidade dev.</p>
          </div>
          <Link className="relative inline-flex h-10 items-end gap-1.5 font-secondary text-sm font-semibold leading-[18px] text-primary after:absolute after:-inset-3 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
            Ver todos
            <ArrowRight aria-hidden size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[412px_412px] lg:items-start">
          {episodes.map((episode) => (
            <EpisodeCard episode={episode} key={episode.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
