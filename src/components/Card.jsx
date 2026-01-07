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
    <div className={`px-5 py-4 border-b border-surface-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-display font-semibold text-lg text-surface-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, delta, icon: Icon, trend, className = '' }) {
  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-surface-500',
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-surface-500 font-medium truncate">{label}</p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-surface-900">
              {value}
            </p>
            {delta && (
              <p className={`mt-1 text-sm ${trendColors[trend] || trendColors.neutral}`}>
                {delta}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 p-2.5 bg-brand-purple/10 rounded-xl">
              <Icon className="w-5 h-5 text-brand-purple" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
