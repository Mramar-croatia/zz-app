import { Lightbulb, Target, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

const INSIGHT_ICONS = {
  positive: TrendingUp,
  negative: TrendingDown,
  warning: AlertTriangle,
  neutral: Activity,
};

const INSIGHT_COLORS = {
  positive: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  negative: 'bg-red-100 text-red-700 border-red-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  neutral: 'bg-sky-100 text-sky-700 border-sky-200',
};

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
};

export default function InsightsPanel({ insights = [], recommendations = [] }) {
  if (insights.length === 0 && recommendations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {insights.length > 0 && (
        <Card>
          <CardHeader className="border-b border-surface-100">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Uvidi</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.type] || Activity;
                const colorClass = INSIGHT_COLORS[insight.type] || INSIGHT_COLORS.neutral;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${colorClass}`}
                  >
                    <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      {insight.title && <span className="font-medium">{insight.title}: </span>}
                      <span>{insight.description || insight.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader className="border-b border-surface-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-purple" />
              <CardTitle className="text-lg">Preporuke</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 4).map((rec, i) => {
                const priorityClass = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface-50"
                  >
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${priorityClass}`}>
                      {rec.priority === 'high' ? 'Visoki' : rec.priority === 'medium' ? 'Srednji' : 'Niski'}
                    </span>
                    <div className="text-sm text-surface-700">
                      {rec.title && <span className="font-medium">{rec.title}: </span>}
                      <span>{rec.description || rec.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
