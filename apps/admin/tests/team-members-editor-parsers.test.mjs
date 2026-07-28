import assert from "node:assert/strict";
import test from "node:test";

import { parseTeamMemberRecord, parseTeamMemberRouteId } from "../src/features/team-members/parsers.ts";

test("route ID parser accepts only raw positive decimal segments", () => {
  for (const value of ["1", "42", "9007199254740991"]) assert.notEqual(parseTeamMemberRouteId(value), null);
  for (const value of [undefined, "", " 1", "1 ", "+1", "01", "1.5", "0", "-1", "foo", "9007199254740992"]) assert.equal(parseTeamMemberRouteId(value), null);
});

test("record parser requires a valid response id and respects the edit route target", () => {
  assert.equal(parseTeamMemberRecord({ name: "Missing" }), null);
  assert.equal(parseTeamMemberRecord({ id: 2, name: "A", podcastRole: "Host" }, 3), null);
  assert.deepEqual(parseTeamMemberRecord({ id: 2, name: null, podcastRole: null, isActive: false }), {
    id: 2, name: "", podcastRole: "", nickname: "", email: "", bio: "", jobTitle: "", gitHubUrl: "", linkedInUrl: "", profilePhotoUrl: "", joinedAt: "", isActive: false, createdAt: "", updatedAt: ""
  });
});
