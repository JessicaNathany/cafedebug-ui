"use client";

import { useEffect, useMemo, useState } from "react";

import type { BannerListItem } from "../types/banner.types";

const toSearchCandidate = (banner: BannerListItem): string => {
  const values = [
    banner.name,
    banner.active ? "published" : "draft",
    typeof banner.order === "number" ? String(banner.order) : undefined
  ];

  return values
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
};

type UseDebouncedBannerSearchResult = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  searchTerm: string;
  filteredItems: BannerListItem[];
};

export function useDebouncedBannerSearch(
  banners: BannerListItem[]
): UseDebouncedBannerSearchResult {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchTerm(searchInput.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return banners;
    }

    return banners.filter((banner) => toSearchCandidate(banner).includes(searchTerm));
  }, [banners, searchTerm]);

  return { searchInput, setSearchInput, searchTerm, filteredItems };
}
