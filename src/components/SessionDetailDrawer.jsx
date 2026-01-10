import { useEffect, useRef, useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Baby,
  Clock,
  Copy,
  Check,
  Download,
  Printer,
  MoreVertical,
} from 'lucide-react';
import { Badge, LocationBadge } from './Badge';
import { Card, CardContent } from './Card';
import { Avatar } from './VolunteerDetailDrawer';

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

export default function SessionDetailDrawer({
  session,
  allVolunteers = [],
  onClose,
  onSelectVolunteer,
}) {
  const drawerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

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

  const copyVolunteerList = async () => {
    if (session?.volunteersList?.length > 0) {
      await navigator.clipboard.writeText(session.volunteersList.join('\n'));
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    }
  };

  const exportToCSV = () => {
    const headers = ['Ime volontera'];
    const rows = session.volunteersList?.map(name => [name]) || [];

    const csvContent = [
      `Termin: ${session.date}`,
      `Lokacija: ${session.location}`,
      `Broj djece: ${session.childrenCount || '-'}`,
      `Broj volontera: ${session.volunteerCount || '-'}`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `termin_${session.date?.replace(/\./g, '-')}_${session.location}.csv`;
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
          <title>Termin - ${session.date}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #4C1D95; margin-bottom: 8px; }
            .subtitle { color: #71717A; margin-bottom: 24px; }
            .section { margin-bottom: 24px; }
            .section-title { font-weight: 600; margin-bottom: 12px; border-bottom: 1px solid #E4E4E7; padding-bottom: 8px; }
            .stat { display: inline-block; margin-right: 32px; margin-bottom: 12px; }
            .stat-value { font-size: 24px; font-weight: 700; color: #4C1D95; }
            .stat-label { font-size: 12px; color: #71717A; }
            .volunteer-list { list-style: none; padding: 0; margin: 0; }
            .volunteer-list li { padding: 8px 0; border-bottom: 1px solid #F4F4F5; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E4E4E7; font-size: 12px; color: #A1A1AA; }
          </style>
        </head>
        <body>
          <h1>${session.date}</h1>
          <p class="subtitle">${session.location}</p>
          <div class="section">
            <div class="stat">
              <div class="stat-value">${session.childrenCount || '-'}</div>
              <div class="stat-label">Djece</div>
            </div>
            <div class="stat">
              <div class="stat-value">${session.volunteerCount || '-'}</div>
              <div class="stat-label">Volontera</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Prisutni volonteri</div>
            <ul class="volunteer-list">
              ${session.volunteersList?.map(name => `<li>${name}</li>`).join('') || '<li>-</li>'}
            </ul>
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

  // Find volunteer objects for the session
  const getVolunteerData = (name) => {
    return allVolunteers.find(v => v.name === name);
  };

  if (!session) return null;

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
              <Calendar className="w-7 h-7 text-brand-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl lg:text-2xl text-surface-900">
                {session.date}
              </h2>
              <p className="text-surface-500 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {session.location}
                {session.parsedDate && (
                  <span className="text-surface-400">
                    • {getDayOfWeek(session.parsedDate)}
                  </span>
                )}
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
                        Ispiši termin
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Baby className="w-6 h-6 mx-auto text-brand-gold mb-1" />
                <p className="text-2xl font-bold text-surface-900">{session.childrenCount || '-'}</p>
                <p className="text-xs text-surface-500">Djece</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-brand-purple mb-1" />
                <p className="text-2xl font-bold text-surface-900">{session.volunteerCount || '-'}</p>
                <p className="text-xs text-surface-500">Volontera</p>
              </CardContent>
            </Card>
          </div>

          {/* Session Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Lokacija</span>
                  <LocationBadge location={session.location} />
                </div>
                {session.parsedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">Dan</span>
                    <span className="font-medium text-surface-900 capitalize">
                      {getDayOfWeek(session.parsedDate)}
                    </span>
                  </div>
                )}
                {session.hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">Trajanje</span>
                    <span className="font-medium text-surface-900">{session.hours} sati</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Volunteers List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-purple" />
                Prisutni volonteri ({session.volunteersList?.length || 0})
              </h3>
              {session.volunteersList?.length > 0 && (
                <button
                  onClick={copyVolunteerList}
                  className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
                >
                  {copiedList ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">Kopirano!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Kopiraj listu</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {session.volunteersList?.length === 0 ? (
              <p className="text-surface-400 text-sm">Nema zabilježenih volontera</p>
            ) : (
              <div className="space-y-2">
                {session.volunteersList?.map((name, i) => {
                  const volunteerData = getVolunteerData(name);

                  return (
                    <div
                      key={i}
                      onClick={() => volunteerData && onSelectVolunteer?.(volunteerData)}
                      className={`flex items-center gap-3 p-3 bg-surface-50 rounded-lg ${
                        volunteerData && onSelectVolunteer
                          ? 'cursor-pointer hover:bg-surface-100 transition-colors'
                          : ''
                      }`}
                    >
                      <Avatar name={name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-surface-900">{name}</span>
                        {volunteerData && (
                          <p className="text-xs text-surface-500 truncate">
                            {volunteerData.school} • {volunteerData.grade}. razred
                          </p>
                        )}
                      </div>
                      {volunteerData && (
                        <Badge variant="purple">{volunteerData.hours || 0}h</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Additional Notes - placeholder for future */}
          {session.notes && (
            <div>
              <h3 className="font-semibold text-surface-900 mb-3">Napomene</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="text-surface-600 text-sm">{session.notes}</p>
                </CardContent>
              </Card>
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
