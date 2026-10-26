/**
 * 8Func - Application Controller & View Renderer
 * 12Axes Authentic Spectrum Architecture: NE-SI, NI-SE, TE-FI, TI-FE
 */

import { AppState } from "./state.js";
import { COGNITIVE_FUNCTIONS, FUNCTIONS_LIST } from "../data/functions.js";
import { TEST_MODES, getQuestionText, ALL_QUESTIONS, getQuestionsForMode } from "../data/questions.js";
import { ANSWER_OPTIONS, ANSWER_VALUE_MAP, getAnswerOptions, calculateScores, buildResultsUrlPath, parseComparisonInputLink } from "./scoring.js";
import { MBTI_TYPES, calculateBestMbtiType, getTypeTemperament } from "../data/mbtiTypes.js";
import { NOTABLE_FIGURES, getRankedFigures, calculateFigureSimilarity, getFigureRole } from "../data/figures.js";
import { ICONS } from "./icons.js";
import { t, TRANSLATIONS } from "../data/translations.js";
import { recordQuizSubmission, initVaultTriggers } from "./vault.js";
import { generateResultsCardCanvas, openResultsImageModal } from "./cardGenerator.js";
import { SpectrumController } from "./spectrum.js";

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

// Color helpers for cognitive functions & MBTI types
export function getFuncTileColors(f) {
  if (f === "Ne" || f === "Ni") return { bg: "#95637e", text: "#ffffff" };
  if (f === "Te" || f === "Ti") return { bg: "#72cccd", text: "#0d2b2c" };
  if (f === "Se" || f === "Si") return { bg: "#e5c727", text: "#2a2100" };
  if (f === "Fe" || f === "Fi") return { bg: "#9ac262", text: "#142b08" };
  return { bg: "#95637e", text: "#ffffff" };
}

export function getMbtiTileColors(type = "") {
  const upper = (type || "").toUpperCase();
  if (upper.includes("N") && upper.includes("T")) return { bg: "#95637e", text: "#ffffff", border: "#7b4f65", name: "NT" };
  if (upper.includes("N") && upper.includes("F")) return { bg: "#9ac262", text: "#142b08", border: "#7ea349", name: "NF" };
  if (upper.includes("S") && upper.includes("J")) return { bg: "#72cccd", text: "#0d2b2c", border: "#58abac", name: "SJ" };
  if (upper.includes("S") && upper.includes("P")) return { bg: "#e5c727", text: "#2a2100", border: "#c2a61a", name: "SP" };
  if (upper.includes("S") && upper.includes("T")) return { bg: "#72cccd", text: "#0d2b2c", border: "#58abac", name: "ST" };
  if (upper.includes("S") && upper.includes("F")) return { bg: "#e5c727", text: "#2a2100", border: "#c2a61a", name: "SF" };
  return { bg: "#95637e", text: "#ffffff", border: "#7b4f65", name: "NT" };
}

class App {
  constructor() {
    this.state = new AppState();
    this.root = document.getElementById("root");
    this.isAdvancing = false;

    this.figuresTab = "similar"; // 'similar' | 'opposite'
    this.selectedFigureId = null;
    this.lastRecordedSignature = null;

    // Figures directory state
    this.figuresDirSearch = "";
    this.figuresDirTemp = "all"; // 'all' | 'NT' | 'NF' | 'SJ' | 'SP'
    this.figuresDirMbti = "all"; // 'all' | 'INTJ' | ...
    this.figuresDirSort = null; // 'similarity' | 'name' | 'mbti'
    this.figuresSelectedFilters = new Set();

    // Apply saved theme
    document.documentElement.setAttribute("data-theme", this.state.theme);

    // Subscribe to state changes
    this.state.subscribe(() => this.render());

    // Setup global keyboard shortcuts
    this.bindKeyboardShortcuts();

    // Compare with someone else state
    this.customComparisonPerson = null;
    this.comparisonPersonA_Name = "";
    this.comparisonPersonB_Name = "";
    this.comparisonPersonB_Link = "";

    // Parse compare URL parameters if present (e.g. ?an=..&bn=..&b=..)
    this.initCompareParams();

    // Initial render
    this.render();
  }

