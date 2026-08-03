import assert from "node:assert/strict";
import test from "node:test";

import { toTeamMemberEditorDefaults, toTeamMemberRequestPayload } from "../src/features/team-members/transformers.ts";

const values = { name: "  Jessica  ", podcastRole: " Host ", nickname: " ", email: " a@b.com ", bio: " bio ", jobTitle: " Dev ", gitHubUrl: " https://github.com/a ", linkedInUrl: " ", profilePhotoUrl: " ", joinedAt: "2026-07-13T15:30", isActive: false };

test("request transformation trims values, nulls blanks and preserves local datetime", () => {
  const payload = toTeamMemberRequestPayload(values);
  assert.deepEqual(Object.keys(payload).sort(), ["bio", "email", "gitHubUrl", "isActive", "jobTitle", "joinedAt", "linkedInUrl", "name", "nickname", "podcastRole", "profilePhotoUrl"].sort());
  assert.deepEqual(payload, { name: "Jessica", podcastRole: "Host", nickname: null, email: "a@b.com", bio: "bio", jobTitle: "Dev", gitHubUrl: "https://github.com/a", linkedInUrl: null, profilePhotoUrl: null, joinedAt: "2026-07-13T15:30:00", isActive: false });
  assert.equal(payload.joinedAt?.includes("Z"), false);
});

test("edit defaults use a safe false fallback only when isActive is absent", () => {
  const record = { id: 1, name: "A", podcastRole: "Host", nickname: "", email: "", bio: "", jobTitle: "", gitHubUrl: "", linkedInUrl: "", profilePhotoUrl: "", joinedAt: "2026-01-01T01:02:03Z", createdAt: "", updatedAt: "" };
  assert.equal(toTeamMemberEditorDefaults(record).isActive, false);
  assert.equal(toTeamMemberEditorDefaults({ ...record, isActive: false }).isActive, false);
  assert.equal(toTeamMemberEditorDefaults({ ...record, isActive: true }).joinedAt, "2026-01-01T01:02:03");
});
