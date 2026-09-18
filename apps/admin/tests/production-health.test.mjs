import assert from "node:assert/strict";
import test from "node:test";

import { checkAdminApiReadiness } from "../src/features/health/server/readiness-probe.ts";

test("backoffice readiness probe succeeds only when the API readiness endpoint succeeds", async () => {
  let requestedUrl;
  const isReady = await checkAdminApiReadiness({
    apiBaseUrl: "http://api.railway.internal:8080/",
    fetchImpl: async (url) => {
      requestedUrl = url;
      return new Response(null, { status: 204 });
    },
  });

  assert.equal(requestedUrl, "http://api.railway.internal:8080/health/ready");
  assert.equal(isReady, true);
});

test("backoffice readiness probe treats upstream failures as unavailable", async () => {
  const isReady = await checkAdminApiReadiness({
    apiBaseUrl: "http://api.railway.internal:8080",
    fetchImpl: async () => new Response("unavailable", { status: 503 }),
  });

  assert.equal(isReady, false);
});

test("backoffice readiness probe treats request errors as unavailable", async () => {
  const isReady = await checkAdminApiReadiness({
    apiBaseUrl: "http://api.railway.internal:8080",
    fetchImpl: async () => {
      throw new Error("unreachable");
    },
  });

  assert.equal(isReady, false);
});
