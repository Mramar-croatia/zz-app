import { Scale, X, Trophy, Eye, BarChart3, MapPin, Users, CalendarDays, Baby, Clock, Calendar } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent } from '../Card';
import { LocationBadge } from '../Badge';
import { CHART_COLORS, CHART_OPTIONS } from '../../constants';
import { COMPARISON_PRESETS } from '../../hooks/useComparison';

export default function ComparisonPanel({
  showComparison,
  setShowComparison,
  comparisonPreset,
  setComparisonPreset,
  comparisonTab,
  setComparisonTab,
  comparisonData,
}) {
  if (!showComparison) return null;

  const tabs = [
    { id: 'overview', label: 'Pregled', icon: Eye },
    { id: 'chart', label: 'Grafikon', icon: BarChart3 },
    { id: 'locations', label: 'Lokacije', icon: MapPin },
    { id: 'volunteers', label: 'Volonteri', icon: Users },
  ];

  const metrics = [
    { label: 'Termina', key: 'sessions', icon: CalendarDays, format: (v) => v },
    { label: 'Djece', key: 'children', icon: Baby, format: (v) => v },
    { label: 'Volontera', key: 'uniqueVolunteers', icon: Users, format: (v) => v },
    { label: 'Sati', key: 'totalHours', icon: Clock, format: (v) => `${v}h` },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-purple p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Usporedba razdoblja</h2>
              <p className="text-white/80 text-sm">Analiziraj performanse kroz vrijeme</p>
            </div>
          </div>
          <button
            onClick={() => setShowComparison(false)}
            className="self-start lg:self-center p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {COMPARISON_PRESETS.filter(p => p.id !== 'custom').map((preset) => {
            const isActive = comparisonPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setComparisonPreset(preset.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-brand-purple shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{preset.label}</span>
                <span className="sm:hidden">{preset.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {comparisonData && (
        <>
          {/* Winner Banner */}
          <div className={`px-4 py-3 flex items-center justify-center gap-3 ${
            comparisonData.overallWinner === 1 ? 'bg-emerald-50 border-b border-emerald-200' :
            comparisonData.overallWinner === 2 ? 'bg-amber-50 border-b border-amber-200' :
            'bg-surface-50 border-b border-surface-200'
          }`}>
            {comparisonData.overallWinner === 1 ? (
              <>
                <Trophy className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">
                  {comparisonData.period1.label} pobjeduje {comparisonData.period1Wins} - {comparisonData.period2Wins}!
                </span>
                <Trophy className="w-5 h-5 text-emerald-600" />
              </>
            ) : comparisonData.overallWinner === 2 ? (
              <span className="font-semibold text-amber-700">
                {comparisonData.period2.label} je bolji ({comparisonData.period2Wins} - {comparisonData.period1Wins})
              </span>
            ) : (
              <span className="font-medium text-surface-600">
                Izjednaceno ({comparisonData.period1Wins} - {comparisonData.period2Wins})
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="px-4 pt-4 border-b border-surface-100">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setComparisonTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    comparisonTab === id
                      ? 'border-brand-purple text-brand-purple'
                      : 'border-transparent text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <CardContent className="p-4 lg:p-6">
            {/* Overview Tab */}
            {comparisonTab === 'overview' && (
              <div className="space-y-6">
                {/* Period Labels */}
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-brand-purple" />
                    <span className="font-semibold text-brand-purple">{comparisonData.period1.label}</span>
                  </div>
                  <span className="text-surface-400 font-bold">VS</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <span className="font-semibold text-amber-600">{comparisonData.period2.label}</span>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map(({ label, key, icon: Icon, format }) => {
                    const change = comparisonData.changes[key];
                    const winner = comparisonData.winners[key];
                    const v1 = comparisonData.period1.stats[key];
                    const v2 = comparisonData.period2.stats[key];
                    const maxVal = Math.max(v1, v2) || 1;

                    return (
                      <div key={key} className="relative bg-surface-50 rounded-xl p-4 overflow-hidden">
                        {winner === 1 && (
                          <div className="absolute top-2 right-2">
                            <Trophy className="w-4 h-4 text-brand-purple" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-4 h-4 text-surface-500" />
                          <span className="text-sm font-medium text-surface-600">{label}</span>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 text-right text-sm font-bold text-brand-purple">{format(v1)}</div>
                            <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-purple rounded-full"
                                style={{ width: `${(v1 / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 text-right text-sm font-bold text-amber-600">{format(v2)}</div>
                            <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${(v2 / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <span className={`text-sm font-medium ${
                            change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-surface-500'
                          }`}>
                            {change > 0 ? '+' : ''}{change}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chart Tab */}
            {comparisonTab === 'chart' && comparisonData.dailyComparison && (
              <div style={{ height: 320 }}>
                <Bar
                  data={{
                    labels: comparisonData.dailyComparison.labels,
                    datasets: [
                      {
                        label: comparisonData.period1.label,
                        data: comparisonData.dailyComparison.period1,
                        backgroundColor: CHART_COLORS.purple.light,
                        borderColor: CHART_COLORS.purple.main,
                        borderWidth: 2,
                        borderRadius: 4,
                      },
                      {
                        label: comparisonData.period2.label,
                        data: comparisonData.dailyComparison.period2,
                        backgroundColor: CHART_COLORS.amber.light,
                        borderColor: CHART_COLORS.amber.main,
                        borderWidth: 2,
                        borderRadius: 4,
                      },
                    ],
                  }}
                  options={CHART_OPTIONS}
                />
              </div>
            )}

            {/* Locations Tab */}
            {comparisonTab === 'locations' && (
              <div className="space-y-3">
                {comparisonData.locationComparison?.slice(0, 8).map((loc, i) => {
                  const val1 = loc.period1?.children || 0;
                  const val2 = loc.period2?.children || 0;
                  const maxVal = Math.max(val1, val2, 1);
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 bg-surface-50 rounded-lg">
                      <LocationBadge location={loc.location} />
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-brand-purple">{val1}</span>
                            <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-purple rounded-full"
                                style={{ width: `${(val1 / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-amber-600">{val2}</span>
                            <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${(val2 / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          loc.change > 0 ? 'text-emerald-600' : loc.change < 0 ? 'text-red-600' : 'text-surface-500'
                        }`}>
                          {loc.change > 0 ? '+' : ''}{loc.change}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Volunteers Tab */}
            {comparisonTab === 'volunteers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {comparisonData.topImprovers?.length > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-emerald-700 mb-3">Najveci napredak</h4>
                    <div className="space-y-2">
                      {comparisonData.topImprovers.slice(0, 5).map((vol, i) => {
                        const hoursDiff = (vol.period1?.hours || 0) - (vol.period2?.hours || 0);
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-surface-900">{vol.name}</span>
                            <span className="text-sm font-bold text-emerald-600">+{vol.change}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {comparisonData.topDecliners?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-3">Najveci pad</h4>
                    <div className="space-y-2">
                      {comparisonData.topDecliners.slice(0, 5).map((vol, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-surface-900">{vol.name}</span>
                          <span className="text-sm font-bold text-red-600">{vol.change}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
