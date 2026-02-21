import { CalendarCheck, Baby, Users, CalendarX } from 'lucide-react';
import { Card, CardContent } from '../Card';

export default function SessionStatsPanel({ totals, sessionCounts, statusFilter }) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
              <CalendarCheck className="w-6 h-6 text-surface-700" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-900">
              {totals.sessions}
            </p>
            <p className="text-sm text-surface-500 mt-1">Aktivnih termina</p>
            {sessionCounts.active !== totals.sessions && (
              <p className="text-xs text-surface-400 mt-0.5">
                od {sessionCounts.active} ukupno aktivnih
              </p>
            )}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
              <Baby className="w-6 h-6 text-surface-600" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-700">
              {totals.children}
            </p>
            <p className="text-sm text-surface-500 mt-1">Djece</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
              <Users className="w-6 h-6 text-surface-700" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold tabular-nums text-surface-900">
              {totals.volunteers}
            </p>
            <p className="text-sm text-surface-500 mt-1">Volontera</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-surface-100 border border-surface-200 mb-3">
              <CalendarX className="w-6 h-6 text-[#991B1B]" />
            </div>
            <p className="text-3xl lg:text-4xl font-bold tabular-nums text-[#991B1B]">
              {sessionCounts.cancelled}
            </p>
            <p className="text-sm text-surface-500 mt-1">Otkazanih</p>
            {totals.cancelled > 0 && statusFilter === 'all' && (
              <p className="text-xs text-surface-400 mt-0.5">
                {totals.cancelled} prikazano
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
