import type { TeamMembersQueryParams } from "./types/team-member.types";

export const teamMembersListDefaultParams: TeamMembersQueryParams = {
  page: 1,
  pageSize: 5,
  sortBy: "name",
  descending: false,
  search: ""
};