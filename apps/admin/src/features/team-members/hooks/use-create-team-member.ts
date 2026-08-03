"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeamMember, teamMembersQueryKeys } from "../services/team-members.service";
import type { TeamMemberMutationResult, TeamMemberRequestPayload, TeamMembersRouteError } from "../types/team-member.types";

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<TeamMemberMutationResult, TeamMembersRouteError, TeamMemberRequestPayload>({
    mutationFn: createTeamMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamMembersQueryKeys.all })
  });
};
