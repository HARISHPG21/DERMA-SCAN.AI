import React from 'react';
import { Activity, ShieldAlert, Cpu, Sparkles, Award, Zap, BarChart2, Shield, ExternalLink } from 'lucide-react';

export default function Home({ setPage }) {
  return (
    <div className="animate-fade">
      {/* Glow backgrounds */}
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        {/* Hero Section */}
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} /> Next-Generation Medical AI
            </div>
            <div className="text-[var(--text-mute)] text-xs font-mono font-bold tracking-wider mb-2 uppercase">
              Project Created By <span className="text-shimmer font-extrabold">P.G.HARISH</span>
            </div>
            <h1 className="hero-title">
              Skin Disease Detection <span>& Severity Classification</span>
            </h1>
            <p className="hero-desc">
              A deep-learning diagnostic assistant designed to analyze dermatoscopic skin lesions.
              Leveraging advanced convolutional networks and visual attention, the system provides
              classification probabilities, severity grading, and explainable Grad-CAM activation maps.
            </p>
            <p className="hero-desc" style={{ marginTop: '-1.5rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'var(--text-mute)' }}>
              Dataset Used: <a href="https://doi.org/10.7910/DVN/DBW86T" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>HAM10000 Dataset <ExternalLink size={12} /></a>
            </p>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={() => setPage('scan')}>
                <Activity size={18} /> Launch Diagnostic Console
              </button>
              <button className="btn btn-outline" onClick={() => setPage('insights')}>
                <BarChart2 size={18} /> Review Model Metrics
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-bg-circle"></div>
            <div className="visual-bg-circle-outer animate-pulse"></div>
            <div className="hero-image-container">
              <div className="hero-graphic-grid"></div>
              <img 
                src="/skin_lesion_scan.png" 
                alt="AI Skin Lesion Scan" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  zIndex: 2,
                  borderRadius: '22px'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="clinical-card stat-card">
            <div className="stat-num">94.8%</div>
            <div className="stat-label">Model Accuracy</div>
          </div>
          <div className="clinical-card stat-card">
            <div className="stat-num">10k+</div>
            <div className="stat-label">Dataset Samples</div>
          </div>
          <div className="clinical-card stat-card">
            <div className="stat-num">7</div>
            <div className="stat-label">Lesion Classes</div>
          </div>
          <div className="clinical-card stat-card">
            <div className="stat-num">&lt;250ms</div>
            <div className="stat-label">Inference Time</div>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="section-title">
          <h2>Clinical Intelligence Features</h2>
          <p>Designed with medical efficacy, explainability, and speed in mind to serve as a reliable triage tool for dermatologists.</p>
        </div>

        <div className="feature-grid">
          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <Cpu size={24} />
            </div>
            <h3>Deep Ensemble Classifier</h3>
            <p>
              Employs an ensemble of pre-trained convolutional neural networks (CNNs) and Vision Transformers
              optimized to extract fine-grained visual features from lesion dermatoscope captures.
            </p>
          </div>

          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <ShieldAlert size={24} />
            </div>
            <h3>Severity Regression</h3>
            <p>
              Beyond basic classification, our custom regression head computes a severity score indices based on clinical parameters,
              guiding emergency priorities (triage category).
            </p>
          </div>

          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <Award size={24} />
            </div>
            <h3>Explainable AI (Grad-CAM)</h3>
            <p>
              Enhances diagnostic trust by highlighting visual regions of interest using Gradient-weighted
              Class Activation Mapping, showing exactly where the network looked to render its prediction.
            </p>
          </div>

          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3>Sub-Second Inference</h3>
            <p>
              Optimized model architectures and quantized parameters ensure lightning-fast scans, making
              the tool suitable for clinical point-of-care environments.
            </p>
          </div>

          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <BarChart2 size={24} />
            </div>
            <h3>Detailed Diagnostics</h3>
            <p>
              Retrieves primary diagnoses alongside confidence intervals, secondary differential diagnoses,
              and risk scoring metrics complete with medical guidelines.
            </p>
          </div>

          <div className="clinical-card feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>Privacy Centric</h3>
            <p>
              No patient health information (PHI) is stored. All images are processed client-side or
              securely stream-analyzed under standard security protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
