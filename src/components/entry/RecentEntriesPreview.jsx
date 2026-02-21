import { History, MapPin, Users, Baby, ChevronRight, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge, LocationBadge } from '../Badge';
import { formatDateShort, formatDateFull } from '../../utils/croatian';

export default function RecentEntriesPreview({
  sessions = [],
  onSelectSession,
  limit = 5,
}) {
  // Get recent sessions sorted by date
  const recentSessions = sessions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  if (recentSessions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <History className="w-6 h-6 text-surface-800" />
          Nedavni unosi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-surface-100">
          {recentSessions.map((session, index) => {
            const volunteerCount = session.volunteerCount || session.volunteers?.length || 0;
            const isToday = session.date === new Date().toISOString().split('T')[0];
            const isYesterday = (() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              return session.date === yesterday.toISOString().split('T')[0];
            })();

            return (
              <div
                key={`${session.date}-${session.location}-${index}`}
                onClick={() => onSelectSession?.(session)}
                className={`
                  flex items-center gap-4 p-4 transition-colors
                  ${onSelectSession ? 'cursor-pointer hover:bg-surface-50' : ''}
                `}
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 w-16 text-center">
                  {isToday ? (
                    <Badge variant="success" className="w-full justify-center">
                      Danas
                    </Badge>
                  ) : isYesterday ? (
                    <Badge variant="purple" className="w-full justify-center">
                      Jučer
                    </Badge>
                  ) : (
                    <div className="text-sm">
                      <p className="font-semibold text-surface-900">
                        {formatDateShort(session.date)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <LocationBadge location={session.location} />
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-surface-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {volunteerCount} volonter{volunteerCount === 1 ? '' : 'a'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Baby className="w-3.5 h-3.5" />
                      {session.childrenCount || 0} djece
                    </span>
                  </div>
                </div>

                {/* Volunteers Preview */}
                <div className="hidden sm:block flex-shrink-0 max-w-[200px]">
                  {session.volunteers?.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end">
                      {session.volunteers.slice(0, 3).map((name, i) => (
                        <span
                          key={i}
                          className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 truncate max-w-[80px]"
                        >
                          {name.split(' ')[0]}
                        </span>
                      ))}
                      {session.volunteers.length > 3 && (
                        <span className="text-xs text-surface-400">
                          +{session.volunteers.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {onSelectSession && (
                  <ChevronRight className="w-5 h-5 text-surface-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
