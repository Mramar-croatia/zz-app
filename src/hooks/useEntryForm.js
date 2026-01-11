import { useState, useMemo, useEffect, useCallback } from 'react';
import { formatDateISO, sortCroatian } from '../utils/croatian';

export default function useEntryForm(volunteers, sessions = []) {
  // Form state
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));
  const [location, setLocation] = useState('');
  const [childrenCount, setChildrenCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [selectedVolunteers, setSelectedVolunteers] = useState(new Set());

  // Volunteer list filters
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [showSelected, setShowSelected] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  // Get unique locations from volunteers
  const locations = useMemo(() => {
    if (!volunteers) return [];
    const locs = new Set(volunteers.flatMap(v => v.locations || []));
    return Array.from(locs).sort(sortCroatian);
  }, [volunteers]);

  // Get unique schools from volunteers
  const schools = useMemo(() => {
    if (!volunteers) return [];
    const schoolSet = new Set(volunteers.map(v => v.school).filter(Boolean));
    return Array.from(schoolSet).sort(sortCroatian);
  }, [volunteers]);

  // Filter volunteers for display
  const filteredVolunteers = useMemo(() => {
    if (!volunteers) return [];

    let result = volunteers.filter(v => {
      // Search filter (name, school)
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = v.name?.toLowerCase().includes(searchLower);
        const matchesSchool = v.school?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesSchool) return false;
      }

      // Location filter
      if (filterLocation && !v.locations?.includes(filterLocation)) return false;

      // School filter
      if (filterSchool && v.school !== filterSchool) return false;

      // Show only selected filter
      if (showSelected && !selectedVolunteers.has(v.name)) return false;

      return true;
    });

    return result.sort((a, b) => sortCroatian(a.name || '', b.name || ''));
  }, [volunteers, search, filterLocation, filterSchool, showSelected, selectedVolunteers]);

  // Check for duplicate entry (same date and location)
  const duplicateEntry = useMemo(() => {
    if (!selectedDate || !location || !sessions) return null;
    return sessions.find(
      s => s.date === selectedDate && s.location === location
    );
  }, [selectedDate, location, sessions]);

  // Recent entries for the selected location
  const recentLocationEntries = useMemo(() => {
    if (!location || !sessions) return [];
    return sessions
      .filter(s => s.location === location)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [location, sessions]);

  // Today's entries
  const todayEntries = useMemo(() => {
    if (!sessions) return [];
    const today = formatDateISO(new Date());
    return sessions.filter(s => s.date === today);
  }, [sessions]);

  // This week's entries
  const thisWeekEntries = useMemo(() => {
    if (!sessions) return [];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart;
    });
  }, [sessions]);

  // Auto-update volunteer count when selection changes
  useEffect(() => {
    setVolunteerCount(selectedVolunteers.size);
  }, [selectedVolunteers]);

  // When form location changes, optionally filter volunteer list
  useEffect(() => {
    if (location && !filterLocation) {
      setFilterLocation(location);
    }
  }, [location, filterLocation]);

  // Volunteer selection actions
  const toggleVolunteer = useCallback((name) => {
    setSelectedVolunteers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    const newSet = new Set(selectedVolunteers);
    filteredVolunteers.forEach(v => newSet.add(v.name));
    setSelectedVolunteers(newSet);
  }, [filteredVolunteers, selectedVolunteers]);

  const deselectAll = useCallback(() => {
    if (filterLocation || filterSchool || search || showSelected) {
      // Only deselect filtered ones
      const newSet = new Set(selectedVolunteers);
      filteredVolunteers.forEach(v => newSet.delete(v.name));
      setSelectedVolunteers(newSet);
    } else {
      setSelectedVolunteers(new Set());
    }
  }, [filteredVolunteers, filterLocation, filterSchool, search, showSelected, selectedVolunteers]);

  const resetForm = useCallback(() => {
    setSelectedDate(formatDateISO(new Date()));
    setLocation('');
    setChildrenCount(0);
    setVolunteerCount(0);
    setSelectedVolunteers(new Set());
    setSearch('');
    setFilterLocation('');
    setFilterSchool('');
    setShowSelected(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setFilterLocation('');
    setFilterSchool('');
    setShowSelected(false);
  }, []);

  // Form validation
  const isValid = selectedDate && location && selectedVolunteers.size > 0;
  const hasFilters = search || filterLocation || filterSchool || showSelected;

  // Get form data for submission
  const getFormData = useCallback(() => ({
    selectedDate,
    location,
    childrenCount,
    volunteerCount,
    selected: Array.from(selectedVolunteers),
  }), [selectedDate, location, childrenCount, volunteerCount, selectedVolunteers]);

  return {
    // Form values
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    childrenCount,
    setChildrenCount,
    volunteerCount,
    setVolunteerCount,
    selectedVolunteers,
    setSelectedVolunteers,

    // Filter values
    search,
    setSearch,
    filterLocation,
    setFilterLocation,
    filterSchool,
    setFilterSchool,
    showSelected,
    setShowSelected,
    viewMode,
    setViewMode,

    // Computed values
    locations,
    schools,
    filteredVolunteers,
    duplicateEntry,
    recentLocationEntries,
    todayEntries,
    thisWeekEntries,
    isValid,
    hasFilters,

    // Actions
    toggleVolunteer,
    selectAll,
    deselectAll,
    resetForm,
    clearFilters,
    getFormData,
  };
}
