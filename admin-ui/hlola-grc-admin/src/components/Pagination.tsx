'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';

interface PaginationProps {
  pagination: ReturnType<typeof usePagination>;
}

export const Pagination = ({ pagination }: PaginationProps) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    canGoNext,
    canGoPrev,
    itemsPerPageOptions
  } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="glass rounded-lg px-3 py-1 text-sm border-0 focus:ring-2 focus:ring-hlola-blue/20 focus:outline-none"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-slate-600">per page</span>
        </div>

        {/* Page info */}
        <div className="text-sm text-slate-600">
          Showing <span className="font-medium text-hlola-blue">{startIndex}</span> to{' '}
          <span className="font-medium text-hlola-blue">{endIndex}</span> of{' '}
          <span className="font-medium text-hlola-blue">{totalItems}</span> frameworks
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={prevPage}
            disabled={!canGoPrev}
            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-slate-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-hlola-blue text-white'
                        : 'glass hover:bg-white/10 text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={nextPage}
            disabled={!canGoNext}
            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page indicator */}
      <div className="mt-2 text-center text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
