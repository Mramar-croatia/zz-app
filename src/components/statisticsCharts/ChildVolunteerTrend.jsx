import { TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { CHART_COLORS, CHART_OPTIONS } from '../../constants';

export default function ChildVolunteerTrend({ trends, className = '' }) {
  if (!trends?.labels?.length) return null;

  return (
    <ChartCard
      icon={TrendingUp}
      iconColor="text-emerald-600"
      title="Djeca i volonteri kroz vrijeme"
      height={300}
      className={className}
    >
      <Line
        data={{
          labels: trends.labels,
          datasets: [
            {
              label: 'Djeca',
              data: trends.children,
              borderColor: CHART_COLORS.gold.main,
              backgroundColor: CHART_COLORS.gold.lighter,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Volonteri',
              data: trends.volunteers,
              borderColor: CHART_COLORS.purple.main,
              backgroundColor: CHART_COLORS.purple.lighter,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={CHART_OPTIONS}
      />
    </ChartCard>
  );
}
