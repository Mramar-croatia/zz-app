import { useEffect, useRef, useMemo, useState } from 'react';
import {
  X,
  Phone,
  GraduationCap,
  MapPin,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Check,
  MessageCircle,
  Download,
  Printer,
  MoreVertical,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge, LocationBadge } from './Badge';
import { Card, CardContent } from './Card';
import AttendanceCalendar, { AttendanceHeatmap } from './AttendanceCalendar';

// Activity status helper - synced with Baza.jsx logic
function getActivityStatus(volunteer, sessions) {
  if (!volunteer || !sessions) {
    return { status: 'inactive', label: 'Neaktivan', color: 'amber', dotColor: 'bg-amber-500' };
  }

  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const volunteerSessions = sessions.filter(s => s.volunteersList?.includes(volunteer.name));
  const hoursLast2Months = volunteerSessions
    .filter(s => s.parsedDate && s.parsedDate >= twoMonthsAgo)
    .reduce((sum, s) => sum + (s.hours || 0), 0);

  const totalHours = volunteer.hours || 0;

  if (totalHours >= 10 || hoursLast2Months >= 5) {
    return { status: 'active', label: 'Aktivan', color: 'emerald', dotColor: 'bg-emerald-500' };
  }

  if (totalHours >= 5 && hoursLast2Months < 5) {
    return { status: 'dormant', label: 'Uspavan', color: 'red', dotColor: 'bg-red-500' };
  }

  return { status: 'inactive', label: 'Neaktivan', color: 'amber', dotColor: 'bg-amber-500' };
}

// Format date for display
function formatDate(date) {
  if (!date) return '-';
  return date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Relative time helper
function getRelativeTime(date) {
  if (!date) return 'Nikad';

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Danas';
  if (diffDays === 1) return 'Jučer';
  if (diffDays < 7) return `Prije ${diffDays} dana`;
  if (diffDays < 30) return `Prije ${Math.floor(diffDays / 7)} tjedana`;
  if (diffDays < 365) return `Prije ${Math.floor(diffDays / 30)} mjeseci`;
  return `Prije ${Math.floor(diffDays / 365)} godina`;
}

// Avatar component with initials
function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const colors = [
    'bg-brand-purple',
    'bg-brand-gold',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-violet-500',
  ];
  const colorIndex = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length || 0;

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}

export { Avatar };

