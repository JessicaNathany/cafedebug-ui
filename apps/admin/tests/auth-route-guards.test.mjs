import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTH_ROUTE_RULES,
  getRouteProtectionRedirect,
  isProtectedAdminPath
} from "../src/lib/auth/route-rules.js";
import { validateSessionWithSingleRefresh } from "../src/lib/auth/session-strategy.js";

const readCookieHeader = (headers) => {
  if (!headers) {
    return "";
  }

  if (headers instanceof Headers) {
    return headers.get("cookie") ?? "";
  }

  if (typeof headers.cookie === "string") {
    return headers.cookie;
  }

  return "";
};

const readAuthorizationHeader = (headers) => {
  if (!headers) {
    return "";
  }

  if (headers instanceof Headers) {
    return headers.get("authorization") ?? "";
  }

  if (typeof headers.Authorization === "string") {
    return headers.Authorization;
  }

  if (typeof headers.authorization === "string") {
    return headers.authorization;
  }

  return "";
};

test("auth route rules enforce episodes-first redirects", () => {
  assert.equal(AUTH_ROUTE_RULES.login, "/login");
  assert.equal(AUTH_ROUTE_RULES.postLogin, "/episodes");
});

test("protected admin routes include episodes/banners/dashboard/settings paths", () => {
  assert.equal(isProtectedAdminPath("/episodes"), true);
  assert.equal(isProtectedAdminPath("/episodes/new"), true);
  assert.equal(isProtectedAdminPath("/banners"), true);
  assert.equal(isProtectedAdminPath("/banners/new"), true);
  assert.equal(isProtectedAdminPath("/dashboard"), true);
  assert.equal(isProtectedAdminPath("/settings"), true);
  assert.equal(isProtectedAdminPath("/login"), false);
  assert.equal(isProtectedAdminPath("/"), false);
});

test("route protection redirects anonymous and authenticated users correctly", () => {
  assert.equal(
    getRouteProtectionRedirect({
      pathname: "/login",
      isAuthenticated: true
    }),
    "/episodes"
  );

  assert.equal(
    getRouteProtectionRedirect({
      pathname: "/episodes/new",
      isAuthenticated: false
    }),
    "/login"
  );

  assert.equal(
    getRouteProtectionRedirect({
      pathname: "/banners/new",
      isAuthenticated: false
    }),
    "/login"
  );

  assert.equal(
    getRouteProtectionRedirect({
      pathname: "/episodes",
      isAuthenticated: true
    }),
    null
  );
});

test("single refresh attempt retries exactly once after a 401", async () => {
  const fetchCalls = [];

  const fetchMock = async (url, init) => {
    fetchCalls.push({ url, init });

    if (fetchCalls.length === 1) {
      assert.equal(
        readAuthorizationHeader(init?.headers),
        "Bearer stale-token"
      );
      assert.equal(readCookieHeader(init?.headers), "");
      return new Response(null, { status: 401 });
    }

    if (fetchCalls.length === 2) {
      assert.equal(readAuthorizationHeader(init?.headers), "");
      assert.equal(readCookieHeader(init?.headers), "");
      return new Response(
        JSON.stringify({
          accessToken: "rotated-token",
          refreshToken: {
            token: "rotated-refresh",
            expirationDate: "2026-04-13T00:00:00.000Z"
          },
          tokenType: "Bearer",
          expiresIn: 3600
        }),
        { status: 201, headers: new Headers({ "content-type": "application/json" }) }
      );
    }

    if (fetchCalls.length === 3) {
      assert.equal(
        readAuthorizationHeader(init?.headers),
        "Bearer rotated-token"
      );
      assert.equal(readCookieHeader(init?.headers), "");
      return new Response(null, { status: 200 });
    }

    throw new Error(`Unexpected call count: ${fetchCalls.length}`);
  };

  const result = await validateSessionWithSingleRefresh({
    fetchImpl: fetchMock,
    accessCookieNames: ["accessToken"],
    baseUrl: "http://api.local",
    cookieHeader: "accessToken=stale-token; refreshToken=refresh-value",
    refreshCookieNames: ["refreshToken"],
    refreshPath: "/refresh",
    sessionProbePath: "/probe"
  });

  assert.equal(result.status, "authenticated");
  assert.equal(result.refreshAttempted, true);
  assert.equal(fetchCalls.length, 3);
});

test("single refresh attempt stops when refresh fails", async () => {
  const fetchCalls = [];

  const fetchMock = async (url, init) => {
    fetchCalls.push({ url, init });

    if (fetchCalls.length === 1) {
      assert.equal(readAuthorizationHeader(init?.headers), "");
      assert.equal(readCookieHeader(init?.headers), "");
      return new Response(null, { status: 401 });
    }

    if (fetchCalls.length === 2) {
      assert.equal(readAuthorizationHeader(init?.headers), "");
      assert.equal(readCookieHeader(init?.headers), "");
      return new Response(null, { status: 401 });
    }

    throw new Error(`Unexpected call count: ${fetchCalls.length}`);
  };

  const result = await validateSessionWithSingleRefresh({
    fetchImpl: fetchMock,
    accessCookieNames: ["accessToken"],
    baseUrl: "http://api.local",
    cookieHeader: "refreshToken=refresh-value",
    refreshCookieNames: ["refreshToken"],
    refreshPath: "/refresh",
    sessionProbePath: "/probe"
  });

  assert.equal(result.status, "unauthenticated");
  assert.equal(result.refreshAttempted, true);
  assert.equal(fetchCalls.length, 2);
});
