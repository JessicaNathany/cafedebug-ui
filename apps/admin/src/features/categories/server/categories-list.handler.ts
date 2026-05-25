import { NextResponse } from "next/server";

import { listCategoriesFromBackend } from "@/lib/api/categories-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { createCategoriesErrorResponse } from "./categories-error-response";

const ENDPOINT = "/api/v1/admin/categories";

const parseInteger = (value: string | null, fallbackValue: number): number => {
  if (!value) return fallbackValue;
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
};

export async function categoriesListHandler(request: Request) {
  const requestUrl = new URL(request.url);
  const page = parseInteger(requestUrl.searchParams.get("page"), 1);
  const pageSize = parseInteger(requestUrl.searchParams.get("pageSize"), 100);
  const cookieHeader = request.headers.get("cookie") ?? "";

  addSentryBreadcrumb("Admin categories list request", {
    category: "categories",
    data: { module: "categories", action: "list", page, pageSize }
  });

  try {
    const backendResult = await listCategoriesFromBackend({
      cookieHeader,
      query: { page, pageSize }
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.categoriesFetchFailed, {
        module: "categories",
        action: "list",
        endpoint: ENDPOINT,
        status: backendResult.error.status,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      });

      return createCategoriesErrorResponse({
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
    logger.error(observabilityEvents.categoriesFetchFailed, {
      module: "categories", action: "list", endpoint: ENDPOINT, status: 503
    });

    captureException(error, {
      scope: { tags: { module: "categories", action: "list" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createCategoriesErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to load categories right now.",
      setCookieHeaders: []
    });
  }
}
