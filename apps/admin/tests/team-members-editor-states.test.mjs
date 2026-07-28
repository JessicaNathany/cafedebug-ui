import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) =>
  readFile(new URL(`../src/${path}`, import.meta.url), "utf8");

const layoutSourcePaths = [
  "features/team-members/team-member-editor-page.tsx",
  "features/team-members/components/team-member-editor-topbar.tsx",
  "features/team-members/components/team-member-editor-form.tsx",
  "features/team-members/components/team-member-editor-error-state.tsx",
  "features/team-members/components/team-member-profile-photo-field.tsx",
];

test("editor composition preserves the common topbar across ready and non-ready states", async () => {
  const [page, form] = await Promise.all([
    source("features/team-members/team-member-editor-page.tsx"),
    source("features/team-members/components/team-member-editor-form.tsx"),
  ]);

  for (const state of [
    "isInvalidTeamMemberId",
    "isLoading",
    "isNotFound",
    "loadError",
    "TeamMemberEditorForm",
  ]) {
    assert.match(page, new RegExp(state));
  }

  assert.match(page, /function TeamMemberEditorShell/);
  assert.match(
    page,
    /<TeamMemberEditorTopbar active={false} mode={mode} onBack={onBack}/,
  );
  assert.match(form, /<TeamMemberEditorTopbar/);
  assert.match(page, /aria-label="Loading team member"/);
  assert.match(page, /aria-busy="true"/);
  assert.doesNotMatch(page, /<footer/);
});

test("ready and loading layouts use matching semantic primary and configuration panes", async () => {
  const [page, form] = await Promise.all([
    source("features/team-members/team-member-editor-page.tsx"),
    source("features/team-members/components/team-member-editor-form.tsx"),
  ]);

  assert.match(form, /aria-label="Primary team member details"/);
  assert.match(form, /aria-label="Team member configuration"/);
  assert.ok(
    form.indexOf("Primary team member details") <
      form.indexOf("Team member configuration"),
  );
  assert.match(form, /xl:grid-cols-3/);
  assert.match(form, /xl:col-span-2/);
  assert.match(form, /border-t border-outline-variant\/60/);
  assert.match(form, /xl:border-l xl:border-t-0/);
  assert.match(page, /xl:grid-cols-3/);
  assert.match(page, /xl:col-span-2/);
  assert.match(page, /border-t border-outline-variant\/60/);
  assert.match(page, /xl:border-l xl:border-t-0/);

  assert.match(
    form,
    /<footer className="sticky bottom-0 z-20 mt-auto border-t border-outline-variant\/60 bg-surface-container-low p-4">/,
  );
  assert.match(form, />\s*Cancel\s*</);
  assert.match(form, /Create Team Member/);
  assert.match(form, /Save Changes/);
  assert.equal((form.match(/type="submit"/g) ?? []).length, 1);
});

test("submission alert remains between the ready topbar and form", async () => {
  const form = await source(
    "features/team-members/components/team-member-editor-form.tsx",
  );
  const topbarIndex = form.indexOf("<TeamMemberEditorTopbar");
  const submitErrorIndex = form.indexOf("{submitError ?");
  const formIndex = form.indexOf("<form");

  assert.ok(topbarIndex >= 0);
  assert.ok(submitErrorIndex > topbarIndex);
  assert.ok(formIndex > submitErrorIndex);
});

test("editor UI remains a presentation layer with all required controls and accessibility seams", async () => {
  const [form, profileField] = await Promise.all([
    source("features/team-members/components/team-member-editor-form.tsx"),
    source(
      "features/team-members/components/team-member-profile-photo-field.tsx",
    ),
  ]);

  for (const field of [
    "name",
    "podcastRole",
    "nickname",
    "email",
    "bio",
    "jobTitle",
    "gitHubUrl",
    "linkedInUrl",
    "joinedAt",
    "isActive",
  ]) {
    assert.match(form, new RegExp(field));
  }

  assert.match(profileField, /profilePhotoUrl/);
  assert.match(form, /onSubmit={form.handleSubmit\(onSubmit\)}/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /aria-invalid/);
  assert.match(form, /type="datetime-local"/);
  assert.doesNotMatch(
    form,
    /fetch\(|useRouter|parseTeamMember|@cafedebug\/api-client/,
  );
});

test("team member editor layout sources use semantic utilities without raw palettes or arbitrary visuals", async () => {
  const sources = await Promise.all(layoutSourcePaths.map(source));
  const rawPaletteClass =
    /(?:bg|text|border|ring|from|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/;
  const arbitraryVisualUtility =
    /\b(?:bg|text|border|shadow|w|h|max-w|min-h|rounded|grid-cols)-\[[^\]]+\]/;

  for (const layoutSource of sources) {
    assert.doesNotMatch(layoutSource, rawPaletteClass);
    assert.doesNotMatch(layoutSource, arbitraryVisualUtility);
  }
});

test("dirty-state policy only uses editor-owned confirmation and beforeunload", async () => {
  const hook = await source(
    "features/team-members/hooks/use-team-member-editor.ts",
  );

  assert.match(hook, /beforeunload/);
  assert.match(hook, /window\.confirm/);
  assert.match(hook, /submitInFlightRef/);
  assert.match(hook, /isMountedRef/);
  assert.doesNotMatch(hook, /popstate|beforePopState|history\.pushState/);
});
