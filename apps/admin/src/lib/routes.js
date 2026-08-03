export const appRoutes = Object.freeze({
  login: "/login",
  episodes: "/episodes",
  newEpisode: "/episodes/new",
  editEpisode: (id) => `/episodes/${id}/edit`,
  banners: "/banners",
  newBanner: "/banners/new",
  editBanner: (id) => `/banners/${id}/edit`,
  teamMembers: "/team-members",
  newTeamMember: "/team-members/new",
  editTeamMember: (id) => `/team-members/${id}/edit`,
  dashboard: "/dashboard",
  settings: "/settings"
});

export const postLoginRedirectRoute = appRoutes.episodes;