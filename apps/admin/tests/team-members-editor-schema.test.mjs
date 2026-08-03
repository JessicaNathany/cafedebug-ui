import assert from "node:assert/strict";
import test from "node:test";

import { teamMemberEditorSchema } from "../src/features/team-members/schemas/team-member.schema.ts";

const valid = { name: "Jessica", podcastRole: "Host", nickname: "", email: "", bio: "", jobTitle: "", gitHubUrl: "", linkedInUrl: "", profilePhotoUrl: "", joinedAt: "2026-07-13T15:30", isActive: true };

test("team member schema accepts the minimum valid editor values", () => {
  assert.equal(teamMemberEditorSchema.safeParse(valid).success, true);
});

test("team member schema rejects blank required values and invalid optional formats", () => {
  for (const values of [
    { ...valid, name: "  " }, { ...valid, podcastRole: " " }, { ...valid, email: "not-email" },
    { ...valid, gitHubUrl: "ftp://example.com" }, { ...valid, linkedInUrl: "relative/path" },
    { ...valid, joinedAt: "2026-02-30T12:00" }, { ...valid, joinedAt: "2026-01-01T12:00Z" }
  ]) assert.equal(teamMemberEditorSchema.safeParse(values).success, false);
});
