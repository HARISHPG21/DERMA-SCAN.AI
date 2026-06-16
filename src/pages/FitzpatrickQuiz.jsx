import React, { useState } from 'react';
import { Award, ShieldAlert, Sun, Activity, ChevronRight, ChevronLeft, RefreshCw, AlertTriangle, Heart, Info, Sparkles, Shield, Eye, Flame, MapPin } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    text: "Eye Color",
    description: "What is your natural eye color?",
    options: [
      { text: "Light blue, light gray, or light green", score: 0 },
      { text: "Blue, gray, or green", score: 1 },
      { text: "Hazel or light brown", score: 2 },
      { text: "Dark brown", score: 3 },
      { text: "Brownish black", score: 4 }
    ]
  },
  {
    id: 2,
    text: "Natural Hair Color",
    description: "What is your natural hair color (before coloring)?",
    options: [
      { text: "Red or light blonde", score: 0 },
      { text: "Blonde", score: 1 },
      { text: "Chestnut or dark blonde", score: 2 },
      { text: "Dark brown", score: 3 },
      { text: "Black", score: 4 }
    ]
  },
  {
    id: 3,
    text: "Skin Tone (Unexposed Areas)",
    description: "What is your natural skin color in areas not exposed to the sun?",
    options: [
      { text: "Reddish / Pinkish pale", score: 0 },
      { text: "Very pale / Ivory", score: 1 },
      { text: "Pale beige / Olive undertones", score: 2 },
      { text: "Light brown / Golden brown", score: 3 },
      { text: "Dark brown / Black", score: 4 }
    ]
  },
  {
    id: 4,
    text: "Freckles",
    description: "How many freckles do you naturally have on unexposed areas?",
    options: [
      { text: "Many freckles", score: 0 },
      { text: "Several freckles", score: 1 },
      { text: "A few freckles", score: 2 },
      { text: "None / Extremely rare", score: 3 },
      { text: "None at all", score: 4 }
    ]
  },
  {
    id: 5,
    text: "Sun Exposure Reaction",
    description: "What happens when you stay in the sun without protection for too long?",
    options: [
      { text: "Painful redness, severe blistering, and peeling", score: 0 },
      { text: "Burns easily, blisters followed by peeling", score: 1 },
      { text: "Burns moderately, sometimes peels", score: 2 },
      { text: "Burns rarely, shows immediate gentle tan", score: 3 },
      { text: "Never burns, skin darkens immediately", score: 4 }
    ]
  },
  {
    id: 6,
    text: "Tanning Habit",
    description: "To what extent do you develop a tan (turn brown)?",
    options: [
      { text: "Never, I only turn red and burn", score: 0 },
      { text: "Seldom, light tan only", score: 1 },
      { text: "Moderately, normal golden tan", score: 2 },
      { text: "Rapidly, deep dark brown tan", score: 3 },
      { text: "Always tan deeply and very quickly", score: 4 }
    ]
  },
  {
    id: 7,
    text: "Facial Sun Sensitivity",
    description: "How sensitive is your face to sun exposure?",
    options: [
      { text: "Highly sensitive, burns immediately", score: 0 },
      { text: "Sensitive, burns easily", score: 1 },
      { text: "Moderately sensitive, burns occasionally", score: 2 },
      { text: "Resistant, burns very seldom", score: 3 },
      { text: "Very resistant, never burns", score: 4 }
    ]
  }
];

