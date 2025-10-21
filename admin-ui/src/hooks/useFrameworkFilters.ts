import { useState, useMemo, useCallback } from 'react';
import { Framework } from '@/types';
import { applyFilters, extractFilterOptions, FilterOptions } from '@/utils/frameworkFilters';

export interface FrameworkFilters {
  search: string;
  selectedRegions: string[];
  selectedCategories: string[];
  selectedPriorities: string[];
  selectedStatuses: string[];
}

export const useFrameworkFilters = (frameworks: Framework[]) => {
  const [filters, setFilters] = useState<FrameworkFilters>({
    search: '',
    selectedRegions: [],
    selectedCategories: [],
    selectedPriorities: [],
    selectedStatuses: []
  });

  // Extract available filter options from frameworks
  const filterOptions = useMemo(() => extractFilterOptions(frameworks), [frameworks]);

  // Apply filters to frameworks
  const filteredFrameworks = useMemo(() => {
    return applyFilters(frameworks, filters);
  }, [frameworks, filters]);

  // Filter control functions
  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const toggleRegion = useCallback((region: string) => {
    setFilters(prev => ({
      ...prev,
      selectedRegions: prev.selectedRegions.includes(region)
        ? prev.selectedRegions.filter(r => r !== region)
        : [...prev.selectedRegions, region]
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  }, []);

  const togglePriority = useCallback((priority: string) => {
    setFilters(prev => ({
      ...prev,
      selectedPriorities: prev.selectedPriorities.includes(priority)
        ? prev.selectedPriorities.filter(p => p !== priority)
        : [...prev.selectedPriorities, priority]
    }));
  }, []);

  const toggleStatus = useCallback((status: string) => {
    setFilters(prev => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter(s => s !== status)
        : [...prev.selectedStatuses, status]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      selectedRegions: [],
      selectedCategories: [],
      selectedPriorities: [],
      selectedStatuses: []
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
           filters.selectedRegions.length > 0 ||
           filters.selectedCategories.length > 0 ||
           filters.selectedPriorities.length > 0 ||
           filters.selectedStatuses.length > 0;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    count += filters.selectedRegions.length;
    count += filters.selectedCategories.length;
    count += filters.selectedPriorities.length;
    count += filters.selectedStatuses.length;
    return count;
  }, [filters]);

  return {
    filters,
    filterOptions,
    filteredFrameworks,
    setSearch,
    toggleRegion,
    toggleCategory,
    togglePriority,
    toggleStatus,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount
  };
};
