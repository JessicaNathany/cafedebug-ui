import type { NormalizedApiError } from "@cafedebug/api-client";

export type UsersQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
  search?: string;
};

export type UserListItem = {
  id: number | null;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersPageData = {
  items: UserListItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sortBy: string;
  descending: boolean;
};

export type UsersRouteError = NormalizedApiError;

export type UserMutationPayload = {
  name: string;
  email: string;
  password?: string;
};
