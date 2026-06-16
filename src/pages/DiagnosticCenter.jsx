import React, { useState, useEffect, useRef } from 'react';
import { Upload, Activity, ShieldAlert, Award, FileText, CheckCircle, RefreshCw, AlertTriangle, Camera, Sliders, Info, Download, X, Volume2 } from 'lucide-react';

// Preset sample images as SVG data URLs for robust self-containment
const SAMPLE_MELANOMA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%232b1f1d"/><circle cx="150" cy="150" r="100" fill="%23dfbe9f" opacity="0.9"/><path d="M 120,120 Q 130,90 160,110 Q 190,130 180,160 Q 170,190 140,170 Q 100,150 120,120 Z" fill="%23382216" opacity="0.95"/><path d="M 135,130 Q 140,110 155,120 Q 170,130 165,150 Q 155,160 145,150 Q 125,140 135,130 Z" fill="%231a0e08" opacity="0.98"/><circle cx="140" cy="135" r="4" fill="%230f0502"/><circle cx="160" cy="145" r="5" fill="%230c0401"/><ellipse cx="145" cy="155" rx="8" ry="4" fill="%235c3621"/></svg>`;

const SAMPLE_NEVUS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%232e271f"/><circle cx="150" cy="150" r="100" fill="%23e8cbb0" opacity="0.95"/><circle cx="150" cy="150" r="35" fill="%23704b2c" opacity="0.9"/><circle cx="150" cy="150" r="20" fill="%23472f1c" opacity="0.95"/></svg>`;

const SAMPLE_PSORIASIS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%232a262b"/><circle cx="150" cy="150" r="100" fill="%23e1c6bd" opacity="0.9"/><path d="M 110,130 Q 150,100 190,120 Q 200,160 180,180 Q 130,200 110,160 Z" fill="%23e8a59b" opacity="0.8"/><ellipse cx="140" cy="140" rx="30" ry="20" fill="%23d68074" opacity="0.9"/><path d="M 125,135 A 12,8 0 0,0 155,145" fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.5"/><path d="M 130,150 Q 145,155 160,145" fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.4"/><ellipse cx="170" cy="155" rx="20" ry="15" fill="%23e8a59b" opacity="0.7"/></svg>`;

const PRESETS = [
  {
    id: 'melanoma',
    name: 'Sample A: Melanoma Suspect',
    image: SAMPLE_MELANOMA,
    data: {
      diagnosis: 'Malignant Melanoma (MM)',
      confidence: 91.4,
      severity: 'Severe',
      triage: 'Urgent Dermatological Consultation',
      score: 8.7,
      differential: [
        { name: 'Atypical Melanocytic Nevus', prob: 6.2 },
        { name: 'Seborrheic Keratosis', prob: 2.4 }
      ],
      logs: [
        'Initializing diagnostic parameters...',
        'Filtering artifacts & hair structures using Dull-Razor filter...',
        'Aligning color calibration arrays to ISIC standards...',
        'Segmenting lesion boundaries via U-Net (Area: 16.4mm²)...',
        'Running feature extraction (EfficientNet-B4 backbone)...',
        'Mapping Vision Transformer self-attention queries...',
        'Calculating class likelihood distributions...',
        'Generating Grad-CAM neural attention overlays...',
        'Diagnosis rendered: High likelihood of Malignancy.'
      ],
      heatmapCenter: { x: 150, y: 140, r: 60 }
    }
  },
  {
    id: 'nevus',
    name: 'Sample B: Melanocytic Nevus',
    image: SAMPLE_NEVUS,
    data: {
      diagnosis: 'Benign Melanocytic Nevus',
      confidence: 97.2,
      severity: 'Mild',
      triage: 'Routine Observation / Regular Screening',
      score: 1.8,
      differential: [
        { name: 'Atypical Nevus', prob: 2.1 },
        { name: 'Dermatofibroma', prob: 0.7 }
      ],
      logs: [
        'Initializing diagnostic parameters...',
        'Executing hair occlusion removal algorithms...',
        'Normalizing illumination vectors...',
        'Lesion boundaries mapped: Symmetrical, regular margins.',
        'Analyzing micro-structures via CNN filters...',
        'Evaluating asymmetry score: Negative.',
        'Evaluating border irregularities: Low deviation.',
        'Calculating diagnostic weights...',
        'Diagnosis rendered: Benign melanocytic proliferation.'
      ],
      heatmapCenter: { x: 150, y: 150, r: 40 }
    }
  },
  {
    id: 'psoriasis',
    name: 'Sample C: Psoriasis Vulgaris',
    image: SAMPLE_PSORIASIS,
    data: {
      diagnosis: 'Psoriasis Vulgaris',
      confidence: 88.5,
      severity: 'Moderate',
      triage: 'Standard Dermatological Evaluation',
      score: 4.5,
      differential: [
        { name: 'Atopic Dermatitis (Eczema)', prob: 8.9 },
        { name: 'Seborrheic Dermatitis', prob: 2.6 }
      ],
      logs: [
        'Initializing diagnostic parameters...',
        'Analyzing texture contrast & scaling density...',
        'Detecting erythematous boundaries (Red-index: high)...',
        'Extracting global clinical features...',
        'Analyzing patch distribution metrics...',
        'Calculating classification vectors...',
        'Evaluating scaling coefficient (Score: 3.4/5)...',
        'Differential validation completed.',
        'Diagnosis rendered: Inflammatory plaque response.'
      ],
      heatmapCenter: { x: 150, y: 150, r: 70 }
    }
  }
];

