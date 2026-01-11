import { getActivityStatus } from './volunteer';
import { isCancelledSession, getSessionCounts } from './session';
import { getLocationChartColor, getLocationChartColors } from './locationColors';
import {
  getCurrentHoliday,
  getCurrentSchoolYear,
  getSchoolYearLabel,
  getNextHoliday,
  isActiveSchoolPeriod,
  getSemester,
} from './schoolYear';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  subMonths,
  differenceInDays,
  parseISO,
  isWithinInterval,
  startOfYear,
  endOfYear,
} from 'date-fns';

/**
 * Calculate all statistics from volunteers and sessions data
 * @param {Array} volunteers - Array of volunteer objects
 * @param {Array} sessions - Array of session objects
 * @param {Object} filters - Optional filters (year, dateRange, locations, schools)
 * @returns {Object} Statistics object
 */
export function calculateStatistics(volunteers = [], sessions = [], filters = {}) {
  // Get session counts before filtering (for cancelled count)
  const sessionCounts = getSessionCounts(sessions);

  // Filter out cancelled sessions first (sessions with 0 volunteers and 0 children)
  let activeSessions = sessions.filter(s => !isCancelledSession(s));
  let filteredSessions = [...activeSessions];
  let filteredVolunteers = [...volunteers];

  // Date range filter
  if (filters.dateRange?.start && filters.dateRange?.end) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    filteredSessions = filteredSessions.filter(s => {
      if (!s.parsedDate) return false;
      return s.parsedDate >= start && s.parsedDate <= end;
    });
  } else if (filters.year) {
    filteredSessions = filteredSessions.filter(
      s => s.parsedDate?.getFullYear() === parseInt(filters.year)
    );
  }

  // Location filter
  if (filters.locations?.length > 0) {
    filteredSessions = filteredSessions.filter(s =>
      filters.locations.includes(s.location)
    );
  }

  // School filter
  if (filters.schools?.length > 0) {
    filteredVolunteers = filteredVolunteers.filter(v =>
      filters.schools.includes(v.school)
    );
  }

  return {
    summary: calculateSummary(filteredVolunteers, activeSessions, filteredSessions),
    sessionCounts, // Include cancelled session count
    byLocation: calculateByLocation(filteredSessions),
    bySchool: calculateBySchool(filteredVolunteers, filteredSessions),
    byMonth: calculateByMonth(filteredSessions),
    byGrade: calculateByGrade(filteredVolunteers),
    topVolunteers: calculateTopVolunteers(filteredVolunteers),
    activityBreakdown: calculateActivityBreakdown(filteredVolunteers, activeSessions),
    trends: calculateTrends(activeSessions),
    availableYears: getAvailableYears(activeSessions),
    availableLocations: getAvailableLocations(activeSessions),
    availableSchools: getAvailableSchools(volunteers),
    heatmapData: calculateHeatmapData(filteredSessions),
    retentionRate: calculateRetentionRate(volunteers, activeSessions),
    sessionDurationStats: calculateSessionDurationStats(filteredSessions),
    stackedLocationData: calculateStackedLocationData(filteredSessions),
    rankingHistory: calculateRankingHistory(volunteers, activeSessions),
    insights: generateInsights(filteredVolunteers, filteredSessions, activeSessions),
    predictions: generatePredictions(activeSessions),
    anomalies: detectAnomalies(activeSessions),
    recommendations: generateRecommendations(filteredVolunteers, filteredSessions, activeSessions),
    milestones: calculateMilestones(volunteers, activeSessions),
    weeklyLeaderboard: calculateWeeklyLeaderboard(volunteers, activeSessions),
    monthlyLeaderboard: calculateMonthlyLeaderboard(volunteers, activeSessions),
  };
}

/**
 * Calculate comprehensive comparison between two time periods
 */
