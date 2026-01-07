import { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
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
} from '../components';
import { sortCroatian } from '../utils/croatian';

export default function Baza({ volunteers, loading }) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [expandedId, setExpandedId] = useState(null);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!volunteers) return { schools: [], grades: [], locations: [] };

    const schools = [...new Set(volunteers.map(v => v.school).filter(Boolean))].sort(sortCroatian);
    const grades = [...new Set(volunteers.map(v => v.grade).filter(Boolean))].sort((a, b) => a - b);
    const locations = [...new Set(volunteers.flatMap(v => v.locations || []))].sort(sortCroatian);

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
        default:
          comparison = 0;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [volunteers, search, schoolFilter, gradeFilter, locationFilter, sortBy, sortDir]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSchoolFilter('');
    setGradeFilter('');
    setLocationFilter('');
  };

  if (loading) {
    return <PageLoader />;
  }

  const hasFilters = search || schoolFilter || gradeFilter || locationFilter;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Pretraži volontere..."
              className="flex-1"
            />
            <div className="flex flex-wrap gap-3">
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
                options={filterOptions.grades.map(g => ({ value: g, label: `${g}. razred` }))}
                placeholder="Svi razredi"
              />
              <FilterSelect
                label="Lokacija"
                value={locationFilter}
                onChange={setLocationFilter}
                options={filterOptions.locations}
                placeholder="Sve lokacije"
              />
            </div>
          </div>
          {hasFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
              <ResultCount
                count={filteredVolunteers.length}
                total={volunteers?.length || 0}
                label="volontera"
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

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead
                sortable
                sorted={sortBy === 'name'}
                direction={sortDir}
                onSort={() => handleSort('name')}
              >
                Ime i prezime
              </TableHead>
              <TableHead
                sortable
                sorted={sortBy === 'school'}
                direction={sortDir}
                onSort={() => handleSort('school')}
              >
                Škola
              </TableHead>
              <TableHead
                sortable
                sorted={sortBy === 'grade'}
                direction={sortDir}
                onSort={() => handleSort('grade')}
              >
                Razred
              </TableHead>
              <TableHead>Lokacije</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead
                sortable
                sorted={sortBy === 'hours'}
                direction={sortDir}
                onSort={() => handleSort('hours')}
                className="text-right"
              >
                Sati
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVolunteers.length === 0 ? (
              <TableRow hover={false}>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={Users}
                    title="Nema pronađenih volontera"
                    description="Pokušajte s drugim filterima"
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredVolunteers.map((volunteer, index) => (
                <TableRow key={`${volunteer.name}-${index}`}>
                  <TableCell>
                    <div className="font-medium text-surface-900">{volunteer.name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-surface-600">{volunteer.school}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="purple">{volunteer.grade}.</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.locations?.map((loc, i) => (
                        <LocationBadge key={i} location={loc} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-surface-500 font-mono text-sm">
                      {volunteer.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-brand-purple">
                      {volunteer.hours}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredVolunteers.length === 0 ? (
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
          filteredVolunteers.map((volunteer, index) => {
            const id = `${volunteer.name}-${index}`;
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
                      <h3 className="font-semibold text-surface-900 truncate">
                        {volunteer.name}
                      </h3>
                      <p className="text-sm text-surface-500 truncate mt-0.5">
                        {volunteer.school}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant="purple">{volunteer.grade}.</Badge>
                        <p className="text-sm font-semibold text-brand-purple mt-1">
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
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-surface-400" />
                        <div className="flex flex-wrap gap-1">
                          {volunteer.locations?.map((loc, i) => (
                            <LocationBadge key={i} location={loc} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-surface-400" />
                        <a
                          href={`tel:${volunteer.phone}`}
                          className="text-brand-purple font-mono"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {volunteer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600">
                          Ukupno sati: <strong>{volunteer.hours}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Stats Summary */}
      {!loading && volunteers && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto text-brand-purple mb-2" />
              <p className="text-2xl font-bold text-surface-900">
                {filteredVolunteers.length}
              </p>
              <p className="text-xs text-surface-500">Volontera</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-6 h-6 mx-auto text-brand-gold mb-2" />
              <p className="text-2xl font-bold text-surface-900">
                {filterOptions.schools.length}
              </p>
              <p className="text-xs text-surface-500">Škola</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-surface-900">
                {filterOptions.locations.length}
              </p>
              <p className="text-xs text-surface-500">Lokacija</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto text-amber-600 mb-2" />
              <p className="text-2xl font-bold text-surface-900">
                {filteredVolunteers.reduce((sum, v) => sum + (v.hours || 0), 0)}
              </p>
              <p className="text-xs text-surface-500">Ukupno sati</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
