import type { BannerRequest } from "@cafedebug/api-client";
import { NextResponse } from "next/server";

import { createBannerInBackend } from "@/lib/api/banners-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { createBannersErrorResponse } from "./banners-error-response";

const ENDPOINT = "/api/v1/admin/banners";

export async function bannersCreateHandler(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin banner create request", {
    category: "banners",
    data: { module: "banners", action: "create" }
  });

  try {
    const requestBody = (await request.json()) as BannerRequest;
    const backendResult = await createBannerInBackend({
      cookieHeader,
      payload: requestBody
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "banners",
        action: "create",
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
      action: "create",
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
      action: "create",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "banners", action: "create" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createBannersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to create banner right now.",
      setCookieHeaders: []
    });
  }
}
