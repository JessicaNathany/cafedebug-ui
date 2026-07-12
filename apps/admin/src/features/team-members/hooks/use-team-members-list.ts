"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTeamMembersPage, teamMembersQueryKeys } from "../services/team-members.service";
import type { TeamMembersQueryParams } from "../types/team-member.types";

export const useTeamMembersList = (params: TeamMembersQueryParams) =>
  useQuery({
    queryKey: teamMembersQueryKeys.list(params),
    queryFn: () => fetchTeamMembersPage(params)
  });