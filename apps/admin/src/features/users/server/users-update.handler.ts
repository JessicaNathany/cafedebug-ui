import { NextResponse } from "next/server";

import type {
  BackendUsersApiResult,
  UserMutationInput
} from "@/lib/api/users-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { parseUserRouteId } from "../parsers";
import { createUsersErrorResponse } from "./users-error-response";

const ENDPOINT = "/api/v1/admin/users/{id}";
const METHOD = "PUT";
type UserRouteContext = { params: Promise<{ id: string }> };

type UpdateHandlerDependencies = {
  updateUserInBackend: (input: {
    cookieHeader: string;
    id: number;
    payload: UserMutationInput;
  }) => Promise<BackendUsersApiResult>;
};

export async function usersUpdateHandler(
  request: Request,
  context: UserRouteContext,
  dependencies?: UpdateHandlerDependencies
) {
  const { id: rawId } = await context.params;
  const id = parseUserRouteId(rawId);

  if (!id) {
    return createUsersErrorResponse({
      status: 400,
      title: "Bad Request",
      detail: "User id must be a positive integer.",
      setCookieHeaders: []
    });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin user update request", {
    category: "users",
    data: { module: "users", action: "update", endpoint: ENDPOINT, method: METHOD, id }
  });

  try {
    const payload = (await request.json()) as UserMutationInput;
    const adapter =
      dependencies?.updateUserInBackend ??
      (await import("@/lib/api/users-admin-api")).updateUserInBackend;
    const result = await adapter({ cookieHeader, id, payload });

    if ("error" in result) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "users",
        action: "update",
        endpoint: ENDPOINT,
        method: METHOD,
        status: result.error.status,
        ...(result.traceId ? { traceId: result.traceId } : {})
      });

      return createUsersErrorResponse({
        status: result.error.status,
        title: result.error.title,
        detail: result.error.detail,
        ...(result.traceId ? { traceId: result.traceId } : {}),
        setCookieHeaders: result.setCookieHeaders
      });
    }

    const response = NextResponse.json(
      {
        ok: true,
        data: result.data,
        ...(result.traceId ? { traceId: result.traceId } : {})
      },
      { status: result.status }
    );
    appendSetCookieHeaders(response, result.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, {
      module: "users",
      action: "update",
      endpoint: ENDPOINT,
      method: METHOD,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "users", action: "update" }, level: "error" },
      context: { endpoint: ENDPOINT, method: METHOD, status: 503 }
    });

    return createUsersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to update this user right now.",
      setCookieHeaders: []
    });
  }
}
