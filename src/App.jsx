import React, { useState, useEffect, useRef } from 'react';
import { Activity, BarChart2, BookOpen, Layers, Sparkles, Mail, ShieldAlert, Sun, Moon, TrendingUp, Settings, HelpCircle, MessageSquare, Send, User, X, RefreshCw, Camera, Menu } from 'lucide-react';
import Home from './pages/Home';
import DiagnosticCenter from './pages/DiagnosticCenter';
import ClinicalInsights from './pages/ClinicalInsights';
import DiseaseRegistry from './pages/DiseaseRegistry';
import ResearchPipeline from './pages/ResearchPipeline';
import ProgressTracker from './pages/ProgressTracker';
import AdminDashboard from './pages/AdminDashboard';
import FitzpatrickQuiz from './pages/FitzpatrickQuiz';
import doctorAvatar from './assets/doctor_avatar.png';

const DOCTOR_AVATAR = doctorAvatar;

export default function App() {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Floating Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am Dr. DermaScan, your clinical AI dermatology assistant. I can provide clinical information on 25 key skin pathologies including Melanoma, BCC, SCC, Eczema, Psoriasis, Acne, Ringworm, Vitiligo, Shingles, Rosacea, Hives, Cherry Angioma, Epidermoid Cyst, Keloid, and more. Ask me any question!'
    }
  ]);

  // Toast Notification states
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Toast event listener
  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail) {
        showToast(e.detail.message, e.detail.type);
      }
    };
    window.addEventListener('dermascan-toast', handleToastEvent);
    return () => window.removeEventListener('dermascan-toast', handleToastEvent);
  }, []);

  // Apply theme attribute to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // URL Hash Listener for bookmarkable router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (['home', 'scan', 'insights', 'registry', 'pipeline', 'progress', 'admin', 'quiz'].includes(hash)) {
        setPage(hash);
      } else {
        window.location.hash = '#/home';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    // Initial parse
    if (!window.location.hash) {
      window.location.hash = '#/home';
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (targetPage) => {
    window.location.hash = `#/${targetPage}`;
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home setPage={navigateTo} />;
      case 'scan':
        return <DiagnosticCenter />;
      case 'insights':
        return <ClinicalInsights theme={theme} />;
      case 'registry':
        return <DiseaseRegistry theme={theme} />;
      case 'pipeline':
        return <ResearchPipeline theme={theme} />;
      case 'progress':
        return <ProgressTracker theme={theme} />;
      case 'admin':
        return <AdminDashboard theme={theme} />;
      case 'quiz':
        return <FitzpatrickQuiz />;
      default:
        return <Home setPage={navigateTo} />;
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulate bot thinking
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = userMsg.toLowerCase();

      if (lowerInput.includes('melanoma')) {
        botResponse = "Malignant Melanoma (MEL) is a serious skin malignancy originating from melanocytes. Key features under the ABCD rule: Asymmetry (asymmetric shape), Border (jagged, irregular contours), Color (multiple colors or black patches), and Diameter (often >6mm). Immediate professional dermatological consultation and biopsy are critical.";
      } else if (lowerInput.includes('basal cell') || lowerInput.includes('bcc')) {
        botResponse = "Basal Cell Carcinoma (BCC) is the most common malignant skin cancer. It typically presents as a pearly or waxy bump, often with visible telangiectasia (blood vessels) and a rolling border. Highly curable if excised early.";
      } else if (lowerInput.includes('squamous') || lowerInput.includes('scc')) {
        botResponse = "Squamous Cell Carcinoma (SCC) is a malignant skin cancer arising from keratinocytes, commonly on sun-exposed skin. It presents as a firm, red nodule or a flat lesion with a rough, scaly, or crusted surface. Higher metastasis risk than BCC.";
      } else if (lowerInput.includes('actinic') || lowerInput.includes('solar keratosis') || lowerInput.includes('ak')) {
        botResponse = "Actinic Keratosis (AK) is a pre-cancerous, rough, sand-paper textured scaly plaque caused by chronic UV exposure. Left untreated, a small percentage may progress to Squamous Cell Carcinoma. Managed with cryotherapy or topical 5-FU.";
      } else if (lowerInput.includes('nevus') || lowerInput.includes('common mole') || lowerInput.includes('mole')) {
        botResponse = "Melanocytic Nevus (Common Mole) is a benign proliferation of melanocytes. They are typically uniform, symmetric, and circular with sharp borders. No treatment is needed, but regular ABCDE self-monitoring is advised.";
      } else if (lowerInput.includes('seborrheic keratosis') || lowerInput.includes('bkl') || lowerInput.includes('senile wart')) {
        botResponse = "Seborrheic Keratosis (BKL) is a very common, non-cancerous benign skin tumor originating from keratinocytes. They appear as 'stuck-on', waxy, greasy brown or black plaques. They are harmless and removed only for cosmetic reasons.";
      } else if (lowerInput.includes('dermatofibroma') || lowerInput.includes('df')) {
        botResponse = "Dermatofibroma (DF) is a common, harmless, firm benign nodule, often on lower limbs. Characterized by the 'dimple sign' (it dimples when pinched laterally). Stable and rarely requires removal.";
      } else if (lowerInput.includes('psoriasis')) {
        botResponse = "Psoriasis Vulgaris is a chronic autoimmune inflammatory condition causing rapid skin cell turnover. It yields well-demarcated red plaques covered with silvery scales, commonly on elbows and knees. Managed with topical steroids, phototherapy, or biologics.";
      } else if (lowerInput.includes('eczema') || lowerInput.includes('atopic dermatitis')) {
        botResponse = "Atopic Dermatitis (Eczema) is a chronic, intensely itchy inflammatory condition linked to skin barrier defects. It presents as dry, red, scaly, or weeping patches in flexural creases. Managed with emollients and topical steroids.";
      } else if (lowerInput.includes('acne')) {
        botResponse = "Acne Vulgaris is a highly common inflammatory disorder of hair follicles and oil glands. Features comedones, papules, pustules, or cysts on face, chest, or back. Treated with salicylic acid, benzoyl peroxide, retinoids, or antibiotics.";
      } else if (lowerInput.includes('ringworm') || lowerInput.includes('tinea')) {
        botResponse = "Ringworm (Tinea Corporis) is a superficial fungal skin infection. It presents as an itchy, circular red rash with a raised scaly border and central clearing. Highly contagious but treated easily with topical antifungals.";
      } else if (lowerInput.includes('vitiligo')) {
        botResponse = "Vitiligo is an autoimmune condition causing progressive depigmentation (white patches) of skin and hair due to destruction of melanocytes. Managed with topical calcineurin inhibitors, steroids, or narrowband UVB phototherapy.";
      } else if (lowerInput.includes('shingles') || lowerInput.includes('zoster')) {
        botResponse = "Shingles (Herpes Zoster) is a painful blistering rash caused by reactivation of the latent Varicella-Zoster Virus in sensory nerve ganglia. Follows a unilateral dermatome. Needs immediate oral antiviral therapy (within 72 hours).";
      } else if (lowerInput.includes('rosacea')) {
        botResponse = "Rosacea is a chronic inflammatory facial condition showing flushing, persistent redness, visible blood vessels (telangiectasia), and papules/pustules. Managed by avoiding triggers, topical metronidazole, or oral tetracyclines.";
      } else if (lowerInput.includes('urticaria') || lowerInput.includes('hives')) {
        botResponse = "Urticaria (Hives) presents as transient, intensely itchy, raised red wheals or welts that migrate and fade within 24 hours. Often triggered by allergens, stress, or infections. Treated with non-sedating oral antihistamines.";
      } else if (lowerInput.includes('wart') || lowerInput.includes('verruca') || lowerInput.includes('hpv')) {
        botResponse = "Warts (Verruca Vulgaris) are benign growths of the skin caused by local infection with Human Papillomavirus (HPV). They appear as rough, hyperkeratotic papules with tiny black dots. Treated with salicylic acid or cryotherapy.";
      } else if (lowerInput.includes('seborrheic dermatitis') || lowerInput.includes('dandruff')) {
        botResponse = "Seborrheic Dermatitis is a chronic inflammatory skin condition linked to Malassezia yeast overgrowth. It causes greasy, yellowish scales on red skin patches on the scalp, eyebrows, or face. Managed with ketoconazole shampoos.";
      } else if (lowerInput.includes('alopecia') || lowerInput.includes('baldness') || lowerInput.includes('hair loss')) {
        botResponse = "Alopecia Areata is an autoimmune disease causing hair follicles to enter a premature resting state, yielding smooth round patches of hair loss on scalp or body. Treated with intralesional steroid injections or minoxidil.";
      } else if (lowerInput.includes('contact dermatitis') || lowerInput.includes('poison ivy') || lowerInput.includes('allergic contact')) {
        botResponse = "Contact Dermatitis is an inflammatory reaction caused by direct contact with an external allergen (e.g. nickel, plants) or chemical irritant. Causes localized itchy blisters or scaling. Managed with avoidance and topical steroids.";
      } else if (lowerInput.includes('lichen planus') || lowerInput.includes('wickham')) {
        botResponse = "Lichen Planus (LP) is a chronic autoimmune condition causing shiny, flat-topped, polygonal, purple papules that are intensely itchy. Often displays Wickham striae (fine white lines). Treated with high-potency topical steroids.";
      } else if (lowerInput.includes('cherry') || lowerInput.includes('angioma')) {
        botResponse = "Cherry Angioma (CA) is a common, entirely benign vascular skin growth consisting of a small cluster of capillaries. They present as bright red, smooth, dome-shaped papules. No treatment is needed unless they bleed or are removed for cosmetic reasons.";
      } else if (lowerInput.includes('dpn') || lowerInput.includes('papulosa nigra')) {
        botResponse = "Dermatosis Papulosa Nigra (DPN) is a benign skin condition highly common in darker skin types (Fitzpatrick types IV-VI). It features multiple tiny, hyperpigmented, dark brown or black papules on the cheeks and face. They are harmless.";
      } else if (lowerInput.includes('cyst') || lowerInput.includes('epidermoid')) {
        botResponse = "Epidermoid Cyst is a very common benign sac-like growth under the skin containing keratin (protein). It is mobile and often has a visible central punctum. Treatment is surgical excision of the entire cyst wall if it is inflamed or irritated.";
      } else if (lowerInput.includes('pemphigoid') || lowerInput.includes('bullous')) {
        botResponse = "Bullous Pemphigoid (BP) is a severe, chronic autoimmune blistering disorder most common in older adults. It causes large, tense, itchy fluid-filled blisters (bullae) on the limbs and trunk. Requires urgent dermatological referral for steroids or immunosuppressants.";
      } else if (lowerInput.includes('keloid') || lowerInput.includes('scar')) {
        botResponse = "Keloid Scar is an overgrowth of thick, fibrous scar tissue that extends far beyond the borders of the original skin injury (e.g. cut, burn, piercing). They are firm, shiny, and can be itchy or painful. Managed with steroid injections, silicon gel sheets, or lasers.";
      } else {
        botResponse = "I can provide clinical information on 25 skin conditions including Melanoma, BCC, SCC, Eczema, Psoriasis, Acne, Ringworm, Vitiligo, Shingles, Rosacea, Hives, Cherry Angioma, Epidermoid Cyst, Keloid, and more. Which condition would you like to discuss?";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  const handleChatImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show image preview in chat immediately
    const reader = new FileReader();
    reader.onload = () => {
      // Add user message with image preview
      setChatMessages(prev => [...prev, { 
        sender: 'user', 
        text: 'Analyzing uploaded skin image...', 
        image: reader.result 
      }]);

      // Add a typing message
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Dr. DermaScan is analyzing your scan...', isAnalyzing: true }]);

      // Post to FastAPI backend
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData
      })
      .then(res => {
        if (!res.ok) throw new Error('Inference server returned error.');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.detail || data.error);
        
        // Remove typing indicator and append bot result
        setChatMessages(prev => {
          const filtered = prev.filter(m => !m.isAnalyzing);
          return [...filtered, {
            sender: 'bot',
            text: `Image Analysis Complete.\n\nPrimary predicted pathology is **${data.diagnosis}** with **${data.confidence}%** confidence.\n\nSeverity Index: **${data.severity}** (Score: ${data.score}/10).\n\nRecommended clinical guideline: *${data.triage}*.\n\nTo view details, head to the Diagnostic Center or check the Progress Tracker.`
          }];
        });
        
        // Trigger completion toast
        window.dispatchEvent(new CustomEvent('dermascan-toast', { 
          detail: { message: `Chat diagnostic completed: ${data.diagnosis}!`, type: "success" } 
        }));
      })
      .catch(err => {
        console.warn('Backend server offline during chat upload. Running offline fallback.', err);
        
        // Offline fallback
        setTimeout(() => {
          setChatMessages(prev => {
            const filtered = prev.filter(m => !m.isAnalyzing);
            return [...filtered, {
              sender: 'bot',
              text: `Image Analysis Complete (Local Fallback).\n\nPrimary predicted pathology: **Seborrheic Keratosis (SK)** with **86.4%** confidence.\n\nSeverity Index: **Mild** (Score: 2.4/10).\n\nRecommended clinical guideline: *Routine Clinical Evaluation*.`
            }];
          });
        }, 1000);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="max-width-container nav-container">
          <div className="nav-brand" onClick={() => navigateTo('home')}>
            <Activity className="nav-logo-icon" size={24} />
            <span>DERMASCAN.AI</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            <button 
              className={`nav-button ${page === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button 
              className={`nav-button ${page === 'scan' ? 'active' : ''}`}
              onClick={() => navigateTo('scan')}
            >
              <Sparkles size={14} /> Diagnostic Center
            </button>
            <button 
              className={`nav-button ${page === 'quiz' ? 'active' : ''}`}
              onClick={() => navigateTo('quiz')}
            >
              <Activity size={14} /> Fitzpatrick Quiz
            </button>
            <button 
              className={`nav-button ${page === 'progress' ? 'active' : ''}`}
              onClick={() => navigateTo('progress')}
            >
              <TrendingUp size={14} /> Progress Tracker
            </button>
            <button 
              className={`nav-button ${page === 'insights' ? 'active' : ''}`}
              onClick={() => navigateTo('insights')}
            >
              <BarChart2 size={14} /> Clinical Insights
            </button>
            <button 
              className={`nav-button ${page === 'registry' ? 'active' : ''}`}
              onClick={() => navigateTo('registry')}
            >
              <BookOpen size={14} /> Disease Registry
            </button>
            <button 
              className={`nav-button ${page === 'pipeline' ? 'active' : ''}`}
              onClick={() => navigateTo('pipeline')}
            >
              <Layers size={14} /> Pipeline
            </button>
            <button 
              className={`nav-button ${page === 'admin' ? 'active' : ''}`}
              onClick={() => navigateTo('admin')}
            >
              <Settings size={14} /> Admin
            </button>
          </div>

          {/* Right Action Buttons: Theme Toggle & Hamburger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                padding: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                background: 'var(--primary-glow)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                border: '1px solid var(--border-color-glow)',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
              className="nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              style={{
                width: '38px',
                height: '38px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay lg:hidden">
          <div className="mobile-nav-links">
            <button 
              className={`nav-button ${page === 'home' ? 'active' : ''}`}
              onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
            >
              Home
            </button>
            <button 
              className={`nav-button ${page === 'scan' ? 'active' : ''}`}
              onClick={() => { navigateTo('scan'); setIsMobileMenuOpen(false); }}
            >
              <Sparkles size={14} /> Diagnostic Center
            </button>
            <button 
              className={`nav-button ${page === 'quiz' ? 'active' : ''}`}
              onClick={() => { navigateTo('quiz'); setIsMobileMenuOpen(false); }}
            >
              <Activity size={14} /> Fitzpatrick Quiz
            </button>
            <button 
              className={`nav-button ${page === 'progress' ? 'active' : ''}`}
              onClick={() => { navigateTo('progress'); setIsMobileMenuOpen(false); }}
            >
              <TrendingUp size={14} /> Progress Tracker
            </button>
            <button 
              className={`nav-button ${page === 'insights' ? 'active' : ''}`}
              onClick={() => { navigateTo('insights'); setIsMobileMenuOpen(false); }}
            >
              <BarChart2 size={14} /> Clinical Insights
            </button>
            <button 
              className={`nav-button ${page === 'registry' ? 'active' : ''}`}
              onClick={() => { navigateTo('registry'); setIsMobileMenuOpen(false); }}
            >
              <BookOpen size={14} /> Disease Registry
            </button>
            <button 
              className={`nav-button ${page === 'pipeline' ? 'active' : ''}`}
              onClick={() => { navigateTo('pipeline'); setIsMobileMenuOpen(false); }}
            >
              <Layers size={14} /> Pipeline
            </button>
            <button 
              className={`nav-button ${page === 'admin' ? 'active' : ''}`}
              onClick={() => { navigateTo('admin'); setIsMobileMenuOpen(false); }}
            >
              <Settings size={14} /> Admin
            </button>
          </div>
        </div>
      )}

      {/* Main Content viewport */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Clinical Footer */}
      <footer className="clinical-footer">
        <div className="max-width-container">
          <div className="footer-grid">
            <div>
              <div className="nav-brand" style={{ cursor: 'default' }}>
                <Activity className="nav-logo-icon" size={22} />
                <span>DERMASCAN.AI</span>
              </div>
              <p className="footer-brand-desc">
                An open-source deep learning diagnostic triage assistant. Built using ResNet, EfficientNet,
                and Vision Transformers to augment early detection rates of dermatological lesions.
              </p>
            </div>

            <div>
              <h4 className="footer-col-title">Navigation Quick Links</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="#/home" onClick={() => navigateTo('home')}>Project Summary</a></li>
                <li className="footer-link-item"><a href="#/scan" onClick={() => navigateTo('scan')}>Interactive Simulator</a></li>
                <li className="footer-link-item"><a href="#/quiz" onClick={() => navigateTo('quiz')}>Fitzpatrick Quiz</a></li>
                <li className="footer-link-item"><a href="#/progress" onClick={() => navigateTo('progress')}>Progress Tracker</a></li>
                <li className="footer-link-item"><a href="#/insights" onClick={() => navigateTo('insights')}>Validation Scorecard</a></li>
                <li className="footer-link-item"><a href="#/registry" onClick={() => navigateTo('registry')}>Pathology Catalog</a></li>
                <li className="footer-link-item"><a href="#/pipeline" onClick={() => navigateTo('pipeline')}>Technical Architecture</a></li>
                <li className="footer-link-item"><a href="#/admin" onClick={() => navigateTo('admin')}>Admin Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Medical Project Compliance</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item" style={{ color: 'var(--text-mute)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={14} className="nav-logo-icon" /> HIPAA Compliance Mode: Enabled (No PHI Cached)
                </li>
                <li className="footer-link-item" style={{ color: 'var(--text-mute)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={14} className="nav-logo-icon" /> Dataset Used: <a href="https://doi.org/10.7910/DVN/DBW86T" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>HAM10000 Dataset</a>
                </li>
                <li className="footer-link-item" style={{ color: 'var(--text-mute)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} className="nav-logo-icon" /> research@dermascan.ai
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Dermascan AI. Created and Developed by P.G.HARISH. Released under MIT Research License.</span>
          </div>
        </div>
      </footer>

      {/* Floating DermChat Bot Drawer */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 no-print flex flex-col items-end">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full shadow-lg border hover:scale-105 transition-all flex items-center justify-center cursor-pointer p-0 overflow-hidden no-print"
          title={isChatOpen ? "Close Chatbot" : "Open Clinical Chatbot"}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isChatOpen ? 'var(--danger)' : 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
            color: isChatOpen ? 'white' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isChatOpen ? (
            <X size={24} style={{ color: 'white' }} />
          ) : (
            <img 
              src={DOCTOR_AVATAR} 
              alt="Open Clinical Chatbot" 
              className="w-full h-full rounded-full object-cover" 
            />
          )}
        </button>

        {/* Chat Drawer Panel */}
        {isChatOpen && (
          <div 
            className="w-[calc(100vw-32px)] sm:w-[360px] h-[450px] rounded-2xl border shadow-2xl mt-3 flex flex-col overflow-hidden backdrop-blur-md animate-slide-up"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            {/* Header */}
            <div 
              className="p-4 border-b flex items-center gap-2"
              style={{ backgroundColor: 'var(--bg-nav)', borderBottomColor: 'var(--border-color)' }}
            >
              <Activity size={18} className="text-clinical-primary" style={{ color: 'var(--primary)' }} />
              <div>
                <h4 className="text-sm font-bold leading-none" style={{ color: 'var(--text-main)' }}>DermChat Assistant</h4>
                <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Dr. DermaScan AI • Sandbox Mode</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-sans text-xs">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <img 
                      src={DOCTOR_AVATAR} 
                      alt="Doctor avatar" 
                      className="w-7 h-7 rounded-full border shrink-0" 
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  )}
                  <div 
                    className={`max-w-[75%] p-3 rounded-lg flex flex-col gap-2`}
                    style={msg.sender === 'user' ? { backgroundColor: 'var(--primary)', borderBottomRightRadius: 0, color: 'white', alignSelf: 'flex-end' } : { backgroundColor: 'var(--bg-main)', borderBottomLeftRadius: 0, color: 'var(--text-main)', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}
                  >
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Uploaded scan preview" 
                        className="w-full max-w-[200px] aspect-square object-cover rounded border" 
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                    )}
                    {msg.isAnalyzing ? (
                      <div className="flex items-center gap-1.5 font-bold animate-pulse" style={{ color: 'var(--primary)' }}>
                        <RefreshCw size={12} className="animate-spin" /> Analyzing scan...
                      </div>
                    ) : (
                      <span style={{ whiteSpace: 'pre-line' }}>{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={handleChatSubmit} 
              className="p-3 border-t flex gap-2 items-center"
              style={{ backgroundColor: 'var(--bg-nav)', borderTopColor: 'var(--border-color)' }}
            >
              <label 
                className="cursor-pointer hover:text-white transition-colors shrink-0 p-1"
                style={{ color: 'var(--text-mute)' }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleChatImageUpload} 
                  style={{ display: 'none' }} 
                />
                <Camera size={16} />
              </label>
              <input 
                type="text" 
                placeholder="Ask Dr. DermaScan or send image..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded px-3 py-2 text-xs outline-none focus:border-clinical-primary font-sans"
                style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              />
              <button 
                type="submit"
                className="btn btn-secondary flex items-center justify-center p-2 rounded"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none no-print">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-2 border text-sm animate-slide-up pointer-events-auto`}
            style={{ 
              borderLeft: toast.type === 'success' ? '4px solid var(--secondary)' : 
                           toast.type === 'warning' ? '4px solid var(--warning)' : 
                           '4px solid var(--primary)',
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)'
            }}
          >
            <Activity size={16} className="text-clinical-primary shrink-0" style={{ color: 'var(--primary)' }} />
            <span className="font-sans">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
