import { Award, Check, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

export default function Milestones({ milestones = [] }) {
  if (!milestones?.length) return null;

  const completedMilestones = milestones.filter(m => m.achieved);
  const upcomingMilestones = milestones.filter(m => !m.achieved).slice(0, 3);

  if (completedMilestones.length === 0 && upcomingMilestones.length === 0) return null;

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-gold" />
          <CardTitle className="text-lg">Postignuća</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedMilestones.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-surface-500 mb-2">Ostvareno</h4>
              <div className="flex flex-wrap gap-2">
                {completedMilestones.slice(0, 6).map((milestone, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">{milestone.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingMilestones.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-surface-500 mb-2">Sljedeći ciljevi</h4>
              <div className="space-y-2">
                {upcomingMilestones.map((milestone, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-surface-400" />
                      <span className="text-sm font-medium text-surface-700">{milestone.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-purple rounded-full"
                          style={{ width: `${milestone.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-surface-500">{milestone.progress || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
