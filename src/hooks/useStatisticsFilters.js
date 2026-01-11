import { useState, useCallback, useMemo } from 'react';

export default function useStatisticsFilters() {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = useMemo(() =>
    dateRange.start || selectedLocations.length > 0 || selectedSchools.length > 0,
    [dateRange.start, selectedLocations.length, selectedSchools.length]
  );

  const clearFilters = useCallback(() => {
    setDateRange({ start: null, end: null });
    setSelectedLocations([]);
    setSelectedSchools([]);
  }, []);

  const filterValues = useMemo(() => ({
    dateRange: dateRange.start ? dateRange : null,
    locations: selectedLocations.length > 0 ? selectedLocations : null,
    schools: selectedSchools.length > 0 ? selectedSchools : null,
  }), [dateRange, selectedLocations, selectedSchools]);

  const filterDeps = useMemo(() =>
    [dateRange.start, dateRange.end, selectedLocations.join(','), selectedSchools.join(',')],
    [dateRange.start, dateRange.end, selectedLocations, selectedSchools]
  );

  return {
    dateRange,
    setDateRange,
    selectedLocations,
    setSelectedLocations,
    selectedSchools,
    setSelectedSchools,
    showFilters,
    setShowFilters,
    hasFilters,
    clearFilters,
    filterValues,
    filterDeps,
  };
}
