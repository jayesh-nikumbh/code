import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const defaultData = [
  { name: 'Feb 03', value: 91, status: 'Present' },
  { name: 'Feb 10', value: 97, status: 'Present' },
  { name: 'Feb 17', value: 75, status: 'Absent' },
  { name: 'Feb 24', value: 93, status: 'Present' },
];

export default function AttendanceChart({ data }) {
  const chartDataRaw = data || defaultData;

  const chartData = {
    labels: chartDataRaw.map(item => item.name),
    datasets: [
      {
        label: 'Attendance %',
        data: chartDataRaw.map(item => item.value),
        borderColor: '#0B1957',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(11, 25, 87, 0.1)');
          gradient.addColorStop(1, 'rgba(11, 25, 87, 0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: chartDataRaw.map(item => item.status === 'Present' ? '#16a34a' : '#ef4444'),
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
        pointRadius: 5,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0B1957',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const status = chartDataRaw[context.dataIndex].status;
            return ` Attendance: ${context.parsed.y}% (${status})`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: (context) => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#6b7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          stepSize: 25,
          color: (context) => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#6b7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 pb-10">
        <Line data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-6 text-[12px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
