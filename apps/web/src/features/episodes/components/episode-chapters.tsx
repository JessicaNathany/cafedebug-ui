"use client";

import { Pause, Play } from "lucide-react";

import { usePlayer } from "@/features/player/store";
import type { Track } from "@/features/player/types";

import type { EpisodeChapter } from "../types";

type EpisodeChaptersProps = {
  chapters: readonly EpisodeChapter[];
  track: Track;
};

export function EpisodeChapters({ chapters, track }: EpisodeChaptersProps) {
  const { isPlaying, position, track: activeTrack } = usePlayer();
  const isCurrentTrack = activeTrack?.id === track.id;
  const activeChapter = chapters.reduce<EpisodeChapter | undefined>((current, chapter) => {
    if (!isCurrentTrack || chapter.startSeconds > position) {
      return current;
    }

    return chapter;
  }, chapters[0]);

  const seekToChapter = (chapter: EpisodeChapter) => {
    const player = usePlayer.getState();

    if (player.track?.id !== track.id) {
      player.load(track);
    }

    player.setPosition(chapter.startSeconds);
    player.play();
  };

  return (
    <section aria-labelledby="episode-chapters-title" className="grid min-w-0 grid-cols-1 gap-4" id="capitulos">
      <h2 className="font-primary text-2xl font-bold leading-tight text-foreground" id="episode-chapters-title">
        Capítulos
      </h2>
      <ol className="grid min-w-0 grid-cols-1 gap-0.5">
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeChapter?.id;

          return (
            <li className="min-w-0" key={chapter.id}>
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={`Reproduzir capítulo ${chapter.title} em ${chapter.timestamp}`}
                className={`flex h-12 w-full min-w-0 items-center gap-3 rounded-lg px-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
                onClick={() => seekToChapter(chapter)}
                type="button"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-pill bg-background text-primary ring-1 ring-inset ring-border" aria-hidden>
                  {isActive && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </span>
                <span className="w-12 shrink-0 font-primary text-sm font-semibold text-primary">{chapter.timestamp}</span>
                <span className="min-w-0 truncate font-secondary text-[15px] font-medium">{chapter.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
