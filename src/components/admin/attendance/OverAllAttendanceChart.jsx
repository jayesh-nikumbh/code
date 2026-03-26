import { useState, useEffect } from "react";
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
import adminService from "../../../api/services/admin";
import { Loader2 } from "lucide-react";

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

export default function AttendanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminService.getOverallAttendance();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Attendance',
        data: data.map(item => item.attendance),
        borderColor: '#0B1957',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(11, 25, 87, 0.2)');
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
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => ` Attendance: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: (context) => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#0B1957',
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
          color: (context) => document.documentElement.classList.contains('dark') ? '#94a3b8' : '#0B1957',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl border border-gray-200 dark:border-white/10 p-6 min-h-[400px] flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-4">
        Batch Attendance Overview
      </h3>

      <div className="w-full h-[320px] relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#9ECCFA] animate-spin" />
            <p className="text-xs text-gray-400 font-medium animate-pulse">Loading Chart Data...</p>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}