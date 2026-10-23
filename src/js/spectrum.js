/**
 * 8Func - Interactive 2D Personality Spectrum
 * Zoomable & Pannable Cartographic Spectrum across 4 Quadrants (quad-tr NT, quad-tl NF, quad-bl SF, quad-br ST)
 */

import { MBTI_TYPES, getTypeTemperament } from "../data/mbtiTypes.js";
import { COGNITIVE_FUNCTIONS, FUNCTIONS_LIST } from "../data/functions.js";
import { NOTABLE_FIGURES, calculateFigureSimilarity, getFigureRole } from "../data/figures.js";
import { calculateScores } from "./scoring.js";
import { ICONS } from "./icons.js";
import { t } from "../data/translations.js";

// Colors for functions
export function getFuncTileColors(code) {
  const c = COGNITIVE_FUNCTIONS[code];
  if (c && c.color) {
    return { bg: c.color, text: "#ffffff" };
  }
  const map = {
    Ne: "#95637e", Ni: "#95637e",
    Te: "#72cccd", Ti: "#72cccd",
    Se: "#e5c727", Si: "#e5c727",
    Fe: "#9ac262", Fi: "#9ac262"
  };
  return { bg: map[code] || "#95637e", text: "#ffffff" };
}

// 16 MBTI Types Exact Spectrum Coordinates
// Plane 1 (Mind & Nature): X = T (0% F -> 100% T), Y = 100 - N (0% N -> 100% S)
// Plane 2 (Energy & Tactics): X = P (0% J -> 100% P), Y = I (0% E -> 100% I)
export const SPECTRUM_ARCHETYPES = {
  // NT Analysts (quad-tr: Top-Right)
  INTJ: {
    code: "INTJ",
    plane1: { x: 78, y: 22 }, // High T (78%), Very High N (78%)
    plane2: { x: 22, y: 78 }, // High J (78%), High I (78%)
    quadrant1: "NT",
    quadClass1: "quad-tr",
    quadrant2: "IJ",
    quadClass2: "quad-ij"
  },
  ENTJ: {
    code: "ENTJ",
    plane1: { x: 88, y: 28 }, // Very High T (88%), High N (72%)
    plane2: { x: 20, y: 22 }, // High J (80%), High E (78%)
    quadrant1: "NT",
    quadClass1: "quad-tr",
    quadrant2: "EJ",
    quadClass2: "quad-ej"
  },
  INTP: {
    code: "INTP",
    plane1: { x: 82, y: 38 }, // Very High T (82%), High N (62%)
    plane2: { x: 78, y: 78 }, // High P (78%), High I (78%)
    quadrant1: "NT",
    quadClass1: "quad-tr",
    quadrant2: "IP",
    quadClass2: "quad-ip"
  },
  ENTP: {
    code: "ENTP",
    plane1: { x: 68, y: 15 }, // High T (68%), Maximum N (85%)
    plane2: { x: 78, y: 22 }, // High P (78%), High E (78%)
    quadrant1: "NT",
    quadClass1: "quad-tr",
    quadrant2: "EP",
    quadClass2: "quad-ep"
  },

  // NF Diplomats (quad-tl: Top-Left)
  INFJ: {
    code: "INFJ",
    plane1: { x: 24, y: 22 }, // High F (76%), Very High N (78%)
    plane2: { x: 22, y: 78 }, // High J (78%), High I (78%)
    quadrant1: "NF",
    quadClass1: "quad-tl",
    quadrant2: "IJ",
    quadClass2: "quad-ij"
  },
  ENFJ: {
    code: "ENFJ",
    plane1: { x: 12, y: 28 }, // Very High F (88%), High N (72%)
    plane2: { x: 20, y: 22 }, // High J (80%), High E (78%)
    quadrant1: "NF",
    quadClass1: "quad-tl",
    quadrant2: "EJ",
    quadClass2: "quad-ej"
  },
  INFP: {
    code: "INFP",
    plane1: { x: 18, y: 38 }, // Very High F (82%), High N (62%)
    plane2: { x: 78, y: 78 }, // High P (78%), High I (78%)
    quadrant1: "NF",
    quadClass1: "quad-tl",
    quadrant2: "IP",
    quadClass2: "quad-ip"
  },
  ENFP: {
    code: "ENFP",
    plane1: { x: 32, y: 15 }, // High F (68%), Maximum N (85%)
    plane2: { x: 78, y: 22 }, // High P (78%), High E (78%)
    quadrant1: "NF",
    quadClass1: "quad-tl",
    quadrant2: "EP",
    quadClass2: "quad-ep"
  },

  // SF Sentinels/Explorers with F (quad-bl: Bottom-Left)
  ISFJ: {
    code: "ISFJ",
    plane1: { x: 24, y: 76 }, // High F (76%), Very High S (76%)
    plane2: { x: 22, y: 78 }, // High J (78%), High I (78%)
    quadrant1: "SF",
    quadClass1: "quad-bl",
    quadrant2: "IJ",
    quadClass2: "quad-ij"
  },
  ESFJ: {
    code: "ESFJ",
    plane1: { x: 12, y: 70 }, // Very High F (88%), High S (70%)
    plane2: { x: 20, y: 22 }, // High J (80%), High E (78%)
    quadrant1: "SF",
    quadClass1: "quad-bl",
    quadrant2: "EJ",
    quadClass2: "quad-ej"
  },
  ISFP: {
    code: "ISFP",
    plane1: { x: 18, y: 84 }, // Very High F (82%), Very High S (84%)
    plane2: { x: 78, y: 78 }, // High P (78%), High I (78%)
    quadrant1: "SF",
    quadClass1: "quad-bl",
    quadrant2: "IP",
    quadClass2: "quad-ip"
  },
  ESFP: {
    code: "ESFP",
    plane1: { x: 32, y: 86 }, // High F (68%), Maximum S (86%)
    plane2: { x: 78, y: 22 }, // High P (78%), High E (78%)
    quadrant1: "SF",
    quadClass1: "quad-bl",
    quadrant2: "EP",
    quadClass2: "quad-ep"
  },

  // ST Sentinels/Explorers with T (quad-br: Bottom-Right)
  ISTJ: {
    code: "ISTJ",
    plane1: { x: 76, y: 76 }, // High T (76%), Very High S (76%)
    plane2: { x: 22, y: 78 }, // High J (78%), High I (78%)
    quadrant1: "ST",
    quadClass1: "quad-br",
    quadrant2: "IJ",
    quadClass2: "quad-ij"
  },
  ESTJ: {
    code: "ESTJ",
    plane1: { x: 88, y: 70 }, // Very High T (88%), High S (70%)
    plane2: { x: 20, y: 22 }, // High J (80%), High E (78%)
    quadrant1: "ST",
    quadClass1: "quad-br",
    quadrant2: "EJ",
    quadClass2: "quad-ej"
  },
  ISTP: {
    code: "ISTP",
    plane1: { x: 82, y: 84 }, // Very High T (82%), Very High S (84%)
    plane2: { x: 78, y: 78 }, // High P (78%), High I (78%)
    quadrant1: "ST",
    quadClass1: "quad-br",
    quadrant2: "IP",
    quadClass2: "quad-ip"
  },
  ESTP: {
    code: "ESTP",
    plane1: { x: 68, y: 86 }, // High T (68%), Maximum S (86%)
    plane2: { x: 78, y: 22 }, // High P (78%), High E (78%)
    quadrant1: "ST",
    quadClass1: "quad-br",
    quadrant2: "EP",
    quadClass2: "quad-ep"
  }
};

