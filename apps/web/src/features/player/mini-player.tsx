"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { usePlayer } from "./store";

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function MiniPlayer() {
  const { isPlaying, pause, play, position, track } = usePlayer();

  if (!track) {
    return null;
  }

  return (
    <aside className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 md:px-8">
        <Button aria-label={isPlaying ? "Pausar" : "Reproduzir"} onClick={isPlaying ? pause : play} size="icon" variant="primary">
          {isPlaying ? <Pause aria-hidden size={16} /> : <Play aria-hidden size={16} />}
        </Button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{track.title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatSeconds(position)}</span>
            <span>•</span>
            <span>{formatSeconds(track.durationSeconds)}</span>
          </div>
        </div>

        <Link className="text-xs text-primary hover:underline" href={`/episodes/${track.slug}`}>
          Abrir episódio
        </Link>
      </div>
    </aside>
  );
}
