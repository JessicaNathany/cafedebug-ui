import { NextResponse } from "next/server";

import { listEpisodesFromBackend } from "@/lib/api/episodes-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { createEpisodesErrorResponse } from "./episodes-error-response";

const ENDPOINT = "/api/v1/admin/episodes";

const parseInteger = (value: string | null, fallbackValue: number): number => {
  if (!value) return fallbackValue;
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
};

const parseBoolean = (value: string | null, fallbackValue: boolean): boolean => {
  if (typeof value !== "string") return fallbackValue;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return fallbackValue;
};

export async function episodesListHandler(request: Request) {
  const requestUrl = new URL(request.url);
  const page = parseInteger(requestUrl.searchParams.get("page"), 1);
  const pageSize = parseInteger(requestUrl.searchParams.get("pageSize"), 5);
  const sortBy = requestUrl.searchParams.get("sortBy")?.trim() || "number";
  const descending = parseBoolean(requestUrl.searchParams.get("descending"), true);
  const search = requestUrl.searchParams.get("search")?.trim() || undefined;
  const cookieHeader = request.headers.get("cookie") ?? "";

  addSentryBreadcrumb("Admin episodes list request", {
    category: "episodes",
    data: { module: "episodes", action: "list", page, pageSize, sortBy, descending, search }
  });

  try {
    const backendResult = await listEpisodesFromBackend({
      cookieHeader,
      query: { page, pageSize, sortBy, descending, ...(search ? { search } : {}) }
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.episodesFetchFailed, {
        module: "episodes",
        action: "list",
        endpoint: ENDPOINT,
        status: backendResult.error.status,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      });

      return createEpisodesErrorResponse({
        status: backendResult.error.status,
        title: backendResult.error.title,
        detail: backendResult.error.detail,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {}),
        setCookieHeaders: backendResult.setCookieHeaders
      });
    }

    const response = NextResponse.json(
      {
        ok: true,
        data: backendResult.data,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      },
      { status: backendResult.status }
    );

    appendSetCookieHeaders(response, backendResult.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.episodesFetchFailed, {
      module: "episodes", action: "list", endpoint: ENDPOINT, status: 503
    });

    captureException(error, {
      scope: { tags: { module: "episodes", action: "list" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createEpisodesErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to load episodes right now.",
      setCookieHeaders: []
    });
  }
}
