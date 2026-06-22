import { NextResponse } from "next/server";

import { listBannersFromBackend } from "@/lib/api/banners-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { bannersListDefaultParams } from "../defaults";
import { createBannersErrorResponse } from "./banners-error-response";

const ENDPOINT = "/api/v1/admin/banners";

const parseInteger = (value: string | null, fallbackValue: number): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
};

const parseBoolean = (value: string | null, fallbackValue: boolean): boolean => {
  if (typeof value !== "string") {
    return fallbackValue;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  return fallbackValue;
};

export async function bannersListHandler(request: Request) {
  const requestUrl = new URL(request.url);
  const page = parseInteger(requestUrl.searchParams.get("page"), bannersListDefaultParams.page);
  const pageSize = parseInteger(
    requestUrl.searchParams.get("pageSize"),
    bannersListDefaultParams.pageSize
  );
  const sortBy =
    requestUrl.searchParams.get("sortBy")?.trim() || bannersListDefaultParams.sortBy;
  const descending = parseBoolean(
    requestUrl.searchParams.get("descending"),
    bannersListDefaultParams.descending
  );
  const cookieHeader = request.headers.get("cookie") ?? "";

  addSentryBreadcrumb("Admin banners list request", {
    category: "banners",
    data: { module: "banners", action: "list", page, pageSize, sortBy, descending }
  });

  try {
    const backendResult = await listBannersFromBackend({
      cookieHeader,
      query: { page, pageSize, sortBy, descending }
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "banners",
        action: "list",
        endpoint: ENDPOINT,
        status: backendResult.error.status,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      });

      return createBannersErrorResponse({
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
    logger.error(observabilityEvents.apiRequestFailed, {
      module: "banners",
      action: "list",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "banners", action: "list" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createBannersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to load banners right now.",
      setCookieHeaders: []
    });
  }
}
