import { NextResponse } from "next/server";
import type { TeamMemberRequest } from "@cafedebug/api-client";
import type { BackendTeamMembersApiResult, TeamMemberMutationInput } from "@/lib/api/team-members-admin-api";

import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import { addSentryBreadcrumb, captureException, logger, observabilityEvents } from "@/lib/observability";

import { createTeamMembersErrorResponse } from "./team-members-error-response";

const ENDPOINT = "/api/v1/admin/team-members";
const METHOD = "POST";

type CreateHandlerDependencies = { createTeamMemberInBackend: (input: { cookieHeader: string; payload: TeamMemberMutationInput }) => Promise<BackendTeamMembersApiResult> };

export async function teamMembersCreateHandler(request: Request, dependencies?: CreateHandlerDependencies) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin team member create request", { category: "team-members", data: { module: "team-members", action: "create", endpoint: ENDPOINT, method: METHOD } });

  try {
    const payload = (await request.json()) as TeamMemberRequest;
    const adapter = dependencies?.createTeamMemberInBackend ?? (await import("@/lib/api/team-members-admin-api")).createTeamMemberInBackend;
    const result = await adapter({ cookieHeader, payload });
    if ("error" in result) {
      logger.warn(observabilityEvents.apiRequestFailed, { module: "team-members", action: "create", endpoint: ENDPOINT, method: METHOD, status: result.error.status, ...(result.traceId ? { traceId: result.traceId } : {}) });
      return createTeamMembersErrorResponse({ status: result.error.status, title: result.error.title, detail: result.error.detail, ...(result.traceId ? { traceId: result.traceId } : {}), setCookieHeaders: result.setCookieHeaders });
    }
    const response = NextResponse.json({ ok: true, data: result.data, ...(result.traceId ? { traceId: result.traceId } : {}) }, { status: result.status });
    appendSetCookieHeaders(response, result.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, { module: "team-members", action: "create", endpoint: ENDPOINT, method: METHOD, status: 503 });
    captureException(error, { scope: { tags: { module: "team-members", action: "create" }, level: "error" }, context: { endpoint: ENDPOINT, method: METHOD, status: 503 } });
    return createTeamMembersErrorResponse({ status: 503, title: "Service Unavailable", detail: "Unable to create team member right now.", setCookieHeaders: [] });
  }
}
