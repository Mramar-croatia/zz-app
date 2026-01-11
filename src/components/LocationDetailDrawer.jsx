import { useEffect, useRef, useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Users,
  Baby,
  Calendar,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { Badge, LocationBadge } from './Badge';
import { Card, CardContent } from './Card';
import { Avatar } from './VolunteerDetailDrawer';
import { isCancelledSession } from '../utils/session';

// Format date for display
function formatDate(date) {
  if (!date) return '-';
  return date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Get day of week
function getDayOfWeek(date) {
  if (!date) return '-';
  return date.toLocaleDateString('hr-HR', { weekday: 'long' });
}

export default function LocationDetailDrawer({
  location,
  sessions = [],
  volunteers = [],
  onClose,
  onSelectSession,
  onSelectVolunteer,
  onNavigate,
}) {
  const drawerRef = useRef(null);
  const [showAllSessions, setShowAllSessions] = useState(false);

  // Get all sessions at this location (exclude cancelled)
  const locationSessions = useMemo(() => {
    if (!location || !sessions.length) return [];
    return sessions
      .filter(s => s.location === location && !isCancelledSession(s))
      .sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) return 0;
        return b.parsedDate - a.parsedDate;
      });
  }, [location, sessions]);

  // Calculate location statistics
  const stats = useMemo(() => {
    if (!locationSessions.length) {
      return {
        totalSessions: 0,
        totalChildren: 0,
        totalVolunteers: 0,
        avgChildrenPerSession: 0,
        avgVolunteersPerSession: 0,
        uniqueVolunteers: 0,
      };
    }

    const totalChildren = locationSessions.reduce((sum, s) => sum + (s.childrenCount || 0), 0);
    const totalVolunteers = locationSessions.reduce((sum, s) => sum + (s.volunteerCount || 0), 0);

    // Count unique volunteers who attended this location
    const volunteerSet = new Set();
    locationSessions.forEach(s => {
      s.volunteersList?.forEach(name => volunteerSet.add(name));
    });

    return {
      totalSessions: locationSessions.length,
      totalChildren,
      totalVolunteers,
      avgChildrenPerSession: locationSessions.length > 0
        ? Math.round(totalChildren / locationSessions.length)
        : 0,
      avgVolunteersPerSession: locationSessions.length > 0
        ? Math.round((totalVolunteers / locationSessions.length) * 10) / 10
        : 0,
      uniqueVolunteers: volunteerSet.size,
    };
  }, [locationSessions]);

  // Get top volunteers at this location
  const topVolunteers = useMemo(() => {
    const volunteerCounts = {};
    locationSessions.forEach(s => {
      s.volunteersList?.forEach(name => {
        volunteerCounts[name] = (volunteerCounts[name] || 0) + 1;
      });
    });

    return Object.entries(volunteerCounts)
      .map(([name, count]) => ({
        name,
        count,
        volunteer: volunteers.find(v => v.name === name),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [locationSessions, volunteers]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    drawerRef.current?.focus();
  }, []);

  const handleViewInTermini = () => {
    onNavigate?.('termini');
    onClose();
  };

  if (!location) return null;

  const displayedSessions = showAllSessions
    ? locationSessions
    : locationSessions.slice(0, 8);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-hidden
                   flex flex-col animate-slide-in-right outline-none"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl lg:text-2xl text-surface-900 truncate">
                {location}
              </h2>
              <p className="text-surface-500 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {stats.totalSessions} termina
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto text-brand-purple mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.totalSessions}</p>
                <p className="text-xs text-surface-500">Termina</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Baby className="w-6 h-6 mx-auto text-brand-gold mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.totalChildren}</p>
                <p className="text-xs text-surface-500">Ukupno djece</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.uniqueVolunteers}</p>
                <p className="text-xs text-surface-500">Jedinstvenih vol.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Baby className="w-6 h-6 mx-auto text-sky-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.avgChildrenPerSession}</p>
                <p className="text-xs text-surface-500">Pros. djece/termin</p>
              </CardContent>
            </Card>
          </div>

          {/* Averages Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-surface-900 mb-3">Prosjeci</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-surface-500 text-sm">Djece po terminu</p>
                  <p className="font-bold text-2xl text-brand-gold">{stats.avgChildrenPerSession}</p>
                </div>
                <div>
                  <p className="text-surface-500 text-sm">Volontera po terminu</p>
                  <p className="font-bold text-2xl text-emerald-600">{stats.avgVolunteersPerSession}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Volunteers at this Location */}
          {topVolunteers.length > 0 && (
            <div>
              <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-purple" />
                Najčešći volonteri
              </h3>
              <div className="space-y-2">
                {topVolunteers.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => item.volunteer && onSelectVolunteer?.(item.volunteer)}
                    className={`flex items-center gap-3 p-3 bg-surface-50 rounded-lg ${
                      item.volunteer && onSelectVolunteer
                        ? 'cursor-pointer hover:bg-surface-100 transition-colors'
                        : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0 ? 'bg-brand-gold' :
                      i === 1 ? 'bg-gray-400' :
                      i === 2 ? 'bg-amber-700' :
                      'bg-surface-300'
                    }`}>
                      {i + 1}
                    </div>
                    <Avatar name={item.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-surface-900">{item.name}</span>
                      {item.volunteer && (
                        <p className="text-xs text-surface-500 truncate">
                          {item.volunteer.school}
                        </p>
                      )}
                    </div>
                    <Badge variant="purple">{item.count}x</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-purple" />
                Termini ({locationSessions.length})
              </h3>
            </div>

            {locationSessions.length === 0 ? (
              <p className="text-surface-400 text-sm">Nema termina na ovoj lokaciji</p>
            ) : (
              <div className="space-y-2">
                {displayedSessions.map((session, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectSession?.(session)}
                    className={`flex items-center justify-between p-3 bg-surface-50 rounded-lg ${
                      onSelectSession
                        ? 'cursor-pointer hover:bg-surface-100 transition-colors'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      <div>
                        <span className="font-medium text-surface-900">{session.date}</span>
                        {session.parsedDate && (
                          <p className="text-xs text-surface-500 capitalize">
                            {getDayOfWeek(session.parsedDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-surface-600">
                          <Baby className="w-3 h-3 inline mr-1" />
                          {session.childrenCount || '-'}
                        </p>
                        <p className="text-surface-500 text-xs">
                          <Users className="w-3 h-3 inline mr-1" />
                          {session.volunteerCount || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {locationSessions.length > 8 && (
              <button
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="w-full mt-3 py-2 text-sm text-brand-purple font-medium hover:text-brand-purple-dark transition-colors"
              >
                {showAllSessions
                  ? 'Prikaži manje'
                  : `Prikaži sve (${locationSessions.length})`}
              </button>
            )}
          </div>

          {/* View in TERMINI Button */}
          <button
            onClick={handleViewInTermini}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-medium">Pregledaj sve u TERMINI</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
