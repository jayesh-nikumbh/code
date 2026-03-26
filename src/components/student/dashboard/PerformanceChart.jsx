import { useState, useEffect } from 'react';
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
import { TrendingUp } from 'lucide-react';
import performanceService from '../../../api/services/performance';

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

export default function PerformanceChart() {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await performanceService.getPerformanceData();
        setPerformanceData(data || []);
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const chartData = {
    labels: performanceData.map(item => item.month),
    datasets: [
      {
        label: 'Score',
        data: performanceData.map(item => item.score),
        borderColor: '#0B1957',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(11, 25, 87, 0.1)');
          gradient.addColorStop(1, 'rgba(11, 25, 87, 0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#0B1957',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointRadius: 4,
        tension: 0.4,
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
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
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
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: (context) => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#6b7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#0B1957] dark:text-[#9ECCFA]" />
        <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white">
          User Performance
        </h2>
      </div>

      <div className="h-[250px] w-full relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#9ECCFA] animate-spin" />
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

// Fixed Loader2 import by explicitly adding icon if needed or using standard loading
function Loader2({ className }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-[#9ECCFA] border-t-transparent ${className}`}></div>
  );
}