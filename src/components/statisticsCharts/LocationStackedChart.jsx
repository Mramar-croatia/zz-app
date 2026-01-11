import { MapPin } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { CHART_OPTIONS } from '../../constants';

export default function LocationStackedChart({ stackedLocationData, className = '' }) {
  if (!stackedLocationData?.labels?.length) return null;

  const stackedOptions = {
    ...CHART_OPTIONS,
    scales: {
      ...CHART_OPTIONS.scales,
      x: { ...CHART_OPTIONS.scales.x, stacked: true },
      y: { ...CHART_OPTIONS.scales.y, stacked: true },
    },
  };

  return (
    <ChartCard
      icon={MapPin}
      iconColor="text-emerald-600"
      title="Djeca po lokaciji kroz vrijeme"
      height={320}
      className={className}
    >
      <Bar
        data={{
          labels: stackedLocationData.labels,
          datasets: stackedLocationData.datasets,
        }}
        options={stackedOptions}
      />
    </ChartCard>
  );
}
