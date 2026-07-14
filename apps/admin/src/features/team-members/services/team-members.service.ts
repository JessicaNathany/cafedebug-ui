"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import { parseTeamMemberRecord, parseTeamMembersPageData } from "../parsers";
import type { TeamMemberRecord, TeamMemberRequestPayload, TeamMembersPageData, TeamMembersQueryParams, TeamMembersRouteError } from "../types/team-member.types";

type ApiEnvelope<TData> = { ok: true; data: TData; traceId?: string } | { ok: false; error: TeamMembersRouteError };

const parseJson = async (response: Response): Promise<unknown> => {
  try { return await response.json(); } catch { return undefined; }
};

const toRouteError = (payload: unknown, fallbackStatus: number): TeamMembersRouteError => {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof (payload as { error?: unknown }).error === "object") {
    const error = (payload as { error: Record<string, unknown> }).error;
    return {
      status: typeof error.status === "number" ? error.status : fallbackStatus,
      title: typeof error.title === "string" && error.title.trim() ? error.title : "Request Failed",
      detail: typeof error.detail === "string" && error.detail.trim() ? error.detail : "Request failed.",
      ...(typeof error.traceId === "string" && error.traceId.trim() ? { traceId: error.traceId } : {})
    };
  }
  return { status: fallbackStatus, title: "Request Failed", detail: "Unable to complete the request." };
};

const fetchTeamMembersApi = async <TData>(input: string, init?: RequestInit): Promise<ApiEnvelope<TData>> => {
  const response = await fetchProtectedAdminRoute(input, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const payload = await parseJson(response);
  if (!response.ok) return { ok: false, error: toRouteError(payload, response.status) };
  const envelope = payload as { data?: TData; traceId?: string } | undefined;
  return { ok: true, data: (envelope?.data as TData) ?? ({} as TData), ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {}) };
};

const fetchTeamMemberEditorApi = async <TData>(input: string, init?: RequestInit): Promise<ApiEnvelope<TData>> => {
  const response = await fetchProtectedAdminRoute(input, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const payload = await parseJson(response);
  if (!response.ok || (typeof payload === "object" && payload !== null && "ok" in payload && (payload as { ok?: unknown }).ok === false)) {
    return { ok: false, error: toRouteError(payload, response.status || 503) };
  }
  const envelope = payload as { data?: TData; traceId?: string } | undefined;
  return { ok: true, data: (envelope?.data as TData) ?? ({} as TData), ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {}) };
};

const toSearchParams = (params: TeamMembersQueryParams): URLSearchParams => {
  const query = new URLSearchParams();
  query.set("page", String(params.page)); query.set("pageSize", String(params.pageSize)); query.set("sortBy", params.sortBy); query.set("descending", String(params.descending));
  if (params.search) query.set("search", params.search);
  return query;
};

export const teamMembersQueryKeys = Object.freeze({
  all: ["team-members"] as const,
  list: (params: TeamMembersQueryParams) => ["team-members", "list", params] as const,
  detail: (id: number) => ["team-members", "detail", id] as const
});

export const fetchTeamMembersPage = async (params: TeamMembersQueryParams): Promise<TeamMembersPageData> => {
  const response = await fetchTeamMembersApi<unknown>(`/api/admin/team-members?${toSearchParams(params)}`);
  if (!response.ok) throw response.error;
  return parseTeamMembersPageData(response.data, params);
};

export const fetchTeamMemberById = async (id: number): Promise<TeamMemberRecord> => {
  const response = await fetchTeamMemberEditorApi<unknown>(`/api/admin/team-members/${id}`);
  if (!response.ok) throw response.error;
  const record = parseTeamMemberRecord(response.data, id);
  if (!record) throw { status: 404, title: "Team member not found", detail: "Unable to parse the team member record." } satisfies TeamMembersRouteError;
  return record;
};

export const createTeamMember = async (payload: TeamMemberRequestPayload): Promise<TeamMemberRecord> => {
  const response = await fetchTeamMemberEditorApi<unknown>("/api/admin/team-members", { method: "POST", body: JSON.stringify(payload) });
  if (!response.ok) throw response.error;
  const record = parseTeamMemberRecord(response.data);
  if (!record) throw { status: 503, title: "Invalid response", detail: "The created team member response was invalid." } satisfies TeamMembersRouteError;
  return record;
};

export const updateTeamMember = async ({ id, payload }: { id: number; payload: TeamMemberRequestPayload }): Promise<TeamMemberRecord> => {
  const response = await fetchTeamMemberEditorApi<unknown>(`/api/admin/team-members/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  if (!response.ok) throw response.error;
  const record = parseTeamMemberRecord(response.data, id);
  if (!record) throw { status: 503, title: "Invalid response", detail: "The updated team member response was invalid." } satisfies TeamMembersRouteError;
  return record;
};
