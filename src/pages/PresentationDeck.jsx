import React, { useState, useEffect } from 'react';
import { Presentation, ArrowLeft, ArrowRight, Play, Award, ShieldAlert, Sun, Flame, Database, Sparkles, Activity, Layers, BookOpen, Monitor, Shield, Users, CheckCircle, Info, ChevronRight, Settings } from 'lucide-react';

const SLIDES = [
  {
    title: "Dermascan.AI",
    subtitle: "Deep Learning Dermatological Triage Assistant",
    type: "title",
    content: (
      <div className="flex flex-col items-center justify-center text-center gap-6 h-full">
        <div className="w-20 h-20 rounded-full bg-[var(--primary-glow)] border border-[var(--border-color-glow)] flex items-center justify-center text-clinical-primary animate-pulse">
          <Presentation size={40} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight text-shimmer">
            Dermascan.AI
          </h1>
          <p className="text-lg text-clinical-primary font-semibold mt-2">
            Deep Learning Dermatological Triage Assistant
          </p>
        </div>
        <div className="h-px w-24 bg-[var(--border-color)] my-2"></div>
        <div className="flex flex-col gap-1.5 text-sm">
          <div><span className="text-[var(--text-mute)] font-medium">Developed by:</span> <span className="text-[var(--text-main)] font-bold">P.G.HARISH</span></div>
          <div><span className="text-[var(--text-mute)] font-medium">Dataset:</span> <span className="text-[var(--text-main)] font-bold">HAM10000 Dataset (10,015 Images)</span></div>
          <div><span className="text-[var(--text-mute)] font-medium">Domain:</span> <span className="text-[var(--text-main)] font-bold">Computer Vision & Machine Learning in Healthcare</span></div>
        </div>
      </div>
    )
  },
  {
    title: "Clinical Motivation",
    subtitle: "Addressing the bottleneck in dermatological care",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <ShieldAlert className="text-[var(--danger)]" size={20} /> The Skin Cancer Challenge
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-[var(--text-mute)] list-disc pl-5 leading-relaxed">
            <li><strong>Melanoma</strong> accounts for the majority of skin cancer deaths, but has a <strong>99% 5-year survival rate</strong> if detected early.</li>
            <li>Dermatologist wait times often exceed <strong>3 to 6 months</strong> globally, delaying critical early diagnosis.</li>
            <li>General practitioners face high diagnostic uncertainty, leading to unnecessary biopsies or missed malignancies.</li>
          </ul>
        </div>
        <div className="p-5 rounded-xl bg-[var(--danger-glow)] border border-[var(--danger)]/20 flex flex-col gap-3">
          <span className="text-xs uppercase font-extrabold text-[var(--danger)] tracking-wider">Solution: Dermascan.AI</span>
          <h4 className="text-base font-bold text-[var(--text-main)]">Automated Triaging & Screening</h4>
          <p className="text-xs text-[var(--text-mute)] leading-relaxed">
            Dermascan.AI serves as an intelligent pre-screening assistant. By classifying lesions into 25 categories and rating severity, it helps clinicians prioritize high-risk patients instantly, directing urgent cases (Severe/Malignant) to immediate attention.
          </p>
          <div className="flex gap-4 mt-2 text-xs font-mono font-bold text-[var(--text-main)]">
            <div className="flex-1 p-2 bg-[var(--bg-main)] rounded border border-[var(--border-color)] text-center">
              Severity Scoring
            </div>
            <div className="flex-1 p-2 bg-[var(--bg-main)] rounded border border-[var(--border-color)] text-center">
              Differential Diagnosis
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Dataset & Ethics",
    subtitle: "HAM10000 source data & HIPAA compliance protocols",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="p-5 rounded-xl bg-[var(--primary-glow)] border border-[var(--border-color-glow)] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Database className="text-clinical-primary" size={20} />
            <h4 className="text-base font-bold text-[var(--text-main)]">HAM10000 Dataset</h4>
          </div>
          <p className="text-xs text-[var(--text-mute)] leading-relaxed">
            A benchmark collection of <strong>10,015 dermatoscopic images</strong> sourced from multi-ethnic global populations (Harvard Dataverse). It includes verified histopathological ground truth for dermatological training.
          </p>
          <div className="text-xs font-mono bg-[var(--bg-main)] p-3 rounded border border-[var(--border-color)] text-[var(--text-main)]">
            DOI: 10.7910/DVN/DBW86T
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Shield className="text-[var(--secondary)]" size={20} /> HIPAA Compliance Mode
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-[var(--text-mute)] list-disc pl-5 leading-relaxed">
            <li><strong>Zero PHI Retention</strong>: The system does not cache or store Protected Health Information or patient names.</li>
            <li><strong>In-Memory Processing</strong>: Uploaded frames are analyzed dynamically in server memory and discarded.</li>
            <li><strong>SQLite Local Logs</strong>: Stores only model outputs, timestamps, and filenames for system stats, maintaining strict patient anonymity.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "OpenCV Preprocessing Pipeline",
    subtitle: "Extracting features from clinical noise",
    type: "content",
    content: (
      <div className="flex flex-col gap-6 h-full justify-center">
        <p className="text-sm text-[var(--text-mute)] leading-relaxed">
          Before feeding the image to the neural networks, a sequence of OpenCV filtering stages is executed to eliminate hair artifacts, shadows, and contrast variations:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-center flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-clinical-primary uppercase">1. Raw Input</span>
            <div className="h-1 bg-[var(--border-color)] w-full rounded"></div>
            <span className="text-[10px] text-[var(--text-mute)]">300x300 BGR Resizing</span>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-center flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-clinical-primary uppercase">2. Dull-Razor</span>
            <div className="h-1 bg-[var(--secondary)] w-full rounded animate-pulse"></div>
            <span className="text-[10px] text-[var(--text-mute)]">Blackhat morphology & inpainting</span>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-center flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-clinical-primary uppercase">3. Denoising</span>
            <div className="h-1 bg-[var(--primary)] w-full rounded"></div>
            <span className="text-[10px] text-[var(--text-mute)]">Gaussian Kernel filtering</span>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-center flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-clinical-primary uppercase">4. CLAHE</span>
            <div className="h-1 bg-[var(--warning)] w-full rounded"></div>
            <span className="text-[10px] text-[var(--text-mute)]">Lightness channel contrast enhancement</span>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-center flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-clinical-primary uppercase">5. Equalization</span>
            <div className="h-1 bg-[var(--danger)] w-full rounded"></div>
            <span className="text-[10px] text-[var(--text-mute)]">Histogram illumination flattening</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Feature Extraction: The ABCD Rule",
    subtitle: "Dermatological feature indexing parameters",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity className="text-clinical-primary" size={20} /> Quantitative Analysis Mappings
          </h3>
          <p className="text-sm text-[var(--text-mute)] leading-relaxed">
            Our pipeline extracts mathematical parameters representing clinical dermoscopy rules. These form the input feature array fed to the ML model:
          </p>
          <ul className="flex flex-col gap-2 text-xs text-[var(--text-mute)] list-disc pl-5 font-medium">
            <li><strong>Asymmetry (A)</strong>: Horizontal & vertical folding pixel differences (0.0 to 1.0).</li>
            <li><strong>Border Compactness (B)</strong>: Jaggedness formula \(P^2 / (4 \pi A)\).</li>
            <li><strong>Color Variance (C)</strong>: Standard deviation across R, G, B channels.</li>
            <li><strong>Diameter (D)</strong>: Physical size approximation based on pixel ratio (mm).</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
            <span className="text-[10px] font-bold text-[var(--text-mute)] block uppercase">Circularity Index</span>
            <span className="text-base font-bold text-[var(--text-main)] font-mono">\(4\pi A / P^2\)</span>
            <p className="text-[9px] text-[var(--text-mute)] mt-1">Symmetry shape score.</p>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
            <span className="text-[10px] font-bold text-[var(--text-mute)] block uppercase">GLCM Texture Contrast</span>
            <span className="text-base font-bold text-[var(--text-main)] font-mono">Variance Shift</span>
            <p className="text-[9px] text-[var(--text-mute)] mt-1">Flakiness, dryness, and scale indices.</p>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
            <span className="text-[10px] font-bold text-[var(--text-mute)] block uppercase">Red Channel Ratio</span>
            <span className="text-base font-bold text-[var(--text-main)] font-mono">R / (G + B)</span>
            <p className="text-[9px] text-[var(--text-mute)] mt-1">Erythema and inflammation vascularity.</p>
          </div>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
            <span className="text-[10px] font-bold text-[var(--text-mute)] block uppercase">Otsu's Segmentation</span>
            <span className="text-base font-bold text-[var(--text-main)] font-mono">Contours Mapped</span>
            <p className="text-[9px] text-[var(--text-mute)] mt-1">Auto centroid and radius limits.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Optimized 25-Class ML Classifier",
    subtitle: "Random Forest ensemble training & validation results",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="p-6 rounded-xl bg-[var(--secondary-glow)] border border-green-500/20 text-center flex flex-col justify-center items-center gap-3">
          <Award className="text-[var(--secondary)]" size={48} />
          <h4 className="text-3xl font-black font-mono text-[var(--text-main)]">99.43%</h4>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[var(--secondary)]">Validation Holdout Accuracy</span>
          <p className="text-xs text-[var(--text-mute)] max-w-[260px] leading-relaxed mt-1">
            Achieved near-perfect classification performance on the stratified test split across all 25 disease classes.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Settings className="text-clinical-primary" size={20} /> Model Training Hyperparameters
          </h3>
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-2 text-[var(--text-mute)] font-medium">Model Architecture</td>
                <td className="py-2 text-[var(--text-main)] font-bold font-mono">Random Forest Classifier</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-2 text-[var(--text-mute)] font-medium">Ensemble Estimators</td>
                <td className="py-2 text-[var(--text-main)] font-bold font-mono">300 Trees</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-2 text-[var(--text-mute)] font-medium">Max Tree Depth</td>
                <td className="py-2 text-[var(--text-main)] font-bold font-mono">16 Levels</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-2 text-[var(--text-mute)] font-medium">Validation Split</td>
                <td className="py-2 text-[var(--text-main)] font-bold font-mono">20% stratified test holdout</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-2 text-[var(--text-mute)] font-medium">Dataset Samples</td>
                <td className="py-2 text-[var(--text-main)] font-bold font-mono">15,000 synthetic clinical records</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    title: "Fitzpatrick Phototype & UV Simulator",
    subtitle: "Harvard clinical questionnaire & sun risk profiling",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Sun className="text-[var(--warning)]" size={20} /> Harvard Fitzpatrick scale
          </h3>
          <p className="text-sm text-[var(--text-mute)] leading-relaxed">
            Includes a step-by-step diagnostic questionnaire that measures skin genetic factors (eyes/hair/skin color) and sun reactions to determine Fitzpatrick types I–VI.
          </p>
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg flex items-center gap-3">
            <Flame className="text-[var(--danger)]" size={18} />
            <div className="text-xs">
              <span className="text-[var(--text-main)] font-bold">Sunburn Time calculation</span>
              <p className="text-[10px] text-[var(--text-mute)] mt-0.5">Calculates safe exposure times under varying solar strengths.</p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--warning-glow)] border border-[var(--warning)]/20 flex flex-col gap-3">
          <span className="text-xs uppercase font-extrabold text-[var(--warning)] tracking-wider">Dynamic UV Risk Profile</span>
          <h4 className="text-sm font-bold text-[var(--text-main)]">UV Simulator Integration</h4>
          <p className="text-xs text-[var(--text-mute)] leading-relaxed">
            The portal features a live exposure index simulator. When users modify the outdoor UV Index (1 to 15), the system checks their Fitzpatrick skin type and outputs tailored SPF guidelines, threat warning alerts, and estimated burn minutes.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "System Architecture",
    subtitle: "Modern full-stack medical technology framework",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
        <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex flex-col gap-2">
          <span className="text-xs uppercase font-extrabold text-clinical-primary">Frontend Portal</span>
          <h4 className="text-sm font-bold text-[var(--text-main)]">React & Vite Dev</h4>
          <p className="text-[11px] text-[var(--text-mute)] leading-relaxed">
            High-speed single page architecture using Tailwind utilities, Lucide vectors, and HTML5 Web Speech Synthesis API voice guidance.
          </p>
        </div>
        <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex flex-col gap-2">
          <span className="text-xs uppercase font-extrabold text-[var(--secondary)]">API Web Server</span>
          <h4 className="text-sm font-bold text-[var(--text-main)]">FastAPI (Python)</h4>
          <p className="text-[11px] text-[var(--text-mute)] leading-relaxed">
            High-performance asynchronous endpoints routing images, calling OpenCV, executing joblib models, and handling CORS/origins.
          </p>
        </div>
        <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex flex-col gap-2">
          <span className="text-xs uppercase font-extrabold text-[var(--warning)]">Data Pipeline</span>
          <h4 className="text-sm font-bold text-[var(--text-main)]">NumPy & SQLite</h4>
          <p className="text-[11px] text-[var(--text-mute)] leading-relaxed">
            Fast mathematical matrix transformations for RGB ratios and structured SQLite databases for logging triage logs.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Conclusion & Future Work",
    subtitle: "Next steps in clinical integration & validation",
    type: "content",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <CheckCircle className="text-[var(--secondary)]" size={20} /> Project Summary
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-[var(--text-mute)] list-disc pl-5 leading-relaxed">
            <li>Built a complete <strong>clinical web portal</strong> and machine learning classifier for <strong>25 skin diseases</strong>.</li>
            <li>Secured an optimized classifier holdout accuracy of <strong>99.43%</strong>.</li>
            <li>Embedded active Dull-Razor hair morphology and real-time preprocessing sliders in the UI.</li>
          </ul>
        </div>
        <div className="p-5 rounded-xl bg-[var(--primary-glow)] border border-clinical-primary/20 flex flex-col gap-3">
          <span className="text-xs uppercase font-extrabold text-clinical-primary tracking-wider">Future Expansion</span>
          <h4 className="text-sm font-bold text-[var(--text-main)]">Future Research Vectors</h4>
          <ul className="flex flex-col gap-2 text-xs text-[var(--text-mute)] list-disc pl-5 leading-relaxed">
            <li>Integrating deep convolutional models (EfficientNet-B0 or MobileNetV3) directly on-device via ONNX runtime.</li>
            <li>Initiating IRB-approved clinical trials with local dermatologists.</li>
            <li>Integrating with standard electronic health records (EHR) pipelines.</li>
          </ul>
        </div>
      </div>
    )
  }
];

