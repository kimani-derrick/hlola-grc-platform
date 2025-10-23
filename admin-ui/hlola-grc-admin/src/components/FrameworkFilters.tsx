'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { useFrameworkFilters, FrameworkFilters } from '@/hooks/useFrameworkFilters';
import { FilterOptions } from '@/utils/frameworkFilters';

interface FrameworkFiltersProps {
  filters: FrameworkFilters;
  filterOptions: FilterOptions;
  onSearchChange: (search: string) => void;
  onToggleRegion: (region: string) => void;
  onToggleCategory: (category: string) => void;
  onTogglePriority: (priority: string) => void;
  onToggleStatus: (status: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selectedValues, 
  onToggle, 
  placeholder = "Select..." 
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    onToggle(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors min-w-[120px]"
      >
        <span className="text-slate-600">{label}</span>
        <span className="text-hlola-blue font-medium">
          {selectedValues.length > 0 ? `${selectedValues.length}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 glass rounded-lg shadow-lg z-50 min-w-[200px] max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option}
                onClick={() => handleToggle(option)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedValues.includes(option) 
                    ? 'bg-hlola-blue border-hlola-blue' 
                    : 'border-slate-300'
                }`}>
                  {selectedValues.includes(option) && (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-slate-700">{option}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const FrameworkFiltersComponent = ({
  filters,
  filterOptions,
  onSearchChange,
  onToggleRegion,
  onToggleCategory,
  onTogglePriority,
  onToggleStatus,
  onClearAll,
  hasActiveFilters,
  activeFilterCount
}: FrameworkFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  return (
    <div className="glass rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-hlola-blue" />
          <h3 className="text-lg font-semibold text-hlola-blue">Filter Frameworks</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-hlola-blue text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:text-hlola-blue transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-lg border-0 focus:ring-2 focus:ring-hlola-blue/20 focus:outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Region Filter */}
        <MultiSelectDropdown
          label="Region"
          options={filterOptions.regions}
          selectedValues={filters.selectedRegions}
          onToggle={onToggleRegion}
          placeholder="All Regions"
        />

        {/* Category Filter */}
        <MultiSelectDropdown
          label="Category"
          options={filterOptions.categories}
          selectedValues={filters.selectedCategories}
          onToggle={onToggleCategory}
          placeholder="All Categories"
        />

        {/* Priority Filter */}
        <MultiSelectDropdown
          label="Priority"
          options={filterOptions.priorities}
          selectedValues={filters.selectedPriorities}
          onToggle={onTogglePriority}
          placeholder="All Priorities"
        />

        {/* Status Filter */}
        <MultiSelectDropdown
          label="Status"
          options={filterOptions.statuses}
          selectedValues={filters.selectedStatuses}
          onToggle={onToggleStatus}
          placeholder="All Statuses"
        />
      </div>
    </div>
  );
};
