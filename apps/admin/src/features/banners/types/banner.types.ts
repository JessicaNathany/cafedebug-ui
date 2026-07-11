import type { BannerRequest, NormalizedApiError } from "@cafedebug/api-client";

export type BannerEditorMode = "new" | "edit";
export type BannerMutationAction = "save-draft" | "publish";
export type BannerEditorPageState =
  | "invalid-id"
  | "loading"
  | "fetch-error"
  | "editor-ready";

export type BannerRequestPayload = Omit<BannerRequest, "endDate"> & {
  endDate?: string | null;
};

export type BannerRecord = {
  id: number;
  name: string;
  urlImage: string;
  url: string;
  startDate: string;
  endDate: string;
  active: boolean;
  order: number | null;
};

export type BannersQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
};

export type BannerListItem = {
  id: number | null;
  name: string;
  urlImage: string;
  url: string;
  startDate: string;
  endDate: string;
  updateDate: string;
  active: boolean;
  order: number | null;
};

export type BannersPageData = {
  items: BannerListItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sortBy: string;
  descending: boolean;
};

export type BannerMutationResult = {
  id?: number;
  active?: boolean;
  order?: number | null;
  status?: number;
  traceId?: string;
};

export type BannerImageUploadResult = {
  imageUrl: string;
  status?: number;
  traceId?: string;
};

export type BannerRouteError = NormalizedApiError;
