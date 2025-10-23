import { useState, useMemo, useEffect, useCallback } from 'react';
import { Control } from '@/types';
import { extractUniqueControlFilterValues } from '@/utils/controlFilters';

export interface ControlFilters {
  search: string;
  categories: string[];
  priorities: string[];
  statuses: string[];
}

export interface ControlFilterOptions {
  categories: string[];
  priorities: string[];
  statuses: string[];
}

export const useControlFilters = (controls: Control[]) => {
  const [filters, setFilters] = useState<ControlFilters>({
    search: '',
    categories: [],
    priorities: [],
    statuses: [],
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [filters.search]);

  const filterOptions = useMemo(() => extractUniqueControlFilterValues(controls), [controls]);

  const filteredControls = useMemo(() => {
    let currentFiltered = controls;

    // Apply search filter
    if (debouncedSearch) {
      currentFiltered = currentFiltered.filter(control =>
        control.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        control.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply multi-select filters (AND logic)
    if (filters.categories.length > 0) {
      currentFiltered = currentFiltered.filter(control => filters.categories.includes(control.category));
    }
    if (filters.priorities.length > 0) {
      currentFiltered = currentFiltered.filter(control => filters.priorities.includes(control.priority));
    }
    if (filters.statuses.length > 0) {
      currentFiltered = currentFiltered.filter(control => filters.statuses.includes(control.status));
    }

    return currentFiltered;
  }, [controls, debouncedSearch, filters]);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const toggleFilter = useCallback((key: keyof Omit<ControlFilters, 'search'>, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [key]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [key]: [...currentValues, value] };
      }
    });
  }, []);

  const toggleCategory = useCallback((category: string) => toggleFilter('categories', category), [toggleFilter]);
  const togglePriority = useCallback((priority: string) => toggleFilter('priorities', priority), [toggleFilter]);
  const toggleStatus = useCallback((status: string) => toggleFilter('statuses', status), [toggleFilter]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      priorities: [],
      statuses: [],
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.categories.length > 0 ||
      filters.priorities.length > 0 ||
      filters.statuses.length > 0
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.categories.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filterOptions,
    filteredControls,
    setSearch,
    toggleCategory,
    togglePriority,
    toggleStatus,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  };
};
