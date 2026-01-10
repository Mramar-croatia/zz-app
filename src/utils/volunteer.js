import { ACTIVITY_THRESHOLDS } from '../constants';

/**
 * Calculate volunteer activity status based on hours and recent activity
 * @param {Object} volunteer - Volunteer object with name and hours
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Activity status with status, label, color, and dotColor
 */
export function getActivityStatus(volunteer, sessions) {
  if (!volunteer || !sessions) {
    return {
      status: 'inactive',
      label: 'Neaktivan',
      color: 'amber',
      dotColor: 'bg-amber-500',
    };
  }

  const now = new Date();
  const recentPeriodMs = ACTIVITY_THRESHOLDS.RECENT_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  const recentDate = new Date(now.getTime() - recentPeriodMs);

  // Get all sessions for this volunteer
  const volunteerSessions = sessions.filter(s =>
    s.volunteersList?.includes(volunteer.name)
  );

  // Calculate hours in recent period (last 2 months)
  const hoursInRecentPeriod = volunteerSessions
    .filter(s => s.parsedDate && s.parsedDate >= recentDate)
    .reduce((sum, s) => sum + (s.hours || 0), 0);

  const totalHours = volunteer.hours || 0;

  // Active: 10+ total hours OR 5+ hours in last 2 months
  if (
    totalHours >= ACTIVITY_THRESHOLDS.TOTAL_HOURS_ACTIVE ||
    hoursInRecentPeriod >= ACTIVITY_THRESHOLDS.RECENT_HOURS_ACTIVE
  ) {
    return {
      status: 'active',
      label: 'Aktivan',
      color: 'emerald',
      dotColor: 'bg-emerald-500',
    };
  }

  // Dormant: 5+ total hours but NOT active in last 2 months
  if (
    totalHours >= ACTIVITY_THRESHOLDS.TOTAL_HOURS_DORMANT &&
    hoursInRecentPeriod < ACTIVITY_THRESHOLDS.RECENT_HOURS_ACTIVE
  ) {
    return {
      status: 'dormant',
      label: 'Uspavan',
      color: 'red',
      dotColor: 'bg-red-500',
    };
  }

  // Inactive: everything else
  return {
    status: 'inactive',
    label: 'Neaktivan',
    color: 'amber',
    dotColor: 'bg-amber-500',
  };
}

/**
 * Calculate volunteer activity map with last active date and session count
 * @param {Array} volunteers - Array of volunteer objects
 * @param {Array} sessions - Array of session objects
 * @returns {Map} Map of volunteer name to { lastActive, sessionCount }
 */
export function getVolunteerActivityMap(volunteers, sessions) {
  const map = new Map();
  if (!sessions || !volunteers) return map;

  volunteers.forEach(v => {
    const volunteerSessions = sessions
      .filter(s => s.volunteersList?.includes(v.name))
      .sort((a, b) => (b.parsedDate || 0) - (a.parsedDate || 0));

    const lastActive = volunteerSessions[0]?.parsedDate || null;
    const sessionCount = volunteerSessions.length;
    map.set(v.name, { lastActive, sessionCount });
  });

  return map;
}

/**
 * Get volunteer's sessions sorted by date (newest first)
 * @param {string} volunteerName - Name of the volunteer
 * @param {Array} sessions - Array of session objects
 * @returns {Array} Sorted array of sessions
 */
export function getVolunteerSessions(volunteerName, sessions) {
  if (!volunteerName || !sessions) return [];

  return sessions
    .filter(s => s.volunteersList?.includes(volunteerName))
    .sort((a, b) => (b.parsedDate || 0) - (a.parsedDate || 0));
}

/**
 * Calculate activity trend based on recent sessions
 * @param {Array} volunteerSessions - Array of volunteer's sessions
 * @returns {string} 'up', 'down', or 'neutral'
 */
export function getActivityTrend(volunteerSessions) {
  if (!volunteerSessions || volunteerSessions.length < 2) return 'neutral';

  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const lastMonthSessions = volunteerSessions.filter(
    s => s.parsedDate && s.parsedDate >= oneMonthAgo
  ).length;

  const prevMonthSessions = volunteerSessions.filter(
    s => s.parsedDate && s.parsedDate >= twoMonthsAgo && s.parsedDate < oneMonthAgo
  ).length;

  if (lastMonthSessions > prevMonthSessions) return 'up';
  if (lastMonthSessions < prevMonthSessions) return 'down';
  return 'neutral';
}

/**
 * Calculate personal stats for a volunteer
 * @param {Array} volunteerSessions - Array of volunteer's sessions
 * @returns {Object|null} Stats object or null if no sessions
 */
export function getPersonalStats(volunteerSessions) {
  if (!volunteerSessions || !volunteerSessions.length) return null;

  const locationCounts = {};
  volunteerSessions.forEach(s => {
    locationCounts[s.location] = (locationCounts[s.location] || 0) + 1;
  });

  const favoriteLocation = Object.entries(locationCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const firstSessionDate =
    volunteerSessions[volunteerSessions.length - 1]?.parsedDate;
  const now = new Date();
  const monthsActive = firstSessionDate
    ? Math.max(
        1,
        Math.floor((now - firstSessionDate) / (1000 * 60 * 60 * 24 * 30))
      )
    : 1;

  return {
    favoriteLocation: favoriteLocation
      ? { name: favoriteLocation[0], count: favoriteLocation[1] }
      : null,
    totalLocations: Object.keys(locationCounts).length,
    avgSessionsPerMonth:
      Math.round((volunteerSessions.length / monthsActive) * 10) / 10,
    monthsActive,
    firstSessionDate,
  };
}

/**
 * Calculate achievements for a volunteer
 * @param {Object} volunteer - Volunteer object
 * @param {Array} volunteerSessions - Array of volunteer's sessions
 * @param {Object} personalStats - Personal stats object
 * @param {Object} activityStatus - Activity status object
 * @returns {Object} Achievements object
 */
export function getAchievements(
  volunteer,
  volunteerSessions,
  personalStats,
  activityStatus
) {
  const hours = volunteer?.hours || 0;
  const monthsActive = personalStats?.monthsActive || 0;

  return {
    firstSession: volunteerSessions?.length > 0,
    tenHours: hours >= 10,
    twentyHours: hours >= 20,
    thirtyHours: hours >= 30,
    fortyHours: hours >= 40,
    veteran: monthsActive >= 12,
    consistent: monthsActive >= 3 && activityStatus?.status === 'active',
  };
}

/**
 * Calculate next milestone for volunteer
 * @param {Object} volunteer - Volunteer object with hours
 * @returns {Object|null} Next milestone { goal, remaining } or null
 */
export function getNextMilestone(volunteer) {
  const hours = volunteer?.hours || 0;
  const goals = [10, 20, 30, 40];

  for (const goal of goals) {
    if (hours < goal) {
      return { goal, remaining: goal - hours };
    }
  }
  return null;
}
