import { useState, useMemo, useEffect, useCallback } from 'react';
import { Task } from '@/types';
import { extractUniqueTaskFilterValues } from '@/utils/taskFilters';

export interface TaskFilters {
  search: string;
  categories: string[];
  priorities: string[];
  statuses: string[];
}

export interface TaskFilterOptions {
  categories: string[];
  priorities: string[];
  statuses: string[];
}

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TaskFilters>({
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

  const filterOptions = useMemo(() => extractUniqueTaskFilterValues(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    let currentFiltered = tasks;

    // Apply search filter
    if (debouncedSearch) {
      currentFiltered = currentFiltered.filter(task =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply multi-select filters (AND logic)
    if (filters.categories.length > 0) {
      currentFiltered = currentFiltered.filter(task => filters.categories.includes(task.category));
    }
    if (filters.priorities.length > 0) {
      currentFiltered = currentFiltered.filter(task => filters.priorities.includes(task.priority));
    }
    if (filters.statuses.length > 0) {
      currentFiltered = currentFiltered.filter(task => filters.statuses.includes(task.status));
    }

    return currentFiltered;
  }, [tasks, debouncedSearch, filters]);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const toggleFilter = useCallback((key: keyof Omit<TaskFilters, 'search'>, value: string) => {
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
    filteredTasks,
    setSearch,
    toggleCategory,
    togglePriority,
    toggleStatus,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  };
};
