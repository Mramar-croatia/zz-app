import { MapPin } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { CHART_OPTIONS } from '../../constants';

export default function ChildrenLocationChart({ childrenByLocation, className = '' }) {
  if (!childrenByLocation?.labels?.length) return null;

  return (
    <ChartCard
      icon={MapPin}
      iconColor="text-brand-gold"
      title="Djeca po lokaciji"
      className={className}
    >
      <Bar
        data={{
          labels: childrenByLocation.labels,
          datasets: [{
            label: 'Djeca',
            data: childrenByLocation.data,
            backgroundColor: childrenByLocation.backgroundColor,
            borderColor: childrenByLocation.borderColor,
            borderWidth: 2,
            borderRadius: 6,
          }],
        }}
        options={{ ...CHART_OPTIONS, indexAxis: 'y' }}
      />
    </ChartCard>
  );
}
