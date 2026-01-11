import { Badge } from '../Badge';

export default function VolunteerBadgeList({
  volunteers = [],
  maxVisible = 5,
  size = 'default',
  emptyText = '-'
}) {
  if (!volunteers?.length) {
    return <span className="text-surface-400">{emptyText}</span>;
  }

  const visible = volunteers.slice(0, maxVisible);
  const overflow = volunteers.length - maxVisible;
  const sizeClass = size === 'sm' ? 'text-xs' : '';

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((name, i) => (
        <Badge key={i} variant="default" className={sizeClass}>
          {name}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="purple" className={sizeClass}>
          +{overflow}
        </Badge>
      )}
    </div>
  );
}