/**
 * Explanation of why each type is situated in its specific quadrant
 */
export function getQuadrantExplanation(typeCode, lang = "ro") {
  const explanations = {
    ro: {
      NT: "Cadrantul NT (quad-tr, Dreapta-Sus) reunește Intuiția (percepția abstractă, vizionară a posibilităților viitoare) cu Gândirea (luarea deciziilor bazată pe logică rece, analiză cauză-efect și eficiență sistemică). Tipul tinde spre inovație conceptuală, arhitectură strategică și stăpânirea adevărurilor obiective.",
      NF: "Cadrantul NF (quad-tl, Stânga-Sus) combină Intuiția (orientarea spre idei, concepte și potențial uman) cu Sentimentul (evaluarea bazată pe etică profundă, empatie și autenticitate personală). Tipul urmărește armonia morală, dezvoltarea oamenilor și idealuri nobile de lungă durată.",
      SF: "Cadrantul SF (quad-bl, Stânga-Jos) unește Senzorialul (ancorarea în realitatea concretă, fapte palpabile și prezentul imediat) cu Sentimentul (empatie caldă, grijă practică pentru ceilalți și armonie socială). Tipul excelează în sprijin direct, estetică tangibilă și loialitate față de comunitate.",
      ST: "Cadrantul ST (quad-br, Dreapta-Jos) asociază Senzorialul (observarea atentă a detaliilor concrete și a mecanicii reale) cu Gândirea (rezolvarea pragmatică a problemelor, proceduri fiabile și logică instrumentală). Tipul construiește stabilitate tangibilă, eficiență operațională și măiestrie practică."
    },
    en: {
      NT: "The NT quadrant (quad-tr, Top-Right) unifies Intuition (abstract perception of future possibilities) with Thinking (decision-making grounded in objective logic and systemic efficiency). This type tends toward conceptual innovation, strategic architecture, and objective mastery.",
      NF: "The NF quadrant (quad-tl, Top-Left) blends Intuition (orientation toward ideas and human potential) with Feeling (evaluation based on deep ethics and personal authenticity). This type seeks moral harmony, personal growth, and enduring ideals.",
      SF: "The SF quadrant (quad-bl, Bottom-Left) pairs Sensing (tangible reality, practical observation) with Feeling (warm interpersonal care and social harmony). This type excels in immediate support, practical hospitality, and community stability.",
      ST: "The ST quadrant (quad-br, Bottom-Right) combines Sensing (real-world mechanics and observational focus) with Thinking (pragmatic problem-solving and structured procedures). This type builds concrete reliability and operational mastery."
    }
  };

  const arch = SPECTRUM_ARCHETYPES[typeCode];
  const q = arch?.quadrant1 || "NT";
  const dict = explanations[lang] || explanations.ro;
  return dict[q] || dict.NT;
}

/**
 * Extracts or computes the user's spectral position
 */
export function getUserSpectrumData(appState) {
  let percentages = null;
  let axisScores = null;

  if (appState.urlResultsScores) {
    percentages = appState.urlResultsScores.percentages;
    axisScores = appState.urlResultsScores.axisScores;
  } else if (appState.lastUserResults) {
    percentages = appState.lastUserResults.percentages;
    axisScores = appState.lastUserResults.axisScores;
  } else {
    try {
      const saved = localStorage.getItem("8func_last_user_results");
      if (saved) {
        const parsed = JSON.parse(saved);
        percentages = parsed.percentages;
        axisScores = parsed.axisScores;
      }
    } catch (e) {}
  }

  if (!percentages && appState.questions && appState.answers) {
    const scored = calculateScores(appState.questions, appState.answers);
    if (scored.isComplete && Object.keys(appState.answers).length >= appState.questions.length) {
      percentages = scored.percentages;
      axisScores = scored.axisScores;
    }
  }

  if (!percentages || !axisScores) {
    return {
      hasScores: false,
      userType: null,
      plane1: { x: 50, y: 50 },
      plane2: { x: 50, y: 50 },
      percentages: null,
      axisScores: null,
      distances: {}
    };
  }

  // Plane 1: Mind & Nature (T dreapta [X], N sus [100-Y])
  const pN = axisScores?.NS?.roundA ?? 50; // % N (Intuition)
  const pS = axisScores?.NS?.roundB ?? 50; // % S (Sensing)
  const pT = axisScores?.TF?.roundA ?? 50; // % T (Thinking)
  const pF = axisScores?.TF?.roundB ?? 50; // % F (Feeling)

  const compass1X = Math.max(8, Math.min(92, pT));
  const compass1Y = Math.max(8, Math.min(92, 100 - pN));

  // Plane 2: Energy & Tactics (P dreapta [X], I jos [Y])
  const pE = axisScores?.EI?.roundA ?? 50;
  const pI = axisScores?.EI?.roundB ?? 50;
  const pJ = axisScores?.JP?.roundA ?? 50;
  const pP = axisScores?.JP?.roundB ?? 50;

  const compass2X = Math.max(8, Math.min(92, pP));
  const compass2Y = Math.max(8, Math.min(92, pI));

  // Determine top MBTI code
  let topType = "INTJ";
  let minDistance = 999;
  const distances = {};

  Object.entries(SPECTRUM_ARCHETYPES).forEach(([code, arch]) => {
    const d1 = Math.hypot(compass1X - arch.plane1.x, compass1Y - arch.plane1.y);
    const d2 = Math.hypot(compass2X - arch.plane2.x, compass2Y - arch.plane2.y);
    const combinedDist = Math.round(Math.sqrt(d1 * d1 + d2 * d2) * 10) / 10;
    const similarity = Math.max(10, Math.min(99, Math.round(100 - combinedDist * 1.05)));
    distances[code] = { distance: combinedDist, similarity };
    if (combinedDist < minDistance) {
      minDistance = combinedDist;
      topType = code;
    }
  });

  return {
    hasScores: true,
    userType: topType,
    plane1: { x: compass1X, y: compass1Y, pN, pS, pT, pF },
    plane2: { x: compass2X, y: compass2Y, pE, pI, pJ, pP },
    percentages,
    axisScores,
    distances
  };
}

