import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Star,
  Keyboard,
  Clipboard,
  Settings2,
  Target,
  TrendingUp,
  Activity,
  Award,
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
  Avatar,
  KeyboardShortcutsHelp,
} from '../components';
import { sortCroatian } from '../utils/croatian';

// Constants
const HOURS_GOALS = {
  basic: 10,
  bronze: 20,
  silver: 30,
  gold: 40,
};
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Activity status helper
function getActivityStatus(volunteer, sessions) {
  if (!volunteer || !sessions) {
    return { status: 'inactive', label: 'Neaktivan', color: 'surface', dotColor: 'bg-surface-400' };
  }

  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Get all sessions for this volunteer
  const volunteerSessions = sessions.filter(s => s.volunteersList?.includes(volunteer.name));

  // Calculate hours in last 2 months
  const hoursLast2Months = volunteerSessions
    .filter(s => s.parsedDate && s.parsedDate >= twoMonthsAgo)
    .reduce((sum, s) => sum + (s.hours || 0), 0);

  const totalHours = volunteer.hours || 0;

  // Aktivan - 10+ total hours OR 5+ hours in last 2 months
  if (totalHours >= 10 || hoursLast2Months >= 5) {
    return { status: 'active', label: 'Aktivan', color: 'emerald', dotColor: 'bg-emerald-500' };
  }

  // Uspavan - 5+ total hours but NOT in last 2 months
  if (totalHours >= 5 && hoursLast2Months < 5) {
    return { status: 'dormant', label: 'Uspavan', color: 'red', dotColor: 'bg-red-500' };
  }

  // Neaktivan - everything else
  return { status: 'inactive', label: 'Neaktivan', color: 'amber', dotColor: 'bg-amber-500' };
}

// Format date for display
function formatDateShort(date) {
  if (!date) return '-';
  return date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Search highlight component
function HighlightText({ text, search }) {
  if (!search || !text) return <>{text}</>;

  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(searchLower);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-brand-gold/30 text-inherit rounded px-0.5">{text.slice(index, index + search.length)}</mark>
      {text.slice(index + search.length)}
    </>
  );
}