export function calculateComparison(volunteers, sessions, period1, period2) {
  // First filter out cancelled sessions
  const activeSessions = sessions.filter(s => !isCancelledSession(s));

  const filterByPeriod = (sessions, period) => {
    if (!period.start || !period.end) return sessions;
    const start = new Date(period.start);
    const end = new Date(period.end);
    return sessions.filter(s => {
      if (!s.parsedDate) return false;
      return s.parsedDate >= start && s.parsedDate <= end;
    });
  };

  const sessions1 = filterByPeriod(activeSessions, period1);
  const sessions2 = filterByPeriod(activeSessions, period2);

  // Basic stats
  const getStats = (periodSessions) => {
    const totalChildren = periodSessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0);
    const totalVolunteers = periodSessions.reduce((sum, s) => sum + (s.volunteerCount || 0), 0);
    const uniqueVols = new Set(periodSessions.flatMap(s => s.volunteersList || []));
    const sessionsWithData = periodSessions.filter(s => s.childrenCount > 0 && s.volunteerCount > 0);

    return {
      sessions: periodSessions.length,
      children: totalChildren,
      volunteers: totalVolunteers,
      uniqueVolunteers: uniqueVols.size,
      avgChildrenPerSession: periodSessions.length > 0 ? (totalChildren / periodSessions.length).toFixed(1) : 0,
      avgVolunteersPerSession: periodSessions.length > 0 ? (totalVolunteers / periodSessions.length).toFixed(1) : 0,
      avgRatio: sessionsWithData.length > 0
        ? (sessionsWithData.reduce((sum, s) => sum + (s.childrenCount / s.volunteerCount), 0) / sessionsWithData.length).toFixed(1)
        : 0,
      totalHours: periodSessions.reduce((sum, s) => sum + (s.hours || 2), 0),
    };
  };

  const stats1 = getStats(sessions1);
  const stats2 = getStats(sessions2);

  const calculateChange = (current, previous) => {
    const curr = parseFloat(current) || 0;
    const prev = parseFloat(previous) || 0;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  // Location breakdown comparison
  const getLocationBreakdown = (periodSessions) => {
    const breakdown = {};
    periodSessions.forEach(s => {
      const loc = s.location || 'Nepoznato';
      if (!breakdown[loc]) breakdown[loc] = { sessions: 0, children: 0, volunteers: 0 };
      breakdown[loc].sessions++;
      breakdown[loc].children += s.childrenCount || 0;
      breakdown[loc].volunteers += s.volunteerCount || 0;
    });
    return breakdown;
  };

  const locationBreakdown1 = getLocationBreakdown(sessions1);
  const locationBreakdown2 = getLocationBreakdown(sessions2);
  const allLocations = [...new Set([...Object.keys(locationBreakdown1), ...Object.keys(locationBreakdown2)])];

  const locationComparison = allLocations.map(loc => ({
    location: loc,
    period1: locationBreakdown1[loc] || { sessions: 0, children: 0, volunteers: 0 },
    period2: locationBreakdown2[loc] || { sessions: 0, children: 0, volunteers: 0 },
    change: calculateChange(
      locationBreakdown1[loc]?.children || 0,
      locationBreakdown2[loc]?.children || 0
    ),
  })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  // Volunteer performance comparison
  const getVolunteerPerformance = (periodSessions) => {
    const perf = {};
    periodSessions.forEach(s => {
      s.volunteersList?.forEach(name => {
        if (!perf[name]) perf[name] = { sessions: 0, hours: 0 };
        perf[name].sessions++;
        perf[name].hours += s.hours || 2;
      });
    });
    return perf;
  };

  const volPerf1 = getVolunteerPerformance(sessions1);
  const volPerf2 = getVolunteerPerformance(sessions2);
  const allVolunteers = [...new Set([...Object.keys(volPerf1), ...Object.keys(volPerf2)])];

  const volunteerComparison = allVolunteers.map(name => {
    const v = volunteers.find(vol => vol.name === name);
    return {
      name,
      school: v?.school || '-',
      period1: volPerf1[name] || { sessions: 0, hours: 0 },
      period2: volPerf2[name] || { sessions: 0, hours: 0 },
      change: calculateChange(
        volPerf1[name]?.hours || 0,
        volPerf2[name]?.hours || 0
      ),
    };
  }).sort((a, b) => b.change - a.change);

  // Daily activity for sparklines
  const getDailyActivity = (periodSessions, period) => {
    if (!period.start || !period.end) return [];
    const days = eachDayOfInterval({ start: new Date(period.start), end: new Date(period.end) });
    return days.map(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const daySessions = periodSessions.filter(s =>
        s.parsedDate && format(s.parsedDate, 'yyyy-MM-dd') === dayKey
      );
      return {
        date: dayKey,
        label: format(day, 'd'),
        sessions: daySessions.length,
        children: daySessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0),
      };
    });
  };

  const dailyActivity1 = getDailyActivity(sessions1, period1);
  const dailyActivity2 = getDailyActivity(sessions2, period2);

  // Calculate winners for each metric
  const metrics = ['sessions', 'children', 'volunteers', 'uniqueVolunteers', 'avgChildrenPerSession', 'avgRatio'];
  const winners = {};
  metrics.forEach(metric => {
    const v1 = parseFloat(stats1[metric]) || 0;
    const v2 = parseFloat(stats2[metric]) || 0;
    if (v1 > v2) winners[metric] = 1;
    else if (v2 > v1) winners[metric] = 2;
    else winners[metric] = 0; // tie
  });

  const period1Wins = Object.values(winners).filter(w => w === 1).length;
  const period2Wins = Object.values(winners).filter(w => w === 2).length;

  // Generate comparison insights
  const insights = [];

  const sessionChange = calculateChange(stats1.sessions, stats2.sessions);
  if (Math.abs(sessionChange) >= 20) {
    insights.push({
      type: sessionChange > 0 ? 'positive' : 'negative',
      metric: 'sessions',
      text: sessionChange > 0
        ? `Broj termina povećan za ${sessionChange}%! Odlična aktivnost.`
        : `Broj termina smanjen za ${Math.abs(sessionChange)}%. Potrebno pojačati.`,
    });
  }

  const childrenChange = calculateChange(stats1.children, stats2.children);
  if (Math.abs(childrenChange) >= 15) {
    insights.push({
      type: childrenChange > 0 ? 'positive' : 'negative',
      metric: 'children',
      text: childrenChange > 0
        ? `Dosegnuto ${childrenChange}% više djece nego prije!`
        : `Pad broja djece od ${Math.abs(childrenChange)}%.`,
    });
  }

  const uniqueChange = calculateChange(stats1.uniqueVolunteers, stats2.uniqueVolunteers);
  if (uniqueChange > 0) {
    insights.push({
      type: 'positive',
      metric: 'uniqueVolunteers',
      text: `${stats1.uniqueVolunteers - stats2.uniqueVolunteers} novih aktivnih volontera!`,
    });
  }

  // Top improvers and decliners
  const topImprovers = volunteerComparison.filter(v => v.change > 0).slice(0, 3);
  const topDecliners = volunteerComparison.filter(v => v.change < 0).slice(-3).reverse();

  // Best/worst location changes
  const bestLocation = locationComparison.find(l => l.change > 0);
  const worstLocation = [...locationComparison].reverse().find(l => l.change < 0);

  return {
    period1: { ...period1, stats: stats1 },
    period2: { ...period2, stats: stats2 },
    changes: {
      sessions: calculateChange(stats1.sessions, stats2.sessions),
      children: calculateChange(stats1.children, stats2.children),
      volunteers: calculateChange(stats1.volunteers, stats2.volunteers),
      uniqueVolunteers: calculateChange(stats1.uniqueVolunteers, stats2.uniqueVolunteers),
      avgChildrenPerSession: calculateChange(stats1.avgChildrenPerSession, stats2.avgChildrenPerSession),
      avgVolunteersPerSession: calculateChange(stats1.avgVolunteersPerSession, stats2.avgVolunteersPerSession),
      avgRatio: calculateChange(stats1.avgRatio, stats2.avgRatio),
      totalHours: calculateChange(stats1.totalHours, stats2.totalHours),
    },
    locationComparison,
    volunteerComparison,
    dailyActivity1,
    dailyActivity2,
    winners,
    overallWinner: period1Wins > period2Wins ? 1 : period2Wins > period1Wins ? 2 : 0,
    period1Wins,
    period2Wins,
    insights,
    topImprovers,
    topDecliners,
    bestLocation,
    worstLocation,
  };
}

