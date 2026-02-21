/**
 * Avatar component with initials
 */
export default function Avatar({ name, size = 'md', className = '' }) {
  const initials =
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  const colors = [
    'bg-surface-700',
    'bg-surface-800',
    'bg-surface-600',
    'bg-surface-900',
    'bg-surface-700',
    'bg-surface-800',
    'bg-surface-600',
    'bg-surface-900',
  ];
  const colorIndex =
    (name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length) ||
    0;

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`${sizes[size]} ${colors[colorIndex]} flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}
