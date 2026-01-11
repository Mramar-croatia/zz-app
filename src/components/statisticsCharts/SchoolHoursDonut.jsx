import { GraduationCap } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { CHART_PALETTE, DOUGHNUT_OPTIONS } from '../../constants';

export default function SchoolHoursDonut({ hoursBySchool, className = '' }) {
  if (!hoursBySchool?.labels?.length) return null;

  return (
    <ChartCard
      icon={GraduationCap}
      title="Sati po školi"
      className={className}
    >
      <Doughnut
        data={{
          labels: hoursBySchool.labels,
          datasets: [{
            data: hoursBySchool.data,
            backgroundColor: CHART_PALETTE,
            borderColor: '#fff',
            borderWidth: 3,
          }],
        }}
        options={DOUGHNUT_OPTIONS}
      />
    </ChartCard>
  );
}