/**
 * Calculate summary statistics
 */
function calculateSummary(volunteers, allSessions, filteredSessions) {
  const totalHours = volunteers.reduce((sum, v) => sum + (v.hours || 0), 0);
  const totalChildren = filteredSessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0);
  const totalVolunteerAttendances = filteredSessions.reduce((sum, s) => sum + (s.volunteerCount || 0), 0);

  const activeVolunteers = volunteers.filter(
    v => getActivityStatus(v, allSessions).status === 'active'
  ).length;

  const inactiveVolunteers = volunteers.filter(
    v => getActivityStatus(v, allSessions).status === 'inactive'
  ).length;

  const dormantVolunteers = volunteers.filter(
    v => getActivityStatus(v, allSessions).status === 'dormant'
  ).length;

  const activePercentage = volunteers.length > 0
    ? Math.round((activeVolunteers / volunteers.length) * 100)
    : 0;

  const sessionsWithChildren = filteredSessions.filter(s => s.childrenCount > 0);
  const avgChildrenPerSession = sessionsWithChildren.length > 0
    ? (totalChildren / sessionsWithChildren.length).toFixed(1)
    : 0;

  const sessionsWithVolunteers = filteredSessions.filter(s => s.volunteerCount > 0);
  const avgVolunteersPerSession = sessionsWithVolunteers.length > 0
    ? (totalVolunteerAttendances / sessionsWithVolunteers.length).toFixed(1)
    : 0;

  const sessionsWithData = filteredSessions.filter(s => s.childrenCount > 0 && s.volunteerCount > 0);
  const avgRatio = sessionsWithData.length > 0
    ? (sessionsWithData.reduce((sum, s) => sum + s.childrenCount / s.volunteerCount, 0) / sessionsWithData.length).toFixed(1)
    : 0;

  const avgHoursPerVolunteer = volunteers.length > 0
    ? (totalHours / volunteers.length).toFixed(1)
    : 0;

  const locations = [...new Set(filteredSessions.map(s => s.location).filter(Boolean))];

  return {
    totalVolunteers: volunteers.length,
    activeVolunteers,
    inactiveVolunteers,
    dormantVolunteers,
    activePercentage,
    totalHours,
    avgHoursPerVolunteer,
    totalSessions: filteredSessions.length,
    totalChildren,
    avgChildrenPerSession,
    avgVolunteersPerSession,
    avgRatio,
    totalLocations: locations.length,
  };
}

/**
 * Calculate statistics by location
 */
function calculateByLocation(sessions) {
  const locationStats = {};

  sessions.forEach(session => {
    const loc = session.location || 'Nepoznato';
    if (!locationStats[loc]) {
      locationStats[loc] = {
        name: loc,
        sessions: 0,
        children: 0,
        volunteers: 0,
      };
    }
    locationStats[loc].sessions++;
    locationStats[loc].children += session.childrenCount || 0;
    locationStats[loc].volunteers += session.volunteerCount || 0;
  });

  return Object.values(locationStats).sort((a, b) => b.sessions - a.sessions);
}

