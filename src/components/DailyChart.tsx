import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DailyStats } from '@/types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DailyChartProps {
  dailyStats: DailyStats[];
}

export default function DailyChart({ dailyStats }: DailyChartProps) {
  // Get last 7 days for chart
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.date === dateStr);
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        sessions: stat?.sessions || 0,
      });
    }
    return days;
  };

  return (
    <div className="bg-stone-800 rounded-2xl p-6 shadow-sm mt-6 border border-stone-700">
      <h3 className="text-lg font-medium text-amber-100 mb-4">Daily Performance</h3>
      <div className="h-32">
        <Bar
          data={{
            labels: getLast7Days().map(day => day.day),
            datasets: [
              {
                label: 'Sessions',
                data: getLast7Days().map(day => day.sessions),
                backgroundColor: 'rgba(234, 88, 12, 0.8)', // orange-600 with opacity
                borderColor: 'rgba(234, 88, 12, 1)', // orange-600
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'rgb(245, 245, 244)', // stone-100
                bodyColor: 'rgb(245, 245, 244)', // stone-100
                borderColor: 'rgba(120, 113, 108, 0.3)', // stone-500 with opacity
                borderWidth: 1,
                callbacks: {
                  label: (context) => `${context.parsed.y} sessions`,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: 'rgb(120, 113, 108)', // stone-500
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(120, 113, 108, 0.2)', // stone-500 with low opacity
                },
                ticks: {
                  color: 'rgb(120, 113, 108)', // stone-500
                  font: {
                    size: 12,
                  },
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
} 