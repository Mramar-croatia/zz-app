import { useState, useMemo, useCallback } from 'react';
import { getUniqueYears } from '../utils/croatian';
import { isCancelledSession, getSessionCounts } from '../utils/session';

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
  const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'cancelled'

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!sessions) return { locations: [], years: [] };

    const locations = [...new Set(sessions.map(s => s.location).filter(Boolean))];
    const years = getUniqueYears(sessions.map(s => s.parsedDate));

    return { locations, years };
  }, [sessions]);

  // Get session counts before other filters
  const sessionCounts = useMemo(() => {
    return getSessionCounts(sessions);
  }, [sessions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (!sessions) return [];

    let result = sessions.filter(s => {
      // Status filter
      if (statusFilter === 'active' && isCancelledSession(s)) return false;
      if (statusFilter === 'cancelled' && !isCancelledSession(s)) return false;

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
  }, [sessions, search, locationFilter, yearFilter, statusFilter]);

  // Calculate totals (only for active sessions in the filtered set)
  const totals = useMemo(() => {
    const activeSessions = filteredSessions.filter(s => !isCancelledSession(s));
    const cancelledSessions = filteredSessions.filter(s => isCancelledSession(s));

    return {
      children: activeSessions.reduce((acc, s) => acc + (s.childrenCount || 0), 0),
      volunteers: activeSessions.reduce((acc, s) => acc + (s.volunteerCount || 0), 0),
      sessions: activeSessions.length,
      cancelled: cancelledSessions.length,
      total: filteredSessions.length,
    };
  }, [filteredSessions]);

  // Handlers
  const clearFilters = useCallback(() => {
    setSearch('');
    setLocationFilter('');
    setYearFilter('');
    setStatusFilter('active');
  }, []);

  const hasFilters = search || locationFilter || yearFilter || statusFilter !== 'active';

  return {
    // Filter state
    search,
    locationFilter,
    yearFilter,
    statusFilter,

    // Setters
    setSearch,
    setLocationFilter,
    setYearFilter,
    setStatusFilter,

    // Computed values
    filterOptions,
    filteredSessions,
    totals,
    sessionCounts,
    hasFilters,

    // Handlers
    clearFilters,

    // For reset deps (used with usePagination)
    filterDeps: [search, locationFilter, yearFilter, statusFilter],
  };
}