/**
 * Calculate statistics by school
 */
function calculateBySchool(volunteers, sessions) {
  const schoolStats = {};

  volunteers.forEach(volunteer => {
    const school = volunteer.school || 'Nepoznato';
    if (!schoolStats[school]) {
      schoolStats[school] = {
        name: school,
        volunteers: 0,
        hours: 0,
        sessions: 0,
      };
    }
    schoolStats[school].volunteers++;
    schoolStats[school].hours += volunteer.hours || 0;

    const volunteerSessions = sessions.filter(s =>
      s.volunteersList?.includes(volunteer.name)
    );
    schoolStats[school].sessions += volunteerSessions.length;
  });

  return Object.values(schoolStats).sort((a, b) => b.volunteers - a.volunteers);
}

/**
 * Calculate statistics by month
 */
function calculateByMonth(sessions) {
  const monthNames = [
    'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
    'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac',
  ];

  const monthStats = {};

  sessions.forEach(session => {
    if (!session.parsedDate) return;

    const year = session.parsedDate.getFullYear();
    const month = session.parsedDate.getMonth();
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!monthStats[key]) {
      monthStats[key] = {
        key,
        year,
        month,
        label: `${monthNames[month]} ${year}`,
        shortLabel: `${monthNames[month].slice(0, 3)} ${year}`,
        sessions: 0,
        children: 0,
        volunteers: 0,
      };
    }
    monthStats[key].sessions++;
    monthStats[key].children += session.childrenCount || 0;
    monthStats[key].volunteers += session.volunteerCount || 0;
  });

  return Object.values(monthStats).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

/**
 * Calculate statistics by grade
 */
function calculateByGrade(volunteers) {
  const gradeStats = {};

  volunteers.forEach(volunteer => {
    const grade = volunteer.grade || 'Nepoznato';
    if (!gradeStats[grade]) {
      gradeStats[grade] = {
        grade,
        label: `${grade}. razred`,
        count: 0,
        hours: 0,
      };
    }
    gradeStats[grade].count++;
    gradeStats[grade].hours += volunteer.hours || 0;
  });

  return Object.values(gradeStats).sort((a, b) => {
    const gradeA = parseInt(a.grade) || 0;
    const gradeB = parseInt(b.grade) || 0;
    return gradeA - gradeB;
  });
}

/**
 * Calculate top volunteers by hours
 */
function calculateTopVolunteers(volunteers) {
  return [...volunteers]
    .sort((a, b) => (b.hours || 0) - (a.hours || 0))
    .slice(0, 15)
    .map((v, index) => ({
      rank: index + 1,
      name: v.name,
      school: v.school || '-',
      grade: v.grade,
      hours: v.hours || 0,
      locations: v.locations || [],
    }));
}

/**
 * Calculate activity status breakdown
 */
function calculateActivityBreakdown(volunteers, sessions) {
  const active = volunteers.filter(v => getActivityStatus(v, sessions).status === 'active').length;
  const inactive = volunteers.filter(v => getActivityStatus(v, sessions).status === 'inactive').length;
  const dormant = volunteers.filter(v => getActivityStatus(v, sessions).status === 'dormant').length;

  return [
    { label: 'Aktivni', value: active, color: '#10B981' },
    { label: 'Neaktivni', value: inactive, color: '#F59E0B' },
    { label: 'Uspavani', value: dormant, color: '#EF4444' },
  ];
}

/**
 * Calculate trends (sessions per month for charts)
 */
function calculateTrends(sessions) {
  const monthNames = ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'];
  const monthStats = {};

  sessions.forEach(session => {
    if (!session.parsedDate) return;
    const year = session.parsedDate.getFullYear();
    const month = session.parsedDate.getMonth();
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!monthStats[key]) {
      monthStats[key] = {
        label: `${monthNames[month]} ${String(year).slice(2)}`,
        sessions: 0,
        children: 0,
        volunteers: 0,
        year,
        month,
      };
    }
    monthStats[key].sessions++;
    monthStats[key].children += session.childrenCount || 0;
    monthStats[key].volunteers += session.volunteerCount || 0;
  });

  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
    const data = monthStats[key] || {
      label: `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`,
      sessions: 0,
      children: 0,
      volunteers: 0,
    };
    months.push(data);
  }

  return {
    labels: months.map(m => m.label),
    sessions: months.map(m => m.sessions),
    children: months.map(m => m.children),
    volunteers: months.map(m => m.volunteers),
  };
}

/**
 * Get available years from sessions
 */
function getAvailableYears(sessions) {
  const years = new Set();
  sessions.forEach(session => {
    if (session.parsedDate) {
      years.add(session.parsedDate.getFullYear());
    }
  });
  return [...years].sort((a, b) => b - a);
}

/**
 * Get available locations from sessions
 */
function getAvailableLocations(sessions) {
  const locations = new Set();
  sessions.forEach(session => {
    if (session.location) {
      locations.add(session.location);
    }
  });
  return [...locations].sort();
}

/**
 * Get available schools from volunteers
 */
