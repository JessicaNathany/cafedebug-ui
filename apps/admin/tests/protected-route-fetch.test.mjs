import assert from "node:assert/strict";
import test from "node:test";

import {
  __resetProtectedRouteFetchStateForTests,
  fetchProtectedAdminRoute
} from "../src/lib/api/protected-route-fetch.js";

test("fetchProtectedAdminRoute retries once after successful refresh", async () => {
  __resetProtectedRouteFetchStateForTests();
  const calls = [];

  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push({ url, init });

    if (calls.length === 1) {
      assert.equal(url, "/api/admin/episodes");
      return new Response(null, { status: 401 });
    }

    if (calls.length === 2) {
      assert.equal(url, "/api/auth/refresh");
      return new Response(null, { status: 200 });
    }

    if (calls.length === 3) {
      assert.equal(url, "/api/admin/episodes");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    throw new Error("Unexpected call count: " + calls.length);
  };

  try {
    globalThis.window = undefined;
    const response = await fetchProtectedAdminRoute("/api/admin/episodes", {
      method: "GET"
    });

    assert.equal(response.status, 200);
    assert.equal(calls.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test("fetchProtectedAdminRoute does not refresh for non-admin paths", async () => {
  __resetProtectedRouteFetchStateForTests();
  const calls = [];
  let redirectTarget = null;

  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push({ url });

    return new Response(null, { status: 401 });
  };

  try {
    globalThis.window = {
      location: {
        pathname: "/login",
        replace: (target) => {
          redirectTarget = target;
        }
      }
    };
    const response = await fetchProtectedAdminRoute("/api/auth/login", {
      method: "POST"
    });

    assert.equal(response.status, 401);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "/api/auth/login");
    assert.equal(redirectTarget, null);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test("fetchProtectedAdminRoute stops after failed refresh", async () => {
  __resetProtectedRouteFetchStateForTests();
  const calls = [];
  let redirectTarget = null;

  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push({ url });

    if (calls.length === 1) {
      assert.equal(url, "/api/admin/episodes");
      return new Response(null, { status: 401 });
    }

    if (calls.length === 2) {
      assert.equal(url, "/api/auth/refresh");
      return new Response(null, { status: 401 });
    }

    throw new Error("Unexpected call count: " + calls.length);
  };

  try {
    globalThis.window = {
      location: {
        pathname: "/team-members",
        replace: (target) => {
          redirectTarget = target;
        }
      }
    };
    const response = await fetchProtectedAdminRoute("/api/admin/episodes", {
      method: "GET"
    });

    assert.equal(response.status, 401);
    assert.equal(calls.length, 2);
    assert.equal(
      redirectTarget,
      "/login?reason=session-expired&from=%2Fteam-members"
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});
