import type { NormalizedApiError, TeamMemberRequest } from "@cafedebug/api-client";

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

/** Editor-only view of a TeamMemberResponse after nullable fields are made control-safe. */
export type TeamMemberRecord = {
  id: number;
  name: string;
  podcastRole: string;
  nickname: string;
  email: string;
  bio: string;
  jobTitle: string;
  gitHubUrl: string;
  linkedInUrl: string;
  profilePhotoUrl: string;
  joinedAt: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberRequestPayload = TeamMemberRequest;
export type TeamMemberMutationResult = TeamMemberRecord;
export type TeamMembersRouteError = NormalizedApiError;