function getAvailableSchools(volunteers) {
  const schools = new Set();
  volunteers.forEach(volunteer => {
    if (volunteer.school) {
      schools.add(volunteer.school);
    }
  });
  return [...schools].sort();
}

/**
 * Calculate heatmap data for calendar visualization
 */
function calculateHeatmapData(sessions) {
  const heatmap = {};

  sessions.forEach(session => {
    if (!session.parsedDate) return;
    const dateKey = format(session.parsedDate, 'yyyy-MM-dd');
    if (!heatmap[dateKey]) {
      heatmap[dateKey] = {
        date: dateKey,
        sessions: 0,
        children: 0,
        volunteers: 0,
      };
    }
    heatmap[dateKey].sessions++;
    heatmap[dateKey].children += session.childrenCount || 0;
    heatmap[dateKey].volunteers += session.volunteerCount || 0;
  });

  return heatmap;
}

/**
 * Calculate retention rate
 */
function calculateRetentionRate(volunteers, sessions) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  const twelveMonthsAgo = subMonths(now, 12);

  // Get volunteers active 6-12 months ago
  const activeBackThen = new Set();
  sessions.forEach(s => {
    if (!s.parsedDate) return;
    if (s.parsedDate >= twelveMonthsAgo && s.parsedDate < sixMonthsAgo) {
      s.volunteersList?.forEach(name => activeBackThen.add(name));
    }
  });

  // Get volunteers active in last 6 months
  const activeNow = new Set();
  sessions.forEach(s => {
    if (!s.parsedDate) return;
    if (s.parsedDate >= sixMonthsAgo) {
      s.volunteersList?.forEach(name => activeNow.add(name));
    }
  });

  // Calculate retention
  let retained = 0;
  activeBackThen.forEach(name => {
    if (activeNow.has(name)) retained++;
  });

  const rate = activeBackThen.size > 0
    ? Math.round((retained / activeBackThen.size) * 100)
    : 0;

  return {
    rate,
    retained,
    total: activeBackThen.size,
    newVolunteers: [...activeNow].filter(name => !activeBackThen.has(name)).length,
  };
}

/**
 * Calculate session duration statistics
 */
function calculateSessionDurationStats(sessions) {
  const durations = sessions
    .map(s => s.hours || s.duration || 2) // Default 2 hours
    .filter(d => d > 0);

  if (durations.length === 0) {
    return { avg: 0, min: 0, max: 0, total: 0 };
  }

  return {
    avg: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1),
    min: Math.min(...durations),
    max: Math.max(...durations),
    total: durations.reduce((a, b) => a + b, 0),
  };
}

/**
 * Calculate stacked location data for charts
 */
function calculateStackedLocationData(sessions) {
  const monthNames = ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'];
  const locations = [...new Set(sessions.map(s => s.location).filter(Boolean))];
  const now = new Date();

  const monthlyData = {};
  const labels = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
    labels.push(`${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`);
    monthlyData[key] = {};
    locations.forEach(loc => {
      monthlyData[key][loc] = { children: 0, volunteers: 0 };
    });
  }

  sessions.forEach(session => {
    if (!session.parsedDate || !session.location) return;
    const key = `${session.parsedDate.getFullYear()}-${String(session.parsedDate.getMonth()).padStart(2, '0')}`;
    if (monthlyData[key] && monthlyData[key][session.location]) {
      monthlyData[key][session.location].children += session.childrenCount || 0;
      monthlyData[key][session.location].volunteers += session.volunteerCount || 0;
    }
  });

  return {
    labels,
    locations,
    datasets: locations.slice(0, 8).map((loc) => ({
      label: loc,
      data: Object.keys(monthlyData).sort().map(key => monthlyData[key][loc]?.children || 0),
      backgroundColor: getLocationChartColor(loc, 'main'),
    })),
  };
}

/**
 * Calculate ranking history for top volunteers
 */
function calculateRankingHistory(volunteers, sessions) {
  const now = new Date();
  const history = [];

  // Calculate rankings for each of the last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthEnd = endOfMonth(subMonths(now, i));
    const monthStart = startOfMonth(subMonths(now, i));

    const volunteerHours = {};
    volunteers.forEach(v => {
      volunteerHours[v.name] = 0;
    });

    sessions.forEach(s => {
      if (!s.parsedDate) return;
      if (s.parsedDate <= monthEnd) {
        s.volunteersList?.forEach(name => {
          if (volunteerHours[name] !== undefined) {
            volunteerHours[name] += s.hours || 2;
          }
        });
      }
    });

    const sorted = Object.entries(volunteerHours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    history.push({
      month: format(monthStart, 'MMM yy'),
      rankings: sorted.map(([name], idx) => ({ name, rank: idx + 1 })),
    });
  }

  return history;
}

/**
 * Generate AI insights
 */
