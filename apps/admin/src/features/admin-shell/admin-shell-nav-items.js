import { appRoutes } from "../../lib/routes.js";

const normalizePathname = (pathname) => {
  if (typeof pathname !== "string") {
    return "/";
  }

  const trimmedPathname = pathname.trim();

  if (!trimmedPathname || trimmedPathname === "/") {
    return "/";
  }

  return trimmedPathname.endsWith("/")
    ? trimmedPathname.slice(0, -1)
    : trimmedPathname;
};

const matchesRoutePrefix = (pathname, prefix) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export const ADMIN_SHELL_NAV_ITEMS = Object.freeze([
  Object.freeze({
    href: appRoutes.dashboard,
    label: "Dashboard",
    icon: "home",
    disabled: true,
    statusLabel: "Coming soon"
  }),
  Object.freeze({
    href: appRoutes.episodes,
    label: "Episodes",
    icon: "mic",
    disabled: false
  }),
  Object.freeze({
    href: appRoutes.banners,
    label: "Banners",
    icon: "campaign",
    disabled: false
  }),
  Object.freeze({
    href: "/debuggers",
    label: "Debuggers",
    icon: "bug_report",
    disabled: true,
    statusLabel: "Coming soon"
  }),
  Object.freeze({
    href: appRoutes.settings,
    label: "Settings",
    icon: "settings",
    disabled: true,
    statusLabel: "Coming soon"
  })
]);

export const DISABLED_NAV_ENTRY_LABEL = "Disabled in V1 navigation";

const ADMIN_SHELL_ROUTE_CONTEXTS = Object.freeze([
  Object.freeze({
    href: appRoutes.episodes,
    title: "Episodes",
    description: "Manage, edit, and publish your podcast content."
  }),
  Object.freeze({
    href: appRoutes.dashboard,
    title: "Dashboard",
    description: "Review top-level account and content metrics."
  }),
  Object.freeze({
    href: appRoutes.banners,
    title: "Banners",
    description: "Create and edit banner records."
  }),
  Object.freeze({
    href: "/debuggers",
    title: "Debuggers",
    description: "Debuggers area is not available yet in this milestone.",
    disabledInV1: true
  }),
  Object.freeze({
    href: appRoutes.settings,
    title: "Settings",
    description: "Configure admin settings and profile preferences."
  })
]);

export const isAdminShellNavItemActive = (item, pathname) => {
  const normalizedPathname = normalizePathname(pathname);
  return matchesRoutePrefix(normalizedPathname, item.href);
};

export const resolveAdminShellNavInteraction = (item) => {
  if (item.disabled) {
    return Object.freeze({
      ariaDisabled: true,
      tabIndex: -1,
      interactive: false
    });
  }

  return Object.freeze({
    ariaDisabled: undefined,
    tabIndex: undefined,
    interactive: true
  });
};

export const resolveAdminShellRouteContext = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);

  for (const routeContext of ADMIN_SHELL_ROUTE_CONTEXTS) {
    if (matchesRoutePrefix(normalizedPathname, routeContext.href)) {
      return routeContext;
    }
  }

  return Object.freeze({
    href: normalizedPathname,
    title: "Admin",
    description: "Authenticated admin area.",
    disabledInV1: false
  });
};

/**
 * @typedef {Object} AdminShellRouteContext
 * @property {string} href
 * @property {string} title
 * @property {string} description
 * @property {boolean} disabledInV1
 */

/**
 * @param {string} pathname
 * @returns {AdminShellRouteContext}
 */
export const getAdminShellRouteContext = (pathname) => {
  const resolvedContext = resolveAdminShellRouteContext(pathname);

  return {
    ...resolvedContext,
    disabledInV1: Boolean(resolvedContext.disabledInV1)
  };
};
