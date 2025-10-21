import { Framework } from '@/types';

export interface FilterOptions {
  regions: string[];
  categories: string[];
  priorities: string[];
  statuses: string[];
}

export const extractFilterOptions = (frameworks: Framework[]): FilterOptions => {
  const regions = [...new Set(frameworks.map(f => f.region))].filter(Boolean).sort();
  const categories = [...new Set(frameworks.map(f => f.category))].filter(Boolean).sort();
  const priorities = [...new Set(frameworks.map(f => f.priority))].filter(Boolean).sort();
  const statuses = [...new Set(frameworks.map(f => f.status))].filter(Boolean).sort();

  return {
    regions,
    categories,
    priorities,
    statuses
  };
};

export const applyFilters = (
  frameworks: Framework[],
  filters: {
    search: string;
    selectedRegions: string[];
    selectedCategories: string[];
    selectedPriorities: string[];
    selectedStatuses: string[];
  }
): Framework[] => {
  return frameworks.filter(framework => {
    // Search filter
    if (filters.search && !framework.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Multi-select filters (any match = include)
    if (filters.selectedRegions.length > 0 && !filters.selectedRegions.includes(framework.region)) {
      return false;
    }
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(framework.category)) {
      return false;
    }
    if (filters.selectedPriorities.length > 0 && !filters.selectedPriorities.includes(framework.priority)) {
      return false;
    }
    if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(framework.status)) {
      return false;
    }

    return true;
  });
};