// Hours progress bar component
function HoursProgress({ hours, goal = HOURS_GOALS.basic, compact = false }) {
  const progress = Math.min((hours || 0) / goal * 100, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-2 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-brand-purple'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`font-semibold text-lg ${progress >= 100 ? 'text-emerald-600' : 'text-brand-purple'}`}>
          {hours}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-surface-500">{hours} / {goal} sati</span>
        {progress >= 100 && <Check className="w-4 h-4 text-emerald-500" />}
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-brand-purple'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Activity status badge
function ActivityStatusBadge({ status }) {
  const variants = {
    active: 'badge-success',
    inactive: 'badge-warning',
    dormant: 'bg-red-100 text-red-700',
    unknown: 'bg-surface-100 text-surface-600',
  };

  return (
    <span className={`badge ${variants[status.status] || variants.unknown}`}>
      <span className={`w-2 h-2 rounded-full ${status.dotColor} mr-2`} />
      {status.label}
    </span>
  );
}

// Quick actions component
function QuickActions({ volunteer, onViewProfile, compact = false }) {
  const [copied, setCopied] = useState(false);
  const [copiedRow, setCopiedRow] = useState(false);

  const copyPhone = async (e) => {
    e.stopPropagation();
    if (volunteer?.phone) {
      await navigator.clipboard.writeText(volunteer.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyRowData = async (e) => {
    e.stopPropagation();
    const text = `${volunteer.name}\n${volunteer.school} - ${volunteer.grade}. razred\nTelefon: ${volunteer.phone}\nLokacije: ${volunteer.locations?.join(', ') || '-'}\nSati: ${volunteer.hours}`;
    await navigator.clipboard.writeText(text);
    setCopiedRow(true);
    setTimeout(() => setCopiedRow(false), 2000);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    onViewProfile(volunteer);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleViewProfile}
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          title="Pogledaj profil"
        >
          <Eye className="w-5 h-5 text-surface-400 hover:text-brand-purple" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleViewProfile}
        className="p-2 hover:bg-brand-purple/10 rounded-lg transition-colors"
        title="Pogledaj profil"
      >
        <Eye className="w-5 h-5 text-surface-400 hover:text-brand-purple" />
      </button>
      <button
        onClick={copyRowData}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Kopiraj podatke"
      >
        {copiedRow ? (
          <Check className="w-5 h-5 text-emerald-500" />
        ) : (
          <Clipboard className="w-5 h-5 text-surface-400 hover:text-surface-600" />
        )}
      </button>
      <button
        onClick={copyPhone}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Kopiraj broj"
      >
        {copied ? (
          <Check className="w-5 h-5 text-emerald-500" />
        ) : (
          <Copy className="w-5 h-5 text-surface-400 hover:text-surface-600" />
        )}
      </button>
      <a
        href={`tel:${volunteer.phone}`}
        onClick={(e) => e.stopPropagation()}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Nazovi"
      >
        <Phone className="w-5 h-5 text-surface-400 hover:text-emerald-600" />
      </a>
    </div>
  );
}

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

export default function Baza({ volunteers, sessions = [], loading }) {
  // Filters and sorting
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // View state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [expandedId, setExpandedId] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [zebraStripes, setZebraStripes] = useState(true);
  const [colorCodedRows, setColorCodedRows] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const tableRef = useRef(null);

  // Calculate last active date for each volunteer
  const volunteerActivityMap = useMemo(() => {
    const map = new Map();
    if (!sessions || !volunteers) return map;

    volunteers.forEach(v => {
      const volunteerSessions = sessions
        .filter(s => s.volunteersList?.includes(v.name))
        .sort((a, b) => (b.parsedDate || 0) - (a.parsedDate || 0));

      const lastActive = volunteerSessions[0]?.parsedDate || null;
      const sessionCount = volunteerSessions.length;
      map.set(v.name, { lastActive, sessionCount });
    });

    return map;
  }, [volunteers, sessions]);

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
  }, [volunteers, search, schoolFilter, gradeFilter, locationFilter, activityFilter, sortBy, sortDir, volunteerActivityMap]);

  // Paginated volunteers
  const paginatedVolunteers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredVolunteers.slice(startIndex, startIndex + pageSize);
  }, [filteredVolunteers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredVolunteers.length / pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, schoolFilter, gradeFilter, locationFilter, activityFilter, pageSize]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show shortcuts with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Focus search with /
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Escape to close modals/drawers or clear search
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

      // Arrow navigation when table is focused
      if (document.activeElement === tableRef.current || tableRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, paginatedVolunteers.length - 1));
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
  }, [search, selectedVolunteer, focusedIndex, paginatedVolunteers, showShortcuts]);

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
    setActivityFilter('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFocusedIndex(-1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setFocusedIndex(-1);
  };

  if (loading) {
    return <PageLoader />;
  }

  const hasFilters = search || schoolFilter || gradeFilter || locationFilter || activityFilter;

  return (
    <div className="space-y-4">
      {/* Stats Dashboard */}
      {!loading && volunteers && (() => {
        const totalHours = filteredVolunteers.reduce((sum, v) => sum + (v.hours || 0), 0);
        const avgHours = filteredVolunteers.length > 0 ? (totalHours / filteredVolunteers.length).toFixed(1) : 0;

        // Goal tiers
        const basicGoal = filteredVolunteers.filter(v => (v.hours || 0) >= HOURS_GOALS.basic).length;
        const bronzeGoal = filteredVolunteers.filter(v => (v.hours || 0) >= HOURS_GOALS.bronze).length;
        const silverGoal = filteredVolunteers.filter(v => (v.hours || 0) >= HOURS_GOALS.silver).length;
        const goldGoal = filteredVolunteers.filter(v => (v.hours || 0) >= HOURS_GOALS.gold).length;

        const activeCount = filteredVolunteers.filter(v => {
          return getActivityStatus(v, sessions).status === 'active';
        }).length;
        const inactiveCount = filteredVolunteers.filter(v => {
          return getActivityStatus(v, sessions).status === 'inactive';
        }).length;
        const dormantCount = filteredVolunteers.filter(v => {
          return getActivityStatus(v, sessions).status === 'dormant';
        }).length;

        return (
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Volunteers */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 mb-3">
                    <Users className="w-6 h-6 text-brand-purple" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-brand-purple">{filteredVolunteers.length}</p>
                  <p className="text-sm text-surface-500 mt-1">Volontera</p>
                  {hasFilters && filteredVolunteers.length !== volunteers.length && (
                    <p className="text-xs text-surface-400 mt-0.5">od {volunteers.length} ukupno</p>
                  )}
                </div>

                {/* Activity Breakdown */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-emerald-600">{activeCount}</p>
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

                {/* Total Hours */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-amber-600">{totalHours}</p>
                  <p className="text-sm text-surface-500 mt-1">Ukupno sati</p>
                  <p className="text-xs text-surface-400 mt-0.5">~{avgHours}h po volonteru</p>
                </div>

                {/* Schools */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-indigo-600">{filterOptions.schools.length}</p>
                  <p className="text-sm text-surface-500 mt-1">Škola</p>
                  <p className="text-xs text-surface-400 mt-0.5">{filterOptions.locations.length} lokacija</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-5">
          {/* Top row: View controls and settings on desktop */}
          <div className="hidden lg:flex items-center justify-between mb-4 pb-4 border-b border-surface-100">
            {/* View Controls */}
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

              {/* View Settings Dropdown */}
              <div className="relative group">
                <button
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  title="Postavke prikaza"
                >
                  <Settings2 className="w-5 h-5 text-surface-500" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-surface-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zebraStripes}
                      onChange={(e) => setZebraStripes(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="text-sm text-surface-700">Izmjenične boje redaka</span>
                  </label>
                  <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={colorCodedRows}
                      onChange={(e) => setColorCodedRows(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="text-sm text-surface-700">Boje prema statusu</span>
                  </label>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
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
            placeholder="Pretraži volontere... (pritisni / za fokus)"
            className="w-full"
          />

          {/* Filter selects - 2x2 grid */}
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

          {/* Mobile: Result count - only show when filters active */}
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
                    const hasMetGoal = (volunteer.hours || 0) >= HOURS_GOALS.basic;

                    // Row background classes
                    const rowBgClasses = [];
                    if (isFocused) {
                      rowBgClasses.push('bg-brand-purple/10');
                    } else if (colorCodedRows && status.status === 'dormant') {
                      rowBgClasses.push('bg-red-50/50');
                    } else if (colorCodedRows && status.status === 'inactive') {
                      rowBgClasses.push('bg-amber-50/30');
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
                                <HighlightText text={volunteer.name} search={search} />
                                {hasMetGoal && (
                                  <Star className="w-4 h-4 text-brand-gold fill-brand-gold" title="Cilj sati ostvaren!" />
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
                            <HighlightText text={volunteer.school} search={search} />
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

          {/* Pagination */}
          {filteredVolunteers.length > 0 && (
            <div className="px-6 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
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
                              <HighlightText text={volunteer.name} search={search} />
                            </h3>
                            <p className="text-sm text-surface-500 truncate mt-0.5">
                              <HighlightText text={volunteer.school} search={search} />
                            </p>
                          </div>
                          <ActivityStatusBadge status={status} />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="purple">{volunteer.grade}. razred</Badge>
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

              {/* Pagination for cards */}
              {filteredVolunteers.length > 0 && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
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
                        <span className={`w-2.5 h-2.5 rounded-full ${status.dotColor}`} />
                        <h3 className="font-semibold text-surface-900 text-lg truncate">
                          <HighlightText text={volunteer.name} search={search} />
                        </h3>
                      </div>
                      <p className="text-sm text-surface-500 truncate mt-1">
                        <HighlightText text={volunteer.school} search={search} />
                      </p>
                      {/* Locations with icon - visible when collapsed */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {volunteer.locations?.slice(0, 2).map((loc, i) => (
                            <span key={i} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {loc}
                            </span>
                          ))}
                          {volunteer.locations?.length > 2 && (
                            <span className="text-xs text-surface-500">+{volunteer.locations.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <div className="text-right">
                        {/* Grade with icon */}
                        <div className="flex items-center gap-1.5 justify-end">
                          <GraduationCap className="w-4 h-4 text-brand-purple" />
                          <span className="font-bold text-brand-purple text-lg">{volunteer.grade}.</span>
                        </div>
                        <p className="text-sm font-semibold text-brand-gold mt-1">
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
                        <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">Lokacije</span>
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
                          className="text-brand-purple font-mono"
                          onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => {
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

        {/* Mobile Pagination */}
        {filteredVolunteers.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
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
          onSelectSession={(session) => {
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
          onSelectVolunteer={(volunteer) => {
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
