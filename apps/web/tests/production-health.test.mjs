import assert from "node:assert/strict";
import test from "node:test";

import { healthHandler } from "../src/features/health/server/health.handler.ts";

test("website health handler returns a non-cacheable ready response", async () => {
  const response = healthHandler();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { status: "ok" });
});
