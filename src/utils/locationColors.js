/**
 * Location color scheme utilities
 * Consistent color coding across the entire app
 */

// Sophisticated muted color system — distinct enough to differentiate, mature enough to fit the design
export const LOCATION_COLORS = {
  'MIOC': {
    name: 'MIOC',
    color: 'slate-blue',
    bg: 'bg-[#EEF2F7]',
    text: 'text-[#1E3A5C]',
    border: 'border-[#BBCEE0]',
    hover: 'hover:bg-[#E0E9F2]',
    chart: 'rgb(50, 95, 145)',
    chartLight: 'rgba(50, 95, 145, 0.5)',
    chartLighter: 'rgba(50, 95, 145, 0.12)',
  },
  'TREŠNJEVKA': {
    name: 'TREŠNJEVKA',
    color: 'forest',
    bg: 'bg-[#EEF4EE]',
    text: 'text-[#1A4D24]',
    border: 'border-[#AECBAE]',
    hover: 'hover:bg-[#E0EDE0]',
    chart: 'rgb(42, 110, 56)',
    chartLight: 'rgba(42, 110, 56, 0.5)',
    chartLighter: 'rgba(42, 110, 56, 0.12)',
  },
  'ŠPANSKO': {
    name: 'ŠPANSKO',
    color: 'crimson',
    bg: 'bg-[#F5EEEE]',
    text: 'text-[#5C1A1A]',
    border: 'border-[#D4AAAA]',
    hover: 'hover:bg-[#EDE0E0]',
    chart: 'rgb(140, 40, 40)',
    chartLight: 'rgba(140, 40, 40, 0.5)',
    chartLighter: 'rgba(140, 40, 40, 0.12)',
  },
  'SAMOBOR': {
    name: 'SAMOBOR',
    color: 'plum',
    bg: 'bg-[#F3EEF5]',
    text: 'text-[#4A1A5C]',
    border: 'border-[#C8AAD4]',
    hover: 'hover:bg-[#EBE0ED]',
    chart: 'rgb(112, 42, 140)',
    chartLight: 'rgba(112, 42, 140, 0.5)',
    chartLighter: 'rgba(112, 42, 140, 0.12)',
  },
  'KRALJ TOMISLAV': {
    name: 'KRALJ TOMISLAV',
    color: 'ochre',
    bg: 'bg-[#F5F0E8]',
    text: 'text-[#5C3D10]',
    border: 'border-[#D4BFA0]',
    hover: 'hover:bg-[#EDE5D8]',
    chart: 'rgb(140, 100, 30)',
    chartLight: 'rgba(140, 100, 30, 0.5)',
    chartLighter: 'rgba(140, 100, 30, 0.12)',
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
