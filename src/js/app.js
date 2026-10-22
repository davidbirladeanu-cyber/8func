/**
 * 8Func - Application Controller & View Renderer
 * 12Axes Authentic Spectrum Architecture: NE-SI, NI-SE, TE-FI, TI-FE
 */

import { AppState } from "./state.js";
import { COGNITIVE_FUNCTIONS, FUNCTIONS_LIST } from "../data/functions.js";
import { TEST_MODES, getQuestionText, ALL_QUESTIONS, getQuestionsForMode } from "../data/questions.js";
import { ANSWER_OPTIONS, ANSWER_VALUE_MAP, getAnswerOptions, calculateScores, buildResultsUrlPath } from "./scoring.js";
import { MBTI_TYPES, calculateBestMbtiType, getTypeTemperament } from "../data/mbtiTypes.js";
import { NOTABLE_FIGURES, getRankedFigures, calculateFigureSimilarity } from "../data/figures.js";
import { ICONS } from "./icons.js";
import { t, TRANSLATIONS } from "../data/translations.js";
import { recordQuizSubmission, initVaultTriggers } from "./vault.js";
import { generateResultsCardCanvas, openResultsImageModal } from "./cardGenerator.js";

// MBTI Dichotomy Calculation from the 8 Cognitive Functions
// Difference of group means centered at 50% (neutral baseline)
export function calculateMbtiDichotomies(percentages) {
  const ne = percentages["Ne"] ?? 50;
  const ni = percentages["Ni"] ?? 50;
  const te = percentages["Te"] ?? 50;
  const ti = percentages["Ti"] ?? 50;
  const fe = percentages["Fe"] ?? 50;
  const fi = percentages["Fi"] ?? 50;
  const se = percentages["Se"] ?? 50;
  const si = percentages["Si"] ?? 50;

  const clamp100 = (val) => Math.max(0, Math.min(100, Math.round(val)));

  // 1. Extraversion (E) vs Introversion (I)
  // E_avg = (Ne + Se + Te + Fe) / 4, I_avg = (Ni + Si + Ti + Fi) / 4
  // %E = 50 + (E_avg - I_avg) / 2, %I = 100 - %E
  const eAvg = (ne + se + te + fe) / 4;
  const iAvg = (ni + si + ti + fi) / 4;
  const ePct = clamp100(50 + (eAvg - iAvg) / 2);
  const iPct = 100 - ePct;

  // 2. Intuition (N) vs Sensing (S)
  // N_avg = (Ne + Ni) / 2, S_avg = (Se + Si) / 2
  // %N = 50 + (N_avg - S_avg) / 2, %S = 100 - %N
  const nAvg = (ne + ni) / 2;
  const sAvg = (se + si) / 2;
  const nPct = clamp100(50 + (nAvg - sAvg) / 2);
  const sPct = 100 - nPct;

  // 3. Thinking (T) vs Feeling (F)
  // T_avg = (Te + Ti) / 2, F_avg = (Fe + Fi) / 2
  // %T = 50 + (T_avg - F_avg) / 2, %F = 100 - %T
  const tAvg = (te + ti) / 2;
  const fAvg = (fe + fi) / 2;
  const tPct = clamp100(50 + (tAvg - fAvg) / 2);
  const fPct = 100 - tPct;

  // 4. Perceiving (P) vs Judging (J)
  // Symmetrical mean difference centered at 50%:
  // P_avg = (Ne + Se + Ti + Fi) / 4, J_avg = (Te + Fe + Ni + Si) / 4
  // %P = 50 + (P_avg - J_avg) / 2, %J = 100 - %P
  const pAvg = (ne + se + ti + fi) / 4;
  const jAvg = (te + fe + ni + si) / 4;
  const pPct = clamp100(50 + (pAvg - jAvg) / 2);
  const jPct = 100 - pPct;

  return {
    IE: { left: iPct, right: ePct, iAvg, eAvg },
    NS: { left: nPct, right: sPct, nAvg, sAvg },
    TF: { left: tPct, right: fPct, tAvg, fAvg },
    PJ: { left: pPct, right: jPct, pAvg, jAvg }
  };
}

export function getPreferenceTier(pct) {
  if (pct === 50) return "Balanced (50% / 50%)";
  if (pct <= 54) return "Slight preference (Mixed profile)";
  if (pct <= 64) return "Moderate preference";
  return "Stronger preference";
}

