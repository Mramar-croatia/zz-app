import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function ChangeIndicator({ value, suffix = '%', showIcon = true, size = 'md' }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const colorClass = isPositive
    ? 'text-emerald-600'
    : isNegative
      ? 'text-red-600'
      : 'text-surface-500';

  const bgClass = isPositive
    ? 'bg-emerald-100'
    : isNegative
      ? 'bg-red-100'
      : 'bg-surface-100';

  const sizeClass = size === 'sm'
    ? 'text-xs px-1.5 py-0.5'
    : size === 'lg'
      ? 'text-base px-3 py-1.5'
      : 'text-sm px-2 py-1';

  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;

  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full font-medium ${colorClass} ${bgClass} ${sizeClass}`}>
      {showIcon && <Icon className={iconSize} />}
      <span>{isPositive ? '+' : ''}{value}{suffix}</span>
    </span>
  );
}
