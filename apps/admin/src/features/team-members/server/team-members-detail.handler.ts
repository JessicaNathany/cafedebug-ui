import { NextResponse } from "next/server";
import type { BackendTeamMembersApiResult } from "@/lib/api/team-members-admin-api";

import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import { addSentryBreadcrumb, captureException, logger, observabilityEvents } from "@/lib/observability";

import { parseTeamMemberRouteId } from "../parsers";
import { createTeamMembersErrorResponse } from "./team-members-error-response";

const ENDPOINT = "/api/v1/admin/team-members/{id}";
const METHOD = "GET";
type TeamMemberRouteContext = { params: Promise<{ id: string }> };

type DetailHandlerDependencies = { getTeamMemberFromBackend: (input: { cookieHeader: string; id: number }) => Promise<BackendTeamMembersApiResult> };

export async function teamMembersDetailHandler(request: Request, context: TeamMemberRouteContext, dependencies?: DetailHandlerDependencies) {
  const { id: rawId } = await context.params;
  const id = parseTeamMemberRouteId(rawId);
  if (!id) return createTeamMembersErrorResponse({ status: 400, title: "Bad Request", detail: "Team member id must be a positive integer.", setCookieHeaders: [] });

  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin team member detail request", { category: "team-members", data: { module: "team-members", action: "detail", endpoint: ENDPOINT, method: METHOD, id } });
  try {
    const adapter = dependencies?.getTeamMemberFromBackend ?? (await import("@/lib/api/team-members-admin-api")).getTeamMemberFromBackend;
    const result = await adapter({ cookieHeader, id });
    if ("error" in result) {
      logger.warn(observabilityEvents.apiRequestFailed, { module: "team-members", action: "detail", endpoint: ENDPOINT, method: METHOD, status: result.error.status, ...(result.traceId ? { traceId: result.traceId } : {}) });
      return createTeamMembersErrorResponse({ status: result.error.status, title: result.error.title, detail: result.error.detail, ...(result.traceId ? { traceId: result.traceId } : {}), setCookieHeaders: result.setCookieHeaders });
    }
    const response = NextResponse.json({ ok: true, data: result.data, ...(result.traceId ? { traceId: result.traceId } : {}) }, { status: result.status });
    appendSetCookieHeaders(response, result.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, { module: "team-members", action: "detail", endpoint: ENDPOINT, method: METHOD, status: 503 });
    captureException(error, { scope: { tags: { module: "team-members", action: "detail" }, level: "error" }, context: { endpoint: ENDPOINT, method: METHOD, status: 503 } });
    return createTeamMembersErrorResponse({ status: 503, title: "Service Unavailable", detail: "Unable to load this team member right now.", setCookieHeaders: [] });
  }
}
