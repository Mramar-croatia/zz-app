import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  FilterSelect,
  ResultCount,
  Badge,
  LocationBadge,
  PageLoader,
} from '../components';
import { formatDateCroatian, formatDateLong, getUniqueYears } from '../utils/croatian';

export default function Termini({ sessions, loading }) {
  const [locationFilter, setLocationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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
      // Location filter
      if (locationFilter && s.location !== locationFilter) return false;

      // Year filter
      if (yearFilter && s.parsedDate?.getFullYear() !== parseInt(yearFilter)) return false;

      return true;
    });

    // Sort by date descending (newest first)
    result.sort((a, b) => {
      if (!a.parsedDate) return 1;
      if (!b.parsedDate) return -1;
      return b.parsedDate - a.parsedDate;
    });

    return result;
  }, [sessions, locationFilter, yearFilter]);

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

  const clearFilters = () => {
    setLocationFilter('');
    setYearFilter('');
  };

  if (loading) {
    return <PageLoader />;
  }

  const hasFilters = locationFilter || yearFilter;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-wrap gap-3 flex-1">
              <FilterSelect
                label="Lokacija"
                value={locationFilter}
                onChange={setLocationFilter}
                options={filterOptions.locations}
                placeholder="Sve lokacije"
              />
              <FilterSelect
                label="Godina"
                value={yearFilter}
                onChange={setYearFilter}
                options={filterOptions.years.map(y => ({ value: y.toString(), label: y.toString() }))}
                placeholder="Sve godine"
              />
            </div>
          </div>
          {hasFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
              <ResultCount
                count={filteredSessions.length}
                total={sessions?.length || 0}
                label="termina"
              />
              <button
                onClick={clearFilters}
                className="text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
              >
                Ukloni filtere
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <CalendarDays className="w-6 h-6 mx-auto text-brand-purple mb-2" />
            <p className="text-2xl font-bold text-surface-900">{totals.sessions}</p>
            <p className="text-xs text-surface-500">Termina</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Baby className="w-6 h-6 mx-auto text-brand-gold mb-2" />
            <p className="text-2xl font-bold text-surface-900">{totals.children}</p>
            <p className="text-xs text-surface-500">Djece</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-surface-900">{totals.volunteers}</p>
            <p className="text-xs text-surface-500">Volontera</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Datum</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead className="text-center">Djeca</TableHead>
              <TableHead className="text-center">Volonteri</TableHead>
              <TableHead>Prisutni volonteri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length === 0 ? (
              <TableRow hover={false}>
                <TableCell colSpan={5}>
                  <EmptyState
                    icon={Calendar}
                    title="Nema pronađenih termina"
                    description="Pokušajte s drugim filterima"
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredSessions.map((session, index) => (
                <TableRow key={`${session.date}-${session.location}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      <span className="font-medium text-surface-900">
                        {session.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <LocationBadge location={session.location} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-brand-gold">
                      {session.childrenCount || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-brand-purple">
                      {session.volunteerCount || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {session.volunteersList?.length > 0 ? (
                        session.volunteersList.slice(0, 5).map((name, i) => (
                          <Badge key={i} variant="default" className="text-xs">
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-surface-400 text-sm">-</span>
                      )}
                      {session.volunteersList?.length > 5 && (
                        <Badge variant="purple" className="text-xs">
                          +{session.volunteersList.length - 5}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={Calendar}
                title="Nema pronađenih termina"
                description="Pokušajte s drugim filterima"
              />
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session, index) => {
            const id = `${session.date}-${session.location}-${index}`;
            const isExpanded = expandedId === id;

            return (
              <Card
                key={id}
                hover
                onClick={() => setExpandedId(isExpanded ? null : id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-surface-400" />
                        <span className="font-semibold text-surface-900">
                          {session.date}
                        </span>
                      </div>
                      <div className="mt-1">
                        <LocationBadge location={session.location} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-brand-gold">
                          {session.childrenCount || '-'}
                        </p>
                        <p className="text-xs text-surface-500">djece</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-brand-purple">
                          {session.volunteerCount || '-'}
                        </p>
                        <p className="text-xs text-surface-500">vol.</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-surface-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-surface-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && session.volunteersList?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-surface-100 animate-fade-in">
                      <p className="text-sm font-medium text-surface-700 mb-2">
                        Prisutni volonteri:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {session.volunteersList.map((name, i) => (
                          <Badge key={i} variant="default" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
