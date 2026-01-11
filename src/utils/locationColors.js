/**
 * Location color scheme utilities
 * Consistent color coding across the entire app
 */

export const LOCATION_COLORS = {
  'MIOC': {
    name: 'MIOC',
    color: 'blue',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-200',
    chart: 'rgb(59, 130, 246)', // blue-500
    chartLight: 'rgba(59, 130, 246, 0.5)',
    chartLighter: 'rgba(59, 130, 246, 0.1)',
  },
  'TREŠNJEVKA': {
    name: 'TREŠNJEVKA',
    color: 'green',
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
    hover: 'hover:bg-green-200',
    chart: 'rgb(34, 197, 94)', // green-500
    chartLight: 'rgba(34, 197, 94, 0.5)',
    chartLighter: 'rgba(34, 197, 94, 0.1)',
  },
  'ŠPANSKO': {
    name: 'ŠPANSKO',
    color: 'red',
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    hover: 'hover:bg-red-200',
    chart: 'rgb(239, 68, 68)', // red-500
    chartLight: 'rgba(239, 68, 68, 0.5)',
    chartLighter: 'rgba(239, 68, 68, 0.1)',
  },
  'SAMOBOR': {
    name: 'SAMOBOR',
    color: 'pink',
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    border: 'border-pink-300',
    hover: 'hover:bg-pink-200',
    chart: 'rgb(236, 72, 153)', // pink-500
    chartLight: 'rgba(236, 72, 153, 0.5)',
    chartLighter: 'rgba(236, 72, 153, 0.1)',
  },
  'KRALJ TOMISLAV': {
    name: 'KRALJ TOMISLAV',
    color: 'yellow',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    hover: 'hover:bg-yellow-200',
    chart: 'rgb(234, 179, 8)', // yellow-500
    chartLight: 'rgba(234, 179, 8, 0.5)',
    chartLighter: 'rgba(234, 179, 8, 0.1)',
  },
};

// Default color for unknown locations
const DEFAULT_LOCATION_COLOR = {
  name: 'Ostalo',
  color: 'gray',
  bg: 'bg-surface-100',
  text: 'text-surface-700',
  border: 'border-surface-300',
  hover: 'hover:bg-surface-200',
  chart: 'rgb(115, 115, 115)', // gray-500
  chartLight: 'rgba(115, 115, 115, 0.5)',
  chartLighter: 'rgba(115, 115, 115, 0.1)',
};

/**
 * Get color configuration for a location
 */
export function getLocationColor(location) {
  if (!location) return DEFAULT_LOCATION_COLOR;

  // Try exact match first
  const exactMatch = LOCATION_COLORS[location];
  if (exactMatch) return exactMatch;

  // Try case-insensitive match
  const locationUpper = location.toUpperCase();
  for (const [key, value] of Object.entries(LOCATION_COLORS)) {
    if (key.toUpperCase() === locationUpper) {
      return value;
    }
  }

  return DEFAULT_LOCATION_COLOR;
}

/**
 * Get chart color for a location
 */
export function getLocationChartColor(location, opacity = 'main') {
  const colors = getLocationColor(location);

  switch (opacity) {
    case 'light':
      return colors.chartLight;
    case 'lighter':
      return colors.chartLighter;
    default:
      return colors.chart;
  }
}

/**
 * Get badge classes for a location
 */
export function getLocationBadgeClasses(location) {
  const colors = getLocationColor(location);
  return `${colors.bg} ${colors.text} ${colors.border}`;
}

/**
 * Get an array of chart colors for multiple locations
 */
export function getLocationChartColors(locations, opacity = 'main') {
  return locations.map(loc => getLocationChartColor(loc, opacity));
}

/**
 * Get all defined location names
 */
export function getDefinedLocations() {
  return Object.keys(LOCATION_COLORS);
}
