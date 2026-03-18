"use client";

import { useCallback, useMemo } from "react";
import { UpdateParamsFn } from "./useServerManagedDataTable";

interface UseServerManagedDataTableSearchParams {
  searchParams: Record<string, string | string[] | undefined>;
  updateParams: UpdateParamsFn;
  queryKey?: string;
}

export const useServerManagedDataTableSearch = ({
  searchParams,
  updateParams,
  queryKey = "searchTerm",
}: UseServerManagedDataTableSearchParams) => {
  const searchTermFromUrl = useMemo(() => {
    const value = searchParams[queryKey];
    if (Array.isArray(value)) {
      return value[0] ?? "";
    }
    return value ?? "";
  }, [queryKey, searchParams]);

  const handleDebouncedSearchChange = useCallback((searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.trim();
    const value = searchParams[queryKey];
    const currentSearchTerm = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

    if (normalizedSearchTerm === currentSearchTerm) {
      return;
    }

    updateParams((params) => {
      if (normalizedSearchTerm) {
        params.set(queryKey, normalizedSearchTerm);
        return;
      }

      params.delete(queryKey);
    }, { resetPage: true });
  }, [queryKey, searchParams, updateParams]);

  return {
    searchTermFromUrl,
    handleDebouncedSearchChange,
  };
};
