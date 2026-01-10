import { Check } from 'lucide-react';
import { HOURS_GOALS } from '../../constants';

/**
 * Progress bar component showing volunteer hours progress
 */
export default function HoursProgress({ hours, goal = HOURS_GOALS.basic, compact = false }) {
  const progress = Math.min(((hours || 0) / goal) * 100, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-2 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 100 ? 'bg-emerald-500' : 'bg-brand-purple'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className={`font-semibold text-lg ${
            progress >= 100 ? 'text-emerald-600' : 'text-brand-purple'
          }`}
        >
          {hours}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-surface-500">
          {hours} / {goal} sati
        </span>
        {progress >= 100 && <Check className="w-4 h-4 text-emerald-500" />}
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            progress >= 100 ? 'bg-emerald-500' : 'bg-brand-purple'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