function generateInsights(volunteers, filteredSessions, allSessions) {
  const insights = [];
  const now = new Date();

  // Holiday insight - check if currently in holidays
  const currentHoliday = getCurrentHoliday(now);
  if (currentHoliday) {
    insights.push({
      type: 'info',
      icon: 'calendar-x',
      title: currentHoliday.name,
      description: `Volontiranje je na pauzi. Nastavak nakon ${format(currentHoliday.end, 'd.M.yyyy.')}`,
    });
  }

  // Next holiday insight
  const nextHoliday = getNextHoliday(now);
  if (nextHoliday && !currentHoliday) {
    const daysUntil = differenceInDays(nextHoliday.start, now);
    if (daysUntil <= 14 && daysUntil > 0) {
      insights.push({
        type: 'info',
        icon: 'calendar',
        title: `${nextHoliday.name} uskoro`,
        description: `Još ${daysUntil} dana do početka praznika.`,
      });
    }
  }

  // School year context
  const schoolYear = getCurrentSchoolYear(now);
  const semester = getSemester(now);

  // Session trend insight (only if not in holidays)
  if (!currentHoliday) {
    const thisMonth = filteredSessions.filter(s =>
      s.parsedDate?.getMonth() === now.getMonth() &&
      s.parsedDate?.getFullYear() === now.getFullYear()
    ).length;

    const lastMonth = filteredSessions.filter(s => {
      const lastMonthDate = subMonths(now, 1);
      return s.parsedDate?.getMonth() === lastMonthDate.getMonth() &&
        s.parsedDate?.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    if (thisMonth > lastMonth && lastMonth > 0) {
      const increase = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
      insights.push({
        type: 'positive',
        icon: 'trending-up',
        title: 'Rast aktivnosti',
        description: `Broj termina povećan je za ${increase}% u odnosu na prošli mjesec.`,
      });
    } else if (thisMonth < lastMonth && lastMonth > 0) {
      const decrease = Math.round(((lastMonth - thisMonth) / lastMonth) * 100);
      // Don't warn about decrease if it might be due to holidays
      const wasLastMonthHoliday = getCurrentHoliday(subMonths(now, 1));
      if (!wasLastMonthHoliday) {
        insights.push({
          type: 'warning',
          icon: 'trending-down',
          title: 'Pad aktivnosti',
          description: `Broj termina smanjen je za ${decrease}% u odnosu na prošli mjesec.`,
        });
      }
    }
  }

  // Top location insight
  const locationStats = {};
  filteredSessions.forEach(s => {
    if (s.location) {
      locationStats[s.location] = (locationStats[s.location] || 0) + (s.childrenCount || 0);
    }
  });
  const topLocation = Object.entries(locationStats).sort((a, b) => b[1] - a[1])[0];
  if (topLocation) {
    insights.push({
      type: 'info',
      icon: 'map-pin',
      title: 'Najpopularnija lokacija',
      description: `${topLocation[0]} ima najviše djece (${topLocation[1]} ukupno).`,
    });
  }

  // Active volunteers insight
  const activeCount = volunteers.filter(v =>
    getActivityStatus(v, allSessions).status === 'active'
  ).length;
  const activePercent = volunteers.length > 0
    ? Math.round((activeCount / volunteers.length) * 100)
    : 0;

  if (activePercent >= 70) {
    insights.push({
      type: 'positive',
      icon: 'users',
      title: 'Visoka aktivnost volontera',
      description: `${activePercent}% volontera je aktivno - odlično!`,
    });
  } else if (activePercent < 50) {
    insights.push({
      type: 'warning',
      icon: 'users',
      title: 'Niska aktivnost volontera',
      description: `Samo ${activePercent}% volontera je aktivno. Razmotrite aktivaciju neaktivnih.`,
    });
  }

  // Top volunteer insight
  const topVolunteer = [...volunteers].sort((a, b) => (b.hours || 0) - (a.hours || 0))[0];
  if (topVolunteer) {
    insights.push({
      type: 'info',
      icon: 'trophy',
      title: 'Top volonter',
      description: `${topVolunteer.name} vodi s ${topVolunteer.hours || 0} sati volontiranja.`,
    });
  }

  return insights;
}

/**
 * Generate trend predictions
 */
function generatePredictions(sessions) {
  const monthNames = ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'];
  const now = new Date();

  // Get last 6 months of data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const monthSessions = sessions.filter(s =>
      s.parsedDate && s.parsedDate >= monthStart && s.parsedDate <= monthEnd
    );

    monthlyData.push({
      sessions: monthSessions.length,
      children: monthSessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0),
    });
  }

  // Simple linear regression for prediction
  const n = monthlyData.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = monthlyData.reduce((sum, d) => sum + d.sessions, 0);
  const sumXY = monthlyData.reduce((sum, d, i) => sum + i * d.sessions, 0);
  const sumX2 = monthlyData.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict next 3 months
  const predictions = [];
  for (let i = 1; i <= 3; i++) {
    const predictedSessions = Math.max(0, Math.round(intercept + slope * (n + i - 1)));
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    predictions.push({
      month: `${monthNames[futureDate.getMonth()]} ${futureDate.getFullYear()}`,
      sessions: predictedSessions,
      trend: slope > 0 ? 'up' : slope < 0 ? 'down' : 'stable',
    });
  }

  return {
    historical: monthlyData.map((d, i) => {
      const date = subMonths(now, 5 - i);
      return {
        month: `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`,
        sessions: d.sessions,
      };
    }),
    predicted: predictions,
    trend: slope > 0.5 ? 'growing' : slope < -0.5 ? 'declining' : 'stable',
    confidence: Math.min(95, Math.max(50, 70 + (n * 5))),
  };
}

