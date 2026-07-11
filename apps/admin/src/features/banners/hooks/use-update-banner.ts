"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bannersQueryKeys, updateBanner } from "../services/banners.service";
import type {
  BannerRouteError,
  BannerMutationResult,
  BannerRequestPayload
} from "../types/banner.types";

type UpdateBannerInput = {
  id: number;
  payload: BannerRequestPayload;
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<BannerMutationResult, BannerRouteError, UpdateBannerInput>({
    mutationFn: updateBanner,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.all });
    }
  });
};
