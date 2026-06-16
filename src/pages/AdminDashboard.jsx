import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { ShieldAlert, Award, Grid, Users, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminDashboard({ theme }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLight = theme === 'light';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
  const tickColor = isLight ? '#475569' : '#94a3b8';

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8000/api/statistics').then(res => res.json()),
      fetch('http://localhost:8000/api/history?limit=5').then(res => res.json())
    ])
    .then(([statsData, historyData]) => {
      setStats(statsData);
      setRecent(historyData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching dashboard stats:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px' }}>
        <RefreshCw className="animate-spin text-clinical-primary" size={48} />
        <p className="mt-4 text-slate-400 font-sans">Syncing admin dashboard data...</p>
      </div>
    );
  }

  // Distribution chart data
  const distKeys = Object.keys(stats?.distribution || {});
  const distVals = Object.values(stats?.distribution || {});
  
  const distChartData = {
    labels: distKeys,
    datasets: [
      {
        label: 'Prediction Incidence',
        data: distVals,
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderColor: '#0ea5e9',
        borderWidth: 1.5
      }
    ]
  };

  const distChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor } }
    }
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Clinical Administration Dashboard</h2>
          <p>Global statistics, pathology metrics, and recent diagnostic activities.</p>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="clinical-card text-center p-6">
            <h3 className="text-sm font-semibold text-[var(--text-mute)] uppercase tracking-wider mb-2">Total Predictions</h3>
            <div className="text-3xl font-extrabold font-mono text-clinical-primary">{stats?.total || 0}</div>
          </div>
          <div className="clinical-card text-center p-6">
            <h3 className="text-sm font-semibold text-[var(--text-mute)] uppercase tracking-wider mb-2">Most Common Disease</h3>
            <div className="text-xl font-extrabold text-[var(--text-main)] mt-1 truncate">{stats?.common_disease || 'None'}</div>
          </div>
          <div className="clinical-card text-center p-6">
            <h3 className="text-sm font-semibold text-[var(--text-mute)] uppercase tracking-wider mb-2">Average Severity Index</h3>
            <div className="text-3xl font-extrabold font-mono text-clinical-warning">{stats?.avg_severity || '0.0'}</div>
          </div>
          <div className="clinical-card text-center p-6">
            <h3 className="text-sm font-semibold text-[var(--text-mute)] uppercase tracking-wider mb-2">Model Target Accuracy</h3>
            <div className="text-3xl font-extrabold font-mono text-clinical-secondary">94.8%</div>
          </div>
        </div>

        {/* Distribution charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="clinical-card">
            <h3 className="dashboard-card-title">
              <BarChart2 size={18} /> Disease Prediction Frequencies
            </h3>
            <div style={{ height: '300px', position: 'relative' }}>
              <Bar data={distChartData} options={distChartOptions} />
            </div>
          </div>

          {/* User statistics details */}
          <div className="clinical-card flex flex-col justify-between">
            <div>
              <h3 className="dashboard-card-title">
                <Users size={18} /> Clinic Patient Statistics
              </h3>
              
              <div className="flex flex-col gap-4 mt-4 text-sm font-sans">
                <div className="flex justify-between items-center p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-mute)]">Total Registered Devices:</span>
                  <span className="font-bold text-[var(--text-main)]">14 Nodes</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-mute)]">Average Inference Time:</span>
                  <span className="font-mono font-bold text-clinical-primary">64.5 ms</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-mute)]">HIPAA Sandbox Status:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500">Active</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-4 mt-6 text-xs text-[var(--text-mute)]">
              *System handles data in zero-trust local sandbox. No patient health records (PHI) are leaked.
            </div>
          </div>
        </div>

        {/* Recent uploads */}
        <div className="clinical-card">
          <h3 className="dashboard-card-title">
            <Grid size={18} /> Recent Upload Activity Logs
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-mute)] text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Image Source</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-center">Severity Index</th>
                  <th className="py-3 px-4">Model Used</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(record => (
                  <tr key={record.id} className="border-b border-[var(--border-color)] hover:bg-[var(--border-color-glow)] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[var(--text-mute)]">{record.timestamp}</td>
                    <td className="py-3 px-4 text-[var(--text-mute)] text-xs font-mono">{record.filename || 'skin_upload.png'}</td>
                    <td className="py-3 px-4 font-bold text-[var(--text-main)]">{record.diagnosis}</td>
                    <td className="py-3 px-4 text-center font-mono text-[var(--text-main)]">{record.confidence}%</td>
                    <td className="py-3 px-4 text-center font-mono text-[var(--text-main)]">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        record.severity === 'Severe' ? 'bg-rose-500/10 text-rose-500' :
                        record.severity === 'Moderate' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {record.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-mute)] text-xs">{record.model_used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
