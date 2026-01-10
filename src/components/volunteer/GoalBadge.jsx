import { Check } from 'lucide-react';

/**
 * Goal tier badge component for volunteer hours goals
 */
export default function GoalBadge({ hours, goal, label, achieved }) {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
        achieved
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200'
          : 'bg-surface-50 border border-surface-200 opacity-50'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          achieved ? 'bg-amber-400 text-white' : 'bg-surface-200 text-surface-400'
        }`}
      >
        {achieved ? (
          <Check className="w-4 h-4" />
        ) : (
          <span className="text-xs font-bold">{goal}</span>
        )}
      </div>
      <span
        className={`text-xs font-medium mt-1 ${
          achieved ? 'text-amber-700' : 'text-surface-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
