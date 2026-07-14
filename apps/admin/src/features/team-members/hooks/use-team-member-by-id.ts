"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTeamMemberById, teamMembersQueryKeys } from "../services/team-members.service";

export const useTeamMemberById = (id: number | null) => useQuery({
  queryKey: id ? teamMembersQueryKeys.detail(id) : ["team-members", "detail", "none"],
  queryFn: () => id ? fetchTeamMemberById(id) : null,
  enabled: id !== null
});
