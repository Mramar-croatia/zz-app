import { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Baby,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Send,
  RotateCcw,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SearchInput,
  DateInput,
  NumberInput,
  Select,
  Button,
  Alert,
  Badge,
  Checkbox,
  FilterChips,
  PageLoader,
} from '../components';
import { useSubmitAttendance } from '../hooks/useApi';
import { formatDateISO, sortCroatian } from '../utils/croatian';

export default function Unos({ volunteers, loading }) {
  // Form state
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));
  const [location, setLocation] = useState('');
  const [childrenCount, setChildrenCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [selectedVolunteers, setSelectedVolunteers] = useState(new Set());

  // UI state
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showSelected, setShowSelected] = useState(false);

  // Submission hook
  const { submit, loading: submitting, error, success, reset } = useSubmitAttendance();

  // Get unique locations
  const locations = useMemo(() => {
    if (!volunteers) return [];
    const locs = new Set(volunteers.flatMap(v => v.locations || []));
    return Array.from(locs).sort(sortCroatian);
  }, [volunteers]);

  // Filter volunteers for display
  const filteredVolunteers = useMemo(() => {
    if (!volunteers) return [];

    let result = volunteers.filter(v => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (!v.name?.toLowerCase().includes(searchLower)) return false;
      }

      // Location filter (show volunteers who work at selected location)
      if (filterLocation && !v.locations?.includes(filterLocation)) return false;

      // Show only selected filter
      if (showSelected && !selectedVolunteers.has(v.name)) return false;

      return true;
    });

    return result.sort((a, b) => sortCroatian(a.name || '', b.name || ''));
  }, [volunteers, search, filterLocation, showSelected, selectedVolunteers]);

  // Auto-update volunteer count when selection changes
  useEffect(() => {
    setVolunteerCount(selectedVolunteers.size);
  }, [selectedVolunteers]);

  // When form location changes, optionally filter volunteer list
  useEffect(() => {
    if (location && !filterLocation) {
      setFilterLocation(location);
    }
  }, [location]);

  const toggleVolunteer = (name) => {
    setSelectedVolunteers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const newSet = new Set(selectedVolunteers);
    filteredVolunteers.forEach(v => newSet.add(v.name));
    setSelectedVolunteers(newSet);
  };

  const deselectAll = () => {
    if (filterLocation || search || showSelected) {
      // Only deselect filtered ones
      const newSet = new Set(selectedVolunteers);
      filteredVolunteers.forEach(v => newSet.delete(v.name));
      setSelectedVolunteers(newSet);
    } else {
      setSelectedVolunteers(new Set());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();

    try {
      await submit({
        selectedDate,
        location,
        childrenCount,
        volunteerCount,
        selected: Array.from(selectedVolunteers),
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleReset = () => {
    setSelectedDate(formatDateISO(new Date()));
    setLocation('');
    setChildrenCount(0);
    setVolunteerCount(0);
    setSelectedVolunteers(new Set());
    setSearch('');
    setFilterLocation('');
    setShowSelected(false);
    reset();
  };

  // Validation
  const isValid = selectedDate && location && selectedVolunteers.size > 0;

  if (loading) {
    return <PageLoader />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status Alerts */}
      {success && (
        <Alert variant="success" title="Uspješno!" onClose={reset}>
          Termin je uspješno zabilježen.
        </Alert>
      )}
      {error && (
        <Alert variant="error" title="Greška" onClose={reset}>
          {error}
        </Alert>
      )}

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-brand-purple" />
            Podaci o terminu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DateInput
              label="Datum"
              value={selectedDate}
              onChange={setSelectedDate}
              required
            />
            <Select
              label="Lokacija"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={locations.map(l => ({ value: l, label: l }))}
              placeholder="Odaberi lokaciju"
              required
            />
            <NumberInput
              label="Broj djece"
              value={childrenCount}
              onChange={setChildrenCount}
              min={0}
            />
            <NumberInput
              label="Broj volontera"
              value={volunteerCount}
              onChange={setVolunteerCount}
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Selection Section */}
      <Card>
        <CardHeader className="border-b border-surface-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-brand-purple" />
                Odabir volontera
              </CardTitle>
              <Badge variant={selectedVolunteers.size > 0 ? 'success' : 'default'}>
                {selectedVolunteers.size} odabrano
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAll}
              >
                Odaberi sve
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={deselectAll}
              >
                Poništi sve
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Pretraži volontere..."
              className="flex-1"
            />
            <div className="flex gap-3">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="select input-sm min-w-[140px]"
              >
                <option value="">Sve lokacije</option>
                {locations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowSelected(!showSelected)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${showSelected
                    ? 'bg-brand-purple text-white'
                    : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
                  }
                `}
              >
                Samo odabrani
              </button>
            </div>
          </div>

          {/* Volunteer List */}
          <div className="max-h-[450px] overflow-y-auto scrollbar-thin border border-surface-200 rounded-xl">
            {filteredVolunteers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 mx-auto text-surface-300 mb-4" />
                <p className="text-lg text-surface-500">Nema pronađenih volontera</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {filteredVolunteers.map((volunteer, index) => {
                  const isSelected = selectedVolunteers.has(volunteer.name);
                  return (
                    <div
                      key={`${volunteer.name}-${index}`}
                      onClick={() => toggleVolunteer(volunteer.name)}
                      className={`
                        flex items-center gap-4 p-4 cursor-pointer transition-colors
                        ${isSelected
                          ? 'bg-brand-purple/5 hover:bg-brand-purple/10'
                          : 'hover:bg-surface-50'
                        }
                      `}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg border-2 flex items-center justify-center
                        transition-all flex-shrink-0
                        ${isSelected
                          ? 'bg-brand-purple border-brand-purple'
                          : 'border-surface-300 hover:border-surface-400'
                        }
                      `}>
                        {isSelected && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-lg truncate ${isSelected ? 'text-brand-purple' : 'text-surface-900'}`}>
                          {volunteer.name}
                        </p>
                        <p className="text-sm text-surface-500 truncate">
                          {volunteer.school} • {volunteer.grade}. razred
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {volunteer.locations?.slice(0, 2).map((loc, i) => (
                          <Badge
                            key={i}
                            variant={loc === location ? 'success' : 'default'}
                          >
                            {loc}
                          </Badge>
                        ))}
                        {volunteer.locations?.length > 2 && (
                          <Badge variant="default">
                            +{volunteer.locations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          className="sm:order-1"
        >
          <RotateCcw className="w-5 h-5" />
          Resetiraj
        </Button>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={!isValid || submitting}
          loading={submitting}
          className="sm:order-2"
        >
          <Send className="w-5 h-5" />
          Spremi termin
        </Button>
      </div>

      {/* Validation Helper */}
      {!isValid && (
        <p className="text-sm text-surface-500 text-center">
          {!selectedDate && 'Odaberite datum. '}
          {!location && 'Odaberite lokaciju. '}
          {selectedVolunteers.size === 0 && 'Odaberite barem jednog volontera.'}
        </p>
      )}
    </form>
  );
}
