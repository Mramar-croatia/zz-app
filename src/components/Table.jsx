import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[600px]">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '', onClick, hover = true }) {
  return (
    <tr
      className={`
        ${hover ? 'hover:bg-surface-50 transition-colors' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, sortable, sorted, direction, onSort, className = '' }) {
  const SortIcon = sorted
    ? direction === 'asc'
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;

  if (sortable) {
    return (
      <th className={`table-header ${className}`}>
        <button
          onClick={onSort}
          className="flex items-center gap-1 hover:text-surface-700 transition-colors group"
        >
          <span>{children}</span>
          <SortIcon className={`w-4 h-4 ${sorted ? 'text-brand-purple' : 'text-surface-300 group-hover:text-surface-400'}`} />
        </button>
      </th>
    );
  }

  return (
    <th className={`table-header ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`table-cell ${className}`}>
      {children}
    </td>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-100 rounded-full mb-4">
          <Icon className="w-6 h-6 text-surface-400" />
        </div>
      )}
      <h3 className="font-semibold text-surface-700">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-surface-500">{description}</p>
      )}
    </div>
  );
}
