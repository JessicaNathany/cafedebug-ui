import type { BannerRequest } from "@cafedebug/api-client";
import { NextResponse } from "next/server";

import { updateBannerInBackend } from "@/lib/api/banners-admin-api";
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

export async function bannersUpdateHandler(
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
  addSentryBreadcrumb("Admin banner update request", {
    category: "banners",
    data: { module: "banners", action: "update", id: bannerId }
  });

  try {
    const requestBody = (await request.json()) as BannerRequest;
    const backendResult = await updateBannerInBackend({
      cookieHeader,
      id: bannerId,
      payload: requestBody
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "banners",
        action: "update",
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

    logger.info(observabilityEvents.bannersActionExecuted, {
      module: "banners",
      action: "update",
      status: backendResult.status,
      ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
    });

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
      action: "update",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "banners", action: "update" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createBannersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to update this banner right now.",
      setCookieHeaders: []
    });
  }
}
