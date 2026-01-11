import { List, LayoutGrid } from 'lucide-react';

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'table'
            ? 'bg-white shadow-sm text-brand-purple'
            : 'text-surface-500 hover:text-surface-700'
        }`}
        title="Tablični prikaz"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('cards')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'cards'
            ? 'bg-white shadow-sm text-brand-purple'
            : 'text-surface-500 hover:text-surface-700'
        }`}
        title="Kartični prikaz"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
}
