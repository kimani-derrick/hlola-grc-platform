import { Framework } from '@/types';
import { FrameworkCard } from '../FrameworkCard';
import { FrameworkFiltersComponent } from '../FrameworkFilters';
import { Pagination } from '../Pagination';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { useFrameworkFilters } from '@/hooks/useFrameworkFilters';
import { usePagination } from '@/hooks/usePagination';
import { Search, AlertCircle } from 'lucide-react';

interface FrameworksSectionProps {
  frameworks: Framework[];
  onFrameworkClick: (framework: Framework) => void;
  loading?: boolean;
}

export const FrameworksSection = ({ frameworks, onFrameworkClick, loading = false }: FrameworksSectionProps) => {
  const {
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
  } = useFrameworkFilters(frameworks);

  const pagination = usePagination(filteredFrameworks, 18);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FrameworkFiltersComponent
        filters={filters}
        filterOptions={filterOptions}
        onSearchChange={setSearch}
        onToggleRegion={toggleRegion}
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
              <span className="font-medium text-slate-700">{frameworks.length}</span> frameworks
            </>
          ) : (
            <>
              <span className="font-medium text-hlola-blue">{frameworks.length}</span> frameworks
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
            {pagination.paginatedData.map((framework) => (
              <FrameworkCard
                key={framework.id}
                framework={framework}
                onClick={onFrameworkClick}
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
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No frameworks found</h3>
              <p className="text-slate-500 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results."
                  : "No frameworks are available at the moment."
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
