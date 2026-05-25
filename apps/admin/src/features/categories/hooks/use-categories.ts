"use client";

import { useQuery } from "@tanstack/react-query";

import {
  categoriesQueryKeys,
  fetchCategoriesList
} from "../services/categories.service";

export const useCategories = () =>
  useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: fetchCategoriesList,
    staleTime: 5 * 60 * 1000
  });
