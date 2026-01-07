import { Filter, X } from 'lucide-react';
import { Badge } from './Badge';

export function FilterBar({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-surface-500">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filteri:</span>
      </div>
      {children}
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options, placeholder = 'Svi' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select input-sm min-w-[140px]"
      aria-label={label}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}

export function ActiveFilters({ filters, onRemove, onClear }) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-xs text-surface-500">Aktivni filteri:</span>
      {activeFilters.map(([key, value]) => (
        <button
          key={key}
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-xs font-medium hover:bg-brand-purple/20 transition-colors"
        >
          <span>{value}</span>
          <X className="w-3 h-3" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClear}
          className="text-xs text-surface-500 hover:text-surface-700 ml-2"
        >
          Ukloni sve
        </button>
      )}
    </div>
  );
}

export function FilterChips({ options, selected, onChange, multiple = false }) {
  const handleClick = (value) => {
    if (multiple) {
      const newSelected = selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value];
      onChange(newSelected);
    } else {
      onChange(selected === value ? '' : value);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const value = option.value ?? option;
        const label = option.label ?? option;
        const isSelected = multiple
          ? selected.includes(value)
          : selected === value;

        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isSelected
                ? 'bg-brand-purple text-white shadow-soft'
                : 'bg-white text-surface-600 border border-surface-200 hover:border-surface-300 hover:bg-surface-50'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function SortSelect({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-surface-500">Sortiraj:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select input-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ResultCount({ count, total, label = 'rezultata' }) {
  return (
    <p className="text-sm text-surface-500">
      Prikazano <span className="font-semibold text-surface-700">{count}</span>
      {total !== count && (
        <> od <span className="font-semibold text-surface-700">{total}</span></>
      )}{' '}
      {label}
    </p>
  );
}
