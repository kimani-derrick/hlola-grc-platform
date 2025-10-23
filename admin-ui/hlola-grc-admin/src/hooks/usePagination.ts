import { useState, useMemo, useCallback, useEffect } from 'react';

export interface PaginationConfig {
  itemsPerPage: number;
  currentPage: number;
}

export const usePagination = <T>(
  data: T[],
  initialItemsPerPage: number = 18
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination values
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get paginated data
  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const setItemsPerPageAndReset = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  // Reset to page 1 when data changes (e.g., when filters change)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Ensure current page is valid when total pages change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  return {
    // Data
    paginatedData,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    startIndex: startIndex + 1, // 1-based for display
    endIndex: Math.min(endIndex, totalItems), // 1-based for display
    
    // Navigation
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage: setItemsPerPageAndReset,
    
    // State
    canGoNext,
    canGoPrev,
    
    // Config
    itemsPerPageOptions: [15, 18, 24, 30]
  };
};