  initCompareParams() {
    try {
      if (typeof window === "undefined" || !window.location.search) return;
      const urlParams = new URLSearchParams(window.location.search);
      const anParam = urlParams.get("an");
      const bnParam = urlParams.get("bn");
      const bParam = urlParams.get("b");

      if (anParam) this.comparisonPersonA_Name = anParam;
      if (bnParam) this.comparisonPersonB_Name = bnParam;
      if (bParam) {
        this.comparisonPersonB_Link = bParam;
        const parsed = parseComparisonInputLink(bParam);
        if (parsed) {
          const bName = bnParam || (this.state.lang === "ro" ? "Persoană" : "Person");
          const temp = getTypeTemperament(parsed.derivedType);
          this.customComparisonPerson = {
            id: "custom_person",
            name: bName,
            mbti: parsed.derivedType,
            role: this.state.lang === "ro" ? "Rezultat personalizat" : "Custom result",
            avatar: bName.charAt(0).toUpperCase() || "P",
            temperament: temp,
            axes: {
              I: parsed.axisScores.EI.roundB,
              E: parsed.axisScores.EI.roundA,
              S: parsed.axisScores.NS.roundB,
              N: parsed.axisScores.NS.roundA,
              F: parsed.axisScores.TF.roundB,
              T: parsed.axisScores.TF.roundA,
              P: parsed.axisScores.JP.roundB,
              J: parsed.axisScores.JP.roundA
            },
            scores: parsed.percentages,
            percentages: parsed.percentages,
            axisScores: parsed.axisScores
          };
          this.selectedFigureId = "custom_person";
        }
      }
    } catch (e) {}
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
    } else if (this.state.screen === "figures") {
      this.renderFiguresDirectory();
    } else if (this.state.screen === "spectrum") {
      this.renderSpectrum();
    } else if (this.state.screen === "compare") {
      this.renderCompare();
    } else {
      this.renderQuiz();
    }
  }

  renderSpectrum() {
    if (!this.spectrumController) {
      this.spectrumController = new SpectrumController(this);
    }
    this.spectrumController.render();
  }

  renderNavbar() {
    const isDark = this.state.theme === "dark";
    const lang = this.state.lang || "ro";
    const langLabel = lang === "ro" ? "RO" : "EN";
    const langTitle = lang === "ro" ? "Switch to English" : "Comută în Română";

    const hasCompletedResults = Boolean(
      this.state.urlResultsScores || 
      (this.state.answers && Object.keys(this.state.answers).length >= this.state.questions.length)
    );

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
            <button class="e-nav-figures-btn ${this.state.screen === 'spectrum' ? 'active' : ''}" type="button" id="nav-spectrum-btn" title="${t('spectrumNav', {}, lang)}">
              ${ICONS.compass}
              <span>${t('spectrumNav', {}, lang)}</span>
            </button>
            <button class="e-nav-figures-btn ${this.state.screen === 'figures' ? 'active' : ''}" type="button" id="nav-figures-btn" title="${t('figuresNav', {}, lang)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>${t('figuresNav', {}, lang)}</span>
            </button>
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
            ${this.state.screen === "compare" ? `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="nav-results-btn">
                <span>${t('compareNavBack', {}, lang)}</span>
                <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
              </button>
            ` : ""}
            ${this.state.screen === "quiz" ? `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="restart-quiz-btn">
                <span>${t('restartQuiz', {}, lang)}</span>
                <span class="e-arr">${ICONS.restart}</span>
              </button>
            ` : ""}
            ${(this.state.screen === "figures" || this.state.screen === "spectrum") ? (hasCompletedResults ? `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="nav-results-btn">
                <span>${lang === 'ro' ? 'Rezultate' : 'Results'}</span>
                <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
              </button>
            ` : `
              <button class="e-btn e-btn-primary e-btn-sm" type="button" id="nav-start-quiz-btn">
                <span>${lang === 'ro' ? 'Fă Testul' : 'Take Test'}</span>
                <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
              </button>
            `) : ""}
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

    const spectrumBtn = document.getElementById("nav-spectrum-btn");
    if (spectrumBtn) spectrumBtn.addEventListener("click", () => this.state.showSpectrum());

    const figuresBtn = document.getElementById("nav-figures-btn");
    if (figuresBtn) figuresBtn.addEventListener("click", () => this.state.showFigures());

    const navResultsBtn = document.getElementById("nav-results-btn");
    if (navResultsBtn) navResultsBtn.addEventListener("click", () => this.state.showResults());

    const navStartQuizBtn = document.getElementById("nav-start-quiz-btn");
    if (navStartQuizBtn) navStartQuizBtn.addEventListener("click", () => this.state.showWelcome());

    const retakeBtn = document.getElementById("nav-retake-btn");
    if (retakeBtn) retakeBtn.addEventListener("click", () => this.state.showWelcome());
  }

  renderWelcome() {
    const lang = this.state.lang || "ro";
    const modesData = TRANSLATIONS[lang]?.modes || TRANSLATIONS.en.modes;

    const modeCardsHtml = Object.values(TEST_MODES).map(m => {
      const modeTrans = modesData[m.key] || m;
      const isStandard = m.isPopular;
      const arrowIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin-left: 0.25rem;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

      return `
        <div class="mode-card ${isStandard ? 'is-popular' : ''}" data-mode="${m.key}">
          <div class="mode-card-header">
            <div class="mode-icon">${m.icon}</div>
            ${isStandard ? `<span class="mode-badge-pill">${lang === 'ro' ? 'RECOMANDAT' : 'RECOMMENDED'}</span>` : ''}
          </div>
          <h2 class="mode-name">${modeTrans.name}</h2>
          <div class="mode-meta">
            <span>${m.totalQuestions} ${t('questionsCount', {}, lang)}</span>
            <span class="mode-meta-dot">•</span>
            <span>${m.timeEst}</span>
          </div>
          <button class="mode-start-btn ${isStandard ? 'mode-start-btn-popular' : ''}" type="button">
            <span>${t('startTest', { name: modeTrans.name }, lang)}</span>
            ${arrowIcon}
          </button>
        </div>
      `;
    }).join("");

    this.root.innerHTML = `
      <div class="app-shell" data-screen="welcome">
        ${this.renderNavbar()}

        <main class="welcome-screen">
          <section class="welcome-hero">
            <div class="welcome-badge">${lang === 'ro' ? '16 TIPURI • 8 FUNCȚII COGNITIVE • 4 AXE DE SPECTRU' : '16 TYPES • 8 COGNITIVE FUNCTIONS • 4 SPECTRUM AXES'}</div>
            <h1 class="welcome-title">${t('welcomeTitle', {}, lang)}</h1>
            <p class="welcome-subtitle">
              ${t('welcomeLead', {}, lang)}
            </p>
          </section>

          <!-- 3 Mode Selection Cards -->
          <section class="mode-grid" aria-label="${t('selectDepth', {}, lang)}">
            ${modeCardsHtml}
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

      // Determine target pole and calculate question weight
      const primaryTarget = q.category === "axis" ? (q.agreementPole || q.target) : q.target;
      const targetQuestions = questions.filter(item => {
        if (item.category === q.category) {
          if ((item.agreementPole || item.target) === primaryTarget) return true;
          if (item.options && item.options.some(o => o.pole === primaryTarget)) return true;
        }
        return false;
      });
      const countForTarget = Math.max(1, targetQuestions.length);
      const questionMaxPct = Math.round((100 / countForTarget) * 10) / 10;

      const AXIS_COLOR_MAP = {
        E: "#e0535e", I: "#0284C7",
        N: "#95637e", S: "#e5c727",
        T: "#3B49DF", F: "#9ac262",
        J: "#72cccd", P: "#d97706"
      };

      let targetColor = "var(--accent)";
      if (COGNITIVE_FUNCTIONS[primaryTarget]) {
        targetColor = COGNITIVE_FUNCTIONS[primaryTarget]?.color || "#3B49DF";
      } else if (AXIS_COLOR_MAP[primaryTarget]) {
        targetColor = AXIS_COLOR_MAP[primaryTarget];
      }

      let impactBadge = "";
      let impactBadgeBg = targetColor;
      let impactBadgeTextColor = "#ffffff";
      let ansLabel = "";
      let impactDesc = "";
      let edgeBadgeHtml = "";

      if (hasAnswer) {
        if (q.format === "wouldYouRather" || q.format === "direct") {
          const opt = (q.options || []).find(o => o.id === userAnsKey);
          const optText = (lang === "ro" && opt?.textRo) ? opt.textRo : opt?.text;
          const targetPole = opt?.pole || primaryTarget;
          ansLabel = `${lang === "ro" ? "Opțiunea" : "Option"} ${userAnsKey}: "${optText || ""}"`;
          
          if (COGNITIVE_FUNCTIONS[targetPole]) targetColor = COGNITIVE_FUNCTIONS[targetPole].color;
          else if (AXIS_COLOR_MAP[targetPole]) targetColor = AXIS_COLOR_MAP[targetPole];
          
          impactBadge = `+${questionMaxPct}% → ${targetPole}`;
          impactBadgeBg = targetColor;
          impactBadgeTextColor = "#ffffff";
          edgeBadgeHtml = `<span class="breakdown-edge-badge" style="background: rgba(47, 124, 99, 0.15); color: #1B5844; border: 1px solid rgba(47, 124, 99, 0.3);">⚡ ${lang === 'ro' ? 'Alegere Directă' : 'Direct Choice'}</span>`;
          impactDesc = lang === "ro"
            ? `Alegerea directă ți-a adus <strong>+${questionMaxPct}%</strong> la <strong>${targetPole}</strong> și te-a plasat ferm la marginea spectrului pentru această trăsătură.`
            : `Your direct choice added <strong>+${questionMaxPct}%</strong> to <strong>${targetPole}</strong> and placed you firmly at the edge of the spectrum.`;
        } else {
          // Agreement scale
          const scaleLabelsRo = {
            STRONGLY_AGREE: "Total de acord (100%)",
            AGREE: "De acord (75%)",
            NEUTRAL: "Neutru (50%)",
            DISAGREE: "Dezacord (25%)",
            STRONGLY_DISAGREE: "Total dezacord (0%)"
          };
          const scaleLabelsEn = {
            STRONGLY_AGREE: "Strongly agree (100%)",
            AGREE: "Agree (75%)",
            NEUTRAL: "Neutral (50%)",
            DISAGREE: "Disagree (25%)",
            STRONGLY_DISAGREE: "Strongly disagree (0%)"
          };
          ansLabel = (lang === "ro" ? scaleLabelsRo[userAnsKey] : scaleLabelsEn[userAnsKey]) || userAnsKey;

          if (userAnsKey === "STRONGLY_AGREE") {
            const pct = questionMaxPct;
            impactBadge = `+${pct}% → ${primaryTarget}`;
            impactBadgeBg = targetColor;
            impactBadgeTextColor = "#ffffff";
            edgeBadgeHtml = `<span class="breakdown-edge-badge" style="background: rgba(224, 83, 94, 0.14); color: #C23A45; border: 1px solid rgba(224, 83, 94, 0.3);">⚡ ${lang === 'ro' ? 'Marginea Spectrului (100%)' : 'Spectrum Edge (100%)'}</span>`;
            impactDesc = lang === "ro"
              ? `Întrebarea ți-a adus <strong>+${pct}%</strong> la <strong>${primaryTarget}</strong> și <strong>te-a plasat fix la marginea spectrului</strong> cu un scor extrem de acord 100%.`
              : `This question added <strong>+${pct}%</strong> to <strong>${primaryTarget}</strong> and <strong>placed you right at the edge of the spectrum</strong> (100% agreement).`;
          } else if (userAnsKey === "AGREE") {
            const pct = Math.round(questionMaxPct * 0.75 * 10) / 10;
            impactBadge = `+${pct}% → ${primaryTarget}`;
            impactBadgeBg = targetColor;
            impactBadgeTextColor = "#ffffff";
            impactDesc = lang === "ro"
              ? `Întrebarea ți-a adus <strong>+${pct}%</strong> la <strong>${primaryTarget}</strong> (din potențialul maxim de ${questionMaxPct}%), consolidând clar această preferință.`
              : `This question added <strong>+${pct}%</strong> to <strong>${primaryTarget}</strong> (out of max ${questionMaxPct}%), clearly reinforcing this preference.`;
          } else if (userAnsKey === "NEUTRAL") {
            const pct = Math.round(questionMaxPct * 0.5 * 10) / 10;
            impactBadge = `+${pct}% · Median`;
            impactBadgeBg = "var(--ink-200)";
            impactBadgeTextColor = "var(--text-strong)";
            impactDesc = lang === "ro"
              ? `Răspunsul neutru a adus o contribuție mediană de <strong>+${pct}%</strong>, menținând echilibrul pe axă fără să încline balanța.`
              : `Neutral response brought a median contribution of <strong>+${pct}%</strong>, maintaining balance on the axis without tilting.`;
          } else if (userAnsKey === "DISAGREE") {
            const opp = q.oppositePole || q.opposite || "Opus";
            const targetPct = Math.round(questionMaxPct * 0.25 * 10) / 10;
            const oppPct = Math.round(questionMaxPct * 0.75 * 10) / 10;
            let oppColor = targetColor;
            if (COGNITIVE_FUNCTIONS[opp]) oppColor = COGNITIVE_FUNCTIONS[opp].color;
            else if (AXIS_COLOR_MAP[opp]) oppColor = AXIS_COLOR_MAP[opp];
            impactBadge = `+${oppPct}% → ${opp}`;
            impactBadgeBg = oppColor;
            impactBadgeTextColor = "#ffffff";
            impactDesc = lang === "ro"
              ? `Dezacordul a adus doar +${targetPct}% la ${primaryTarget}, redirecționând <strong>+${oppPct}%</strong> către polul opus <strong>${opp}</strong>.`
              : `Disagreement brought only +${targetPct}% to ${primaryTarget}, redirecting <strong>+${oppPct}%</strong> towards the opposite pole <strong>${opp}</strong>.`;
          } else if (userAnsKey === "STRONGLY_DISAGREE") {
            const opp = q.oppositePole || q.opposite || "Opus";
            const oppPct = questionMaxPct;
            let oppColor = targetColor;
            if (COGNITIVE_FUNCTIONS[opp]) oppColor = COGNITIVE_FUNCTIONS[opp].color;
            else if (AXIS_COLOR_MAP[opp]) oppColor = AXIS_COLOR_MAP[opp];
            impactBadge = `+${oppPct}% → ${opp}`;
            impactBadgeBg = oppColor;
            impactBadgeTextColor = "#ffffff";
            edgeBadgeHtml = `<span class="breakdown-edge-badge" style="background: rgba(224, 83, 94, 0.14); color: #C23A45; border: 1px solid rgba(224, 83, 94, 0.3);">⚡ ${lang === 'ro' ? 'Marginea Spectrului (0%)' : 'Spectrum Edge (0%)'}</span>`;
            impactDesc = lang === "ro"
              ? `Dezacordul total ți-a adus 0% la ${primaryTarget} și <strong>te-a plasat fix la marginea spectrului</strong>, împingând o pondere de <strong>+${oppPct}%</strong> către polul opus <strong>${opp}</strong>.`
              : `Strong disagreement gave 0% to ${primaryTarget} and <strong>placed you right at the edge of the spectrum</strong>, transferring <strong>+${oppPct}%</strong> to opposite pole <strong>${opp}</strong>.`;
          }
        }
      } else {
        // Shared URL / no local answers
        ansLabel = lang === "ro" ? "Ghid de calibrare întrebare" : "Question calibration reference";
        impactBadge = `${primaryTarget} (max +${questionMaxPct}%)`;
        impactBadgeBg = targetColor;
        impactBadgeTextColor = "#ffffff";
        impactDesc = lang === "ro"
          ? `Fiecare răspuns la această întrebare poate adăuga până la <strong>+${questionMaxPct}%</strong> la scorul ${primaryTarget}.`
          : `Each answer to this question can contribute up to <strong>+${questionMaxPct}%</strong> to ${primaryTarget}.`;
      }

      const categoryLabel = q.category === "axis"
        ? (lang === "ro" ? `Axă MBTI (${q.dimension || q.target})` : `MBTI Axis (${q.dimension || q.target})`)
        : (lang === "ro" ? `Funcție (${q.target} vs ${q.oppositePole || ""})` : `Function (${q.target} vs ${q.oppositePole || ""})`);

      return `
        <div class="breakdown-card" data-tags="${tags.join(" ")}" data-category="${q.category}" style="border-left: 5px solid ${targetColor};">
          <div class="breakdown-card-top">
            <div style="display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;">
              <span class="breakdown-qid">#${qNum} · ${q.id}</span>
              <span class="breakdown-cat-tag">${categoryLabel}</span>
              ${edgeBadgeHtml}
            </div>
            <span class="breakdown-impact-pill" style="background: ${impactBadgeBg}; color: ${impactBadgeTextColor};">
              ${impactBadge}
            </span>
          </div>
          <p class="breakdown-qtext">"${qText}"</p>
          <div class="breakdown-answer-box">
            <div class="breakdown-ans-label">
              <span style="color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">${t('yourAnswerLabel', {}, lang)}:</span>
              <strong style="color: var(--text-strong);">${ansLabel}</strong>
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

  getUserScores() {
    let percentages = null;
    let axisScores = null;
    let derivedType = "INTJ";

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
    } else if (this.state.lastUserResults && this.state.lastUserResults.percentages && this.state.lastUserResults.axisScores) {
      percentages = this.state.lastUserResults.percentages;
      axisScores = this.state.lastUserResults.axisScores;
      derivedType = `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;
    } else {
      const calc = calculateScores(this.state.questions, this.state.answers);
      percentages = calc.percentages;
      axisScores = calc.axisScores;
      derivedType = calc.derivedType || `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;
    }

    const typeData = MBTI_TYPES[derivedType] || MBTI_TYPES["INTJ"];
    const temp = getTypeTemperament(derivedType);
    const topMbti = {
      type: derivedType,
      title: this.state.lang === "ro" ? (typeData?.titleRo || typeData?.title || derivedType) : (typeData?.title || derivedType),
      temperamentName: temp?.name || "Rațional",
      temperamentColor: temp?.color || "#95637e",
      temperamentBg: temp?.bg || "rgba(149, 99, 126, 0.12)",
      quote: this.state.lang === "ro" ? (typeData?.quoteRo || typeData?.quote || "") : (typeData?.quote || ""),
      stack: typeData?.stack || ["Ni", "Te", "Fi", "Se"]
    };

    return { percentages, axisScores, derivedType, topMbti };
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

    // Persist scores for match comparison on figures directory
    try {
      this.state.lastUserResults = { percentages, axisScores };
      localStorage.setItem('8func_last_user_results', JSON.stringify(this.state.lastUserResults));
    } catch (e) {}

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

    const highColors = getFuncTileColors(extremeHighFunc);
    const balColors = getFuncTileColors(balancedFunc);
    const lowColors = getFuncTileColors(extremeLowFunc);

    // Figures Ranking (10 Similar & 10 Opposite) from 196 personalities dataset
    const { similar: similarFigures, opposite: oppositeFigures, all: allFigures } = getRankedFigures(percentages, axisScores);
    this.allFigures = allFigures;
    const displayedFigures = this.figuresTab === "similar" ? similarFigures : oppositeFigures;

    let currentComparisonFigure;
    if (this.selectedFigureId === "custom_person" && this.customComparisonPerson) {
      currentComparisonFigure = this.customComparisonPerson;
    } else {
      currentComparisonFigure = allFigures.find(f => f.id === this.selectedFigureId);
      if (!currentComparisonFigure) {
        currentComparisonFigure = similarFigures[0] || allFigures[0];
        this.selectedFigureId = currentComparisonFigure.id;
      }
    }

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
    const energyColor = "#395296";
    const mindColor = axisScores.NS.roundA >= axisScores.NS.roundB ? "#95637e" : "#e5c727";
    const natureColor = axisScores.TF.roundA >= axisScores.TF.roundB ? "#72cccd" : "#9ac262";
    const tacticsColor = "#395296";

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
            <img class="fig-avatar-img" src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
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
    const isCustomPerson = this.selectedFigureId === "custom_person" && this.customComparisonPerson;
    const currentFigTemp = getTypeTemperament(currentComparisonFigure.mbti);
    const figSim = calculateFigureSimilarity(percentages, axisScores, currentComparisonFigure);
    const compCleanRole = isCustomPerson
      ? (lang === "ro" ? "Comparație personalizată" : "Custom comparison")
      : getFigureRole(currentComparisonFigure, lang);
    const userA_Name = this.comparisonPersonA_Name || (lang === "ro" ? "Tu" : "You");
    const userB_Name = isCustomPerson ? this.customComparisonPerson.name : currentComparisonFigure.name;
    const origin = (typeof window !== "undefined" && window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file"))
      ? window.location.origin
      : "https://8func.com";
    const userFullResultUrl = `${origin}${fullResultsPath}`;

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
            <div class="comp-v2-dot-user" style="left: ${ax.uPos}%;" title="${userA_Name}"></div>
            <!-- Colored Dot (Figure or Person B) -->
            <div class="comp-v2-dot-fig" style="left: ${ax.fPos}%; border-color: rgba(255,255,255,0.6);" title="${userB_Name}">
              ${currentComparisonFigure.photo ? `
                <img src="${currentComparisonFigure.photo}" alt="${userB_Name}" />
              ` : `
                <span>${currentComparisonFigure.avatar || userB_Name.charAt(0)}</span>
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

    const figN = currentComparisonFigure.axes ? currentComparisonFigure.axes.N : (currentComparisonFigure.mbti.includes("N") ? 75 : 25);
    const figT = currentComparisonFigure.axes ? currentComparisonFigure.axes.T : (currentComparisonFigure.mbti.includes("T") ? 75 : 25);
    const figCompassX = Math.max(10, Math.min(90, figT));
    const figCompassY = Math.max(10, Math.min(90, 100 - figN));

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
                  <span class="e-tag e-tag-hero" style="background: ${topMbti.temperamentColor}; color: #ffffff !important; border: none; border-radius: 999px;">
                    ${topMbti.temperamentName}
                  </span>
                  <h1 class="e-hero-title">${topMbti.title} <span style="color: ${topMbti.temperamentColor};">(${topMbti.type})</span></h1>
                  <div class="resemble-stack hero-resemble-stack">
                    ${(topMbti.stack || []).map(st => {
                      const fInfo = COGNITIVE_FUNCTIONS[st];
                      const fTitle = lang === "ro" ? (fInfo?.nameRo || fInfo?.name || st) : (fInfo?.name || st);
                      const fColor = getFuncTileColors(st).bg;
                      return `<span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;" title="${fTitle}">${st}</span>`;
                    }).join("")}
                  </div>
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
                <h2 class="e-sec-title">${lang === "ro" ? "4 Axe" : "4 Axis"}</h2>
              </div>
              <div class="minimal-axes-grid">
                ${mbtiAxesRowsHtml}
              </div>
            </section>

            <!-- Spectrum (Cross Compass: N/S + F/T on XY, E/I + J/P on YZ - all in one) -->
            <section class="e-panel spectrum-cross-panel" id="spectrum-compass" role="button" tabindex="0" aria-label="${lang === 'ro' ? 'Deschide Spectrul 3D' : 'Open 3D Spectrum'}" style="cursor: pointer; transition: box-shadow 0.2s, transform 0.2s;">
              <div class="e-sec-head" style="margin-bottom: 2rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Spectru" : "Spectrum"}</h2>
                <span class="spectrum-open-hint">${lang === "ro" ? "Deschide 3D →" : "Open 3D →"}</span>
              </div>

              <div class="spectrum-cross-wrap">
                <!-- Plane 1: Mind & Nature (N/S × F/T) -->
                <div class="spectrum-cross-plane-wrap">
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
                      <div class="spectrum-plot-dot" style="left: ${compassX}%; top: ${compassY}%;" title="${lang === 'ro' ? 'Tu' : 'You'} (${topMbti.type}) — ${s1Coords}"></div>
                    </div>
                    <div class="spectrum-cardinal-lbl spectrum-lbl-right">${s1Right}</div>
                  </div>
                  <div class="spectrum-cardinal-lbl spectrum-lbl-bottom">${s1Bottom}</div>
                  <div class="spectrum-bottom-bar" style="margin-top: 0.85rem;">
                    <span class="spectrum-coord-lbl">${s1Coords}</span>
                  </div>
                </div>

                <!-- Plane 2: Energy & Tactics (E/I × J/P) -->
                <div class="spectrum-cross-plane-wrap">
                  <div class="spectrum-cardinal-lbl spectrum-lbl-top">${s2Top}</div>
                  <div class="spectrum-center-row">
                    <div class="spectrum-cardinal-lbl spectrum-lbl-left">${s2Left}</div>
                    <div class="spectrum-quadrant-plane spectrum-quadrant-plane-blue">
                      <div class="spectrum-quadrant quad-ej" title="EJ"></div>
                      <div class="spectrum-quadrant quad-ep" title="EP"></div>
                      <div class="spectrum-quadrant quad-ij" title="IJ"></div>
                      <div class="spectrum-quadrant quad-ip" title="IP"></div>
                      <div class="spectrum-crosshair-h"></div>
                      <div class="spectrum-crosshair-v"></div>
                      <div class="spectrum-plot-dot" style="left: ${compass2X}%; top: ${compass2Y}%;" title="${lang === 'ro' ? 'Tu' : 'You'} (${topMbti.type}) — ${s2Coords}"></div>
                    </div>
                    <div class="spectrum-cardinal-lbl spectrum-lbl-right">${s2Right}</div>
                  </div>
                  <div class="spectrum-cardinal-lbl spectrum-lbl-bottom">${s2Bottom}</div>
                  <div class="spectrum-bottom-bar" style="margin-top: 0.85rem;">
                    <span class="spectrum-coord-lbl">${s2Coords}</span>
                  </div>
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
                        ${m.stack.map(st => {
                          const fColor = getFuncTileColors(st).bg;
                          return `<span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;">${st}</span>`;
                        }).join("")}
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
                <span class="comp-search-icon" aria-hidden="true" style="position: absolute; left: 1.15rem; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.65; font-size: 1.1rem; line-height: 1;">🔍</span>
                <input 
                  type="text" 
                  id="figure-search-input" 
                  class="comp-search-bar" 
                  style="padding-left: 2.85rem;"
                  autocomplete="off"
                  placeholder="" 
                />
                <div id="figure-autocomplete-list" class="figure-autocomplete-dropdown" style="display: none;"></div>
              </div>

              <!-- Comparison Card (Image 2 style) -->
              <div class="comp-card-v2">
                <div class="comp-v2-header" id="comp-figure-header-trigger" style="cursor: pointer;" title="${lang === 'ro' ? 'Apasă pentru detalii complete' : 'Click to inspect spectrum'}" data-id="${currentComparisonFigure.id}">
                  ${currentComparisonFigure.photo ? `
                    <img class="comp-v2-avatar" src="${currentComparisonFigure.photo}" alt="${userB_Name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="display:none; background:${currentFigTemp.color};">${currentComparisonFigure.avatar || userB_Name.charAt(0)}</div>
                  ` : `
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="background:${currentFigTemp.color}26; border: 2px solid ${currentFigTemp.color};">${currentComparisonFigure.avatar || userB_Name.charAt(0)}</div>
                  `}
                  <div class="comp-v2-header-info">
                    <div class="comp-v2-top-row">
                      <h3 class="comp-v2-name">${userB_Name}</h3>
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

            <!-- Compare with someone else (Sub Analiză Comparativă) -->
            <section class="e-ppl-wrapper" id="comparar-pessoa">
              <div class="e-ppl-intro">
                <span class="e-ppl-duo" aria-hidden="true"><i></i><i></i></span>
                <div class="e-ppl-intro-text">
                  <h3>${t('comparePeopleTitle', {}, lang)}</h3>
                  <p class="e-lead e-cmp-lead">${t('comparePeopleLead', {}, lang)}</p>
                </div>
              </div>

              <form class="e-ppl-form" id="ppl-compare-form" novalidate>
                <div class="e-ppl-grid">
                  <!-- Left Column: Your Profile -->
                  <div class="e-ppl-side e-ppl-side-left">
                    <div class="e-ppl-side-badge">
                      <span class="e-ppl-dot-indicator dot-you"></span>
                      <span>${t('yourProfileBadge', {}, lang)}</span>
                    </div>
                    <label class="e-ppl-field">
                      <span class="e-ppl-cap">${t('yourNameLabel', {}, lang)}</span>
                      <span class="e-ppl-control">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="8" r="4"></circle>
                          <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"></path>
                        </svg>
                        <input type="text" id="ppl-name-a" aria-label="${t('yourNameLabel', {}, lang)}" placeholder="${t('youLabel', {}, lang)}" maxlength="40" autocomplete="off" value="${userA_Name}">
                      </span>
                    </label>
                    <label class="e-ppl-field">
                      <span class="e-ppl-cap">${t('yourLinkLabel', {}, lang)}</span>
                      <span class="e-ppl-control">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"></path>
                          <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3A4.5 4.5 0 0 0 11 19.4l1-1"></path>
                        </svg>
                        <input type="text" id="ppl-link-a" inputmode="url" aria-label="${t('yourLinkLabel', {}, lang)}" autocomplete="off" spellcheck="false" value="${userFullResultUrl}">
                        <button class="e-ppl-paste" id="ppl-copy-a" type="button" title="${t('copyLinkBtn', {}, lang)}">
                          <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>${t('copyLinkBtn', {}, lang)}</span>
                        </button>
                      </span>
                    </label>
                  </div>

                  <!-- Right Column: Other Person's Profile -->
                  <div class="e-ppl-side e-ppl-side-right">
                    <div class="e-ppl-side-badge">
                      <span class="e-ppl-dot-indicator dot-other"></span>
                      <span>${t('otherPersonBadge', {}, lang)}</span>
                    </div>
                    <label class="e-ppl-field">
                      <span class="e-ppl-cap">${t('otherNameLabel', {}, lang)}</span>
                      <span class="e-ppl-control">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="8" r="4"></circle>
                          <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"></path>
                        </svg>
                        <input type="text" id="ppl-name-b" aria-label="${t('otherNameLabel', {}, lang)}" placeholder="" maxlength="40" autocomplete="off" value="${this.comparisonPersonB_Name || ''}">
                      </span>
                    </label>
                    <label class="e-ppl-field">
                      <span class="e-ppl-cap">${t('otherLinkLabel', {}, lang)}</span>
                      <span class="e-ppl-control">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"></path>
                          <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3A4.5 4.5 0 0 0 11 19.4l1-1"></path>
                        </svg>
                        <input type="text" id="ppl-link-b" inputmode="url" aria-label="${t('otherLinkLabel', {}, lang)}" placeholder="" autocomplete="off" autocapitalize="off" spellcheck="false" value="${this.comparisonPersonB_Link || ''}">
                        <button class="e-ppl-paste" id="ppl-paste-b" type="button" title="${t('pasteLinkBtn', {}, lang)}">
                          <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="8" y="3" width="8" height="4" rx="1"></rect>
                            <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                          </svg>
                          <span>${t('pasteLinkBtn', {}, lang)}</span>
                        </button>
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Status / error feedback container -->
                <div id="ppl-error-box" class="e-ppl-msg" style="display: none;"></div>

                <!-- Action buttons -->
                <div class="e-ppl-foot">
                  <button class="e-btn e-btn-primary e-ppl-submit" type="submit" id="ppl-submit-btn">
                    <span>${t('compareBtn', {}, lang)}</span>
                    <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
                  </button>
                  ${isCustomPerson ? `
                    <button class="e-btn e-btn-outline e-ppl-reset" type="button" id="ppl-reset-btn">
                      <span>${t('backToFiguresBtn', {}, lang)}</span>
                    </button>
                    <button class="e-btn e-btn-outline e-ppl-share" type="button" id="ppl-share-btn" title="${t('shareCompareBtn', {}, lang)}">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      <span>${t('shareCompareBtn', {}, lang)}</span>
                    </button>
                  ` : ''}
                </div>
              </form>
            </section>

            <!-- Generate Image CTA Button (After Comparative Analysis) -->
            <div class="generate-card-cta-wrapper">
              <button class="e-btn e-btn-generate-card" type="button" id="generate-image-btn" style="background: ${topMbti.temperamentColor || 'var(--accent)'};">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>${lang === "ro" ? "Generează Imagine" : "Generate Image"}</span>
              </button>
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
          genImgBtn.disabled = true;
          const origContent = genImgBtn.innerHTML;
          genImgBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 20px; height: 20px; animation: spin 0.8s linear infinite;">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-dasharray="32" stroke-linecap="round"></circle>
            </svg>
            <span>${lang === "ro" ? "Se descarcă imaginea..." : "Downloading image..."}</span>
          `;

          setTimeout(async () => {
            try {
              const dataUrl = await generateResultsCardCanvas({
                topMbti,
                percentages,
                axisScores,
                similarFigures,
                lang
              });
              
              // Direct download to user device
              const downloadLink = document.createElement("a");
              downloadLink.download = `8func-${(topMbti?.type || "personality").toLowerCase()}-results.png`;
              downloadLink.href = dataUrl;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);

              genImgBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${lang === "ro" ? "Imagine Descărcată!" : "Image Downloaded!"}</span>
              `;
              setTimeout(() => {
                genImgBtn.disabled = false;
                genImgBtn.innerHTML = origContent;
              }, 2000);
            } catch (err) {
              console.error("Failed to generate results image:", err);
              alert(lang === "ro" ? "Eroare la generarea imaginii: " + err.message : "Error generating image: " + err.message);
              genImgBtn.disabled = false;
              genImgBtn.innerHTML = origContent;
            }
          }, 35);
        } catch (err) {
          console.error("Generate button click error:", err);
          genImgBtn.disabled = false;
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

    // Clicking a figure in Notable Figures opens pop out modal
    document.querySelectorAll(".fig-list-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        if (id) {
          this.openFigureDetailModal(id, true);
        }
      });
    });

    // Clicking Comparative Analysis figure header opens pop out modal
    const compHeaderTrigger = document.getElementById("comp-figure-header-trigger");
    if (compHeaderTrigger) {
      compHeaderTrigger.addEventListener("click", () => {
        const id = compHeaderTrigger.getAttribute("data-id");
        if (id) {
          this.openFigureDetailModal(id, true);
        }
      });
    }

    // Clicking figure dot in Comparative Analysis tracks opens pop out modal
    document.querySelectorAll(".comp-v2-dot-fig").forEach(dot => {
      dot.style.cursor = "pointer";
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openFigureDetailModal(currentComparisonFigure.id, true);
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
          const itemCleanRole = getFigureRole(fig, lang);
          const matchLabel = lang === "ro" ? `${fig.similarity}% compatibilitate` : `${fig.similarity}% match`;
          return `
            <div class="autocomplete-item" data-id="${fig.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; border-bottom: 1px solid var(--line); cursor: pointer; transition: background 0.15s ease;">
              <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
                <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: ${temp.colorBg}; border: 1.5px solid ${temp.colorBorder}; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  ${fig.photo ? `
                    <img src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <span style="display:none; font-size: 0.95rem; color: ${temp.color}; font-weight: 700;">${fig.avatar || fig.name.charAt(0)}</span>
                  ` : `
                    <span style="font-size: 0.95rem; color: ${temp.color}; font-weight: 700;">${fig.avatar || fig.name.charAt(0)}</span>
                  `}
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

    // ========================================================
    // Compare with Someone Else (.e-ppl) Events
    // ========================================================
    const pplForm = document.getElementById("ppl-compare-form");
    const nameAInput = document.getElementById("ppl-name-a");
    const linkAInput = document.getElementById("ppl-link-a");
    const copyABtn = document.getElementById("ppl-copy-a");
    const nameBInput = document.getElementById("ppl-name-b");
    const linkBInput = document.getElementById("ppl-link-b");
    const pasteBBtn = document.getElementById("ppl-paste-b");
    const errorBox = document.getElementById("ppl-error-box");
    const resetBtn = document.getElementById("ppl-reset-btn");
    const shareBtn = document.getElementById("ppl-share-btn");

    const showPplMsg = (text, type = "error") => {
      if (!errorBox) return;
      errorBox.className = `e-ppl-msg ${type}`;
      errorBox.textContent = text;
      errorBox.style.display = "block";
    };

    const hidePplMsg = () => {
      if (errorBox) errorBox.style.display = "none";
    };

    if (nameAInput) {
      nameAInput.addEventListener("input", (e) => {
        this.comparisonPersonA_Name = e.target.value.trim();
        // Update user dot titles dynamically
        document.querySelectorAll(".comp-v2-dot-user").forEach(dot => {
          dot.title = this.comparisonPersonA_Name || (lang === "ro" ? "Tu" : "You");
        });
      });
    }

    if (nameBInput) {
      nameBInput.addEventListener("input", (e) => {
        this.comparisonPersonB_Name = e.target.value.trim();
      });
    }

    if (copyABtn && linkAInput) {
      copyABtn.addEventListener("click", async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(linkAInput.value);
          } else {
            linkAInput.select();
            document.execCommand("copy");
          }
          const span = copyABtn.querySelector("span");
          const orig = span ? span.textContent : "";
          if (span) span.textContent = t("copiedToast", {}, lang);
          copyABtn.classList.add("copied");
          setTimeout(() => {
            if (span) span.textContent = orig;
            copyABtn.classList.remove("copied");
          }, 2000);
        } catch (err) {
          linkAInput.select();
          document.execCommand("copy");
        }
      });
    }

    if (pasteBBtn && linkBInput) {
      pasteBBtn.addEventListener("click", async () => {
        hidePplMsg();
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const clipText = await navigator.clipboard.readText();
            if (clipText && clipText.trim()) {
              linkBInput.value = clipText.trim();
              this.comparisonPersonB_Link = clipText.trim();
              showPplMsg(t("linkPastedToast", {}, lang), "success");
              setTimeout(hidePplMsg, 2500);
              return;
            }
          }
          linkBInput.focus();
          linkBInput.select();
        } catch (err) {
          linkBInput.focus();
          linkBInput.select();
        }
      });
    }

    if (pplForm) {
      pplForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hidePplMsg();

        const aName = nameAInput ? (nameAInput.value.trim() || (lang === "ro" ? "Tu" : "You")) : (lang === "ro" ? "Tu" : "You");
        const aLink = linkAInput ? linkAInput.value.trim() : "";
        const bName = nameBInput ? (nameBInput.value.trim() || (lang === "ro" ? "Persoană" : "Person")) : (lang === "ro" ? "Persoană" : "Person");
        const bLink = linkBInput ? linkBInput.value.trim() : "";

        if (!bLink) {
          showPplMsg(t("invalidLinkError", {}, lang), "error");
          if (linkBInput) linkBInput.focus();
          return;
        }

        const parsedB = parseComparisonInputLink(bLink);
        if (!parsedB) {
          showPplMsg(t("invalidLinkError", {}, lang), "error");
          if (linkBInput) linkBInput.focus();
          return;
        }

        let parsedA = null;
        if (aLink && aLink !== userFullResultUrl) {
          parsedA = parseComparisonInputLink(aLink);
        }

        const scoresA = parsedA ? parsedA.percentages : percentages;
        const axesA = parsedA ? parsedA.axisScores : axisScores;
        const typeA = parsedA ? parsedA.derivedType : derivedType;

        this.comparisonPersonA_Name = aName;
        this.comparisonPersonA_Link = aLink || userFullResultUrl;
        this.comparisonPersonB_Name = bName;
        this.comparisonPersonB_Link = bLink;

        this.comparisonPersonA = {
          name: aName,
          percentages: scoresA,
          axisScores: axesA,
          derivedType: typeA,
          link: aLink || userFullResultUrl,
          temperament: getTypeTemperament(typeA),
          archetype: MBTI_TYPES[typeA] || MBTI_TYPES["INTJ"]
        };

        this.comparisonPersonB = {
          name: bName,
          percentages: parsedB.percentages,
          axisScores: parsedB.axisScores,
          derivedType: parsedB.derivedType,
          link: bLink,
          temperament: getTypeTemperament(parsedB.derivedType),
          archetype: MBTI_TYPES[parsedB.derivedType] || MBTI_TYPES["ENFP"]
        };

        // Update URL query parameters for sharing/bookmarking comparison
        try {
          const origin = window.location.origin;
          const pathname = window.location.pathname;
          const search = new URLSearchParams(window.location.search);
          search.set("an", aName);
          search.set("bn", bName);
          search.set("b", bLink);
          if (aLink && aLink !== userFullResultUrl) {
            search.set("a", aLink);
          }
          history.pushState(null, "", `${pathname}?${search.toString()}#compare`);
        } catch (e) {}

        this.state.screen = "compare";
        this.render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.customComparisonPerson = null;
        this.selectedFigureId = null;
        this.comparisonPersonB_Link = "";
        try {
          const search = new URLSearchParams(window.location.search);
          search.delete("bn");
          search.delete("b");
          const searchStr = search.toString() ? `?${search.toString()}` : "";
          history.replaceState(null, "", `${window.location.pathname}${searchStr}${window.location.hash || ''}`);
        } catch (e) {}
        this.renderResults();
        const compTarget = document.getElementById("comparar");
        if (compTarget) compTarget.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        try {
          const shareUrl = window.location.href;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
          } else {
            prompt(t("comparisonLinkCopiedToast", {}, lang), shareUrl);
          }
          showPplMsg(t("comparisonLinkCopiedToast", {}, lang), "success");
          setTimeout(hidePplMsg, 3000);
        } catch (err) {
          prompt(t("comparisonLinkCopiedToast", {}, lang), window.location.href);
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

    const openSpectrumSection = document.getElementById("spectrum-compass");
    if (openSpectrumSection) {
      const navigateToSpectrum = () => this.state.showSpectrum();
      openSpectrumSection.addEventListener("click", navigateToSpectrum);
      openSpectrumSection.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateToSpectrum(); }
      });
    }
  }

  // ==========================================================================
  // Dedicated Comparison Screen (Inspired by 12Axes & 8Func Results Layout)
  // ==========================================================================

  renderCompare() {
    const lang = this.state.lang || "ro";
    const defaultUser = this.getUserScores();

    // Check query params if available
    let aName = this.comparisonPersonA_Name || (this.state.compareParams && this.state.compareParams.an) || (lang === "ro" ? "Tu" : "You");
    let bName = this.comparisonPersonB_Name || (this.state.compareParams && this.state.compareParams.bn) || (lang === "ro" ? "Persoană" : "Person");
    let aLink = this.comparisonPersonA_Link || (this.state.compareParams && this.state.compareParams.a);
    let bLink = this.comparisonPersonB_Link || (this.state.compareParams && this.state.compareParams.b);

    // Person A
    let personA = this.comparisonPersonA;
    if (!personA) {
      let parsedA = null;
      if (aLink) {
        parsedA = parseComparisonInputLink(aLink);
      }
      const scoresA = parsedA ? parsedA.percentages : defaultUser.percentages;
      const axesA = parsedA ? parsedA.axisScores : defaultUser.axisScores;
      const typeA = parsedA ? parsedA.derivedType : defaultUser.derivedType;
      personA = {
        name: aName,
        percentages: scoresA,
        axisScores: axesA,
        derivedType: typeA,
        temperament: getTypeTemperament(typeA),
        archetype: MBTI_TYPES[typeA] || MBTI_TYPES["INTJ"],
        link: aLink || ""
      };
      this.comparisonPersonA = personA;
    }

    // Person B
    let personB = this.comparisonPersonB;
    if (!personB && bLink) {
      const parsedB = parseComparisonInputLink(bLink);
      if (parsedB) {
        const typeB = parsedB.derivedType;
        personB = {
          name: bName,
          percentages: parsedB.percentages,
          axisScores: parsedB.axisScores,
          derivedType: typeB,
          temperament: getTypeTemperament(typeB),
          archetype: MBTI_TYPES[typeB] || MBTI_TYPES["ENFP"],
          link: bLink
        };
        this.comparisonPersonB = personB;
      }
    }

    // Fallback if Person B is missing
    if (!personB) {
      this.root.innerHTML = `
        <div class="app-shell" data-screen="compare">
          <a class="skip-link" href="#conteudo-principal">${t('skipLink', {}, lang)}</a>
          ${this.renderNavbar()}
          <main class="ed e-res e-cmpp" id="conteudo-principal" tabindex="-1">
            <div class="e-panel" style="max-width: 600px; margin: 3rem auto; text-align: center; padding: 2.5rem 1.5rem;">
              <h2>${lang === 'ro' ? 'Nicio comparație activă' : 'No active comparison'}</h2>
              <p style="color: var(--text-muted); margin: 1rem 0 1.5rem;">
                ${lang === 'ro' 
                  ? 'Introdu linkul de rezultate al persoanei cu care dorești să te compari.' 
                  : 'Enter the result link of the person you want to compare with.'}
              </p>
              <button class="e-btn e-btn-primary" type="button" id="cmpp-fallback-btn">
                <span>${t('compareBtn', {}, lang)}</span>
              </button>
            </div>
          </main>
        </div>
      `;
      this.attachNavEvents();
      const fbBtn = document.getElementById("cmpp-fallback-btn");
      if (fbBtn) {
        fbBtn.addEventListener("click", () => {
          this.state.screen = "results";
          this.render();
          setTimeout(() => {
            const el = document.getElementById("comparar-pessoa");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
      }
      return;
    }

    // Similarity & Dynamics
    const simFigureObj = {
      axes: {
        I: personB.axisScores.EI.roundB,
        E: personB.axisScores.EI.roundA,
        S: personB.axisScores.NS.roundB,
        N: personB.axisScores.NS.roundA,
        F: personB.axisScores.TF.roundB,
        T: personB.axisScores.TF.roundA,
        P: personB.axisScores.JP.roundB,
        J: personB.axisScores.JP.roundA
      },
      scores: personB.percentages,
      mbti: personB.derivedType
    };
    const matchPct = calculateFigureSimilarity(personA.percentages, personA.axisScores, simFigureObj);
    const ringDash = ((matchPct / 100) * 283.5).toFixed(1);

    const tempA = personA.temperament || getTypeTemperament(personA.derivedType);
    const tempB = personB.temperament || getTypeTemperament(personB.derivedType);
    const archA = personA.archetype || MBTI_TYPES[personA.derivedType] || MBTI_TYPES["INTJ"];
    const archB = personB.archetype || MBTI_TYPES[personB.derivedType] || MBTI_TYPES["ENFP"];

    const titleA = lang === "ro" ? (archA.titleRo || archA.title) : archA.title;
    const titleB = lang === "ro" ? (archB.titleRo || archB.title) : archB.title;
    const descA = lang === "ro" ? (archA.descRo || archA.description) : archA.description;
    const descB = lang === "ro" ? (archB.descRo || archB.description) : archB.description;
    const quoteA = lang === "ro" ? (archA.quoteRo || archA.quote) : archA.quote;
    const quoteB = lang === "ro" ? (archB.quoteRo || archB.quote) : archB.quote;

    // Commonality analysis
    const lettersA = personA.derivedType.split("");
    const lettersB = personB.derivedType.split("");
    const commonLetters = lettersA.filter((l, i) => l === lettersB[i]);

    let commonSummaryTitle = "";
    let commonSummaryText = "";
    let commonDetailed = "";

    if (personA.derivedType === personB.derivedType) {
      commonSummaryTitle = `${personA.derivedType} · ${titleA}`;
      commonSummaryText = lang === "ro"
        ? `Împărtășiți aceeași tipologie (${personA.derivedType})! Amândoi aveți aceleași preferințe primare, aceleași funcții cognitive dominante și același mod natural de a evalua lumea.`
        : `You share the exact same typology (${personA.derivedType})! Both of you share the same cognitive preferences, dominant cognitive functions, and natural way of assessing the world.`;
      commonDetailed = lang === "ro"
        ? `Această aliniere perfectă creează o rezonanță imediată: vă înțelegeți gândurile fără efort, aveți stiluri de lucru identice și ajungeți la aceleași decizii. Fiți atenți însă la aceleași capcane și puncte slabe comune profilului ${personA.derivedType}.`
        : `This complete alignment creates immediate resonance: you understand each other effortlessly, have identical working styles, and arrive at similar decisions. Be mindful of the shared blind spots characteristic of the ${personA.derivedType} profile.`;
    } else if (commonLetters.length >= 2) {
      commonSummaryTitle = lang === "ro"
        ? `Afinitate Cognitivă (${commonLetters.join(" · ")})`
        : `Cognitive Affinity (${commonLetters.join(" · ")})`;
      commonSummaryText = lang === "ro"
        ? `Aveți în comun ${commonLetters.length} dimensiuni cognitive esențiale (${commonLetters.join(" · ")}). Această suprapunere asigură o comunicare fluidă și încredere reciprocă, în timp ce dimensiunile diferite aduc perspective proaspete și valoroase.`
        : `You share ${commonLetters.length} essential cognitive dimensions (${commonLetters.join(" · ")}). This overlap ensures smooth communication and mutual trust, while differing dimensions provide fresh, valuable insights.`;
      commonDetailed = lang === "ro"
        ? `Dimensiunile voastre comune (${commonLetters.join("")}) vă oferă un limbaj comun solid. În ariile în care vă deosebiți, fiecare aduce abilități complementare care pot îmbunătăți orice proiect sau relație.`
        : `Your shared dimensions (${commonLetters.join("")}) establish a strong common ground. In areas where you differ, each partner contributes complementary strengths that enrich your dynamic.`;
    } else {
      commonSummaryTitle = lang === "ro" ? "Dinamism & Echilibru Complementar" : "Complementary Balance & Dynamics";
      commonSummaryText = lang === "ro"
        ? `Profiluri cu contraste puternice și valoroase! ${personA.name} (${personA.derivedType}) și ${personB.name} (${personB.derivedType}) oferă un echilibru remarcabil prin perspective cognitive complementare.`
        : `Profiles with strong, valuable contrast! ${personA.name} (${personA.derivedType}) and ${personB.name} (${personB.derivedType}) provide remarkable balance through complementary cognitive perspectives.`;
      commonDetailed = lang === "ro"
        ? `Diferențele dintre voi sunt exact ceea ce vă poate face o echipă imbatabilă: gândirea strategică, energia și intuiția se combină pentru a acoperi toate aspectele unei provocări.`
        : `Your cognitive differences are precisely what can make you an unbeatable team: strategic thinking, energy, and intuition combine to cover all aspects of any challenge.`;
    }

    // 4 Axes comparison
    const axesCompData = [
      {
        id: "energy",
        name: lang === "ro" ? "Energie & Focus (E / I)" : "Energy & Focus (E / I)",
        poleLeft: lang === "ro" ? "Extraversie" : "Extraversion",
        poleRight: lang === "ro" ? "Introversie" : "Introversion",
        posA: personA.axisScores.EI.roundB, // I%
        posB: personB.axisScores.EI.roundB, // I%
        scoreA_left: personA.axisScores.EI.roundA,
        scoreA_right: personA.axisScores.EI.roundB,
        scoreB_left: personB.axisScores.EI.roundA,
        scoreB_right: personB.axisScores.EI.roundB,
        color: "#2F6DC0"
      },
      {
        id: "mind",
        name: lang === "ro" ? "Informație & Percepție (N / S)" : "Information & Perception (N / S)",
        poleLeft: lang === "ro" ? "Intuiție" : "Intuition",
        poleRight: lang === "ro" ? "Senzorial" : "Sensing",
        posA: personA.axisScores.NS.roundB, // S%
        posB: personB.axisScores.NS.roundB, // S%
        scoreA_left: personA.axisScores.NS.roundA,
        scoreA_right: personA.axisScores.NS.roundB,
        scoreB_left: personB.axisScores.NS.roundA,
        scoreB_right: personB.axisScores.NS.roundB,
        color: "#95637E"
      },
      {
        id: "nature",
        name: lang === "ro" ? "Decizie & Natură (T / F)" : "Decision & Nature (T / F)",
        poleLeft: lang === "ro" ? "Gândire" : "Thinking",
        poleRight: lang === "ro" ? "Sentiment" : "Feeling",
        posA: personA.axisScores.TF.roundB, // F%
        posB: personB.axisScores.TF.roundB, // F%
        scoreA_left: personA.axisScores.TF.roundA,
        scoreA_right: personA.axisScores.TF.roundB,
        scoreB_left: personB.axisScores.TF.roundA,
        scoreB_right: personB.axisScores.TF.roundB,
        color: "#72CCCD"
      },
      {
        id: "tactics",
        name: lang === "ro" ? "Stil de viață & Tactică (J / P)" : "Lifestyle & Tactics (J / P)",
        poleLeft: lang === "ro" ? "Judecată" : "Judging",
        poleRight: lang === "ro" ? "Percepție" : "Perceiving",
        posA: personA.axisScores.JP.roundB, // P%
        posB: personB.axisScores.JP.roundB, // P%
        scoreA_left: personA.axisScores.JP.roundA,
        scoreA_right: personA.axisScores.JP.roundB,
        scoreB_left: personB.axisScores.JP.roundA,
        scoreB_right: personB.axisScores.JP.roundB,
        color: "#4361AB"
      }
    ];

    // Find biggest difference, biggest agreement, and opposite sides
    let maxDiffAxis = axesCompData[0];
    let maxDiff = -1;
    let minDiffAxis = axesCompData[0];
    let minDiff = 999;
    const oppositeSidesList = [];

    axesCompData.forEach(ax => {
      const diff = Math.abs(ax.posA - ax.posB);
      if (diff > maxDiff) {
        maxDiff = diff;
        maxDiffAxis = ax;
      }
      if (diff < minDiff) {
        minDiff = diff;
        minDiffAxis = ax;
      }
      const aRight = ax.posA > 50;
      const bRight = ax.posB > 50;
      if (aRight !== bRight && Math.abs(ax.posA - 50) >= 3 && Math.abs(ax.posB - 50) >= 3) {
        oppositeSidesList.push({
          axis: ax,
          aPole: aRight ? ax.poleRight : ax.poleLeft,
          bPole: bRight ? ax.poleRight : ax.poleLeft,
          aPct: aRight ? ax.posA : (100 - ax.posA),
          bPct: bRight ? ax.posB : (100 - ax.posB)
        });
      }
    });

    // 8 Functions comparison
    const funcsCompData = FUNCTIONS_LIST.map(f => {
      const fInfo = COGNITIVE_FUNCTIONS[f];
      const fName = lang === "ro" ? (fInfo?.nameRo || fInfo?.name || f) : (fInfo?.name || f);
      const pA = personA.percentages[f] ?? 50;
      const pB = personB.percentages[f] ?? 50;
      const delta = Math.abs(pA - pB);
      const fColor = getFuncTileColors(f).bg;
      let deltaText = "";
      if (delta <= 6) deltaText = lang === "ro" ? "Aproape identic" : "Nearly identical";
      else if (delta <= 18) deltaText = lang === "ro" ? "Apropiat" : "Close match";
      else deltaText = lang === "ro" ? "Diferență notabilă" : "Noticeable delta";

      return {
        code: f,
        name: fName,
        color: fColor,
        pA,
        pB,
        delta,
        deltaText
      };
    });

    // Closest figures
    const rankedFiguresA = getRankedFigures(personA.percentages, personA.axisScores, "similar");
    const rankedFiguresB = getRankedFigures(personB.percentages, personB.axisScores, "similar");
    const topFigA = rankedFiguresA[0] || NOTABLE_FIGURES[0];
    const topFigB = rankedFiguresB[0] || NOTABLE_FIGURES[1];
    const simFigA = calculateFigureSimilarity(personA.percentages, personA.axisScores, topFigA);
    const simFigB = calculateFigureSimilarity(personB.percentages, personB.axisScores, topFigB);

    const top10IdsA = new Set(rankedFiguresA.slice(0, 10).map(f => f.id));
    const mutualFigures = rankedFiguresB.slice(0, 10).filter(f => top10IdsA.has(f.id));

    this.root.innerHTML = `
      <div class="app-shell" data-screen="compare">
        <a class="skip-link" href="#conteudo-principal">${t('skipLink', {}, lang)}</a>
        ${this.renderNavbar()}

        <main class="ed e-res e-cmpp" id="conteudo-principal" tabindex="-1">
          <div class="e-wrap e-res-grid">
            <div class="e-res-main">
              <header class="e-res-head">
                <h1>${t('compareHeading', {}, lang)}</h1>
                <div class="e-actions e-ppl-share">
                  <button class="e-btn e-btn-primary" type="button" id="cmpp-share-top-btn">
                    <span>${t('shareCompareBtn', {}, lang)}</span>
                    <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="fill: currentcolor; stroke: none;"><path d="M22.71 6.29a1 1 0 0 0-1.42 0L20 7.59V2a1 1 0 0 0-2 0v5.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l3-3a1 1 0 0 0 0-1.42M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7l-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h8a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17l4.3 4.3Zm13-1a.9.9 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.21Z"></path></svg>
                  </button>
                  <button class="e-btn e-btn-outline" type="button" id="cmpp-edit-top-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>${lang === 'ro' ? 'Editează comparația' : 'Edit comparison'}</span>
                  </button>
                </div>
              </header>

              <!-- People Profiles -->
              <section class="e-panel" id="cmp-perfis">
                <h2>${t('comparePeopleSection', {}, lang)}</h2>
                <ul class="e-cp-cards">
                  <li class="e-cp-card">
                    <span class="e-cp-face">
                      <span class="e-avatar e-cmp-dot" style="background: ${tempA.color};">${personA.name.charAt(0).toUpperCase()}</span>
                    </span>
                    <div class="e-cp-text">
                      <span class="e-ppl-nameline">
                        <strong>${personA.name}</strong>
                        <button class="e-ppl-edit" id="cmpp-rename-a-btn" type="button" title="${t('editNameTitle', {}, lang)}">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"></path></svg>
                        </button>
                      </span>
                      <span class="e-cp-type-badge">
                        <span class="e-cp-type-pill" style="background: ${tempA.color};">${personA.derivedType}</span>
                        <span>${titleA} (${tempA.name})</span>
                      </span>
                    </div>
                  </li>
                  <li class="e-cp-card">
                    <span class="e-cp-face">
                      <span class="e-avatar e-cmp-dot" style="background: ${tempB.color};">${personB.name.charAt(0).toUpperCase()}</span>
                    </span>
                    <div class="e-cp-text">
                      <span class="e-ppl-nameline">
                        <strong>${personB.name}</strong>
                        <button class="e-ppl-edit" id="cmpp-rename-b-btn" type="button" title="${t('editNameTitle', {}, lang)}">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"></path></svg>
                        </button>
                      </span>
                      <span class="e-cp-type-badge">
                        <span class="e-cp-type-pill" style="background: ${tempB.color};">${personB.derivedType}</span>
                        <span>${titleB} (${tempB.name})</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </section>

              <!-- Cognitive Match & In Common -->
              <section class="e-panel" id="cmp-ideologia">
                <h2>${t('compareMatchSection', {}, lang)}</h2>
                <article class="e-cp-common">
                  <div class="e-cp-common-text">
                    <span class="e-tag e-tag-hero" style="background: var(--accent); color: #ffffff; border-radius: 999px;">${t('compareInCommonTag', {}, lang)}</span>
                    <h3>${commonSummaryTitle}</h3>
                    <p>${commonSummaryText}</p>
                    <details class="e-more" style="margin-top: 0.75rem;">
                      <summary style="cursor: pointer; font-weight: 700; color: var(--accent);">${lang === 'ro' ? 'Află mai multe despre dinamica cognitivă' : 'Learn more about cognitive dynamics'}</summary>
                      <p style="margin-top: 0.65rem; line-height: 1.6; color: var(--text-muted);">${commonDetailed}</p>
                    </details>
                  </div>
                  <div class="e-ring" role="img" aria-label="Compatibility: ${matchPct} percent" style="width: 108px; height: 108px; flex-shrink: 0;">
                    <svg viewBox="0 0 104 104">
                      <circle cx="52" cy="52" r="47.5" fill="none" stroke="var(--line)" stroke-width="7"></circle>
                      <circle class="e-ring-arc" cx="52" cy="52" r="47.5" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${ringDash} 298.5"></circle>
                    </svg>
                    <div><strong>${matchPct}%</strong><small>${t('compareMatchLabel', {}, lang)}</small></div>
                  </div>
                </article>

                <ul class="e-cp-near">
                  <li class="e-cp-near-col">
                    <p class="e-cp-near-who">
                      <span class="e-close-face" style="background: ${tempA.color};">${personA.name.charAt(0).toUpperCase()}</span>
                      <span>${lang === 'ro' ? 'Arhetipul lui ' + personA.name : 'Closest to ' + personA.name}</span>
                    </p>
                    <article class="e-ocard" style="border-top: 3.5px solid ${tempA.color};">
                      <span class="e-tag" style="background: ${tempA.bg}; color: ${tempA.color}; font-weight: 800;">${tempA.name}</span>
                      <h3>${titleA} <span style="color: ${tempA.color}; font-weight: 800;">(${personA.derivedType})</span></h3>
                      <p class="e-ocard-text">${descA || quoteA}</p>
                    </article>
                  </li>
                  <li class="e-cp-near-col">
                    <p class="e-cp-near-who">
                      <span class="e-close-face" style="background: ${tempB.color};">${personB.name.charAt(0).toUpperCase()}</span>
                      <span>${lang === 'ro' ? 'Arhetipul lui ' + personB.name : 'Closest to ' + personB.name}</span>
                    </p>
                    <article class="e-ocard" style="border-top: 3.5px solid ${tempB.color};">
                      <span class="e-tag" style="background: ${tempB.bg}; color: ${tempB.color}; font-weight: 800;">${tempB.name}</span>
                      <h3>${titleB} <span style="color: ${tempB.color}; font-weight: 800;">(${personB.derivedType})</span></h3>
                      <p class="e-ocard-text">${descB || quoteB}</p>
                    </article>
                  </li>
                </ul>
              </section>

              <!-- 4 MBTI Axes -->
              <section class="e-panel" id="cmp-eixos">
                <h2>${t('compareAxesSection', {}, lang)}</h2>
                <ul class="e-cp-legend" aria-hidden="true">
                  <li><span class="e-close-face" style="background: var(--accent);">${personA.name.charAt(0).toUpperCase()}</span>${personA.name}</li>
                  <li><span class="e-close-face" style="background: #e0682b;">${personB.name.charAt(0).toUpperCase()}</span>${personB.name}</li>
                </ul>

                <ul class="e-cp-axes">
                  ${axesCompData.map(ax => {
                    const diff = Math.abs(ax.posA - ax.posB);
                    const isBoth = diff <= 4;
                    const minPos = Math.min(ax.posA, ax.posB);
                    const maxPos = Math.max(ax.posA, ax.posB);
                    const connectorWidth = Math.max(0, maxPos - minPos);
                    return `
                      <li class="e-cp-axis">
                        <div class="e-axis-row-head">
                          <h3>${ax.name}</h3>
                          <span class="e-axis-diff-badge">${diff === 0 ? (lang === 'ro' ? 'Identic' : 'Identical') : `Δ ${diff} pct`}</span>
                        </div>
                        <div class="e-cp-track" role="img" aria-label="${ax.name}: ${personA.name} ${ax.posA}%, ${personB.name} ${ax.posB}%">
                          <span class="e-amid"></span>
                          ${isBoth ? `
                            <span class="e-cp-pin is-both" style="left: ${ax.posA}%;">
                              <span>${t('compareBothLabel', {}, lang)} · ${ax.posA}%</span>
                            </span>
                          ` : `
                            <span class="e-cp-connector" style="left: ${minPos}%; width: ${connectorWidth}%;"></span>
                            <span class="e-cp-pin" style="left: ${ax.posA}%; background: var(--accent);">
                              <span>${personA.name}: ${ax.posA}%</span>
                            </span>
                            <span class="e-cp-pin" style="left: ${ax.posB}%; background: #e0682b;">
                              <span>${personB.name}: ${ax.posB}%</span>
                            </span>
                          `}
                        </div>
                        <div class="e-axis-poles">
                          <div class="e-pole e-left">
                            <b>${ax.poleLeft}</b>
                            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">
                              (${ax.scoreA_left}% · ${ax.scoreB_left}%)
                            </span>
                          </div>
                          <div class="e-pole e-right">
                            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">
                              (${ax.scoreA_right}% · ${ax.scoreB_right}%)
                            </span>
                            <b>${ax.poleRight}</b>
                          </div>
                        </div>
                      </li>
                    `;
                  }).join("")}
                </ul>
              </section>

              <!-- 8 Cognitive Functions -->
              <section class="e-panel" id="cmp-functii">
                <h2>${t('compareFuncsSection', {}, lang)}</h2>
                <div class="e-cp-funcs-grid">
                  ${funcsCompData.map(fn => {
                    return `
                      <div class="e-cp-func-card">
                        <div class="e-cp-func-head">
                          <div class="e-cp-func-title">
                            <span class="e-func-badge" style="background: ${fn.color};">${fn.code}</span>
                            <span class="e-cp-func-name">${fn.name}</span>
                          </div>
                          <span class="e-cp-func-delta" title="${fn.deltaText}">Δ ${fn.delta}% · ${fn.deltaText}</span>
                        </div>
                        <div class="e-cp-func-bars">
                          <div class="e-cp-func-row">
                            <span class="e-cp-func-person">
                              <span class="e-close-face" style="background: var(--accent); width: 16px; height: 16px; font-size: 0.6rem;">${personA.name.charAt(0).toUpperCase()}</span>
                              <span>${personA.name}</span>
                            </span>
                            <div class="e-cp-func-track">
                              <div class="e-cp-func-fill" style="width: ${fn.pA}%; background: var(--accent);"></div>
                            </div>
                            <span class="e-cp-func-val">${fn.pA}%</span>
                          </div>
                          <div class="e-cp-func-row">
                            <span class="e-cp-func-person">
                              <span class="e-close-face" style="background: #e0682b; width: 16px; height: 16px; font-size: 0.6rem;">${personB.name.charAt(0).toUpperCase()}</span>
                              <span>${personB.name}</span>
                            </span>
                            <div class="e-cp-func-track">
                              <div class="e-cp-func-fill" style="width: ${fn.pB}%; background: #e0682b;"></div>
                            </div>
                            <span class="e-cp-func-val">${fn.pB}%</span>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </section>

              <!-- What Sets You Apart & Where You Meet -->
              <section class="e-panel" id="cmp-assinatura">
                <div class="e-sec-head">
                  <h2 class="e-sec-title">${t('compareDistinctionSection', {}, lang)}</h2>
                </div>
                <div class="e-dist">
                  <article class="e-dcard">
                    <div class="e-dcard-head">
                      <span class="e-tag" style="background: rgba(224, 104, 43, 0.15); color: #e0682b; font-weight: 800; border-radius: 999px;">${t('compareDifferMost', {}, lang)}</span>
                      <h3>${maxDiffAxis.name}</h3>
                    </div>
                    <div class="e-dcard-body">
                      <p class="e-big">${maxDiff}<small>pts</small></p>
                      <p class="e-cap">
                        ${lang === 'ro'
                          ? `${personA.name} și ${personB.name} au o diferență de ${maxDiff} puncte pe această axă.`
                          : `${personA.name} and ${personB.name} differ by ${maxDiff} points on this axis.`}
                      </p>
                    </div>
                    <div class="e-mbar" aria-hidden="true">
                      <span class="e-mfill" style="left: ${Math.min(maxDiffAxis.posA, maxDiffAxis.posB)}%; width: ${maxDiff}%;"></span>
                      <span class="e-myou" style="left: ${maxDiffAxis.posA}%; border-color: var(--accent);" title="${personA.name}"></span>
                      <span class="e-myou" style="left: ${maxDiffAxis.posB}%; border-color: #e0682b;" title="${personB.name}"></span>
                    </div>
                    <div class="e-mlab">
                      <span>${maxDiffAxis.poleLeft}</span>
                      <span>${maxDiffAxis.poleRight}</span>
                    </div>
                  </article>

                  <article class="e-dcard">
                    <div class="e-dcard-head">
                      <span class="e-tag" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 800; border-radius: 999px;">${t('compareAgreeMost', {}, lang)}</span>
                      <h3>${minDiffAxis.name}</h3>
                    </div>
                    <div class="e-dcard-body">
                      <p class="e-big">${minDiff}<small>pts</small></p>
                      <p class="e-cap">
                        ${lang === 'ro'
                          ? `Aici vă întâlniți: doar ${minDiff} puncte diferență între profilurile voastre.`
                          : `This is where you meet: only ${minDiff} points apart on this dimension.`}
                      </p>
                    </div>
                    <div class="e-mbar" aria-hidden="true">
                      <span class="e-mfill" style="left: ${Math.min(minDiffAxis.posA, minDiffAxis.posB)}%; width: ${minDiff}%;"></span>
                      <span class="e-myou" style="left: ${minDiffAxis.posA}%; border-color: var(--accent);" title="${personA.name}"></span>
                      <span class="e-myou" style="left: ${minDiffAxis.posB}%; border-color: #e0682b;" title="${personB.name}"></span>
                    </div>
                    <div class="e-mlab">
                      <span>${minDiffAxis.poleLeft}</span>
                      <span>${minDiffAxis.poleRight}</span>
                    </div>
                  </article>

                  <article class="e-tension">
                    <div class="e-cp-tension-head">
                      <span class="e-tag" style="background: var(--paper); border: 1px solid var(--line); font-weight: 800; border-radius: 999px;">${t('compareOppositeSides', {}, lang)}</span>
                      <div class="e-pair">
                        <span style="color: var(--accent); font-weight: 800;">${personA.name}</span>
                        <span style="color: var(--text-muted);">×</span>
                        <span style="color: #e0682b; font-weight: 800;">${personB.name}</span>
                      </div>
                    </div>
                    ${oppositeSidesList.length > 0 ? `
                      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                        ${oppositeSidesList.map(op => `
                          <div style="font-size: 0.88rem; line-height: 1.45; color: var(--text-strong); padding: 0.5rem 0.65rem; background: var(--paper); border-radius: 8px;">
                            <b>${op.axis.name}</b>: ${personA.name} (${op.aPole} ${op.aPct}%) vs ${personB.name} (${op.bPole} ${op.bPct}%).
                          </div>
                        `).join("")}
                      </div>
                    ` : `
                      <p><b>${t('compareNoOpposite', {}, lang)}</b></p>
                    `}
                  </article>
                </div>
              </section>

              <!-- Closest Personalities -->
              <section class="e-panel" id="cmp-personalidades">
                <h2>${t('compareFiguresSection', {}, lang)}</h2>
                <ul class="e-cp-near">
                  <li class="e-cp-near-col">
                    <p class="e-cp-near-who">
                      <span class="e-close-face" style="background: var(--accent);">${personA.name.charAt(0).toUpperCase()}</span>
                      <span>${lang === 'ro' ? 'Cea mai apropiată de ' + personA.name : 'Closest to ' + personA.name}</span>
                    </p>
                    <article class="e-ocard" style="display: flex; align-items: center; gap: 1.25rem;">
                      ${topFigA.photo ? `
                        <img src="${topFigA.photo}" alt="${topFigA.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0;" />
                      ` : `
                        <div class="e-avatar e-cmp-dot" style="background: var(--accent); width: 64px; height: 64px; font-size: 1.6rem; flex-shrink: 0;">${topFigA.avatar || topFigA.name.charAt(0)}</div>
                      `}
                      <div style="flex: 1; min-width: 0;">
                        <span class="e-tag" style="background: var(--paper); border: 1px solid var(--line); font-weight: 800; border-radius: 999px;">${simFigA}% ${t('compareMatchLabel', {}, lang)}</span>
                        <h3 style="margin: 0.35rem 0 0.2rem;">${topFigA.name}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${getFigureRole(topFigA, lang)} · <b style="color: var(--accent);">${topFigA.mbti}</b></p>
                      </div>
                    </article>
                  </li>
                  <li class="e-cp-near-col">
                    <p class="e-cp-near-who">
                      <span class="e-close-face" style="background: #e0682b;">${personB.name.charAt(0).toUpperCase()}</span>
                      <span>${lang === 'ro' ? 'Cea mai apropiată de ' + personB.name : 'Closest to ' + personB.name}</span>
                    </p>
                    <article class="e-ocard" style="display: flex; align-items: center; gap: 1.25rem;">
                      ${topFigB.photo ? `
                        <img src="${topFigB.photo}" alt="${topFigB.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0;" />
                      ` : `
                        <div class="e-avatar e-cmp-dot" style="background: #e0682b; width: 64px; height: 64px; font-size: 1.6rem; flex-shrink: 0;">${topFigB.avatar || topFigB.name.charAt(0)}</div>
                      `}
                      <div style="flex: 1; min-width: 0;">
                        <span class="e-tag" style="background: var(--paper); border: 1px solid var(--line); font-weight: 800; border-radius: 999px;">${simFigB}% ${t('compareMatchLabel', {}, lang)}</span>
                        <h3 style="margin: 0.35rem 0 0.2rem;">${topFigB.name}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${getFigureRole(topFigB, lang)} · <b style="color: #e0682b;">${topFigB.mbti}</b></p>
                      </div>
                    </article>
                  </li>
                </ul>

                ${mutualFigures.length > 0 ? `
                  <div style="margin-top: 1.25rem; padding: 1rem 1.25rem; background: var(--paper); border: 1px solid var(--line); border-radius: 14px;">
                    <strong style="font-size: 0.9rem; color: var(--text-strong); display: block; margin-bottom: 0.5rem;">
                      ${lang === 'ro' ? 'Figuri comune în Top 10:' : 'Mutual figures in Top 10:'}
                    </strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
                      ${mutualFigures.map(mf => `
                        <span class="e-tag" style="background: var(--card-bg); border: 1px solid var(--line); font-weight: 700;">
                          ${mf.name} (${mf.mbti})
                        </span>
                      `).join("")}
                    </div>
                  </div>
                ` : ''}
              </section>

              <!-- Compatibility Between You -->
              <section class="e-panel" id="cmp-pares">
                <h2>${t('compareCompatibilitySection', {}, lang)}</h2>
                <ul class="e-cp-pairs">
                  <li class="e-cp-pair">
                    <span class="e-cp-duo">
                      <span class="e-avatar e-cmp-dot" style="background: var(--accent);">${personA.name.charAt(0).toUpperCase()}</span>
                      <span class="e-avatar e-cmp-dot" style="background: #e0682b;">${personB.name.charAt(0).toUpperCase()}</span>
                    </span>
                    <div class="e-cp-pair-main">
                      <strong>${personA.name} <span aria-hidden="true" style="opacity: 0.6; font-weight: 400;">×</span> ${personB.name}</strong>
                      <span class="e-cp-meter" role="img" aria-label="Compatibility: ${matchPct} percent">
                        <i style="width: ${matchPct}%; background: linear-gradient(90deg, var(--accent), #e0682b);"></i>
                      </span>
                      <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                        ${matchPct >= 80 
                          ? (lang === 'ro' ? 'Compatibilitate cognitivă excepțională: vă sincronizați natural în gândire și acțiune.' : 'Exceptional cognitive compatibility: natural synchronization in thought and action.')
                          : (matchPct >= 60 
                            ? (lang === 'ro' ? 'Compatibilitate dinamică echilibrată: asemănări suficiente pentru înțelegere și diferențe constructive.' : 'Balanced dynamic compatibility: enough similarity for mutual trust and constructive differences.')
                            : (lang === 'ro' ? 'Contrast stimulativ: unghiuri de vedere diferite ce favorizează învățarea și completarea reciprocă.' : 'Stimulating contrast: differing perspectives that promote growth and complement each other.'))}
                      </p>
                    </div>
                    <p class="e-cp-pair-pct">${matchPct}<small>%</small></p>
                  </li>
                </ul>
              </section>

              <!-- Actions -->
              <div class="e-actions">
                <button class="e-btn e-btn-primary" type="button" id="cmpp-share-bottom-btn">
                  <span>${t('shareCompareBtn', {}, lang)}</span>
                  <svg class="e-arr" viewBox="0 0 24 24" aria-hidden="true" style="fill: currentcolor; stroke: none;"><path d="M22.71 6.29a1 1 0 0 0-1.42 0L20 7.59V2a1 1 0 0 0-2 0v5.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l3-3a1 1 0 0 0 0-1.42M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7l-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h8a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17l4.3 4.3Zm13-1a.9.9 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.21Z"></path></svg>
                </button>
                <button class="e-btn e-btn-outline" type="button" id="cmpp-edit-bottom-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>${lang === 'ro' ? 'Editează comparația' : 'Edit comparison'}</span>
                </button>
                <button class="e-btn e-btn-outline" type="button" id="cmpp-back-bottom-btn">
                  <span>${t('compareNavBack', {}, lang)}</span>
                </button>
              </div>
            </div>

            <!-- Sidebar Table of Contents -->
            <aside class="e-side" aria-label="${lang === 'ro' ? 'Pe această pagină' : 'On this page'}">
              <nav class="e-panel e-toc" aria-label="${lang === 'ro' ? 'Cuprins comparație' : 'Comparison table of contents'}">
                <p>${lang === 'ro' ? 'Pe această pagină' : 'On this page'}</p>
                <a href="#cmp-perfis" class="e-on"><span>01</span>${t('comparePeopleSection', {}, lang)}</a>
                <a href="#cmp-ideologia"><span>02</span>${t('compareMatchSection', {}, lang)}</a>
                <a href="#cmp-eixos"><span>03</span>${t('compareAxesSection', {}, lang)}</a>
                <a href="#cmp-functii"><span>04</span>${t('compareFuncsSection', {}, lang)}</a>
                <a href="#cmp-assinatura"><span>05</span>${t('compareDistinctionSection', {}, lang)}</a>
                <a href="#cmp-personalidades"><span>06</span>${t('compareFiguresSection', {}, lang)}</a>
                <a href="#cmp-pares"><span>07</span>${t('compareCompatibilitySection', {}, lang)}</a>
              </nav>
            </aside>
          </div>
        </main>
      </div>
    `;

    this.attachCompareEvents(personA, personB);
  }

  attachCompareEvents(personA, personB) {
    this.attachNavEvents();
    const lang = this.state.lang || "ro";

    const copyComparisonUrl = async () => {
      try {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          prompt(t("comparisonLinkCopiedToast", {}, lang), url);
        }
        alert(t("comparisonLinkCopiedToast", {}, lang));
      } catch (err) {
        prompt(t("comparisonLinkCopiedToast", {}, lang), window.location.href);
      }
    };

    const goToEdit = () => {
      this.state.screen = "results";
      this.render();
      setTimeout(() => {
        const el = document.getElementById("comparar-pessoa");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    const shareTop = document.getElementById("cmpp-share-top-btn");
    const shareBottom = document.getElementById("cmpp-share-bottom-btn");
    if (shareTop) shareTop.addEventListener("click", copyComparisonUrl);
    if (shareBottom) shareBottom.addEventListener("click", copyComparisonUrl);

    const editTop = document.getElementById("cmpp-edit-top-btn");
    const editBottom = document.getElementById("cmpp-edit-bottom-btn");
    if (editTop) editTop.addEventListener("click", goToEdit);
    if (editBottom) editBottom.addEventListener("click", goToEdit);

    const backBottom = document.getElementById("cmpp-back-bottom-btn");
    if (backBottom) {
      backBottom.addEventListener("click", () => {
        this.state.screen = "results";
        this.render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const renameABtn = document.getElementById("cmpp-rename-a-btn");
    if (renameABtn) {
      renameABtn.addEventListener("click", () => {
        const val = prompt(lang === "ro" ? "Introdu numele pentru persoana 1:" : "Enter name for person 1:", personA.name);
        if (val && val.trim()) {
          personA.name = val.trim();
          this.comparisonPersonA_Name = personA.name;
          try {
            const search = new URLSearchParams(window.location.search);
            search.set("an", personA.name);
            history.replaceState(null, "", `${window.location.pathname}?${search.toString()}#compare`);
          } catch(e) {}
          this.render();
        }
      });
    }

    const renameBBtn = document.getElementById("cmpp-rename-b-btn");
    if (renameBBtn) {
      renameBBtn.addEventListener("click", () => {
        const val = prompt(lang === "ro" ? "Introdu numele pentru persoana 2:" : "Enter name for person 2:", personB.name);
        if (val && val.trim()) {
          personB.name = val.trim();
          this.comparisonPersonB_Name = personB.name;
          try {
            const search = new URLSearchParams(window.location.search);
            search.set("bn", personB.name);
            history.replaceState(null, "", `${window.location.pathname}?${search.toString()}#compare`);
          } catch(e) {}
          this.render();
        }
      });
    }

    // Smooth scroll for TOC links
    const tocLinks = document.querySelectorAll(".e-toc a");
    tocLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            tocLinks.forEach(l => l.classList.remove("e-on"));
            link.classList.add("e-on");
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }

  // ==========================================================================
  // Dedicated Figures Directory (196 Personalities Gallery)
  // ==========================================================================

  renderFiguresDirectory() {
    const lang = this.state.lang || "ro";

    // Check if user has test scores available (from URL, state, or localStorage)
    let userPercentages = null;
    let userAxisScores = null;
    let hasUserScores = false;

    if (this.state.urlResultsScores) {
      userPercentages = this.state.urlResultsScores.percentages;
      userAxisScores = this.state.urlResultsScores.axisScores;
      hasUserScores = true;
    } else if (this.state.lastUserResults) {
      userPercentages = this.state.lastUserResults.percentages;
      userAxisScores = this.state.lastUserResults.axisScores;
      hasUserScores = true;
    } else {
      try {
        const saved = localStorage.getItem('8func_last_user_results');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.percentages && parsed.axisScores) {
            userPercentages = parsed.percentages;
            userAxisScores = parsed.axisScores;
            hasUserScores = true;
          }
        }
      } catch (e) {}
    }

    if (!hasUserScores) {
      const { percentages, axisScores, isComplete } = calculateScores(this.state.questions, this.state.answers);
      if (isComplete && Object.keys(this.state.answers).length >= this.state.questions.length) {
        userPercentages = percentages;
        userAxisScores = axisScores;
        hasUserScores = true;
      }
    }

    // Default sort: if scores exist and no manual sort selected, default to similarity (Match), else name_asc (A-Z)
    const activeSort = this.figuresDirSort || (hasUserScores ? "similarity" : "name_asc");

    // Map all figures with original 1-based index and similarity if scores exist
    let allFigs = NOTABLE_FIGURES.map((fig, idx) => {
      const sim = hasUserScores ? calculateFigureSimilarity(userPercentages, userAxisScores, fig) : null;
      return {
        ...fig,
        originalIndex: idx + 1,
        similarity: sim
      };
    });

    // 1. Search filter
    const query = (this.figuresDirSearch || "").toLowerCase().trim();
    let filtered = allFigs;
    if (query) {
      filtered = filtered.filter(f => {
        const name = (f.name || "").toLowerCase();
        const role = (f.role || f.profession || "").toLowerCase();
        const cleanRole = getFigureRole(f, lang).toLowerCase();
        const mbti = (f.mbti || "").toLowerCase();
        return name.includes(query) || role.includes(query) || cleanRole.includes(query) || mbti.includes(query);
      });
    }

    // 2. Multi-Select Quick filters (Types, Functions, Axes, Temperaments, Category) - Union (OR) logic
    if (this.figuresSelectedFilters && this.figuresSelectedFilters.size > 0) {
      const activeFilters = Array.from(this.figuresSelectedFilters).map(key => {
        const idx = key.indexOf(":");
        return { cat: key.slice(0, idx), val: key.slice(idx + 1) };
      });

      filtered = filtered.filter(f => {
        const upperMbti = (f.mbti || "").toUpperCase();
        const stack = (MBTI_TYPES[f.mbti]?.stack || []).map(s => s.toLowerCase());
        const prof = (f.profession || "").toLowerCase();
        const role = (f.role || "").toLowerCase();

        return activeFilters.some(({ cat, val }) => {
          if (cat === "type") {
            return upperMbti === val.toUpperCase();
          }
          if (cat === "function") {
            return stack.slice(0, 2).includes(val.toLowerCase());
          }
          if (cat === "axis") {
            return upperMbti.includes(val.toUpperCase());
          }
          if (cat === "temperament") {
            const v = val.toUpperCase();
            return upperMbti.includes(v.charAt(0)) && upperMbti.includes(v.charAt(1));
          }
          if (cat === "category") {
            const v = val.toUpperCase();
            if (v === "ARTIST") {
              return prof === "artist" || prof === "musician" || prof === "writer" || role.includes("artist");
            }
            if (v === "POLITICS") {
              return prof === "politician" || role.includes("polit");
            }
            if (v === "PHILOSOPHY") {
              return prof === "philosopher" || role.includes("philosoph") || role.includes("filosof");
            }
            if (v === "SCIENCE") {
              return prof === "scientist" || role.includes("scien") || role.includes("științ") || role.includes("stiint");
            }
            if (v === "SPORTS") {
              return prof === "sportiv" || role.includes("sport");
            }
            if (v === "BUSINESS") {
              return prof === "entrepreneur" || role.includes("business") || role.includes("afaceri");
            }
            if (v === "RELIGION") {
              return prof === "religious" || role.includes("religio") || role.includes("religie");
            }
            if (v === "MYTHOLOGY") {
              return prof === "mythology" || role.includes("mytholog") || role.includes("mitolog");
            }
            return false;
          }
          return false;
        });
      });
    }

    // 4. Sorting: A-Z, Z-A, Match
    if (activeSort === "similarity" && hasUserScores) {
      filtered.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
    } else if (activeSort === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // default A-Z (name_asc, name)
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Generate Cards HTML
    const cardsHtml = filtered.map(fig => {
      const figColors = getMbtiTileColors(fig.mbti);
      const temp = getTypeTemperament(fig.mbti);
      const cleanRole = getFigureRole(fig, lang);
      const stack = MBTI_TYPES[fig.mbti]?.stack || [];

      return `
        <div class="figure-dir-card" data-id="${fig.id}" style="background: ${figColors.bg}; color: #ffffff;" role="button" tabindex="0" aria-label="${fig.name} · ${fig.mbti}">
          <div class="figure-dir-card-top">
            <span class="figure-dir-badge">${fig.mbti}</span>
            ${fig.similarity !== null ? `
              <span class="figure-dir-match">${fig.similarity}% ${lang === 'ro' ? 'compatibilitate' : 'match'}</span>
            ` : `
              <span class="figure-dir-temp">${temp.name}</span>
            `}
          </div>

          <div class="figure-dir-photo-wrap">
            ${fig.photo ? `
              <img class="figure-dir-photo" src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="figure-dir-fallback" style="display:none; background: rgba(0,0,0,0.22); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
            ` : `
              <div class="figure-dir-fallback" style="background: rgba(0,0,0,0.22); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
            `}
          </div>

          <div class="figure-dir-content">
            <h3 class="figure-dir-name">${fig.name}</h3>
            <div class="figure-dir-role">${cleanRole}</div>
          </div>

          <div class="figure-dir-stack">
            ${stack.map(st => {
              const fColor = getFuncTileColors(st).bg;
              return `<span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;">${st}</span>`;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");

    this.root.innerHTML = `
      <div class="e-app">
        ${this.renderNavbar()}
        <main class="e-main">
          <div class="figures-dir-container">
            <!-- Controls Box (Hero eliminated per user request) -->
            <section class="figures-dir-controls">
              <!-- Search Bar: No text, no emoji, only search symbol -->
              <div class="figures-search-box">
                <svg class="figures-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  id="figures-dir-search-input" 
                  class="figures-dir-search-input" 
                  value="${this.figuresDirSearch || ''}" 
                  placeholder="" 
                  autocomplete="off" 
                />
                ${this.figuresDirSearch ? `
                  <button class="figures-search-clear" type="button" id="figures-search-clear-btn" aria-label="Clear search">✕</button>
                ` : ''}
              </div>

              <!-- Quick Filter Section (All Caps, Multi-Select: TYPES, FUNCTIONS, AXES, TEMPERAMENTS, CATEGORY) -->
              <div class="figures-quick-filters">
                <div class="figures-qf-header">
                  <span class="figures-qf-title">${lang === 'ro' ? 'FILTRE RAPIDE' : 'QUICK FILTER'}</span>
                  ${(this.figuresSelectedFilters && this.figuresSelectedFilters.size > 0) ? `
                    <button class="figures-qf-clear-btn" type="button" id="figures-qf-clear">
                      ✕ ${lang === 'ro' ? 'RESETEAZĂ FILTRELE' : 'CLEAR FILTERS'} (${this.figuresSelectedFilters.size})
                    </button>
                  ` : ''}
                </div>

                <!-- Row 1: Types (16) -->
                <div class="figures-qf-row">
                  <span class="figures-qf-label">TYPES:</span>
                  <div class="figures-qf-chips">
                    ${[
                      "ENTJ", "INTJ", "ENTP", "INTP", 
                      "ENFJ", "INFJ", "ENFP", "INFP", 
                      "ESTJ", "ISTJ", "ESFJ", "ISFJ", 
                      "ESTP", "ISTP", "ESFP", "ISFP"
                    ].map(type => {
                      const isChipActive = this.figuresSelectedFilters && this.figuresSelectedFilters.has(`type:${type}`);
                      return `
                        <button 
                          class="figures-qf-chip ${isChipActive ? 'active' : ''}" 
                          type="button" 
                          data-category="type" 
                          data-value="${type}"
                        >
                          ${type}
                        </button>
                      `;
                    }).join("")}
                  </div>
                </div>

                <!-- Row 2: Functions (8) -->
                <div class="figures-qf-row">
                  <span class="figures-qf-label">FUNCTIONS:</span>
                  <div class="figures-qf-chips">
                    ${["NE", "NI", "SE", "SI", "TE", "TI", "FE", "FI"].map(fn => {
                      const isChipActive = this.figuresSelectedFilters && this.figuresSelectedFilters.has(`function:${fn}`);
                      return `
                        <button 
                          class="figures-qf-chip ${isChipActive ? 'active' : ''}" 
                          type="button" 
                          data-category="function" 
                          data-value="${fn}"
                        >
                          ${fn}
                        </button>
                      `;
                    }).join("")}
                  </div>
                </div>

                <!-- Row 3: Axes (8) -->
                <div class="figures-qf-row">
                  <span class="figures-qf-label">AXES:</span>
                  <div class="figures-qf-chips">
                    ${["E", "I", "N", "S", "T", "F", "P", "J"].map(ax => {
                      const isChipActive = this.figuresSelectedFilters && this.figuresSelectedFilters.has(`axis:${ax}`);
                      return `
                        <button 
                          class="figures-qf-chip ${isChipActive ? 'active' : ''}" 
                          type="button" 
                          data-category="axis" 
                          data-value="${ax}"
                        >
                          ${ax}
                        </button>
                      `;
                    }).join("")}
                  </div>
                </div>

                <!-- Row 4: Temperaments (8) -->
                <div class="figures-qf-row">
                  <span class="figures-qf-label">TEMPERAMENTS:</span>
                  <div class="figures-qf-chips">
                    ${["NT", "NF", "ST", "SF", "EJ", "EP", "IJ", "IP"].map(temp => {
                      const isChipActive = this.figuresSelectedFilters && this.figuresSelectedFilters.has(`temperament:${temp}`);
                      return `
                        <button 
                          class="figures-qf-chip ${isChipActive ? 'active' : ''}" 
                          type="button" 
                          data-category="temperament" 
                          data-value="${temp}"
                        >
                          ${temp}
                        </button>
                      `;
                    }).join("")}
                  </div>
                </div>

                <!-- Row 5: Category (8) -->
                <div class="figures-qf-row">
                  <span class="figures-qf-label">CATEGORY:</span>
                  <div class="figures-qf-chips">
                    ${[
                      "ARTIST", "POLITICS", "PHILOSOPHY", "SCIENCE", 
                      "SPORTS", "BUSINESS", "RELIGION", "MYTHOLOGY"
                    ].map(cat => {
                      const isChipActive = this.figuresSelectedFilters && this.figuresSelectedFilters.has(`category:${cat}`);
                      return `
                        <button 
                          class="figures-qf-chip ${isChipActive ? 'active' : ''}" 
                          type="button" 
                          data-category="category" 
                          data-value="${cat}"
                        >
                          ${cat}
                        </button>
                      `;
                    }).join("")}
                  </div>
                </div>
              </div>

              <!-- Count & Sort Row: A-Z, Z-A, Match -->
              <div class="figures-dir-status-row">
                <span class="figures-dir-count">
                  ${t('showingFiguresCount', { count: filtered.length, total: NOTABLE_FIGURES.length }, lang)}
                </span>
                <div class="figures-dir-sort-wrap">
                  <span class="figures-sort-label">${lang === 'ro' ? 'Sortează:' : 'Sort by:'}</span>
                  <button class="figures-sort-btn ${activeSort === 'name_asc' || activeSort === 'name' ? 'active' : ''}" type="button" data-sort="name_asc">
                    A-Z
                  </button>
                  <button class="figures-sort-btn ${activeSort === 'name_desc' ? 'active' : ''}" type="button" data-sort="name_desc">
                    Z-A
                  </button>
                  ${hasUserScores ? `
                    <button class="figures-sort-btn ${activeSort === 'similarity' ? 'active' : ''}" type="button" data-sort="similarity">
                      Match
                    </button>
                  ` : `
                    <button class="figures-sort-btn disabled" type="button" title="${lang === 'ro' ? 'Fă testul pentru a sorta după Match' : 'Take test to sort by Match'}" style="opacity: 0.5; cursor: not-allowed;" disabled>
                      Match
                    </button>
                  `}
                </div>
              </div>
            </section>

            <!-- Cards Grid or Empty State -->
            ${filtered.length > 0 ? `
              <div class="figures-dir-grid">
                ${cardsHtml}
              </div>
            ` : `
              <div class="figures-empty-state">
                <div class="figures-empty-icon">🔍</div>
                <h3>${t('noFiguresFound', { query: this.figuresDirSearch || '' }, lang)}</h3>
                <p>${lang === 'ro' ? 'Încearcă să cauți alt nume sau resetează filtrele de căutare.' : 'Try searching for another name or reset the search filters.'}</p>
                <button class="e-btn e-btn-outline" type="button" id="figures-reset-filters-btn">
                  ${t('resetFilters', {}, lang)}
                </button>
              </div>
            `}
          </div>
        </main>
      </div>

      <!-- Figure Detail Inspector Modal -->
      <div class="modal-overlay" id="figure-detail-modal" role="dialog" aria-modal="true" aria-labelledby="fig-modal-title">
        <div class="modal-content fig-modal-content">
          <!-- Filled dynamically when clicked -->
        </div>
      </div>
    `;

    this.attachNavEvents();
    this.attachFiguresDirectoryEvents(hasUserScores);
  }

  attachFiguresDirectoryEvents(hasUserScores) {
    const searchInput = document.getElementById("figures-dir-search-input");
    const clearBtn = document.getElementById("figures-search-clear-btn");
    const resetBtn = document.getElementById("figures-reset-filters-btn");

    if (searchInput) {
      if (this.figuresDirSearch) {
        searchInput.focus();
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
      }

      searchInput.addEventListener("input", (e) => {
        this.figuresDirSearch = e.target.value;
        this.renderFiguresDirectory();
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.figuresDirSearch = "";
          this.renderFiguresDirectory();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.figuresDirSearch = "";
        this.renderFiguresDirectory();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.figuresDirSearch = "";
        if (this.figuresSelectedFilters) this.figuresSelectedFilters.clear();
        this.figuresDirSort = hasUserScores ? "similarity" : "name_asc";
        this.renderFiguresDirectory();
      });
    }

    const qfClearBtn = document.getElementById("figures-qf-clear");
    if (qfClearBtn) {
      qfClearBtn.addEventListener("click", () => {
        if (this.figuresSelectedFilters) this.figuresSelectedFilters.clear();
        this.renderFiguresDirectory();
      });
    }

    // Quick filter chips click handler (multi-select union)
    document.querySelectorAll(".figures-qf-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const cat = chip.getAttribute("data-category");
        const val = chip.getAttribute("data-value");
        const key = `${cat}:${val}`;
        if (!this.figuresSelectedFilters) {
          this.figuresSelectedFilters = new Set();
        }
        if (this.figuresSelectedFilters.has(key)) {
          this.figuresSelectedFilters.delete(key);
        } else {
          this.figuresSelectedFilters.add(key);
        }
        this.renderFiguresDirectory();
      });
    });

    // Sort buttons: A-Z, Z-A, Match
    document.querySelectorAll(".figures-sort-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled || btn.classList.contains("disabled")) return;
        this.figuresDirSort = btn.getAttribute("data-sort");
        this.renderFiguresDirectory();
      });
    });

    // Click card to open Figure Detail Modal
    document.querySelectorAll(".figure-dir-card").forEach(card => {
      const handleOpen = () => {
        const id = card.getAttribute("data-id");
        this.openFigureDetailModal(id, hasUserScores);
      };
      card.addEventListener("click", handleOpen);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      });
    });

    // Modal click outside to close
    const modal = document.getElementById("figure-detail-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }
  }

  openFigureDetailModal(figureId, hasUserScores) {
    let fig = NOTABLE_FIGURES.find(f => f.id === figureId);
    if (!fig && figureId === "custom_person" && this.customComparisonPerson) {
      fig = this.customComparisonPerson;
    }
    if (!fig) return;

    const lang = this.state.lang || "ro";
    let modal = document.getElementById("figure-detail-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal-overlay";
      modal.id = "figure-detail-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "fig-modal-title");
      modal.innerHTML = `<div class="modal-content fig-modal-content"></div>`;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }

    const modalContent = modal.querySelector(".modal-content");
    if (!modalContent) return;

    const temp = getTypeTemperament(fig.mbti);
    const figColors = getMbtiTileColors(fig.mbti);
    const cleanRole = getFigureRole(fig, lang);
    const mbtiData = MBTI_TYPES[fig.mbti] || {};
    const stack = mbtiData.stack || [];

    // Calculate similarity if user has scores (from URL, state, or localStorage)
    let userPercentages = null;
    let userAxisScores = null;
    let simPct = null;
    if (this.state.urlResultsScores) {
      userPercentages = this.state.urlResultsScores.percentages;
      userAxisScores = this.state.urlResultsScores.axisScores;
      simPct = calculateFigureSimilarity(userPercentages, userAxisScores, fig);
    } else if (this.state.lastUserResults) {
      userPercentages = this.state.lastUserResults.percentages;
      userAxisScores = this.state.lastUserResults.axisScores;
      simPct = calculateFigureSimilarity(userPercentages, userAxisScores, fig);
    } else {
      try {
        const saved = localStorage.getItem('8func_last_user_results');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.percentages && parsed.axisScores) {
            userPercentages = parsed.percentages;
            userAxisScores = parsed.axisScores;
            simPct = calculateFigureSimilarity(userPercentages, userAxisScores, fig);
          }
        }
      } catch (e) {}
    }
    if (simPct === null) {
      const { percentages, axisScores, isComplete } = calculateScores(this.state.questions, this.state.answers);
      if (isComplete && Object.keys(this.state.answers).length >= this.state.questions.length) {
        userPercentages = percentages;
        userAxisScores = axisScores;
        simPct = calculateFigureSimilarity(userPercentages, userAxisScores, fig);
      }
    }

    // Axes values & dynamic colors matching Mind & Nature
    const figE = fig.axes?.E ?? (fig.mbti.startsWith("E") ? 75 : 25);
    const figI = fig.axes?.I ?? (fig.mbti.startsWith("I") ? 75 : 25);
    const figN = fig.axes?.N ?? (fig.mbti.includes("N") ? 75 : 25);
    const figS = fig.axes?.S ?? (fig.mbti.includes("S") ? 75 : 25);
    const figT = fig.axes?.T ?? (fig.mbti.includes("T") ? 75 : 25);
    const figF = fig.axes?.F ?? (fig.mbti.includes("F") ? 75 : 25);
    const figJ = fig.axes?.J ?? (fig.mbti.endsWith("J") ? 75 : 25);
    const figP = fig.axes?.P ?? (fig.mbti.endsWith("P") ? 75 : 25);

    const figMindColor = figN >= figS ? "#95637e" : "#e5c727";
    const figNatureColor = figT >= figF ? "#72cccd" : "#9ac262";
    const sharedBlue = "#395296";

    const axesList = [
      {
        id: "EI",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftName: lang === "ro" ? "Extraversie" : "Extraversion",
        rightName: lang === "ro" ? "Introversie" : "Introversion",
        leftVal: figE,
        rightVal: figI,
        pos: Math.max(7, Math.min(93, figI)),
        color: sharedBlue
      },
      {
        id: "NS",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftName: lang === "ro" ? "Intuiție" : "Intuition",
        rightName: lang === "ro" ? "Senzorial" : "Sensing",
        leftVal: figN,
        rightVal: figS,
        pos: Math.max(7, Math.min(93, figS)),
        color: figMindColor
      },
      {
        id: "TF",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftName: lang === "ro" ? "Gândire" : "Thinking",
        rightName: lang === "ro" ? "Sentiment" : "Feeling",
        leftVal: figT,
        rightVal: figF,
        pos: Math.max(7, Math.min(93, figF)),
        color: figNatureColor
      },
      {
        id: "JP",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftName: lang === "ro" ? "Judecată" : "Judging",
        rightName: lang === "ro" ? "Percepție" : "Perceiving",
        leftVal: figJ,
        rightVal: figP,
        pos: Math.max(7, Math.min(93, figP)),
        color: sharedBlue
      }
    ];

    modalContent.innerHTML = `
      <div class="fig-modal-header" style="background: ${figColors.bg}; color: #ffffff;">
        <button class="modal-close" type="button" id="fig-modal-close-btn" aria-label="Close" style="color: #ffffff; background: rgba(0,0,0,0.25);">✕</button>
        <div class="fig-modal-profile">
          <div class="fig-modal-photo-wrap">
            ${fig.photo ? `
              <img class="fig-modal-photo" src="${fig.photo}" alt="${fig.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="fig-modal-avatar-fallback" style="display:none; background: rgba(0,0,0,0.3); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
            ` : `
              <div class="fig-modal-avatar-fallback" style="background: rgba(0,0,0,0.3); color: #ffffff;">${fig.avatar || fig.name.charAt(0)}</div>
            `}
          </div>
          <div class="fig-modal-profile-text">
            <div class="fig-modal-tags">
              <span class="fig-modal-mbti-tag">${fig.mbti}</span>
              <span class="fig-modal-temp-tag">${temp.name}</span>
              ${simPct !== null ? `<span class="fig-modal-sim-tag">${simPct}% ${lang === 'ro' ? 'compatibilitate' : 'match'}</span>` : ''}
            </div>
            <h2 class="fig-modal-name" id="fig-modal-title">${fig.name}</h2>
            <div class="fig-modal-role">${cleanRole}</div>
          </div>
        </div>
      </div>

      <div class="fig-modal-body">
        <!-- 4 Spectrum Axes -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? '4 Axe' : '4 Axis'}</h4>
          <div class="fig-modal-axes-grid">
            ${axesList.map(ax => `
              <div class="fig-modal-axis-card">
                <div class="fig-modal-axis-head">
                  <span class="fig-modal-axis-name">${ax.name}</span>
                </div>
                <div class="fig-modal-axis-track">
                  <div class="fig-modal-axis-midpoint"></div>
                  <div class="fig-modal-axis-dot" style="left: ${ax.pos}%; background: ${ax.color};" title="${ax.rightVal >= ax.leftVal ? ax.rightName + ' ' + ax.rightVal + '%' : ax.leftName + ' ' + ax.leftVal + '%'}"></div>
                </div>
                <div class="fig-modal-axis-labels">
                  <span class="fig-modal-axis-lbl ${ax.leftVal >= ax.rightVal ? 'active-pole' : ''}">${ax.leftName} <b>${ax.leftVal}%</b></span>
                  <span class="fig-modal-axis-lbl ${ax.rightVal > ax.leftVal ? 'active-pole' : ''}"><b>${ax.rightVal}%</b> ${ax.rightName}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 8 Cognitive Functions Breakdown -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">8 Cognitive</h4>
          <div class="fig-modal-funcs-grid">
            ${FUNCTIONS_LIST.map(f => {
              const fPct = fig.scores?.[f] ?? 50;
              const fColor = getFuncTileColors(f).bg;
              const isDominant = stack[0] === f;
              const isAuxiliary = stack[1] === f;
              const badgeLabel = isDominant ? (lang === 'ro' ? 'Dominantă' : 'Dominant') : (isAuxiliary ? (lang === 'ro' ? 'Auxiliară' : 'Auxiliary') : '');
              return `
                <div class="fig-modal-func-item">
                  <div class="fig-modal-func-top">
                    <span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;">${f}</span>
                    ${badgeLabel ? `<span class="fig-modal-func-badge">${badgeLabel}</span>` : ''}
                    <span class="fig-modal-func-pct"><b>${fPct}%</b></span>
                  </div>
                  <div class="fig-modal-func-track">
                    <div class="fig-modal-func-fill" style="width: ${fPct}%; background: ${fColor};"></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");

    const closeHeaderBtn = document.getElementById("fig-modal-close-btn");
    if (closeHeaderBtn) {
      closeHeaderBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
