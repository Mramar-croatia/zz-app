import {
  Users,
  Check,
  List,
  LayoutGrid,
  GraduationCap,
  MapPin,
  CheckSquare,
  Square,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { SearchInput } from '../Form';
import { Badge, LocationBadge } from '../Badge';
import { FilterSelect, ResultCount } from '../Filters';
import { Avatar } from '../volunteer';

export default function VolunteerSelector({
  filteredVolunteers,
  selectedVolunteers,
  toggleVolunteer,
  selectAll,
  deselectAll,
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
  locations,
  schools,
  hasFilters,
  clearFilters,
  allVolunteersCount,
  formLocation,
}) {
  const selectedCount = selectedVolunteers.size;

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex flex-col gap-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-brand-purple" />
                Odabir volontera
              </CardTitle>
              <Badge variant={selectedCount > 0 ? 'success' : 'default'}>
                {selectedCount} odabrano
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1.5 text-sm font-medium text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              >
                Odaberi sve
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
              >
                Poništi
              </button>
            </div>
          </div>

          {/* View Toggle & Filters Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-surface-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-brand-purple'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Popis"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white shadow-sm text-brand-purple'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                  title="Kartice"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Show Selected Toggle */}
              <button
                type="button"
                onClick={() => setShowSelected(!showSelected)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${showSelected
                    ? 'bg-brand-purple text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }
                `}
              >
                {showSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Samo odabrani</span>
              </button>
            </div>

            {hasFilters && (
              <div className="flex items-center gap-3">
                <ResultCount
                  count={filteredVolunteers.length}
                  total={allVolunteersCount}
                  label="volontera"
                />
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
                >
                  Ukloni
                </button>
              </div>
            )}
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
          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="select input-sm"
            >
              <option value="">Sve lokacije</option>
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="select input-sm"
            >
              <option value="">Sve škole</option>
              {schools.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Volunteer List/Cards */}
        <div className="max-h-[450px] overflow-y-auto scrollbar-thin border border-surface-200 rounded-xl">
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto text-surface-300 mb-4" />
              <p className="text-lg text-surface-500">Nema pronađenih volontera</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
                >
                  Ukloni filtere
                </button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            // List View
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
                    <Avatar name={volunteer.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-base truncate ${isSelected ? 'text-brand-purple' : 'text-surface-900'}`}>
                        {volunteer.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-surface-500">
                        <span className="truncate">{volunteer.school}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {volunteer.grade}. razred
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-1.5 max-w-[200px]">
                      {volunteer.locations?.slice(0, 2).map((loc, i) => (
                        <Badge
                          key={i}
                          variant={loc === formLocation ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {loc}
                        </Badge>
                      ))}
                      {volunteer.locations?.length > 2 && (
                        <Badge variant="default" className="text-xs">
                          +{volunteer.locations.length - 2}
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-colors ${isSelected ? 'text-brand-purple' : 'text-surface-300'}`} />
                  </div>
                );
              })}
            </div>
          ) : (
            // Cards View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {filteredVolunteers.map((volunteer, index) => {
                const isSelected = selectedVolunteers.has(volunteer.name);
                return (
                  <div
                    key={`${volunteer.name}-${index}`}
                    onClick={() => toggleVolunteer(volunteer.name)}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-brand-purple bg-brand-purple/5'
                        : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                      }
                    `}
                  >
                    {/* Selection Indicator */}
                    <div className={`
                      absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center
                      ${isSelected
                        ? 'bg-brand-purple'
                        : 'border-2 border-surface-300'
                      }
                    `}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>

                    <div className="flex items-start gap-3">
                      <Avatar name={volunteer.name} size="md" />
                      <div className="flex-1 min-w-0 pr-6">
                        <p className={`font-semibold truncate ${isSelected ? 'text-brand-purple' : 'text-surface-900'}`}>
                          {volunteer.name}
                        </p>
                        <p className="text-sm text-surface-500 truncate mt-0.5">
                          {volunteer.school}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="purple" className="text-xs">
                            {volunteer.grade}. razred
                          </Badge>
                          <span className="text-xs text-surface-400">
                            {volunteer.hours || 0} sati
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-surface-100">
                      {volunteer.locations?.slice(0, 3).map((loc, i) => (
                        <span
                          key={i}
                          className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${loc === formLocation
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-surface-100 text-surface-600'
                            }
                          `}
                        >
                          {loc}
                        </span>
                      ))}
                      {volunteer.locations?.length > 3 && (
                        <span className="text-xs text-surface-400">
                          +{volunteer.locations.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection Summary */}
        {selectedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {Array.from(selectedVolunteers).slice(0, 5).map((name, i) => (
                  <Avatar key={i} name={name} size="xs" className="ring-2 ring-white" />
                ))}
                {selectedCount > 5 && (
                  <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center text-xs font-medium text-surface-600 ring-2 ring-white">
                    +{selectedCount - 5}
                  </div>
                )}
              </div>
              <span className="text-sm text-surface-600">
                {selectedCount} volonter{selectedCount === 1 ? '' : 'a'} odabrano
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSelected(true)}
              className="text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
            >
              Prikaži odabrane
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
