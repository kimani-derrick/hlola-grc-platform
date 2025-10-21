import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { ControlFilters, ControlFilterOptions } from '@/hooks/useControlFilters';

interface ControlFiltersProps {
  filters: ControlFilters;
  filterOptions: ControlFilterOptions;
  onSearchChange: (search: string) => void;
  onToggleCategory: (category: string) => void;
  onTogglePriority: (priority: string) => void;
  onToggleStatus: (status: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const Dropdown: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ label, options, selected, onToggle }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-hlola-cyan/30 rounded-lg text-slate-700 hover:bg-hlola-cyan/10 transition-colors backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-hlola-blue text-white text-xs rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-48 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm border border-hlola-cyan/20 p-2">
          {options.length === 0 ? (
            <p className="text-sm text-slate-500 p-2">No options available</p>
          ) : (
            options.map(option => (
              <label key={option} className="flex items-center p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-hlola-blue rounded"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                />
                <span className="ml-2 text-slate-700 text-sm">{option}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const ControlFiltersComponent: React.FC<ControlFiltersProps> = ({
  filters,
  filterOptions,
  onSearchChange,
  onToggleCategory,
  onTogglePriority,
  onToggleStatus,
  onClearAll,
  hasActiveFilters,
  activeFilterCount
}) => {
  return (
    <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search controls..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full bg-white/80 border border-hlola-cyan/30 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hlola-cyan backdrop-blur-sm"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3">
        <Dropdown
          label="Category"
          options={filterOptions.categories}
          selected={filters.categories}
          onToggle={onToggleCategory}
        />
        <Dropdown
          label="Priority"
          options={filterOptions.priorities}
          selected={filters.priorities}
          onToggle={onTogglePriority}
        />
        <Dropdown
          label="Status"
          options={filterOptions.statuses}
          selected={filters.statuses}
          onToggle={onToggleStatus}
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
          Clear Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );
};
