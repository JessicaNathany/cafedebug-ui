"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchUsersPage, usersQueryKeys } from "../services/users.service";
import type { UsersQueryParams } from "../types/users.types";

export const useUsersList = (params: UsersQueryParams) =>
  useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => fetchUsersPage(params)
  });
