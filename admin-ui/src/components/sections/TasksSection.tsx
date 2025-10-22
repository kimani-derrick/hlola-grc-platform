import { Task } from '@/types';
import { HorizontalTaskCard } from '../HorizontalTaskCard';
import { TaskFiltersComponent } from '../TaskFilters';
import { Pagination } from '../Pagination';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { usePagination } from '@/hooks/usePagination';
import { Search, AlertCircle } from 'lucide-react';

interface TasksSectionProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  loading?: boolean;
}

export const TasksSection = ({ tasks, onTaskClick, loading = false }: TasksSectionProps) => {
  const {
    filters,
    filterOptions,
    filteredTasks,
    setSearch,
    toggleCategory,
    togglePriority,
    toggleStatus,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount
  } = useTaskFilters(tasks);

  const pagination = usePagination(filteredTasks, 10);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TaskFiltersComponent
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
              <span className="font-medium text-slate-700">{tasks.length}</span> tasks
            </>
          ) : (
            <>
              <span className="font-medium text-hlola-blue">{tasks.length}</span> tasks
            </>
          )}
        </div>
      </div>

      {/* Horizontal List Layout */}
      {loading ? (
        <LoadingSkeleton count={10} />
      ) : pagination.paginatedData.length > 0 ? (
        <>
          <div className="space-y-4">
            {pagination.paginatedData.map((task) => (
              <HorizontalTaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
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
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No tasks found</h3>
              <p className="text-slate-500 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results."
                  : "No tasks are available at the moment."
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