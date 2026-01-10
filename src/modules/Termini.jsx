import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
  List,
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
  SearchInput,
  FilterSelect,
  ResultCount,
  Badge,
  LocationBadge,
  PageLoader,
  SessionDetailDrawer,
  VolunteerDetailDrawer,
} from '../components';
import { formatDateCroatian, formatDateLong, getUniqueYears } from '../utils/croatian';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, totalItems }) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-surface-100">
      <div className="flex items-center gap-3 text-base text-surface-500">
        <span>Prikazano {startItem}-{endItem} od {totalItems}</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="select input-sm w-auto pr-10"
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>{size} po stranici</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 hover:bg-surface-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-11 h-11 rounded-lg text-base font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-brand-purple text-white'
                    : 'hover:bg-surface-100 text-surface-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 hover:bg-surface-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function Termini({ sessions, volunteers = [], loading }) {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // View state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const searchInputRef = useRef(null);

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
  }, [sessions, search, locationFilter, yearFilter]);

  // Paginated sessions
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSessions.slice(startIndex, startIndex + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSessions.length / pageSize);

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
    setSearch('');
    setLocationFilter('');
    setYearFilter('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, locationFilter, yearFilter, pageSize]);

  if (loading) {
    return <PageLoader />;
  }

  const hasFilters = search || locationFilter || yearFilter;

  return (
    <div className="space-y-4">
      {/* Stats Dashboard */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            {/* Sessions */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 mb-3">
                <CalendarDays className="w-6 h-6 text-brand-purple" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-brand-purple">{totals.sessions}</p>
              <p className="text-sm text-surface-500 mt-1">Termina</p>
              {hasFilters && filteredSessions.length !== sessions?.length && (
                <p className="text-xs text-surface-400 mt-0.5">od {sessions?.length || 0} ukupno</p>
              )}
            </div>

            {/* Children */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-gold/10 mb-3">
                <Baby className="w-6 h-6 text-brand-gold" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-brand-gold">{totals.children}</p>
              <p className="text-sm text-surface-500 mt-1">Djece</p>
            </div>

            {/* Volunteers */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-emerald-600">{totals.volunteers}</p>
              <p className="text-sm text-surface-500 mt-1">Volontera</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-5">
          {/* Desktop: Result count header */}
          <div className="hidden lg:flex items-center justify-between mb-4 pb-4 border-b border-surface-100">
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white shadow-sm text-brand-purple'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Tablični prikaz"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white shadow-sm text-brand-purple'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Kartični prikaz"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {hasFilters && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Search bar - full width */}
          <SearchInput
            ref={searchInputRef}
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Pretraži termine..."
            className="w-full"
          />

          {/* Filter selects - grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
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

          {/* Mobile: Result count - only show when filters active */}
          {hasFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-surface-100">
              <div className="flex items-center justify-between">
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
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
              {paginatedSessions.length === 0 ? (
                <TableRow hover={false}>
                  <TableCell colSpan={5} className="p-0">
                    <div className="flex justify-center">
                      <div className="w-full max-w-xl">
                        <EmptyState
                          icon={Calendar}
                          title="Nema pronađenih termina"
                          description="Pokušajte s drugim filterima"
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSessions.map((session, index) => (
                  <TableRow
                    key={`${session.date}-${session.location}-${index}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedSession(session)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-surface-400" />
                        <span className="font-medium text-surface-900 text-lg">
                          {session.date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <LocationBadge location={session.location} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-brand-gold text-lg">
                        {session.childrenCount || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-brand-purple text-lg">
                        {session.volunteerCount || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 max-w-xl">
                        {session.volunteersList?.length > 0 ? (
                          session.volunteersList.slice(0, 5).map((name, i) => (
                            <Badge key={i} variant="default">
                              {name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-surface-400">-</span>
                        )}
                        {session.volunteersList?.length > 5 && (
                          <Badge variant="purple">
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

          {/* Pagination */}
          {filteredSessions.length > 0 && (
            <div className="px-6 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={filteredSessions.length}
              />
            </div>
          )}
        </Card>
      )}

      {/* Desktop Card View */}
      {viewMode === 'cards' && (
        <div className="hidden lg:block">
          {paginatedSessions.length === 0 ? (
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
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedSessions.map((session, index) => (
                  <Card
                    key={`${session.date}-${session.location}-${index}`}
                    hover
                    onClick={() => setSelectedSession(session)}
                    className="cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-surface-900 text-lg">
                              {session.date}
                            </h3>
                            <LocationBadge location={session.location} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-center">
                          <Baby className="w-5 h-5 mx-auto text-brand-gold mb-1" />
                          <p className="text-xl font-bold text-brand-gold">{session.childrenCount || '-'}</p>
                          <p className="text-xs text-surface-500">djece</p>
                        </div>
                        <div className="text-center">
                          <Users className="w-5 h-5 mx-auto text-brand-purple mb-1" />
                          <p className="text-xl font-bold text-brand-purple">{session.volunteerCount || '-'}</p>
                          <p className="text-xs text-surface-500">volontera</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-surface-100">
                        <p className="text-xs text-surface-500 mb-2">Prisutni volonteri:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.volunteersList?.length > 0 ? (
                            <>
                              {session.volunteersList.slice(0, 3).map((name, i) => (
                                <Badge key={i} variant="default" className="text-xs">
                                  {name}
                                </Badge>
                              ))}
                              {session.volunteersList.length > 3 && (
                                <Badge variant="purple" className="text-xs">
                                  +{session.volunteersList.length - 3}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-surface-400 text-sm">-</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination for cards */}
              {filteredSessions.length > 0 && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
                      totalItems={filteredSessions.length}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedSessions.length === 0 ? (
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
          paginatedSessions.map((session, index) => {
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

        {/* Mobile Pagination */}
        {filteredSessions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={filteredSessions.length}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Session Detail Drawer */}
      {selectedSession && (
        <SessionDetailDrawer
          session={selectedSession}
          allVolunteers={volunteers}
          onClose={() => setSelectedSession(null)}
          onSelectVolunteer={(volunteer) => {
            setSelectedSession(null);
            setSelectedVolunteer(volunteer);
          }}
        />
      )}

      {/* Volunteer Detail Drawer */}
      {selectedVolunteer && (
        <VolunteerDetailDrawer
          volunteer={selectedVolunteer}
          sessions={sessions}
          allVolunteers={volunteers}
          onClose={() => setSelectedVolunteer(null)}
          onSelectVolunteer={setSelectedVolunteer}
          onSelectSession={(session) => {
            setSelectedVolunteer(null);
            setSelectedSession(session);
          }}
          hoursGoal={10}
          hoursGoals={{ basic: 10, bronze: 20, silver: 30, gold: 40 }}
        />
      )}
    </div>
  );
}
