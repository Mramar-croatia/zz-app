/**
 * Achievement badge component for volunteer achievements
 */
export default function AchievementBadge({ icon: Icon, label, achieved, description }) {
  if (!achieved) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg">
      <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-violet-700">{label}</p>
        {description && <p className="text-xs text-violet-500">{description}</p>}
      </div>
    </div>
  );
}
