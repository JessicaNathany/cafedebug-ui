import type {
  BannerEditorPageState,
  BannerRouteError
} from "./types/banner.types";

export const resolveBannerEditorPageState = ({
  isInvalidBannerId,
  isLoading,
  loadError
}: {
  isInvalidBannerId: boolean;
  isLoading: boolean;
  loadError: BannerRouteError | null;
}): BannerEditorPageState => {
  if (isInvalidBannerId) {
    return "invalid-id";
  }

  if (isLoading) {
    return "loading";
  }

  if (loadError) {
    return "fetch-error";
  }

  return "editor-ready";
};
