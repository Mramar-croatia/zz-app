import { getLocationColor } from '../utils/locationColors';

const variants = {
  default: 'bg-surface-100 text-surface-700',
  gold: 'badge-gold',
  purple: 'badge-purple',
  success: 'badge-success',
  warning: 'badge-warning',
  info: 'badge-info',
  error: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function LocationBadge({ location, className = '' }) {
  const colors = getLocationColor(location);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      {location}
    </span>
  );
}

export function GradeBadge({ grade }) {
  return (
    <Badge variant="purple" className="font-mono">
      {grade}. razred
    </Badge>
  );
}

export function StatusBadge({ status }) {
  const statusMap = {
    active: { variant: 'success', label: 'Aktivan' },
    inactive: { variant: 'default', label: 'Neaktivan' },
    pending: { variant: 'warning', label: 'Na čekanju' },
  };

  const { variant, label } = statusMap[status] || statusMap.inactive;
  return <Badge variant={variant}>{label}</Badge>;
}
