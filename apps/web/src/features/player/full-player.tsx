"use client";

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { usePlayer } from "./store";
import type { Track } from "./types";

type FullPlayerProps = {
  track: Track;
};

export function FullPlayer({ track }: FullPlayerProps) {
  const { isPlaying, load, pause, play, position, rate, setPosition, setRate, track: activeTrack } = usePlayer();
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

  return (
    <section className="rounded-[--radius-m] border border-border bg-card p-5 shadow-card">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Player</p>
      <h2 className="mt-2 text-xl font-semibold">{track.title}</h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button aria-label={isCurrentTrack && isPlaying ? "Pausar" : "Reproduzir"} onClick={playOrPause} size="icon" variant="primary">
          {isCurrentTrack && isPlaying ? <Pause aria-hidden size={16} /> : <Play aria-hidden size={16} />}
        </Button>
        <Button onClick={() => setPosition(Math.max(0, position - 15))} variant="secondary">
          <RotateCcw aria-hidden size={16} /> -15s
        </Button>
        <Button onClick={() => setPosition(position + 30)} variant="secondary">
          <RotateCw aria-hidden size={16} /> +30s
        </Button>
      </div>

      <div className="mt-5">
        <div className="h-1.5 rounded-pill bg-secondary">
          <div
            className="h-full rounded-pill bg-primary"
            style={{ width: `${Math.min(100, (position / Math.max(track.durationSeconds, 1)) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {[1, 1.25, 1.5].map((value) => (
            <Button key={value} onClick={() => setRate(value)} variant={rate === value ? "primary" : "outline"}>
              {value}x
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
