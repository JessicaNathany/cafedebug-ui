import { NextResponse } from "next/server";
import type { TeamMemberRequest } from "@cafedebug/api-client";
import type { BackendTeamMembersApiResult, TeamMemberMutationInput } from "@/lib/api/team-members-admin-api";

import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import { addSentryBreadcrumb, captureException, logger, observabilityEvents } from "@/lib/observability";

import { parseTeamMemberRouteId } from "../parsers";
import { createTeamMembersErrorResponse } from "./team-members-error-response";

const ENDPOINT = "/api/v1/admin/team-members/{id}";
const METHOD = "PUT";
type TeamMemberRouteContext = { params: Promise<{ id: string }> };

type UpdateHandlerDependencies = { updateTeamMemberInBackend: (input: { cookieHeader: string; id: number; payload: TeamMemberMutationInput }) => Promise<BackendTeamMembersApiResult> };

export async function teamMembersUpdateHandler(request: Request, context: TeamMemberRouteContext, dependencies?: UpdateHandlerDependencies) {
  const { id: rawId } = await context.params;
  const id = parseTeamMemberRouteId(rawId);
  if (!id) return createTeamMembersErrorResponse({ status: 400, title: "Bad Request", detail: "Team member id must be a positive integer.", setCookieHeaders: [] });

  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin team member update request", { category: "team-members", data: { module: "team-members", action: "update", endpoint: ENDPOINT, method: METHOD, id } });
  try {
    const payload = (await request.json()) as TeamMemberRequest;
    const adapter = dependencies?.updateTeamMemberInBackend ?? (await import("@/lib/api/team-members-admin-api")).updateTeamMemberInBackend;
    const result = await adapter({ cookieHeader, id, payload });
    if ("error" in result) {
      logger.warn(observabilityEvents.apiRequestFailed, { module: "team-members", action: "update", endpoint: ENDPOINT, method: METHOD, status: result.error.status, ...(result.traceId ? { traceId: result.traceId } : {}) });
      return createTeamMembersErrorResponse({ status: result.error.status, title: result.error.title, detail: result.error.detail, ...(result.traceId ? { traceId: result.traceId } : {}), setCookieHeaders: result.setCookieHeaders });
    }
    const response = NextResponse.json({ ok: true, data: result.data, ...(result.traceId ? { traceId: result.traceId } : {}) }, { status: result.status });
    appendSetCookieHeaders(response, result.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, { module: "team-members", action: "update", endpoint: ENDPOINT, method: METHOD, status: 503 });
    captureException(error, { scope: { tags: { module: "team-members", action: "update" }, level: "error" }, context: { endpoint: ENDPOINT, method: METHOD, status: 503 } });
    return createTeamMembersErrorResponse({ status: 503, title: "Service Unavailable", detail: "Unable to update this team member right now.", setCookieHeaders: [] });
  }
}
