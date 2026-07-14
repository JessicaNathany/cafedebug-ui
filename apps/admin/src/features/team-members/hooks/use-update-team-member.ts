"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { teamMembersQueryKeys, updateTeamMember } from "../services/team-members.service";
import type { TeamMemberMutationResult, TeamMemberRequestPayload, TeamMembersRouteError } from "../types/team-member.types";

type UpdateTeamMemberInput = { id: number; payload: TeamMemberRequestPayload };

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<TeamMemberMutationResult, TeamMembersRouteError, UpdateTeamMemberInput>({
    mutationFn: updateTeamMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamMembersQueryKeys.all })
  });
};