const FITZPATRICK_TYPES = [
  {
    type: "Type I",
    scoreRange: [0, 6],
    color: "#ffebd6",
    textColor: "#000000",
    name: "Highly Sensitive (Pale White)",
    characteristics: "Always burns, never tans. Very fair skin, red or blonde hair, freckles, blue/gray eyes.",
    risk: "Extreme",
    spf: "SPF 50+ Broad-Spectrum (Daily)",
    burnTime: "5 - 10 minutes",
    melanomaRisk: "Extremely high risk of melanoma and non-melanoma skin cancers. Active daily physical shielding is strongly advised.",
    guidelines: [
      "Apply broad-spectrum sunscreen (SPF 50+) every 2 hours, even on cloudy days.",
      "Wear UPF 50+ clothing, wide-brimmed hats, and UV-blocking sunglasses.",
      "Completely avoid direct sun exposure between 10:00 AM and 4:00 PM.",
      "Conduct monthly skin self-exams focusing on new or changing moles."
    ]
  },
  {
    type: "Type II",
    scoreRange: [7, 12],
    color: "#f3d5b5",
    textColor: "#000000",
    name: "Very Sensitive (Fair White)",
    characteristics: "Burns easily, tans minimally. Fair skin, blonde hair, blue/green eyes.",
    risk: "Very High",
    spf: "SPF 30-50 Broad-Spectrum",
    burnTime: "10 - 20 minutes",
    melanomaRisk: "High risk of skin cancers. Susceptible to sun damage and rapid premature photoaging.",
    guidelines: [
      "Use broad-spectrum SPF 30 or higher daily. Reapply frequently.",
      "Use protective clothing and seek shade whenever outdoors.",
      "Minimize exposure during peak UV index hours.",
      "Schedule annual professional dermatological full-body checkups."
    ]
  },
  {
    type: "Type III",
    scoreRange: [13, 18],
    color: "#e0b080",
    textColor: "#000000",
    name: "Moderately Sensitive (Cream White / Olive)",
    characteristics: "Burns moderately, tans gradually to light brown. Fair to light brown skin, brown hair/eyes.",
    risk: "High",
    spf: "SPF 30 Broad-Spectrum",
    burnTime: "20 - 30 minutes",
    melanomaRisk: "Moderate to high risk of UV skin cancers and photoaging (wrinkling, solar lentigines).",
    guidelines: [
      "Apply SPF 30+ sunscreen daily, especially on facial and neck regions.",
      "Wear a hat and sunglasses during prolonged outdoor activities.",
      "Be careful of reflections from sand, water, and snow.",
      "Monitor any asymmetrical or multi-colored lesions using the ABCDE rules."
    ]
  },
  {
    type: "Type IV",
    scoreRange: [19, 24],
    color: "#c68a4c",
    textColor: "#ffffff",
    name: "Mildly Sensitive (Moderate Brown)",
    characteristics: "Burns minimally, tans easily to medium brown. Mediterranean olive tone, dark brown hair/eyes.",
    risk: "Moderate",
    spf: "SPF 15-30 Broad-Spectrum",
    burnTime: "30 - 45 minutes",
    melanomaRisk: "Lower risk of skin cancers, but highly prone to post-inflammatory hyperpigmentation (PIH) and melasma.",
    guidelines: [
      "Apply SPF 15-30 daily to prevent hyperpigmentation and photoaging.",
      "Take standard sun precautions, especially during summer months.",
      "Check palms, soles, and nails regularly (acral lentiginous melanoma sites).",
      "Hydrate skin after sun exposure to support barrier repair."
    ]
  },
  {
    type: "Type V",
    scoreRange: [25, 30],
    color: "#995d2c",
    textColor: "#ffffff",
    name: "Resistant (Dark Brown)",
    characteristics: "Rarely burns, tans easily and deeply. Dark brown skin, black hair, dark eyes.",
    risk: "Low-Moderate",
    spf: "SPF 15+ Broad-Spectrum",
    burnTime: "45 - 60 minutes",
    melanomaRisk: "Sunburns are rare, but melanoma is often diagnosed at later stages. High susceptibility to hyperpigmentation.",
    guidelines: [
      "Use SPF 15+ broad-spectrum daily to guard against pigmentation and aging.",
      "Inspect hands, feet, undernails, and mucosal membranes for unusual lesions.",
      "Note that dark skin tones still experience sub-erythemal cell damage from UVA.",
      "Wear sunglasses to protect the eyes from high solar radiance."
    ]
  },
  {
    type: "Type VI",
    scoreRange: [31, 100],
    color: "#5c381c",
    textColor: "#ffffff",
    name: "Highly Resistant (Deeply Pigmented Black)",
    characteristics: "Never burns, tans deeply. Highly pigmented skin, black hair, dark brown eyes.",
    risk: "Low",
    spf: "SPF 15+ Broad-Spectrum",
    burnTime: "Usually does not burn",
    melanomaRisk: "Very low risk of sunburn, but high mortality rate for acral lentiginous melanoma (which occurs on non-exposed sites).",
    guidelines: [
      "Apply sunscreen to prevent UV-induced hyperpigmentation and melasma.",
      "Perform monthly inspections of the palms of hands, soles of feet, and nails.",
      "Do not rely on natural melanin to block 100% of cellular photo-damage.",
      "Consult a doctor immediately if you notice a growing brown/black band under a nail."
    ]
  }
];

