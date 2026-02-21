import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Eye,
  Star,
  Keyboard,
  Settings2,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardContent,
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
  VolunteerDetailDrawer,
  SessionDetailDrawer,
  KeyboardShortcutsHelp,
  Pagination,
} from '../components';
import {
  HighlightText,
  HoursProgress,
  ActivityStatusBadge,
  QuickActions,
  Avatar,
} from '../components/volunteer';
import { HOURS_GOALS } from '../constants';
import { formatDateShort } from '../utils/croatian';
import { getActivityStatus } from '../utils/volunteer';
import useVolunteerFilters from '../hooks/useVolunteerFilters';
import usePagination from '../hooks/usePagination';

export default function Baza({ volunteers, sessions = [], loading }) {
  // Use custom hooks for filtering and pagination
  const {
    search,
    schoolFilter,
    gradeFilter,
    locationFilter,
    activityFilter,
    sortBy,
    sortDir,
    setSearch,
    setSchoolFilter,
    setGradeFilter,
    setLocationFilter,
    setActivityFilter,
    filterOptions,
    filteredVolunteers,
    volunteerActivityMap,
    hasFilters,
    handleSort,
    clearFilters,
    filterDeps,
  } = useVolunteerFilters(volunteers, sessions);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems: paginatedVolunteers,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredVolunteers, {
    resetDeps: filterDeps,
  });

  // View state
  const [viewMode, setViewMode] = useState('table');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [zebraStripes, setZebraStripes] = useState(true);
  const [colorCodedRows, setColorCodedRows] = useState(true);

  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const tableRef = useRef(null);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (selectedVolunteer) {
          setSelectedVolunteer(null);
        } else if (search) {
          setSearch('');
          searchInputRef.current?.blur();
        }
        return;
      }

      if (
        document.activeElement === tableRef.current ||
        tableRef.current?.contains(document.activeElement)
      ) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex(prev =>
            Math.min(prev + 1, paginatedVolunteers.length - 1)
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
          e.preventDefault();
          setSelectedVolunteer(paginatedVolunteers[focusedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    search,
    selectedVolunteer,
    focusedIndex,
    paginatedVolunteers,
    showShortcuts,
    setSearch,
  ]);

  const onPageChange = useCallback(
    page => {
      handlePageChange(page);
      setFocusedIndex(-1);
    },
    [handlePageChange]
  );

  const onPageSizeChange = useCallback(
    size => {
      handlePageSizeChange(size);
      setFocusedIndex(-1);
    },
    [handlePageSizeChange]
  );

  if (loading) {
    return <PageLoader />;
  }

  // Calculate stats
  const totalHours = filteredVolunteers.reduce(
    (sum, v) => sum + (v.hours || 0),
    0
  );
  const avgHours =
    filteredVolunteers.length > 0
      ? (totalHours / filteredVolunteers.length).toFixed(1)
      : 0;

  const basicGoal = filteredVolunteers.filter(
    v => (v.hours || 0) >= HOURS_GOALS.basic
  ).length;

  const activeCount = filteredVolunteers.filter(
    v => getActivityStatus(v, sessions).status === 'active'
  ).length;
  const inactiveCount = filteredVolunteers.filter(
    v => getActivityStatus(v, sessions).status === 'inactive'
  ).length;
  const dormantCount = filteredVolunteers.filter(
    v => getActivityStatus(v, sessions).status === 'dormant'
  ).length;

  return (
    <div className="space-y-4">
      {/* Stats Dashboard */}
      {!loading && volunteers && (
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
                  <Users className="w-6 h-6 text-surface-600" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-900">
                  {filteredVolunteers.length}
                </p>
                <p className="text-sm text-surface-500 mt-1">Volontera</p>
                {hasFilters && filteredVolunteers.length !== volunteers.length && (
                  <p className="text-xs text-surface-400 mt-0.5">
                    od {volunteers.length} ukupno
                  </p>
                )}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
                  <Activity className="w-6 h-6 text-surface-600" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-900">
                  {activeCount}
                </p>
                <p className="text-sm text-surface-500 mt-1">Aktivnih</p>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-surface-500">{inactiveCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-surface-500">{dormantCount}</span>
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
                  <Clock className="w-6 h-6 text-surface-600" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-700">
                  {totalHours}
                </p>
                <p className="text-sm text-surface-500 mt-1">Ukupno sati</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  ~{avgHours}h po volonteru
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
                  <GraduationCap className="w-6 h-6 text-surface-600" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-700">
                  {filterOptions.schools.length}
                </p>
                <p className="text-sm text-surface-500 mt-1">Škola</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {filterOptions.locations.length} lokacija
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-5">
          <div className="hidden lg:flex items-center justify-between mb-4 pb-4 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-100 border border-surface-200 p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white shadow-sm text-surface-900'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Tablični prikaz"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white shadow-sm text-surface-900'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Kartični prikaz"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              <div className="relative group">
                <button
                  className="p-2 hover:bg-surface-100 transition-colors"
                  title="Postavke prikaza"
                >
                  <Settings2 className="w-5 h-5 text-surface-500" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-60 bg-white shadow-lg border border-surface-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zebraStripes}
                      onChange={e => setZebraStripes(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-300 text-surface-700 focus:ring-surface-500"
                    />
                    <span className="text-sm text-surface-700">
                      Izmjenične boje redaka
                    </span>
                  </label>
                  <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={colorCodedRows}
                      onChange={e => setColorCodedRows(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-300 text-surface-700 focus:ring-surface-500"
                    />
                    <span className="text-sm text-surface-700">
                      Boje prema statusu
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setShowShortcuts(true)}
                className="p-2 hover:bg-surface-100 transition-colors"
                title="Tipkovni prečaci (?)"
              >
                <Keyboard className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {hasFilters && (
                <>
                  <ResultCount
                    count={filteredVolunteers.length}
                    total={volunteers?.length || 0}
                    label="volontera"
                  />
                  <button
                    onClick={clearFilters}
                    className="text-sm text-surface-700 hover:text-surface-900 underline font-medium"
                  >
                    Ukloni filtere
                  </button>
                </>
              )}
            </div>
          </div>

          <SearchInput
            ref={searchInputRef}
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Pretraži volontere... (pritisni / za fokus)"
            className="w-full"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <FilterSelect
              label="Škola"
              value={schoolFilter}
              onChange={setSchoolFilter}
              options={filterOptions.schools}
              placeholder="Sve škole"
            />
            <FilterSelect
              label="Razred"
              value={gradeFilter}
              onChange={setGradeFilter}
              options={filterOptions.grades.map(g => ({
                value: g,
                label: `${g}. razred`,
              }))}
              placeholder="Svi razredi"
            />
            <FilterSelect
              label="Lokacija"
              value={locationFilter}
              onChange={setLocationFilter}
              options={filterOptions.locations}
              placeholder="Sve lokacije"
            />
            <FilterSelect
              label="Status"
              value={activityFilter}
              onChange={setActivityFilter}
              options={[
                { value: 'active', label: 'Aktivan' },
                { value: 'inactive', label: 'Neaktivan' },
                { value: 'dormant', label: 'Uspavan' },
              ]}
              placeholder="Svi statusi"
            />
          </div>

          {hasFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-surface-100">
              <div className="flex items-center justify-between">
                <ResultCount
                  count={filteredVolunteers.length}
                  total={volunteers?.length || 0}
                  label="volontera"
                />
                <button
                  onClick={clearFilters}
                  className="text-sm text-surface-700 hover:text-surface-900 underline font-medium"
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
          <div ref={tableRef} tabIndex={0} className="outline-none">
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead
                    sortable
                    sorted={sortBy === 'name'}
                    direction={sortDir}
                    onSort={() => handleSort('name')}
                  >
                    IME I PREZIME
                  </TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead
                    sortable
                    sorted={sortBy === 'school'}
                    direction={sortDir}
                    onSort={() => handleSort('school')}
                  >
                    ŠKOLA
                  </TableHead>
                  <TableHead
                    sortable
                    sorted={sortBy === 'grade'}
                    direction={sortDir}
                    onSort={() => handleSort('grade')}
                  >
                    RAZRED
                  </TableHead>
                  <TableHead>LOKACIJE</TableHead>
                  <TableHead
                    sortable
                    sorted={sortBy === 'hours'}
                    direction={sortDir}
                    onSort={() => handleSort('hours')}
                    className="text-right"
                  >
                    SATI
                  </TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVolunteers.length === 0 ? (
                  <TableRow hover={false}>
                    <TableCell colSpan={7} className="p-0">
                      <div className="flex justify-center">
                        <div className="w-full max-w-xl">
                          <EmptyState
                            icon={Users}
                            title="Nema pronađenih volontera"
                            description="Pokušajte s drugim filterima"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVolunteers.map((volunteer, index) => {
                    const activity = volunteerActivityMap.get(volunteer.name);
                    const status = getActivityStatus(volunteer, sessions);
                    const isFocused = focusedIndex === index;
                    const hasMetGoal =
                      (volunteer.hours || 0) >= HOURS_GOALS.basic;

                    const rowBgClasses = [];
                    if (isFocused) {
                      rowBgClasses.push('bg-surface-200');
                    } else if (colorCodedRows && status.status === 'dormant') {
                      rowBgClasses.push('bg-[#FFF1F2]/30');
                    } else if (colorCodedRows && status.status === 'inactive') {
                      rowBgClasses.push('bg-[#FFFBEB]/20');
                    } else if (zebraStripes && index % 2 === 1) {
                      rowBgClasses.push('bg-surface-50/50');
                    }

                    return (
                      <TableRow
                        key={`${volunteer.name}-${index}`}
                        className={`group cursor-pointer ${rowBgClasses.join(' ')}`}
                        onClick={() => setSelectedVolunteer(volunteer)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar name={volunteer.name} size="sm" />
                            <div>
                              <div className="font-medium text-surface-900 text-base flex items-center gap-2">
                                <HighlightText
                                  text={volunteer.name}
                                  search={search}
                                />
                                {hasMetGoal && (
                                  <Star
                                    className="w-4 h-4 text-brand-gold fill-brand-gold"
                                    title="Cilj sati ostvaren!"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ActivityStatusBadge status={status} />
                        </TableCell>
                        <TableCell>
                          <span className="text-surface-600">
                            <HighlightText
                              text={volunteer.school}
                              search={search}
                            />
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="purple">{volunteer.grade}.</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {volunteer.locations?.map((loc, i) => (
                              <LocationBadge key={i} location={loc} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <HoursProgress hours={volunteer.hours} compact />
                        </TableCell>
                        <TableCell>
                          <QuickActions
                            volunteer={volunteer}
                            onViewProfile={setSelectedVolunteer}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {filteredVolunteers.length > 0 && (
            <div className="px-6 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                totalItems={filteredVolunteers.length}
              />
            </div>
          )}
        </Card>
      )}

      {/* Desktop Card View */}
      {viewMode === 'cards' && (
        <div className="hidden lg:block">
          {paginatedVolunteers.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Users}
                  title="Nema pronađenih volontera"
                  description="Pokušajte s drugim filterima"
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedVolunteers.map((volunteer, index) => {
                  const activity = volunteerActivityMap.get(volunteer.name);
                  const status = getActivityStatus(volunteer, sessions);

                  return (
                    <Card
                      key={`${volunteer.name}-${index}`}
                      hover
                      onClick={() => setSelectedVolunteer(volunteer)}
                      className="cursor-pointer"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-surface-900 text-lg truncate">
                              <HighlightText
                                text={volunteer.name}
                                search={search}
                              />
                            </h3>
                            <p className="text-sm text-surface-500 truncate mt-0.5">
                              <HighlightText
                                text={volunteer.school}
                                search={search}
                              />
                            </p>
                          </div>
                          <ActivityStatusBadge status={status} />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="purple">
                            {volunteer.grade}. razred
                          </Badge>
                          <span className="text-xs text-surface-400">
                            {activity?.sessionCount || 0} termina
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {volunteer.locations?.map((loc, i) => (
                            <LocationBadge key={i} location={loc} />
                          ))}
                        </div>

                        <HoursProgress hours={volunteer.hours} />

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                          <span className="text-xs text-surface-400">
                            Zadnje: {formatDateShort(activity?.lastActive)}
                          </span>
                          <QuickActions
                            volunteer={volunteer}
                            onViewProfile={setSelectedVolunteer}
                            compact
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredVolunteers.length > 0 && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                      pageSize={pageSize}
                      onPageSizeChange={onPageSizeChange}
                      totalItems={filteredVolunteers.length}
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
        {paginatedVolunteers.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={Users}
                title="Nema pronađenih volontera"
                description="Pokušajte s drugim filterima"
              />
            </CardContent>
          </Card>
        ) : (
          paginatedVolunteers.map((volunteer, index) => {
            const id = `${volunteer.name}-${index}`;
            const isExpanded = expandedId === id;
            const activity = volunteerActivityMap.get(volunteer.name);
            const status = getActivityStatus(volunteer, sessions);

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
                        <span
                          className={`w-2.5 h-2.5 inline-block ${status.dotColor}`}
                        />
                        <h3 className="font-semibold text-surface-900 text-lg truncate">
                          <HighlightText text={volunteer.name} search={search} />
                        </h3>
                      </div>
                      <p className="text-sm text-surface-500 truncate mt-1">
                        <HighlightText text={volunteer.school} search={search} />
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-surface-500 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {volunteer.locations?.slice(0, 2).map((loc, i) => (
                            <span
                              key={i}
                              className="text-xs font-medium text-surface-700 bg-surface-100 border border-surface-200 px-1.5 py-0.5"
                            >
                              {loc}
                            </span>
                          ))}
                          {volunteer.locations?.length > 2 && (
                            <span className="text-xs text-surface-500">
                              +{volunteer.locations.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <GraduationCap className="w-4 h-4 text-surface-700" />
                          <span className="font-bold text-surface-900 text-lg">
                            {volunteer.grade}.
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-surface-700 font-bold mt-1">
                          {volunteer.hours} h
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-surface-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-surface-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-surface-100 space-y-3 animate-fade-in">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">
                            Lokacije
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {volunteer.locations?.map((loc, i) => (
                              <LocationBadge key={i} location={loc} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-surface-400" />
                        <a
                          href={`tel:${volunteer.phone}`}
                          className="text-surface-700 font-mono"
                          onClick={e => e.stopPropagation()}
                        >
                          {volunteer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600">
                          Zadnje aktivno: {formatDateShort(activity?.lastActive)}
                        </span>
                      </div>
                      <HoursProgress hours={volunteer.hours} />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedVolunteer(volunteer);
                        }}
                        className="w-full btn btn-secondary btn-sm mt-2"
                      >
                        <Eye className="w-4 h-4" />
                        Pogledaj profil
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {filteredVolunteers.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                totalItems={filteredVolunteers.length}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Volunteer Detail Drawer */}
      {selectedVolunteer && (
        <VolunteerDetailDrawer
          volunteer={selectedVolunteer}
          sessions={sessions}
          allVolunteers={volunteers}
          onClose={() => setSelectedVolunteer(null)}
          onSelectVolunteer={setSelectedVolunteer}
          onSelectSession={session => {
            setSelectedVolunteer(null);
            setSelectedSession(session);
          }}
          hoursGoal={HOURS_GOALS.basic}
          hoursGoals={HOURS_GOALS}
        />
      )}

      {/* Session Detail Drawer */}
      {selectedSession && (
        <SessionDetailDrawer
          session={selectedSession}
          allVolunteers={volunteers}
          onClose={() => setSelectedSession(null)}
          onSelectVolunteer={volunteer => {
            setSelectedSession(null);
            setSelectedVolunteer(volunteer);
          }}
        />
      )}

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
