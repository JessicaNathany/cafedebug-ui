import { NextResponse } from "next/server";

import { getBannerFromBackend } from "@/lib/api/banners-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { createBannersErrorResponse } from "./banners-error-response";

const ENDPOINT = "/api/v1/admin/banners/{id}";

const toBannerId = (value: string): number | null => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

export async function bannersDetailHandler(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const bannerId = toBannerId(id);

  if (!bannerId) {
    return createBannersErrorResponse({
      status: 400,
      title: "Bad Request",
      detail: "Banner id must be a positive integer.",
      setCookieHeaders: []
    });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  addSentryBreadcrumb("Admin banner detail request", {
    category: "banners",
    data: { module: "banners", action: "detail", id: bannerId }
  });

  try {
    const backendResult = await getBannerFromBackend({
      cookieHeader,
      id: bannerId
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "banners",
        action: "detail",
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
      action: "detail",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "banners", action: "detail" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createBannersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to load this banner right now.",
      setCookieHeaders: []
    });
  }
}
