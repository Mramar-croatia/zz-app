import { Calendar, CalendarX } from 'lucide-react';
import { TableRow, TableCell } from '../Table';
import { LocationBadge } from '../Badge';
import VolunteerBadgeList from './VolunteerBadgeList';
import { isCancelledSession } from '../../utils/session';

export default function SessionRow({ session, onClick }) {
  const isCancelled = isCancelledSession(session);

  return (
    <TableRow
      className={`cursor-pointer ${isCancelled ? 'bg-red-50/50' : ''}`}
      onClick={onClick}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          {isCancelled ? (
            <CalendarX className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
          ) : (
            <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-surface-400" />
          )}
          <div>
            <span className={`font-medium text-lg ${isCancelled ? 'text-surface-500' : 'text-surface-900'}`}>
              {session.date}
            </span>
            {isCancelled && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Otkazano
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <LocationBadge location={session.location} />
      </TableCell>
      <TableCell className="text-center">
        <span className={`font-semibold text-lg ${isCancelled ? 'text-surface-400' : 'text-brand-gold'}`}>
          {session.childrenCount || '-'}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span className={`font-semibold text-lg ${isCancelled ? 'text-surface-400' : 'text-brand-purple'}`}>
          {session.volunteerCount || '-'}
        </span>
      </TableCell>
      <TableCell>
        <div className="max-w-xl">
          {isCancelled ? (
            <span className="text-surface-400 italic">Nije se održalo</span>
          ) : (
            <VolunteerBadgeList volunteers={session.volunteersList} maxVisible={5} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
