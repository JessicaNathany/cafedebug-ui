export const AUTH_ROUTE_RULES = Object.freeze({
  login: "/login",
  postLogin: "/users",
  protectedPrefixes: ["/dashboard", "/episodes", "/banners", "/team-members", "/users", "/settings"]
});

const normalizePathname = (pathname) => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const isProtectedAdminPath = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);

  return AUTH_ROUTE_RULES.protectedPrefixes.some(
    (protectedPrefix) =>
      normalizedPathname === protectedPrefix ||
      normalizedPathname.startsWith(`${protectedPrefix}/`)
  );
};

export const getRouteProtectionRedirect = ({ pathname, isAuthenticated }) => {
  const normalizedPathname = normalizePathname(pathname);

  if (isProtectedAdminPath(normalizedPathname) && !isAuthenticated) {
    return AUTH_ROUTE_RULES.login;
  }

  return null;
};
