// Volunteer hours goal tiers
export const HOURS_GOALS = {
  basic: 10,
  bronze: 20,
  silver: 30,
  gold: 40,
};

// Pagination options
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Default page size
export const DEFAULT_PAGE_SIZE = 20;

// Activity status definitions
export const ACTIVITY_STATUS = {
  ACTIVE: 'active',
  DORMANT: 'dormant',
  INACTIVE: 'inactive',
};

// Activity status thresholds
export const ACTIVITY_THRESHOLDS = {
  TOTAL_HOURS_ACTIVE: 10,
  RECENT_HOURS_ACTIVE: 5,
  TOTAL_HOURS_DORMANT: 5,
  RECENT_PERIOD_DAYS: 60,
};

// Chart color palette
export const CHART_COLORS = {
  purple: { main: 'rgb(124, 58, 237)', light: 'rgba(124, 58, 237, 0.5)', lighter: 'rgba(124, 58, 237, 0.1)' },
  gold: { main: 'rgb(212, 175, 55)', light: 'rgba(212, 175, 55, 0.5)', lighter: 'rgba(212, 175, 55, 0.1)' },
  emerald: { main: 'rgb(16, 185, 129)', light: 'rgba(16, 185, 129, 0.5)', lighter: 'rgba(16, 185, 129, 0.1)' },
  amber: { main: 'rgb(245, 158, 11)', light: 'rgba(245, 158, 11, 0.5)', lighter: 'rgba(245, 158, 11, 0.1)' },
  red: { main: 'rgb(239, 68, 68)', light: 'rgba(239, 68, 68, 0.5)', lighter: 'rgba(239, 68, 68, 0.1)' },
  indigo: { main: 'rgb(99, 102, 241)', light: 'rgba(99, 102, 241, 0.5)', lighter: 'rgba(99, 102, 241, 0.1)' },
  sky: { main: 'rgb(14, 165, 233)', light: 'rgba(14, 165, 233, 0.5)', lighter: 'rgba(14, 165, 233, 0.1)' },
  pink: { main: 'rgb(236, 72, 153)', light: 'rgba(236, 72, 153, 0.5)', lighter: 'rgba(236, 72, 153, 0.1)' },
};

export const CHART_PALETTE = [
  CHART_COLORS.purple.main,
  CHART_COLORS.gold.main,
  CHART_COLORS.emerald.main,
  CHART_COLORS.indigo.main,
  CHART_COLORS.amber.main,
  CHART_COLORS.red.main,
  CHART_COLORS.sky.main,
  CHART_COLORS.pink.main,
];

// Chart options
export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        usePointStyle: true,
        font: { family: 'Manrope', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(24, 24, 27, 0.95)',
      titleFont: { family: 'Manrope', size: 13, weight: '600' },
      bodyFont: { family: 'Manrope', size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Manrope', size: 11 }, color: '#71717A' },
    },
    y: {
      grid: { color: 'rgba(228, 228, 231, 0.5)' },
      ticks: { font: { family: 'Manrope', size: 11 }, color: '#71717A' },
    },
  },
};

export const DOUGHNUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 16,
        usePointStyle: true,
        font: { family: 'Manrope', size: 12 },
      },
    },
    tooltip: CHART_OPTIONS.plugins.tooltip,
  },
};

// Statistics table view options
export const STATISTICS_TABLE_VIEWS = [
  { value: 'location', label: 'Po lokaciji' },
  { value: 'school', label: 'Po školi' },
  { value: 'month', label: 'Po mjesecu' },
  { value: 'top', label: 'Top volonteri' },
];

// Organization goals
export const ORGANIZATION_GOALS = {
  hours: { target: 1000, label: 'Volonterskih sati' },
  sessions: { target: 200, label: 'Termina' },
  children: { target: 5000, label: 'Dolazaka djece' },
  volunteers: { target: 50, label: 'Aktivnih volontera' },
};
