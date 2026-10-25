export const appRoutes = {
  login: "/login",
  episodes: "/episodes",
  newEpisode: "/episodes/new",
  editEpisode: (id: string) => `/episodes/${id}/edit`,
  banners: "/banners",
  newBanner: "/banners/new",
  editBanner: (id: string) => `/banners/${id}/edit`,
  teamMembers: "/team-members",
  newTeamMember: "/team-members/new",
  editTeamMember: (id: string) => `/team-members/${id}/edit`,
  users: "/users",
  newUser: "/users/new",
  editUser: (id: string) => `/users/${id}/edit`,
  dashboard: "/dashboard",
  settings: "/settings"
} as const;

export const postLoginRedirectRoute = appRoutes.users;