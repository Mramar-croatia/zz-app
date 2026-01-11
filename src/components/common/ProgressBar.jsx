export default function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  colorClass = 'bg-brand-purple',
  size = 'md'
}) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-surface-600">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-surface-900">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClass} bg-surface-100 rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${colorClass} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
