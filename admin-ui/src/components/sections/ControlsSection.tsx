import { Control } from '@/types';
import { ControlCard } from '../ControlCard';
import { ControlFiltersComponent } from '../ControlFilters';
import { Pagination } from '../Pagination';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { useControlFilters } from '@/hooks/useControlFilters';
import { usePagination } from '@/hooks/usePagination';
import { Search, AlertCircle } from 'lucide-react';

interface ControlsSectionProps {
  controls: Control[];
  onControlClick: (control: Control) => void;
  loading?: boolean;
}

export const ControlsSection = ({ controls, onControlClick, loading = false }: ControlsSectionProps) => {
  const {
    filters,
    filterOptions,
    filteredControls,
    setSearch,
    toggleCategory,
    togglePriority,
    toggleStatus,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount
  } = useControlFilters(controls);

  const pagination = usePagination(filteredControls, 18);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ControlFiltersComponent
        filters={filters}
        filterOptions={filterOptions}
        onSearchChange={setSearch}
        onToggleCategory={toggleCategory}
        onTogglePriority={togglePriority}
        onToggleStatus={toggleStatus}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {hasActiveFilters ? (
            <>
              Showing <span className="font-medium text-hlola-blue">{pagination.totalItems}</span> of{' '}
              <span className="font-medium text-slate-700">{controls.length}</span> controls
            </>
          ) : (
            <>
              <span className="font-medium text-hlola-blue">{controls.length}</span> controls
            </>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <LoadingSkeleton count={18} />
      ) : pagination.paginatedData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {pagination.paginatedData.map((control) => (
              <ControlCard
                key={control.id}
                control={control}
                onClick={onControlClick}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} />
        </>
      ) : (
        /* Empty State */
        <div className="glass rounded-xl p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No controls found</h3>
              <p className="text-slate-500 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results."
                  : "No controls are available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-hlola-blue text-white rounded-lg hover:bg-hlola-blue/90 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};