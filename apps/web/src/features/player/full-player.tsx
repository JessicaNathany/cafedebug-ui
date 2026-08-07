"use client";

import { FastForward, Gauge, List, Pause, Play, Rewind, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";

import { clampPosition, formatDuration, getNextPlaybackRate } from "./player-controls";
import { PlayerProgress } from "./player-progress";
import { usePlayer } from "./store";
import type { Track } from "./types";

type FullPlayerProps = {
  track: Track;
};

export function FullPlayer({ track }: FullPlayerProps) {
  const { isMuted, isPlaying, load, pause, play, position, rate, setRate, toggleMuted, track: activeTrack } = usePlayer();
  const isCurrentTrack = activeTrack?.id === track.id;

  const ensureTrackLoaded = () => {
    if (!isCurrentTrack) {
      load(track);
    }
  };

  const playOrPause = () => {
    ensureTrackLoaded();
    if (isCurrentTrack && isPlaying) {
      pause();
      return;
    }

    play();
  };

  const seekBy = (amount: number) => {
    const player = usePlayer.getState();
    const startingPosition = player.track?.id === track.id ? player.position : 0;

    if (player.track?.id !== track.id) {
      player.load(track);
    }

    player.setPosition(clampPosition(startingPosition + amount, track));
  };

  const skipBack = () => seekBy(-15);
  const rewind = () => seekBy(-5);
  const fastForward = () => seekBy(5);
  const skipForward = () => seekBy(15);

  const seekTo = (nextPosition: number) => {
    const player = usePlayer.getState();

    if (player.track?.id !== track.id) {
      player.load(track);
    }

    player.setPosition(clampPosition(nextPosition, track));
  };

  const cycleRate = () => {
    setRate(getNextPlaybackRate(rate));
  };

  const currentPosition = isCurrentTrack ? position : 0;

  return (
    <section aria-label="Player do episódio" className="min-h-45 rounded-m border border-border bg-card p-6 shadow-card dark:shadow-none md:h-45">
      <div className="flex h-full flex-col justify-between gap-5 md:gap-0">
        <div className="flex h-14 min-w-0 items-center gap-4">
          <Button aria-label={isCurrentTrack && isPlaying ? "Pausar" : "Reproduzir"} className="h-14 w-14" onClick={playOrPause} size="icon" variant="primary">
            {isCurrentTrack && isPlaying ? <Pause aria-hidden size={24} /> : <Play aria-hidden size={24} />}
          </Button>
          <div className="min-w-0 flex-1">
            <p className="font-primary text-[11px] font-semibold tracking-[0.15em] text-primary">TOCANDO AGORA</p>
            <h2 className="truncate font-secondary text-[15px] font-semibold leading-[19px] text-foreground">{track.title}</h2>
          </div>
          <Button aria-label={`Velocidade de reprodução: ${rate}x`} className="h-10 w-20 bg-transparent p-0 hover:bg-transparent" onClick={cycleRate} variant="ghost">
            <span className="inline-flex h-9 w-20 items-center justify-center gap-1.5 rounded-pill bg-secondary font-primary text-[13px] font-medium text-secondary-foreground"><Gauge aria-hidden size={14} />{rate}x</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 font-primary text-[13px] tabular-nums text-muted-foreground">
          <span>{formatDuration(currentPosition)}</span>
          <PlayerProgress className="h-1.5 flex-1 cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onPositionChange={seekTo} position={currentPosition} track={track} />
          <span>{formatDuration(track.durationSeconds)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:h-10">
          <Button aria-label="Voltar 15 segundos" className="h-10 bg-transparent px-0 font-primary text-xs text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={skipBack} variant="ghost">
            <SkipBack aria-hidden size={16} /> Voltar 15s
          </Button>
          <div className="flex items-center gap-1">
            <Button aria-label="Retroceder 5 segundos" className="h-10 w-10 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={rewind} size="icon" variant="ghost">
              <Rewind aria-hidden size={16} />
            </Button>
            <Button aria-label="Avançar 5 segundos" className="h-10 w-10 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={fastForward} size="icon" variant="ghost">
              <FastForward aria-hidden size={16} />
            </Button>
          </div>
          <Button aria-label="Avançar 15 segundos" className="h-10 bg-transparent px-0 font-primary text-xs text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={skipForward} variant="ghost">
            <SkipForward aria-hidden size={16} /> Avançar 15s
          </Button>
          <Button aria-label={isMuted ? "Ativar volume" : "Silenciar"} aria-pressed={isMuted} className="h-10 w-10 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={toggleMuted} size="icon" variant="ghost">
            {isMuted ? <VolumeX aria-hidden size={16} /> : <Volume2 aria-hidden size={16} />}
          </Button>
          <a aria-label="Ir para capítulos" className="inline-flex h-10 items-center gap-1.5 rounded-pill px-0 font-secondary text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="#capitulos">
            <List aria-hidden size={16} />
            Capítulos
          </a>
        </div>
      </div>
    </section>
  );
}
