"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser, usersQueryKeys } from "../services/users.service";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
    }
  });
};
