"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUser, usersQueryKeys } from "../services/users.service";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
      await queryClient.invalidateQueries({
        queryKey: usersQueryKeys.detail(variables.id)
      });
    }
  });
};
