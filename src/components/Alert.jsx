import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export function Alert({ variant = 'info', title, children, onClose, className = '' }) {
  const styles = variants[variant] || variants.info;
  const Icon = styles.icon;

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-xl border
      ${styles.bg} ${className}
    `}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
      <div className={`flex-1 ${styles.text}`}>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-1 text-sm opacity-90' : ''}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 -mr-1 rounded hover:bg-black/5 ${styles.text}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function Toast({ variant = 'info', message, onClose }) {
  const styles = variants[variant] || variants.info;
  const Icon = styles.icon;

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl border shadow-soft-lg
      ${styles.bg} animate-slide-up
    `}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${styles.iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-black/5 ${styles.text}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
