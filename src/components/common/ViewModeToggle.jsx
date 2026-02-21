import { List, LayoutGrid } from 'lucide-react';

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 bg-surface-100 border border-surface-200 p-1">
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 transition-colors ${
          viewMode === 'table'
            ? 'bg-white shadow-sm text-surface-900'
            : 'text-surface-500 hover:text-surface-700'
        }`}
        title="Tablični prikaz"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('cards')}
        className={`p-2 transition-colors ${
          viewMode === 'cards'
            ? 'bg-white shadow-sm text-surface-900'
            : 'text-surface-500 hover:text-surface-700'
        }`}
        title="Kartični prikaz"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
}
