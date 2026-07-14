import { NextRequest, NextResponse } from "next/server";

import {
  appendSetCookieHeaders,
  clearKnownAuthCookies,
  hasSessionSignalCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setSessionCookie
} from "@/lib/auth/next-response-cookies";
import {
  AUTH_ROUTE_RULES,
  getRouteProtectionRedirect,
  isProtectedAdminPath
} from "@/lib/auth/route-rules.js";
import {
  knownAccessCookieNames,
  knownRefreshCookieNames
} from "@/lib/auth/session-constants";
import type { TokenEnvelope } from "@/features/auth/types/auth.types";
import { validateSessionWithSingleRefresh } from "@/lib/auth/session-strategy.js";
import { adminRuntimeEnv } from "@/lib/env";
import { captureException, logger, observabilityEvents } from "@/lib/observability";

const sessionProbePath = "/api/v1/admin/episodes?page=1&pageSize=1";
const refreshPath = "/api/v1/admin/auth/refresh-token";

type SessionValidation = {
  status: "authenticated" | "unauthenticated" | "error";
  reason?: string;
  setCookieHeaders: string[];
  tokenEnvelope?: TokenEnvelope;
};

const toLoginRedirect = (request: NextRequest, reason: string) => {
  const loginUrl = new URL(AUTH_ROUTE_RULES.login, request.url);

  loginUrl.searchParams.set("reason", reason);

  if (request.nextUrl.pathname !== AUTH_ROUTE_RULES.login) {
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
  }

  const response = NextResponse.redirect(loginUrl);
  clearKnownAuthCookies(response);

  return response;
};

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestingProtectedRoute = isProtectedAdminPath(pathname);
  const requestingLoginRoute = pathname === AUTH_ROUTE_RULES.login;

  if (!requestingProtectedRoute && !requestingLoginRoute) {
    return NextResponse.next();
  }

  const hasSessionCookieSignal = hasSessionSignalCookie(request);

  if (requestingProtectedRoute && !hasSessionCookieSignal) {
    logger.info(observabilityEvents.proxySessionRedirect, {
      module: "proxy",
      action: "route-protection",
      pathname,
      reason: "session-required"
    });

    return toLoginRedirect(request, "session-required");
  }

  if (requestingLoginRoute && !hasSessionCookieSignal) {
    return NextResponse.next();
  }

  const sessionValidation = (await validateSessionWithSingleRefresh({
    baseUrl: adminRuntimeEnv.apiBaseUrl,
    cookieHeader: request.headers.get("cookie") ?? "",
    accessCookieNames: knownAccessCookieNames,
    refreshCookieNames: knownRefreshCookieNames,
    refreshPath,
    sessionProbePath
  })) as SessionValidation;

  if (sessionValidation.status === "authenticated") {
    const redirectTarget = getRouteProtectionRedirect({
      pathname,
      isAuthenticated: true
    });

    if (redirectTarget) {
      logger.info(observabilityEvents.proxySessionRedirect, {
        module: "proxy",
        action: "route-protection",
        pathname,
        redirectTarget,
        reason: "already-authenticated"
      });

      const response = NextResponse.redirect(new URL(redirectTarget, request.url));
      appendSetCookieHeaders(response, sessionValidation.setCookieHeaders);
      if (sessionValidation.tokenEnvelope) {
        setAccessTokenCookie(
          response,
          sessionValidation.tokenEnvelope.accessToken,
          sessionValidation.tokenEnvelope.expiresIn
        );
        setRefreshTokenCookie(
          response,
          sessionValidation.tokenEnvelope.refreshToken.token,
          sessionValidation.tokenEnvelope.refreshToken.expirationDate
        );
      }
      setSessionCookie(response);
      return response;
    }

    const response = NextResponse.next();
    appendSetCookieHeaders(response, sessionValidation.setCookieHeaders);
    if (sessionValidation.tokenEnvelope) {
      setAccessTokenCookie(
        response,
        sessionValidation.tokenEnvelope.accessToken,
        sessionValidation.tokenEnvelope.expiresIn
      );
      setRefreshTokenCookie(
        response,
        sessionValidation.tokenEnvelope.refreshToken.token,
        sessionValidation.tokenEnvelope.refreshToken.expirationDate
      );
    }
    setSessionCookie(response);

    return response;
  }

  if (requestingLoginRoute) {
    const response = NextResponse.next();
    appendSetCookieHeaders(response, sessionValidation.setCookieHeaders);
    clearKnownAuthCookies(response);

    return response;
  }

  const reason =
    sessionValidation.status === "error"
      ? "session-check-failed"
      : "session-expired";

  if (sessionValidation.status === "error") {
    const sessionValidationError = new Error(
      `Session validation failed for ${pathname}`
    );

    logger.error(observabilityEvents.proxySessionValidationError, {
      module: "proxy",
      action: "route-protection",
      pathname,
      reason: sessionValidation.reason ?? reason
    });

    captureException(sessionValidationError, {
      scope: {
        tags: {
          module: "proxy",
          action: "route-protection"
        },
        level: "error"
      },
      context: {
        pathname,
        reason: sessionValidation.reason ?? reason
      }
    });
  } else {
    logger.info(observabilityEvents.proxySessionRedirect, {
      module: "proxy",
      action: "route-protection",
      pathname,
      reason
    });
  }

  return toLoginRedirect(request, reason);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/episodes/:path*",
    "/banners/:path*",
    "/settings/:path*",
    "/login"
  ]
};
