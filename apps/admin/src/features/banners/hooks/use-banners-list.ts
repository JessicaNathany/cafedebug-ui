"use client";

import { useQuery } from "@tanstack/react-query";

import { bannersQueryKeys, fetchBannersPage } from "../services/banners.service";
import type { BannersQueryParams } from "../types/banner.types";

export const useBannersList = (params: BannersQueryParams) =>
  useQuery({
    queryKey: bannersQueryKeys.list(params),
    queryFn: () => fetchBannersPage(params)
  });
