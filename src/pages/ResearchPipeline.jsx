import React, { useState } from 'react';
import { ArrowRight, Image, Sparkles, Scissors, Cpu, Activity, Award, FileText } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 'input',
    title: '1. Lesion Input',
    subtitle: 'Clinical Dermatoscope',
    icon: <Image size={20} />,
    description: 'High-resolution dermatoscopic capture of the skin lesion, calibrated to correct sensor illumination variations and alignment grids.'
  },
  {
    id: 'preprocessing',
    title: '2. Dull-Razor Filter',
    subtitle: 'Hair Occlusion Removal',
    icon: <Scissors size={20} />,
    description: 'Morphological operators detect linear dark structures (hairs) within the lesion frame. Hairs are isolated and replaced via bilinear interpolation using neighboring skin pixels.'
  },
  {
    id: 'segmentation',
    title: '3. U-Net Segmentation',
    subtitle: 'Lesion Border Masking',
    icon: <Sparkles size={20} />,
    description: 'A deep convolutional encoder-decoder network segmentizes the lesion border. By focusing the attention solely on the isolated lesion, background skin artifacts are pruned.'
  },
  {
    id: 'backbone',
    title: '4. CNN + ViT Backbone',
    subtitle: 'Ensemble Classification',
    icon: <Cpu size={20} />,
    description: 'An ensemble consisting of EfficientNet-B4 (fine textures) and a Vision Transformer (global geometry and asymmetry) processes the masked lesion to calculate classification probabilities.'
  },
  {
    id: 'severity',
    title: '5. Severity Regressor',
    subtitle: 'Triage Risk Grading',
    icon: <Activity size={20} />,
    description: 'A multi-criteria regression head processes classification vectors alongside lesion diameter and red-channel intensity to generate a normalized 0-10 severity score.'
  },
  {
    id: 'report',
    title: '6. Diagnostic Output',
    subtitle: 'Explainable Report',
    icon: <Award size={20} />,
    description: 'Aggregates the diagnosis probabilities, severity score, and Grad-CAM neural attention overlays into an interactive clinic-ready triage scorecard.'
  }
];

export default function ResearchPipeline() {
  const [activeStep, setActiveStep] = useState('input');

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Technical Architecture & Pipeline</h2>
          <p>
            Understand the end-to-end computer vision pipeline, from initial dermatoscope preprocessing to multi-task neural network classification.
          </p>
        </div>

        {/* Interactive Pipeline Diagram */}
        <div className="pipeline-diagram">
          <div className="pipeline-flow">
            {PIPELINE_STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className="pipeline-step-node"
                  style={{
                    borderColor: activeStep === step.id ? 'var(--primary)' : 'var(--border-color)',
                    boxShadow: activeStep === step.id ? '0 0 15px var(--primary-glow)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <div className="pipeline-step-icon" style={{
                    backgroundColor: activeStep === step.id ? 'var(--primary)' : 'rgba(14, 165, 233, 0.1)',
                    color: activeStep === step.id ? 'var(--text-dark)' : 'var(--primary)'
                  }}>
                    {step.icon}
                  </div>
                  <div className="pipeline-step-title">{step.title}</div>
                  <div className="pipeline-step-subtitle">{step.subtitle}</div>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="pipeline-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="clinical-card" style={{ marginBottom: '4rem', borderLeft: '4px solid var(--primary)' }}>
          {PIPELINE_STEPS.map(step => (
            step.id === activeStep && (
              <div key={step.id} className="animate-fade">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--primary)' }}>{step.title}</span> — {step.subtitle}
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {step.description}
                </p>
              </div>
            )
          ))}
        </div>

        {/* Technical Deep Dive Sections */}
        <div className="section-title" style={{ marginBottom: '2.5rem' }}>
          <h2>Deep-Dive Methodology</h2>
        </div>

        <div className="methodology-grid">
          <div className="clinical-card methodology-card">
            <h3>Dull-Razor Hair Removal</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              Dermatological images often contain hair occlusion that degrades classification metrics. Our Dull-Razor algorithm executes linear morphological closing filters along multi-directional axes. Pixels identified as hair paths are masked and filled using bilateral skin interpolations, preserving underlying lesion pigmentation boundaries.
            </p>
          </div>

          <div className="clinical-card methodology-card">
            <h3>Lesion Segmentation via U-Net</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              To ensure the CNN classifier evaluates only the pathological structure, we train a customized U-Net segmentation network. The network localizes the boundary contour of the lesion and isolates it. This removes background skin structures, lighting gradients, and diagnostic scale-markings, leading to a 3.2% rise in macro-F1 classification scores.
            </p>
          </div>

          <div className="clinical-card methodology-card">
            <h3>EfficientNet + ViT Voting Ensemble</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              Our model employs a dual-branch neural architecture. Branch A is an EfficientNet-B4 pre-trained on ImageNet, extracting fine-grained micro-structure parameters (e.g. vascular details). Branch B is a Vision Transformer (ViT) processing patch representations to measure global shape symmetry. The outputs are aggregated through a weighted soft-voting layer.
            </p>
          </div>

          <div className="clinical-card methodology-card">
            <h3>Risk Assessment Severity Grading</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              The severity regression head leverages a multi-task learning layout. It calculates the malignancy risk and correlates it with clinical factors: diameter size, border irregularity index, and color variance coefficients. This outputs a severity grade from 0.0 to 10.0, allowing hospitals to automatically triage urgent melanoma cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
