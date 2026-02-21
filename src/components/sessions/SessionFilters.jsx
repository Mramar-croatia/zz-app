import { CalendarCheck, CalendarX, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { SearchInput } from '../Form';
import { FilterSelect, ResultCount } from '../Filters';
import { ViewModeToggle } from '../common';

export default function SessionFilters({
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter,
  sessionCounts,
  search,
  setSearch,
  locationFilter,
  setLocationFilter,
  yearFilter,
  setYearFilter,
  filterOptions,
  hasFilters,
  clearFilters,
  filteredCount,
  totalCount
}) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-5">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-4 pb-4 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
          <div className="flex items-center gap-4">
            {hasFilters && (
              <>
                <ResultCount
                  count={filteredCount}
                  total={totalCount}
                  label="termina"
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

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-surface-100 border border-surface-200 p-1">
          <button
            onClick={() => setStatusFilter('active')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-white shadow-sm text-surface-900'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Aktivni</span>
            <span className="text-xs bg-surface-200 text-surface-700 px-1.5 py-0.5">
              {sessionCounts.active}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'cancelled'
                ? 'bg-white shadow-sm text-[#991B1B]'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <CalendarX className="w-4 h-4" />
            <span>Otkazani</span>
            <span className="text-xs bg-[#FFF1F2] text-[#991B1B] px-1.5 py-0.5">
              {sessionCounts.cancelled}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white shadow-sm text-surface-900'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Svi</span>
            <span className="text-xs bg-surface-200 text-surface-600 px-1.5 py-0.5">
              {sessionCounts.total}
            </span>
          </button>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Pretraži termine..."
          className="w-full"
        />

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
            options={filterOptions.years.map(y => ({
              value: y.toString(),
              label: y.toString(),
            }))}
            placeholder="Sve godine"
          />
        </div>

        {/* Mobile Filter Summary */}
        {hasFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-surface-100">
            <div className="flex items-center justify-between">
              <ResultCount
                count={filteredCount}
                total={totalCount}
                label="termina"
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
  );
}
