"use client";

import { useState, useMemo, useCallback } from "react";
import type { UsageRecord } from "@/lib/types";

interface Filters {
  department: string;
  model: string;
  dateFrom: string;
  dateTo: string;
}

export function useFilters(usage: UsageRecord[]) {
  const [filters, setFilters] = useState<Filters>({
    department: "all",
    model: "all",
    dateFrom: "",
    dateTo: "",
  });

  const filteredUsage = useMemo(() => {
    return usage.filter((r) => {
      if (filters.department !== "all" && r.departmentId !== filters.department) return false;
      if (filters.model !== "all" && r.model !== filters.model) return false;
      if (filters.dateFrom && r.date < filters.dateFrom) return false;
      if (filters.dateTo && r.date > filters.dateTo) return false;
      return true;
    });
  }, [usage, filters]);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ department: "all", model: "all", dateFrom: "", dateTo: "" });
  }, []);

  return { filters, filteredUsage, updateFilter, resetFilters };
}
