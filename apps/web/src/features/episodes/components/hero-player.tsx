import Image from "next/image";
import { Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Episode } from "../types";

type HeroPlayerProps = {
  episode: Episode;
};

export function HeroPlayer({ episode }: HeroPlayerProps) {
  return (
    <article aria-label="Player do episódio em destaque" className="w-full max-w-130 justify-self-center overflow-hidden rounded-[var(--radius-m)] border border-border bg-card text-card-foreground shadow-card lg:h-[559px]">
      <div className="relative h-60 overflow-hidden">
        <Image alt={`Capa do episódio ${episode.number}: ${episode.title}`} className="object-cover" fill priority sizes="(max-width: 1023px) 100vw, 520px" src="/mock/hero-episode-142.jpg" />
        <span className="absolute left-5 top-5 rounded-pill bg-background/80 px-3 py-1.5 font-primary text-[11px] font-semibold tracking-[1px] text-primary">
          {episode.category}
        </span>
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-pill bg-background/80 px-3 py-1.5 font-primary text-[11px] font-semibold tracking-[1px] text-foreground">
          <span aria-hidden className="size-2 rounded-pill bg-primary" />
          NOVO
        </span>
      </div>

      <div className="grid gap-4 p-6">
        <div className="flex items-center gap-2 font-secondary text-xs text-muted-foreground">
          <span className="font-primary font-semibold text-primary">EP {episode.number}</span>
          <span aria-hidden>·</span>
          <span>{episode.dateLabel}</span>
        </div>
        <h2 className="text-[21px] font-semibold leading-[1.3] text-foreground">{episode.title}</h2>

        <div className="flex items-center gap-2.5">
          <Image alt={episode.guestName} className="size-8 rounded-pill object-cover" height={32} src="/mock/hero-guest-ana.jpg" width={32} />
          <div className="grid gap-px">
            <p className="text-sm font-medium text-foreground">com {episode.guestName}</p>
            <p className="text-xs text-muted-foreground">{episode.guestRole}</p>
          </div>
        </div>

        <div className="grid gap-3 border-t border-transparent pt-4">
          <div aria-label="Progresso do episódio: 18 minutos e 24 segundos de 48 minutos e 12 segundos" className="relative h-1.5 rounded-pill bg-secondary">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[38.14%] rounded-pill bg-primary" />
            <span aria-hidden className="absolute left-[calc(38.14%-7px)] top-1/2 size-3.5 -translate-y-1/2 rounded-pill bg-primary" />
          </div>
          <div className="flex items-center justify-between font-primary text-xs text-muted-foreground">
            <span>18:24</span>
            <span>48:12</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button aria-disabled="true" aria-label="Velocidade de reprodução: uma vez" className="h-8 px-3 font-primary text-xs disabled:bg-secondary disabled:text-secondary-foreground disabled:opacity-100" disabled variant="secondary">
              1.0x
            </Button>
            <div className="flex items-center gap-5">
              <Button aria-disabled="true" aria-label="Voltar 15 segundos" className="bg-transparent text-muted-foreground hover:bg-transparent disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100" disabled size="icon" variant="ghost">
                <SkipBack aria-hidden size={20} />
              </Button>
              <Button aria-disabled="true" aria-label="Pausar episódio em reprodução" aria-pressed="true" className="h-13 w-13 disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100" disabled size="icon" variant="primary">
                <Pause aria-hidden size={20} />
              </Button>
              <Button aria-disabled="true" aria-label="Avançar 15 segundos" className="bg-transparent text-muted-foreground hover:bg-transparent disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100" disabled size="icon" variant="ghost">
                <SkipForward aria-hidden size={20} />
              </Button>
            </div>
            <Button aria-disabled="true" aria-label="Controle de volume" className="bg-transparent text-muted-foreground hover:bg-transparent disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100" disabled size="icon" variant="ghost">
              <Volume2 aria-hidden size={20} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
