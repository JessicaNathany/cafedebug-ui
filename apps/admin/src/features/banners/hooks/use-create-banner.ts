"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bannersQueryKeys, createBanner } from "../services/banners.service";
import type {
  BannerRouteError,
  BannerMutationResult,
  BannerRequestPayload
} from "../types/banner.types";

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<BannerMutationResult, BannerRouteError, BannerRequestPayload>({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.all });
    }
  });
};
