"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchUserById, usersQueryKeys } from "../services/users.service";

export const useUserById = (id: number | null) =>
  useQuery({
    queryKey: id ? usersQueryKeys.detail(id) : ["users", "detail", "none"],
    queryFn: async () => {
      if (typeof id !== "number" || id <= 0) {
        throw new Error("User id must be a positive integer.");
      }

      return fetchUserById(id);
    },
    enabled: typeof id === "number" && id > 0
  });
