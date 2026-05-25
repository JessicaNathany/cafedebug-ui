import type { NormalizedApiError, EpisodeRequest } from "@cafedebug/api-client";

export type EpisodeRequestPayload = EpisodeRequest;

export const episodeStatuses = ["draft", "scheduled", "published", "archived"] as const;

export type EpisodeStatus = (typeof episodeStatuses)[number];
export type EpisodeDisplayStatus = EpisodeStatus | "unknown";


export type EpisodeRecord = {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  url: string;
  imageUrl: string;
  tags: string[];
  publishedAt: string;
  status: EpisodeDisplayStatus;
  number: number | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type EpisodesQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
  search?: string;
};

export type EpisodesPageData = {
  items: EpisodeRecord[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sortBy: string;
  descending: boolean;
};

export type EpisodeEditorFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string;
  publishedAt: string;
  number: string;
  categoryId: string;
};

export type EpisodeMutationAction = "save-draft" | "archive" | "publish";

export type EpisodesMutationResult = {
  id?: number;
};

export type AdminRouteError = NormalizedApiError;
