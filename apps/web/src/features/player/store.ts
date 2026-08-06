import { create } from "zustand";

import type { Track } from "./types";

type PlayerState = {
  track: Track | null;
  isPlaying: boolean;
  isMuted: boolean;
  position: number;
  rate: number;
  load: (track: Track) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setPosition: (position: number) => void;
  setRate: (rate: number) => void;
  toggleMuted: () => void;
};

export const usePlayer = create<PlayerState>((set) => ({
  track: null,
  isPlaying: false,
  isMuted: false,
  position: 0,
  rate: 1,
  load: (track) => set({ track, isPlaying: true, position: 0 }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setPosition: (position) => set({ position }),
  setRate: (rate) => set({ rate }),
  toggleMuted: () => set((state) => ({ isMuted: !state.isMuted }))
}));
