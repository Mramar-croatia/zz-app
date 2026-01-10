/**
 * Badge component for volunteer activity status
 */
export default function ActivityStatusBadge({ status }) {
  const variants = {
    active: 'badge-success',
    inactive: 'badge-warning',
    dormant: 'bg-red-100 text-red-700',
    unknown: 'bg-surface-100 text-surface-600',
  };

  return (
    <span className={`badge ${variants[status.status] || variants.unknown}`}>
      <span className={`w-2 h-2 rounded-full ${status.dotColor} mr-2`} />
      {status.label}
    </span>
  );
}
