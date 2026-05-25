import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  withBackendAuthHeaders,
  toConfigurationErrorResult,
  normalizeBackendResult
} from "./backend-api.utils";

export type BackendCategoriesQuery = {
  page?: number;
  pageSize?: number;
};

export type BackendCategoryApiResult = BackendApiResult;

export const listCategoriesFromBackend = async ({
  cookieHeader,
  query
}: {
  cookieHeader: string;
  query: BackendCategoriesQuery;
}): Promise<BackendCategoryApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.categories.list(query, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};
