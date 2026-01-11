import { useEffect, useRef, useMemo, useState } from 'react';
import {
  X,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
} from 'lucide-react';
import { Badge } from './Badge';
import { Card, CardContent } from './Card';
import { Avatar } from './VolunteerDetailDrawer';
import { getActivityStatus } from '../utils/volunteer';

export default function SchoolDetailDrawer({
  school,
  volunteers = [],
  sessions = [],
  onClose,
  onSelectVolunteer,
  onNavigate,
}) {
  const drawerRef = useRef(null);
  const [showAllVolunteers, setShowAllVolunteers] = useState(false);

  // Get all volunteers from this school
  const schoolVolunteers = useMemo(() => {
    if (!school || !volunteers.length) return [];
    return volunteers
      .filter(v => v.school === school)
      .sort((a, b) => (b.hours || 0) - (a.hours || 0));
  }, [school, volunteers]);

  // Calculate school statistics
  const stats = useMemo(() => {
    if (!schoolVolunteers.length) {
      return {
        totalVolunteers: 0,
        totalHours: 0,
        totalSessions: 0,
        activeCount: 0,
        inactiveCount: 0,
        dormantCount: 0,
        avgHoursPerVolunteer: 0,
      };
    }

    const totalHours = schoolVolunteers.reduce((sum, v) => sum + (v.hours || 0), 0);

    // Count activity statuses
    let activeCount = 0;
    let inactiveCount = 0;
    let dormantCount = 0;

    schoolVolunteers.forEach(v => {
      const status = getActivityStatus(v, sessions);
      if (status.status === 'active') activeCount++;
      else if (status.status === 'inactive') inactiveCount++;
      else dormantCount++;
    });

    // Count unique sessions where school volunteers participated
    const volunteerNames = new Set(schoolVolunteers.map(v => v.name));
    const schoolSessions = sessions.filter(s =>
      s.volunteersList?.some(name => volunteerNames.has(name))
    );

    return {
      totalVolunteers: schoolVolunteers.length,
      totalHours,
      totalSessions: schoolSessions.length,
      activeCount,
      inactiveCount,
      dormantCount,
      avgHoursPerVolunteer: schoolVolunteers.length > 0
        ? Math.round(totalHours / schoolVolunteers.length * 10) / 10
        : 0,
    };
  }, [schoolVolunteers, sessions]);

  // Activity percentage
  const activePercentage = stats.totalVolunteers > 0
    ? Math.round((stats.activeCount / stats.totalVolunteers) * 100)
    : 0;

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

  const handleViewInBaza = () => {
    onNavigate?.('baza');
    onClose();
  };

  if (!school) return null;

  const displayedVolunteers = showAllVolunteers
    ? schoolVolunteers
    : schoolVolunteers.slice(0, 8);

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
            <div className="w-14 h-14 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-brand-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl lg:text-2xl text-surface-900 truncate">
                {school}
              </h2>
              <p className="text-surface-500 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {stats.totalVolunteers} volontera
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
                <Users className="w-6 h-6 mx-auto text-brand-purple mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.totalVolunteers}</p>
                <p className="text-xs text-surface-500">Volontera</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.totalHours}</p>
                <p className="text-xs text-surface-500">Ukupno sati</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{stats.totalSessions}</p>
                <p className="text-xs text-surface-500">Termina</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="w-6 h-6 mx-auto text-sky-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{activePercentage}%</p>
                <p className="text-xs text-surface-500">Aktivnih</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-surface-900 mb-3">Status volontera</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-surface-600">
                    Aktivni: <span className="font-semibold">{stats.activeCount}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-sm text-surface-600">
                    Neaktivni: <span className="font-semibold">{stats.inactiveCount}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-surface-600">
                    Uspavani: <span className="font-semibold">{stats.dormantCount}</span>
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-surface-100 rounded-full overflow-hidden flex">
                {stats.totalVolunteers > 0 && (
                  <>
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(stats.activeCount / stats.totalVolunteers) * 100}%` }}
                    />
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(stats.inactiveCount / stats.totalVolunteers) * 100}%` }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(stats.dormantCount / stats.totalVolunteers) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Average Stats */}
          <div className="bg-surface-50 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-surface-500">Prosječno po volonteru</p>
                <p className="font-medium text-surface-900">{stats.avgHoursPerVolunteer} sati</p>
              </div>
              <div className="text-right">
                <p className="text-surface-500">Ukupni doprinos</p>
                <p className="font-medium text-surface-900">{stats.totalHours} sati</p>
              </div>
            </div>
          </div>

          {/* Volunteers List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-purple" />
                Volonteri ({schoolVolunteers.length})
              </h3>
            </div>

            {schoolVolunteers.length === 0 ? (
              <p className="text-surface-400 text-sm">Nema volontera iz ove škole</p>
            ) : (
              <div className="space-y-2">
                {displayedVolunteers.map((volunteer, i) => {
                  const status = getActivityStatus(volunteer, sessions);
                  return (
                    <div
                      key={i}
                      onClick={() => onSelectVolunteer?.(volunteer)}
                      className={`flex items-center gap-3 p-3 bg-surface-50 rounded-lg ${
                        onSelectVolunteer
                          ? 'cursor-pointer hover:bg-surface-100 transition-colors'
                          : ''
                      }`}
                    >
                      <Avatar name={volunteer.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-surface-900">{volunteer.name}</span>
                        <p className="text-xs text-surface-500 truncate">
                          {volunteer.grade}. razred
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status.dotColor}`}></span>
                        <Badge variant="purple">{volunteer.hours || 0}h</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {schoolVolunteers.length > 8 && (
              <button
                onClick={() => setShowAllVolunteers(!showAllVolunteers)}
                className="w-full mt-3 py-2 text-sm text-brand-purple font-medium hover:text-brand-purple-dark transition-colors"
              >
                {showAllVolunteers
                  ? 'Prikaži manje'
                  : `Prikaži sve (${schoolVolunteers.length})`}
              </button>
            )}
          </div>

          {/* View in BAZA Button */}
          <button
            onClick={handleViewInBaza}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-medium">Pregledaj sve u BAZA</span>
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
