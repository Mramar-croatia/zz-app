/**
 * Croatian locale utilities for date formatting and sorting
 */

// Croatian month names
export const CROATIAN_MONTHS = [
  'siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj',
  'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'
];

export const CROATIAN_MONTHS_SHORT = [
  'sij', 'vel', 'ožu', 'tra', 'svi', 'lip',
  'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'
];

export const CROATIAN_DAYS = [
  'nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'
];

export const CROATIAN_DAYS_SHORT = ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'];

/**
 * Format date to Croatian format (d.m.yyyy.)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDateCroatian(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`;
}

/**
 * Format date with full month name
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (e.g., "15. veljače 2025.")
 */
export function formatDateLong(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()}. ${CROATIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
}

/**
 * Format date for input type="date" (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} ISO date string
 */
export function formatDateISO(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse Croatian date format to Date object
 * @param {string} dateStr - Date string in format "d.m.yyyy."
 * @returns {Date|null}
 */
export function parseCroatianDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\./);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Croatian locale collator for proper string sorting
 */
export const croatianCollator = new Intl.Collator('hr-HR', {
  sensitivity: 'base',
  numeric: true,
});

/**
 * Sort strings using Croatian locale
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Comparison result
 */
export function sortCroatian(a, b) {
  return croatianCollator.compare(a, b);
}

/**
 * Format number with Croatian locale (comma as decimal separator)
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export function formatNumberCroatian(num, decimals = 0) {
  if (num === null || num === undefined) return '';
  return num.toLocaleString('hr-HR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format percentage with Croatian locale
 * @param {number} value - Value (0-100 or 0-1)
 * @param {boolean} isDecimal - Whether value is already decimal (0-1)
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, isDecimal = false) {
  if (value === null || value === undefined) return '';
  const pct = isDecimal ? value * 100 : value;
  return `${formatNumberCroatian(pct, 2)}%`;
}

/**
 * Get year from a date
 * @param {Date|string} date - Date
 * @returns {number} Year
 */
export function getYear(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.getFullYear();
}

/**
 * Get unique years from an array of dates
 * @param {Array} dates - Array of Date objects
 * @returns {Array<number>} Sorted array of unique years
 */
export function getUniqueYears(dates) {
  const years = new Set(dates.filter(Boolean).map(d => getYear(d)));
  return Array.from(years).sort((a, b) => b - a);
}