// The 4 MBTI Dichotomy Spectrum Axes (I-E, N-S, T-F, P-J)
const MBTI_SPECTRUM_AXES = [
  {
    id: "ie_axis",
    title: "I — E",
    subtitle: "Energy: Introversion vs Extraversion",
    left: "I",
    leftName: "Introversion",
    right: "E",
    rightName: "Extraversion",
    leftColor: "#3B49DF",
    rightColor: "#8A3AA0",
    dichotomy: "IE",
    leftIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    rightIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>`
  },
  {
    id: "ns_axis",
    title: "N — S",
    subtitle: "Perception: Intuition vs Sensing",
    left: "N",
    leftName: "Intuition",
    right: "S",
    rightName: "Sensing",
    leftColor: "#9333EA",
    rightColor: "#D97706",
    dichotomy: "NS",
    leftIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path><path d="M9 21h6"></path></svg>`,
    rightIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
  },
  {
    id: "tf_axis",
    title: "T — F",
    subtitle: "Judgment: Thinking vs Feeling",
    left: "T",
    leftName: "Thinking",
    right: "F",
    rightName: "Feeling",
    leftColor: "#0284C7",
    rightColor: "#16A34A",
    dichotomy: "TF",
    leftIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>`,
    rightIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`
  },
  {
    id: "pj_axis",
    title: "P — J",
    subtitle: "Lifestyle: Perceiving vs Judging",
    left: "P",
    leftName: "Perceiving",
    right: "J",
    rightName: "Judging",
    leftColor: "#EA580C",
    rightColor: "#0D9488",
    dichotomy: "PJ",
    leftIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    rightIcon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>`
  }
];

class App {
  constructor() {
    this.state = new AppState();
    this.root = document.getElementById("root");
    this.isAdvancing = false;

    this.figuresTab = "similar"; // 'similar' | 'opposite'
    this.selectedFigureId = NOTABLE_FIGURES[0].id;
    this.lastRecordedSignature = null;

    // Apply saved theme
    document.documentElement.setAttribute("data-theme", this.state.theme);

    // Subscribe to state changes
    this.state.subscribe(() => this.render());

    // Setup global keyboard shortcuts
    this.bindKeyboardShortcuts();

    // Initialize secret vault triggers (Ctrl+Shift+S, logo 5-click, #vault)
    initVaultTriggers();

    // Initial render
    this.render();
  }

  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (document.querySelector(".modal-overlay.active")) {
        if (e.key === "Escape") this.closeModal();
        return;
      }

      if (this.state.screen !== "quiz") return;

      const q = this.state.getCurrentQuestion();
      if (!q) return;

      if (q.format === "wouldYouRather" || q.format === "direct") {
        if (e.key === "1" || e.key === "a" || e.key === "A") {
          this.handleAnswerClick(q.id, "A");
        } else if (e.key === "2" || e.key === "b" || e.key === "B") {
          this.handleAnswerClick(q.id, "B");
        }
      } else {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 5) {
          const option = ANSWER_OPTIONS[num - 1];
          if (option) {
            this.handleAnswerClick(q.id, option.key);
          }
        }
      }

      if (e.key === "ArrowLeft") {
        if (!e.metaKey && !e.ctrlKey) {
          this.state.prevQuestion();
        }
      } else if (e.key === "ArrowRight") {
        if (!e.metaKey && !e.ctrlKey) {
          this.state.nextQuestion();
        }
      }
    });
  }

  handleAnswerClick(questionId, answerKey) {
    if (this.isAdvancing) return;

    this.state.setAnswer(questionId, answerKey);

    this.isAdvancing = true;
    setTimeout(() => {
      this.isAdvancing = false;
      this.state.nextQuestion();
    }, 220);
  }

  showToast(message) {
    let toast = document.querySelector(".toast-msg");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-msg";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  showQuestionInfoModal(question) {
    const lang = this.state.lang || "ro";
    const modal = document.getElementById("function-modal");
    if (!modal || !question) return;

    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");

    const categoryLabel = question.category === "axis" 
      ? (lang === "ro" ? `Axă MBTI (${question.dimension || question.target})` : `MBTI Axis (${question.dimension || question.target})`)
      : (lang === "ro" ? `Funcție Cognitivă (${question.target})` : `Cognitive Function (${question.target})`);

    const formatLabel = question.format === "wouldYouRather" 
      ? (lang === "ro" ? "Dilemă (Alegere A / B)" : "Would You Rather (A / B Choice)")
      : (question.format === "deep" ? (lang === "ro" ? "Întrebare Aprofundată" : "Deep Question") : (lang === "ro" ? "Întrebare Scurtă" : "Short Question"));

    // Only keep category pill (removed format pill per specification)
    modalTitle.innerHTML = `
      <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-strong); margin-bottom: 0.35rem;">
        ${lang === "ro" ? "Despre această întrebare" : "About this question"}
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <span class="info-pill info-pill-category">${categoryLabel}</span>
      </div>
    `;

    const description = (lang === "ro" && question.descriptionRo) ? question.descriptionRo : (question.description || "");

    if (question.format === "wouldYouRather" || question.format === "direct") {
      const opts = question.options || [];
      const optsHtml = opts.map(opt => {
        const text = (lang === "ro" && opt.textRo) ? opt.textRo : opt.text;
        const expl = (lang === "ro" && opt.explanationRo) ? opt.explanationRo : opt.explanation;
        return `
          <div class="info-wyr-item">
            <div class="info-wyr-header">
              <span class="info-wyr-badge">${lang === "ro" ? "Opțiunea" : "Option"} ${opt.id}</span>
              <span class="info-wyr-pole">${lang === "ro" ? "Direcție:" : "Direction:"} <strong>${opt.pole} (+1)</strong></span>
            </div>
            <p class="info-wyr-text">"${text}"</p>
            <p class="info-wyr-expl">${expl}</p>
          </div>
        `;
      }).join("");

      modalBody.innerHTML = `
        <div class="info-section">
          <h4>${lang === "ro" ? "Ce măsoară:" : "What it measures:"}</h4>
          <p>${description}</p>
        </div>
        <div class="info-section">
          <h4>${lang === "ro" ? "Opțiuni și orientare de scorare:" : "Options & scoring directions:"}</h4>
          ${optsHtml}
        </div>
      `;
    } else {
      let agreeExpl = (lang === "ro" && question.agreementExplanationRo) ? question.agreementExplanationRo : question.agreementExplanation;
      let disagreeExpl = (lang === "ro" && question.disagreementExplanationRo) ? question.disagreementExplanationRo : question.disagreementExplanation;

      // Clean technical prefixes before colon (e.g. "Acordul favorizează I:", "Dezacordul orientează contribuția spre Fe:", etc.)
      const cleanPrefix = (str) => {
        if (!str) return "";
        const colonIdx = str.indexOf(":");
        if (colonIdx !== -1 && colonIdx < 85) {
          let cleaned = str.slice(colonIdx + 1).trim();
          if (cleaned.length > 0) {
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          }
          return cleaned;
        }
        return str.trim();
      };

      const cleanAgree = cleanPrefix(agreeExpl);
      const cleanDisagree = cleanPrefix(disagreeExpl);

      modalBody.innerHTML = `
        <div class="info-section">
          <h4>${lang === "ro" ? "Ce măsoară:" : "What it measures:"}</h4>
          <p>${description}</p>
        </div>
        <div class="info-section">
          <h4>${lang === "ro" ? "Direcția de scorare:" : "Scoring direction:"}</h4>
          <div class="info-impact-card info-impact-agree">
            <div class="info-impact-title">${lang === "ro" ? "De acord" : "Agree"}</div>
            <p>${cleanAgree}</p>
          </div>
          <div class="info-impact-card info-impact-disagree">
            <div class="info-impact-title">${lang === "ro" ? "Dezacord" : "Disagree"}</div>
            <p>${cleanDisagree}</p>
          </div>
        </div>
      `;
    }

    modal.classList.add("active");
  }

  showFunctionModal(targetId) {
    const lang = this.state.lang || "ro";
    const modal = document.getElementById("function-modal");
    if (!modal) return;

    const fn = COGNITIVE_FUNCTIONS[targetId];
    if (fn) {
      const fnName = lang === "ro" ? (fn.nameRo || fn.name) : fn.name;
      const fnKeywords = lang === "ro" ? (fn.keywordsRo || fn.keywords) : fn.keywords;
      const fnDesc = lang === "ro" ? (fn.descriptionRo || fn.description) : fn.description;

      modal.querySelector(".modal-title").innerHTML = `
        <span style="color: ${fn.color}; font-weight: 800; margin-right: 0.4rem;">${fn.code}</span>
        ${fnName}
      `;

      modal.querySelector(".modal-body").innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.3rem 0.75rem; border-radius: var(--radius-pill); font-size: 0.8rem; font-weight: 700; background: color-mix(in srgb, ${fn.color} 14%, transparent); color: ${fn.color}; border: 1px solid color-mix(in srgb, ${fn.color} 30%, transparent); margin-bottom: 0.9rem;">
          ${t('assessingCognitiveFunction', { code: fn.code, name: fnName }, lang)}
        </div>
        <p style="margin-bottom: 0.8rem; font-weight: 600; color: var(--text-strong);">
          ${fnKeywords}
        </p>
        <p style="margin-bottom: 1rem; line-height: 1.6;">
          ${fnDesc}
        </p>
        <div style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.85rem;">
          <div style="margin-bottom: 0.4rem;">
            <strong style="color: var(--text-muted);">${t('lowerPole', {}, lang)}</strong> ${fn.spectrumLeft}
          </div>
          <div>
            <strong style="color: ${fn.color};">${t('upperPole', {}, lang)}</strong> ${fn.spectrumRight}
          </div>
        </div>
      `;

      modal.classList.add("active");
      return;
    }

    const AXIS_DETAILS = {
      E: { code: "E", name: lang === "ro" ? "Extraversie" : "Extraversion", desc: lang === "ro" ? "Energie orientată spre oameni, acțiune și mediul extern." : "Energy directed toward people, action, and the external environment.", color: "#8A3AA0" },
      I: { code: "I", name: lang === "ro" ? "Introversie" : "Introversion", desc: lang === "ro" ? "Energie orientată spre interior, gânduri, reflecție și profunzime." : "Energy directed inward toward thoughts, internal reflection, and depth.", color: "#3B49DF" },
      N: { code: "N", name: lang === "ro" ? "Intuiție" : "Intuition", desc: lang === "ro" ? "Percepție focalizată pe tipare, posibilități, concepte și viitor." : "Perception focused on patterns, possibilities, concepts, and the future.", color: "#9333EA" },
      S: { code: "S", name: lang === "ro" ? "Senzorial" : "Sensing", desc: lang === "ro" ? "Percepție focalizată pe fapte concrete, observație directă și realități tangibile." : "Perception focused on direct observation, concrete facts, and tangible realities.", color: "#D97706" },
      T: { code: "T", name: lang === "ro" ? "Gândire" : "Thinking", desc: lang === "ro" ? "Decizii ghidate de logică, consecvență, principii obiective și imparțialitate." : "Decisions guided by logical coherence, objectivity, and consistent principles.", color: "#0284C7" },
      F: { code: "F", name: lang === "ro" ? "Afectiv" : "Feeling", desc: lang === "ro" ? "Decizii ghidate de valori personale, impact uman, empatie și armonie." : "Decisions guided by personal values, human impact, empathy, and harmony.", color: "#16A34A" },
      J: { code: "J", name: lang === "ro" ? "Judecată" : "Judging", desc: lang === "ro" ? "Orientare spre structură, planificare organizată, finalitate și decizii clare." : "Orientation toward structure, planning, closure, and settled decisions.", color: "#0D9488" },
      P: { code: "P", name: lang === "ro" ? "Percepție" : "Perceiving", desc: lang === "ro" ? "Orientare spre adaptabilitate, flexibilitate, opțiuni deschise și explorare." : "Orientation toward adaptability, open options, spontaneity, and exploration.", color: "#EA580C" }
    };

    const axis = AXIS_DETAILS[targetId];
    if (axis) {
      modal.querySelector(".modal-title").innerHTML = `
        <span style="color: ${axis.color}; font-weight: 800; margin-right: 0.4rem;">${axis.code}</span>
        ${axis.name}
      `;

      modal.querySelector(".modal-body").innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.3rem 0.75rem; border-radius: var(--radius-pill); font-size: 0.8rem; font-weight: 700; background: color-mix(in srgb, ${axis.color} 14%, transparent); color: ${axis.color}; border: 1px solid color-mix(in srgb, ${axis.color} 30%, transparent); margin-bottom: 0.9rem;">
          ${t('assessingAxisPole', { code: axis.code, name: axis.name }, lang)}
        </div>
        <p style="margin-bottom: 1rem; line-height: 1.6; font-size: 0.95rem; color: var(--text-strong);">
          ${axis.desc}
        </p>
      `;

      modal.classList.add("active");
    }
  }

  closeModal() {
    const modal = document.querySelector(".modal-overlay.active");
    if (modal) modal.classList.remove("active");
  }

  render() {
    if (this.state.screen === "welcome") {
      this.renderWelcome();
    } else if (this.state.screen === "results") {
      this.renderResults();
    } else {
      this.renderQuiz();
    }
  }

  renderNavbar() {
    const isDark = this.state.theme === "dark";
    const lang = this.state.lang || "ro";
    const langLabel = lang === "ro" ? "RO" : "EN";
    const langTitle = lang === "ro" ? "Switch to English" : "Comută în Română";

    const orderMode = this.state.orderMode || "format";
    let orderIcon = ICONS.layers;
    let orderLabel = t('orderFormat', {}, lang);
    if (orderMode === "function") {
      orderIcon = ICONS.brain;
      orderLabel = t('orderFunction', {}, lang);
    } else if (orderMode === "random") {
      orderIcon = ICONS.shuffle;
      orderLabel = t('orderRandom', {}, lang);
    }
    const orderTooltip = t('orderTooltip', { mode: orderLabel }, lang);

    return `
      <header class="ed e-nav">
        <div class="e-wrap">
          <button class="e-logo" type="button" aria-label="8Func Home" id="nav-logo-btn">
            <b>8</b><span>func</span>
          </button>
          <div class="e-nav-actions">
            <button class="theme-toggle" type="button" aria-label="${isDark ? (lang === 'ro' ? 'Mod luminos' : 'Switch to light mode') : (lang === 'ro' ? 'Mod întunecat' : 'Switch to dark mode')}" title="${isDark ? (lang === 'ro' ? 'Mod luminos' : 'Switch to light mode') : (lang === 'ro' ? 'Mod întunecat' : 'Switch to dark mode')}" id="theme-toggle-btn">
              ${isDark ? ICONS.sun : ICONS.moon}
            </button>
            <button class="lang-toggle" type="button" aria-label="${langTitle}" title="${langTitle}" id="lang-toggle-btn">
              ${ICONS.globe}
              <span class="lang-code">${langLabel}</span>
            </button>
            <button class="order-toggle" type="button" aria-label="${orderTooltip}" title="${orderTooltip}" id="order-toggle-btn">
              ${orderIcon}
              <span class="order-label">${orderLabel}</span>
            </button>
            ${this.state.screen === "results" ? `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="nav-retake-btn">
                <span>${t('retakeQuiz', {}, lang)}</span>
                <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
              </button>
            ` : ""}
            ${this.state.screen === "quiz" ? `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="restart-quiz-btn">
                <span>${t('restartQuiz', {}, lang)}</span>
                <span class="e-arr">${ICONS.restart}</span>
              </button>
            ` : ""}
          </div>
        </div>
      </header>
    `;
  }

  attachNavEvents() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) themeBtn.addEventListener("click", () => this.state.toggleTheme());

    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) langBtn.addEventListener("click", () => this.state.toggleLang());

    const orderBtn = document.getElementById("order-toggle-btn");
    if (orderBtn) orderBtn.addEventListener("click", () => this.state.toggleOrderMode());

    const logoBtn = document.getElementById("nav-logo-btn");
    if (logoBtn) logoBtn.addEventListener("click", () => this.state.showWelcome());

    const retakeBtn = document.getElementById("nav-retake-btn");
    if (retakeBtn) retakeBtn.addEventListener("click", () => this.state.showWelcome());
  }

  renderWelcome() {
    const lang = this.state.lang || "ro";
    const modesData = TRANSLATIONS[lang]?.modes || TRANSLATIONS.en.modes;

    const modeCardsHtml = Object.values(TEST_MODES).map(m => {
      const modeTrans = modesData[m.key] || m;
      return `
        <div class="mode-card ${m.isPopular ? 'is-popular' : ''}" data-mode="${m.key}">
          <span class="mode-badge-pill">${modeTrans.badge}</span>
          <div class="mode-icon">${m.icon}</div>
          <h2 class="mode-name">${modeTrans.name}</h2>
          <div class="mode-meta">
            <span><b>${m.totalQuestions}</b> ${t('questionsCount', {}, lang)}</span>
            <span>•</span>
            <span>${m.timeEst}</span>
          </div>
          <p class="mode-desc">${modeTrans.description}</p>
          <button class="mode-start-btn" type="button">
            <span>${t('startTest', { name: modeTrans.name }, lang)}</span>
            <span class="btn-arrow">${ICONS.arrowRight}</span>
          </button>
        </div>
      `;
    }).join("");

    const funcChipsHtml = FUNCTIONS_LIST.map(f => {
      const fn = COGNITIVE_FUNCTIONS[f];
      const fnName = lang === "ro" ? (fn.nameRo || fn.name) : fn.name;
      const fnKeywords = lang === "ro" ? (fn.keywordsRo || fn.keywords) : fn.keywords;
      return `
        <div class="func-chip" style="--chip-color: ${fn.color};" data-func="${fn.code}">
          <div class="func-chip-top">
            <span class="func-chip-badge">${fn.code}</span>
            <span class="func-chip-name">${fnName}</span>
          </div>
          <span class="func-chip-sub">${fnKeywords}</span>
        </div>
      `;
    }).join("");

    this.root.innerHTML = `
      <div class="app-shell" data-screen="welcome">
        <a class="skip-link" href="#main-content">${t('skipLink', {}, lang)}</a>
        ${this.renderNavbar()}
        <span id="main-content" class="skip-target" tabindex="-1"></span>

        <main class="welcome-screen">
          <section class="welcome-hero">
            <div class="welcome-badge">8 Cognitive Functions • 4 Spectrum Axes</div>
            <h1 class="welcome-title">${t('welcomeTitle', {}, lang)}</h1>
            <p class="welcome-subtitle">
              ${t('welcomeLead', {}, lang)}
            </p>
            <div class="test-guidance-pill" style="max-width: 640px; margin: 1.25rem auto 0; padding: 0.65rem 1.25rem; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-pill); font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.5rem; line-height: 1.4;">
              <span style="font-weight: 700; color: var(--accent);">${lang === 'ro' ? 'Ghid de răspuns:' : 'Answering guide:'}</span>
              <span>${lang === 'ro' ? 'Răspunde după tendința ta naturală și spontană, nu după excepții.' : 'Answer according to your typical natural tendency, not rare exceptions.'}</span>
            </div>
          </section>

          <!-- 3 Mode Selection Cards -->
          <section class="mode-grid" aria-label="${t('selectDepth', {}, lang)}">
            ${modeCardsHtml}
          </section>

          <!-- 8 Functions Showcase -->
          <section class="welcome-showcase">
            <header class="showcase-header">
              <h2>${t('eightFunctionsTitle', {}, lang)}</h2>
              <p>${t('eightFunctionsSub', {}, lang)}</p>
            </header>
            <div class="function-chips-grid">
              ${funcChipsHtml}
            </div>
          </section>
        </main>
      </div>

      <!-- Info Modal -->
      <div class="modal-overlay" id="function-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <header class="modal-header">
            <h3 class="modal-title" id="modal-title">${t('functionDetailsTitle', {}, lang)}</h3>
            <button class="modal-close" type="button" id="modal-close-btn" aria-label="${t('modalClose', {}, lang)}">
              ${ICONS.cross}
            </button>
          </header>
          <div class="modal-body"></div>
          <footer class="modal-actions">
            <button class="e-btn e-btn-primary" type="button" id="modal-ok-btn">${t('modalUnderstood', {}, lang)}</button>
          </footer>
        </div>
      </div>
    `;

    this.attachWelcomeEvents();
  }

  attachWelcomeEvents() {
    this.attachNavEvents();

    document.querySelectorAll(".mode-card").forEach(card => {
      card.addEventListener("click", () => {
        const modeKey = card.getAttribute("data-mode");
        this.state.selectMode(modeKey);
      });
    });

    document.querySelectorAll(".func-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const f = chip.getAttribute("data-func");
        this.showFunctionModal(f);
      });
    });

    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalOkBtn = document.getElementById("modal-ok-btn");
    const modalOverlay = document.getElementById("function-modal");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => this.closeModal());
    if (modalOkBtn) modalOkBtn.addEventListener("click", () => this.closeModal());
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }
  }

  renderQuiz() {
    const lang = this.state.lang || "ro";
    const qIndex = this.state.currentIndex;
    const qNumberStr = String(qIndex + 1).padStart(2, "0");
    const question = this.state.getCurrentQuestion();
    const totalQ = this.state.questions.length;
    const questionText = getQuestionText(question, lang);
    
    const { answeredCount } = calculateScores(
      this.state.questions,
      this.state.answers
    );
    const progressPct = Math.round((answeredCount / totalQ) * 100);

    const targetCode = question.target || question.functionId || question.agreementPole || "Ne";
    const currentAnswer = this.state.answers[question.id];

    // Segments
    const segmentsHtml = this.state.questions.map((q, idx) => {
      const isAnswered = this.state.answers[q.id] !== undefined;
      const isCurrent = idx === qIndex;
      let cls = "";
      if (isCurrent) cls = "current";
      else if (isAnswered) cls = "filled";
      return `<span class="${cls}" title="${lang === 'ro' ? 'Întrebarea' : 'Question'} ${idx + 1}" data-index="${idx}"></span>`;
    }).join("");

    // Answer choices (either Would You Rather choices or 5-point agreement scale)
    let answersContentHtml = "";
    if (question.format === "wouldYouRather" || question.format === "direct") {
      const wyrOpts = question.options || [];
      answersContentHtml = `
        <div class="wyr-options-grid" role="radiogroup" aria-label="Would you rather choices">
          ${wyrOpts.map(opt => {
            const isSelected = currentAnswer === opt.id;
            const optText = (lang === "ro" && opt.textRo) ? opt.textRo : opt.text;
            return `
              <button 
                type="button" 
                class="wyr-option-card ${isSelected ? 'selected' : ''}" 
                data-answer="${opt.id}" 
                role="radio" 
                aria-checked="${isSelected}"
              >
                <span class="wyr-card-tag">${lang === "ro" ? "OPȚIUNEA" : "OPTION"} ${opt.id}</span>
                <span class="wyr-card-text">${optText}</span>
              </button>
            `;
          }).join("")}
        </div>
      `;
    } else {
      const options = getAnswerOptions(lang);
      const answersHtml = options.map((opt, index) => {
        const isSelected = currentAnswer === opt.key;
        let iconSvg = ICONS.check;
        if (opt.key === "NEUTRAL") iconSvg = ICONS.minus;
        else if (opt.key === "DISAGREE" || opt.key === "STRONGLY_DISAGREE") iconSvg = ICONS.cross;

        return `
          <button 
            class="answer-button answer-${opt.classSuffix}" 
            data-answer="${opt.key}" 
            type="button" 
            role="radio" 
            aria-checked="${isSelected}"
          >
            <span class="answer-icon" aria-hidden="true">${iconSvg}</span>
            <span class="answer-label">${opt.label}</span>
            <span class="answer-key-hint" aria-hidden="true">${index + 1}</span>
          </button>
        `;
      }).join("");

      answersContentHtml = `
        <div class="answer-grid" role="radiogroup" aria-label="Answer choices">
          ${answersHtml}
        </div>
      `;
    }

    this.root.innerHTML = `
      <div class="app-shell" data-screen="quiz">
        <a class="skip-link" href="#quiz-main">${t('skipLink', {}, lang)}</a>
        ${this.renderNavbar()}
        <span id="quiz-main" class="skip-target" tabindex="-1"></span>
        
        <main class="quiz-layout">
          <header class="quiz-progress">
            <div class="quiz-progress-meta">
              <span>${t('questionMeta', { current: qIndex + 1, total: totalQ }, lang)}</span>
            </div>
            <div class="quiz-progress-segs" role="progressbar" aria-label="Progress: ${progressPct}%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}">
              ${segmentsHtml}
            </div>
          </header>

          <div class="question-stage">
            <article class="question-card" aria-labelledby="question-title">
              <span class="question-number" aria-hidden="true">${qNumberStr}</span>
              
              <header class="question-card-header">
                <h2 id="question-title">
                  ${questionText}
                  <button class="inline-axis-info e-axis-info" type="button" aria-label="${t('inspectQuestion', {}, lang)}" title="${t('infoClickHint', {}, lang)}">
                    ${ICONS.info}
                  </button>
                </h2>
              </header>

              ${answersContentHtml}
            </article>
          </div>

          <nav class="quiz-actions" aria-label="Quiz navigation">
            <button class="secondary-button" type="button" id="back-btn" ${qIndex === 0 ? "disabled" : ""}>
              <span class="btn-arrow">${ICONS.arrowLeft}</span>
              <span>${t('back', {}, lang)}</span>
            </button>

            <button class="primary-button" type="button" id="next-btn" ${qIndex === totalQ - 1 && !this.state.answers[question.id] ? "disabled" : ""}>
              <span>${qIndex === totalQ - 1 ? t('finishQuiz', {}, lang) : t('next', {}, lang)}</span>
              <span class="btn-arrow">${ICONS.arrowRight}</span>
            </button>
          </nav>
        </main>
      </div>

      <!-- Info Modal -->
      <div class="modal-overlay" id="function-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <header class="modal-header">
            <h3 class="modal-title" id="modal-title">${t('functionDetailsTitle', {}, lang)}</h3>
            <button class="modal-close" type="button" id="modal-close-btn" aria-label="${t('modalClose', {}, lang)}">
              ${ICONS.cross}
            </button>
          </header>
          <div class="modal-body"></div>
          <footer class="modal-actions">
            <button class="e-btn e-btn-primary" type="button" id="modal-ok-btn">${t('modalUnderstood', {}, lang)}</button>
          </footer>
        </div>
      </div>
    `;

    this.attachQuizEvents();
  }

  attachQuizEvents() {
    this.attachNavEvents();
    const lang = this.state.lang || "ro";

    const changeModeBtn = document.getElementById("change-mode-btn");
    if (changeModeBtn) changeModeBtn.addEventListener("click", () => this.state.showWelcome());

    const restartBtn = document.getElementById("restart-quiz-btn");
    if (restartBtn) restartBtn.addEventListener("click", () => {
      if (confirm(t('resetConfirm', {}, lang))) {
        this.state.resetQuiz();
        this.showToast(t('quizResetToast', {}, lang));
      }
    });

    document.querySelectorAll(".quiz-progress-segs span").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10);
        if (!isNaN(idx)) this.state.goToQuestion(idx);
      });
    });

    const q = this.state.getCurrentQuestion();
    document.querySelectorAll(".answer-button").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-answer");
        this.handleAnswerClick(q.id, key);
      });
    });

    document.querySelectorAll(".wyr-option-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-answer");
        this.handleAnswerClick(q.id, key);
      });
    });

    const infoBtn = document.querySelector(".e-axis-info");
    if (infoBtn) {
      infoBtn.addEventListener("click", () => {
        this.showQuestionInfoModal(q);
      });
    }

    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalOkBtn = document.getElementById("modal-ok-btn");
    const modalOverlay = document.getElementById("function-modal");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => this.closeModal());
    if (modalOkBtn) modalOkBtn.addEventListener("click", () => this.closeModal());
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }

    const backBtn = document.getElementById("back-btn");
    if (backBtn) backBtn.addEventListener("click", () => this.state.prevQuestion());

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.state.currentIndex === this.state.questions.length - 1) {
          const { answeredCount, totalQuestions } = calculateScores(
            this.state.questions,
            this.state.answers
          );
          if (answeredCount < totalQuestions) {
            if (confirm(t('underQuestionsPrompt', { answered: answeredCount, total: totalQuestions }, lang))) {
              this.state.showResults();
            }
          } else {
            this.state.showResults();
          }
        } else {
          this.state.nextQuestion();
        }
      });
    }
  }

  renderQuestionBreakdown(percentages, axisScores, lang) {
    const questions = (this.state.questions && this.state.questions.length > 0)
      ? this.state.questions
      : getQuestionsForMode("complete", this.state.orderMode);
    const answers = this.state.answers || {};
    const hasAnswers = Object.keys(answers).length > 0;

    const cardsHtml = questions.map((q, idx) => {
      const qNum = idx + 1;
      const qText = getQuestionText(q, lang);
      const userAnsKey = answers[q.id];
      const hasAnswer = userAnsKey !== undefined && userAnsKey !== null;

      // Extract associated function and axis tags for filtering
      const tags = [];
      if (q.category === "function") {
        if (q.target) tags.push(q.target);
        if (q.oppositePole) tags.push(q.oppositePole);
        if (q.options) q.options.forEach(o => { if (o.pole) tags.push(o.pole); });
      } else if (q.category === "axis") {
        if (q.dimension) tags.push(q.dimension);
        if (q.target) tags.push(q.target);
        if (q.oppositePole) tags.push(q.oppositePole);
        if (q.options) q.options.forEach(o => { if (o.pole) tags.push(o.pole); });
      }

      let impactBadge = "";
      let impactBadgeColor = "var(--text-muted)";
      let ansLabel = "";
      let impactDesc = "";

      if (hasAnswer) {
        if (q.format === "wouldYouRather" || q.format === "direct") {
          const opt = (q.options || []).find(o => o.id === userAnsKey);
          const optText = (lang === "ro" && opt?.textRo) ? opt.textRo : opt?.text;
          ansLabel = `${lang === "ro" ? "Opțiunea" : "Option"} ${userAnsKey}: "${optText || ""}"`;
          const targetPole = opt?.pole || "";
          impactBadge = `+1.0 → ${targetPole}`;
          impactBadgeColor = COGNITIVE_FUNCTIONS[targetPole]?.color || "var(--accent)";
          impactDesc = lang === "ro"
            ? `Alegerea directă a adăugat +1.0 punct pentru ${targetPole}.`
            : `Your direct choice added +1.0 point to ${targetPole}.`;
        } else {
          // Agreement scale
          const val = ANSWER_VALUE_MAP[userAnsKey] ?? 0;
          const scaleLabelsRo = {
            STRONGLY_AGREE: "Total de acord (+1.0)",
            AGREE: "De acord (+0.5)",
            NEUTRAL: "Neutru (0.0)",
            DISAGREE: "Dezacord (-0.5)",
            STRONGLY_DISAGREE: "Total dezacord (-1.0)"
          };
          const scaleLabelsEn = {
            STRONGLY_AGREE: "Strongly agree (+1.0)",
            AGREE: "Agree (+0.5)",
            NEUTRAL: "Neutral (0.0)",
            DISAGREE: "Disagree (-0.5)",
            STRONGLY_DISAGREE: "Strongly disagree (-1.0)"
          };
          ansLabel = (lang === "ro" ? scaleLabelsRo[userAnsKey] : scaleLabelsEn[userAnsKey]) || userAnsKey;

          if (q.category === "function") {
            if (val > 0) {
              impactBadge = `+${val.toFixed(1)} → ${q.target}`;
              impactBadgeColor = COGNITIVE_FUNCTIONS[q.target]?.color || "var(--accent)";
              impactDesc = lang === "ro"
                ? `Acordul a crescut scorul funcției ${q.target} (+${val.toFixed(1)}).`
                : `Agreement raised ${q.target} score (+${val.toFixed(1)}).`;
            } else if (val < 0) {
              const opp = q.oppositePole || "Opus";
              impactBadge = `+${Math.abs(val).toFixed(1)} → ${opp}`;
              impactBadgeColor = COGNITIVE_FUNCTIONS[opp]?.color || "var(--accent)";
              impactDesc = lang === "ro"
                ? `Dezacordul a orientat punctajul spre funcția opusă ${opp} (+${Math.abs(val).toFixed(1)}).`
                : `Disagreement shifted points to opposite ${opp} (+${Math.abs(val).toFixed(1)}).`;
            } else {
              impactBadge = lang === "ro" ? "0.0 (Neutru)" : "0.0 (Neutral)";
              impactBadgeColor = "var(--text-muted)";
              impactDesc = lang === "ro"
                ? "Răspunsul neutru nu a modificat balanța între funcții."
                : "Neutral response maintained baseline balance.";
            }
          } else {
            // Axis item
            if (val > 0) {
              const target = q.agreementPole || q.target;
              impactBadge = `+${val.toFixed(1)} → ${target}`;
              impactBadgeColor = "var(--accent)";
              impactDesc = lang === "ro"
                ? `Acordul a favorizat polul ${target} (+${val.toFixed(1)}).`
                : `Agreement favored pole ${target} (+${val.toFixed(1)}).`;
            } else if (val < 0) {
              const opp = q.oppositePole || q.opposite;
              impactBadge = `+${Math.abs(val).toFixed(1)} → ${opp}`;
              impactBadgeColor = "var(--accent)";
              impactDesc = lang === "ro"
                ? `Dezacordul a favorizat polul opus ${opp} (+${Math.abs(val).toFixed(1)}).`
                : `Disagreement favored opposite pole ${opp} (+${Math.abs(val).toFixed(1)}).`;
            } else {
              impactBadge = lang === "ro" ? "0.0 (Neutru)" : "0.0 (Neutral)";
              impactBadgeColor = "var(--text-muted)";
              impactDesc = lang === "ro"
                ? `Răspuns neutru pe axa ${q.dimension || ""}.`
                : `Neutral response on axis ${q.dimension || ""}.`;
            }
          }
        }
      } else {
        // Shared URL / no local answers
        ansLabel = lang === "ro" ? "Ghid de calibrare întrebare" : "Question calibration reference";
        if (q.category === "function") {
          impactBadge = `${q.target} ⟷ ${q.oppositePole || ""}`;
          impactBadgeColor = COGNITIVE_FUNCTIONS[q.target]?.color || "var(--accent)";
          impactDesc = lang === "ro"
            ? `Acord: favorizează ${q.target} (+1.0) · Dezacord: favorizează ${q.oppositePole} (+1.0)`
            : `Agree: favors ${q.target} (+1.0) · Disagree: favors ${q.oppositePole} (+1.0)`;
        } else {
          impactBadge = `Axa ${q.dimension || q.target}`;
          impactBadgeColor = "var(--accent)";
          impactDesc = lang === "ro"
            ? `Acord: favorizează ${q.target} · Dezacord: favorizează ${q.oppositePole}`
            : `Agree: favors ${q.target} · Disagree: favors ${q.oppositePole}`;
        }
      }

      const categoryLabel = q.category === "axis"
        ? (lang === "ro" ? `Axă MBTI (${q.dimension || q.target})` : `MBTI Axis (${q.dimension || q.target})`)
        : (lang === "ro" ? `Funcție (${q.target} vs ${q.oppositePole || ""})` : `Function (${q.target} vs ${q.oppositePole || ""})`);

      return `
        <div class="breakdown-card" data-tags="${tags.join(" ")}" data-category="${q.category}">
          <div class="breakdown-card-top">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="breakdown-qid">#${qNum} · ${q.id}</span>
              <span class="breakdown-cat-tag">${categoryLabel}</span>
            </div>
            <span class="breakdown-impact-pill" style="color: ${impactBadgeColor}; border-color: color-mix(in srgb, ${impactBadgeColor} 35%, transparent); background: color-mix(in srgb, ${impactBadgeColor} 10%, transparent);">
              ${impactBadge}
            </span>
          </div>
          <p class="breakdown-qtext">"${qText}"</p>
          <div class="breakdown-answer-box">
            <div class="breakdown-ans-label">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">${t('yourAnswerLabel', {}, lang)}:</span>
              <strong style="margin-left: 0.35rem; color: var(--text-strong);">${ansLabel}</strong>
            </div>
            <p class="breakdown-ans-expl">${impactDesc}</p>
          </div>
        </div>
      `;
    }).join("");

    const funcsList = FUNCTIONS_LIST;
    const axesList = [
      { id: "EI", label: "E / I" },
      { id: "NS", label: "N / S" },
      { id: "TF", label: "T / F" },
      { id: "JP", label: "P / J" }
    ];

    return `
      <section class="e-panel" id="question-breakdown">
        <div class="e-sec-head">
          <p class="e-eyebrow" style="color: var(--accent);">${t('breakdownEyebrow', {}, lang)}</p>
          <h2 class="e-sec-title">${t('breakdownTitle', {}, lang)}</h2>
          <p class="e-sec-lead">${t('breakdownLead', {}, lang)}</p>
        </div>

        ${!hasAnswers ? `
          <div style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.9rem 1.2rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            💡 ${t('sharedUrlConsultationNote', {}, lang)}
          </div>
        ` : ""}

        <!-- Filter Chips -->
        <div class="breakdown-filter-container">
          <div class="breakdown-filter-row">
            <span class="breakdown-filter-title">${lang === "ro" ? "Filtru rapid:" : "Quick filter:"}</span>
            <button type="button" class="breakdown-chip active" data-filter="all">
              ${t('filterAll', {}, lang)} <span class="breakdown-count-badge">${questions.length}</span>
            </button>
          </div>

          <div class="breakdown-filter-row">
            <span class="breakdown-filter-title">${t('filterFuncGroup', {}, lang)}:</span>
            <div class="breakdown-chips-wrap">
              ${funcsList.map(f => {
                const color = COGNITIVE_FUNCTIONS[f]?.color || "var(--accent)";
                const pct = percentages[f] ?? 50;
                return `
                  <button type="button" class="breakdown-chip" data-filter="${f}" style="--c: ${color};">
                    <span style="color: ${color}; font-weight: 800;">${f}</span>
                    <span class="breakdown-pct-tag">${pct}%</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <div class="breakdown-filter-row">
            <span class="breakdown-filter-title">${t('filterAxisGroup', {}, lang)}:</span>
            <div class="breakdown-chips-wrap">
              ${axesList.map(ax => {
                let pcts = "";
                if (ax.id === "EI") pcts = `I: ${axisScores.EI?.roundB ?? 50}% · E: ${axisScores.EI?.roundA ?? 50}%`;
                else if (ax.id === "NS") pcts = `N: ${axisScores.NS?.roundA ?? 50}% · S: ${axisScores.NS?.roundB ?? 50}%`;
                else if (ax.id === "TF") pcts = `T: ${axisScores.TF?.roundA ?? 50}% · F: ${axisScores.TF?.roundB ?? 50}%`;
                else if (ax.id === "JP") pcts = `P: ${axisScores.JP?.roundB ?? 50}% · J: ${axisScores.JP?.roundA ?? 50}%`;
                return `
                  <button type="button" class="breakdown-chip" data-filter="${ax.id}">
                    <b>${ax.label}</b>
                    <span class="breakdown-pct-tag">${pcts}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Filter Feedback Status Banner -->
        <div id="breakdown-filter-banner" class="breakdown-summary-banner">
          <span id="breakdown-filter-banner-text">
            ${t('questionsFoundForFilter', { count: questions.length }, lang)}
          </span>
        </div>

        <!-- Questions List -->
        <div class="breakdown-list" id="breakdown-questions-list">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  renderResults() {
    const lang = this.state.lang || "ro";
    const modeConfig = this.state.getModeConfig();
    const scores = calculateScores(
      this.state.questions,
      this.state.answers
    );
    let {
      axisScores,
      axisPercentages,
      derivedType,
      percentages,
      precisePercentages,
      insufficientData,
      acquiescenceWarning,
      rawScores,
      answeredCount
    } = scores;

    if (this.state.urlResultsScores) {
      const u = this.state.urlResultsScores;
      percentages = {
        Ne: u.Ne ?? 50,
        Ni: u.Ni ?? 50,
        Se: u.Se ?? 50,
        Si: u.Si ?? 50,
        Te: u.Te ?? 50,
        Ti: u.Ti ?? 50,
        Fe: u.Fe ?? 50,
        Fi: u.Fi ?? 50
      };
      axisScores = {
        EI: { dimension: "EI", poleA: "E", poleB: "I", pctA: u.E ?? 50, pctB: u.I ?? 50, roundA: u.E ?? 50, roundB: u.I ?? 50, dominant: (u.E ?? 50) >= (u.I ?? 50) ? "E" : "I" },
        NS: { dimension: "NS", poleA: "N", poleB: "S", pctA: u.N ?? 50, pctB: u.S ?? 50, roundA: u.N ?? 50, roundB: u.S ?? 50, dominant: (u.N ?? 50) >= (u.S ?? 50) ? "N" : "S" },
        TF: { dimension: "TF", poleA: "T", poleB: "F", pctA: u.T ?? 50, pctB: u.F ?? 50, roundA: u.T ?? 50, roundB: u.F ?? 50, dominant: (u.T ?? 50) >= (u.F ?? 50) ? "T" : "F" },
        JP: { dimension: "JP", poleA: "J", poleB: "P", pctA: u.J ?? 50, pctB: u.P ?? 50, roundA: u.J ?? 50, roundB: u.P ?? 50, dominant: (u.J ?? 50) >= (u.P ?? 50) ? "J" : "P" }
      };
      derivedType = `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;
    }

    // Update browser address bar to the exact results URL path (preserving base for GitHub Pages)
    const rawResultsPath = buildResultsUrlPath(axisScores, percentages);
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
      ? import.meta.env.BASE_URL
      : "/";
    const prefix = baseUrl.replace(/\/$/, "");
    const fullResultsPath = `${prefix}${rawResultsPath}`;
    if (window.location.pathname !== fullResultsPath) {
      history.replaceState(null, "", fullResultsPath);
    }

    // Primary 4-letter type is derived directly from the 4 axis dimensions!
    const topTypeData = MBTI_TYPES[derivedType] || MBTI_TYPES["INTJ"];
    const temp = getTypeTemperament(derivedType);

    // Calculate axis preference clarity across the 4 dimensions
    const axisClarity = Math.round(
      (Math.max(axisScores.EI.pctA, axisScores.EI.pctB) +
       Math.max(axisScores.NS.pctA, axisScores.NS.pctB) +
       Math.max(axisScores.TF.pctA, axisScores.TF.pctB) +
       Math.max(axisScores.JP.pctA, axisScores.JP.pctB)) / 4
    );

    // Calculate integrated MBTI archetype rankings combining 8 cognitive functions and 4 spectrum axes
    const mbtiRankings = calculateBestMbtiType(percentages, axisScores);
    const topRanked = mbtiRankings.find(m => m.type === derivedType) || mbtiRankings[0];

    const topMbti = {
      type: derivedType,
      ...topTypeData,
      temperament: temp.code,
      temperamentName: temp.name,
      temperamentColor: temp.color,
      temperamentBg: temp.colorBg,
      temperamentBorder: temp.colorBorder,
      matchPercentage: topRanked ? topRanked.matchPercentage : axisClarity
    };

    // Other personality archetypes derived from integrated distribution
    const otherMbtis = mbtiRankings.filter(m => m.type !== derivedType).slice(0, 3);
    if (otherMbtis.length === 0) {
      otherMbtis.push(...mbtiRankings.slice(1, 4));
    }

    // Calculate ring SVG dash offset (radius = 62, circumference = 389.6)
    const ringDash = Math.round((topMbti.matchPercentage / 100) * 389.6 * 10) / 10;

    // Secret Recording: store completed quiz JSON secretly to ./submissions/ and browser vault
    if (!this.state.urlResultsScores && this.state.answers && Object.keys(this.state.answers).length > 0) {
      const answersSignature = Object.keys(this.state.answers).sort().map(k => `${k}:${this.state.answers[k]}`).join(",");
      if (this.lastRecordedSignature !== answersSignature) {
        this.lastRecordedSignature = answersSignature;
        recordQuizSubmission({ state: this.state, scores, topMbti }).catch(() => {});
      }
    }

    // Prudence check: small score difference appears as mixed spectrum rather than a stark winner
    const isCloseMatch = otherMbtis[0] && (topMbti.matchPercentage - otherMbtis[0].matchPercentage <= 3);

    // Ranked Cognitive Hierarchy (1st to 8th)
    const sortedFunctions = [...FUNCTIONS_LIST].sort((a, b) => percentages[b] - percentages[a]);
    const hierarchyLabels = ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8"];

    // What Sets You Apart: Extremes & Balanced
    const extremeHighFunc = sortedFunctions[0];
    const extremeLowFunc = sortedFunctions[7];
    const highPct = percentages[extremeHighFunc];
    const lowPct = percentages[extremeLowFunc];
    const balancedFunc = [...sortedFunctions].sort((a, b) => Math.abs((percentages[a] ?? 50) - 50) - Math.abs((percentages[b] ?? 50) - 50))[0];

    // Color helpers matching Cognitive Hierarchy palette
    const getFuncTileColors = (f) => {
      if (f === "Ne" || f === "Ni") return { bg: "#95637e", text: "#ffffff" };
      if (f === "Te" || f === "Ti") return { bg: "#72cccd", text: "#0d2b2c" };
      if (f === "Se" || f === "Si") return { bg: "#e5c727", text: "#2a2100" };
      if (f === "Fe" || f === "Fi") return { bg: "#9ac262", text: "#142b08" };
      return { bg: "#95637e", text: "#ffffff" };
    };

    const getMbtiTileColors = (type) => {
      if (type.includes("N") && type.includes("T")) return { bg: "#95637e", text: "#ffffff" };
      if (type.includes("N") && type.includes("F")) return { bg: "#9ac262", text: "#142b08" };
      if (type.includes("S") && type.includes("T")) return { bg: "#72cccd", text: "#0d2b2c" };
      if (type.includes("S") && type.includes("F")) return { bg: "#e5c727", text: "#2a2100" };
      return { bg: "#95637e", text: "#ffffff" };
    };

    const highColors = getFuncTileColors(extremeHighFunc);
    const balColors = getFuncTileColors(balancedFunc);
    const lowColors = getFuncTileColors(extremeLowFunc);

    // Figures Ranking (10 Similar & 10 Opposite) from 196 personalities dataset
    const { similar: similarFigures, opposite: oppositeFigures, all: allFigures } = getRankedFigures(percentages, axisScores);
    this.allFigures = allFigures;
    const displayedFigures = this.figuresTab === "similar" ? similarFigures : oppositeFigures;

    let currentComparisonFigure = allFigures.find(f => f.id === this.selectedFigureId);
    if (!currentComparisonFigure) {
      currentComparisonFigure = similarFigures[0] || allFigures[0];
      this.selectedFigureId = currentComparisonFigure.id;
    }

    // Role / Profession bilingual helper
    const getFigureRole = (fig, l) => {
      let role = fig.role ? fig.role.replace(/\s*·\s*[A-Z]{4}\s*$/i, "").trim() : (fig.profession || "");
      if (l === "en") {
        const roToEn = {
          muzician: "Musician",
          actor: "Actor",
          "actriță": "Actress",
          filosof: "Philosopher",
          fizician: "Physicist",
          antreprenor: "Entrepreneur",
          scriitor: "Writer",
          psiholog: "Psychologist",
          politician: "Politician",
          inventator: "Inventor",
          regizor: "Film Director",
          sportiv: "Athlete",
          om_de_stiinta: "Scientist",
          istoric: "Historian",
          cântăreț: "Singer",
          pictor: "Painter",
          om_politic: "Statesman",
          general: "Military General",
          lider_spiritual: "Spiritual Leader",
          matematician: "Mathematician",
          economist: "Economist",
          jurnalist: "Journalist"
        };
        const lower = role.toLowerCase().trim();
        return roToEn[lower] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : "");
      }
      return role ? (role.charAt(0).toUpperCase() + role.slice(1)) : "";
    };

    // 4 Spectrum Coordinates
    // Spectrum 1: Mind & Nature (N sus, S jos, F stanga, T dreapta)
    const pN = axisScores?.NS?.roundA ?? 50; // % N (Intuiție)
    const pS = axisScores?.NS?.roundB ?? 50; // % S (Senzație)
    const pT = axisScores?.TF?.roundA ?? 50; // % T (Gândire)
    const pF = axisScores?.TF?.roundB ?? 50; // % F (Sentiment)
    // F stanga (0%) -> T dreapta (100%)
    const compassX = Math.max(10, Math.min(90, pT));
    // N sus (0%) -> S jos (100%)
    const compassY = Math.max(10, Math.min(90, 100 - pN));

    // Spectrum 2: Energy & Tactics (E sus, I jos, J stanga, P dreapta)
    const pE = axisScores?.EI?.roundA ?? 50; // % E (Extraversie)
    const pI = axisScores?.EI?.roundB ?? 50; // % I (Introversie)
    const pJ = axisScores?.JP?.roundA ?? 50; // % J (Judecată)
    const pP = axisScores?.JP?.roundB ?? 50; // % P (Percepție)
    // J stanga (0%) -> P dreapta (100%)
    const compass2X = Math.max(10, Math.min(90, pP));
    // E sus (0%) -> I jos (100%)
    const compass2Y = Math.max(10, Math.min(90, pI));

    // Quadrants for both Spectrums
    const s1QuadCode = (pN >= pS ? "N" : "S") + (pF >= pT ? "F" : "T");
    const s1QuadColors = { NF: "#9ac262", NT: "#95637e", SF: "#e5c727", ST: "#72cccd" };
    const activeS1 = { code: s1QuadCode, color: s1QuadColors[s1QuadCode] || "#95637e" };

    const s2QuadCode = (pE >= pI ? "E" : "I") + (pJ >= pP ? "J" : "P");
    const s2QuadColors = { EJ: "#395296", EP: "#4361ab", IJ: "#4d69ba", IP: "#5573c7" };
    const activeS2 = { code: s2QuadCode, color: s2QuadColors[s2QuadCode] || "#4361ab" };

    // Minimalist Spectrum Labels & Coordinates
    const s1Top = lang === "ro" ? "INTUIȚIE" : "INTUITION";
    const s1Bottom = lang === "ro" ? "SENZORIAL" : "SENSING";
    const s1Left = lang === "ro" ? "SENTIMENT" : "FEELING";
    const s1Right = lang === "ro" ? "GÂNDIRE" : "THINKING";
    const s1Coords = `${pN >= pS ? pN + '% N' : pS + '% S'} · ${pF >= pT ? pF + '% F' : pT + '% T'}`;

    const s2Top = lang === "ro" ? "EXTRAVERSIE" : "EXTRAVERSION";
    const s2Bottom = lang === "ro" ? "INTROVERSIE" : "INTROVERSION";
    const s2Left = lang === "ro" ? "JUDECĂTĂ" : "JUDGING";
    const s2Right = lang === "ro" ? "PERCEPȚIE" : "PERCEIVING";
    const s2Coords = `${pE >= pI ? pE + '% E' : pI + '% I'} · ${pJ >= pP ? pJ + '% J' : pP + '% P'}`;

    // ========================================================
    // 4 Axes Minimalist Layout with Colored Boxes (like Cognitive Hierarchy)
    // ========================================================
    const energyColor = axisScores.EI.roundA >= axisScores.EI.roundB ? "#4361ab" : "#4d69ba";
    const mindColor = axisScores.NS.roundA >= axisScores.NS.roundB ? "#95637e" : "#e5c727";
    const natureColor = axisScores.TF.roundA >= axisScores.TF.roundB ? "#72cccd" : "#9ac262";
    const tacticsColor = axisScores.JP.roundA >= axisScores.JP.roundB ? "#395296" : "#5573c7";

    const axesData = [
      {
        id: "energy",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftName: lang === "ro" ? "Extraversie" : "Extraversion",
        rightName: lang === "ro" ? "Introversie" : "Introversion",
        leftPct: axisScores.EI.roundA, // E
        rightPct: axisScores.EI.roundB, // I
        color: energyColor,
        pos: Math.max(5, Math.min(95, axisScores.EI.roundB))
      },
      {
        id: "mind",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftName: lang === "ro" ? "Intuiție" : "Intuition",
        rightName: lang === "ro" ? "Senzorial" : "Sensing",
        leftPct: axisScores.NS.roundA, // N
        rightPct: axisScores.NS.roundB, // S
        color: mindColor,
        pos: Math.max(5, Math.min(95, axisScores.NS.roundB))
      },
      {
        id: "nature",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftName: lang === "ro" ? "Gândire" : "Thinking",
        rightName: lang === "ro" ? "Sentiment" : "Feeling",
        leftPct: axisScores.TF.roundA, // T
        rightPct: axisScores.TF.roundB, // F
        color: natureColor,
        pos: Math.max(5, Math.min(95, axisScores.TF.roundB))
      },
      {
        id: "tactics",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftName: lang === "ro" ? "Judecată" : "Judging",
        rightName: lang === "ro" ? "Percepție" : "Perceiving",
        leftPct: axisScores.JP.roundA, // J
        rightPct: axisScores.JP.roundB, // P
        color: tacticsColor,
        pos: Math.max(5, Math.min(95, axisScores.JP.roundB))
      }
    ];

    const mbtiAxesRowsHtml = axesData.map(ax => {
      return `
        <div class="minimal-axis-card" style="background: ${ax.color}; color: #ffffff;">
          <div class="minimal-axis-top">
            <span class="minimal-axis-title">${ax.name}</span>
          </div>
          <div class="minimal-axis-track">
            <div class="minimal-axis-thumb" style="left: ${ax.pos}%;"></div>
          </div>
          <div class="minimal-axis-labels">
            <span class="axis-lbl-left">${ax.leftName} ${ax.leftPct}%</span>
            <span class="axis-lbl-right">${ax.rightPct}% ${ax.rightName}</span>
          </div>
        </div>
      `;
    }).join("");

    // Historical Figures List (Image 2 style)
    const figuresListHtml = displayedFigures.map((fig, idx) => {
      const numStr = String(idx + 1).padStart(2, "0");
      const isSelected = fig.id === currentComparisonFigure.id;
      const temp = getTypeTemperament(fig.mbti);
      const scoreToShow = fig.similarity;
      const cleanRole = getFigureRole(fig, lang);

      const figColors = getMbtiTileColors(fig.mbti);

      return `
        <div class="fig-list-item ${isSelected ? 'selected' : ''}" data-id="${fig.id}" style="background: ${figColors.bg}; color: #ffffff;">
          <span class="fig-num" style="color: #ffffff; opacity: 0.85;">${numStr}</span>
          ${fig.photo ? `
            <img class="fig-avatar-img" src="${fig.photo}" alt="${fig.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="fig-avatar-fallback" style="display:none; background: rgba(0,0,0,0.22); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
          ` : `
            <div class="fig-avatar-fallback" style="background: rgba(0,0,0,0.22); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
          `}
          <div class="fig-info">
            <div class="fig-info-top">
              <h4 class="fig-name" style="color: #ffffff;">${fig.name}</h4>
              <span class="fig-pct" style="color: #ffffff;">${scoreToShow}%</span>
            </div>
            <div class="fig-role-text" style="color: rgba(255,255,255,0.92);">
              <span>${cleanRole}</span> · <b style="color: #ffffff; background: rgba(0,0,0,0.22); padding: 0.12rem 0.55rem; border-radius: 999px; font-weight: 800; font-size: 0.74rem;">${fig.mbti}</b>
            </div>
            <div class="fig-bar-track" style="background: rgba(0,0,0,0.25);">
              <div class="fig-bar-fill" style="width: ${scoreToShow}%; background: #ffffff;"></div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Comparative Analysis Sliders (Image 2 style with Colored Boxes)
    const currentFigTemp = getTypeTemperament(currentComparisonFigure.mbti);
    const figSim = calculateFigureSimilarity(percentages, axisScores, currentComparisonFigure);
    const compCleanRole = getFigureRole(currentComparisonFigure, lang);

    const compAxesData = [
      {
        id: "energy",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        color: energyColor,
        leftLabel: lang === "ro" ? `Extraversie ${axisScores.EI.roundA}%` : `Extraversion ${axisScores.EI.roundA}%`,
        rightLabel: lang === "ro" ? `${axisScores.EI.roundB}% Introversie` : `${axisScores.EI.roundB}% Introversion`,
        uPos: Math.max(5, Math.min(95, axisScores.EI.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.I : (currentComparisonFigure.mbti.includes("I") ? 75 : 25))),
        uPct: axisScores.EI.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.I : (currentComparisonFigure.mbti.includes("I") ? 75 : 25)
      },
      {
        id: "mind",
        name: lang === "ro" ? "MINTE" : "MIND",
        color: mindColor,
        leftLabel: lang === "ro" ? `Intuiție ${axisScores.NS.roundA}%` : `Intuition ${axisScores.NS.roundA}%`,
        rightLabel: lang === "ro" ? `${axisScores.NS.roundB}% Senzorial` : `${axisScores.NS.roundB}% Sensing`,
        uPos: Math.max(5, Math.min(95, axisScores.NS.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.S : (currentComparisonFigure.mbti.includes("S") ? 75 : 25))),
        uPct: axisScores.NS.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.S : (currentComparisonFigure.mbti.includes("S") ? 75 : 25)
      },
      {
        id: "nature",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        color: natureColor,
        leftLabel: lang === "ro" ? `Gândire ${axisScores.TF.roundA}%` : `Thinking ${axisScores.TF.roundA}%`,
        rightLabel: lang === "ro" ? `${axisScores.TF.roundB}% Sentiment` : `${axisScores.TF.roundB}% Feeling`,
        uPos: Math.max(5, Math.min(95, axisScores.TF.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.F : (currentComparisonFigure.mbti.includes("F") ? 75 : 25))),
        uPct: axisScores.TF.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.F : (currentComparisonFigure.mbti.includes("F") ? 75 : 25)
      },
      {
        id: "tactics",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        color: tacticsColor,
        leftLabel: lang === "ro" ? `Judecată ${axisScores.JP.roundA}%` : `Judging ${axisScores.JP.roundA}%`,
        rightLabel: lang === "ro" ? `${axisScores.JP.roundB}% Percepție` : `${axisScores.JP.roundB}% Perceiving`,
        uPos: Math.max(5, Math.min(95, axisScores.JP.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.P : (currentComparisonFigure.mbti.includes("P") ? 75 : 25))),
        uPct: axisScores.JP.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.P : (currentComparisonFigure.mbti.includes("P") ? 75 : 25)
      }
    ];

    const compAxesHtml = compAxesData.map(ax => {
      return `
        <div class="comp-v2-axis-card" style="background: ${ax.color}; color: #ffffff;">
          <div class="comp-v2-axis-title">
            <span>${ax.name}</span>
          </div>
          <div class="comp-v2-track">
            <!-- White Dot (User: "punctele necolorate albe esti tu") -->
            <div class="comp-v2-dot-user" style="left: ${ax.uPos}%;" title="${lang === 'ro' ? 'Tu' : 'You'}"></div>
            <!-- Colored Dot (Figure: "punctele colorate vor lua imaginea omului cand o voi adauga") -->
            <div class="comp-v2-dot-fig" style="left: ${ax.fPos}%; border-color: rgba(255,255,255,0.6);" title="${currentComparisonFigure.name}">
              ${currentComparisonFigure.photo ? `
                <img src="${currentComparisonFigure.photo}" alt="${currentComparisonFigure.name}" />
              ` : `
                <span>${currentComparisonFigure.avatar || currentComparisonFigure.name.charAt(0)}</span>
              `}
            </div>
          </div>
          <div class="comp-v2-labels">
            <span class="comp-v2-lbl-left">${ax.leftLabel}</span>
            <span class="comp-v2-lbl-right">${ax.rightLabel}</span>
          </div>
        </div>
      `;
    }).join("");

    this.root.innerHTML = `
      <div class="app-shell" data-screen="results">
        <a class="skip-link" href="#main-res">${t('skipLink', {}, lang)}</a>
        ${this.renderNavbar()}
        <span id="main-res" class="skip-target" tabindex="-1"></span>

        <main class="ed e-res" id="resultados">
          <div class="e-res-container">
            
            <!-- Top Hero Panel -->
            <article class="e-panel e-top" style="--c: ${topMbti.temperamentColor}; --cb: ${topMbti.temperamentBg};">
              <div class="e-top-head">
                <div class="e-top-title-group">
                  <span class="e-tag e-tag-hero" style="background: ${topMbti.temperamentBg}; color: ${topMbti.temperamentColor}; border: 1px solid ${topMbti.temperamentBorder};">
                    ${topMbti.temperamentName}
                  </span>
                  <h1 class="e-hero-title">${topMbti.title} <span style="color: ${topMbti.temperamentColor};">(${topMbti.type})</span></h1>
                </div>
                <div class="e-ring e-ring-lg" role="img" aria-label="Compatibility: ${topMbti.matchPercentage} percent">
                  <svg viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="62" fill="none" stroke="var(--line)" stroke-width="7"></circle>
                    <circle class="e-ring-arc" cx="70" cy="70" r="62" fill="none" stroke="${topMbti.temperamentColor}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${ringDash} 389.6"></circle>
                  </svg>
                  <div class="e-ring-content">
                    <strong style="color: ${topMbti.temperamentColor};">${topMbti.matchPercentage}%</strong>
                    <small>MATCH</small>
                  </div>
                </div>
              </div>

              <div class="e-top-body">
                <div class="e-quote-container" style="border-left: 3.5px solid ${topMbti.temperamentColor};">
                  <p class="e-quote-text">${topMbti.quote}</p>
                </div>
              </div>
            </article>

            <!-- Cognitive Hierarchy -->
            <section class="e-panel" id="cognitive-hierarchy">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Ierarhia Cognitivă" : "Cognitive Hierarchy"}</h2>
              </div>
              <div class="hierarchy-tiles-row">
                ${sortedFunctions.map((f, idx) => {
                  const numStr = `#${idx + 1}`;
                  const pct = percentages[f];
                  let bg = "#95637e";
                  if (f === "Ne" || f === "Ni") {
                    bg = "#95637e";
                  } else if (f === "Te" || f === "Ti") {
                    bg = "#72cccd";
                  } else if (f === "Se" || f === "Si") {
                    bg = "#e5c727";
                  } else if (f === "Fe" || f === "Fi") {
                    bg = "#9ac262";
                  }
                  return `
                    <div class="hierarchy-tile-sq" style="--sq-bg: ${bg}; --sq-text: #ffffff; color: #ffffff;" title="${f} (${pct}%)">
                      <span class="hierarchy-sq-num" style="color: #ffffff;">${numStr}</span>
                      <strong class="hierarchy-sq-code" style="color: #ffffff;">${f}</strong>
                      <span class="hierarchy-sq-score" style="color: #ffffff;">${pct}% score</span>
                    </div>
                  `;
                }).join("")}
              </div>
            </section>

            <!-- 4 Axes Minimalist (Image 3) -->
            <section class="e-panel" id="mbti-axes">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Cele 4 Axe" : "4 Axes"}</h2>
              </div>
              <div class="minimal-axes-grid">
                ${mbtiAxesRowsHtml}
              </div>
            </section>

            <!-- Spectrum (Minimalist Single Compass: Mind & Nature, Poza 2 style) -->
            <section class="e-panel" id="spectrum-compass">
              <div class="e-sec-head" style="margin-bottom: 2rem;">
                <h2 class="e-sec-title">Spectrum</h2>
              </div>
              
              <div class="spectrum-single-wrap">
                <div class="spectrum-compass-wrap">
                  <div class="spectrum-cardinal-lbl spectrum-lbl-top">${s1Top}</div>
                  <div class="spectrum-center-row">
                    <div class="spectrum-cardinal-lbl spectrum-lbl-left">${s1Left}</div>
                    <div class="spectrum-quadrant-plane">
                      <div class="spectrum-quadrant quad-tl" title="NF"></div>
                      <div class="spectrum-quadrant quad-tr" title="NT"></div>
                      <div class="spectrum-quadrant quad-bl" title="SF"></div>
                      <div class="spectrum-quadrant quad-br" title="ST"></div>
                      <div class="spectrum-crosshair-h"></div>
                      <div class="spectrum-crosshair-v"></div>

                      <div class="spectrum-plot-dot" style="left: ${compassX}%; top: ${compassY}%;" title="${topMbti.type}"></div>
                    </div>
                    <div class="spectrum-cardinal-lbl spectrum-lbl-right">${s1Right}</div>
                  </div>
                  <div class="spectrum-cardinal-lbl spectrum-lbl-bottom">${s1Bottom}</div>
                </div>

                <div class="spectrum-bottom-bar">
                  <span class="spectrum-coord-lbl">${s1Coords}</span>
                </div>
              </div>
            </section>

            <!-- Differences (Image 1 style) -->
            <section class="e-panel" id="differences">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Diferențe" : "Differences"}</h2>
              </div>
              <div class="diff-grid">
                <!-- Highest Function Card -->
                <div class="diff-card" style="background: ${highColors.bg}; color: #ffffff;">
                  <div class="diff-card-head">
                    <span class="diff-badge">${lang === "ro" ? "DOMINANTĂ" : "HIGHEST"}</span>
                    <span class="diff-pct">${highPct}%</span>
                  </div>
                  <h3 class="diff-name">${extremeHighFunc}</h3>
                  <p class="diff-desc">
                    ${t('highestCap', {}, lang)}
                  </p>
                </div>

                <!-- Balanced Function Card -->
                <div class="diff-card" style="background: ${balColors.bg}; color: #ffffff;">
                  <div class="diff-card-head">
                    <span class="diff-badge">${lang === "ro" ? "ECHILIBRATĂ" : "BALANCED"}</span>
                    <span class="diff-pct">${percentages[balancedFunc]}%</span>
                  </div>
                  <h3 class="diff-name">${balancedFunc}</h3>
                  <p class="diff-desc">
                    ${t('balancedCap', {}, lang)}
                  </p>
                </div>

                <!-- Lowest Function Card -->
                <div class="diff-card" style="background: ${lowColors.bg}; color: #ffffff;">
                  <div class="diff-card-head">
                    <span class="diff-badge">${lang === "ro" ? "INFERIOARĂ" : "LOWEST"}</span>
                    <span class="diff-pct">${lowPct}%</span>
                  </div>
                  <h3 class="diff-name">${extremeLowFunc}</h3>
                  <p class="diff-desc">
                    ${t('lowestCap', {}, lang)}
                  </p>
                </div>
              </div>
            </section>

            <!-- Resemble (Image 1 style) -->
            <section class="e-panel" id="personalidades">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Asemănare" : "Resemble"}</h2>
              </div>
              <div class="resemble-grid">
                ${otherMbtis.map(m => {
                  const mColors = getMbtiTileColors(m.type);
                  return `
                    <div class="resemble-card" style="background: ${mColors.bg}; color: #ffffff;">
                      <div class="resemble-card-head">
                        <span class="resemble-tag">${m.type}</span>
                        <span class="resemble-pct">${m.matchPercentage}%</span>
                      </div>
                      <h3 class="resemble-name">${m.title}</h3>
                      <p class="resemble-desc">${m.description}</p>
                      <div class="resemble-stack">
                        ${m.stack.map(st => `<span class="resemble-stack-pill">${st}</span>`).join("")}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </section>

            <!-- Notable Figures -->
            <section class="e-panel" id="figuras">
              <div class="e-sec-head" style="margin-bottom: 0.75rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Personalități Notabile" : "Notable Figures"}</h2>
              </div>

              <div class="fig-tabs">
                <button class="fig-tab ${this.figuresTab === 'similar' ? 'active' : ''}" type="button" id="tab-similar-btn">
                  ${lang === "ro" ? "Personalități Similare" : "Similar Figures"}
                </button>
                <button class="fig-tab ${this.figuresTab === 'opposite' ? 'active' : ''}" type="button" id="tab-opposite-btn">
                  ${lang === "ro" ? "Personalități Opuse" : "Opposite Figures"}
                </button>
              </div>

              <div class="fig-list-grid">
                ${figuresListHtml}
              </div>
            </section>

            <!-- Comparative Analysis (Image 2 style) -->
            <section class="e-panel" id="comparar">
              <div class="e-sec-head" style="margin-bottom: 1rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Analiză Comparativă" : "Comparative Analysis"}</h2>
              </div>

              <!-- Search personality bar with Autocomplete Dropdown -->
              <div class="figure-search-wrapper" style="margin-bottom: 1.25rem; position: relative;">
                <input 
                  type="text" 
                  id="figure-search-input" 
                  class="comp-search-bar" 
                  autocomplete="off"
                  placeholder="${lang === 'ro' ? '🔍 Caută o personalitate (ex: John Lennon, Tesla, Einstein, Brad Pitt, Steve Jobs)...' : '🔍 Search a personality (e.g. John Lennon, Tesla, Einstein, Brad Pitt, Steve Jobs)...'}" 
                />
                <div id="figure-autocomplete-list" class="figure-autocomplete-dropdown" style="display: none;"></div>
              </div>

              <!-- Comparison Card (Image 2 style) -->
              <div class="comp-card-v2">
                <div class="comp-v2-header">
                  ${currentComparisonFigure.photo ? `
                    <img class="comp-v2-avatar" src="${currentComparisonFigure.photo}" alt="${currentComparisonFigure.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="display:none; background:${currentFigTemp.color};">${currentComparisonFigure.avatar || currentComparisonFigure.name.charAt(0)}</div>
                  ` : `
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="background:${currentFigTemp.color}26; border: 2px solid ${currentFigTemp.color};">${currentComparisonFigure.avatar || currentComparisonFigure.name.charAt(0)}</div>
                  `}
                  <div class="comp-v2-header-info">
                    <div class="comp-v2-top-row">
                      <h3 class="comp-v2-name">${currentComparisonFigure.name}</h3>
                      <span class="comp-v2-pct" style="color: ${currentFigTemp.color};">${figSim}%</span>
                    </div>
                    <div class="comp-v2-subtitle">${compCleanRole} · <b style="color: ${currentFigTemp.color};">${currentComparisonFigure.mbti}</b></div>
                    <div class="comp-v2-bar-track">
                      <div class="comp-v2-bar-fill" style="width: ${figSim}%; background: ${currentFigTemp.color};"></div>
                    </div>
                  </div>
                </div>

                <div class="comp-v2-axes-grid">
                  ${compAxesHtml}
                </div>
              </div>
            </section>

            <!-- Generate Image CTA Button (After Comparative Analysis) -->
            <div class="generate-card-cta-wrapper">
              <button class="e-btn e-btn-generate-card" type="button" id="generate-image-btn" style="background: ${topMbti.temperamentColor || 'var(--accent)'}; box-shadow: 0 10px 28px ${topMbti.temperamentColor}44;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>${lang === "ro" ? "Generează Imaginea Rezultatelor" : "Generate Results Image"}</span>
              </button>
              <div class="generate-card-hint" style="margin-top: 0.65rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
                ${lang === "ro" ? "Descarcă cardul grafic complet: funcții cognitive pastel, axe MBTI, spectru și personalități similare." : "Download your complete results graphic card: pastel cognitive functions, MBTI axes, spectrum, and similar figures."}
              </div>
            </div>

            ${this.renderQuestionBreakdown(percentages, axisScores, lang)}

            <!-- Bottom Actions -->
            <div class="e-actions">
              <button class="e-btn e-btn-primary" type="button" id="retake-test-btn">
                <span>${t('retakeQuiz', {}, lang)}</span>
                <span class="e-arr">${ICONS.restart}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="change-version-btn">
                <span>${t('changeMode', {}, lang)}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="review-answers-btn">
                <span>${t('reviewAnswers', {}, lang)}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="copy-summary-btn">
                <span>${ICONS.copy}</span>
                <span>${t('copyReport', {}, lang)}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="print-results-btn">
                <span>${ICONS.download}</span>
                <span>${t('printDownload', {}, lang)}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="download-answers-btn">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span>
                <span>${t('downloadAnswersJson', {}, lang)}</span>
              </button>
              <button class="e-btn e-btn-outline" type="button" id="upload-answers-btn">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span>
                <span>${t('uploadAnswersJson', {}, lang)}</span>
              </button>
              <input type="file" id="upload-answers-input" accept=".json,application/json" style="display:none;" />
              <button class="e-btn e-btn-outline" type="button" id="export-json-btn">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>
                <span>${t('exportRawJson', {}, lang)}</span>
              </button>
            </div>
          </div><!-- /.e-res-container -->
        </main>
      </div>

      <!-- Function Details Modal -->
      <div class="modal-overlay" id="function-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <header class="modal-header">
            <h3 class="modal-title" id="modal-title">${t('functionDetailsTitle', {}, lang)}</h3>
            <button class="modal-close" type="button" id="modal-close-btn" aria-label="${t('modalClose', {}, lang)}">
              ${ICONS.cross}
            </button>
          </header>
          <div class="modal-body"></div>
          <footer class="modal-actions">
            <button class="e-btn e-btn-primary" type="button" id="modal-ok-btn">${t('modalClose', {}, lang)}</button>
          </footer>
        </div>
      </div>
    `;

    this.attachResultsEvents(percentages, topMbti, modeConfig, answeredCount, rawScores, axisScores, derivedType, allFigures, similarFigures);
  }

  attachResultsEvents(percentages, topMbti, modeConfig, answeredCount = 0, rawScores = {}, axisScores = {}, derivedType = "", allFigures = [], similarFigures = []) {
    this.attachNavEvents();
    const lang = this.state.lang || "ro";

    // Generate Image Button (Right after Comparative Analysis)
    const genImgBtn = document.getElementById("generate-image-btn");
    if (genImgBtn) {
      genImgBtn.addEventListener("click", () => {
        try {
          const dataUrl = generateResultsCardCanvas({
            topMbti,
            percentages,
            axisScores,
            similarFigures,
            lang
          });
          openResultsImageModal({
            dataUrl,
            topMbti,
            lang
          });
        } catch (err) {
          console.error("Failed to generate results image:", err);
          alert(lang === "ro" ? "Eroare la generarea imaginii: " + err.message : "Error generating image: " + err.message);
        }
      });
    }

    const navRetakeBtn = document.getElementById("nav-retake-btn");
    if (navRetakeBtn) {
      navRetakeBtn.addEventListener("click", () => {
        if (confirm(t('retakeConfirm', {}, lang))) {
          this.state.resetQuiz();
          this.showToast(t('quizResetToast', {}, lang));
        }
      });
    }

    const changeVerBtn = document.getElementById("change-version-btn");
    if (changeVerBtn) changeVerBtn.addEventListener("click", () => this.state.showWelcome());

    const retakeBtn = document.getElementById("retake-test-btn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (confirm(t('retakeConfirm', {}, lang))) {
          this.state.resetQuiz();
          this.showToast(t('quizResetToast', {}, lang));
        }
      });
    }

    const reviewBtn = document.getElementById("review-answers-btn");
    if (reviewBtn) {
      reviewBtn.addEventListener("click", () => {
        const targetSec = document.getElementById("question-breakdown");
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    const filterChips = document.querySelectorAll(".breakdown-chip");
    const cards = document.querySelectorAll(".breakdown-card");
    const bannerText = document.getElementById("breakdown-filter-banner-text");

    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        const filter = chip.getAttribute("data-filter");
        let visibleCount = 0;

        cards.forEach(card => {
          const tags = (card.getAttribute("data-tags") || "").split(" ");
          let show = false;
          if (filter === "all") {
            show = true;
          } else {
            show = tags.includes(filter);
          }

          if (show) {
            card.style.display = "flex";
            visibleCount++;
          } else {
            card.style.display = "none";
          }
        });

        if (bannerText) {
          if (filter === "all") {
            bannerText.textContent = t('questionsFoundForFilter', { count: visibleCount }, lang);
          } else if (COGNITIVE_FUNCTIONS[filter]) {
            const fn = COGNITIVE_FUNCTIONS[filter];
            const fnName = lang === "ro" ? (fn.nameRo || fn.name) : fn.name;
            const pct = percentages[filter] ?? 50;
            bannerText.innerHTML = lang === "ro"
              ? `Funcția <strong>${filter} (${fnName})</strong> · Scor obținut: <strong style="color: ${fn.color};">${pct}%</strong> — ${visibleCount} întrebări au influențat această funcție:`
              : `Function <strong>${filter} (${fnName})</strong> · Score: <strong style="color: ${fn.color};">${pct}%</strong> — ${visibleCount} questions influenced this function:`;
          } else {
            const axisNames = {
              EI: lang === "ro" ? "Introversie vs Extraversie (E/I)" : "Introversion vs Extraversion (E/I)",
              NS: lang === "ro" ? "Intuiție vs Senzorial (N/S)" : "Intuition vs Sensing (N/S)",
              TF: lang === "ro" ? "Gândire vs Afectiv (T/F)" : "Thinking vs Feeling (T/F)",
              JP: lang === "ro" ? "Stil de viață: Percepție vs Judecată (P/J)" : "Lifestyle: Perceiving vs Judging (P/J)"
            };
            const axisTitle = axisNames[filter] || filter;
            bannerText.innerHTML = lang === "ro"
              ? `Axa <strong>${axisTitle}</strong> — ${visibleCount} întrebări au calibrat acest spectru:`
              : `Axis <strong>${axisTitle}</strong> — ${visibleCount} questions calibrated this preference:`;
          }
        }
      });
    });

    const printBtn = document.getElementById("print-results-btn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Figures tabs
    const tabSimBtn = document.getElementById("tab-similar-btn");
    const tabOppBtn = document.getElementById("tab-opposite-btn");
    if (tabSimBtn) {
      tabSimBtn.addEventListener("click", () => {
        this.figuresTab = "similar";
        this.renderResults();
      });
    }
    if (tabOppBtn) {
      tabOppBtn.addEventListener("click", () => {
        this.figuresTab = "opposite";
        this.renderResults();
      });
    }

    // Figure item click in Historical Figures list (Image 2 style)
    document.querySelectorAll(".fig-list-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        if (id) {
          this.selectedFigureId = id;
          this.renderResults();
          const compSection = document.getElementById("comparar");
          if (compSection) compSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Autocomplete for Comparative Analysis search (does not hide Notable Figures above)
    const searchInput = document.getElementById("figure-search-input");
    const dropdown = document.getElementById("figure-autocomplete-list");
    if (searchInput && dropdown) {
      const figuresToSearch = (allFigures && allFigures.length > 0) ? allFigures : (this.allFigures || []);

      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }

        const matches = figuresToSearch.filter(f => {
          const name = (f.name || "").toLowerCase();
          const role = (f.role || f.profession || "").toLowerCase();
          const mbti = (f.mbti || "").toLowerCase();
          return name.includes(query) || role.includes(query) || mbti.includes(query);
        }).slice(0, 8);

        if (matches.length === 0) {
          dropdown.innerHTML = `<div class="autocomplete-no-match" style="padding: 0.85rem 1rem; color: var(--text-muted); font-size: 0.85rem;">${lang === 'ro' ? 'Nicio personalitate găsită pentru "' + query + '"' : 'No personality found for "' + query + '"'}</div>`;
          dropdown.style.display = "block";
          return;
        }

        dropdown.innerHTML = matches.map(fig => {
          const temp = getTypeTemperament(fig.mbti);
          const itemCleanRole = fig.role ? fig.role.replace(/\s*·\s*[A-Z]{4}\s*$/i, "").trim() : (fig.profession || "");
          const matchLabel = lang === "ro" ? `${fig.similarity}% compatibilitate` : `${fig.similarity}% match`;
          return `
            <div class="autocomplete-item" data-id="${fig.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; border-bottom: 1px solid var(--line); cursor: pointer; transition: background 0.15s ease;">
              <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
                <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; background: ${temp.colorBg}; color: ${temp.color}; border: 1px solid ${temp.colorBorder}; flex-shrink: 0;">
                  ${fig.avatar || fig.name.charAt(0)}
                </div>
                <div style="min-width: 0;">
                  <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fig.name}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">${itemCleanRole} · <b style="color: ${temp.color};">${fig.mbti}</b></div>
                </div>
              </div>
              <span style="font-family: var(--font-display); font-weight: 800; font-size: 0.88rem; color: ${temp.color}; margin-left: 0.75rem; flex-shrink: 0;">${matchLabel}</span>
            </div>
          `;
        }).join("");

        dropdown.style.display = "block";

        dropdown.querySelectorAll(".autocomplete-item").forEach(item => {
          item.addEventListener("click", () => {
            const id = item.getAttribute("data-id");
            const selected = figuresToSearch.find(f => f.id === id);
            if (selected) {
              this.selectedFigureId = selected.id;
              this.renderResults();
              const compSection = document.getElementById("comparar");
              if (compSection) compSection.scrollIntoView({ behavior: "smooth" });
            }
          });
        });
      });

      // Select first match on Enter
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = searchInput.value.toLowerCase().trim();
          if (!query) return;
          const match = figuresToSearch.find(f => {
            const name = (f.name || "").toLowerCase();
            const role = (f.role || f.profession || "").toLowerCase();
            const mbti = (f.mbti || "").toLowerCase();
            return name.includes(query) || role.includes(query) || mbti.includes(query);
          });
          if (match) {
            this.selectedFigureId = match.id;
            this.renderResults();
            const compSection = document.getElementById("comparar");
            if (compSection) compSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (evt) => {
        if (!searchInput.contains(evt.target) && !dropdown.contains(evt.target)) {
          dropdown.style.display = "none";
        }
      });
    }

    // Copy Summary
    const copyBtn = document.getElementById("copy-summary-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const textLines = [
          `8Func — Jungian Cognitive Functions Test (${modeConfig.name} Mode)`,
          `Primary Archetype Match: ${topMbti.title} (${topMbti.type}) — ${topMbti.matchPercentage}% Compatibility`,
          "----------------------------------------",
          ...FUNCTIONS_LIST.map(f => {
            const fn = COGNITIVE_FUNCTIONS[f];
            const p = percentages[f];
            return `${fn.code} (${fn.name}): ${p}%`;
          }),
          "----------------------------------------",
          "Generated by 8Func (inspired by 12Axes)."
        ];
        const summaryText = textLines.join("\n");
        navigator.clipboard.writeText(summaryText).then(() => {
          this.showToast(t('reportCopiedToast', {}, lang));
        }).catch(() => {
          prompt("Copy results:", summaryText);
        });
      });
    }

    // Export anonymous raw data (JSON) for statistical analysis & test-retest verification
    const exportBtn = document.getElementById("export-json-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const exportData = {
          app: "8Func Cognitive Functions Test",
          version: "2.0.0",
          timestamp: new Date().toISOString(),
          testMode: modeConfig.key,
          totalQuestions: this.state.questions.length,
          answeredQuestions: answeredCount,
          axisScores,
          derivedType,
          functionAgreementScores: percentages,
          rawFunctionScores: rawScores,
          mbtiArchetypeMatch: {
            type: topMbti.type,
            title: topMbti.title,
            temperament: topMbti.temperament,
            matchPercentage: topMbti.matchPercentage
          },
          rawItemResponses: this.state.questions.map(q => ({
            id: q.id,
            category: q.category,
            target: q.target,
            opposite: q.opposite,
            agreementPole: q.agreementPole,
            dimension: q.dimension || null,
            responseKey: this.state.answers[q.id] || null,
            text: q.text,
            textRo: q.textRo || q.text
          }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `8func_raw_data_${topMbti.type}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(t('dataExportedToast', {}, lang));
      });
    }

    // Download answers JSON
    const downloadAnswersBtn = document.getElementById("download-answers-btn");
    if (downloadAnswersBtn) {
      downloadAnswersBtn.addEventListener("click", () => {
        const payload = {
          app: "8Func",
          version: "2.0",
          mode: this.state.mode,
          timestamp: new Date().toISOString(),
          answers: this.state.answers || {}
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `8func_answers_${this.state.mode}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(lang === "ro" ? "Răspunsurile au fost descărcate!" : "Answers downloaded!");
      });
    }

    // Upload answers JSON
    const uploadAnswersBtn = document.getElementById("upload-answers-btn");
    const uploadAnswersInput = document.getElementById("upload-answers-input");
    if (uploadAnswersBtn && uploadAnswersInput) {
      uploadAnswersBtn.addEventListener("click", () => {
        uploadAnswersInput.value = "";
        uploadAnswersInput.click();
      });

      uploadAnswersInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            let importedAnswers = null;

            if (data.answers && typeof data.answers === "object" && !Array.isArray(data.answers)) {
              importedAnswers = data.answers;
            } else if (data.rawItemResponses && Array.isArray(data.rawItemResponses)) {
              importedAnswers = {};
              data.rawItemResponses.forEach(item => {
                if (item.id && item.responseKey) {
                  importedAnswers[item.id] = item.responseKey;
                }
              });
            } else if (typeof data === "object" && !Array.isArray(data)) {
              importedAnswers = data;
            }

            if (!importedAnswers || Object.keys(importedAnswers).length === 0) {
              alert(t('invalidAnswersFileToast', {}, lang));
              return;
            }

            this.state.loadAnswers(importedAnswers, data.mode);
            this.showToast(t('answersLoadedToast', {}, lang));
          } catch (parseErr) {
            alert((lang === "ro" ? "Eroare la procesarea fișierului JSON: " : "Error parsing JSON file: ") + parseErr.message);
          }
        };
        reader.readAsText(file);
      });
    }

    // Modal close
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalOkBtn = document.getElementById("modal-ok-btn");
    const modalOverlay = document.getElementById("function-modal");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => this.closeModal());
    if (modalOkBtn) modalOkBtn.addEventListener("click", () => this.closeModal());
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
