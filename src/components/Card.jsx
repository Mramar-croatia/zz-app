export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 lg:px-6 lg:py-5 border-b border-surface-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-bold text-base lg:text-lg text-surface-900 tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 lg:p-7 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, delta, icon: Icon, trend, className = '' }) {
  const trendColors = {
    up: 'text-emerald-700',
    down: 'text-red-800',
    neutral: 'text-surface-500',
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-5 sm:p-6 lg:p-7">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-surface-500 font-medium truncate uppercase tracking-widest">{label}</p>
            <p className="mt-2 font-bold text-3xl sm:text-4xl lg:text-5xl text-surface-900 tabular-nums">
              {value}
            </p>
            {delta && (
              <p className={`mt-1.5 text-sm font-medium ${trendColors[trend] || trendColors.neutral}`}>
                {delta}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 p-3 lg:p-3 bg-surface-100 border border-surface-200">
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-surface-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
