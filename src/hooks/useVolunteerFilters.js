import { useState, useMemo, useCallback } from 'react';
import { sortCroatian } from '../utils/croatian';
import { getActivityStatus, getVolunteerActivityMap } from '../utils/volunteer';

/**
 * Custom hook for volunteer filtering and sorting
 * @param {Array} volunteers - Array of volunteer objects
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Filter state, handlers, and filtered results
 */
export default function useVolunteerFilters(volunteers = [], sessions = []) {
  // Filter state
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // Calculate volunteer activity map
  const volunteerActivityMap = useMemo(
    () => getVolunteerActivityMap(volunteers, sessions),
    [volunteers, sessions]
  );

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!volunteers) return { schools: [], grades: [], locations: [] };

    const schools = [...new Set(volunteers.map(v => v.school).filter(Boolean))].sort(
      sortCroatian
    );
    const grades = [...new Set(volunteers.map(v => v.grade).filter(Boolean))].sort(
      (a, b) => a - b
    );
    const locations = [
      ...new Set(volunteers.flatMap(v => v.locations || [])),
    ].sort(sortCroatian);

    return { schools, grades, locations };
  }, [volunteers]);

  // Filter and sort volunteers
  const filteredVolunteers = useMemo(() => {
    if (!volunteers) return [];

    let result = volunteers.filter(v => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          v.name?.toLowerCase().includes(searchLower) ||
          v.school?.toLowerCase().includes(searchLower) ||
          v.phone?.includes(search);
        if (!matchesSearch) return false;
      }

      // School filter
      if (schoolFilter && v.school !== schoolFilter) return false;

      // Grade filter
      if (gradeFilter && v.grade !== gradeFilter) return false;

      // Location filter
      if (locationFilter && !v.locations?.includes(locationFilter)) return false;

      // Activity filter
      if (activityFilter) {
        const status = getActivityStatus(v, sessions);
        if (status.status !== activityFilter) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = sortCroatian(a.name || '', b.name || '');
          break;
        case 'school':
          comparison = sortCroatian(a.school || '', b.school || '');
          break;
        case 'grade':
          comparison = (parseInt(a.grade) || 0) - (parseInt(b.grade) || 0);
          break;
        case 'hours':
          comparison = (a.hours || 0) - (b.hours || 0);
          break;
        case 'lastActive':
          const aDate = volunteerActivityMap.get(a.name)?.lastActive || new Date(0);
          const bDate = volunteerActivityMap.get(b.name)?.lastActive || new Date(0);
          comparison = aDate - bDate;
          break;
        default:
          comparison = 0;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [
    volunteers,
    search,
    schoolFilter,
    gradeFilter,
    locationFilter,
    activityFilter,
    sortBy,
    sortDir,
    volunteerActivityMap,
    sessions,
  ]);

  // Handlers
  const handleSort = useCallback(
    column => {
      if (sortBy === column) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(column);
        setSortDir('asc');
      }
    },
    [sortBy, sortDir]
  );

  const clearFilters = useCallback(() => {
    setSearch('');
    setSchoolFilter('');
    setGradeFilter('');
    setLocationFilter('');
    setActivityFilter('');
  }, []);

  const hasFilters = search || schoolFilter || gradeFilter || locationFilter || activityFilter;

  return {
    // Filter state
    search,
    schoolFilter,
    gradeFilter,
    locationFilter,
    activityFilter,
    sortBy,
    sortDir,

    // Setters
    setSearch,
    setSchoolFilter,
    setGradeFilter,
    setLocationFilter,
    setActivityFilter,
    setSortBy,
    setSortDir,

    // Computed values
    filterOptions,
    filteredVolunteers,
    volunteerActivityMap,
    hasFilters,

    // Handlers
    handleSort,
    clearFilters,

    // For reset deps (used with usePagination)
    filterDeps: [search, schoolFilter, gradeFilter, locationFilter, activityFilter],
  };
}
