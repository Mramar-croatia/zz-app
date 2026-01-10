import { useState, useMemo, useEffect, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants';

/**
 * Custom hook for pagination logic
 * @param {Array} items - Full array of items to paginate
 * @param {Object} options - Configuration options
 * @param {number} options.initialPageSize - Initial page size
 * @param {Array} options.resetDeps - Dependencies that should reset to page 1
 * @returns {Object} Pagination state and handlers
 */
export default function usePagination(items = [], options = {}) {
  const { initialPageSize = DEFAULT_PAGE_SIZE, resetDeps = [] } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize]
  );

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, [...resetDeps, pageSize]);

  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    // State
    currentPage,
    pageSize,
    totalPages,
    totalItems: items.length,
    paginatedItems,

    // Pagination info
    startItem: items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0,
    endItem: Math.min(currentPage * pageSize, items.length),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
  };
}
