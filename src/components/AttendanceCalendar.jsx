import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Flame } from 'lucide-react';
import { LocationBadge } from './Badge';

// Get number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Format month name in Croatian
function formatMonth(date) {
  return date.toLocaleDateString('hr-HR', { month: 'long', year: 'numeric' });
}

// Location color palette - distinct, visually pleasing colors
const LOCATION_COLORS = [
  { bg: 'bg-violet-500', hover: 'hover:bg-violet-600', text: 'text-violet-700', light: 'bg-violet-100' },
  { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-700', light: 'bg-emerald-100' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-amber-700', light: 'bg-amber-100' },
  { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-700', light: 'bg-rose-100' },
  { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', text: 'text-cyan-700', light: 'bg-cyan-100' },
  { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-700', light: 'bg-orange-100' },
  { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', text: 'text-indigo-700', light: 'bg-indigo-100' },
  { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', text: 'text-pink-700', light: 'bg-pink-100' },
  { bg: 'bg-teal-500', hover: 'hover:bg-teal-600', text: 'text-teal-700', light: 'bg-teal-100' },
  { bg: 'bg-lime-500', hover: 'hover:bg-lime-600', text: 'text-lime-700', light: 'bg-lime-100' },
];

const WEEKDAYS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];

export default function AttendanceCalendar({ sessions = [], volunteerName }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Filter sessions for this volunteer
  const volunteerSessions = useMemo(() => {
    return sessions.filter(s => s.volunteersList?.includes(volunteerName));
  }, [sessions, volunteerName]);

  // Create location to color mapping
  const locationColorMap = useMemo(() => {
    const locations = [...new Set(volunteerSessions.map(s => s.location).filter(Boolean))];
    const map = new Map();
    locations.forEach((loc, i) => {
      map.set(loc, LOCATION_COLORS[i % LOCATION_COLORS.length]);
    });
    return map;
  }, [volunteerSessions]);

  // Create a map of date -> session for quick lookup
  const sessionsByDate = useMemo(() => {
    const map = new Map();
    volunteerSessions.forEach(session => {
      if (session.parsedDate) {
        const dateKey = session.parsedDate.toISOString().split('T')[0];
        map.set(dateKey, session);
      }
    });
    return map;
  }, [volunteerSessions]);

  // Get session for a specific date
  const getSessionForDate = (year, month, day) => {
    const dateKey = new Date(year, month, day).toISOString().split('T')[0];
    return sessionsByDate.get(dateKey) || null;
  };

  // Calculate stats for current view
  const stats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    let sessionsThisMonth = 0;
    const locationCounts = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const session = getSessionForDate(year, month, day);
      if (session) {
        sessionsThisMonth++;
        locationCounts[session.location] = (locationCounts[session.location] || 0) + 1;
      }
    }

    return { sessionsThisMonth, locationCounts };
  }, [currentDate, sessionsByDate]);

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  // Render calendar grid
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Adjust for Monday start (European style)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Empty cells for days before the first day of month
    for (let i = 0; i < startOffset; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const session = getSessionForDate(year, month, day);
      const isToday = isCurrentMonth && today.getDate() === day;
      const isSelected = selectedDay === day;
      const isFuture = new Date(year, month, day) > today;
      const locationColor = session ? locationColorMap.get(session.location) : null;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDay(isSelected ? null : day)}
          disabled={isFuture || !session}
          className={`
            aspect-square rounded-md text-xs font-medium
            flex items-center justify-center
            transition-all duration-150
            ${session ? `${locationColor?.bg} text-white` : 'bg-surface-100 text-surface-400'}
            ${isToday ? 'ring-2 ring-brand-purple ring-offset-1' : ''}
            ${isSelected ? 'ring-2 ring-brand-gold ring-offset-1 scale-110' : ''}
            ${session ? 'cursor-pointer hover:scale-110 hover:shadow-md' : ''}
            ${isFuture ? 'opacity-40' : ''}
          `}
          title={session ? session.location : ''}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Get selected day session
  const selectedDaySession = selectedDay
    ? getSessionForDate(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-purple" />
          Kalendar dolazaka
        </h3>
        <button
          onClick={goToToday}
          className="text-xs text-brand-purple hover:text-brand-purple-dark font-medium"
        >
          Danas
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-surface-600" />
        </button>
        <span className="font-medium text-surface-900 capitalize">
          {formatMonth(currentDate)}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-surface-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="aspect-square flex items-center justify-center text-xs font-medium text-surface-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      {/* Legend - Locations */}
      {locationColorMap.size > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[...locationColorMap.entries()].map(([location, color]) => (
            <div key={location} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${color.bg}`} />
              <span className="text-xs text-surface-600">{location}</span>
            </div>
          ))}
        </div>
      )}

      {/* Month Stats */}
      <div className="bg-surface-50 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-brand-purple">{stats.sessionsThisMonth}</p>
        <p className="text-xs text-surface-500">Termina ovaj mjesec</p>
      </div>

      {/* Selected Day Details */}
      {selectedDay && selectedDaySession && (
        <div className="bg-brand-purple/5 rounded-xl p-4 animate-fade-in">
          <p className="text-sm font-medium text-surface-900 mb-3">
            {selectedDay}. {formatMonth(currentDate).split(' ')[0]}
          </p>
          <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
            <LocationBadge location={selectedDaySession.location} />
            <span className="text-xs text-surface-500">
              {selectedDaySession.childrenCount} djece, {selectedDaySession.volunteerCount} vol.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Calculate current streak
function calculateStreak(sessionDates) {
  if (sessionDates.length === 0) return { current: 0, max: 0 };

  const sortedDates = [...sessionDates].sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;
  let lastDate = null;

  // Check if most recent session is within last 7 days for current streak
  const mostRecent = sortedDates[0];
  const daysSinceRecent = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));

  // For max streak, we look at consecutive weeks with at least one session
  const weekSet = new Set();
  sortedDates.forEach(date => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekSet.add(weekStart.toISOString().split('T')[0]);
  });

  const sortedWeeks = [...weekSet].sort().reverse();

  // Calculate max consecutive weeks
  let consecutiveWeeks = 1;
  maxStreak = 1;

  for (let i = 1; i < sortedWeeks.length; i++) {
    const prevWeek = new Date(sortedWeeks[i - 1]);
    const currWeek = new Date(sortedWeeks[i]);
    const diffWeeks = Math.round((prevWeek - currWeek) / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks === 1) {
      consecutiveWeeks++;
      maxStreak = Math.max(maxStreak, consecutiveWeeks);
    } else {
      consecutiveWeeks = 1;
    }
  }

  // Current streak - consecutive weeks from today
  if (daysSinceRecent <= 7) {
    currentStreak = 1;
    for (let i = 1; i < sortedWeeks.length; i++) {
      const prevWeek = new Date(sortedWeeks[i - 1]);
      const currWeek = new Date(sortedWeeks[i]);
      const diffWeeks = Math.round((prevWeek - currWeek) / (1000 * 60 * 60 * 24 * 7));

      if (diffWeeks === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, max: maxStreak };
}

// Yearly heatmap view - colored by location
export function AttendanceHeatmap({ sessions = [], volunteerName }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Filter sessions for this volunteer
  const volunteerSessions = useMemo(() => {
    return sessions.filter(s => s.volunteersList?.includes(volunteerName));
  }, [sessions, volunteerName]);

  // Create location to color mapping (consistent across the app)
  const locationColorMap = useMemo(() => {
    const allLocations = [...new Set(sessions.map(s => s.location).filter(Boolean))].sort();
    const map = new Map();
    allLocations.forEach((loc, i) => {
      map.set(loc, LOCATION_COLORS[i % LOCATION_COLORS.length]);
    });
    return map;
  }, [sessions]);

  // Create a map of date -> session for the past year
  const sessionsByDate = useMemo(() => {
    const map = new Map();
    volunteerSessions.forEach(session => {
      if (session.parsedDate) {
        const dateKey = session.parsedDate.toISOString().split('T')[0];
        map.set(dateKey, session);
      }
    });
    return map;
  }, [volunteerSessions]);

  // Generate past 52 weeks of data
  const weeks = useMemo(() => {
    const result = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Adjust to start on Monday
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }

    let currentDate = new Date(startDate);
    let currentWeek = [];

    while (currentDate <= today) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const session = sessionsByDate.get(dateKey) || null;
      const locationColor = session ? locationColorMap.get(session.location) : null;

      currentWeek.push({
        date: new Date(currentDate),
        dateKey,
        session,
        locationColor,
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [sessionsByDate, locationColorMap]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSessions = volunteerSessions.length;
    const totalDays = new Set(
      volunteerSessions
        .filter(s => s.parsedDate)
        .map(s => s.parsedDate.toISOString().split('T')[0])
    ).size;

    const locationCounts = {};
    volunteerSessions.forEach(s => {
      if (s.location) {
        locationCounts[s.location] = (locationCounts[s.location] || 0) + 1;
      }
    });

    const favoriteLocation = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const sessionDates = volunteerSessions
      .filter(s => s.parsedDate)
      .map(s => s.parsedDate);

    const streak = calculateStreak(sessionDates);

    return {
      totalSessions,
      totalDays,
      locationCounts,
      favoriteLocation: favoriteLocation ? { name: favoriteLocation[0], count: favoriteLocation[1] } : null,
      streak,
    };
  }, [volunteerSessions]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0];
      if (firstDayOfWeek && firstDayOfWeek.date.getMonth() !== lastMonth) {
        lastMonth = firstDayOfWeek.date.getMonth();
        labels.push({
          month: firstDayOfWeek.date.toLocaleDateString('hr-HR', { month: 'short' }),
          weekIndex,
        });
      }
    });

    return labels;
  }, [weeks]);

  // Get unique locations used this year
  const usedLocations = useMemo(() => {
    const locations = new Set();
    weeks.forEach(week => {
      week.forEach(day => {
        if (day.session?.location) {
          locations.add(day.session.location);
        }
      });
    });
    return [...locations].sort();
  }, [weeks]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-purple" />
          Godišnji pregled
        </h3>
        {stats.streak.current > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-orange-600">{stats.streak.current}</span>
            <span className="text-surface-500">tjedana zaredom</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-surface-50 rounded-lg p-2">
          <p className="text-lg font-bold text-brand-purple">{stats.totalSessions}</p>
          <p className="text-xs text-surface-500">Termina</p>
        </div>
        <div className="bg-surface-50 rounded-lg p-2">
          <p className="text-lg font-bold text-emerald-600">{usedLocations.length}</p>
          <p className="text-xs text-surface-500">Lokacija</p>
        </div>
        <div className="bg-surface-50 rounded-lg p-2">
          <p className="text-lg font-bold text-orange-600">{stats.streak.max}</p>
          <p className="text-xs text-surface-500">Maks. streak</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="text-xs text-surface-500"
                style={{
                  position: 'relative',
                  left: `${label.weekIndex * 14}px`,
                  width: '0',
                  whiteSpace: 'nowrap'
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {['P', '', 'S', '', 'P', '', 'N'].map((day, i) => (
                <div key={i} className="w-3 h-3 text-xs text-surface-400 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`
                      w-3 h-3 rounded-sm cursor-pointer
                      transition-all duration-150
                      ${day.session ? day.locationColor?.bg : 'bg-surface-100'}
                      hover:scale-150 hover:ring-2 hover:ring-surface-400 hover:z-10
                    `}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="text-sm text-center animate-fade-in p-2 bg-surface-50 rounded-lg">
          <span className="font-medium text-surface-700">
            {hoveredDay.date.toLocaleDateString('hr-HR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <br />
          {hoveredDay.session ? (
            <span className={`font-semibold ${hoveredDay.locationColor?.text}`}>
              {hoveredDay.session.location}
            </span>
          ) : (
            <span className="text-surface-400">Bez dolaska</span>
          )}
        </div>
      )}

      {/* Legend - Locations used */}
      {usedLocations.length > 0 && (
        <div>
          <p className="text-xs text-surface-500 mb-2 text-center">Lokacije (zadnjih godinu dana)</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {usedLocations.map(location => {
              const color = locationColorMap.get(location);
              const count = stats.locationCounts[location] || 0;
              return (
                <div key={location} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${color?.bg}`} />
                  <span className="text-xs text-surface-600">
                    {location} <span className="text-surface-400">({count})</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Favorite Location Highlight */}
      {stats.favoriteLocation && (
        <div className="text-center text-sm text-surface-500">
          Najčešće na{' '}
          <span className={`font-semibold ${locationColorMap.get(stats.favoriteLocation.name)?.text}`}>
            {stats.favoriteLocation.name}
          </span>
          {' '}({Math.round((stats.favoriteLocation.count / stats.totalSessions) * 100)}% termina)
        </div>
      )}
    </div>
  );
}
