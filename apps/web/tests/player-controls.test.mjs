import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { clampPosition, formatDuration, getNextPlaybackRate } from "../src/features/player/player-controls.ts";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

const track = {
  artist: "Café Debug",
  artworkUrl: "/mock/episode-142.svg",
  durationSeconds: 3200,
  id: "episode-142",
  slug: "como-passar-numa-entrevista-tecnica-em-2026",
  src: "/mock/sample-audio.m4a",
  title: "Como passar numa entrevista técnica em 2026"
};

test("player control helpers format, clamp and cycle playback rates consistently", () => {
  assert.equal(formatDuration(62), "1:02");
  assert.equal(formatDuration(3661), "1:01:01");
  assert.equal(clampPosition(-15, track), 0);
  assert.equal(clampPosition(3300, track), track.durationSeconds);
  assert.equal(getNextPlaybackRate(1), 1.25);
  assert.equal(getNextPlaybackRate(1.25), 1.5);
  assert.equal(getNextPlaybackRate(1.5), 1);
});

test("both player surfaces use the shared accessible seek primitive", () => {
  const miniPlayerSource = readSource("src/features/player/mini-player.tsx");
  const fullPlayerSource = readSource("src/features/player/full-player.tsx");
  const progressSource = readSource("src/features/player/player-progress.tsx");

  assert.match(progressSource, /type="range"/);
  assert.match(progressSource, /aria-label=\{accessibleLabel\}/);
  assert.match(progressSource, /onPositionChange\(Number\(event\.currentTarget\.value\)\)/);
  assert.match(fullPlayerSource, /<PlayerProgress/);
  assert.match(fullPlayerSource, /onPositionChange=\{seekTo\}/);
  assert.match(miniPlayerSource, /<PlayerProgress/);
  assert.match(miniPlayerSource, /onPositionChange=\{setPosition\}/);
});

test("compact player is fixed, reserves space and progressively discloses secondary controls", () => {
  const source = readSource("src/features/player/mini-player.tsx");

  assert.match(source, /fixed inset-x-0 bottom-0 z-40/);
  assert.match(source, /aria-hidden className="h-28 md:h-22"/);
  assert.match(source, /pb-\[env\(safe-area-inset-bottom\)\]/);
  assert.match(source, /Voltar 15 segundos/);
  assert.match(source, /Avançar 15 segundos/);
  assert.match(source, /aria-pressed=\{isMuted\}/);
  assert.match(source, /hidden lg:inline-flex/);
  assert.match(source, /md:hidden/);
  assert.match(source, /title=\{track\.title\}/);
});
