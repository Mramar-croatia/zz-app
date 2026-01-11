import { Activity, Scale, Users, RefreshCw, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '../Card';

export default function SecondaryStats({ summary, retentionRate, sessionDurationStats }) {
  const activePercent = summary.totalVolunteers > 0
    ? Math.round((summary.activeVolunteers / summary.totalVolunteers) * 100)
    : 0;

  const stats = [
    {
      label: 'Aktivnih volontera',
      value: `${activePercent}%`,
      icon: Activity,
      color: 'text-emerald-600',
    },
    {
      label: 'Djece po terminu',
      value: summary.avgChildrenPerSession || '0',
      icon: Scale,
      color: 'text-brand-gold',
    },
    {
      label: 'Volontera po terminu',
      value: summary.avgVolunteersPerSession || '0',
      icon: Users,
      color: 'text-brand-purple',
    },
    {
      label: 'Stopa zadržavanja',
      value: `${retentionRate?.rate || 0}%`,
      icon: RefreshCw,
      color: 'text-sky-600',
    },
    {
      label: 'Prosječno trajanje',
      value: `${sessionDurationStats?.avg || 2}h`,
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      label: 'Novih volontera',
      value: retentionRate?.newVolunteers || 0,
      icon: Star,
      color: 'text-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-3 text-center">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-surface-500 mt-1">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
