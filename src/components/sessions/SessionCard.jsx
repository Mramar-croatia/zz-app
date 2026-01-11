import { Calendar, CalendarX, Baby, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { LocationBadge } from '../Badge';
import VolunteerBadgeList from './VolunteerBadgeList';
import { isCancelledSession } from '../../utils/session';

export default function SessionCard({
  session,
  variant = 'desktop',
  isExpanded = false,
  onToggleExpand,
  onClick
}) {
  const isCancelled = isCancelledSession(session);
  const isMobile = variant === 'mobile';

  if (isMobile) {
    return (
      <Card
        hover
        onClick={onToggleExpand}
        className={isCancelled ? 'border-red-200 bg-red-50/30' : ''}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {isCancelled ? (
                  <CalendarX className="w-4 h-4 text-red-400" />
                ) : (
                  <Calendar className="w-4 h-4 text-surface-400" />
                )}
                <span className={`font-semibold ${isCancelled ? 'text-surface-500' : 'text-surface-900'}`}>
                  {session.date}
                </span>
                {isCancelled && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Otkazano
                  </span>
                )}
              </div>
              <div className="mt-1">
                <LocationBadge location={session.location} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isCancelled ? (
                <div className="text-center">
                  <p className="text-sm text-surface-400 italic">Nije održano</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-lg font-bold text-brand-gold">
                      {session.childrenCount || '-'}
                    </p>
                    <p className="text-xs text-surface-500">djece</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-brand-purple">
                      {session.volunteerCount || '-'}
                    </p>
                    <p className="text-xs text-surface-500">vol.</p>
                  </div>
                </>
              )}
              {!isCancelled && (
                isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-surface-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-surface-400" />
                )
              )}
            </div>
          </div>

          {isExpanded && !isCancelled && session.volunteersList?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-surface-100 animate-fade-in">
              <p className="text-sm font-medium text-surface-700 mb-2">
                Prisutni volonteri:
              </p>
              <VolunteerBadgeList
                volunteers={session.volunteersList}
                maxVisible={999}
                size="sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      hover
      onClick={onClick}
      className={`cursor-pointer ${isCancelled ? 'border-red-200 bg-red-50/30' : ''}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCancelled ? 'bg-red-100' : 'bg-brand-purple/10'
            }`}>
              {isCancelled ? (
                <CalendarX className="w-5 h-5 text-red-500" />
              ) : (
                <Calendar className="w-5 h-5 text-brand-purple" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${isCancelled ? 'text-surface-500' : 'text-surface-900'}`}>
                {session.date}
              </h3>
              <LocationBadge location={session.location} />
            </div>
          </div>
          {isCancelled && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Otkazano
            </span>
          )}
        </div>

        {isCancelled ? (
          <div className="text-center py-4 text-surface-400">
            <CalendarX className="w-8 h-8 mx-auto mb-2 text-red-300" />
            <p className="text-sm italic">Termin se nije održao</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <Baby className="w-5 h-5 mx-auto text-brand-gold mb-1" />
                <p className="text-xl font-bold text-brand-gold">
                  {session.childrenCount || '-'}
                </p>
                <p className="text-xs text-surface-500">djece</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto text-brand-purple mb-1" />
                <p className="text-xl font-bold text-brand-purple">
                  {session.volunteerCount || '-'}
                </p>
                <p className="text-xs text-surface-500">volontera</p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-100">
              <p className="text-xs text-surface-500 mb-2">
                Prisutni volonteri:
              </p>
              <VolunteerBadgeList
                volunteers={session.volunteersList}
                maxVisible={3}
                size="sm"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