export default function FitzpatrickQuiz() {
  const [currentStep, setCurrentStep] = useState(-1); // -1: Intro, 0-6: Questions, 7: Results
  const [answers, setAnswers] = useState({});
  const [uvIndex, setUvIndex] = useState(5); // Interactive UV simulator default value

  const handleStart = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const handleSelectOption = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(QUESTIONS.length);
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setCurrentStep(-1);
    }
  };

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  };

  const getSkinTypeResult = (score) => {
    return FITZPATRICK_TYPES.find(t => score >= t.scoreRange[0] && score <= t.scoreRange[1]) || FITZPATRICK_TYPES[2];
  };

  const totalScore = calculateTotalScore();
  const skinType = getSkinTypeResult(totalScore);

  // Dynamic UV risk calculator based on skin type and simulator UV index
  const getDynamicUvRecommendation = (skinTypeObj, index) => {
    let severity = "Low";
    let action = "No special precautions needed.";
    let safeTime = "Unlimited";

    if (index >= 11) {
      severity = "Extreme";
      safeTime = skinTypeObj.type === "Type I" || skinTypeObj.type === "Type II" ? "2-5 mins" : "15-20 mins";
      action = "Avoid being outdoors! Seek shade, wear SPF 50+, long sleeves, hat, and sunglasses. Reapply SPF every 90 minutes.";
    } else if (index >= 8) {
      severity = "Very High";
      safeTime = skinTypeObj.type === "Type I" || skinTypeObj.type === "Type II" ? "5-10 mins" : "25-30 mins";
      action = "Extra protection is required. Avoid sun between 11 AM - 3 PM. Cover up, wear SPF 30+, hat, and sunglasses.";
    } else if (index >= 6) {
      severity = "High";
      safeTime = skinTypeObj.type === "Type I" || skinTypeObj.type === "Type II" ? "10-15 mins" : "40-45 mins";
      action = "Protection needed. Apply broad-spectrum SPF 30+, wear a hat, and seek shade during midday hours.";
    } else if (index >= 3) {
      severity = "Moderate";
      safeTime = skinTypeObj.type === "Type I" || skinTypeObj.type === "Type II" ? "20-30 mins" : "60+ mins";
      action = "Standard precautions. Apply SPF 15 or higher. Wear sunglasses and a hat if staying outdoors for over 30 mins.";
    } else {
      severity = "Low";
      safeTime = "Safe for 60+ mins";
      action = "Safe for most skin types. Low risk. Apply SPF 15 if outdoors for extended periods.";
    }

    return { severity, action, safeTime };
  };

  const uvRecommendation = getDynamicUvRecommendation(skinType, uvIndex);

  // Helper for UV index indicator coloring
  const getUvIndexColor = (val) => {
    if (val >= 11) return "var(--danger)";
    if (val >= 8) return "#d946ef"; // Purple
    if (val >= 6) return "#f97316"; // Orange
    if (val >= 3) return "var(--warning)";
    return "var(--secondary)";
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Fitzpatrick Skin Phototype Diagnostic</h2>
          <p>
            Determine your clinical skin category and establish a dermatologically calibrated ultraviolet (UV) safety and skin cancer prevention profile.
          </p>
        </div>

        <div className="max-w-[750px] mx-auto">
          {/* STEP -1: Welcome Intro */}
          {currentStep === -1 && (
            <div className="clinical-card text-center p-8 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-glow)] border border-[var(--border-color-glow)] flex items-center justify-center text-clinical-primary">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Clinical Phototyping Questionnaire</h3>
                <p className="text-sm text-[var(--text-mute)] leading-relaxed max-w-[550px] mx-auto">
                  The Fitzpatrick Skin Phototype is a scientific classification schema developed in 1975 by Harvard dermatologist Thomas B. Fitzpatrick. It measures the amount of melanin pigment in the skin and predicts its response to ultraviolet radiation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left my-2">
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg flex gap-3 items-start">
                  <Flame className="text-[var(--danger)] shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">Burn Tendency</h4>
                    <p className="text-[10px] text-[var(--text-mute)]">Calculate your likelihood of sun blistering & tissue erythema.</p>
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg flex gap-3 items-start">
                  <Sun className="text-[var(--warning)] shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">UV Safety Rules</h4>
                    <p className="text-[10px] text-[var(--text-mute)]">Receive a personalized SPF level & outdoor activity guide.</p>
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg flex gap-3 items-start">
                  <ShieldAlert className="text-clinical-primary shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">Cancer Prophylaxis</h4>
                    <p className="text-[10px] text-[var(--text-mute)]">Identify potential risks for melanoma and lesion anomalies.</p>
                  </div>
                </div>
              </div>

              <button onClick={handleStart} className="btn btn-primary px-8 flex items-center gap-2">
                Begin Clinical Quiz <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 0 to 6: Questions */}
          {currentStep >= 0 && currentStep < QUESTIONS.length && (
            <div className="clinical-card p-6 min-h-[400px] flex flex-col justify-between animate-slide-up">
              {/* Header with Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-mute)] mb-2">
                  <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}% Completed</span>
                </div>
                <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-[var(--primary)] transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <div className="mb-6">
                  <span className="text-xs uppercase font-bold text-clinical-primary tracking-wider">{QUESTIONS[currentStep].text}</span>
                  <h3 className="text-lg font-bold text-[var(--text-main)] mt-1">{QUESTIONS[currentStep].description}</h3>
                </div>

                {/* Option buttons */}
                <div className="flex flex-col gap-3">
                  {QUESTIONS[currentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(QUESTIONS[currentStep].id, opt.score)}
                      className="p-4 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-clinical-primary text-left text-sm text-[var(--text-main)] font-semibold transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <span>{opt.text}</span>
                      <ChevronRight size={16} className="text-[var(--text-mute)] group-hover:text-clinical-primary transform group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation footer */}
              <div className="flex justify-between border-t border-[var(--border-color)] pt-4 mt-6">
                <button onClick={handleBack} className="btn btn-outline flex items-center gap-1.5 py-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <span className="text-xs text-[var(--text-mute)] flex items-center font-mono">
                  Cumulative Score: {calculateTotalScore()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: Results & Clinical Profile */}
          {currentStep === QUESTIONS.length && (
            <div className="flex flex-col gap-6 animate-slide-up">
              {/* Master Summary Card */}
              <div className="clinical-card p-6">
                <div className="flex justify-between items-start flex-wrap gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-clinical-primary flex items-center gap-1.5">
                      <Award size={14} /> Diagnostic Result
                    </span>
                    <h3 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
                      Fitzpatrick Skin {skinType.type}
                    </h3>
                    <p className="text-sm text-[var(--text-mute)] mt-0.5">{skinType.name}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-[var(--text-mute)]">Quiz Total Score</span>
                    <span className="text-3xl font-black font-mono text-[var(--text-main)]">{totalScore}</span>
                  </div>
                </div>

                {/* Skin Spectrum Representation */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-[var(--text-mute)] block mb-2">Phototype Melanin Spectrum</span>
                  <div className="h-6 w-full rounded-full flex overflow-hidden border border-[var(--border-color)] relative">
                    {FITZPATRICK_TYPES.map((t, idx) => (
                      <div
                        key={idx}
                        style={{ 
                          backgroundColor: t.color, 
                          flex: 1, 
                          borderRight: idx < 5 ? '1px solid rgba(0,0,0,0.15)' : 'none',
                        }}
                        className="relative flex items-center justify-center"
                      >
                        {skinType.type === t.type && (
                          <div 
                            className="absolute -inset-0.5 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg-surface)] rounded shadow-lg animate-pulse"
                            style={{ backgroundColor: t.color }}
                          />
                        )}
                        <span 
                          style={{ color: t.textColor, fontSize: '9px', fontWeight: 'bold' }} 
                          className="z-10 select-none opacity-80"
                        >
                          {t.type.split(" ")[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-mute)] font-mono mt-1 px-1">
                    <span>Type I (Fair)</span>
                    <span>Type VI (Pigmented)</span>
                  </div>
                </div>

                {/* Key Metrics grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-mute)] font-bold uppercase tracking-wider block">Melanoma Risk</span>
                    <span className="text-base font-extrabold flex items-center gap-1.5 mt-0.5" style={{ color: skinType.risk === 'Extreme' || skinType.risk === 'Very High' ? 'var(--danger)' : skinType.risk === 'High' ? 'var(--warning)' : 'var(--secondary)' }}>
                      <ShieldAlert size={16} /> {skinType.risk}
                    </span>
                  </div>

                  <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-mute)] font-bold uppercase tracking-wider block">Target SPF Protection</span>
                    <span className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-1.5 mt-0.5">
                      <Sun size={16} className="text-[var(--warning)]" /> {skinType.spf}
                    </span>
                  </div>

                  <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-mute)] font-bold uppercase tracking-wider block">Est. Time to Sunburn</span>
                    <span className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-1.5 mt-0.5">
                      <Flame size={16} className="text-red-500" /> {skinType.burnTime}
                    </span>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="p-4 bg-[var(--primary-glow)] border border-[var(--border-color-glow)] rounded-lg flex gap-3 mb-4">
                  <Info className="text-clinical-primary shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">Skin Reactions & Melanin Profile</h4>
                    <p className="text-xs text-[var(--text-mute)] leading-relaxed mt-1">{skinType.characteristics}</p>
                    <p className="text-xs text-[var(--text-mute)] leading-relaxed mt-2 font-semibold text-[var(--text-main)]">{skinType.melanomaRisk}</p>
                  </div>
                </div>
              </div>

              {/* Interactive UV Risk Simulator Card */}
              <div className="clinical-card p-6">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3 mb-4">
                  <Sparkles className="text-clinical-primary" size={20} />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">Dermatological UV Exposure Simulator</h3>
                    <p className="text-[11px] text-[var(--text-mute)]">Calibrate outdoor index values to receive real-time sun exposure safety alerts.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col gap-4">
                    {/* UV Index Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <label className="text-[var(--text-main)] flex items-center gap-1">
                          <Sun size={14} style={{ color: getUvIndexColor(uvIndex) }} /> Current UV Index Level
                        </label>
                        <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ backgroundColor: getUvIndexColor(uvIndex) + '22', color: getUvIndexColor(uvIndex) }}>
                          {uvIndex} ({uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : uvIndex <= 10 ? 'Very High' : 'Extreme'})
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="15" 
                        step="1"
                        value={uvIndex}
                        onChange={(e) => setUvIndex(parseInt(e.target.value))}
                        className="w-full accent-clinical-primary h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer mt-2"
                        style={{ accentColor: getUvIndexColor(uvIndex) }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[var(--text-mute)] font-mono">
                      <span>1 (Low)</span>
                      <span>5 (Mod)</span>
                      <span>8 (Very High)</span>
                      <span>15 (Extreme)</span>
                    </div>
                  </div>

                  {/* Simulator Results */}
                  <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-mute)]">Est. Safe Sun Time</span>
                      <span className="font-mono font-bold text-[var(--text-main)] flex items-center gap-1">
                        <Eye size={12} className="text-clinical-primary" /> {uvRecommendation.safeTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text-mute)]">Exposure Threat Level</span>
                      <span className="font-mono font-bold uppercase" style={{ color: getUvIndexColor(uvIndex) }}>
                        {uvRecommendation.severity}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-main)] bg-[var(--bg-surface)] p-2.5 rounded border border-[var(--border-color)] font-medium leading-relaxed">
                      {uvRecommendation.action}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preventative Care Protocols Card */}
              <div className="clinical-card p-6">
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-4 flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3">
                  <Shield className="text-[var(--secondary)]" size={18} /> Clinical UV Prevention Guidelines
                </h3>
                <div className="flex flex-col gap-3">
                  {skinType.guidelines.map((guide, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-[var(--text-mute)] leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-[var(--secondary-glow)] border border-green-500/30 flex items-center justify-center text-[var(--secondary)] text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="mt-0.5">{guide}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Re-quiz buttons */}
              <div className="flex gap-4 justify-center mt-2">
                <button onClick={handleStart} className="btn btn-outline flex items-center gap-1.5 px-6">
                  <RefreshCw size={14} /> Retake Questionnaire
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
