import { PieChart } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { DOUGHNUT_OPTIONS } from '../../constants';

export default function ActivityDonut({ activityBreakdown, className = '' }) {
  if (!activityBreakdown?.length) return null;

  return (
    <ChartCard
      icon={PieChart}
      title="Status volontera"
      className={className}
    >
      <Doughnut
        data={{
          labels: activityBreakdown.map(a => a.label),
          datasets: [{
            data: activityBreakdown.map(a => a.value),
            backgroundColor: activityBreakdown.map(a => a.color),
            borderColor: '#fff',
            borderWidth: 3,
          }],
        }}
        options={DOUGHNUT_OPTIONS}
      />
    </ChartCard>
  );
}
