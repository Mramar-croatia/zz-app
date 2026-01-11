/**
 * School Year Utility Functions
 *
 * School year runs from late September to June.
 * Format: 2025./2026. means September 2025 to June 2026
 */

import { isWithinInterval, format, startOfDay, endOfDay } from 'date-fns';

// School year configuration
export const SCHOOL_YEAR_CONFIG = {
  // School year typically starts around September 22-25
  startMonth: 8, // September (0-indexed)
  startDay: 22,
  // School year ends around June 15-20
  endMonth: 5, // June (0-indexed)
  endDay: 20,
};

/**
 * Holiday periods for Croatian schools
 * Dates are approximate and may vary slightly by year
 */
export function getHolidayPeriods(schoolYearStart) {
  const year = schoolYearStart; // e.g., 2025 for 2025./2026. school year

  return [
    {
      name: 'Jesenski praznici',
      nameShort: 'Jesen',
      start: new Date(year, 9, 31), // October 31
      end: new Date(year, 10, 3), // November 3
      type: 'autumn',
    },
    {
      name: 'Zimski praznici',
      nameShort: 'Zima',
      start: new Date(year, 11, 24), // December 24
      end: new Date(year + 1, 0, 11), // January 11
      type: 'winter',
    },
    {
      name: 'Proljetni praznici',
      nameShort: 'Proljeće',
      start: new Date(year + 1, 3, 17), // Around April 17 (Easter varies)
      end: new Date(year + 1, 3, 25), // Around April 25
      type: 'spring',
    },
    {
      name: 'Ljetni praznici',
      nameShort: 'Ljeto',
      start: new Date(year + 1, 5, 21), // June 21
      end: new Date(year + 1, 8, 21), // September 21
      type: 'summer',
    },
  ];
}

/**
 * Get the current school year based on today's date
 * Returns the start year (e.g., 2025 for school year 2025./2026.)
 */
export function getCurrentSchoolYear(date = new Date()) {
  const month = date.getMonth();
  const year = date.getFullYear();

  // If we're in September or later, we're in the new school year
  // If we're before September, we're still in the previous school year
  if (month >= SCHOOL_YEAR_CONFIG.startMonth) {
    return year;
  }
  return year - 1;
}

/**
 * Get school year label (e.g., "2025./2026.")
 */
export function getSchoolYearLabel(startYear) {
  return `${startYear}./${startYear + 1}.`;
}

/**
 * Get school year date range
 */
export function getSchoolYearRange(startYear) {
  return {
    start: new Date(startYear, SCHOOL_YEAR_CONFIG.startMonth, SCHOOL_YEAR_CONFIG.startDay),
    end: new Date(startYear + 1, SCHOOL_YEAR_CONFIG.endMonth, SCHOOL_YEAR_CONFIG.endDay),
    label: getSchoolYearLabel(startYear),
  };
}

/**
 * Get current school year date range
 */
export function getCurrentSchoolYearRange(date = new Date()) {
  const schoolYear = getCurrentSchoolYear(date);
  return getSchoolYearRange(schoolYear);
}

/**
 * Check if a date is during a holiday period
 */
export function isHolidayDate(date, schoolYearStart = null) {
  const targetDate = startOfDay(new Date(date));
  const schoolYear = schoolYearStart ?? getCurrentSchoolYear(targetDate);
  const holidays = getHolidayPeriods(schoolYear);

  for (const holiday of holidays) {
    if (isWithinInterval(targetDate, {
      start: startOfDay(holiday.start),
      end: endOfDay(holiday.end),
    })) {
      return holiday;
    }
  }

  return null;
}

/**
 * Check if currently in holiday period
 */
export function getCurrentHoliday(date = new Date()) {
  return isHolidayDate(date);
}

/**
 * Get the next holiday period
 */
export function getNextHoliday(date = new Date()) {
  const today = startOfDay(date);
  const schoolYear = getCurrentSchoolYear(date);
  const holidays = getHolidayPeriods(schoolYear);

  // Also check next school year's holidays
  const nextYearHolidays = getHolidayPeriods(schoolYear + 1);
  const allHolidays = [...holidays, ...nextYearHolidays];

  for (const holiday of allHolidays) {
    if (startOfDay(holiday.start) > today) {
      return holiday;
    }
  }

  return null;
}

/**
 * Check if a date is within the active school period (not summer holidays)
 */
export function isActiveSchoolPeriod(date) {
  const targetDate = new Date(date);
  const month = targetDate.getMonth();

  // Summer holidays are roughly July and August
  if (month === 6 || month === 7) {
    return false;
  }

  return true;
}

/**
 * Get semester info (first or second)
 */
export function getSemester(date = new Date()) {
  const month = date.getMonth();

  // First semester: September to January
  // Second semester: February to June
  if (month >= 8 || month === 0) {
    return {
      number: 1,
      name: 'Prvo polugodište',
      nameShort: '1. polugodište',
    };
  }

  return {
    number: 2,
    name: 'Drugo polugodište',
    nameShort: '2. polugodište',
  };
}

/**
 * Get available school years from sessions data
 */
export function getAvailableSchoolYears(sessions) {
  if (!sessions || sessions.length === 0) return [];

  const schoolYears = new Set();

  sessions.forEach(session => {
    if (session.parsedDate) {
      const schoolYear = getCurrentSchoolYear(session.parsedDate);
      schoolYears.add(schoolYear);
    }
  });

  return Array.from(schoolYears).sort((a, b) => b - a);
}

/**
 * Filter sessions by school year
 */
export function filterSessionsBySchoolYear(sessions, schoolYearStart) {
  const range = getSchoolYearRange(schoolYearStart);

  return sessions.filter(session => {
    if (!session.parsedDate) return false;
    return isWithinInterval(session.parsedDate, {
      start: range.start,
      end: range.end,
    });
  });
}

/**
 * Get working days count (excluding weekends and holidays) for a period
 */
export function getWorkingDaysInPeriod(startDate, endDate, schoolYearStart = null) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const schoolYear = schoolYearStart ?? getCurrentSchoolYear(start);

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip holidays
      if (!isHolidayDate(current, schoolYear)) {
        workingDays++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Get expected volunteering days per week (typically certain weekdays)
 * This can be configured based on actual schedule
 */
export function getExpectedSessionDays() {
  // Example: volunteering happens on Tuesday, Wednesday, Thursday
  // Adjust based on actual schedule
  return [2, 3, 4]; // Tuesday, Wednesday, Thursday (0 = Sunday)
}

/**
 * Format school year period for display
 */
export function formatSchoolYearPeriod(date = new Date()) {
  const holiday = getCurrentHoliday(date);
  if (holiday) {
    return {
      status: 'holiday',
      label: holiday.name,
      message: `Praznici do ${format(holiday.end, 'd.M.yyyy.')}`,
    };
  }

  const semester = getSemester(date);
  const schoolYear = getCurrentSchoolYear(date);

  return {
    status: 'active',
    label: `${semester.nameShort} ${getSchoolYearLabel(schoolYear)}`,
    message: semester.name,
  };
}
