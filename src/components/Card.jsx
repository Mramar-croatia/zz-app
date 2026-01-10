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
    <div className={`px-6 py-5 lg:px-7 lg:py-6 border-b border-surface-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-display font-semibold text-xl lg:text-2xl text-surface-900 ${className}`}>
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
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-surface-500',
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-5 sm:p-6 lg:p-7">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-base lg:text-lg text-surface-500 font-medium truncate">{label}</p>
            <p className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900">
              {value}
            </p>
            {delta && (
              <p className={`mt-1.5 text-base lg:text-lg ${trendColors[trend] || trendColors.neutral}`}>
                {delta}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 p-3 lg:p-4 bg-brand-purple/10 rounded-xl">
              <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-brand-purple" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
