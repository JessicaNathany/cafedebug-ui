"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useMediaSession } from "./media-session";
import { usePlayer } from "./store";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isMuted, isPlaying, pause, position, rate, setPosition, track } = usePlayer();

  useMediaSession(audioRef);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) {
      return;
    }

    const normalizedSrc = new URL(track.src, window.location.origin).toString();
    if (audio.src !== normalizedSrc) {
      audio.src = track.src;
    }

    audio.playbackRate = rate;
    audio.muted = isMuted;

    if (Math.abs(audio.currentTime - position) > 1) {
      audio.currentTime = position;
    }

    if (!isPlaying) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to autoplay track", error);
        pause();
      });
    }
  }, [isMuted, isPlaying, pause, position, rate, track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => setPosition(audio.currentTime);
    const handleEnded = () => pause();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [pause, setPosition]);

  return (
    <>
      {children}
      <audio aria-hidden className="hidden" preload="metadata" ref={audioRef} />
    </>
  );
}
