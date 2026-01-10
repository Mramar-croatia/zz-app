import { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['/', '/'], description: 'Fokusiraj pretragu' },
  { keys: ['Esc'], description: 'Zatvori drawer / Očisti pretragu' },
  { keys: ['↑', '↓'], description: 'Navigiraj kroz tablicu' },
  { keys: ['Enter'], description: 'Otvori profil odabranog volontera' },
  { keys: ['?'], description: 'Prikaži/sakrij prečace' },
];

export default function KeyboardShortcutsHelp({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-brand-purple" />
              </div>
              <h2 className="font-display font-semibold text-lg text-surface-900">
                Tipkovni prečaci
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-3">
              {SHORTCUTS.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-surface-600">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <kbd
                        key={i}
                        className="px-2.5 py-1 bg-surface-100 border border-surface-200 rounded-lg text-sm font-mono text-surface-700 shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-surface-400 text-center">
              Pritisni <kbd className="px-1.5 py-0.5 bg-surface-100 rounded text-surface-600">?</kbd> bilo kada za prikaz ovog prozora
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
