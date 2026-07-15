"use client";

import { useEffect } from "react";

import { usePlayer } from "./store";

type MediaSessionWithPositionState = MediaSession & {
  setPositionState?: (state?: MediaPositionState) => void;
};

export function useMediaSession(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const { track, isPlaying, pause, play, setPosition } = usePlayer();

  useEffect(() => {
    if (!("mediaSession" in navigator) || !track) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [{ src: track.artworkUrl, sizes: "512x512", type: "image/svg+xml" }]
    });

    navigator.mediaSession.setActionHandler("play", () => play());
    navigator.mediaSession.setActionHandler("pause", () => pause());
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const next = Math.max(0, audio.currentTime - 15);
      setPosition(next);
      audio.currentTime = next;
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const next = Math.min(audio.duration || 0, audio.currentTime + 30);
      setPosition(next);
      audio.currentTime = next;
    });
  }, [audioRef, pause, play, setPosition, track]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const mediaSession = navigator.mediaSession as MediaSessionWithPositionState;
    mediaSession.setPositionState?.({
      duration: audio.duration || track?.durationSeconds || 0,
      playbackRate: audio.playbackRate || 1,
      position: audio.currentTime || 0
    });
  }, [audioRef, isPlaying, track?.durationSeconds]);
}
