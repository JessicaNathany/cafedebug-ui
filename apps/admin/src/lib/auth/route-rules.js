export const AUTH_ROUTE_RULES = Object.freeze({
  login: "/login",
  postLogin: "/episodes",
  protectedPrefixes: ["/dashboard", "/episodes", "/banners", "/settings"]
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

  if (normalizedPathname === AUTH_ROUTE_RULES.login && isAuthenticated) {
    return AUTH_ROUTE_RULES.postLogin;
  }

  if (isProtectedAdminPath(normalizedPathname) && !isAuthenticated) {
    return AUTH_ROUTE_RULES.login;
  }

  return null;
};
