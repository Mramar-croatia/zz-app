/**
 * Achievement badge component for volunteer achievements
 */
export default function AchievementBadge({ icon: Icon, label, achieved, description }) {
  if (!achieved) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 border border-surface-200">
      <div className="w-6 h-6 bg-surface-800 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-surface-800">{label}</p>
        {description && <p className="text-xs text-surface-500">{description}</p>}
      </div>
    </div>
  );
}
