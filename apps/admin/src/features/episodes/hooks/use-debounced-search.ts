"use client";

import { useEffect, useState } from "react";

type UseDebouncedSearchResult = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  debouncedSearch: string;
};

export function useDebouncedSearch(initialValue = ""): UseDebouncedSearchResult {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  return { searchInput, setSearchInput, debouncedSearch };
}
