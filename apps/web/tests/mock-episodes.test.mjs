import assert from "node:assert/strict";
import test from "node:test";

import { mockEpisodes } from "../src/features/episodes/mock/episodes.mock.ts";
import { episodeCollectionSchema } from "../src/features/episodes/schemas.ts";

test("episode fixtures satisfy schema contract", () => {
  const parsed = episodeCollectionSchema.parse(mockEpisodes);

  assert.equal(parsed.length, mockEpisodes.length);
  assert.ok(parsed.every((episode) => episode.categoryKey));
});
