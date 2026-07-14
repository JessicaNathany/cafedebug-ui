export const appRoutes = {
  login: "/login",
  episodes: "/episodes",
  newEpisode: "/episodes/new",
  editEpisode: (id: string) => `/episodes/${id}/edit`,
  banners: "/banners",
  newBanner: "/banners/new",
  editBanner: (id: string) => `/banners/${id}/edit`,
  dashboard: "/dashboard",
  settings: "/settings"
} as const;

export const postLoginRedirectRoute = appRoutes.episodes;
