import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, Layers, ArrowRight, ShieldAlert, Award, FileText, CheckCircle, RefreshCw } from 'lucide-react';

export default function ProgressTracker({ theme }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compA, setCompA] = useState('');
  const [compB, setCompB] = useState('');

  const isLight = theme === 'light';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
  const tickColor = isLight ? '#475569' : '#94a3b8';
  const legendTextColor = isLight ? '#1e293b' : '#94a3b8';

  const fetchTrackerData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8000/api/history').then(res => res.json()),
      fetch('http://localhost:8000/api/statistics').then(res => res.json())
    ])
    .then(([historyData, statsData]) => {
      setHistory(historyData);
      setStats(statsData);
      
      // Default comparative selections
      if (historyData.length >= 2) {
        setCompA(historyData[1].id.toString());
        setCompB(historyData[0].id.toString());
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching history logs:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px' }}>
        <RefreshCw className="animate-spin text-clinical-primary" size={48} />
        <p className="mt-4 text-slate-400 font-sans">Syncing patient tracker metrics...</p>
      </div>
    );
  }

  // Compile trend chart data (Severity index and affected area percentage over time)
  const sortedTimeline = stats?.timeline || [];
  
  const chartData = {
    labels: sortedTimeline.map(item => item.timestamp.split(' ')[0]),
    datasets: [
      {
        label: 'Severity Index (Score / 10)',
        data: sortedTimeline.map(item => item.score),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'Affected Area %',
        data: sortedTimeline.map(item => item.affected_area),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: legendTextColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 10,
        grid: { color: gridColor },
        ticks: { color: isLight ? '#0284c7' : '#0ea5e9' },
        title: { display: true, text: 'Severity Score', color: isLight ? '#0284c7' : '#0ea5e9' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: { color: isLight ? '#059669' : '#10b981' },
        title: { display: true, text: 'Affected Skin Area %', color: isLight ? '#059669' : '#10b981' }
      }
    }
  };

  // Get compared records details
  const recordA = history.find(r => r.id.toString() === compA);
  const recordB = history.find(r => r.id.toString() === compB);

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'Severe': return 'text-rose-500';
      case 'Moderate': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Disease Progress Tracker</h2>
          <p>Monitor historical severity indexes, patient statistics, and compare old vs. new scans over time.</p>
        </div>

        {history.length === 0 ? (
          <div className="clinical-card text-center p-12 text-[var(--text-mute)]">
            <ShieldAlert size={48} className="mx-auto text-clinical-warning mb-4 animate-bounce" />
            <h4 className="text-[var(--text-main)]">No Prediction History Found</h4>
            <p className="mt-2 text-sm max-w-sm mx-auto text-[var(--text-mute)]">
              Please analyze a lesion in the AI Diagnostic Center first to generate patient records and populate the tracker.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Line Chart */}
              <div className="clinical-card lg:col-span-2">
                <h3 className="dashboard-card-title">
                  <TrendingUp size={18} /> Severity & Affected Skin Area Trends
                </h3>
                <div style={{ height: '320px', position: 'relative' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="clinical-card flex flex-col justify-between">
                <div>
                  <h3 className="dashboard-card-title">
                    <Layers size={18} /> Progress Scorecard
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <div>
                        <div className="text-xs text-[var(--text-mute)]">Average Severity Index</div>
                        <div className="text-xl font-bold font-mono text-clinical-primary">{stats?.avg_severity} / 10.0</div>
                      </div>
                      <Award className="text-clinical-primary" size={24} />
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <div>
                        <div className="text-xs text-[var(--text-mute)]">Total Scans Recorded</div>
                        <div className="text-xl font-bold font-mono text-clinical-secondary">{history.length}</div>
                      </div>
                      <CheckCircle className="text-clinical-secondary" size={24} />
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <div>
                        <div className="text-xs text-[var(--text-mute)]">Current Health Profile</div>
                        <div className="text-sm font-bold text-[var(--text-main)]">
                          Latest: <span className={getSeverityColor(history[0]?.severity)}>{history[0]?.diagnosis} ({history[0]?.severity})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mt-6 text-xs text-[var(--text-mute)]">
                  *Timeline is compiled automatically from local SQLite storage upon successful AI diagnostics.
                </div>
              </div>
            </div>

            {/* Compare Old vs New */}
            {history.length >= 2 && (
              <div className="clinical-card">
                <h3 className="dashboard-card-title">
                  <Layers size={18} /> Compare Historical Reports
                </h3>
                
                <div className="flex gap-4 mb-6 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-[var(--text-mute)] block mb-1">Select Base Scan (Older)</label>
                    <select 
                      value={compA} 
                      onChange={(e) => setCompA(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded p-2 text-sm outline-none focus:border-clinical-primary"
                    >
                      {history.map(r => (
                        <option key={r.id} value={r.id}>{r.timestamp.split(' ')[0]} - {r.diagnosis}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-center pt-5">
                    <ArrowRight className="text-[var(--text-mute)]" size={20} />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-[var(--text-mute)] block mb-1">Select Comparison Scan (Newer)</label>
                    <select 
                      value={compB} 
                      onChange={(e) => setCompB(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded p-2 text-sm outline-none focus:border-clinical-primary"
                    >
                      {history.map(r => (
                        <option key={r.id} value={r.id}>{r.timestamp.split(' ')[0]} - {r.diagnosis}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {recordA && recordB && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                    {/* Record A */}
                    <div>
                      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-4">
                        <span className="text-xs text-clinical-primary font-bold">BASE SCAN - {recordA.timestamp}</span>
                        <span className={`text-xs font-bold ${getSeverityColor(recordA.severity)}`}>{recordA.severity}</span>
                      </div>
                      <div className="flex flex-col gap-2 font-sans text-sm">
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Diagnosis:</span> <span className="font-bold text-[var(--text-main)]">{recordA.diagnosis}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Confidence:</span> <span className="font-mono text-[var(--text-main)]">{recordA.confidence}%</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Severity score:</span> <span className="font-mono text-clinical-primary">{recordA.score} / 10.0</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Affected Area:</span> <span className="font-mono text-[var(--text-main)]">{recordA.affected_area}%</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Model Used:</span> <span className="text-[var(--text-mute)]">{recordA.model_used}</span></div>
                      </div>
                    </div>

                    {/* Record B */}
                    <div>
                      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-4">
                        <span className="text-xs text-clinical-secondary font-bold">COMPARISON SCAN - {recordB.timestamp}</span>
                        <span className={`text-xs font-bold ${getSeverityColor(recordB.severity)}`}>{recordB.severity}</span>
                      </div>
                      <div className="flex flex-col gap-2 font-sans text-sm">
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Diagnosis:</span> <span className="font-bold text-[var(--text-main)]">{recordB.diagnosis}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Confidence:</span> <span className="font-mono text-[var(--text-main)]">{recordB.confidence}%</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Severity score:</span> <span className="font-mono text-clinical-secondary">{recordB.score} / 10.0</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Affected Area:</span> <span className="font-mono text-[var(--text-main)]">{recordB.affected_area}%</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-mute)]">Model Used:</span> <span className="text-[var(--text-mute)]">{recordB.model_used}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline logs table */}
            <div className="clinical-card">
              <h3 className="dashboard-card-title">
                <Calendar size={18} /> Prediction Log Timeline
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--text-mute)] text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Date &amp; Time</th>
                      <th className="py-3 px-4">Image Source</th>
                      <th className="py-3 px-4">Primary Diagnosis</th>
                      <th className="py-3 px-4 text-center">Confidence</th>
                      <th className="py-3 px-4 text-center">Severity Index</th>
                      <th className="py-3 px-4 text-center">Affected Area</th>
                      <th className="py-3 px-4">Network Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, i) => (
                      <tr key={record.id} className="border-b border-[var(--border-color)] hover:bg-[var(--border-color-glow)] transition-colors">
                        <td className="py-4 px-4 font-mono text-xs text-[var(--text-mute)]">{record.timestamp}</td>
                        <td className="py-4 px-4 text-[var(--text-mute)] text-xs font-mono">{record.filename || 'uploaded_image.png'}</td>
                        <td className="py-4 px-4 font-bold text-[var(--text-main)]">{record.diagnosis}</td>
                        <td className="py-4 px-4 text-center font-mono text-[var(--text-main)]">{record.confidence}%</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            record.severity === 'Severe' ? 'bg-rose-500/10 text-rose-500' :
                            record.severity === 'Moderate' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {record.score} ({record.severity})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-[var(--text-main)]">{record.affected_area}%</td>
                        <td className="py-4 px-4 text-[var(--text-mute)] text-xs">{record.model_used}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