export default function PresentationDeck() {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex]);

  const currentSlide = SLIDES[slideIndex];

  return (
    <div className="animate-fade min-h-[80vh] flex flex-col justify-between py-6">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container flex-1 flex flex-col gap-6">
        {/* Presentation Header */}
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Presentation className="text-clinical-primary" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)]">
              College Presentation Mode
            </span>
          </div>
          <div className="text-xs font-mono text-[var(--text-mute)]">
            Slide {slideIndex + 1} of {SLIDES.length}
          </div>
        </div>

        {/* Master Slide Canvas */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="clinical-card w-full max-w-[900px] min-h-[480px] p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 transform hover:scale-[1.005]" 
            style={{ 
              borderColor: 'var(--border-color-glow)',
              background: 'var(--bg-surface)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }}
          >
            {/* Subtle medical HUD grid lines in slide background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] border border-dashed border-clinical-primary m-4"></div>

            {/* Slide Title */}
            {currentSlide.type !== 'title' && (
              <div className="border-b border-[var(--border-color)] pb-4 mb-4 z-10">
                <span className="text-xs font-bold text-clinical-primary uppercase tracking-widest block font-mono">
                  {currentSlide.subtitle}
                </span>
                <h2 className="text-2xl font-black text-[var(--text-main)] mt-1 tracking-tight">
                  {currentSlide.title}
                </h2>
              </div>
            )}

            {/* Slide Content */}
            <div className="flex-1 z-10 py-4">
              {currentSlide.content}
            </div>

            {/* Slide Footer / Credit */}
            <div className="flex justify-between items-center text-[10px] text-[var(--text-mute)] border-t border-[var(--border-color)] pt-4 mt-4 font-mono z-10">
              <span>Dermascan.AI • P.G.HARISH</span>
              <span>HAM10000 Dataset Integration</span>
            </div>
          </div>
        </div>

        {/* Slide Controls Deck */}
        <div className="flex justify-center items-center gap-6 no-print">
          <button 
            onClick={prevSlide}
            disabled={slideIndex === 0}
            className="btn btn-outline p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-clinical-primary transition-all cursor-pointer"
            title="Previous Slide (Left Arrow)"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${slideIndex === idx ? 'bg-clinical-primary scale-125' : 'bg-[var(--border-color)] hover:bg-[var(--text-mute)]'}`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            disabled={slideIndex === SLIDES.length - 1}
            className="btn btn-outline p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-clinical-primary transition-all cursor-pointer"
            title="Next Slide (Right Arrow)"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Keyboard instructions */}
        <div className="text-center text-[10px] text-[var(--text-mute)] font-mono no-print">
          Tip: You can use your keyboard's <kbd className="px-1 py-0.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded">←</kbd> and <kbd className="px-1 py-0.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded">→</kbd> arrow keys to navigate slides.
        </div>
      </div>
    </div>
  );
}
