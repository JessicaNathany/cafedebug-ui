"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { episodeToTrack } from "@/features/episodes/mappers";
import { usePlayer } from "@/features/player/store";

import type { Episode } from "../types";

type PlayButtonProps = {
  episode: Episode;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  iconSize?: number;
};

export function PlayButton({ className, episode, iconOnly = false, iconSize = 16, label = "Reproduzir" }: PlayButtonProps) {
  return (
    <Button
      aria-label={label}
      className={cn(className)}
      onClick={() => usePlayer.getState().load(episodeToTrack(episode))}
      size={iconOnly ? "icon" : "default"}
      variant="primary"
    >
      <Play aria-hidden size={iconSize} />
      {!iconOnly ? label : null}
    </Button>
  );
}
