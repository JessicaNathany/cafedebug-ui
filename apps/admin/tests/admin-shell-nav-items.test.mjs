import assert from "node:assert/strict";
import test from "node:test";

import {
  ADMIN_SHELL_NAV_ITEMS,
  DISABLED_NAV_ENTRY_LABEL,
  getAdminShellRouteContext,
  isAdminShellNavItemActive,
  resolveAdminShellNavInteraction,
  resolveAdminShellRouteContext
} from "../src/features/admin-shell/admin-shell-nav-items.js";

test("admin shell nav preserves primary routes and enables banner navigation", () => {
  const navByLabel = Object.fromEntries(
    ADMIN_SHELL_NAV_ITEMS.map((item) => [item.label, item])
  );

  assert.equal(navByLabel.Episodes.disabled, false);
  assert.equal(navByLabel.Dashboard.disabled, true);
  assert.equal(navByLabel.Settings.disabled, true);
  assert.equal(navByLabel.Banners.disabled, false);
  assert.equal(navByLabel.Debuggers.disabled, true);
  assert.equal(navByLabel.Banners.statusLabel, undefined);
  assert.equal(navByLabel.Debuggers.statusLabel, "Coming soon");
  assert.equal(navByLabel.Dashboard.statusLabel, "Coming soon");
  assert.equal(navByLabel.Settings.statusLabel, "Coming soon");
  assert.equal(navByLabel.Dashboard.href, "/dashboard");
  assert.equal(navByLabel.Settings.href, "/settings");
  assert.equal(navByLabel.Banners.href, "/banners");
  assert.equal(navByLabel.Debuggers.href, "/debuggers");
  assert.equal(DISABLED_NAV_ENTRY_LABEL, "Disabled in V1 navigation");
});

test("active navigation matches exact and nested route prefixes", () => {
  const episodesNav = ADMIN_SHELL_NAV_ITEMS.find((item) => item.href === "/episodes");
  assert.ok(episodesNav, "episodes nav item should exist");

  assert.equal(isAdminShellNavItemActive(episodesNav, "/episodes"), true);
  assert.equal(isAdminShellNavItemActive(episodesNav, "/episodes/new"), true);
  assert.equal(isAdminShellNavItemActive(episodesNav, "/settings"), false);
});

test("route context exposes disabled in V1 status only for placeholder routes", () => {
  const bannersContext = resolveAdminShellRouteContext("/banners");
  const debuggersContext = resolveAdminShellRouteContext("/debuggers/runtime");
  const episodesContext = resolveAdminShellRouteContext("/episodes/new");

  assert.equal(bannersContext.disabledInV1, undefined);
  assert.equal(debuggersContext.disabledInV1, true);
  assert.equal(episodesContext.disabledInV1, undefined);
  assert.equal(episodesContext.title, "Episodes");
});

test("typed route context always resolves disabledInV1 as boolean", () => {
  const episodesContext = getAdminShellRouteContext("/episodes");
  const bannersContext = getAdminShellRouteContext("/banners");

  assert.equal(episodesContext.disabledInV1, false);
  assert.equal(bannersContext.disabledInV1, false);
});

test("navigation interaction exposes correct aria-disabled semantics", () => {
  const bannersNavItem = ADMIN_SHELL_NAV_ITEMS.find(
    (item) => item.href === "/banners"
  );
  const episodesNavItem = ADMIN_SHELL_NAV_ITEMS.find(
    (item) => item.href === "/episodes"
  );

  assert.ok(bannersNavItem, "banners nav item should exist");
  assert.ok(episodesNavItem, "episodes nav item should exist");

  assert.deepEqual(resolveAdminShellNavInteraction(bannersNavItem), {
    ariaDisabled: undefined,
    interactive: true,
    tabIndex: undefined
  });
  assert.deepEqual(resolveAdminShellNavInteraction(episodesNavItem), {
    ariaDisabled: undefined,
    interactive: true,
    tabIndex: undefined
  });
});