/**
 * Controller class for the Spectrum Screen
 */
export class SpectrumController {
  constructor(app) {
    this.app = app;
    this.activePlane = "plane1"; // 'plane1' (Mind & Nature) or 'plane2' (Energy & Tactics)
    this.selectedType = null;
    this.selectedFigure = null;
    this.showFigures = false;
    this.showGridGuides = true;
    this.filterTemperament = "ALL"; // ALL, NT, NF, SJ, SP
    this.searchQuery = "";

    // Simulated user position when no real test taken
    this.simulatedPos = { x: 78, y: 22 };
    this.isSimulating = false;

    // Pan & Zoom state
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.panStartX = 0;
    this.panStartY = 0;
    this.lastPinchDist = null;

    // Animation frame for flyTo
    this.flyAnimFrame = null;
  }

  render() {
    const lang = this.app.state.lang || "ro";
    const userData = getUserSpectrumData(this.app.state);
    
    // Choose active user position
    const userPos = userData.hasScores 
      ? (this.activePlane === "plane1" ? userData.plane1 : userData.plane2)
      : this.simulatedPos;

    const root = this.app.root;
    root.innerHTML = `
      <div class="app-shell" data-screen="spectrum">
        ${this.app.renderNavbar()}

        <main class="spectrum-main" id="spectrum-viewport-page">
          <!-- Top Control Header Bar -->
          <div class="spectrum-topbar">
            <div class="spectrum-topbar-info">
              <div class="spectrum-badge-group">
                <span class="spectrum-mode-badge">${lang === "ro" ? "CARTOGRAFIE 2D" : "2D CARTOGRAPHY"}</span>
                ${userData.hasScores ? `
                  <span class="spectrum-user-status-pill" id="btn-focus-top-user">
                    <span class="spectrum-user-dot-beacon"></span>
                    ${lang === "ro" ? "Poziția Ta:" : "Your Position:"} <strong>${userData.userType}</strong> (${Math.round(userPos.x)}%, ${Math.round(userPos.y)}%)
                  </span>
                ` : `
                  <span class="spectrum-user-status-pill spectrum-untested-pill">
                    <span class="spectrum-preview-dot"></span>
                    ${lang === "ro" ? "Test necompletat · Simulator Activ" : "Test untested · Preview Active"}
                  </span>
                `}
              </div>
              <h1 class="spectrum-page-title">${t('spectrumTitle', {}, lang)}</h1>
            </div>

            <!-- Plane Switcher Buttons (Mind & Nature vs Energy & Tactics) -->
            <div class="spectrum-plane-switcher">
              <button class="spectrum-switch-btn ${this.activePlane === 'plane1' ? 'active' : ''}" type="button" id="switch-plane-1">
                <span class="spectrum-quad-preview quad-tr"></span>
                <span>${lang === 'ro' ? 'Minte & Natură (N/S & T/F)' : 'Mind & Nature (N/S & T/F)'}</span>
              </button>
              <button class="spectrum-switch-btn ${this.activePlane === 'plane2' ? 'active' : ''}" type="button" id="switch-plane-2">
                <span class="spectrum-quad-preview quad-ej"></span>
                <span>${lang === 'ro' ? 'Energie & Tactică (E/I & J/P)' : 'Energy & Tactics (E/I & J/P)'}</span>
              </button>
            </div>
          </div>

          <!-- Secondary Toolbar: Filters, Search, Notable Figures toggle -->
          <div class="spectrum-toolbar">
            <div class="spectrum-search-box">
              <svg class="spectrum-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                id="spectrum-search-input" 
                class="spectrum-search-input" 
                placeholder="${lang === 'ro' ? 'Caută tip (INTJ, ENTP...) sau personalitate...' : 'Search type (INTJ, ENTP...) or figure...'}" 
                value="${this.searchQuery}"
                autocomplete="off"
              />
              ${this.searchQuery ? `
                <button class="spectrum-search-clear" type="button" id="spectrum-search-clear">✕</button>
              ` : ''}
            </div>

            <!-- Filter Chips (All, NT, NF, SJ, SP) -->
            <div class="spectrum-temp-chips">
              <button class="spectrum-temp-chip ${this.filterTemperament === 'ALL' ? 'active' : ''}" data-temp="ALL" type="button">
                ${lang === 'ro' ? 'Toate (16)' : 'All (16)'}
              </button>
              <button class="spectrum-temp-chip temp-nt ${this.filterTemperament === 'NT' ? 'active' : ''}" data-temp="NT" type="button">
                NT ${lang === 'ro' ? 'Analitici' : 'Analysts'}
              </button>
              <button class="spectrum-temp-chip temp-nf ${this.filterTemperament === 'NF' ? 'active' : ''}" data-temp="NF" type="button">
                NF ${lang === 'ro' ? 'Diplomați' : 'Diplomats'}
              </button>
              <button class="spectrum-temp-chip temp-sj ${this.filterTemperament === 'SJ' ? 'active' : ''}" data-temp="SJ" type="button">
                SJ ${lang === 'ro' ? 'Sentinele' : 'Sentinels'}
              </button>
              <button class="spectrum-temp-chip temp-sp ${this.filterTemperament === 'SP' ? 'active' : ''}" data-temp="SP" type="button">
                SP ${lang === 'ro' ? 'Exploratori' : 'Explorers'}
              </button>
            </div>

            <!-- Toggles (Figures, Grid) -->
            <div class="spectrum-toggles-group">
              <button class="spectrum-toggle-btn ${this.showFigures ? 'active' : ''}" type="button" id="toggle-figures-btn" title="${lang === 'ro' ? 'Afișează personalitățile istorice pe spectru' : 'Show notable figures on spectrum'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>${lang === 'ro' ? 'Celebrități (347)' : 'Figures (347)'}</span>
              </button>
              <button class="spectrum-toggle-btn ${this.showGridGuides ? 'active' : ''}" type="button" id="toggle-grid-btn" title="${lang === 'ro' ? 'Comută ghidajele de grilă' : 'Toggle grid guides'}">
                ${ICONS.grid}
                <span>${lang === 'ro' ? 'Ghidaje' : 'Guides'}</span>
              </button>
            </div>
          </div>

          ${!userData.hasScores ? `
            <!-- Non-tested notice banner with Quick Take Test or Drag info -->
            <div class="spectrum-cta-banner">
              <div class="spectrum-cta-text">
                <strong>${t('spectrumNotTakenYet', {}, lang)}</strong>
                <span>${t('spectrumTakeTestPrompt', {}, lang)}</span>
              </div>
              <div class="spectrum-cta-actions">
                <button class="e-btn e-btn-primary e-btn-sm" type="button" id="spectrum-start-quiz-btn">
                  <span>${t('spectrumTakeTestBtn', {}, lang)}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Viewport Stage -->
          <div class="spectrum-stage-container" id="spectrum-stage">
            
            <!-- Cardinal Compass Labels Outside Plane -->
            <div class="spectrum-stage-labels">
              <div class="stage-cardinal-lbl cardinal-top">
                ${this.activePlane === 'plane1' ? (lang === 'ro' ? 'INTUIȚIE (N)' : 'INTUITION (N)') : (lang === 'ro' ? 'EXTRAVERSIE (E)' : 'EXTRAVERSION (E)')}
              </div>
              <div class="stage-cardinal-lbl cardinal-bottom">
                ${this.activePlane === 'plane1' ? (lang === 'ro' ? 'SENZORIAL (S)' : 'SENSING (S)') : (lang === 'ro' ? 'INTROVERSIE (I)' : 'INTROVERSION (I)')}
              </div>
              <div class="stage-cardinal-lbl cardinal-left">
                ${this.activePlane === 'plane1' ? (lang === 'ro' ? 'SENTIMENT (F)' : 'FEELING (F)') : (lang === 'ro' ? 'JUDECĂTĂ (J)' : 'JUDGING (J)')}
              </div>
              <div class="stage-cardinal-lbl cardinal-right">
                ${this.activePlane === 'plane1' ? (lang === 'ro' ? 'GÂNDIRE (T)' : 'THINKING (T)') : (lang === 'ro' ? 'PERCEPȚIE (P)' : 'PERCEIVING (P)')}
              </div>
            </div>

            <!-- Pannable and Zoomable Canvas Wrapper -->
            <div class="spectrum-canvas-viewport" id="spectrum-canvas-viewport">
              <div class="spectrum-transform-plane" id="spectrum-plane">
                
                <!-- 4 Quadrant Background Rectangles -->
                <div class="spectrum-quadrants-grid">
                  ${this.activePlane === 'plane1' ? `
                    <div class="spectrum-quadrant-block quad-tl" title="NF — Diplomats">
                      <span class="quad-watermark">NF</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'DIPLOMAȚI' : 'DIPLOMATS'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-tr" title="NT — Analysts">
                      <span class="quad-watermark">NT</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'ANALITICI' : 'ANALYSTS'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-bl" title="SF — Sentinels & Explorers F">
                      <span class="quad-watermark">SF</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'EXPLORATORI & SENTINELE (SF)' : 'EXPLORERS & SENTINELS (SF)'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-br" title="ST — Sentinels & Explorers T">
                      <span class="quad-watermark">ST</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'SENTINELE & EXPLORATORI (ST)' : 'SENTINELS & EXPLORERS (ST)'}</span>
                    </div>
                  ` : `
                    <div class="spectrum-quadrant-block quad-ej" title="EJ — Extraverted Judging">
                      <span class="quad-watermark">EJ</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'LIDERI DIRECTORI (EJ)' : 'DIRECTIVE LEADERS (EJ)'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-ep" title="EP — Extraverted Perceiving">
                      <span class="quad-watermark">EP</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'EXPLORATORI DINAMICI (EP)' : 'DYNAMIC EXPLORERS (EP)'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-ij" title="IJ — Introverted Judging">
                      <span class="quad-watermark">IJ</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'STRATEGI METODICI (IJ)' : 'METHODICAL STRATEGISTS (IJ)'}</span>
                    </div>
                    <div class="spectrum-quadrant-block quad-ip" title="IP — Introverted Perceiving">
                      <span class="quad-watermark">IP</span>
                      <span class="quad-title-lbl">${lang === 'ro' ? 'GÂNDITORI REFLEXIVI (IP)' : 'REFLECTIVE THINKERS (IP)'}</span>
                    </div>
                  `}
                </div>

                <!-- Grid & Crosshair Overlays -->
                <div class="spectrum-overlay-elements ${this.showGridGuides ? 'guides-active' : ''}">
                  <div class="spectrum-center-axis-h"></div>
                  <div class="spectrum-center-axis-v"></div>
                  <div class="spectrum-concentric-circle circle-25"></div>
                  <div class="spectrum-concentric-circle circle-50"></div>
                  <div class="spectrum-concentric-circle circle-75"></div>
                  <div class="spectrum-diag-line diag-1"></div>
                  <div class="spectrum-diag-line diag-2"></div>
                </div>

                <!-- 16 Archetype Cards Layer -->
                <div class="spectrum-archetypes-layer" id="spectrum-archetypes-layer">
                  ${this.renderArchetypeNodesHtml(lang, userData)}
                </div>

                <!-- Optional Notable Figures Layer -->
                ${this.showFigures ? `
                  <div class="spectrum-figures-layer" id="spectrum-figures-layer">
                    ${this.renderNotableFiguresHtml(lang, userData)}
                  </div>
                ` : ''}

                <!-- User Position Beacon (TU / YOU) -->
                ${this.renderUserBeaconHtml(lang, userData, userPos)}

              </div>
            </div>

            <!-- Floating Controls HUD (Zoom In, Zoom Out, Reset, Focus Me, Minimap) -->
            <div class="spectrum-hud-controls">
              <button class="spectrum-hud-btn" type="button" id="hud-zoom-in" title="${t('spectrumZoomIn', {}, lang)}">
                ${ICONS.zoomIn}
              </button>
              <button class="spectrum-hud-btn" type="button" id="hud-zoom-out" title="${t('spectrumZoomOut', {}, lang)}">
                ${ICONS.zoomOut}
              </button>
              <button class="spectrum-hud-btn" type="button" id="hud-zoom-reset" title="${t('spectrumResetView', {}, lang)}">
                <span id="hud-zoom-level-text">100%</span>
              </button>
              <button class="spectrum-hud-btn" type="button" id="hud-fit-all" title="${t('spectrumFitAll', {}, lang)}">
                ${ICONS.expand}
              </button>
              <button class="spectrum-hud-btn spectrum-hud-focus-btn" type="button" id="hud-focus-user" title="${t('spectrumFocusMe', {}, lang)}">
                ${ICONS.target}
                <span class="hud-btn-lbl">${lang === 'ro' ? 'Tu' : 'You'}</span>
              </button>
            </div>

            <!-- Minimap Radar in Corner -->
            <div class="spectrum-minimap-radar" id="spectrum-minimap">
              <div class="minimap-grid-preview">
                <div class="minimap-quad q-tl"></div>
                <div class="minimap-quad q-tr"></div>
                <div class="minimap-quad q-bl"></div>
                <div class="minimap-quad q-br"></div>
                <div class="minimap-user-dot" style="left: ${userPos.x}%; top: ${userPos.y}%;"></div>
                <div class="minimap-viewport-box" id="minimap-viewport-box"></div>
              </div>
            </div>

          </div>

          <!-- Bottom Coordinates Bar & Instructions -->
          <div class="spectrum-bottom-legend">
            <div class="spectrum-legend-item">
              <span class="legend-color-dot" style="background: #95637e;"></span>
              <span><b>NT</b> ${lang === 'ro' ? 'Analitici' : 'Analysts'}</span>
            </div>
            <div class="spectrum-legend-item">
              <span class="legend-color-dot" style="background: #9ac262;"></span>
              <span><b>NF</b> ${lang === 'ro' ? 'Diplomați' : 'Diplomats'}</span>
            </div>
            <div class="spectrum-legend-item">
              <span class="legend-color-dot" style="background: #e5c727;"></span>
              <span><b>SF</b> ${lang === 'ro' ? 'Exploratori F' : 'Explorers F'}</span>
            </div>
            <div class="spectrum-legend-item">
              <span class="legend-color-dot" style="background: #72cccd;"></span>
              <span><b>ST</b> ${lang === 'ro' ? 'Sentinele T' : 'Sentinels T'}</span>
            </div>
            <div class="spectrum-legend-hint">
              <span>💡 ${t('spectrumInspectHint', {}, lang)} · Drag pentru deplasare · Scroll pentru zoom</span>
            </div>
          </div>

        </main>

        <!-- Slide-out Archetype Details Inspector Drawer -->
        <div class="spectrum-drawer-backdrop" id="spectrum-drawer-backdrop"></div>
        <aside class="spectrum-inspector-drawer" id="spectrum-drawer" aria-hidden="true">
          <div class="spectrum-drawer-inner" id="spectrum-drawer-content">
            <!-- Dynamically populated on click -->
          </div>
        </aside>
      </div>
    `;

    this.attachEvents();
    this.updateCanvasTransform();
  }

  renderArchetypeNodesHtml(lang, userData) {
    const qMatches = (type) => {
      if (this.filterTemperament === "ALL") return true;
      const t = getTypeTemperament(type);
      return t.code === this.filterTemperament;
    };

    const searchLower = this.searchQuery.trim().toLowerCase();

    return Object.entries(SPECTRUM_ARCHETYPES).map(([code, data]) => {
      const typeData = MBTI_TYPES[code] || {};
      const pos = this.activePlane === "plane1" ? data.plane1 : data.plane2;
      const temp = getTypeTemperament(code);
      const isVisible = qMatches(code) && (!searchLower || code.toLowerCase().includes(searchLower) || (typeData.title && typeData.title.toLowerCase().includes(searchLower)));
      const isSelected = this.selectedType === code;

      // Find notable figures representing this type
      const reps = NOTABLE_FIGURES.filter(f => f.mbti === code).slice(0, 3);

      // Distance to user if user has scores
      const userDistInfo = userData.distances?.[code];
      const matchPct = userDistInfo ? userDistInfo.similarity : null;

      // Stack pills
      const stack = typeData.stack || [];

      return `
        <div 
          class="spectrum-type-node ${isSelected ? 'is-selected' : ''} ${!isVisible ? 'is-dimmed' : ''}" 
          data-type="${code}"
          style="left: ${pos.x}%; top: ${pos.y}%; --node-color: ${temp.color};"
          role="button"
          tabindex="0"
          aria-label="${code} - ${typeData.title || ''}"
        >
          <div class="type-node-glow"></div>
          <div class="type-node-card">
            <div class="type-node-head">
              <span class="type-node-badge" style="background: ${temp.color};">${code}</span>
              ${matchPct !== null ? `
                <span class="type-node-match" title="${lang === 'ro' ? 'Compatibilitate cu tine' : 'Match with you'}">${matchPct}%</span>
              ` : ''}
            </div>
            <div class="type-node-title">${typeData.title || code}</div>
            
            <div class="type-node-functions">
              ${stack.slice(0, 2).map(f => {
                const fColor = getFuncTileColors(f).bg;
                return `<span class="type-mini-pill" style="background: ${fColor};">${f}</span>`;
              }).join("")}
            </div>

            <!-- Avatars Preview of Famous Figures -->
            <div class="type-node-figures-row">
              ${reps.map(r => `
                <div class="type-mini-avatar" title="${r.name} · ${code}">
                  ${r.photo ? `
                    <img src="${r.photo}" alt="${r.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <span style="display:none;">${r.avatar || r.name.charAt(0)}</span>
                  ` : `
                    <span>${r.avatar || r.name.charAt(0)}</span>
                  `}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderNotableFiguresHtml(lang, userData) {
    // Map notable figures to their coordinates on current plane
    const searchLower = this.searchQuery.trim().toLowerCase();

    return NOTABLE_FIGURES.map(fig => {
      let x, y;
      if (this.activePlane === "plane1") {
        const figT = fig.axes ? fig.axes.T : (fig.mbti.includes("T") ? 75 : 25);
        const figN = fig.axes ? fig.axes.N : (fig.mbti.includes("N") ? 75 : 25);
        x = Math.max(6, Math.min(94, figT));
        y = Math.max(6, Math.min(94, 100 - figN));
      } else {
        const figP = fig.axes ? fig.axes.P : (fig.mbti.includes("P") ? 75 : 25);
        const figI = fig.axes ? fig.axes.I : (fig.mbti.includes("I") ? 75 : 25);
        x = Math.max(6, Math.min(94, figP));
        y = Math.max(6, Math.min(94, figI));
      }

      const temp = getTypeTemperament(fig.mbti);
      const isMatch = !searchLower || fig.name.toLowerCase().includes(searchLower) || fig.mbti.toLowerCase().includes(searchLower);

      return `
        <div 
          class="spectrum-figure-dot ${!isMatch ? 'figure-dot-dimmed' : ''}" 
          data-fig-id="${fig.id}"
          style="left: ${x}%; top: ${y}%; --fig-color: ${temp.color};"
          title="${fig.name} (${fig.mbti})"
        >
          ${fig.photo ? `
            <img class="fig-dot-img" src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="fig-dot-fallback" style="display:none;">${fig.avatar || fig.name.charAt(0)}</div>
          ` : `
            <div class="fig-dot-fallback">${fig.avatar || fig.name.charAt(0)}</div>
          `}
          <span class="fig-dot-label">${fig.name}</span>
        </div>
      `;
    }).join("");
  }

  renderUserBeaconHtml(lang, userData, userPos) {
    const isReal = userData.hasScores;
    const label = isReal ? (lang === 'ro' ? 'TU' : 'YOU') : (lang === 'ro' ? 'TU (Simulat)' : 'YOU (Preview)');
    const typeTag = userData.userType ? `(${userData.userType})` : '';

    return `
      <div 
        class="spectrum-user-beacon ${isReal ? 'beacon-real' : 'beacon-simulated'}"
        id="spectrum-user-pin"
        style="left: ${userPos.x}%; top: ${userPos.y}%;"
        title="${label} ${typeTag}"
      >
        <div class="user-pulse-ring ring-1"></div>
        <div class="user-pulse-ring ring-2"></div>
        <div class="user-center-target">
          <span class="user-target-dot"></span>
        </div>
        <div class="user-beacon-card">
          <span class="user-beacon-tag">${label}</span>
          ${typeTag ? `<span class="user-beacon-type">${typeTag}</span>` : ''}
          <span class="user-beacon-coords">${Math.round(userPos.x)}%, ${Math.round(userPos.y)}%</span>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.app.attachNavEvents();

    const stage = document.getElementById("spectrum-stage");
    const viewport = document.getElementById("spectrum-canvas-viewport");
    const plane = document.getElementById("spectrum-plane");
    if (!stage || !viewport || !plane) return;

    // Plane Switchers
    const btnPlane1 = document.getElementById("switch-plane-1");
    if (btnPlane1) {
      btnPlane1.addEventListener("click", () => {
        this.activePlane = "plane1";
        this.render();
      });
    }

    const btnPlane2 = document.getElementById("switch-plane-2");
    if (btnPlane2) {
      btnPlane2.addEventListener("click", () => {
        this.activePlane = "plane2";
        this.render();
      });
    }

    // Search input
    const searchInput = document.getElementById("spectrum-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        const layer = document.getElementById("spectrum-archetypes-layer");
        if (layer) {
          layer.innerHTML = this.renderArchetypeNodesHtml(this.app.state.lang || "ro", getUserSpectrumData(this.app.state));
          this.attachNodeClickEvents();
        }
      });
    }

    const clearSearch = document.getElementById("spectrum-search-clear");
    if (clearSearch) {
      clearSearch.addEventListener("click", () => {
        this.searchQuery = "";
        this.render();
      });
    }

    // Temperament filter chips
    document.querySelectorAll(".spectrum-temp-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        this.filterTemperament = chip.getAttribute("data-temp") || "ALL";
        this.render();
      });
    });

    // Toggle Notable Figures
    const toggleFiguresBtn = document.getElementById("toggle-figures-btn");
    if (toggleFiguresBtn) {
      toggleFiguresBtn.addEventListener("click", () => {
        this.showFigures = !this.showFigures;
        this.render();
      });
    }

    // Toggle Grid Guides
    const toggleGridBtn = document.getElementById("toggle-grid-btn");
    if (toggleGridBtn) {
      toggleGridBtn.addEventListener("click", () => {
        this.showGridGuides = !this.showGridGuides;
        const overlay = document.querySelector(".spectrum-overlay-elements");
        if (overlay) {
          overlay.classList.toggle("guides-active", this.showGridGuides);
        }
        toggleGridBtn.classList.toggle("active", this.showGridGuides);
      });
    }

    // CTA Start Quiz button
    const ctaStartBtn = document.getElementById("spectrum-start-quiz-btn");
    if (ctaStartBtn) {
      ctaStartBtn.addEventListener("click", () => {
        this.app.state.showWelcome();
      });
    }

    // Top status pill focus
    const topFocusBtn = document.getElementById("btn-focus-top-user");
    if (topFocusBtn) {
      topFocusBtn.addEventListener("click", () => this.focusOnUser());
    }

    // HUD buttons
    const btnZoomIn = document.getElementById("hud-zoom-in");
    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => this.zoomBy(0.25));
    }

    const btnZoomOut = document.getElementById("hud-zoom-out");
    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => this.zoomBy(-0.25));
    }

    const btnZoomReset = document.getElementById("hud-zoom-reset");
    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", () => {
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.updateCanvasTransform();
      });
    }

    const btnFitAll = document.getElementById("hud-fit-all");
    if (btnFitAll) {
      btnFitAll.addEventListener("click", () => {
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.updateCanvasTransform();
      });
    }

    const btnFocusUser = document.getElementById("hud-focus-user");
    if (btnFocusUser) {
      btnFocusUser.addEventListener("click", () => this.focusOnUser());
    }

    // Attach Archetype Node Click Handlers
    this.attachNodeClickEvents();

    // Attach Figure Click Handlers
    this.attachFigureClickEvents();

    // Mouse Pan & Zoom Handling
    this.initPanAndZoom(viewport);

    // Drawer Backdrop Click to close
    const backdrop = document.getElementById("spectrum-drawer-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeDrawer());
    }
  }

  attachNodeClickEvents() {
    document.querySelectorAll(".spectrum-type-node").forEach(node => {
      const typeCode = node.getAttribute("data-type");
      const handleClick = () => {
        this.selectedType = typeCode;
        this.openArchetypeDrawer(typeCode);
        document.querySelectorAll(".spectrum-type-node").forEach(n => n.classList.remove("is-selected"));
        node.classList.add("is-selected");
      };
      node.addEventListener("click", handleClick);
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      });
    });
  }

  attachFigureClickEvents() {
    document.querySelectorAll(".spectrum-figure-dot").forEach(dot => {
      const figId = dot.getAttribute("data-fig-id");
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        this.app.openFigureDetailModal(figId, true);
      });
    });
  }

  initPanAndZoom(viewport) {
    // Wheel zoom centered at mouse position
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Delta zoom
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newZoom = Math.max(0.6, Math.min(4.5, this.zoom * zoomFactor));

      if (newZoom !== this.zoom) {
        // Adjust pan so point under cursor stays at same relative position
        this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
        this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
        this.zoom = newZoom;
        this.updateCanvasTransform();
      }
    }, { passive: false });

    // Mouse Drag Pan
    viewport.addEventListener("mousedown", (e) => {
      // If clicking directly on an archetype card or button, don't drag immediately
      if (e.target.closest("button") || e.target.closest(".type-node-card") || e.target.closest(".spectrum-figure-dot")) {
        return;
      }
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.panStartX = this.panX;
      this.panStartY = this.panY;
      viewport.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.panX = this.panStartX + dx;
      this.panY = this.panStartY + dy;
      this.updateCanvasTransform();
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (viewport) viewport.style.cursor = "grab";
      }
    });

    // Touch Support: Drag & Pinch to Zoom
    viewport.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
        this.panStartX = this.panX;
        this.panStartY = this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        this.lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    viewport.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.dragStartX;
        const dy = e.touches[0].clientY - this.dragStartY;
        this.panX = this.panStartX + dx;
        this.panY = this.panStartY + dy;
        this.updateCanvasTransform();
      } else if (e.touches.length === 2 && this.lastPinchDist) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / this.lastPinchDist;
        const newZoom = Math.max(0.6, Math.min(4.5, this.zoom * factor));
        this.zoom = newZoom;
        this.lastPinchDist = dist;
        this.updateCanvasTransform();
      }
    }, { passive: true });

    viewport.addEventListener("touchend", () => {
      this.isDragging = false;
      this.lastPinchDist = null;
    });
  }

  zoomBy(delta) {
    const newZoom = Math.max(0.6, Math.min(4.5, this.zoom + delta));
    this.zoom = newZoom;
    this.updateCanvasTransform();
  }

  updateCanvasTransform() {
    const plane = document.getElementById("spectrum-plane");
    const zoomText = document.getElementById("hud-zoom-level-text");
    const minimapBox = document.getElementById("minimap-viewport-box");

    if (plane) {
      plane.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`;
    }
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.zoom * 100)}%`;
    }

    // Update minimap box indicator
    if (minimapBox) {
      const invZoom = 1 / Math.max(0.6, this.zoom);
      const w = Math.min(100, Math.max(20, 100 * invZoom));
      const h = Math.min(100, Math.max(20, 100 * invZoom));
      const left = Math.max(0, Math.min(100 - w, 50 - (w / 2) - (this.panX / 8)));
      const top = Math.max(0, Math.min(100 - h, 50 - (h / 2) - (this.panY / 8)));
      minimapBox.style.width = `${w}%`;
      minimapBox.style.height = `${h}%`;
      minimapBox.style.left = `${left}%`;
      minimapBox.style.top = `${top}%`;
    }
  }

  focusOnUser() {
    const userData = getUserSpectrumData(this.app.state);
    const userPos = userData.hasScores 
      ? (this.activePlane === "plane1" ? userData.plane1 : userData.plane2)
      : this.simulatedPos;

    this.flyToPercent(userPos.x, userPos.y, 1.8);
  }

  flyToPercent(pctX, pctY, targetZoom = 1.6) {
    const viewport = document.getElementById("spectrum-canvas-viewport");
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const planeWidth = 1000;
    const planeHeight = 1000;

    // Point in plane pixels
    const targetPxX = (pctX / 100) * planeWidth;
    const targetPxY = (pctY / 100) * planeHeight;

    // Viewport center
    const vpCenterX = rect.width / 2;
    const vpCenterY = rect.height / 2;

    const targetPanX = vpCenterX - (targetPxX * targetZoom);
    const targetPanY = vpCenterY - (targetPxY * targetZoom);

    // Smooth transition
    const startPanX = this.panX;
    const startPanY = this.panY;
    const startZoom = this.zoom;
    const duration = 500;
    const startTime = performance.now();

    if (this.flyAnimFrame) cancelAnimationFrame(this.flyAnimFrame);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.panX = startPanX + (targetPanX - startPanX) * ease;
      this.panY = startPanY + (targetPanY - startPanY) * ease;
      this.zoom = startZoom + (targetZoom - startZoom) * ease;
      this.updateCanvasTransform();

      if (progress < 1) {
        this.flyAnimFrame = requestAnimationFrame(animate);
      }
    };

    this.flyAnimFrame = requestAnimationFrame(animate);
  }

  openArchetypeDrawer(typeCode) {
    const lang = this.app.state.lang || "ro";
    const typeData = MBTI_TYPES[typeCode] || {};
    const arch = SPECTRUM_ARCHETYPES[typeCode];
    if (!arch) return;

    const temp = getTypeTemperament(typeCode);
    const pos = this.activePlane === "plane1" ? arch.plane1 : arch.plane2;
    const userData = getUserSpectrumData(this.app.state);
    const userDistInfo = userData.distances?.[typeCode];

    const drawer = document.getElementById("spectrum-drawer");
    const backdrop = document.getElementById("spectrum-drawer-backdrop");
    const content = document.getElementById("spectrum-drawer-content");
    if (!drawer || !backdrop || !content) return;

    // Famous figures with this MBTI
    const reps = NOTABLE_FIGURES.filter(f => f.mbti === typeCode);

    // Quadrant explanation text
    const quadExplanation = getQuadrantExplanation(typeCode, lang);

    const stack = typeData.stack || [];
    const shadow = typeData.shadow || [];

    content.innerHTML = `
      <div class="drawer-header" style="--temp-color: ${temp.color};">
        <button class="drawer-close-btn" type="button" id="drawer-close-btn" aria-label="Close drawer">✕</button>
        <div class="drawer-header-tags">
          <span class="drawer-code-pill" style="background: ${temp.color};">${typeCode}</span>
          <span class="drawer-temp-pill">${temp.name} (${arch.quadrant1})</span>
          ${userDistInfo ? `
            <span class="drawer-match-pill">${userDistInfo.similarity}% ${lang === 'ro' ? 'compatibilitate cu tine' : 'match with you'}</span>
          ` : ''}
        </div>
        <h2 class="drawer-title">${typeData.title || typeCode}</h2>
        <div class="drawer-subtitle">${typeData.subtitle || ''}</div>
      </div>

      <div class="drawer-body">
        
        <!-- Quadrant Location & Coordinates Box -->
        <section class="drawer-card drawer-quadrant-box">
          <h4 class="drawer-section-title">${lang === 'ro' ? 'Poziție pe Spectru & Cadrant' : 'Spectrum Position & Quadrant'}</h4>
          <div class="drawer-quadrant-tag-row">
            <span class="drawer-quad-badge ${arch.quadClass1}">${arch.quadrant1} (${arch.quadClass1})</span>
            <span class="drawer-coord-item">${pos.x}% X · ${pos.y}% Y</span>
          </div>
          <p class="drawer-quad-desc">
            ${quadExplanation}
          </p>
        </section>

        <!-- Cognitive Functions Stack (8 Jungian Functions) -->
        <section class="drawer-card">
          <h4 class="drawer-section-title">${lang === 'ro' ? 'Ierarhia celor 8 Funcții Cognitive' : 'The 8 Cognitive Functions Stack'}</h4>
          
          <div class="drawer-stack-group">
            <div class="drawer-stack-label">${lang === 'ro' ? 'STIVA CONȘTIENTĂ (Grant Hierarchy)' : 'CONSCIOUS STACK (Grant Hierarchy)'}</div>
            <div class="drawer-stack-grid">
              ${stack.map((fnCode, idx) => {
                const rolesRo = ["1. Dominantă", "2. Auxiliară", "3. Terțiară", "4. Inferioară"];
                const rolesEn = ["1. Dominant", "2. Auxiliary", "3. Tertiary", "4. Inferior"];
                const roleLabel = lang === 'ro' ? rolesRo[idx] : rolesEn[idx];
                const fnInfo = COGNITIVE_FUNCTIONS[fnCode];
                const fnName = lang === 'ro' ? (fnInfo?.nameRo || fnInfo?.name || fnCode) : (fnInfo?.name || fnCode);
                const fColors = getFuncTileColors(fnCode);

                return `
                  <div class="drawer-func-row">
                    <span class="drawer-func-pill" style="background: ${fColors.bg};">${fnCode}</span>
                    <div class="drawer-func-info">
                      <strong>${roleLabel}: ${fnName}</strong>
                      <small>${fnInfo?.keywords || ''}</small>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="drawer-stack-group" style="margin-top: 1rem;">
            <div class="drawer-stack-label">${lang === 'ro' ? 'FUNCȚII UMBRĂ (Shadow Functions)' : 'SHADOW FUNCTIONS'}</div>
            <div class="drawer-stack-shadow-grid">
              ${shadow.map((fnCode, idx) => {
                const sRolesRo = ["5. Opusă", "6. Părinte Critic", "7. Păcălici", "8. Demon"];
                const sRolesEn = ["5. Opposing", "6. Critical Parent", "7. Trickster", "8. Demon"];
                const sLabel = lang === 'ro' ? sRolesRo[idx] : sRolesEn[idx];
                const fColors = getFuncTileColors(fnCode);

                return `
                  <div class="drawer-shadow-item">
                    <span class="drawer-func-pill pill-sm" style="background: ${fColors.bg};">${fnCode}</span>
                    <span>${sLabel}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </section>

        <!-- Quote & Description -->
        <section class="drawer-card">
          <blockquote class="drawer-quote" style="border-left: 3px solid ${temp.color};">
            "${typeData.quote || ''}"
          </blockquote>
          <p class="drawer-desc-p">${typeData.description || ''}</p>
          ${typeData.strengths ? `
            <div class="drawer-strengths-box">
              <strong>${lang === 'ro' ? 'Puncte Forte:' : 'Core Strengths:'}</strong>
              <p>${typeData.strengths}</p>
            </div>
          ` : ''}
        </section>

        <!-- Famous Personalities Gallery -->
        <section class="drawer-card">
          <div class="drawer-card-head">
            <h4 class="drawer-section-title">${lang === 'ro' ? 'Personalități Istorice Notabile' : 'Notable Figures of this Type'} (${reps.length})</h4>
          </div>
          <div class="drawer-figures-grid">
            ${reps.slice(0, 8).map(fig => {
              const cleanRole = getFigureRole(fig, lang);
              return `
                <div class="drawer-figure-card" data-fig-id="${fig.id}" role="button" tabindex="0">
                  <div class="drawer-fig-photo-wrap">
                    ${fig.photo ? `
                      <img src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                      <div class="drawer-fig-fallback" style="display:none;">${fig.avatar || fig.name.charAt(0)}</div>
                    ` : `
                      <div class="drawer-fig-fallback">${fig.avatar || fig.name.charAt(0)}</div>
                    `}
                  </div>
                  <div class="drawer-fig-meta">
                    <strong class="drawer-fig-name">${fig.name}</strong>
                    <span class="drawer-fig-role">${cleanRole}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>

      </div>
    `;

    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("active");

    const closeBtn = document.getElementById("drawer-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeDrawer());
    }

    // Clicking any figure inside drawer opens modal
    content.querySelectorAll(".drawer-figure-card").forEach(c => {
      c.addEventListener("click", () => {
        const figId = c.getAttribute("data-fig-id");
        this.app.openFigureDetailModal(figId, true);
      });
    });
  }

  closeDrawer() {
    const drawer = document.getElementById("spectrum-drawer");
    const backdrop = document.getElementById("spectrum-drawer-backdrop");
    if (drawer) {
      drawer.classList.remove("active");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) {
      backdrop.classList.remove("active");
    }
    this.selectedType = null;
    document.querySelectorAll(".spectrum-type-node").forEach(n => n.classList.remove("is-selected"));
  }
}
