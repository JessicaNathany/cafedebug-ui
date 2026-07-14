import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const source = (path) => readFile(new URL(`../src/${path}`, import.meta.url), "utf8");

test("editor pages are routing-only and list page remains outside editor scope", async () => {
  const [newPage, editPage, listPage] = await Promise.all([source("app/(admin)/team-members/new/page.tsx"), source("app/(admin)/team-members/[id]/edit/page.tsx"), source("app/(admin)/team-members/page.tsx")]);
  assert.match(newPage, /<TeamMemberEditorPage mode="new"/); assert.match(editPage, /<TeamMemberEditorPage id={id} mode="edit"/);
  for (const page of [newPage, editPage]) { assert.doesNotMatch(page, /fetch\(|useTeamMemberEditor|parseTeamMember/); }
  assert.match(listPage, /TeamMembersListPage/);
});

test("internal routes are direct delegates while collection GET remains delegated", async () => {
  const [collection, detail] = await Promise.all([source("app/api/admin/team-members/route.ts"), source("app/api/admin/team-members/[id]/route.ts")]);
  assert.match(collection, /return teamMembersListHandler\(request\)/); assert.match(collection, /return teamMembersCreateHandler\(request\)/);
  assert.match(detail, /return teamMembersDetailHandler\(request, context\)/); assert.match(detail, /return teamMembersUpdateHandler\(request, context\)/);
  for (const route of [collection, detail]) assert.doesNotMatch(route, /NextResponse|request\.json|parseTeamMemberRouteId/);
});
