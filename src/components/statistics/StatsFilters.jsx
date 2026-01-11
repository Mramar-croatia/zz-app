import { useState } from 'react';
import { Filter, Scale, Download, Share2, FileSpreadsheet, FileText, Copy, Check, X } from 'lucide-react';
import { subWeeks, subMonths, startOfMonth } from 'date-fns';
import { Card, CardContent } from '../Card';
import { getCurrentSchoolYear, getCurrentSchoolYearRange, getSemester } from '../../utils/schoolYear';

const DATE_PRESETS = [
  { label: 'Zadnjih 7 dana', getValue: () => ({ start: subWeeks(new Date(), 1), end: new Date() }) },
  { label: 'Zadnjih 30 dana', getValue: () => ({ start: subMonths(new Date(), 1), end: new Date() }) },
  { label: 'Ovaj mjesec', getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
  { label: 'Ovo polugodiste', getValue: () => {
    const now = new Date();
    const schoolYear = getCurrentSchoolYear(now);
    const semester = getSemester(now);
    if (semester.number === 1) {
      return { start: new Date(schoolYear, 8, 22), end: new Date(schoolYear + 1, 0, 31) };
    }
    return { start: new Date(schoolYear + 1, 1, 1), end: new Date(schoolYear + 1, 5, 20) };
  }},
  { label: 'Ova skolska godina', getValue: () => {
    const range = getCurrentSchoolYearRange();
    return { start: range.start, end: new Date() };
  }},
  { label: 'Sve vrijeme', getValue: () => ({ start: null, end: null }) },
];

export default function StatsFilters({
  showFilters,
  setShowFilters,
  hasFilters,
  dateRange,
  setDateRange,
  selectedLocations,
  setSelectedLocations,
  selectedSchools,
  setSelectedSchools,
  clearFilters,
  availableLocations = [],
  availableSchools = [],
  showComparison,
  setShowComparison,
  summary,
  onExportCSV,
  onExportPDF,
  onCopyShare,
  copiedShare,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const filterCount = (dateRange?.start ? 1 : 0) + (selectedLocations.length > 0 ? 1 : 0) + (selectedSchools.length > 0 ? 1 : 0);

  return (
    <Card>
      <CardContent className="p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || hasFilters
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                  : 'border-surface-200 hover:border-surface-300 text-surface-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filteri</span>
              {hasFilters && (
                <span className="w-5 h-5 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showComparison
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                  : 'border-surface-200 hover:border-surface-300 text-surface-600'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">Usporedba</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 hover:border-surface-300 text-surface-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Izvoz</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-200 py-2 z-20">
                  <button
                    onClick={() => { onExportCSV?.(); setShowExportMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Excel/CSV</span>
                  </button>
                  <button
                    onClick={() => { onExportPDF?.(); setShowExportMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 text-left"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareCard(!showShareCard)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 hover:border-surface-300 text-surface-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Podijeli</span>
              </button>
              {showShareCard && summary && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-surface-200 p-4 z-20">
                  <h4 className="font-semibold text-surface-900 mb-3">Podijeli statistiku</h4>
                  <div className="bg-surface-50 rounded-lg p-3 text-sm text-surface-600 mb-3">
                    <p className="font-semibold text-surface-900 mb-1">Zlatni Zmaj - Statistika</p>
                    <p>Volontera: {summary.totalVolunteers}</p>
                    <p>Sati: {summary.totalHours}</p>
                    <p>Termina: {summary.totalSessions}</p>
                  </div>
                  <button
                    onClick={onCopyShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Kopirano!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Kopiraj tekst</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-surface-100 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Presets */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Vremensko razdoblje</label>
                <div className="flex flex-wrap gap-2">
                  {DATE_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setDateRange(preset.getValue())}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        !dateRange?.start && preset.label === 'Sve vrijeme'
                          ? 'bg-brand-purple text-white'
                          : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Lokacije</label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {availableLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocations(prev =>
                          prev.includes(loc)
                            ? prev.filter(l => l !== loc)
                            : [...prev, loc]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                        selectedLocations.includes(loc)
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* School Filter */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Skole</label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {availableSchools.slice(0, 10).map((school) => (
                    <button
                      key={school}
                      onClick={() => {
                        setSelectedSchools(prev =>
                          prev.includes(school)
                            ? prev.filter(s => s !== school)
                            : [...prev, school]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                        selectedSchools.includes(school)
                          ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30'
                          : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
                      }`}
                    >
                      {school.length > 20 ? school.slice(0, 20) + '...' : school}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Ukloni filtere</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
