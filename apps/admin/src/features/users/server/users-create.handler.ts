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

import { createUsersErrorResponse } from "./users-error-response";

const ENDPOINT = "/api/v1/admin/users";
const METHOD = "POST";

type CreateHandlerDependencies = {
  createUserInBackend: (input: {
    cookieHeader: string;
    payload: UserMutationInput;
  }) => Promise<BackendUsersApiResult>;
};

export async function usersCreateHandler(
  request: Request,
  dependencies?: CreateHandlerDependencies
) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin users create request", {
    category: "users",
    data: { module: "users", action: "create", endpoint: ENDPOINT, method: METHOD }
  });

  try {
    const payload = (await request.json()) as UserMutationInput;
    const adapter =
      dependencies?.createUserInBackend ??
      (await import("@/lib/api/users-admin-api")).createUserInBackend;
    const result = await adapter({ cookieHeader, payload });

    if ("error" in result) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "users",
        action: "create",
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
      action: "create",
      endpoint: ENDPOINT,
      method: METHOD,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "users", action: "create" }, level: "error" },
      context: { endpoint: ENDPOINT, method: METHOD, status: 503 }
    });

    return createUsersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to create user right now.",
      setCookieHeaders: []
    });
  }
}
