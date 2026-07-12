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

test("admin shell nav preserves primary routes and enables team members navigation", () => {
  const navByLabel = Object.fromEntries(
    ADMIN_SHELL_NAV_ITEMS.map((item) => [item.label, item])
  );

  assert.equal(navByLabel.Episodes.disabled, false);
  assert.equal(navByLabel.Dashboard.disabled, true);
  assert.equal(navByLabel.Settings.disabled, true);
  assert.equal(navByLabel.Banners.disabled, false);
  assert.equal(navByLabel["Team Members"].disabled, false);
  assert.equal(navByLabel.Banners.statusLabel, undefined);
  assert.equal(navByLabel["Team Members"].statusLabel, undefined);
  assert.equal(navByLabel.Dashboard.statusLabel, "Coming soon");
  assert.equal(navByLabel.Settings.statusLabel, "Coming soon");
  assert.equal(navByLabel.Dashboard.href, "/dashboard");
  assert.equal(navByLabel.Settings.href, "/settings");
  assert.equal(navByLabel.Banners.href, "/banners");
  assert.equal(navByLabel["Team Members"].href, "/team-members");
  assert.equal(DISABLED_NAV_ENTRY_LABEL, "Disabled in V1 navigation");
});

test("active navigation matches exact and nested route prefixes", () => {
  const teamMembersNav = ADMIN_SHELL_NAV_ITEMS.find((item) => item.href === "/team-members");
  assert.ok(teamMembersNav, "team members nav item should exist");

  assert.equal(isAdminShellNavItemActive(teamMembersNav, "/team-members"), true);
  assert.equal(isAdminShellNavItemActive(teamMembersNav, "/team-members/new"), true);
  assert.equal(isAdminShellNavItemActive(teamMembersNav, "/team-members/9/edit"), true);
  assert.equal(isAdminShellNavItemActive(teamMembersNav, "/settings"), false);
});

test("route context exposes enabled team members metadata", () => {
  const bannersContext = resolveAdminShellRouteContext("/banners");
  const teamMembersContext = resolveAdminShellRouteContext("/team-members/runtime");
  const episodesContext = resolveAdminShellRouteContext("/episodes/new");

  assert.equal(bannersContext.disabledInV1, undefined);
  assert.equal(teamMembersContext.disabledInV1, undefined);
  assert.equal(teamMembersContext.title, "Team Members");
  assert.equal(episodesContext.disabledInV1, undefined);
  assert.equal(episodesContext.title, "Episodes");
});

test("typed route context always resolves disabledInV1 as boolean", () => {
  const episodesContext = getAdminShellRouteContext("/episodes");
  const bannersContext = getAdminShellRouteContext("/banners");
  const teamMembersContext = getAdminShellRouteContext("/team-members");

  assert.equal(episodesContext.disabledInV1, false);
  assert.equal(bannersContext.disabledInV1, false);
  assert.equal(teamMembersContext.disabledInV1, false);
});

test("navigation interaction exposes correct aria-disabled semantics", () => {
  const bannersNavItem = ADMIN_SHELL_NAV_ITEMS.find(
    (item) => item.href === "/banners"
  );
  const episodesNavItem = ADMIN_SHELL_NAV_ITEMS.find(
    (item) => item.href === "/episodes"
  );
  const teamMembersNavItem = ADMIN_SHELL_NAV_ITEMS.find(
    (item) => item.href === "/team-members"
  );

  assert.ok(bannersNavItem, "banners nav item should exist");
  assert.ok(episodesNavItem, "episodes nav item should exist");
  assert.ok(teamMembersNavItem, "team members nav item should exist");

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
  assert.deepEqual(resolveAdminShellNavInteraction(teamMembersNavItem), {
    ariaDisabled: undefined,
    interactive: true,
    tabIndex: undefined
  });
});