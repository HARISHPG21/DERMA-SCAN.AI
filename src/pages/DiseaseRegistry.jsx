import React, { useState } from 'react';
import { Search, Info, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

const DISEASES = [
  {
    name: 'Malignant Melanoma',
    abbreviation: 'MEL',
    category: 'Malignant',
    risk: 'High',
    synonyms: 'Melanocarcinoma, skin cancer',
    description: 'The most lethal form of skin cancer, arising from pigment-producing melanocytes. Often presents as an asymmetrical, irregularly bordered, multicolored macule or papule.',
    features: 'Asymmetric distribution, borders notched or blurred, color variations (black, brown, blue, red), diameter > 6mm.',
    guideline: 'Urgent excision required. Sentinel lymph node biopsy is performed for deep lesions.'
  },
  {
    name: 'Basal Cell Carcinoma',
    abbreviation: 'BCC',
    category: 'Malignant',
    risk: 'High',
    synonyms: 'Rodent ulcer, basal cell epithelioma',
    description: 'The most common form of skin cancer, originating in basal cells. Slow-growing and rarely metastasizes but can cause significant localized tissue destruction if untreated.',
    features: 'Pearly or waxy appearance, translucent papules with telangiectasia (visible blood vessels), central ulceration or rolling borders.',
    guideline: 'Local surgical excision, Mohs micrographic surgery, or topical treatments depending on site and subtype.'
  },
  {
    name: 'Squamous Cell Carcinoma',
    abbreviation: 'SCC',
    category: 'Malignant',
    risk: 'High',
    synonyms: 'Epidermoid carcinoma',
    description: 'A malignant tumor of epidermal keratinocytes, typically arising in sun-exposed areas. Has a higher rate of metastasis than BCC.',
    features: 'Firm, red nodule or a flat lesion with a scaly, crusted surface. Often tender to pressure.',
    guideline: 'Surgical excision, Mohs surgery, or radiation therapy for high-risk cases.'
  },
  {
    name: 'Actinic Keratosis',
    abbreviation: 'AK',
    category: 'Malignant',
    risk: 'Moderate',
    synonyms: 'Solar keratosis, pre-cancerous',
    description: 'A pre-cancerous, rough, scaly patch on skin damaged by years of sun exposure. Can progress to Squamous Cell Carcinoma (SCC) if left untreated.',
    features: 'Dry, rough, sand-paper textured papule or plaque. Often easier to feel than to see.',
    guideline: 'Cryotherapy, topical chemotherapy (5-FU), or photodynamic therapy to prevent malignant transformation.'
  },
  {
    name: 'Melanocytic Nevus',
    abbreviation: 'NV',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Common mole, intradermal nevus',
    description: 'A highly common benign proliferation of melanocytes. Typically uniform in color, round/oval shaped, and symmetrical.',
    features: 'Regular border, symmetrical geometry, homogeneous brown/tan pigmentation, flat (macular) or raised (papular).',
    guideline: 'No treatment required. Regular observation using the ABCDE method is advised.'
  },
  {
    name: 'Seborrheic Keratosis / Benign Keratosis',
    abbreviation: 'BKL',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Senile wart, stuck-on lesion',
    description: 'A non-cancerous benign skin tumor originating from keratinocytes. Highly prevalent in older adults, appearing as "stuck-on" waxy plaques.',
    features: 'Stuck-on appearance, waxy or greasy surface texture, colors range from pale tan to deep black.',
    guideline: 'Harmless. Removal is purely cosmetic or done if lesions become irritated/inflamed by friction.'
  },
  {
    name: 'Dermatofibroma',
    abbreviation: 'DF',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Fibrous histiocytoma',
    description: 'A common benign dermal nodule, often occurring on the lower extremities. Typically forms in response to minor trauma, such as bug bites or razor nicks.',
    features: 'Firm, hyperpigmented papule. Characterized by the "dimple sign" (invaginates when lateral pressure is applied).',
    guideline: 'Benign and stable. Excisions are rarely indicated unless symptomatic or highly irritated.'
  },
  {
    name: 'Psoriasis Vulgaris',
    abbreviation: 'PSOR',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Plaque psoriasis',
    description: 'An autoimmune inflammatory dermatosis characterized by rapid keratinocyte turnover. Leads to thick, red skin patches covered with silvery scales.',
    features: 'Well-demarcated erythematous plaques with silvery micaceous scaling. Often targets extensor surfaces (elbows, knees).',
    guideline: 'Topical corticosteroids, calcineurin inhibitors, phototherapy, or systemic biologic therapies.'
  },
  {
    name: 'Atopic Dermatitis',
    abbreviation: 'ECZ',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Eczema',
    description: 'A chronic, pruritic, inflammatory skin disease that typically begins in childhood. Strongly associated with skin barrier dysfunction and immune hyper-reactivity.',
    features: 'Pruritic, erythematous, dry patches. Exudative or lichenified depending on chronicity. Common in flexural creases.',
    guideline: 'Barrier repairs (emollients), avoiding trigger allergens, topical steroids, or immunomodulators.'
  },
  {
    name: 'Acne Vulgaris',
    abbreviation: 'ACNE',
    category: 'Inflammatory',
    risk: 'Low',
    synonyms: 'Acne, pimples, zits',
    description: 'A highly common inflammatory dermatosis of the pilosebaceous unit, occurring when hair follicles become clogged with oil and dead skin cells.',
    features: 'Comedones (blackheads/whiteheads), papules, pustules, nodules, or inflammatory cysts on sebum-rich areas.',
    guideline: 'Standard topical treatments (benzoyl peroxide, salicylic acid, retinoids) or oral antibiotics for inflammatory or nodular acne.'
  },
  {
    name: 'Ringworm',
    abbreviation: 'TIN',
    category: 'Inflammatory',
    risk: 'Low',
    synonyms: 'Tinea corporis, dermatophytosis',
    description: 'A superficial cutaneous fungal infection caused by dermatophytes. Highly contagious, spreading through direct skin contact or shared items.',
    features: 'Annular (ring-like) red plaque with a raised, scaly, active border and relative central clearing.',
    guideline: 'Application of topical antifungal creams (clotrimazole, terbinafine) for 2-4 weeks. Oral antifungals for widespread infections.'
  },
  {
    name: 'Vitiligo',
    abbreviation: 'VIT',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Leukoderma, depigmentation',
    description: 'A chronic autoimmune disease resulting in the destruction of melanocytes, leading to progressive depigmentation of the skin and hair.',
    features: 'Well-demarcated macules or patches of complete depigmentation (chalk-white), often symmetrically distributed.',
    guideline: 'Topical corticosteroids or calcineurin inhibitors, phototherapy (narrowband UVB), and sun protection.'
  },
  {
    name: 'Shingles',
    abbreviation: 'HZ',
    category: 'Inflammatory',
    risk: 'High',
    synonyms: 'Herpes Zoster',
    description: 'A painful, blistering rash caused by the reactivation of the Varicella-Zoster Virus (VZV) latent in sensory nerve ganglia.',
    features: 'Unilateral dermatomal distribution of grouped vesicles on an erythematous base, preceded by burning neuritic pain.',
    guideline: 'Initiation of oral antiviral therapy (acyclovir, valacyclovir) within 72 hours of rash onset to reduce neuralgia.'
  },
  {
    name: 'Rosacea',
    abbreviation: 'ROS',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Acne rosacea, facial flushing',
    description: 'A chronic inflammatory condition targeting facial skin, characterized by flushing, persistent erythema, papules, pustules, and telangiectasia.',
    features: 'Facial redness, flushing, visible blood vessels, small red pus-filled bumps, skin sensitivity.',
    guideline: 'Avoiding triggers (spicy food, heat), topical metronidazole or azelaic acid, oral tetracyclines for ocular or severe cases.'
  },
  {
    name: 'Urticaria',
    abbreviation: 'URT',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Hives, wheals, welts',
    description: 'An IgE-mediated or non-immunologic inflammatory skin reaction, characterized by the rapid appearance of transient, itchy wheals.',
    features: 'Edematous, pruritic plaques (wheals) with surrounding erythema, resolving within 24 hours without leaving scars.',
    guideline: 'Avoid triggers, use oral non-sedating H1 antihistamines; oral corticosteroids for acute severe episodes.'
  },
  {
    name: 'Warts',
    abbreviation: 'WAR',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Verruca vulgaris, HPV infection',
    description: 'Benign epidermal proliferations caused by Human Papillomavirus (HPV) infection of keratinocytes.',
    features: 'Hyperkeratotic, rough-surfaced papules with tiny black dots (thrombosed capillaries) on hand, feet, or body.',
    guideline: 'Often self-limiting. Treated with topical salicylic acid, cryotherapy, or cantharidin if persistent.'
  },
  {
    name: 'Seborrheic Dermatitis',
    abbreviation: 'SD',
    category: 'Inflammatory',
    risk: 'Low',
    synonyms: 'Dandruff, cradle cap',
    description: 'A common, chronic inflammatory skin condition affecting sebum-rich areas of the body, linked to Malassezia yeast overgrowth.',
    features: 'Erythematous patches with greasy, yellowish, oily scales on the scalp, face (nasolabial folds, eyebrows), or chest.',
    guideline: 'Antifungal shampoos (ketoconazole, selenium sulfide), mild topical steroids, or topical calcineurin inhibitors.'
  },
  {
    name: 'Alopecia Areata',
    abbreviation: 'AA',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Spot baldness, autoimmune hair loss',
    description: 'An autoimmune condition resulting in patchy hair loss, where the immune system attacks hair follicles in their growth phase.',
    features: 'Smooth, round, bald patches on the scalp or body, with "exclamation point" hairs at the margins.',
    guideline: 'Observation for mild cases (often self-resolving), intralesional corticosteroid injections, or topical minoxidil.'
  },
  {
    name: 'Contact Dermatitis',
    abbreviation: 'CD',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Allergic contact dermatitis, irritant contact dermatitis',
    description: 'An inflammatory skin reaction caused by direct contact with an external allergen (allergic) or chemical damage (irritant).',
    features: 'Localized pruritic erythematous rash, vesicles, or scaling matching the shape of the contact agent (e.g. nickel, poison ivy).',
    guideline: 'Identification and avoidance of trigger substances, barrier repair emollients, and topical corticosteroids.'
  },
  {
    name: 'Lichen Planus',
    abbreviation: 'LP',
    category: 'Inflammatory',
    risk: 'Moderate',
    synonyms: 'Lichenoid dermatosis',
    description: 'A chronic inflammatory, T-cell mediated autoimmune skin disease affecting skin, mucous membranes, hair, and nails.',
    features: 'The 6 "Ps": Pruritic, Purple, Polygonal, Planar, Papules, Plaques, often displaying Wickham striae (white lines).',
    guideline: 'High-potency topical corticosteroids, topical calcineurin inhibitors, or systemic therapies for refractory cases.'
  },
  {
    name: 'Cherry Angioma',
    abbreviation: 'CA',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Senile angioma, cherry hemangioma',
    description: 'A common, completely benign vascular skin growth made of clusters of capillaries. They increase in number with age.',
    features: 'Bright cherry-red, small, smooth, dome-shaped papules or macules ranging from 1mm to 5mm.',
    guideline: 'Harmless. Removal is purely cosmetic and can be achieved via laser therapy, cryotherapy, or shave excision.'
  },
  {
    name: 'Dermatosis Papulosa Nigra',
    abbreviation: 'DPN',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Flesh warts (misnomer), DPN',
    description: 'A benign cutaneous condition common in dark skin tones (Fitzpatrick IV-VI), characterized by small hyperpigmented papules on the face and neck.',
    features: 'Multiple tiny (1-5mm) hyperpigmented, dark brown or black, smooth or filiform papules clustered around cheekbones and eyes.',
    guideline: 'Entirely benign. Treated for cosmetic reasons using light curettage, electrodessication, or laser therapy, with caution to prevent hyperpigmentation.'
  },
  {
    name: 'Epidermoid Cyst',
    abbreviation: 'EC',
    category: 'Benign',
    risk: 'Low',
    synonyms: 'Sebaceous cyst (misnomer), epidermal inclusion cyst',
    description: 'A common benign encapsulation in the dermis filled with keratinous material, originating from the hair follicle infundibulum.',
    features: 'Flesh-colored to yellowish, firm, mobile subcutaneous nodule often displaying a central punctum (pore).',
    guideline: 'Incision and drainage or intralesional steroid if inflamed; complete surgical excision of the cyst wall for permanent resolution.'
  },
  {
    name: 'Bullous Pemphigoid',
    abbreviation: 'BP',
    category: 'Inflammatory',
    risk: 'High',
    synonyms: 'Pemphigoid',
    description: 'A severe, chronic autoimmune subepidermal blistering disease of the skin, typically presenting in elderly patients.',
    features: 'Large, tense, fluid-filled blisters (bullae) on normal or erythematous skin. Intensely pruritic, often preceded by hives.',
    guideline: 'Systemic or high-potency topical corticosteroids, anti-inflammatory antibiotics (doxycycline), or immunosuppressive agents. Requires specialist referral.'
  },
  {
    name: 'Keloid Scar',
    abbreviation: 'KEL',
    category: 'Benign',
    risk: 'Moderate',
    synonyms: 'Keloid nodule, hypertrophic scar tissue',
    description: 'An overgrowth of fibrous tissue (collagen) that expands beyond the boundaries of the original skin injury during healing.',
    features: 'Firm, rubbery, shiny, pink-to-hyperpigmented nodules or plaques. Often itchy or tender, continuing to grow over time.',
    guideline: 'Intralesional corticosteroid injections, silicone gel sheets, pressure therapy, cryotherapy, or laser treatments. Surgical removal has high recurrence risk.'
  }
];

export default function DiseaseRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredDiseases = DISEASES.filter(d => {
    const matchesTab = activeTab === 'All' || d.category === activeTab;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.synonyms.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'High': return 'badge-danger';
      case 'Moderate': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="animate-fade">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      <div className="max-width-container">
        <div className="section-title">
          <h2>Skin Pathology Registry</h2>
          <p>
            Browse clinical profiles, diagnostic features, and triage guidelines for target skin lesions and inflammatory conditions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="registry-controls">
          <div className="search-wrapper">
            <Search className="search-icon-svg" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, abbreviation, synonym..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Malignant', 'Benign', 'Inflammatory'].map(tab => (
              <button
                key={tab}
                className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredDiseases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-mute)' }}>
            <p>No matching pathology found in the registry database. Please try another query.</p>
          </div>
        ) : (
          <div className="registry-grid">
            {filteredDiseases.map((d, idx) => (
              <div key={idx} className="clinical-card registry-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="registry-card-header">
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{d.name}</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                      Code: {d.abbreviation} • {d.category}
                    </span>
                  </div>
                  <span className={`report-badge ${getRiskBadgeClass(d.risk)}`}>
                    {d.risk} Risk
                  </span>
                </div>

                <div className="registry-card-body" style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {d.description}
                  </p>
                  
                  {/* Key Features */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Info size={12} /> Key Visual Features
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-mute)', fontStyle: 'italic' }}>
                      {d.features}
                    </p>
                  </div>
                </div>

                <div className="registry-card-footer">
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-start', color: 'var(--text-mute)' }}>
                    {d.risk === 'High' ? (
                      <ShieldAlert size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                    ) : d.risk === 'Moderate' ? (
                      <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <CheckCircle size={16} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <span style={{ fontSize: '0.78rem' }}><strong>Triage Protocol:</strong> {d.guideline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