/**
 * Detect anomalies in data
 */
function detectAnomalies(sessions) {
  const anomalies = [];
  const monthlyData = {};

  sessions.forEach(s => {
    if (!s.parsedDate) return;
    const key = format(s.parsedDate, 'yyyy-MM');
    if (!monthlyData[key]) {
      monthlyData[key] = { sessions: 0, children: 0 };
    }
    monthlyData[key].sessions++;
    monthlyData[key].children += s.childrenCount || 0;
  });

  const values = Object.values(monthlyData).map(d => d.sessions);
  if (values.length < 3) return anomalies;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

  Object.entries(monthlyData).forEach(([month, data]) => {
    const zScore = (data.sessions - mean) / (stdDev || 1);

    if (zScore > 2) {
      anomalies.push({
        type: 'spike',
        month,
        value: data.sessions,
        expected: Math.round(mean),
        description: `Neobično visok broj termina (${data.sessions} vs prosjek ${Math.round(mean)})`,
      });
    } else if (zScore < -2) {
      anomalies.push({
        type: 'drop',
        month,
        value: data.sessions,
        expected: Math.round(mean),
        description: `Neobično nizak broj termina (${data.sessions} vs prosjek ${Math.round(mean)})`,
      });
    }
  });

  return anomalies;
}

/**
 * Generate recommendations
 */
function generateRecommendations(volunteers, filteredSessions, allSessions) {
  const recommendations = [];
  const now = new Date();
  const currentHoliday = getCurrentHoliday(now);
  const nextHoliday = getNextHoliday(now);

  // Holiday-specific recommendations
  if (currentHoliday) {
    recommendations.push({
      priority: 'info',
      icon: 'calendar',
      title: 'Priprema za nastavak',
      description: `Iskoristite praznike za planiranje rasporeda nakon ${format(currentHoliday.end, 'd.M.')}.`,
      action: 'Planiraj',
    });
  } else if (nextHoliday) {
    const daysUntil = differenceInDays(nextHoliday.start, now);
    if (daysUntil <= 7 && daysUntil > 0) {
      recommendations.push({
        priority: 'medium',
        icon: 'calendar',
        title: 'Praznici se približavaju',
        description: `${nextHoliday.name} počinju za ${daysUntil} dana. Obavijestite volontere i dogovorite raspored.`,
        action: 'Obavijesti',
      });
    }
  }

  // Location recommendation
  const locationStats = {};
  filteredSessions.forEach(s => {
    if (s.location) {
      if (!locationStats[s.location]) {
        locationStats[s.location] = { sessions: 0, children: 0, volunteers: 0 };
      }
      locationStats[s.location].sessions++;
      locationStats[s.location].children += s.childrenCount || 0;
      locationStats[s.location].volunteers += s.volunteerCount || 0;
    }
  });

  const locations = Object.entries(locationStats);
  const highDemand = locations.filter(([, stats]) => {
    const ratio = stats.children / (stats.volunteers || 1);
    return ratio > 5;
  });

  if (highDemand.length > 0) {
    recommendations.push({
      priority: 'high',
      icon: 'map-pin',
      title: 'Potrebno više volontera',
      description: `Lokacija ${highDemand[0][0]} ima visok omjer djece po volonteru. Razmotrite dodavanje više termina ili volontera.`,
      action: 'Dodaj volontere',
    });
  }

  // Inactive volunteers recommendation
  const dormant = volunteers.filter(v =>
    getActivityStatus(v, allSessions).status === 'dormant'
  );

  if (dormant.length > 5) {
    recommendations.push({
      priority: 'medium',
      icon: 'user-x',
      title: 'Reaktivacija volontera',
      description: `${dormant.length} volontera nije bilo aktivno duže vrijeme. Kontaktirajte ih.`,
      action: 'Pregledaj popis',
    });
  }

  // School diversity recommendation
  const schoolStats = {};
  volunteers.forEach(v => {
    if (v.school) {
      schoolStats[v.school] = (schoolStats[v.school] || 0) + 1;
    }
  });

  const topSchool = Object.entries(schoolStats).sort((a, b) => b[1] - a[1])[0];
  if (topSchool && topSchool[1] > volunteers.length * 0.4) {
    recommendations.push({
      priority: 'low',
      icon: 'graduation-cap',
      title: 'Raznolikost škola',
      description: `${Math.round(topSchool[1] / volunteers.length * 100)}% volontera dolazi iz iste škole. Razmotrite regrutaciju iz drugih škola.`,
      action: 'Proširi mrežu',
    });
  }

  return recommendations;
}

/**
 * Calculate milestones
 */
