import type { GetApiV1AdminTeamMembersParams, TeamMemberRequest } from "@cafedebug/api-client";

import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  normalizeBackendResult,
  toConfigurationErrorResult,
  withBackendAuthHeaders
} from "./backend-api.utils";

export type BackendTeamMembersQuery = GetApiV1AdminTeamMembersParams;
export type BackendTeamMembersApiResult = BackendApiResult;
export type TeamMemberMutationInput = TeamMemberRequest;

export const listTeamMembersFromBackend = async ({ cookieHeader, query }: { cookieHeader: string; query: BackendTeamMembersQuery }): Promise<BackendTeamMembersApiResult> => {
  const adminClient = getAdminApiClient();
  if (!adminClient) return toConfigurationErrorResult();
  return normalizeBackendResult(await adminClient.teamMembers.list(query, { headers: withBackendAuthHeaders(cookieHeader) }));
};

export const getTeamMemberFromBackend = async ({ cookieHeader, id }: { cookieHeader: string; id: number }): Promise<BackendTeamMembersApiResult> => {
  const adminClient = getAdminApiClient();
  if (!adminClient) return toConfigurationErrorResult();
  return normalizeBackendResult(await adminClient.teamMembers.get(id, { headers: withBackendAuthHeaders(cookieHeader) }));
};

export const createTeamMemberInBackend = async ({ cookieHeader, payload }: { cookieHeader: string; payload: TeamMemberMutationInput }): Promise<BackendTeamMembersApiResult> => {
  const adminClient = getAdminApiClient();
  if (!adminClient) return toConfigurationErrorResult();
  return normalizeBackendResult(await adminClient.teamMembers.create(payload, { headers: withBackendAuthHeaders(cookieHeader) }));
};

export const updateTeamMemberInBackend = async ({ cookieHeader, id, payload }: { cookieHeader: string; id: number; payload: TeamMemberMutationInput }): Promise<BackendTeamMembersApiResult> => {
  const adminClient = getAdminApiClient();
  if (!adminClient) return toConfigurationErrorResult();
  return normalizeBackendResult(await adminClient.teamMembers.update(id, payload, { headers: withBackendAuthHeaders(cookieHeader) }));
};
