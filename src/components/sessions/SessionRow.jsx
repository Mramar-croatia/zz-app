import { Calendar, CalendarX } from 'lucide-react';
import { TableRow, TableCell } from '../Table';
import { LocationBadge } from '../Badge';
import VolunteerBadgeList from './VolunteerBadgeList';
import { isCancelledSession } from '../../utils/session';

export default function SessionRow({ session, onClick }) {
  const isCancelled = isCancelledSession(session);

  return (
    <TableRow
      className={`cursor-pointer ${isCancelled ? 'bg-[#FFF1F2]/50' : ''}`}
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
              <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#FFF1F2] text-[#7F1D1D]">
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
        <span className={`font-semibold text-lg ${isCancelled ? 'text-surface-400' : 'text-surface-700'}`}>
          {session.childrenCount || '-'}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span className={`font-semibold text-lg ${isCancelled ? 'text-surface-400' : 'text-surface-900'}`}>
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
