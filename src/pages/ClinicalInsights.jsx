import React, { useState } from 'react';
import 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { Grid, BarChart2, Activity, PieChart, TrendingUp, Layers } from 'lucide-react';

export default function ClinicalInsights({ theme }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState('scores');

  const isLight = theme === 'light';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
  const tickColor = isLight ? '#475569' : '#94a3b8';
  const legendTextColor = isLight ? '#1e293b' : '#94a3b8';

  // 1. HAM10000 Dataset distribution data
  const datasetData = {
    labels: ['Melanocytic Nevi', 'Melanoma', 'Benign Keratosis', 'Basal Cell Carc.', 'Actinic Keratosis', 'Vascular Lesions', 'Dermatofibroma'],
    datasets: [
      {
        label: 'Number of Images',
        data: [6705, 1113, 1099, 514, 327, 142, 115],
        backgroundColor: [
          'rgba(14, 165, 233, 0.65)',  // Cyan
          'rgba(244, 63, 94, 0.65)',   // Red
          'rgba(16, 185, 129, 0.65)',  // Green
          'rgba(245, 158, 11, 0.65)',  // Yellow
          'rgba(168, 85, 247, 0.65)',  // Purple
          'rgba(236, 72, 153, 0.65)',  // Pink
          'rgba(234, 179, 8, 0.65)'    // Gold
        ],
        borderColor: [
          '#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#eab308'
        ],
        borderWidth: 1.5
      }
    ]
  };

  const datasetOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
      }
    }
  };

  // 2. Algorithm Comparison Metrics
  const models = ['Naive Bayes', 'KNN', 'Decision Tree', 'CART', 'Custom CNN', 'EfficientNetB0', 'MobileNetV2'];
  
  const scoreComparisonData = {
    labels: models,
    datasets: [
      {
        label: 'Accuracy %',
        data: [81.2, 86.4, 84.8, 85.2, 91.8, 94.8, 93.1],
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderColor: '#0ea5e9',
        borderWidth: 1
      },
      {
        label: 'Precision %',
        data: [80.5, 85.9, 84.1, 84.6, 91.2, 94.2, 92.5],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 1
      },
      {
        label: 'Recall %',
        data: [79.8, 85.1, 83.5, 83.9, 90.8, 93.4, 91.9],
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: '#f59e0b',
        borderWidth: 1
      },
      {
        label: 'F1-Score %',
        data: [80.1, 85.5, 83.8, 84.2, 91.0, 93.8, 92.2],
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: '#a855f7',
        borderWidth: 1
      }
    ]
  };

  const latencyComparisonData = {
    labels: models,
    datasets: [
      {
        label: 'Inference Time (ms)',
        data: [2.5, 12.4, 6.2, 6.8, 75.0, 120.0, 45.0],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: legendTextColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor } },
      y: { min: 60, max: 100, grid: { color: gridColor }, ticks: { color: tickColor } }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: legendTextColor } }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor } },
      y: { title: { display: true, text: 'Latency (ms)', color: tickColor }, grid: { color: gridColor }, ticks: { color: tickColor } }
    }
  };

  // 3. Custom Confusion Matrix data
  const matrixClasses = ['NV', 'MEL', 'BKL', 'BCC', 'AKIEC', 'VASC', 'DF'];
  const fullClassNames = {
    NV: 'Melanocytic Nevi',
    MEL: 'Melanoma',
    BKL: 'Benign Keratosis',
    BCC: 'Basal Cell Carcinoma',
    AKIEC: 'Actinic Keratosis',
    VASC: 'Vascular Lesions',
    DF: 'Dermatofibroma'
  };

  const confusionMatrix = [
    [95, 2, 1, 1, 1, 0, 0], // NV
    [5, 91, 2, 1, 1, 0, 0], // MEL
    [2, 2, 92, 2, 1, 1, 0], // BKL
    [1, 2, 2, 93, 1, 0, 1], // BCC
    [1, 3, 2, 2, 90, 1, 1], // AKIEC
    [0, 1, 1, 0, 1, 96, 1], // VASC
    [1, 1, 2, 1, 1, 0, 94]  // DF
  ];

  const getCellColorStyle = (val, isDiagonal) => {
    if (isDiagonal) {
      const alpha = 0.15 + (val / 100) * 0.75;
      return {
        background: `rgba(16, 185, 129, ${alpha})`,
        color: '#ffffff',
        border: '1.5px solid rgba(16, 185, 129, 0.4)'
      };
    } else {
      if (val === 0) return { background: 'rgba(255,255,255,0.01)', color: 'var(--text-mute)', opacity: 0.35 };
      const alpha = 0.08 + (val / 10) * 0.4;
      return {
        background: `rgba(244, 63, 94, ${alpha})`,
        color: 'var(--danger)',
        border: '1px solid rgba(244, 63, 94, 0.15)'
      };
    }
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Clinical Validation & Model Comparisons</h2>
          <p>
            Review the benchmark evaluations comparing traditional pattern recognition methods and deep learning networks.
          </p>
        </div>

        {/* Algorithm Comparisons Tab Panel */}
        <div className="clinical-card mb-8">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-6 flex-wrap gap-4">
            <h3 className="dashboard-card-title mb-0">
              <BarChart2 size={18} /> Model Performance Benchmarks
            </h3>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveChartTab('scores')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  activeChartTab === 'scores' 
                    ? 'bg-clinical-primary text-white' 
                    : 'bg-[var(--bg-main)] text-[var(--text-mute)] hover:bg-[var(--border-color)]'
                }`}
              >
                Accuracy &amp; F1 Metrics
              </button>
              <button 
                onClick={() => setActiveChartTab('latency')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  activeChartTab === 'latency' 
                    ? 'bg-clinical-primary text-white' 
                    : 'bg-[var(--bg-main)] text-[var(--text-mute)] hover:bg-[var(--border-color)]'
                }`}
              >
                Inference Latency
              </button>
            </div>
          </div>

          <div style={{ height: '320px', position: 'relative' }}>
            {activeChartTab === 'scores' ? (
              <Bar data={scoreComparisonData} options={barChartOptions} />
            ) : (
              <Line data={latencyComparisonData} options={lineChartOptions} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom Interactive Confusion Matrix */}
          <div className="clinical-card">
            <h3 className="dashboard-card-title">
              <Grid size={18} /> Confusion Matrix (Recall %)
            </h3>
            
            <div className="matrix-container">
              {/* Matrix Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', maxWidth: '480px', width: '100%', paddingLeft: '8px', paddingRight: '8px', marginBottom: '4px', textAlign: 'center' }}>
                {matrixClasses.map((cl, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-mute)', fontWeight: 'bold' }}>{cl}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="matrix-grid">
                {confusionMatrix.map((row, rIdx) => 
                  row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    const trueClass = matrixClasses[rIdx];
                    const predClass = matrixClasses[cIdx];
                    const isHovered = hoveredCell && hoveredCell.r === rIdx && hoveredCell.c === cIdx;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="matrix-cell"
                        style={getCellColorStyle(val, isDiagonal)}
                        onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx, val, trueClass, predClass })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {val}%
                        {isHovered && (
                          <div className="matrix-tooltip">
                            <div><strong>True:</strong> {fullClassNames[trueClass]} ({trueClass})</div>
                            <div><strong>Predicted:</strong> {fullClassNames[predClass]} ({predClass})</div>
                            <div style={{ marginTop: '0.2rem', color: 'var(--primary)' }}><strong>Rate:</strong> {val}% accuracy match</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Legend */}
              <div className="matrix-legend">
                <div className="legend-item">
                  <div className="legend-color bg-emerald-500 border border-emerald-400"></div>
                  <span>True Positive Diagonal</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color bg-rose-500/20 border border-rose-500/50"></div>
                  <span>Misclassification Error</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Scorecard Metrics */}
          <div className="clinical-card">
            <h3 className="dashboard-card-title">
              <Layers size={18} /> Validation Scorecard Metrics
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  <span>Sensitivity (Recall)</span>
                  <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>93.4%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '93.4%', background: 'var(--secondary)', borderRadius: '3px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Indicates the system’s ability to correctly identify malignant lesions (low false-negative rate).</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  <span>Specificity</span>
                  <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>96.1%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '96.1%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Measures the accuracy in recognizing healthy skin controls or benign lesions (low false-alarm rate).</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  <span>Precision (PPV)</span>
                  <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>94.2%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '94.2%', background: 'var(--warning)', borderRadius: '3px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Percentage of positive calls that are true lesions. Crucial for limiting unnecessary skin biopsies.</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  <span>F1-Score</span>
                  <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>93.8%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '93.8%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '3px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Harmonic mean of precision and recall. Demonstrates overall robust model performance across unbalanced datasets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