// Goal tier badge component
function GoalBadge({ hours, goal, label, achieved }) {
  return (
    <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${
      achieved
        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200'
        : 'bg-surface-50 border border-surface-200 opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        achieved ? 'bg-amber-400 text-white' : 'bg-surface-200 text-surface-400'
      }`}>
        {achieved ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{goal}</span>}
      </div>
      <span className={`text-xs font-medium mt-1 ${achieved ? 'text-amber-700' : 'text-surface-400'}`}>
        {label}
      </span>
    </div>
  );
}

// Achievement badge component
function AchievementBadge({ icon: Icon, label, achieved, description }) {
  if (!achieved) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg">
      <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-violet-700">{label}</p>
        {description && <p className="text-xs text-violet-500">{description}</p>}
      </div>
    </div>
  );
}

export default function VolunteerDetailDrawer({
  volunteer,
  sessions = [],
  allVolunteers = [],
  onClose,
  onSelectVolunteer,
  onSelectSession,
  hoursGoal = 10,
  hoursGoals = { basic: 10, bronze: 20, silver: 30, gold: 40 },
}) {
  const drawerRef = useRef(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get volunteer's attendance history
  const volunteerSessions = useMemo(() => {
    return sessions
      .filter(s => s.volunteersList?.includes(volunteer?.name))
      .sort((a, b) => (b.parsedDate || 0) - (a.parsedDate || 0));
  }, [sessions, volunteer?.name]);

  const lastActiveDate = volunteerSessions[0]?.parsedDate || null;
  const firstSessionDate = volunteerSessions[volunteerSessions.length - 1]?.parsedDate || null;
  const activityStatus = getActivityStatus(volunteer, sessions);

  // Calculate activity trend
  const activityTrend = useMemo(() => {
    if (volunteerSessions.length < 2) return 'neutral';

    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const lastMonthSessions = volunteerSessions.filter(s => s.parsedDate && s.parsedDate >= oneMonthAgo).length;
    const prevMonthSessions = volunteerSessions.filter(s => s.parsedDate && s.parsedDate >= twoMonthsAgo && s.parsedDate < oneMonthAgo).length;

    if (lastMonthSessions > prevMonthSessions) return 'up';
    if (lastMonthSessions < prevMonthSessions) return 'down';
    return 'neutral';
  }, [volunteerSessions]);

  // Personal stats
  const personalStats = useMemo(() => {
    if (!volunteerSessions.length) return null;

    const locationCounts = {};
    volunteerSessions.forEach(s => {
      locationCounts[s.location] = (locationCounts[s.location] || 0) + 1;
    });

    const favoriteLocation = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const now = new Date();
    const monthsActive = firstSessionDate
      ? Math.max(1, Math.floor((now - firstSessionDate) / (1000 * 60 * 60 * 24 * 30)))
      : 1;

    return {
      favoriteLocation: favoriteLocation ? { name: favoriteLocation[0], count: favoriteLocation[1] } : null,
      totalLocations: Object.keys(locationCounts).length,
      avgSessionsPerMonth: Math.round((volunteerSessions.length / monthsActive) * 10) / 10,
      monthsActive,
    };
  }, [volunteerSessions, firstSessionDate]);

  // Calculate achievements
  const achievements = useMemo(() => {
    const hours = volunteer?.hours || 0;
    const monthsActive = personalStats?.monthsActive || 0;

    return {
      firstSession: volunteerSessions.length > 0,
      tenHours: hours >= 10,
      twentyHours: hours >= 20,
      thirtyHours: hours >= 30,
      fortyHours: hours >= 40,
      veteran: monthsActive >= 12,
      consistent: monthsActive >= 3 && activityStatus.status === 'active',
    };
  }, [volunteer, volunteerSessions, personalStats, activityStatus]);

  // Next milestone calculation
  const nextMilestone = useMemo(() => {
    const hours = volunteer?.hours || 0;
    const goals = [10, 20, 30, 40];

    for (const goal of goals) {
      if (hours < goal) {
        return { goal, remaining: goal - hours };
      }
    }
    return null;
  }, [volunteer]);

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

  const copyPhone = async () => {
    if (volunteer?.phone) {
      await navigator.clipboard.writeText(volunteer.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const exportToCSV = () => {
    const headers = ['Datum', 'Lokacija', 'Sati'];
    const rows = volunteerSessions.map(s => [s.date, s.location, s.hours || '']);

    const csvContent = [
      `Volonter: ${volunteer.name}`,
      `Škola: ${volunteer.school}`,
      `Ukupno sati: ${volunteer.hours || 0}`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${volunteer.name.replace(/\s+/g, '_')}_povijest.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Volonter - ${volunteer.name}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #4C1D95; margin-bottom: 8px; }
            .subtitle { color: #71717A; margin-bottom: 24px; }
            .section { margin-bottom: 24px; }
            .section-title { font-weight: 600; margin-bottom: 12px; border-bottom: 1px solid #E4E4E7; padding-bottom: 8px; }
            .stat { display: inline-block; margin-right: 32px; margin-bottom: 12px; }
            .stat-value { font-size: 24px; font-weight: 700; color: #4C1D95; }
            .stat-label { font-size: 12px; color: #71717A; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { width: 120px; color: #71717A; }
            .info-value { font-weight: 500; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #F4F4F5; margin-right: 8px; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E4E4E7; font-size: 12px; color: #A1A1AA; }
          </style>
        </head>
        <body>
          <h1>${volunteer.name}</h1>
          <p class="subtitle">${volunteer.school} - ${volunteer.grade}. razred</p>
          <div class="section">
            <div class="stat">
              <div class="stat-value">${volunteer.hours || 0}</div>
              <div class="stat-label">Volonterskih sati</div>
            </div>
            <div class="stat">
              <div class="stat-value">${volunteerSessions.length}</div>
              <div class="stat-label">Termina</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Kontakt</div>
            <div class="info-row">
              <span class="info-label">Telefon:</span>
              <span class="info-value">${volunteer.phone || '-'}</span>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Lokacije</div>
            ${volunteer.locations?.map(loc => `<span class="badge">${loc}</span>`).join('') || '-'}
          </div>
          <div class="section">
            <div class="section-title">Aktivnost</div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${activityStatus.label}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Zadnje aktivan:</span>
              <span class="info-value">${formatDate(lastActiveDate)}</span>
            </div>
          </div>
          <div class="footer">
            Generirano: ${new Date().toLocaleDateString('hr-HR')} - Zlatni Zmaj Volonteri
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setShowMenu(false);
  };

  if (!volunteer) return null;

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
            <Avatar name={volunteer.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl lg:text-2xl text-surface-900 truncate">
                {volunteer.name}
              </h2>
              <p className="text-surface-500 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {volunteer.school} • {volunteer.grade}. razred
              </p>
            </div>
            <div className="flex items-center gap-1">
              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-surface-500" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-20">
                      <button
                        onClick={handlePrint}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 text-sm text-surface-700"
                      >
                        <Printer className="w-4 h-4 text-surface-400" />
                        Ispiši profil
                      </button>
                      <button
                        onClick={exportToCSV}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 text-sm text-surface-700"
                      >
                        <Download className="w-4 h-4 text-surface-400" />
                        Izvezi CSV
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Activity Status Card */}
          <Card className={`border-l-4 ${
            activityStatus.status === 'active' ? 'border-l-emerald-500 bg-emerald-50/50' :
            activityStatus.status === 'dormant' ? 'border-l-red-500 bg-red-50/50' :
            'border-l-amber-500 bg-amber-50/50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${activityStatus.dotColor}`} />
                  <div>
                    <p className={`font-semibold ${
                      activityStatus.status === 'active' ? 'text-emerald-700' :
                      activityStatus.status === 'dormant' ? 'text-red-700' :
                      'text-amber-700'
                    }`}>
                      {activityStatus.label}
                    </p>
                    <p className="text-sm text-surface-500">
                      Zadnje aktivan: {getRelativeTime(lastActiveDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activityTrend === 'up' && (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      <span>Raste</span>
                    </div>
                  )}
                  {activityTrend === 'down' && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <TrendingDown className="w-4 h-4" />
                      <span>Pada</span>
                    </div>
                  )}
                  {activityTrend === 'neutral' && (
                    <div className="flex items-center gap-1 text-surface-500 text-sm font-medium">
                      <Minus className="w-4 h-4" />
                      <span>Stabilno</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto text-brand-purple mb-1" />
                <p className="text-2xl font-bold text-surface-900">{volunteer.hours || 0}</p>
                <p className="text-xs text-surface-500">Sati</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto text-brand-gold mb-1" />
                <p className="text-2xl font-bold text-surface-900">{volunteerSessions.length}</p>
                <p className="text-xs text-surface-500">Termina</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <p className="text-2xl font-bold text-surface-900">{personalStats?.totalLocations || 0}</p>
                <p className="text-xs text-surface-500">Lokacija</p>
              </CardContent>
            </Card>
          </div>

          {/* Goal Tiers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Ciljevi sati
              </h3>
              {nextMilestone && (
                <span className="text-sm text-surface-500">
                  Još <span className="font-semibold text-brand-purple">{nextMilestone.remaining}h</span> do {nextMilestone.goal}h
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <GoalBadge hours={volunteer?.hours || 0} goal={10} label="10 sati" achieved={(volunteer?.hours || 0) >= 10} />
              <GoalBadge hours={volunteer?.hours || 0} goal={20} label="20 sati" achieved={(volunteer?.hours || 0) >= 20} />
              <GoalBadge hours={volunteer?.hours || 0} goal={30} label="30 sati" achieved={(volunteer?.hours || 0) >= 30} />
              <GoalBadge hours={volunteer?.hours || 0} goal={40} label="40 sati" achieved={(volunteer?.hours || 0) >= 40} />
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-surface-900 mb-3">Brze akcije</h3>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${volunteer.phone}`}
                className="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                <Phone className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Nazovi</span>
              </a>
              <a
                href={`https://wa.me/385${volunteer.phone?.replace(/^0/, '').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-700">WhatsApp</span>
              </a>
              <button
                onClick={copyPhone}
                className="flex flex-col items-center gap-2 p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-6 h-6 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Kopirano!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6 text-surface-600" />
                    <span className="text-sm font-medium text-surface-700">Kopiraj broj</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-sm text-surface-500 mt-2 font-mono">{volunteer.phone || '-'}</p>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Lokacije
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.locations?.length > 0 ? (
                volunteer.locations.map((loc, i) => (
                  <LocationBadge key={i} location={loc} />
                ))
              ) : (
                <span className="text-surface-400">Nema dodijeljenih lokacija</span>
              )}
            </div>
            {personalStats?.favoriteLocation && (
              <p className="text-sm text-surface-500 mt-2">
                Najčešće na <span className="font-medium">{personalStats.favoriteLocation.name}</span> ({personalStats.favoriteLocation.count} puta)
              </p>
            )}
          </div>

          {/* Achievements */}
          {(achievements.veteran || achievements.consistent || achievements.fortyHours) && (
            <div>
              <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-violet-500" />
                Postignuća
              </h3>
              <div className="space-y-2">
                <AchievementBadge
                  icon={Star}
                  label="Zlatni volonter"
                  achieved={achievements.fortyHours}
                  description="Ostvareno 40+ sati"
                />
                <AchievementBadge
                  icon={Award}
                  label="Veteran"
                  achieved={achievements.veteran}
                  description="Aktivan 1+ godinu"
                />
                <AchievementBadge
                  icon={TrendingUp}
                  label="Redovit"
                  achieved={achievements.consistent}
                  description="Aktivan 3+ mjeseca"
                />
              </div>
            </div>
          )}

          {/* Calendar Section - Collapsible */}
          <div>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full flex items-center justify-between p-3 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors"
            >
              <span className="font-semibold text-surface-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-purple" />
                Kalendar dolazaka
              </span>
              {showCalendar ? (
                <ChevronUp className="w-5 h-5 text-surface-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-surface-400" />
              )}
            </button>
            {showCalendar && (
              <div className="mt-3 space-y-4">
                <AttendanceCalendar sessions={sessions} volunteerName={volunteer.name} />
                <AttendanceHeatmap sessions={sessions} volunteerName={volunteer.name} />
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div>
            <h3 className="font-semibold text-surface-900 mb-3">
              Nedavni dolasci
            </h3>
            {volunteerSessions.length === 0 ? (
              <p className="text-surface-400 text-sm">Nema zabilježenih dolazaka</p>
            ) : (
              <>
                <div className="space-y-2">
                  {volunteerSessions.slice(0, showAllSessions ? undefined : 5).map((session, i) => (
                    <div
                      key={i}
                      onClick={() => onSelectSession?.(session)}
                      className={`flex items-center justify-between p-3 bg-surface-50 rounded-lg ${
                        onSelectSession ? 'cursor-pointer hover:bg-surface-100 transition-colors' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-surface-400" />
                        <span className="font-medium text-surface-900">{session.date}</span>
                      </div>
                      <LocationBadge location={session.location} />
                    </div>
                  ))}
                </div>
                {volunteerSessions.length > 5 && (
                  <button
                    onClick={() => setShowAllSessions(!showAllSessions)}
                    className="w-full mt-2 py-2 text-sm text-brand-purple font-medium hover:text-brand-purple-dark transition-colors"
                  >
                    {showAllSessions ? 'Prikaži manje' : `Prikaži sve (${volunteerSessions.length})`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Activity Timeline Summary */}
          {firstSessionDate && (
            <div className="p-4 bg-surface-50 rounded-xl">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-surface-500">Volontira od</p>
                  <p className="font-medium text-surface-900">{formatDate(firstSessionDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-surface-500">Prosječno mjesečno</p>
                  <p className="font-medium text-surface-900">{personalStats?.avgSessionsPerMonth || 0} termina</p>
                </div>
              </div>
            </div>
          )}
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
