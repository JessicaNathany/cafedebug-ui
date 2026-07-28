import assert from "node:assert/strict";
import test from "node:test";

import { parseTeamMembersPageData } from "../src/features/team-members/parsers.ts";

test("parseTeamMembersPageData normalizes team member list rows and page metadata", () => {
  const page = parseTeamMembersPageData(
    {
      data: {
        items: [
          {
            id: 7,
            name: "  Jessica Nathany  ",
            email: "  jessica@cafedebug.com  ",
            podcastRole: " Host ",
            gitHubUrl: " https://github.com/jessica ",
            linkedInUrl: " https://linkedin.com/in/jessica ",
            isActive: "true",
            createdAt: "2026-06-01T00:00:00Z",
            updatedAt: "2026-06-02T00:00:00Z"
          },
          {
            id: 8,
            name: "   ",
            email: null,
            podcastRole: null,
            gitHubUrl: null,
            linkedInUrl: undefined,
            isActive: "inactive",
            createdAt: null,
            updatedAt: null
          }
        ],
        page: 2,
        pageSize: 5,
        totalCount: 9,
        pageCount: 2,
        hasPrevious: true,
        hasNext: false,
        sortBy: "name",
        descending: false
      }
    },
    {
      page: 1,
      pageSize: 5,
      sortBy: "name",
      descending: false,
      search: "jess"
    }
  );

  assert.equal(page.page, 2);
  assert.equal(page.pageSize, 5);
  assert.equal(page.totalCount, 9);
  assert.equal(page.pageCount, 2);
  assert.equal(page.hasPrevious, true);
  assert.equal(page.hasNext, false);
  assert.equal(page.sortBy, "name");
  assert.equal(page.descending, false);
  assert.deepEqual(page.items, [
    {
      id: 7,
      name: "Jessica Nathany",
      email: "jessica@cafedebug.com",
      podcastRole: "Host",
      gitHubUrl: "https://github.com/jessica",
      linkedInUrl: "https://linkedin.com/in/jessica",
      isActive: true,
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: "2026-06-02T00:00:00Z"
    },
    {
      id: 8,
      name: "Team Member #8",
      email: "—",
      podcastRole: "—",
      gitHubUrl: "",
      linkedInUrl: "",
      isActive: false,
      createdAt: "",
      updatedAt: ""
    }
  ]);
});
