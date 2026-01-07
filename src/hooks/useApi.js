import { useState, useEffect, useCallback } from 'react';
import { fetchVolunteers, fetchSessions, fetchStatistics, submitAttendance } from '../api';

/**
 * Generic hook for async data fetching
 */
function useAsync(asyncFn, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return { data, loading, error, execute, refetch };
}

/**
 * Hook for fetching volunteers
 */
export function useVolunteers() {
  return useAsync(fetchVolunteers, true);
}

/**
 * Hook for fetching sessions
 */
export function useSessions() {
  return useAsync(fetchSessions, true);
}

/**
 * Hook for fetching statistics
 */
export function useStatistics() {
  return useAsync(fetchStatistics, true);
}

/**
 * Hook for submitting attendance
 */
export function useSubmitAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (attendance) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await submitAttendance(attendance);
      setSuccess(true);
      return result;
    } catch (err) {
      if (err.message === 'DUPLICATE_ENTRY') {
        setError('Termin za ovaj datum i lokaciju već postoji.');
      } else {
        setError(err.message || 'Greška pri slanju podataka.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { submit, loading, error, success, reset };
}

/**
 * Hook for combined data (useful for Hero Stats)
 */
export function useDashboardData() {
  const volunteers = useVolunteers();
  const sessions = useSessions();
  const statistics = useStatistics();

  const loading = volunteers.loading || sessions.loading || statistics.loading;
  const error = volunteers.error || sessions.error || statistics.error;

  const refetchAll = useCallback(() => {
    return Promise.all([
      volunteers.refetch(),
      sessions.refetch(),
      statistics.refetch(),
    ]);
  }, [volunteers.refetch, sessions.refetch, statistics.refetch]);

  return {
    volunteers: volunteers.data,
    sessions: sessions.data,
    statistics: statistics.data,
    loading,
    error,
    refetchAll,
  };
}
