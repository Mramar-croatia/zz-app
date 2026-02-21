import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants = {
  success: {
    bg: 'bg-[#F0FDF4] border-[#BBF7D0]',
    text: 'text-[#14532D]',
    icon: CheckCircle2,
    iconColor: 'text-[#166534]',
  },
  error: {
    bg: 'bg-[#FFF1F2] border-[#FECDD3]',
    text: 'text-[#7F1D1D]',
    icon: AlertCircle,
    iconColor: 'text-[#991B1B]',
  },
  warning: {
    bg: 'bg-[#FFFBEB] border-[#FDE68A]',
    text: 'text-[#78350F]',
    icon: AlertTriangle,
    iconColor: 'text-[#92400E]',
  },
  info: {
    bg: 'bg-[#EFF6FF] border-[#BFDBFE]',
    text: 'text-[#1E3A5C]',
    icon: Info,
    iconColor: 'text-[#1D4ED8]',
  },
};

export function Alert({ variant = 'info', title, children, onClose, className = '' }) {
  const styles = variants[variant] || variants.info;
  const Icon = styles.icon;

  return (
    <div className={`
      flex items-start gap-3 p-4 border
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
          className={`p-1 -mr-1 hover:bg-black/5 ${styles.text}`}
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
      flex items-center gap-3 px-4 py-3 border shadow-soft-lg
      ${styles.bg} animate-slide-up
    `}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${styles.iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-black/5 ${styles.text}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
