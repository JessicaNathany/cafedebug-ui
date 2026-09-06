import assert from "node:assert/strict";
import test from "node:test";

import { getVisiblePageItems } from "../src/features/episodes/episode-pagination-items.ts";

test("long pagination preserves the Pencil first-page sequence", () => {
  assert.deepEqual(getVisiblePageItems(1, 24), [1, 2, 3, 4, "ellipsis", 24]);
});

test("long pagination keeps current context while ellipses stay decorative", () => {
  assert.deepEqual(getVisiblePageItems(12, 24), [1, "ellipsis", 11, 12, 13, "ellipsis", 24]);
  assert.deepEqual(getVisiblePageItems(24, 24), [1, "ellipsis", 21, 22, 23, 24]);
});

test("short pagination keeps every reachable page", () => {
  assert.deepEqual(getVisiblePageItems(1, 2), [1, 2]);
  assert.deepEqual(getVisiblePageItems(4, 6), [1, 2, 3, 4, 5, 6]);
});
