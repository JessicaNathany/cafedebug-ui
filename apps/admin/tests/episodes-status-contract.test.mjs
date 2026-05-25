import assert from "node:assert/strict";
import test from "node:test";

import { EPISODE_STATUS_BADGES } from "../src/features/episodes/components/episode-status-badge.config.ts";
import { parseEpisodeRecord } from "../src/features/episodes/parsers.ts";

test("parseEpisodeRecord preserves all supported lifecycle statuses", () => {
  for (const status of ["draft", "scheduled", "published", "archived"]) {
    const episode = parseEpisodeRecord({
      id: 42,
      title: `Episode ${status}`,
      status
    });

    assert.equal(episode?.status, status);
  }
});

test("parseEpisodeRecord maps unsupported or missing statuses to unknown", () => {
  const unsupported = parseEpisodeRecord({ id: 7, title: "Legacy", status: "legacy" });
  const missing = parseEpisodeRecord({ id: 8, title: "Missing" });

  assert.equal(unsupported?.status, "unknown");
  assert.equal(missing?.status, "unknown");
});

test("badge config exposes the four lifecycle states plus unknown fallback", () => {
  assert.deepEqual(Object.keys(EPISODE_STATUS_BADGES).sort(), [
    "archived",
    "draft",
    "published",
    "scheduled",
    "unknown"
  ]);
  assert.equal(EPISODE_STATUS_BADGES.scheduled.label, "Scheduled");
  assert.equal(EPISODE_STATUS_BADGES.archived.label, "Archived");
  assert.equal(EPISODE_STATUS_BADGES.unknown.label, "Unknown");
});
