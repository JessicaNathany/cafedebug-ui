"use client";

import { useQuery } from "@tanstack/react-query";

import { bannersQueryKeys, fetchBannerById } from "../services/banners.service";

export const useBannerById = (id: number | null) =>
  useQuery({
    queryKey: id ? bannersQueryKeys.detail(id) : ["banners", "new"],
    queryFn: async () => {
      if (!id) return null;
      return fetchBannerById(id);
    },
    enabled: Boolean(id)
  });
