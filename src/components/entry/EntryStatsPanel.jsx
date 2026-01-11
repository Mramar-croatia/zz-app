import { CalendarPlus, CalendarCheck, Baby, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { formatDateShort } from '../../utils/croatian';

export default function EntryStatsPanel({
  todayEntries = [],
  thisWeekEntries = [],
  sessions = []
}) {
  // Calculate stats
  const todayCount = todayEntries.length;
  const weekCount = thisWeekEntries.length;

  const todayChildren = todayEntries.reduce((sum, s) => sum + (s.childrenCount || 0), 0);
  const weekChildren = thisWeekEntries.reduce((sum, s) => sum + (s.childrenCount || 0), 0);

  const todayVolunteers = todayEntries.reduce((sum, s) => sum + (s.volunteerCount || s.volunteers?.length || 0), 0);
  const weekVolunteers = thisWeekEntries.reduce((sum, s) => sum + (s.volunteerCount || s.volunteers?.length || 0), 0);

  // Get last entry info
  const lastEntry = sessions.length > 0
    ? sessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Today's Entries */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 mb-3">
              <CalendarPlus className="w-6 h-6 text-brand-purple" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-brand-purple">
              {todayCount}
            </p>
            <p className="text-sm text-surface-500 mt-1">Danas uneseno</p>
            {todayCount > 0 && (
              <p className="text-xs text-surface-400 mt-0.5">
                {todayChildren} djece
              </p>
            )}
          </div>

          {/* This Week */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-gold/10 mb-3">
              <CalendarCheck className="w-6 h-6 text-brand-gold" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-brand-gold">
              {weekCount}
            </p>
            <p className="text-sm text-surface-500 mt-1">Ovaj tjedan</p>
            {weekCount > 0 && (
              <p className="text-xs text-surface-400 mt-0.5">
                {weekChildren} djece
              </p>
            )}
          </div>

          {/* Week's Children */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
              <Baby className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-emerald-600">
              {weekChildren}
            </p>
            <p className="text-sm text-surface-500 mt-1">Djece ovaj tjedan</p>
            {weekCount > 0 && (
              <p className="text-xs text-surface-400 mt-0.5">
                ~{(weekChildren / weekCount).toFixed(0)} po terminu
              </p>
            )}
          </div>

          {/* Last Entry */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            {lastEntry ? (
              <>
                <p className="text-lg lg:text-xl font-bold text-indigo-600">
                  {formatDateShort(lastEntry.date)}
                </p>
                <p className="text-sm text-surface-500 mt-1">Zadnji unos</p>
                <p className="text-xs text-surface-400 mt-0.5 truncate max-w-[120px] mx-auto">
                  {lastEntry.location}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg lg:text-xl font-bold text-indigo-600">
                  -
                </p>
                <p className="text-sm text-surface-500 mt-1">Zadnji unos</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  Nema unosa
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
