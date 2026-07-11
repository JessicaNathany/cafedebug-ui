"use client";

import { useMutation } from "@tanstack/react-query";

import { uploadBannerImage } from "../services/banners.service";
import type {
  BannerImageUploadResult,
  BannerRouteError
} from "../types/banner.types";

type UploadBannerImageInput = {
  base64: string;
  fileName: string;
};

export const useUploadBannerImage = () =>
  useMutation<BannerImageUploadResult, BannerRouteError, UploadBannerImageInput>({
    mutationFn: uploadBannerImage
  });
