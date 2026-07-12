import type { NormalizedApiError } from "@cafedebug/api-client";

export type TeamMembersQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
  search?: string;
};

export type TeamMemberListItem = {
  id: number | null;
  name: string;
  email: string;
  podcastRole: string;
  gitHubUrl: string;
  linkedInUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeamMembersPageData = {
  items: TeamMemberListItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sortBy: string;
  descending: boolean;
};

export type TeamMembersRouteError = NormalizedApiError;