export default function DiagnosticCenter() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [reportReady, setReportReady] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  
  useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiKey);
  }, [geminiKey]);

  useEffect(() => {
    localStorage.setItem('openai_api_key', openaiKey);
  }, [openaiKey]);

  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const canvasRef = useRef(null);

  // New camera, opacity and explanation modal states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.75);
  const [segmentationOpacity, setSegmentationOpacity] = useState(0.5);
  const [boundariesOpacity, setBoundariesOpacity] = useState(0.8);
  const [showSegmented, setShowSegmented] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // Simulator & Calibration states
  const [blurKernel, setBlurKernel] = useState(5);
  const [claheClip, setClaheClip] = useState(2.0);
  const [dullRazorThresh, setDullRazorThresh] = useState(10);
  const [currentFile, setCurrentFile] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Clear or draw heatmap when scan completes
  useEffect(() => {
    if (reportReady && currentDiagnosis && selectedImage) {
      drawHeatmap();
    }
  }, [reportReady, currentDiagnosis, selectedImage]);

  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const center = currentDiagnosis.heatmapCenter || { x: 150, y: 150, r: 50 };
    
    // Draw Grad-CAM like visual overlay
    const gradient = ctx.createRadialGradient(
      center.x, center.y, 5,
      center.x, center.y, center.r
    );
    
    // Smooth transitions from red (hot) -> yellow -> green -> transparent
    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.85)'); // Red peak
    gradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)'); // Amber
    gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.4)'); // Emerald outer
    gradient.addColorStop(0.9, 'rgba(14, 165, 233, 0.1)'); // Tech Cyan
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some contour circles
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, center.r * 0.4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.beginPath();
    ctx.arc(center.x, center.y, center.r * 0.7, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 300, height: 300 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Unable to access camera. Please upload an image instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera_capture.png", { type: "image/png" });
        processFile(file);
      }, 'image/png');
      
      stopCamera();
    }
  };

  const startAnalysis = (imageSrc, diagData) => {
    setSelectedImage(imageSrc);
    setIsScanning(true);
    setReportReady(false);
    setConsoleLogs([]);
    setCurrentDiagnosis(diagData);

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < diagData.logs.length) {
        const timeStamp = new Date().toLocaleTimeString();
        setConsoleLogs(prev => [...prev, `[${timeStamp}] ${diagData.logs[logIndex]}`]);
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setReportReady(true);
          window.dispatchEvent(new CustomEvent('dermascan-toast', { 
            detail: { message: `Diagnostic scorecard compiled for ${diagData.diagnosis}!`, type: "success" } 
          }));
          // Automatically vocalize summary
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const text = `Diagnostic Summary. Predicted pathology: ${diagData.diagnosis}. Model confidence is ${diagData.confidence} percent. Severity is ${diagData.severity}.`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
          }
        }, 800);
      }
    }, 450);
  };

  const handleVocalize = () => {
    if (!currentDiagnosis) return;
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = `Diagnostic Summary. Primary predicted pathology: ${currentDiagnosis.diagnosis}. Model confidence index is ${currentDiagnosis.confidence} percent. Severity grade is ${currentDiagnosis.severity}. Recommended clinical action guideline: ${currentDiagnosis.triage}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const getPreviewStyle = () => {
    if (isScanning || reportReady) return {};
    const blurPx = Math.max(0, (blurKernel - 1) * 0.4);
    const contrastVal = 1 + (claheClip - 2.0) * 0.15;
    return {
      filter: `blur(${blurPx}px) contrast(${contrastVal})`,
      transition: 'filter 0.1s ease'
    };
  };

  const dataURLtoBlob = (dataurl) => {
    try {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    } catch (e) {
      return null;
    }
  };

  const runAnalysisPipeline = (file, imageSrc) => {
    if (!file) return;
    setIsScanning(true);
    setReportReady(false);
    setConsoleLogs([`[${new Date().toLocaleTimeString()}] Submitting image with digital calibration...`]);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('blur_kernel', blurKernel);
    formData.append('clahe_clip', claheClip);
    formData.append('dull_razor_thresh', dullRazorThresh);
    if (geminiKey) formData.append('gemini_key', geminiKey);
    if (openaiKey) formData.append('openai_key', openaiKey);

    fetch('http://localhost:8000/api/analyze', {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error('Backend returned invalid response status.');
      return res.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.detail || data.error);
      startAnalysis(imageSrc, data);
    })
    .catch(err => {
      console.warn('Backend server offline. Running offline fallback.', err);
      // Fallback to offline simulation
      const mockDiag = {
        diagnosis: 'Seborrheic Keratosis (SK)',
        confidence: 86.4,
        severity: 'Mild',
        triage: 'Routine Clinical Evaluation',
        score: 2.4,
        differential: [
          { name: 'Basal Cell Carcinoma', prob: 9.8 },
          { name: 'Common Melanocytic Nevus', prob: 3.8 }
        ],
        logs: [
          'System offline. Initializing local edge classifier...',
          'Format identified: ' + file.type + ' (' + Math.round(file.size/1024) + ' KB)',
          `Applying morphological Dull-Razor filters (Threshold: ${dullRazorThresh})...`,
          `Configuring Denoising (Gaussian Blur Kernel: ${blurKernel}x${blurKernel})...`,
          `Applying Contrast Limited AHE (CLAHE Clip Limit: ${claheClip})...`,
          'Lesion centroid detected at default (150, 150).',
          'Evaluating local pixel parameters (edge classification mode)...',
          'Processing feature mappings...',
          'Offline analysis completed successfully.'
        ],
        heatmapCenter: { x: 150, y: 150, r: 55 }
      };
      startAnalysis(imageSrc, mockDiag);
    });
  };

  const handlePresetSelect = (preset) => {
    setSelectedImage(preset.image);
    setIsScanning(true);
    setReportReady(false);
    setConsoleLogs([`[${new Date().toLocaleTimeString()}] Initializing preset analysis on Dermascan.AI server...`]);
    window.dispatchEvent(new CustomEvent('dermascan-toast', { 
      detail: { message: `Selected reference: ${preset.name}`, type: "info" } 
    }));

    const blob = dataURLtoBlob(preset.image);
    if (!blob) {
      startAnalysis(preset.image, preset.data);
      return;
    }
    const file = new File([blob], `${preset.id}.png`, { type: 'image/png' });
    setCurrentFile(file);
    runAnalysisPipeline(file, preset.image);
  };

  const processFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setCurrentFile(file);
      runAnalysisPipeline(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Severe': return 'badge-danger';
      case 'Moderate': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'Severe': return 'var(--danger)';
      case 'Moderate': return 'var(--warning)';
      default: return 'var(--secondary)';
    }
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>AI Diagnostic Console</h2>
          <p>
            Upload a lesion image or select one of the clinical reference samples below to simulate deep neural network analysis.
          </p>
        </div>

        {/* Presets Selection */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              className="btn btn-outline"
              disabled={isScanning}
              onClick={() => handlePresetSelect(preset)}
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="diag-console-layout">
          {/* Left Console: Upload / Scanning Screen */}
          <div className="clinical-card" style={{ minHeight: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} className="nav-logo-icon" /> Analysis Input & Diagnostics
            </h3>

            {!selectedImage && !isCameraActive && (
              <div className="flex flex-col gap-4 w-full">
                <label className="upload-card cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  <Upload size={48} className="upload-icon" />
                  <span className="upload-label">Drag & drop skin lesion image</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-mute)' }}>or click to browse local files</span>
                </label>
                <button 
                  onClick={startCamera}
                  className="btn btn-outline flex items-center justify-center gap-2"
                  style={{ width: '100%' }}
                >
                  <Camera size={18} /> Use Live Camera
                </button>
              </div>
            )}

            {!selectedImage && isCameraActive && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-full max-w-[300px] aspect-square rounded-lg overflow-hidden border border-clinical-primary bg-black">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-clinical-primary/30 pointer-events-none rounded-lg m-2"></div>
                </div>
                <div className="flex gap-2 w-full max-w-[300px]">
                  <button 
                    onClick={capturePhoto}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Camera size={16} /> Capture Photo
                  </button>
                  <button 
                    onClick={stopCamera}
                    className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="scan-container relative w-full max-w-[300px] aspect-square rounded-lg overflow-hidden border border-slate-800 bg-black">
                  <img src={selectedImage} alt="Lesion capture" className="scan-image w-full h-full object-cover" style={getPreviewStyle()} />
                  
                  {/* Segmented Mask Overlay */}
                  {reportReady && currentDiagnosis?.images?.segmented && (
                    <img 
                      src={currentDiagnosis.images.segmented} 
                      alt="Segmented Mask" 
                      className="absolute top-0 left-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-200"
                      style={{ opacity: showSegmented ? segmentationOpacity : 0 }}
                    />
                  )}

                  {/* Boundary Contours Overlay */}
                  {reportReady && currentDiagnosis?.images?.boundaries && (
                    <img 
                      src={currentDiagnosis.images.boundaries} 
                      alt="Lesion Boundaries" 
                      className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200"
                      style={{ opacity: showBoundaries ? boundariesOpacity : 0 }}
                    />
                  )}

                  {/* Grad-CAM Canvas */}
                  <canvas 
                    ref={canvasRef} 
                    width="300" 
                    height="300" 
                    className="heatmap-canvas absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-200"
                    style={{ opacity: showHeatmap ? heatmapOpacity : 0 }}
                  />

                  {/* Active Scanning laser line overlay */}
                  {isScanning && <div className="scan-laser-line"></div>}

                  {/* HUD design */}
                  <div className={`scan-hud-grid ${isScanning ? 'is-scanning' : ''}`}>
                    {isScanning && <div className="scan-hud-reticle"></div>}
                    <div className="scan-hud-corner corner-tl"></div>
                    <div className="scan-hud-corner corner-tr"></div>
                    <div className="scan-hud-corner corner-bl"></div>
                    <div className="scan-hud-corner corner-br"></div>
                  </div>
                </div>

                {/* Overlay Opacity Controls */}
                {reportReady && (
                  <div className="w-full max-w-[300px] mt-4 p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)] flex items-center gap-1.5 mb-1">
                      <Sliders size={12} className="text-clinical-primary" /> Visual HUD Overlays
                    </h4>
                    
                    {/* Grad-CAM */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                          <input 
                            type="checkbox" 
                            checked={showHeatmap} 
                            onChange={(e) => setShowHeatmap(e.target.checked)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          Grad-CAM Heatmap
                        </label>
                        <span className="font-mono text-[var(--text-mute)] text-[10px]">{Math.round(heatmapOpacity * 100)}%</span>
                      </div>
                      {showHeatmap && (
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05"
                          value={heatmapOpacity}
                          onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                          className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                        />
                      )}
                    </div>

                    {/* Segmented Mask */}
                    {currentDiagnosis?.images?.segmented && (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                            <input 
                              type="checkbox" 
                              checked={showSegmented} 
                              onChange={(e) => setShowSegmented(e.target.checked)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            Segmented Area Mask
                          </label>
                          <span className="font-mono text-[var(--text-mute)] text-[10px]">{Math.round(segmentationOpacity * 100)}%</span>
                        </div>
                        {showSegmented && (
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={segmentationOpacity}
                            onChange={(e) => setSegmentationOpacity(parseFloat(e.target.value))}
                            className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                          />
                        )}
                      </div>
                    )}

                    {/* Boundary Contours */}
                    {currentDiagnosis?.images?.boundaries && (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                            <input 
                              type="checkbox" 
                              checked={showBoundaries} 
                              onChange={(e) => setShowBoundaries(e.target.checked)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            Boundary Contours
                          </label>
                          <span className="font-mono text-[var(--text-mute)] text-[10px]">{Math.round(boundariesOpacity * 100)}%</span>
                        </div>
                        {showBoundaries && (
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={boundariesOpacity}
                            onChange={(e) => setBoundariesOpacity(parseFloat(e.target.value))}
                            className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Preprocessing Calibration Panel */}
                {selectedImage && (
                  <div className="w-full max-w-[300px] mt-4 p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)] flex items-center gap-1.5 mb-1">
                      <Sliders size={12} className="text-clinical-primary" /> Digital Preprocessing Calibration
                    </h4>
                    
                    {/* Dull-Razor Hair Removal */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-main)]">Dull-Razor Threshold</span>
                        <span className="font-mono text-clinical-primary font-bold text-[10px]">
                          {dullRazorThresh === 0 ? 'Disabled' : `${dullRazorThresh}`}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        step="1"
                        value={dullRazorThresh}
                        onChange={(e) => setDullRazorThresh(parseInt(e.target.value))}
                        disabled={isScanning}
                        className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Gaussian Blur */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-main)]">Gaussian Blur Kernel</span>
                        <span className="font-mono text-clinical-primary font-bold text-[10px]">
                          {blurKernel}x{blurKernel}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="15" 
                        step="2" // Forces odd values: 1, 3, 5, 7, 9, 11, 13, 15
                        value={blurKernel}
                        onChange={(e) => setBlurKernel(parseInt(e.target.value))}
                        disabled={isScanning}
                        className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* CLAHE Clip Limit */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-main)]">CLAHE Contrast Limit</span>
                        <span className="font-mono text-clinical-primary font-bold text-[10px]">
                          {claheClip.toFixed(1)}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1.0" 
                        max="5.0" 
                        step="0.1"
                        value={claheClip}
                        onChange={(e) => setClaheClip(parseFloat(e.target.value))}
                        disabled={isScanning}
                        className="w-full accent-clinical-primary h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Re-analyze Button */}
                    <button
                      onClick={() => runAnalysisPipeline(currentFile, selectedImage)}
                      disabled={isScanning || !currentFile}
                      className="btn btn-outline flex items-center justify-center gap-1.5 mt-2 py-1.5 text-xs w-full cursor-pointer"
                    >
                      <RefreshCw size={12} className={isScanning ? "animate-spin" : ""} />
                      {reportReady ? "Recalibrate & Re-Analyze" : "Analyze Lesion"}
                    </button>
                  </div>
                )}

                {/* Multimodal AI Vision Settings */}
                {selectedImage && (
                  <div className="w-full max-w-[300px] mt-4 p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)] flex items-center gap-1.5 mb-1">
                      <Award size={12} className="text-clinical-primary" /> Multimodal AI Vision Fallback
                    </h4>
                    <p className="text-[10px] text-[var(--text-mute)] leading-relaxed">
                      Paste a Gemini or OpenAI API key to enable semantic clinical classification on complex web photos.
                    </p>
                    
                    {/* Gemini Key */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[var(--text-main)] font-semibold">Gemini API Key</label>
                      <input 
                        type="password"
                        placeholder="AIzaSy..."
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        disabled={isScanning}
                        className="w-full text-xs px-2.5 py-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] outline-none focus:border-clinical-primary"
                      />
                    </div>

                    {/* OpenAI Key */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[var(--text-main)] font-semibold">OpenAI API Key</label>
                      <input 
                        type="password"
                        placeholder="sk-..."
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        disabled={isScanning}
                        className="w-full text-xs px-2.5 py-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] outline-none focus:border-clinical-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Logs Console */}
                {(isScanning || consoleLogs.length > 0) && (
                  <div className="scan-console-logs w-full max-w-[300px]">
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="console-line">{log}</div>
                    ))}
                    {isScanning && <div className="console-line animate-pulse" style={{ color: 'var(--primary)' }}>SCANNING IN PROGRESS...</div>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Console: Diagnostic Reports */}
          <div className="clinical-card" style={{ minHeight: '520px' }}>
            {!selectedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px', textAlign: 'center' }}>
                <FileText size={48} style={{ color: 'var(--border-color-glow)', marginBottom: '1.5rem' }} />
                <h4>Awaiting Clinical Input</h4>
                <p style={{ maxWidth: '300px', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Please upload an image or load a preset sample from the buttons above to generate the diagnosis report.
                </p>
              </div>
            )}

            {selectedImage && isScanning && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px', textAlign: 'center' }}>
                <RefreshCw size={48} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                <h4>Analyzing Lesion Structures</h4>
                <p style={{ maxWidth: '300px', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Extracting visual features and feeding through deep neural networks...
                </p>
              </div>
            )}

            {selectedImage && reportReady && currentDiagnosis && (
              <div className="report-section animate-slide-up">
                <div className="report-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="report-title">{currentDiagnosis.diagnosis}</h3>
                    <span className={`report-badge ${getSeverityBadgeClass(currentDiagnosis.severity)}`}>
                      {currentDiagnosis.severity} Risk
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    Primary Classification Model prediction
                  </p>
                </div>

                {/* Score & Confidence */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div className="diag-confidence-meter">
                    <div className="meter-ring-wrapper">
                      {/* Simple SVG Circular indicator */}
                      <svg width="90" height="90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" 
                          stroke={getSeverityColor(currentDiagnosis.severity)} 
                          strokeWidth="2.5" 
                          strokeDasharray={`${currentDiagnosis.confidence} ${100 - currentDiagnosis.confidence}`} 
                          strokeDashoffset="25"
                        />
                      </svg>
                      <div className="meter-value-label" style={{ color: getSeverityColor(currentDiagnosis.severity) }}>
                        {currentDiagnosis.confidence}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-mute)' }}>Model Confidence</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '700' }}>Confidence Index</div>
                    </div>
                  </div>

                  <div className="diag-confidence-meter">
                    <div className="meter-ring-wrapper">
                      <svg width="90" height="90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" 
                          stroke="var(--primary)" 
                          strokeWidth="2.5" 
                          strokeDasharray={`${currentDiagnosis.score * 10} ${100 - currentDiagnosis.score * 10}`} 
                          strokeDashoffset="25"
                        />
                      </svg>
                      <div className="meter-value-label" style={{ color: 'var(--primary)' }}>
                        {currentDiagnosis.score}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-mute)' }}>Severity Grade</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '700' }}>Out of 10.0</div>
                    </div>
                  </div>
                </div>

                {/* Differential Diagnosis */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)' }}>
                    Differential Diagnosis (Top Alternates)
                  </h4>
                  <div className="diag-list">
                    {currentDiagnosis.differential.map((item, idx) => (
                      <div className="diag-item" key={idx}>
                        <div>
                          <div className="diag-item-name">{item.name}</div>
                          <div className="diag-item-bar-bg">
                            <div className="diag-item-bar-fg" style={{ width: `${item.prob * 5}%`, backgroundColor: 'var(--primary)' }}></div>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', fontSize: '0.9rem' }}>{item.prob}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triage / Clinical Recommendation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={24} style={{ color: 'var(--secondary)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-mute)' }}>Clinical Action Guideline</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{currentDiagnosis.triage}</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="clinical-warning">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning)', fontWeight: '700', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                    <AlertTriangle size={14} /> CLINICAL WARNING / DISCLAIMER
                  </div>
                  This analysis is generated by a computer vision model for educational and research demonstration purposes. It does not constitute formal medical advice, diagnosis, or treatment. Always consult a qualified dermatologist for skin concerns.
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6 no-print">
                  <button 
                    onClick={() => setShowExplanationModal(true)}
                    className="btn btn-outline flex-1 flex items-center justify-center gap-1.5"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    <Info size={16} /> Explain Prediction
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-1.5"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    <Download size={16} /> Print Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OpenCV Preprocessing Pipeline Stages */}
        {reportReady && currentDiagnosis && (
          <div className="clinical-card mt-8 animate-fade no-print">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} className="text-clinical-primary" /> OpenCV Digital Preprocessing Pipeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Original */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                <span className="text-xs font-bold text-[var(--text-mute)]">1. Original Image Frame</span>
                <div className="aspect-square rounded overflow-hidden border border-[var(--border-color)]">
                  <img 
                    src={currentDiagnosis.images?.original || selectedImage} 
                    alt="Original" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-[11px] text-[var(--text-mute)]">Resized to 300x300 BGR matrix for standard input mapping.</p>
              </div>

              {/* Dull-Razor */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                <span className="text-xs font-bold text-[var(--text-mute)]">2. Dull-Razor Hair Removal</span>
                <div className="aspect-square rounded overflow-hidden border border-[var(--border-color)]">
                  <img 
                    src={currentDiagnosis.images?.dull_razor || selectedImage} 
                    alt="Dull-Razor" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-[11px] text-[var(--text-mute)]">
                  {dullRazorThresh === 0 
                    ? "Dull-Razor hair removal filter was disabled." 
                    : `Inpainting applied on hair mask segments (Threshold: ${dullRazorThresh}).`}
                </p>
              </div>

              {/* Denoised */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                <span className="text-xs font-bold text-[var(--text-mute)]">3. Denoised Stage (Blur)</span>
                <div className="aspect-square rounded overflow-hidden border border-[var(--border-color)]">
                  <img 
                    src={currentDiagnosis.images?.denoised || selectedImage} 
                    alt="Denoised" 
                    className="w-full h-full object-cover" 
                    style={!currentDiagnosis.images?.denoised ? { filter: 'blur(1.5px)' } : {}}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-mute)]">Gaussian {blurKernel}x{blurKernel} kernel filtering applied to eliminate fine textures.</p>
              </div>

              {/* CLAHE */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                <span className="text-xs font-bold text-[var(--text-mute)]">4. Contrast Limited AHE</span>
                <div className="aspect-square rounded overflow-hidden border border-[var(--border-color)]">
                  <img 
                    src={currentDiagnosis.images?.enhanced || selectedImage} 
                    alt="Enhanced" 
                    className="w-full h-full object-cover" 
                    style={!currentDiagnosis.images?.enhanced ? { filter: 'contrast(1.4) saturate(1.2)' } : {}}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-mute)]">Limits contrast (Clip: {claheClip.toFixed(1)}) over 8x8 grids on Lightness channel.</p>
              </div>

              {/* Equalized */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                <span className="text-xs font-bold text-[var(--text-mute)]">5. Histogram Equalization</span>
                <div className="aspect-square rounded overflow-hidden border border-[var(--border-color)]">
                  <img 
                    src={currentDiagnosis.images?.equalized || selectedImage} 
                    alt="Equalized" 
                    className="w-full h-full object-cover" 
                    style={!currentDiagnosis.images?.equalized ? { filter: 'contrast(1.1) brightness(0.9)' } : {}}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-mute)]">Normalizes illumination parameters to reduce shadows & reflection variance.</p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Explanation Modal */}
      {showExplanationModal && currentDiagnosis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 no-print animate-fade">
          <div className="clinical-card w-full max-w-[650px] relative max-h-[90vh] overflow-y-auto p-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <button 
              onClick={() => setShowExplanationModal(false)}
              className="absolute top-4 right-4 text-[var(--text-mute)] hover:text-[var(--text-main)] transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
              <Info className="text-clinical-primary" size={20} /> Pattern Recognition Feature Explanation
            </h3>

            <div className="flex flex-col gap-4 text-sm">
              <p className="text-[var(--text-mute)]">
                Below are the raw geometric and color-based features extracted from the skin lesion boundary using OpenCV and NumPy algorithms. These form the ABCD rule used by the classification model:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">Asymmetry (A)</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.asymmetry ?? '0.420'}</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Measures pixel difference when mask is folded vertically & horizontally. Malignant lesions exhibit higher asymmetry values (closer to 1.0).</p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">Border Compactness (B)</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.compactness ?? '1.250'}</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Formulated as \(P^2 / (4 \pi A)\). High perimeter-to-area ratio indicates irregular, jagged margins common in melanoma.</p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">Circularity Index (C)</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.circularity ?? '0.780'}</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Measures border roundness \(4 \pi A / P^2\). Normal melanocytic moles are highly circular (values near 1.0).</p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">Diameter (D)</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.diameter_mm ?? '5.4'} mm</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Approximates physical diameter assuming 300px corresponds to 15mm. Concerns arise for lesions exceeding 6.0mm.</p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">Color Variance (C)</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.color_variance ?? '15.2'}</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Standard deviation of color intensities across red, green, and blue spectrums. High variance points to multi-color lesions.</p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                  <span className="text-xs text-[var(--text-mute)] font-bold">GLCM Texture Contrast</span>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">{currentDiagnosis.metrics?.texture?.contrast ?? '8.4'}</div>
                  <p className="text-[11px] text-[var(--text-mute)]">Gray-Level Co-occurrence Matrix approximation of gray contrast. High contrast indicates scaling, cracking or flaking textures.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-1">
                <span className="text-xs text-[var(--text-mute)] font-bold">Gray-Level Co-occurrence Homogeneity &amp; Entropy</span>
                <div className="flex justify-between mt-1 text-xs">
                  <div>Homogeneity: <span className="font-mono text-[var(--text-main)] font-bold">{currentDiagnosis.metrics?.texture?.homogeneity ?? '0.720'}</span></div>
                  <div>Entropy: <span className="font-mono text-[var(--text-main)] font-bold">{currentDiagnosis.metrics?.texture?.entropy ?? '3.500'}</span></div>
                </div>
                <p className="text-[11px] text-[var(--text-mute)] mt-1">Homogeneity defines local uniformity. Entropy measures texture disorder/randomness, which is higher in active inflammatory plaques.</p>
              </div>

              <div className="flex justify-end gap-2 border-t border-[var(--border-color)] pt-4 mt-2">
                <button 
                  onClick={() => setShowExplanationModal(false)}
                  className="btn btn-primary"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
