import { Card, CardHeader, CardTitle, CardContent } from '../Card';

export default function ChartCard({
  icon: Icon,
  title,
  iconColor = 'text-brand-purple',
  height = 280,
  className = '',
  children
}) {
  return (
    <Card className={className}>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
