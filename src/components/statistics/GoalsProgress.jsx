import { Target, Clock, CalendarDays, Baby, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { ProgressBar } from '../common';
import { ORGANIZATION_GOALS } from '../../constants';

const ICONS = {
  hours: Clock,
  sessions: CalendarDays,
  children: Baby,
  volunteers: Users,
};

const COLORS = {
  hours: 'bg-amber-500',
  sessions: 'bg-emerald-500',
  children: 'bg-brand-gold',
  volunteers: 'bg-brand-purple',
};

export default function GoalsProgress({ summary }) {
  const goals = [
    { key: 'hours', value: summary.totalHours },
    { key: 'sessions', value: summary.totalSessions },
    { key: 'children', value: summary.totalChildren },
    { key: 'volunteers', value: summary.activeVolunteers },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-purple" />
          <CardTitle className="text-lg">Ciljevi organizacije</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map(({ key, value }) => {
            const goal = ORGANIZATION_GOALS[key];
            const Icon = ICONS[key];
            const colorClass = COLORS[key];
            const percentage = Math.min(100, Math.round((value / goal.target) * 100));

            return (
              <div key={key} className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-surface-500" />
                  <span className="text-sm font-medium text-surface-600">{goal.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-surface-900">{value}</span>
                  <span className="text-sm text-surface-500">/ {goal.target}</span>
                </div>
                <ProgressBar
                  value={value}
                  max={goal.target}
                  showPercentage={false}
                  colorClass={colorClass}
                  size="sm"
                />
                <p className="text-xs text-surface-500 mt-2">{percentage}% ostvareno</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
