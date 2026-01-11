import { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  PageLoader,
  EmptyState,
} from '../components';
import {
  SchoolYearBanner,
  StatsSummary,
  SecondaryStats,
  InsightsPanel,
  GoalsProgress,
  Milestones,
  Leaderboard,
  PredictionsPanel,
  HeatmapCalendar,
  GradeDistribution,
  StatsFilters,
  StatsTable,
  ComparisonPanel,
} from '../components/statistics';
import {
  TrendsChart,
  ActivityDonut,
  LocationStackedChart,
  SchoolHoursDonut,
  ChildrenLocationChart,
  ChildVolunteerTrend,
} from '../components/statisticsCharts';
import { BarChart3 } from 'lucide-react';
import {
  calculateStatistics,
  getHoursBySchoolChart,
  getChildrenByLocationChart,
} from '../utils/statistics';
import useStatisticsFilters from '../hooks/useStatisticsFilters';
import useComparison from '../hooks/useComparison';
import useExport from '../hooks/useExport';
import usePagination from '../hooks/usePagination';
import { useState } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Statistika({ volunteers, sessions, loading, onNavigate }) {
  const statsRef = useRef(null);

  // Filter state
  const filters = useStatisticsFilters();

  // Comparison state
  const comparison = useComparison(volunteers, sessions);

  // View state
  const [activeTableView, setActiveTableView] = useState('location');
  const [leaderboardType, setLeaderboardType] = useState('weekly');

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!volunteers || !sessions) return null;
    return calculateStatistics(volunteers, sessions, filters.filterValues);
  }, [volunteers, sessions, filters.filterValues]);

  // Chart data
  const hoursBySchool = useMemo(() => {
    if (!volunteers) return { labels: [], data: [] };
    return getHoursBySchoolChart(volunteers);
  }, [volunteers]);

  const childrenByLocation = useMemo(() => {
    if (!sessions) return { labels: [], data: [] };
    let filteredSessions = sessions;
    if (filters.dateRange.start && filters.dateRange.end) {
      filteredSessions = sessions.filter(s =>
        s.parsedDate && s.parsedDate >= filters.dateRange.start && s.parsedDate <= filters.dateRange.end
      );
    }
    return getChildrenByLocationChart(filteredSessions);
  }, [sessions, filters.dateRange]);

  // Get current table data based on active view
  const currentTableData = useMemo(() => {
    if (!statistics) return [];
    switch (activeTableView) {
      case 'location': return statistics.byLocation;
      case 'school': return statistics.bySchool;
      case 'month': return statistics.byMonth;
      case 'top': return statistics.topVolunteers;
      default: return [];
    }
  }, [statistics, activeTableView]);

  // Pagination
  const pagination = usePagination(currentTableData, {
    initialPageSize: 10,
    resetDeps: [activeTableView, ...filters.filterDeps],
  });

  // Export handlers
  const exportHandlers = useExport(currentTableData, statistics, statsRef);

  // Available filter options
  const availableLocations = useMemo(() => {
    if (!sessions) return [];
    return [...new Set(sessions.map(s => s.location).filter(Boolean))].sort();
  }, [sessions]);

  const availableSchools = useMemo(() => {
    if (!volunteers) return [];
    return [...new Set(volunteers.map(v => v.school).filter(Boolean))].sort();
  }, [volunteers]);

  if (loading) {
    return <PageLoader />;
  }

  if (!statistics) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Nema podataka"
        description="Nema podataka za prikaz statistike"
      />
    );
  }

  const {
    summary,
    sessionCounts,
    trends,
    activityBreakdown,
    stackedLocationData,
    insights,
    recommendations,
    predictions,
    anomalies,
    milestones,
    weeklyLeaderboard,
    monthlyLeaderboard,
    retentionRate,
    sessionDurationStats,
    heatmapData,
    byGrade,
  } = statistics;

  return (
    <div className="space-y-4" ref={statsRef}>
      <SchoolYearBanner />

      <StatsFilters
        showFilters={filters.showFilters}
        setShowFilters={filters.setShowFilters}
        hasFilters={filters.hasFilters}
        dateRange={filters.dateRange}
        setDateRange={filters.setDateRange}
        selectedLocations={filters.selectedLocations}
        setSelectedLocations={filters.setSelectedLocations}
        selectedSchools={filters.selectedSchools}
        setSelectedSchools={filters.setSelectedSchools}
        clearFilters={filters.clearFilters}
        availableLocations={availableLocations}
        availableSchools={availableSchools}
        showComparison={comparison.showComparison}
        setShowComparison={comparison.setShowComparison}
        summary={summary}
        onExportCSV={exportHandlers.handleExportCSV}
        onExportPDF={exportHandlers.handleExportPDF}
        onCopyShare={exportHandlers.handleCopyShare}
        copiedShare={exportHandlers.copiedShare}
      />

      <ComparisonPanel
        showComparison={comparison.showComparison}
        setShowComparison={comparison.setShowComparison}
        comparisonPreset={comparison.comparisonPreset}
        setComparisonPreset={comparison.setComparisonPreset}
        comparisonTab={comparison.comparisonTab}
        setComparisonTab={comparison.setComparisonTab}
        comparisonData={comparison.comparisonData}
      />

      <StatsSummary
        summary={summary}
        sessionCounts={sessionCounts}
        onNavigate={onNavigate}
      />

      <SecondaryStats
        summary={summary}
        retentionRate={retentionRate}
        sessionDurationStats={sessionDurationStats}
      />

      <InsightsPanel insights={insights} recommendations={recommendations} />

      <GoalsProgress summary={summary} />

      <Milestones milestones={milestones} />

      <Leaderboard
        weeklyLeaderboard={weeklyLeaderboard}
        monthlyLeaderboard={monthlyLeaderboard}
        type={leaderboardType}
        setType={setLeaderboardType}
      />

      <PredictionsPanel predictions={predictions} anomalies={anomalies} />

      <HeatmapCalendar heatmapData={heatmapData} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TrendsChart trends={trends} className="lg:col-span-2" />
        <ActivityDonut activityBreakdown={activityBreakdown} />
      </div>

      <LocationStackedChart stackedLocationData={stackedLocationData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SchoolHoursDonut hoursBySchool={hoursBySchool} />
        <ChildrenLocationChart childrenByLocation={childrenByLocation} />
      </div>

      <ChildVolunteerTrend trends={trends} />

      <StatsTable
        activeTableView={activeTableView}
        setActiveTableView={setActiveTableView}
        paginatedItems={pagination.paginatedItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        handlePageChange={pagination.handlePageChange}
        pageSize={pagination.pageSize}
        handlePageSizeChange={pagination.handlePageSizeChange}
        totalItems={currentTableData.length}
      />

      <GradeDistribution byGrade={byGrade} />
    </div>
  );
}
