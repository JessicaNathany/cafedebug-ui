import type { BannerEditorSchemaValues } from "./schemas/banner.schema";
import type { BannersQueryParams } from "./types/banner.types";

export const bannersListDefaultParams: BannersQueryParams = {
  page: 1,
  pageSize: 5,
  sortBy: "order",
  descending: false
};

export const bannerEditorDefaultValues: BannerEditorSchemaValues = {
  name: "",
  urlImage: "",
  url: "",
  startDate: "",
  endDate: ""
};
