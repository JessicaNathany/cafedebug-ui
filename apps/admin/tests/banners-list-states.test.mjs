import test from "node:test";
import assert from "node:assert/strict";

import { BANNERS_LIST_STATES } from "../src/features/banners/banners-list-states.js";

const expectedKeys = ["loading", "empty", "error"];

test("banners list has deterministic state coverage for loading/empty/error", () => {
  assert.equal(Array.isArray(BANNERS_LIST_STATES), true, "state collection should be an array");
  assert.deepEqual(
    BANNERS_LIST_STATES.map((state) => state.key),
    expectedKeys,
    "banners list states must stay aligned with admin spec requirements"
  );
});

test("each banner list state exposes actionable UI metadata", () => {
  for (const state of BANNERS_LIST_STATES) {
    assert.equal(typeof state.title, "string");
    assert.ok(state.title.length > 0, `${state.key} state requires a title`);
    assert.equal(typeof state.description, "string");
    assert.ok(state.description.length > 0, `${state.key} state requires a description`);
    assert.equal(typeof state.actionLabel, "string");
    assert.ok(state.actionLabel.length > 0, `${state.key} state requires an action label`);
  }
});
