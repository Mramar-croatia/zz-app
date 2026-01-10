import { useState, useMemo, useCallback } from 'react';
import { getUniqueYears } from '../utils/croatian';

/**
 * Custom hook for session filtering
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Filter state, handlers, and filtered results
 */
export default function useSessionFilters(sessions = []) {
  // Filter state
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!sessions) return { locations: [], years: [] };

    const locations = [...new Set(sessions.map(s => s.location).filter(Boolean))];
    const years = getUniqueYears(sessions.map(s => s.parsedDate));

    return { locations, years };
  }, [sessions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (!sessions) return [];

    let result = sessions.filter(s => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          s.date?.toLowerCase().includes(searchLower) ||
          s.location?.toLowerCase().includes(searchLower) ||
          s.volunteersList?.some(v => v.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (locationFilter && s.location !== locationFilter) return false;

      // Year filter
      if (yearFilter && s.parsedDate?.getFullYear() !== parseInt(yearFilter))
        return false;

      return true;
    });

    // Sort by date descending (newest first)
    result.sort((a, b) => {
      if (!a.parsedDate) return 1;
      if (!b.parsedDate) return -1;
      return b.parsedDate - a.parsedDate;
    });

    return result;
  }, [sessions, search, locationFilter, yearFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredSessions.reduce(
      (acc, s) => ({
        children: acc.children + (s.childrenCount || 0),
        volunteers: acc.volunteers + (s.volunteerCount || 0),
        sessions: acc.sessions + 1,
      }),
      { children: 0, volunteers: 0, sessions: 0 }
    );
  }, [filteredSessions]);

  // Handlers
  const clearFilters = useCallback(() => {
    setSearch('');
    setLocationFilter('');
    setYearFilter('');
  }, []);

  const hasFilters = search || locationFilter || yearFilter;

  return {
    // Filter state
    search,
    locationFilter,
    yearFilter,

    // Setters
    setSearch,
    setLocationFilter,
    setYearFilter,

    // Computed values
    filterOptions,
    filteredSessions,
    totals,
    hasFilters,

    // Handlers
    clearFilters,

    // For reset deps (used with usePagination)
    filterDeps: [search, locationFilter, yearFilter],
  };
}
