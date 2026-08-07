"use client";

import Link from "next/link";
import { ExternalLink, Gauge, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";

import { clampPosition, formatDuration, getNextPlaybackRate } from "./player-controls";
import { PlayerProgress } from "./player-progress";
import { usePlayer } from "./store";

export function MiniPlayer() {
  const { isMuted, isPlaying, pause, play, position, rate, setPosition, setRate, toggleMuted, track } = usePlayer();

  if (!track) {
    return null;
  }

  const seekBy = (amount: number) => setPosition(clampPosition(position + amount, track));
  const currentPosition = clampPosition(position, track);

  return (
    <>
      <div aria-hidden className="h-28 md:h-22" />
      <aside aria-label="Player persistente" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" data-persistent-player>
        <div className="mx-auto grid w-full max-w-[1440px] gap-2 px-4 py-3 sm:px-6 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button aria-label={isPlaying ? "Pausar" : "Reproduzir"} onClick={isPlaying ? pause : play} size="icon" variant="primary">
              {isPlaying ? <Pause aria-hidden size={16} /> : <Play aria-hidden size={16} />}
            </Button>

            <div className="min-w-0 flex-1 md:hidden">
              <p className="truncate font-secondary text-sm font-semibold text-foreground" title={track.title}>{track.title}</p>
              <p className="font-primary text-xs tabular-nums text-muted-foreground">{formatDuration(currentPosition)} / {formatDuration(track.durationSeconds)}</p>
            </div>

            <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
              <p className="min-w-0 shrink truncate font-secondary text-sm font-semibold text-foreground" title={track.title}>{track.title}</p>
              <span className="font-primary text-xs tabular-nums text-muted-foreground">{formatDuration(currentPosition)}</span>
              <PlayerProgress className="h-2 min-w-20 flex-1 cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onPositionChange={setPosition} position={currentPosition} track={track} />
              <span className="font-primary text-xs tabular-nums text-muted-foreground">{formatDuration(track.durationSeconds)}</span>
            </div>

            <div className="ml-auto hidden items-center gap-1 md:flex">
              <Button aria-label="Voltar 15 segundos" onClick={() => seekBy(-15)} size="icon" variant="ghost">
                <SkipBack aria-hidden size={16} />
              </Button>
              <Button aria-label="Avançar 15 segundos" onClick={() => seekBy(15)} size="icon" variant="ghost">
                <SkipForward aria-hidden size={16} />
              </Button>
              <Button aria-label={isMuted ? "Ativar volume" : "Silenciar"} aria-pressed={isMuted} onClick={toggleMuted} size="icon" variant="ghost">
                {isMuted ? <VolumeX aria-hidden size={16} /> : <Volume2 aria-hidden size={16} />}
              </Button>
              <Button aria-label={`Velocidade de reprodução: ${rate}x`} className="hidden lg:inline-flex" onClick={() => setRate(getNextPlaybackRate(rate))} variant="ghost">
                <Gauge aria-hidden size={16} /> {rate}x
              </Button>
            </div>

            <Link aria-label="Abrir episódio" className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-pill px-2 font-secondary text-xs font-medium text-primary transition-colors hover:bg-secondary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:px-3" href={`/episodes/${track.slug}`}>
              <ExternalLink aria-hidden size={16} />
              <span className="hidden lg:inline">Abrir episódio</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <PlayerProgress className="h-2 min-w-0 flex-1 cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onPositionChange={setPosition} position={currentPosition} track={track} />
          </div>
        </div>
      </aside>
    </>
  );
}
