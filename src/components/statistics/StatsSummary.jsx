import { Users, Clock, Baby, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '../Card';

export default function StatsSummary({ summary, sessionCounts, onNavigate }) {
  const stats = [
    {
      label: 'Volontera',
      value: summary.totalVolunteers,
      icon: Users,
      color: 'text-brand-purple',
      bgColor: 'bg-brand-purple/10',
      onClick: () => onNavigate?.('baza'),
      subtext: summary.activeVolunteers < summary.totalVolunteers
        ? `${summary.activeVolunteers} aktivnih`
        : null,
    },
    {
      label: 'Sati',
      value: summary.totalHours,
      suffix: 'h',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Djece',
      value: summary.totalChildren,
      icon: Baby,
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10',
    },
    {
      label: 'Termina',
      value: summary.totalSessions,
      icon: CalendarDays,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      onClick: () => onNavigate?.('termini'),
      subtext: sessionCounts?.cancelled > 0
        ? `${sessionCounts.cancelled} otkazano`
        : null,
    },
  ];

  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map(({ label, value, suffix = '', icon: Icon, color, bgColor, onClick, subtext }) => (
            <div
              key={label}
              className={`text-center ${onClick ? 'cursor-pointer hover:bg-surface-50 rounded-xl p-2 -m-2 transition-colors' : ''}`}
              onClick={onClick}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${bgColor} mb-3`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <p className={`text-3xl lg:text-4xl font-bold ${color}`}>
                {value}{suffix}
              </p>
              <p className="text-sm text-surface-500 mt-1">{label}</p>
              {subtext && (
                <p className="text-xs text-surface-400 mt-0.5">{subtext}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
