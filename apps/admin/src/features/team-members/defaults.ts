import type { TeamMemberEditorValues } from "./schemas/team-member.schema";
import type { TeamMembersQueryParams } from "./types/team-member.types";

export const teamMembersListDefaultParams: TeamMembersQueryParams = {
  page: 1,
  pageSize: 5,
  sortBy: "name",
  descending: false,
  search: ""
};

export const teamMemberEditorDefaultValues: TeamMemberEditorValues = {
  name: "",
  podcastRole: "",
  nickname: "",
  email: "",
  bio: "",
  jobTitle: "",
  gitHubUrl: "",
  linkedInUrl: "",
  instagramUrl: "",
  profilePhotoUrl: "",
  joinedAt: "",
  isActive: true
};
