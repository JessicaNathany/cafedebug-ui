import type { GetApiV1AdminTeamMembersParams } from "@cafedebug/api-client";

import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  normalizeBackendResult,
  toConfigurationErrorResult,
  withBackendAuthHeaders
} from "./backend-api.utils";

export type BackendTeamMembersQuery = GetApiV1AdminTeamMembersParams;
export type BackendTeamMembersApiResult = BackendApiResult;

export const listTeamMembersFromBackend = async ({
  cookieHeader,
  query
}: {
  cookieHeader: string;
  query: BackendTeamMembersQuery;
}): Promise<BackendTeamMembersApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.teamMembers.list(query, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};