import { BarChart3 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { CHART_COLORS, CHART_OPTIONS } from '../../constants';

export default function TrendsChart({ trends, className = '' }) {
  if (!trends?.labels?.length) return null;

  return (
    <ChartCard
      icon={BarChart3}
      title="Termini kroz vrijeme"
      className={className}
    >
      <Bar
        data={{
          labels: trends.labels,
          datasets: [{
            label: 'Termini',
            data: trends.sessions,
            backgroundColor: CHART_COLORS.purple.light,
            borderColor: CHART_COLORS.purple.main,
            borderWidth: 2,
            borderRadius: 6,
          }],
        }}
        options={CHART_OPTIONS}
      />
    </ChartCard>
  );
}