function calculateMilestones(volunteers, sessions) {
  const milestones = [];
  const totalHours = volunteers.reduce((sum, v) => sum + (v.hours || 0), 0);
  const totalChildren = sessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0);
  const totalSessions = sessions.length;

  // Hours milestones
  const hourMilestones = [100, 250, 500, 1000, 2500, 5000, 10000];
  hourMilestones.forEach(milestone => {
    if (totalHours >= milestone) {
      milestones.push({
        type: 'hours',
        value: milestone,
        achieved: true,
        label: `${milestone} volonterskih sati`,
        icon: 'clock',
      });
    } else {
      const remaining = milestone - totalHours;
      if (remaining < milestone * 0.2) {
        milestones.push({
          type: 'hours',
          value: milestone,
          achieved: false,
          progress: Math.round((totalHours / milestone) * 100),
          remaining,
          label: `${milestone} volonterskih sati`,
          icon: 'clock',
        });
      }
    }
  });

  // Sessions milestones
  const sessionMilestones = [50, 100, 250, 500, 1000];
  sessionMilestones.forEach(milestone => {
    if (totalSessions >= milestone) {
      milestones.push({
        type: 'sessions',
        value: milestone,
        achieved: true,
        label: `${milestone} održanih termina`,
        icon: 'calendar',
      });
    }
  });

  // Children milestones
  const childrenMilestones = [500, 1000, 2500, 5000, 10000];
  childrenMilestones.forEach(milestone => {
    if (totalChildren >= milestone) {
      milestones.push({
        type: 'children',
        value: milestone,
        achieved: true,
        label: `${milestone} dolazaka djece`,
        icon: 'baby',
      });
    }
  });

  return milestones.sort((a, b) => {
    if (a.achieved !== b.achieved) return a.achieved ? -1 : 1;
    return b.value - a.value;
  });
}

/**
 * Calculate weekly leaderboard
 */
function calculateWeeklyLeaderboard(volunteers, sessions) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const volunteerHours = {};
  volunteers.forEach(v => {
    volunteerHours[v.name] = { hours: 0, sessions: 0, school: v.school };
  });

  sessions.forEach(s => {
    if (!s.parsedDate || s.parsedDate < weekAgo) return;
    s.volunteersList?.forEach(name => {
      if (volunteerHours[name]) {
        volunteerHours[name].hours += s.hours || 2;
        volunteerHours[name].sessions++;
      }
    });
  });

  return Object.entries(volunteerHours)
    .filter(([, data]) => data.hours > 0)
    .sort((a, b) => b[1].hours - a[1].hours)
    .slice(0, 10)
    .map(([name, data], index) => ({
      rank: index + 1,
      name,
      hours: data.hours,
      sessions: data.sessions,
      school: data.school,
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null,
    }));
}

/**
 * Calculate monthly leaderboard
 */
function calculateMonthlyLeaderboard(volunteers, sessions) {
  const now = new Date();
  const monthStart = startOfMonth(now);

  const volunteerHours = {};
  volunteers.forEach(v => {
    volunteerHours[v.name] = { hours: 0, sessions: 0, school: v.school };
  });

  sessions.forEach(s => {
    if (!s.parsedDate || s.parsedDate < monthStart) return;
    s.volunteersList?.forEach(name => {
      if (volunteerHours[name]) {
        volunteerHours[name].hours += s.hours || 2;
        volunteerHours[name].sessions++;
      }
    });
  });

  return Object.entries(volunteerHours)
    .filter(([, data]) => data.hours > 0)
    .sort((a, b) => b[1].hours - a[1].hours)
    .slice(0, 10)
    .map(([name, data], index) => ({
      rank: index + 1,
      name,
      hours: data.hours,
      sessions: data.sessions,
      school: data.school,
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null,
    }));
}

/**
 * Get chart data for hours distribution by school
 */
export function getHoursBySchoolChart(volunteers) {
  const schoolHours = {};

  volunteers.forEach(volunteer => {
    const school = volunteer.school || 'Ostalo';
    schoolHours[school] = (schoolHours[school] || 0) + (volunteer.hours || 0);
  });

  const sorted = Object.entries(schoolHours)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    labels: sorted.map(([school]) => school),
    data: sorted.map(([, hours]) => hours),
  };
}

/**
 * Get chart data for children by location
 */
export function getChildrenByLocationChart(sessions) {
  const locationChildren = {};

  sessions.forEach(session => {
    const loc = session.location || 'Ostalo';
    locationChildren[loc] = (locationChildren[loc] || 0) + (session.childrenCount || 0);
  });

  const sorted = Object.entries(locationChildren)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const labels = sorted.map(([loc]) => loc);

  return {
    labels,
    data: sorted.map(([, count]) => count),
    backgroundColor: getLocationChartColors(labels, 'light'),
    borderColor: getLocationChartColors(labels, 'main'),
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data, filename) {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

/**
 * Get quick stats for hero section (kept for compatibility)
 */
export function getQuickStats(volunteers = [], sessions = []) {
  const stats = calculateStatistics(volunteers, sessions);
  return {
    totalVolunteers: stats.summary.totalVolunteers,
    activeVolunteers: stats.summary.activeVolunteers,
    totalHours: stats.summary.totalHours,
    totalChildren: stats.summary.totalChildren,
    totalSessions: stats.summary.totalSessions,
    avgRatio: `${stats.summary.avgRatio}:1`,
  };
}
