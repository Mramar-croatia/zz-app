import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Color palette
const COLORS = {
  purple: {
    main: 'rgb(76, 29, 149)',
    light: 'rgba(76, 29, 149, 0.5)',
    lighter: 'rgba(76, 29, 149, 0.1)',
  },
  gold: {
    main: 'rgb(212, 175, 55)',
    light: 'rgba(212, 175, 55, 0.5)',
    lighter: 'rgba(212, 175, 55, 0.1)',
  },
  indigo: {
    main: 'rgb(79, 70, 229)',
    light: 'rgba(79, 70, 229, 0.5)',
  },
  emerald: {
    main: 'rgb(16, 185, 129)',
    light: 'rgba(16, 185, 129, 0.5)',
  },
  amber: {
    main: 'rgb(245, 158, 11)',
    light: 'rgba(245, 158, 11, 0.5)',
  },
  sky: {
    main: 'rgb(14, 165, 233)',
    light: 'rgba(14, 165, 233, 0.5)',
  },
};

const CHART_COLORS = [
  COLORS.purple.main,
  COLORS.gold.main,
  COLORS.emerald.main,
  COLORS.indigo.main,
  COLORS.amber.main,
  COLORS.sky.main,
];

const CHART_COLORS_LIGHT = [
  COLORS.purple.light,
  COLORS.gold.light,
  COLORS.emerald.light,
  COLORS.indigo.light,
  COLORS.amber.light,
  COLORS.sky.light,
];

// Default chart options
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        usePointStyle: true,
        font: {
          family: 'Manrope',
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(24, 24, 27, 0.9)',
      titleFont: {
        family: 'Manrope',
        size: 13,
        weight: '600',
      },
      bodyFont: {
        family: 'Manrope',
        size: 12,
      },
      padding: 12,
      cornerRadius: 8,
      boxPadding: 6,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: 'Manrope',
          size: 11,
        },
        color: '#71717A',
      },
    },
    y: {
      grid: {
        color: 'rgba(228, 228, 231, 0.5)',
      },
      ticks: {
        font: {
          family: 'Manrope',
          size: 11,
        },
        color: '#71717A',
      },
    },
  },
};

export function BarChart({ title, labels, datasets, height = 300, stacked = false }) {
  const data = {
    labels,
    datasets: datasets.map((ds, index) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: CHART_COLORS_LIGHT[index % CHART_COLORS_LIGHT.length],
      borderColor: CHART_COLORS[index % CHART_COLORS.length],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    })),
  };

  const options = {
    ...defaultOptions,
    scales: {
      ...defaultOptions.scales,
      x: {
        ...defaultOptions.scales.x,
        stacked,
      },
      y: {
        ...defaultOptions.scales.y,
        stacked,
      },
    },
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

export function LineChart({ title, labels, datasets, height = 300 }) {
  const data = {
    labels,
    datasets: datasets.map((ds, index) => ({
      label: ds.label,
      data: ds.data,
      borderColor: CHART_COLORS[index % CHART_COLORS.length],
      backgroundColor: CHART_COLORS_LIGHT[index % CHART_COLORS_LIGHT.length],
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>
          <Line data={data} options={defaultOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

export function DoughnutChart({ title, labels, data, height = 300 }) {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: CHART_COLORS,
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 16,
          usePointStyle: true,
          font: {
            family: 'Manrope',
            size: 12,
          },
        },
      },
      tooltip: defaultOptions.plugins.tooltip,
    },
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

// Dynamic chart renderer based on API chart type
export function DynamicChart({ chart, height = 300 }) {
  const { title, type, labels, datasets } = chart;

  if (type === 'line') {
    return <LineChart title={title} labels={labels} datasets={datasets} height={height} />;
  }

  return <BarChart title={title} labels={labels} datasets={datasets} height={height} />;
}
