/**
 * Badge component for volunteer activity status
 */
export default function ActivityStatusBadge({ status }) {
  const variants = {
    active: 'badge-success',
    inactive: 'badge-warning',
    dormant: 'bg-[#FFF1F2] border border-[#FECDD3] text-[#991B1B]',
    unknown: 'bg-surface-100 border border-surface-200 text-surface-600',
  };

  return (
    <span className={`badge ${variants[status.status] || variants.unknown}`}>
      <span className={`w-2 h-2 inline-block ${status.dotColor} mr-2`} />
      {status.label}
    </span>
  );
}
