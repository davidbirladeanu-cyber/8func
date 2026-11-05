/**
 * 8Func - Application Controller & View Renderer
 * 12Axes Authentic Spectrum Architecture: NE-SI, NI-SE, TE-FI, TI-FE
 */

import { AppState } from "./state.js";
import { COGNITIVE_FUNCTIONS, FUNCTIONS_LIST } from "../data/functions.js";
import { TEST_MODES, getQuestionText, ALL_QUESTIONS, getQuestionsForMode } from "../data/questions.js";
import { ANSWER_OPTIONS, ANSWER_VALUE_MAP, getAnswerOptions, calculateScores, calculateQuestionImpact, buildResultsUrlPath, buildCompareUrlPath, parseCompareUrlPath, buildVectorString, parseComparisonInputLink } from "./scoring.js";
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

// 24 Question Categories across 8 Single Poles, 8 Cognitive Functions, 4 Lifestyle, and 4 Temperament Pairs
export const EDIT_SECTIONS = [
  // 1. MBTI Single Poles (8)
  { id: "E", name: "Extraversion", nameRo: "Extraversion", tag: "Extraversion", tagRo: "Extraversion", color: "#963939", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
  { id: "I", name: "Introversion", nameRo: "Introversion", tag: "Introversion", tagRo: "Introversion", color: "#395296", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3.5"/></svg>` },
  { id: "N", name: "Intuition", nameRo: "Intuition", tag: "Intuition", tagRo: "Intuition", color: "#95637e", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>` },
  { id: "S", name: "Sensing", nameRo: "Sensing", tag: "Sensing", tagRo: "Sensing", color: "#e5c727", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>` },
  { id: "T", name: "Thinking", nameRo: "Thinking", tag: "Thinking", tagRo: "Thinking", color: "#72cccd", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>` },
  { id: "F", name: "Feeling", nameRo: "Feeling", tag: "Feeling", tagRo: "Feeling", color: "#9ac262", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>` },
  { id: "J", name: "Judging", nameRo: "Judging", tag: "Judging", tagRo: "Judging", color: "#32d3a0", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { id: "P", name: "Perceiving", nameRo: "Perceiving", tag: "Perceiving", tagRo: "Perceiving", color: "#e59b27", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },

  // 2. Cognitive Functions (8)
  { id: "Ne", name: "Ideation", nameRo: "Ideation", tag: "Ideation", tagRo: "Ideation", color: "#95637e", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` },
  { id: "Ni", name: "Synthesis", nameRo: "Synthesis", tag: "Synthesis", tagRo: "Synthesis", color: "#95637e", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>` },
  { id: "Se", name: "Action", nameRo: "Action", tag: "Action", tagRo: "Action", color: "#e5c727", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
  { id: "Si", name: "Memory", nameRo: "Memory", tag: "Memory", tagRo: "Memory", color: "#e5c727", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id: "Te", name: "Structure", nameRo: "Structure", tag: "Structure", tagRo: "Structure", color: "#72cccd", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>` },
  { id: "Ti", name: "Precision", nameRo: "Precision", tag: "Precision", tagRo: "Precision", color: "#72cccd", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
  { id: "Fe", name: "Harmony", nameRo: "Harmony", tag: "Harmony", tagRo: "Harmony", color: "#9ac262", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  { id: "Fi", name: "Values", nameRo: "Values", tag: "Values", tagRo: "Values", color: "#9ac262", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>` },

  // 3. Lifestyle / Energy Combinations (4)
  { id: "EJ", name: "Executive", nameRo: "Executive", tag: "Executive", tagRo: "Executive", color: "#963939", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></svg>` },
  { id: "EP", name: "Explorer", nameRo: "Explorer", tag: "Explorer", tagRo: "Explorer", color: "#963939", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>` },
  { id: "IJ", name: "Conserver", nameRo: "Conserver", tag: "Conserver", tagRo: "Conserver", color: "#395296", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>` },
  { id: "IP", name: "Inquirer", nameRo: "Inquirer", tag: "Inquirer", tagRo: "Inquirer", color: "#395296", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>` },

  // 4. Temperament Combinations (4)
  { id: "NT", name: "Rational", nameRo: "Rational", tag: "Rational", tagRo: "Rational", color: "#95637e", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12m-6-6h12"/></svg>` },
  { id: "NF", name: "Idealist", nameRo: "Idealist", tag: "Idealist", tagRo: "Idealist", color: "#9ac262", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` },
  { id: "ST", name: "Realist", nameRo: "Realist", tag: "Realist", tagRo: "Realist", color: "#72cccd", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>` },
  { id: "SF", name: "Social", nameRo: "Social", tag: "Social", tagRo: "Social", color: "#e5c727", icon: `<svg class="e-ico e-edit-axis-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>` }
];

export const getQuestionCategory = (q) => {
  return q.target || q.agreementPole || (q.options && q.options[0]?.pole) || q.dimension || "Ne";
};

export const getQuestionGroupDef = (q) => {
  const cat = getQuestionCategory(q);
  return EDIT_SECTIONS.find(s => s.id === cat) || { id: cat, name: cat, nameRo: cat, tag: cat, tagRo: cat, color: "#282828", icon: "" };
};

export const getQuestionTagLabel = (groupDef, lang = "ro") => {
  if (!groupDef) return "";
  const raw = groupDef.tag || groupDef.name || groupDef.id;
  return String(raw).replace(/^(ne|ni|se|si|te|ti|fe|fi|ej|ep|ij|ip|nt|nf|st|sf)\s*[-·:]\s*/i, "").toUpperCase();
};

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
      if (this.state.compareParsed) {
        const cp = this.state.compareParsed;
        if (cp.personA) {
          const aName = cp.personA.name || (this.state.lang === "ro" ? "Tu" : "You");
          this.comparisonPersonA_Name = aName;
          this.comparisonPersonA = {
            name: aName,
            percentages: cp.personA.percentages,
            axisScores: cp.personA.axisScores,
            derivedType: cp.personA.derivedType,
            temperament: getTypeTemperament(cp.personA.derivedType),
            archetype: MBTI_TYPES[cp.personA.derivedType] || MBTI_TYPES["INTJ"],
            link: window.location.href
          };
        }
        if (cp.personB) {
          const bName = cp.personB.name || (this.state.lang === "ro" ? "Persoană" : "Other");
          this.comparisonPersonB_Name = bName;
          const tempB = getTypeTemperament(cp.personB.derivedType);
          this.comparisonPersonB = {
            name: bName,
            percentages: cp.personB.percentages,
            axisScores: cp.personB.axisScores,
            derivedType: cp.personB.derivedType,
            temperament: tempB,
            archetype: MBTI_TYPES[cp.personB.derivedType] || MBTI_TYPES["ENFP"],
            link: window.location.href
          };
          this.customComparisonPerson = {
            id: "custom_person",
            name: bName,
            mbti: cp.personB.derivedType,
            role: this.state.lang === "ro" ? "Rezultat comparat" : "Compared result",
            avatar: bName.charAt(0).toUpperCase() || "P",
            temperament: tempB,
            axes: {
              I: cp.personB.axisScores.EI.roundB,
              E: cp.personB.axisScores.EI.roundA,
              S: cp.personB.axisScores.NS.roundB,
              N: cp.personB.axisScores.NS.roundA,
              F: cp.personB.axisScores.TF.roundB,
              T: cp.personB.axisScores.TF.roundA,
              P: cp.personB.axisScores.JP.roundB,
              J: cp.personB.axisScores.JP.roundA
            },
            scores: cp.personB.percentages,
            percentages: cp.personB.percentages,
            axisScores: cp.personB.axisScores
          };
          this.selectedFigureId = "custom_person";
        }
        return;
      }

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
          this.comparisonPersonB = {
            name: bName,
            percentages: parsed.percentages,
            axisScores: parsed.axisScores,
            derivedType: parsed.derivedType,
            temperament: temp,
            archetype: MBTI_TYPES[parsed.derivedType] || MBTI_TYPES["ENFP"],
            link: bParam
          };
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

  showQuestionInfoModal(question, currentAnswers = null) {
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

    const answersToUse = currentAnswers || this.state.answers || {};
    const impact = calculateQuestionImpact(question, answersToUse, this.state.questions, lang);

    // Header with category pill and live impact pill
    modalTitle.innerHTML = `
      <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-strong); margin-bottom: 0.35rem;">
        ${lang === "ro" ? "Despre această întrebare" : "About this question"}
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
        <span class="info-pill info-pill-category">${categoryLabel}</span>
        ${impact ? `<span class="e-impact-pill ${impact.className}" title="${impact.tooltip}">${impact.text}</span>` : ''}
      </div>
    `;

    const description = (lang === "ro" && question.descriptionRo) ? question.descriptionRo : (question.description || "");

    const impactSectionHtml = impact ? `
      <div class="info-section">
        <h4>${lang === "ro" ? "Contribuție la scor:" : "Contribution to score:"}</h4>
        <div class="info-impact-card" style="background: var(--paper-warm); border: 1.5px solid var(--line); border-radius: 12px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="e-impact-pill ${impact.className}">${impact.text}</span>
            <strong style="font-size: 0.95rem; color: var(--text-strong);">${lang === "ro" ? "Scor curent:" : "Current score:"} ${impact.userTotal}% ${impact.target}</strong>
          </div>
          <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.4;">${impact.tooltip}</p>
        </div>
      </div>
    ` : '';

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
        ${impactSectionHtml}
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
        ${impactSectionHtml}
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

    const modalCloseBtn = modal.querySelector("#modal-close-btn");
    if (modalCloseBtn) {
      modalCloseBtn.onclick = () => this.closeModal();
    }
    const modalOkBtn = modal.querySelector("#modal-ok-btn");
    if (modalOkBtn) {
      modalOkBtn.textContent = lang === "ro" ? "Am înțeles" : "Understood";
      modalOkBtn.onclick = () => this.closeModal();
    }
    modal.onclick = (e) => {
      if (e.target === modal) this.closeModal();
    };

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
    const groupDef = getQuestionGroupDef(question);
    const tagLabel = getQuestionTagLabel(groupDef, lang);
    
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
                <div class="question-header-top">
                  <div class="question-axis-tag" style="--tag-color: ${groupDef.color};">
                    <i class="question-axis-tag-ico-wrap" aria-hidden="true">${groupDef.icon || ''}</i>
                    <span>${tagLabel}</span>
                  </div>
                  <button class="inline-axis-info e-axis-info" type="button" aria-label="${t('inspectQuestion', {}, lang)}" title="${t('infoClickHint', {}, lang)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </button>
                </div>
                <h2 id="question-title">${questionText}</h2>
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

    document.querySelectorAll(".e-axis-info, .question-axis-tag").forEach(btn => {
      btn.addEventListener("click", () => {
        this.showQuestionInfoModal(q);
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

    const personB = this.comparisonPersonB;
    const isComparing = Boolean(personB && personB.percentages && personB.axisScores);
    const personA = this.comparisonPersonA || {
      name: this.comparisonPersonA_Name || (lang === "ro" ? "Tu" : "You"),
      percentages,
      axisScores,
      derivedType
    };
    if (isComparing) {
      this.comparisonPersonA = personA;
    }

    const userA_Name = personA.name || (lang === "ro" ? "Tu" : "You");
    const userB_Name = personB ? (personB.name || (lang === "ro" ? "Persoană" : "Other")) : "";

    // Base URL & paths
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
      ? import.meta.env.BASE_URL
      : "/";
    const prefix = baseUrl.replace(/\/$/, "");

    // Update browser address bar
    if (isComparing) {
      const rawComparePath = buildCompareUrlPath(
        personA.name,
        personA.axisScores,
        personA.percentages,
        personB.name,
        personB.axisScores,
        personB.percentages
      );
      const fullComparePath = `${prefix}${rawComparePath}`;
      if (window.location.pathname !== fullComparePath) {
        history.replaceState(null, "", fullComparePath);
      }
    } else {
      const rawResultsPath = buildResultsUrlPath(axisScores, percentages);
      const fullResultsPath = `${prefix}${rawResultsPath}`;
      if (window.location.pathname !== fullResultsPath) {
        history.replaceState(null, "", fullResultsPath);
      }
    }

    const rawPersonAResultsPath = buildResultsUrlPath(personA.axisScores, personA.percentages);
    const origin = (typeof window !== "undefined" && window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file"))
      ? window.location.origin
      : "https://davidbirladeanu-cyber.github.io";
    const userFullResultUrl = `${origin}${prefix}${rawPersonAResultsPath}`;
    this.userFullResultUrl = userFullResultUrl;

    // Comparison Similarity / Match
    let compareMatchPct = 0;
    let compareRingDash = 0;
    if (isComparing) {
      const compareSimFigure = {
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
      compareMatchPct = calculateFigureSimilarity(personA.percentages, personA.axisScores, compareSimFigure);
      compareRingDash = Math.round((compareMatchPct / 100) * 389.6 * 10) / 10;
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
    if (isComparing && this.customComparisonPerson) {
      currentComparisonFigure = this.customComparisonPerson;
    } else if (this.selectedFigureId === "custom_person" && this.customComparisonPerson) {
      currentComparisonFigure = this.customComparisonPerson;
    } else {
      currentComparisonFigure = allFigures.find(f => f.id === this.selectedFigureId);
      if (!currentComparisonFigure) {
        currentComparisonFigure = similarFigures[0] || allFigures[0];
        this.selectedFigureId = currentComparisonFigure.id;
      }
    }

    // 4 Spectrum Coordinates (N sus, T dreapta, S jos, F stanga)
    const pN = personA.axisScores?.NS?.roundA ?? 50; // % N (Intuiție)
    const pS = personA.axisScores?.NS?.roundB ?? 50; // % S (Senzație)
    const pT = personA.axisScores?.TF?.roundA ?? 50; // % T (Gândire)
    const pF = personA.axisScores?.TF?.roundB ?? 50; // % F (Sentiment)
    const compassX = Math.max(8, Math.min(92, pT)); // F (stânga 0%) -> T (dreapta 100%)
    const compassY = Math.max(8, Math.min(92, 100 - pN)); // N (sus 0%) -> S (jos 100%)

    // Spectrum 2: Energy & Tactics (E sus, J dreapta, I jos, P stanga)
    const pE = personA.axisScores?.EI?.roundA ?? 50; // % E (Extraversie)
    const pI = personA.axisScores?.EI?.roundB ?? 50; // % I (Introversie)
    const pJ = personA.axisScores?.JP?.roundA ?? 50; // % J (Judecată)
    const pP = personA.axisScores?.JP?.roundB ?? 50; // % P (Percepție)
    const compass2X = Math.max(8, Math.min(92, pJ)); // P (stânga 0%) -> J (dreapta 100%)
    const compass2Y = Math.max(8, Math.min(92, 100 - pE)); // E (sus 0%) -> I (jos 100%)

    // Coordinates descriptions
    const s1Coords = `${pN >= pS ? pN + '% N' : pS + '% S'} · ${pT >= pF ? pT + '% T' : pF + '% F'}`;
    const s2Coords = `${pE >= pI ? pE + '% E' : pI + '% I'} · ${pJ >= pP ? pJ + '% J' : pP + '% P'}`;

    // Spectrum Coordinates for Person B
    let compassXB = null, compassYB = null, compass2XB = null, compass2YB = null;
    let s1CoordsB = "", s2CoordsB = "";
    if (isComparing) {
      const pNB = personB.axisScores?.NS?.roundA ?? 50;
      const pSB = personB.axisScores?.NS?.roundB ?? 50;
      const pTB = personB.axisScores?.TF?.roundA ?? 50;
      const pFB = personB.axisScores?.TF?.roundB ?? 50;
      compassXB = Math.max(8, Math.min(92, pTB));
      compassYB = Math.max(8, Math.min(92, 100 - pNB));

      const pEB = personB.axisScores?.EI?.roundA ?? 50;
      const pIB = personB.axisScores?.EI?.roundB ?? 50;
      const pJB = personB.axisScores?.JP?.roundA ?? 50;
      const pPB = personB.axisScores?.JP?.roundB ?? 50;
      compass2XB = Math.max(8, Math.min(92, pJB));
      compass2YB = Math.max(8, Math.min(92, 100 - pEB));

      s1CoordsB = `${pNB >= pSB ? pNB + '% N' : pSB + '% S'} · ${pTB >= pFB ? pTB + '% T' : pFB + '% F'}`;
      s2CoordsB = `${pEB >= pIB ? pEB + '% E' : pIB + '% I'} · ${pJ >= pP ? pJB + '% J' : pPB + '% P'}`;
    }

    // Quadrants for both Spectrums with new IE/PJ colors
    const s1QuadCode = (pN >= pS ? "N" : "S") + (pF >= pT ? "F" : "T");
    const s1QuadColors = { NF: "#9ac262", NT: "#95637e", SF: "#e5c727", ST: "#72cccd" };
    const activeS1 = { code: s1QuadCode, color: s1QuadColors[s1QuadCode] || "#95637e" };

    const s2QuadCode = (pE >= pI ? "E" : "I") + (pJ >= pP ? "J" : "P");
    const s2QuadColors = { EJ: "#963939", EP: "#e59b27", IJ: "#32d3a0", IP: "#395296" };
    const activeS2 = { code: s2QuadCode, color: s2QuadColors[s2QuadCode] || "#963939" };

    // ========================================================
    // 4 Axes Minimalist Layout with Colored Boxes (Energy & Tactics dynamic colors)
    // ========================================================
    const energyColor = axisScores.EI.roundA >= axisScores.EI.roundB ? "#963939" : "#395296";
    const mindColor = axisScores.NS.roundA >= axisScores.NS.roundB ? "#95637e" : "#e5c727";
    const natureColor = axisScores.TF.roundA >= axisScores.TF.roundB ? "#72cccd" : "#9ac262";
    const tacticsColor = axisScores.JP.roundA >= axisScores.JP.roundB ? "#32d3a0" : "#e59b27";

    const axesData = [
      {
        id: "energy",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftName: lang === "ro" ? "Extraversie" : "Extraversion",
        rightName: lang === "ro" ? "Introversie" : "Introversion",
        leftPctA: personA.axisScores.EI.roundA, // E
        rightPctA: personA.axisScores.EI.roundB, // I
        leftPctB: isComparing ? personB.axisScores.EI.roundA : null,
        rightPctB: isComparing ? personB.axisScores.EI.roundB : null,
        leftColor: "#963939",
        rightColor: "#395296",
        color: energyColor,
        posA: Math.max(5, Math.min(95, personA.axisScores.EI.roundB)),
        posB: isComparing ? Math.max(5, Math.min(95, personB.axisScores.EI.roundB)) : null
      },
      {
        id: "mind",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftName: lang === "ro" ? "Intuiție" : "Intuition",
        rightName: lang === "ro" ? "Senzorial" : "Sensing",
        leftPctA: personA.axisScores.NS.roundA, // N
        rightPctA: personA.axisScores.NS.roundB, // S
        leftPctB: isComparing ? personB.axisScores.NS.roundA : null,
        rightPctB: isComparing ? personB.axisScores.NS.roundB : null,
        leftColor: "#95637e",
        rightColor: "#e5c727",
        color: mindColor,
        posA: Math.max(5, Math.min(95, personA.axisScores.NS.roundB)),
        posB: isComparing ? Math.max(5, Math.min(95, personB.axisScores.NS.roundB)) : null
      },
      {
        id: "nature",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftName: lang === "ro" ? "Gândire" : "Thinking",
        rightName: lang === "ro" ? "Sentiment" : "Feeling",
        leftPctA: personA.axisScores.TF.roundA, // T
        rightPctA: personA.axisScores.TF.roundB, // F
        leftPctB: isComparing ? personB.axisScores.TF.roundA : null,
        rightPctB: isComparing ? personB.axisScores.TF.roundB : null,
        leftColor: "#72cccd",
        rightColor: "#9ac262",
        color: natureColor,
        posA: Math.max(5, Math.min(95, personA.axisScores.TF.roundB)),
        posB: isComparing ? Math.max(5, Math.min(95, personB.axisScores.TF.roundB)) : null
      },
      {
        id: "tactics",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftName: lang === "ro" ? "Judecată" : "Judging",
        rightName: lang === "ro" ? "Percepție" : "Perceiving",
        leftPctA: personA.axisScores.JP.roundA, // J
        rightPctA: personA.axisScores.JP.roundB, // P
        leftPctB: isComparing ? personB.axisScores.JP.roundA : null,
        rightPctB: isComparing ? personB.axisScores.JP.roundB : null,
        leftColor: "#32d3a0",
        rightColor: "#e59b27",
        color: tacticsColor,
        posA: Math.max(5, Math.min(95, personA.axisScores.JP.roundB)),
        posB: isComparing ? Math.max(5, Math.min(95, personB.axisScores.JP.roundB)) : null
      }
    ];

    const mbtiAxesRowsHtml = axesData.map(ax => {
      return `
        <div class="minimal-axis-card" style="background: ${ax.color}; color: #ffffff;">
          <div class="minimal-axis-top">
            <span class="minimal-axis-title">${ax.name}</span>
          </div>
          <div class="minimal-axis-track">
            <div class="minimal-axis-center-line" aria-hidden="true"></div>
            <div class="minimal-axis-thumb dot-user" style="left: ${ax.posA}%;" title="${userA_Name}: ${ax.rightPctA}%"></div>
            ${isComparing ? `
              <div class="minimal-axis-thumb dot-other" style="left: ${ax.posB}%;" title="${userB_Name}: ${ax.rightPctB}%"></div>
            ` : ''}
          </div>
          <div class="minimal-axis-labels">
            ${isComparing ? `
              <span class="axis-lbl-left">${ax.leftName} ⚪ ${ax.leftPctA}% <span style="color: #60a5fa; font-weight: 700;">🔵 ${ax.leftPctB}%</span></span>
              <span class="axis-lbl-right">⚪ ${ax.rightPctA}% <span style="color: #60a5fa; font-weight: 700;">🔵 ${ax.rightPctB}%</span> ${ax.rightName}</span>
            ` : `
              <span class="axis-lbl-left">${ax.leftName} ${ax.leftPctA}%</span>
              <span class="axis-lbl-right">${ax.rightPctA}% ${ax.rightName}</span>
            `}
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
    const displayFigName = isCustomPerson ? (userB_Name || this.customComparisonPerson.name) : currentComparisonFigure.name;

    const compAxesData = [
      {
        id: "energy",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftColor: "#963939",
        rightColor: "#395296",
        color: energyColor,
        leftLabel: lang === "ro" ? "Extraversie" : "Extraversion",
        rightLabel: lang === "ro" ? "Introversie" : "Introversion",
        uPos: Math.max(5, Math.min(95, axisScores.EI.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.I : (currentComparisonFigure.mbti.includes("I") ? 75 : 25))),
        uPct: axisScores.EI.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.I : (currentComparisonFigure.mbti.includes("I") ? 75 : 25)
      },
      {
        id: "mind",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftColor: "#95637e",
        rightColor: "#e5c727",
        color: mindColor,
        leftLabel: lang === "ro" ? "Intuiție" : "Intuition",
        rightLabel: lang === "ro" ? "Senzorial" : "Sensing",
        uPos: Math.max(5, Math.min(95, axisScores.NS.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.S : (currentComparisonFigure.mbti.includes("S") ? 75 : 25))),
        uPct: axisScores.NS.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.S : (currentComparisonFigure.mbti.includes("S") ? 75 : 25)
      },
      {
        id: "nature",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftColor: "#72cccd",
        rightColor: "#9ac262",
        color: natureColor,
        leftLabel: lang === "ro" ? "Gândire" : "Thinking",
        rightLabel: lang === "ro" ? "Sentiment" : "Feeling",
        uPos: Math.max(5, Math.min(95, axisScores.TF.roundB)),
        fPos: Math.max(5, Math.min(95, currentComparisonFigure.axes ? currentComparisonFigure.axes.F : (currentComparisonFigure.mbti.includes("F") ? 75 : 25))),
        uPct: axisScores.TF.roundB,
        fPct: currentComparisonFigure.axes ? currentComparisonFigure.axes.F : (currentComparisonFigure.mbti.includes("F") ? 75 : 25)
      },
      {
        id: "tactics",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftColor: "#32d3a0",
        rightColor: "#e59b27",
        color: tacticsColor,
        leftLabel: lang === "ro" ? "Judecată" : "Judging",
        rightLabel: lang === "ro" ? "Percepție" : "Perceiving",
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
            <div class="comp-v2-center-line" aria-hidden="true"></div>
            <!-- White Dot (User: "punctele necolorate albe esti tu") -->
            <div class="comp-v2-dot-user" style="left: ${ax.uPos}%;" title="${userA_Name}: ${ax.uPct}%"></div>
            <!-- Colored Dot (Figure or Person B) -->
            <div class="comp-v2-dot-fig" style="left: ${ax.fPos}%; border-color: rgba(255,255,255,0.6);" title="${displayFigName}: ${ax.fPct}%">
              ${currentComparisonFigure.photo ? `
                <img src="${currentComparisonFigure.photo}" alt="${displayFigName}" />
              ` : `
                <span>${currentComparisonFigure.avatar || displayFigName.charAt(0)}</span>
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

    // 8 Cognitive Functions Order & Custom Titles
    const FUNCTIONS_ORDER = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];
    const FUNCTION_TITLES = {
      Ne: { en: "IDEATION", ro: "IDEATION" },
      Ni: { en: "SYNTHESIS", ro: "SYNTHESIS" },
      Se: { en: "ACTION", ro: "ACTION" },
      Si: { en: "MEMORY", ro: "MEMORY" },
      Te: { en: "STRUCTURE", ro: "STRUCTURE" },
      Ti: { en: "PRECISION", ro: "PRECISION" },
      Fe: { en: "HARMONY", ro: "HARMONY" },
      Fi: { en: "VALUES", ro: "VALUES" }
    };

    const compFuncsAxesData = FUNCTIONS_ORDER.map(f => {
      const fnInfo = COGNITIVE_FUNCTIONS[f] || {};
      const customTitle = FUNCTION_TITLES[f] ? FUNCTION_TITLES[f].en : f;
      const fFullName = fnInfo.name || f;
      const fColor = getFuncTileColors(f).bg;
      const uPct = percentages[f] ?? 50;
      const fPct = currentComparisonFigure.scores ? (currentComparisonFigure.scores[f] ?? 50) : 50;
      return {
        id: f,
        customTitle,
        fFullName,
        color: fColor,
        uPos: Math.max(5, Math.min(95, uPct)),
        fPos: Math.max(5, Math.min(95, fPct)),
        uPct,
        fPct
      };
    });

    const compFuncsAxesHtml = compFuncsAxesData.map(fn => {
      return `
        <div class="comp-v2-axis-card" style="background: ${fn.color}; color: #ffffff;">
          <div class="comp-v2-axis-title">
            <span>${fn.customTitle}</span>
          </div>
          <div class="comp-v2-track">
            <div class="comp-v2-center-line" aria-hidden="true"></div>
            <!-- White Dot (User) -->
            <div class="comp-v2-dot-user" style="left: ${fn.uPos}%;" title="${userA_Name}: ${fn.uPct}%"></div>
            <!-- Colored Dot (Figure or Person B) -->
            <div class="comp-v2-dot-fig" style="left: ${fn.fPos}%; border-color: rgba(255,255,255,0.6);" title="${displayFigName}: ${fn.fPct}%">
              ${currentComparisonFigure.photo ? `
                <img src="${currentComparisonFigure.photo}" alt="${displayFigName}" />
              ` : `
                <span>${currentComparisonFigure.avatar || displayFigName.charAt(0)}</span>
              `}
            </div>
          </div>
          <div class="comp-v2-labels">
            <span class="comp-v2-lbl-left">${fn.fFullName}</span>
            <span class="comp-v2-lbl-right"></span>
          </div>
        </div>
      `;
    }).join("");

    // 8 Functions for Results View (Image 2 style comp-v2-axes-grid)
    const userFuncsAxesHtml = FUNCTIONS_ORDER.map(f => {
      const fnInfo = COGNITIVE_FUNCTIONS[f] || {};
      const customTitle = FUNCTION_TITLES[f] ? FUNCTION_TITLES[f].en : f;
      const fFullName = fnInfo.name || f;
      const fColor = getFuncTileColors(f).bg;
      const pctA = personA.percentages[f] ?? 50;
      const posA = Math.max(5, Math.min(95, pctA));
      const pctB = isComparing ? (personB.percentages[f] ?? 50) : null;
      const posB = isComparing ? Math.max(5, Math.min(95, pctB)) : null;

      return `
        <div class="comp-v2-axis-card" style="background: ${fColor}; color: #ffffff;">
          <div class="comp-v2-axis-title">
            <span>${customTitle}</span>
          </div>
          <div class="comp-v2-track">
            <div class="comp-v2-center-line" aria-hidden="true"></div>
            <div class="comp-v2-dot-user" style="left: ${posA}%;" title="${userA_Name}: ${pctA}%"></div>
            ${isComparing ? `
              <div class="comp-v2-dot-user dot-other" style="left: ${posB}%;" title="${userB_Name}: ${pctB}%"></div>
            ` : ''}
          </div>
          <div class="comp-v2-labels">
            <span class="comp-v2-lbl-left">${fFullName}</span>
            ${isComparing ? `
              <span class="comp-v2-lbl-right">⚪ ${pctA}% · <span style="color: #60a5fa; font-weight: 700;">🔵 ${pctB}%</span></span>
            ` : `
              <span class="comp-v2-lbl-right">${pctA}%</span>
            `}
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
            ${isComparing ? `
              <article class="e-panel e-top" style="--c: #3b82f6; --cb: rgba(59, 130, 246, 0.1);">
                <div class="e-top-head">
                  <div class="e-top-title-group">
                    <span class="e-tag e-tag-hero" style="background: #3b82f6; color: #ffffff !important; border: none; border-radius: 999px;">
                      ${lang === "ro" ? "Comparație" : "Comparison"} · ${userA_Name} &times; ${userB_Name}
                    </span>
                    <h1 class="e-hero-title">${userA_Name} <span style="color: #ffffff;">(${personA.derivedType})</span> <span style="opacity: 0.5; font-weight: 400;">&times;</span> ${userB_Name} <span style="color: #60a5fa;">(${personB.derivedType})</span></h1>
                    <div class="resemble-stack hero-resemble-stack">
                      <span style="font-size: 0.75rem; font-weight: 700; color: #ffffff; margin-right: 0.25rem;">⚪ ${userA_Name}:</span>
                      ${(topMbti.stack || []).map(st => {
                        const fInfo = COGNITIVE_FUNCTIONS[st];
                        const fTitle = lang === "ro" ? (fInfo?.nameRo || fInfo?.name || st) : (fInfo?.name || st);
                        const fColor = getFuncTileColors(st).bg;
                        return `<span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;" title="${fTitle}">${st}</span>`;
                      }).join("")}
                      <span style="font-size: 0.75rem; font-weight: 700; color: #60a5fa; margin-left: 0.5rem; margin-right: 0.25rem;">🔵 ${userB_Name}:</span>
                      ${((MBTI_TYPES[personB.derivedType] || {}).stack || []).map(st => {
                        const fInfo = COGNITIVE_FUNCTIONS[st];
                        const fTitle = lang === "ro" ? (fInfo?.nameRo || fInfo?.name || st) : (fInfo?.name || st);
                        const fColor = getFuncTileColors(st).bg;
                        return `<span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff; border: 1.5px solid #3b82f6;" title="${fTitle}">${st}</span>`;
                      }).join("")}
                    </div>
                  </div>
                  <div class="e-ring e-ring-lg" role="img" aria-label="Compatibility: ${compareMatchPct} percent">
                    <svg viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="62" fill="none" stroke="var(--line)" stroke-width="7"></circle>
                      <circle class="e-ring-arc" cx="70" cy="70" r="62" fill="none" stroke="#3b82f6" stroke-width="7" stroke-linecap="round" stroke-dasharray="${compareRingDash} 389.6"></circle>
                    </svg>
                    <div class="e-ring-content">
                      <strong style="color: #60a5fa;">${compareMatchPct}%</strong>
                      <small>MATCH</small>
                    </div>
                  </div>
                </div>

                <div class="e-top-body">
                  <div class="e-quote-container" style="border-left: 3.5px solid #3b82f6;">
                    <p class="e-quote-text">
                      ${lang === "ro" 
                        ? `Dinamica dintre ${userA_Name} (${personA.derivedType} — ${topMbti.titleRo || topMbti.title}) și ${userB_Name} (${personB.derivedType} — ${(MBTI_TYPES[personB.derivedType] || {}).titleRo || (MBTI_TYPES[personB.derivedType] || {}).title || personB.derivedType}) indică o compatibilitate și aliniere cognitivă de ${compareMatchPct}%.`
                        : `Cognitive dynamics between ${userA_Name} (${personA.derivedType} — ${topMbti.title}) and ${userB_Name} (${personB.derivedType} — ${(MBTI_TYPES[personB.derivedType] || {}).title || personB.derivedType}) reflect a ${compareMatchPct}% cognitive alignment.`}
                    </p>
                  </div>
                </div>
              </article>
            ` : `
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
            `}

            <!-- Cognitive Hierarchy (8 Squares) -->
            <section class="e-panel" id="cognitive-hierarchy">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Ierarhia Cognitivă" : "Cognitive Hierarchy"}</h2>
              </div>
              <div class="hierarchy-tiles-row">
                ${sortedFunctions.map((f, idx) => {
                  const numStr = `#${idx + 1}`;
                  const pctA = personA.percentages[f] ?? 50;
                  const pctB = isComparing ? (personB.percentages[f] ?? 50) : null;
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
                    <div class="hierarchy-tile-sq" style="--sq-bg: ${bg}; --sq-text: #ffffff; color: #ffffff;" title="${f} ${isComparing ? `(⚪ ${pctA}% · 🔵 ${pctB}%)` : `(${pctA}%)`}">
                      <span class="hierarchy-sq-num" style="color: #ffffff;">${numStr}</span>
                      <strong class="hierarchy-sq-code" style="color: #ffffff;">${f}</strong>
                      ${isComparing ? `
                        <span class="hierarchy-sq-score" style="color: #ffffff; font-size: 0.72rem;">⚪ ${pctA}% · <span style="color: #93c5fd; font-weight: 700;">🔵 ${pctB}%</span></span>
                      ` : `
                        <span class="hierarchy-sq-score" style="color: #ffffff;">${pctA}% score</span>
                      `}
                    </div>
                  `;
                }).join("")}
              </div>
            </section>

            <!-- 4 Axes Minimalist (Image 3) -->
            <section class="e-panel" id="mbti-axes">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "4 Axe" : "4 Axes"}</h2>
              </div>
              <div class="minimal-axes-grid">
                ${mbtiAxesRowsHtml}
              </div>
              <div class="e-axes-edit">
                <button class="e-axes-edit-btn" id="open-edit-answers-btn" type="button">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"></path></svg>
                  <span>${t('editAnswersBtn', {}, lang)}</span>
                </button>
              </div>
            </section>

            <!-- 8 Functions (Image 2 style comp-v2-axes-grid) -->
            <section class="e-panel" id="cognitive-functions-grid">
              <div class="e-sec-head" style="margin-bottom: 1.5rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "8 Funcții" : "8 Functions"}</h2>
              </div>
              <div class="comp-v2-axes-grid">
                ${userFuncsAxesHtml}
              </div>
            </section>

            <!-- Spectrum (Cross Compass: N/S + F/T on XY, E/I + J/P on YZ - all in one) -->
            <section class="e-panel spectrum-cross-panel" id="spectrum-compass">
              <div class="e-sec-head" style="margin-bottom: 2rem;">
                <h2 class="e-sec-title">${lang === "ro" ? "Spectru" : "Spectrum"}</h2>
              </div>

              <div class="spectrum-cross-wrap">
                <!-- Plane 1: Mind & Nature (N sus, T dreapta, S jos, F stanga) -->
                <div class="spectrum-cross-plane-wrap">
                  <div class="spectrum-cardinal-lbl spectrum-lbl-top">N</div>
                  <div class="spectrum-center-row">
                    <div class="spectrum-cardinal-lbl spectrum-lbl-left">F</div>
                    <div class="spectrum-quadrant-plane">
                      <div class="spectrum-quadrant quad-tl" title="NF · Ideation & Values"></div>
                      <div class="spectrum-quadrant quad-tr" title="NT · Ideation & Structure"></div>
                      <div class="spectrum-quadrant quad-bl" title="SF · Action & Values"></div>
                      <div class="spectrum-quadrant quad-br" title="ST · Action & Structure"></div>
                      <div class="spectrum-crosshair-h"></div>
                      <div class="spectrum-crosshair-v"></div>
                      <div class="spectrum-plot-dot" style="left: ${compassX}%; top: ${compassY}%;" title="${userA_Name} (${personA.derivedType}) — ${s1Coords}"></div>
                      ${isComparing ? `
                        <div class="spectrum-plot-dot dot-other" style="left: ${compassXB}%; top: ${compassYB}%;" title="${userB_Name} (${personB.derivedType}) — ${s1CoordsB}"></div>
                      ` : ''}
                    </div>
                    <div class="spectrum-cardinal-lbl spectrum-lbl-right">T</div>
                  </div>
                  <div class="spectrum-cardinal-lbl spectrum-lbl-bottom">S</div>
                  <div class="spectrum-bottom-bar" style="margin-top: 0.85rem;">
                    ${isComparing ? `
                      <span class="spectrum-coord-lbl">⚪ ${userA_Name}: ${s1Coords} &nbsp;|&nbsp; <span style="color: #60a5fa;">🔵 ${userB_Name}: ${s1CoordsB}</span></span>
                    ` : `
                      <span class="spectrum-coord-lbl">${s1Coords}</span>
                    `}
                  </div>
                </div>

                <!-- Plane 2: Energy & Tactics (E sus, J dreapta, I jos, P stanga) -->
                <div class="spectrum-cross-plane-wrap">
                  <div class="spectrum-cardinal-lbl spectrum-lbl-top">E</div>
                  <div class="spectrum-center-row">
                    <div class="spectrum-cardinal-lbl spectrum-lbl-left">P</div>
                    <div class="spectrum-quadrant-plane spectrum-quadrant-plane-blue">
                      <div class="spectrum-quadrant quad-ep" title="EP · Explorer"></div>
                      <div class="spectrum-quadrant quad-ej" title="EJ · Executive"></div>
                      <div class="spectrum-quadrant quad-ip" title="IP · Inquirer"></div>
                      <div class="spectrum-quadrant quad-ij" title="IJ · Conserver"></div>
                      <div class="spectrum-crosshair-h"></div>
                      <div class="spectrum-crosshair-v"></div>
                      <div class="spectrum-plot-dot" style="left: ${compass2X}%; top: ${compass2Y}%;" title="${userA_Name} (${personA.derivedType}) — ${s2Coords}"></div>
                      ${isComparing ? `
                        <div class="spectrum-plot-dot dot-other" style="left: ${compass2XB}%; top: ${compass2YB}%;" title="${userB_Name} (${personB.derivedType}) — ${s2CoordsB}"></div>
                      ` : ''}
                    </div>
                    <div class="spectrum-cardinal-lbl spectrum-lbl-right">J</div>
                  </div>
                  <div class="spectrum-cardinal-lbl spectrum-lbl-bottom">I</div>
                  <div class="spectrum-bottom-bar" style="margin-top: 0.85rem;">
                    ${isComparing ? `
                      <span class="spectrum-coord-lbl">⚪ ${userA_Name}: ${s2Coords} &nbsp;|&nbsp; <span style="color: #60a5fa;">🔵 ${userB_Name}: ${s2CoordsB}</span></span>
                    ` : `
                      <span class="spectrum-coord-lbl">${s2Coords}</span>
                    `}
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
                <span class="comp-search-icon" aria-hidden="true" style="position: absolute; left: 1.15rem; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.65; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; color: var(--text-muted, #737373);">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
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
                    <img class="comp-v2-avatar" src="${currentComparisonFigure.photo}" alt="${displayFigName}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="display:none; background:${currentFigTemp.color};">${currentComparisonFigure.avatar || displayFigName.charAt(0)}</div>
                  ` : `
                    <div class="comp-v2-avatar comp-v2-avatar-fallback" style="background:${currentFigTemp.color}26; border: 2px solid ${currentFigTemp.color};">${currentComparisonFigure.avatar || displayFigName.charAt(0)}</div>
                  `}
                  <div class="comp-v2-header-info">
                    <div class="comp-v2-top-row">
                      <h3 class="comp-v2-name">${displayFigName}</h3>
                      <span class="comp-v2-pct" style="color: ${currentFigTemp.color};">${figSim}%</span>
                    </div>
                    <div class="comp-v2-subtitle">${compCleanRole} · <b style="color: ${currentFigTemp.color};">${currentComparisonFigure.mbti}</b></div>
                    <div class="comp-v2-bar-track">
                      <div class="comp-v2-bar-fill" style="width: ${figSim}%; background: ${currentFigTemp.color};"></div>
                    </div>
                  </div>
                </div>

                <div class="comp-v2-sec-heading" style="margin: 1.5rem 0 0.85rem; font-family: var(--font-display); font-size: 0.95rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-strong);">
                  ${lang === 'ro' ? '4 Axe' : '4 Axes'}
                </div>
                <div class="comp-v2-axes-grid">
                  ${compAxesHtml}
                </div>

                <div class="comp-v2-sec-heading" style="margin: 2rem 0 0.85rem; font-family: var(--font-display); font-size: 0.95rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-strong);">
                  ${lang === 'ro' ? '8 Funcții' : '8 Functions'}
                </div>
                <div class="comp-v2-axes-grid">
                  ${compFuncsAxesHtml}
                </div>
              </div>
            </section>

            <!-- Compare with someone else (Image 2 Obsidian V2 Design) -->
            <section class="e-ppl-compare-box" id="comparar-pessoa">
              <h2 class="e-ppl-title">Compare</h2>

              <form id="ppl-compare-form" novalidate>
                <div class="e-ppl-columns">
                  <!-- Left Card: You -->
                  <div class="e-ppl-card">
                    <div class="e-ppl-card-header">
                      <span class="e-ppl-dot dot-white"></span>
                      <span class="e-ppl-card-tag">${lang === "ro" ? "TU" : "YOU"}</span>
                    </div>

                    <div class="e-ppl-group">
                      <span class="e-ppl-lbl">${lang === "ro" ? "NUME" : "NAME"}</span>
                      <div class="e-ppl-pill-input">
                        <svg class="e-ppl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="ppl-name-a" maxlength="40" autocomplete="off" value="${userA_Name}">
                      </div>
                    </div>

                    <div class="e-ppl-group">
                      <span class="e-ppl-lbl">${lang === "ro" ? "LINK" : "LINK"}</span>
                      <div class="e-ppl-pill-input has-action">
                        <svg class="e-ppl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <input type="text" id="ppl-link-a" readonly spellcheck="false" value="${userFullResultUrl}">
                        <button class="e-ppl-pill-btn" id="ppl-copy-a" type="button" title="${lang === 'ro' ? 'Copiază link' : 'Copy link'}">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>${lang === 'ro' ? 'Copiază' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Right Card: Other Person -->
                  <div class="e-ppl-card">
                    <div class="e-ppl-card-header">
                      <span class="e-ppl-dot dot-blue"></span>
                      <span class="e-ppl-card-tag">${lang === "ro" ? "CEALALTĂ PERSOANĂ" : "OTHER PERSON"}</span>
                    </div>

                    <div class="e-ppl-group">
                      <span class="e-ppl-lbl">${lang === "ro" ? "NUME" : "NAME"}</span>
                      <div class="e-ppl-pill-input">
                        <svg class="e-ppl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="ppl-name-b" maxlength="40" autocomplete="off" placeholder="${lang === 'ro' ? 'Alte' : 'Other'}" value="${userB_Name}">
                      </div>
                    </div>

                    <div class="e-ppl-group">
                      <span class="e-ppl-lbl">${lang === "ro" ? "LINK" : "LINK"}</span>
                      <div class="e-ppl-pill-input has-action">
                        <svg class="e-ppl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <input type="text" id="ppl-link-b" spellcheck="false" placeholder="${lang === 'ro' ? 'Lipește linkul aici' : 'Paste link here'}" value="${personB ? (personB.link || '') : (this.comparisonPersonB_Link || '')}">
                        <button class="e-ppl-pill-btn" id="ppl-paste-b" type="button" title="${lang === 'ro' ? 'Lipește link' : 'Paste link'}">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                          </svg>
                          <span>${lang === 'ro' ? 'Lipește' : 'Paste'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="ppl-error-box" class="e-ppl-msg" style="display: none; margin-top: 1rem;"></div>

                <div class="e-ppl-bottom-bar">
                  <button class="e-ppl-compare-btn" id="ppl-submit-btn" type="submit">
                    <span>${lang === "ro" ? "Compară" : "Compare"} &rarr;</span>
                  </button>
                  ${isComparing ? `
                    <button class="e-ppl-reset-btn" id="ppl-exit-compare-btn" type="button">
                      <span>&times; ${lang === "ro" ? "Resetează / Ieși" : "Reset / Exit"}</span>
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

    this.attachResultsEvents(percentages, topMbti, modeConfig, answeredCount, rawScores, axisScores, derivedType, allFigures, similarFigures, userFullResultUrl);
  }

  attachResultsEvents(percentages, topMbti, modeConfig, answeredCount = 0, rawScores = {}, axisScores = {}, derivedType = "", allFigures = [], similarFigures = [], userFullResultUrl = "") {
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

    const openEditBtn = document.getElementById("open-edit-answers-btn");
    if (openEditBtn) {
      openEditBtn.addEventListener("click", () => {
        this.openEditAnswersModal();
      });
    }

    const reviewBtn = document.getElementById("review-answers-btn");
    if (reviewBtn) {
      reviewBtn.addEventListener("click", () => {
        this.openEditAnswersModal();
      });
    }

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

    // Clicking a figure in Notable Figures opens its details modal
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

        const currentAUrl = (linkAInput && linkAInput.value.trim()) || userFullResultUrl || this.userFullResultUrl || "";
        let parsedA = null;
        if (aLink && aLink !== currentAUrl) {
          parsedA = parseComparisonInputLink(aLink);
        }

        const scoresA = parsedA ? parsedA.percentages : percentages;
        const axesA = parsedA ? parsedA.axisScores : axisScores;
        const typeA = parsedA ? parsedA.derivedType : derivedType;

        this.comparisonPersonA_Name = aName;
        this.comparisonPersonA_Link = aLink || currentAUrl;
        this.comparisonPersonB_Name = bName;
        this.comparisonPersonB_Link = bLink;

        this.comparisonPersonA = {
          name: aName,
          percentages: scoresA,
          axisScores: axesA,
          derivedType: typeA,
          link: aLink || currentAUrl,
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

        this.customComparisonPerson = {
          id: "custom_person",
          name: bName,
          mbti: parsedB.derivedType,
          role: lang === "ro" ? "Rezultat comparat" : "Compared result",
          avatar: bName.charAt(0).toUpperCase() || "P",
          temperament: getTypeTemperament(parsedB.derivedType),
          axes: {
            I: parsedB.axisScores.EI.roundB,
            E: parsedB.axisScores.EI.roundA,
            S: parsedB.axisScores.NS.roundB,
            N: parsedB.axisScores.NS.roundA,
            F: parsedB.axisScores.TF.roundB,
            T: parsedB.axisScores.TF.roundA,
            P: parsedB.axisScores.JP.roundB,
            J: parsedB.axisScores.JP.roundA
          },
          scores: parsedB.percentages,
          percentages: parsedB.percentages,
          axisScores: parsedB.axisScores
        };
        this.selectedFigureId = "custom_person";

        // Build RESTful compare path: /compare/:nameA/:vecA/:nameB/:vecB/
        const rawComparePath = buildCompareUrlPath(
          aName,
          axesA,
          scoresA,
          bName,
          parsedB.axisScores,
          parsedB.percentages
        );
        const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
          ? import.meta.env.BASE_URL
          : "/";
        const prefix = baseUrl.replace(/\/$/, "");
        const fullComparePath = `${prefix}${rawComparePath}`;
        history.pushState(null, "", fullComparePath);

        this.state.screen = "compare";
        this.renderResults();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const exitCompareBtn = document.getElementById("ppl-exit-compare-btn");
    if (exitCompareBtn) {
      exitCompareBtn.addEventListener("click", () => {
        this.comparisonPersonB = null;
        this.comparisonPersonB_Name = "";
        this.comparisonPersonB_Link = "";
        this.customComparisonPerson = null;
        this.selectedFigureId = null;
        if (this.state.compareParsed) delete this.state.compareParsed;
        if (this.state.compareParams) delete this.state.compareParams;
        this.state.screen = "results";
        const rawResultsPath = buildResultsUrlPath(axisScores, percentages);
        const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
          ? import.meta.env.BASE_URL
          : "/";
        const prefix = baseUrl.replace(/\/$/, "");
        const fullResultsPath = `${prefix}${rawResultsPath}`;
        history.pushState(null, "", fullResultsPath);
        this.renderResults();
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


  }

  // ==========================================================================
  // Dedicated Comparison Screen
  // ==========================================================================

  renderCompare() {
    this.initCompareParams();
    this.renderResults();
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
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? '4 Axe' : '4 Axes'}</h4>
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
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? '8 Funcții' : '8 Functions'}</h4>
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

  // ==========================================================================
  // Edit Answers Sheet & 3D Deck (Authentic 12Axes Architecture & UI)
  // Sectioned by: E I N S T F J P Ne Ni Se Si Te Ti Fe Fi EJ EP IJ IP NT NF ST SF
  // ==========================================================================

  openEditAnswersModal(initialSectionId = null) {
    const lang = this.state.lang || "ro";
    const questions = this.state.questions;
    if (!questions || questions.length === 0) return;

    // Remove any existing modal
    const oldBackdrop = document.getElementById("edit-answers-backdrop");
    if (oldBackdrop) oldBackdrop.remove();

    // Filter only active sections that have questions in this test
    const activeSections = EDIT_SECTIONS.filter(sec =>
      questions.some(q => getQuestionCategory(q) === sec.id)
    );

    if (activeSections.length === 0) return;

    // Ordered steps by the 24 categories
    const steps = [];
    activeSections.forEach(sec => {
      const secQuestions = questions.filter(q => getQuestionCategory(q) === sec.id);
      secQuestions.forEach(q => {
        steps.push({ group: sec.id, question: q });
      });
    });

    if (steps.length === 0) return;

    const initialAnswers = { ...(this.state.answers || {}) };
    const draftAnswers = { ...(this.state.answers || {}) };
    let currentStepIndex = 0;
    if (initialSectionId) {
      const idx = steps.findIndex(s => s.group === initialSectionId);
      if (idx !== -1) currentStepIndex = idx;
    }
    let isSaving = false;

    const countChanges = () => {
      let count = 0;
      for (const q of questions) {
        if (draftAnswers[q.id] !== initialAnswers[q.id]) count++;
      }
      return count;
    };

    const countGroupChanges = (groupId) => {
      let count = 0;
      for (const step of steps) {
        if (step.group === groupId && draftAnswers[step.question.id] !== initialAnswers[step.question.id]) {
          count++;
        }
      }
      return count;
    };

    const getSectionDelta = (secId) => {
      const secQuestions = questions.filter(q => getQuestionCategory(q) === secId);
      if (secQuestions.length === 0) return 0;
      let sum = 0;
      secQuestions.forEach(q => {
        const imp = calculateQuestionImpact(q, draftAnswers, questions, lang);
        sum += imp?.deltaRound || 0;
      });
      return Math.round(sum / secQuestions.length);
    };

    // Create Modal Element with 12Axes authentic layout
    const backdrop = document.createElement("div");
    backdrop.className = "e-axis-sheet-backdrop";
    backdrop.id = "edit-answers-backdrop";

    backdrop.innerHTML = `
      <div class="e-axis-sheet e-edit-sheet" role="dialog" aria-modal="true" aria-labelledby="e-edit-title">
        <span class="e-axis-sheet-handle" aria-hidden="true"></span>
        <button class="e-axis-sheet-close" id="edit-sheet-close-btn" type="button" aria-label="${lang === 'ro' ? 'Închide' : 'Close'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
        </button>
        <header class="e-edit-head">
          <h3 id="e-edit-title">${t('editAnswersTitle', {}, lang)}</h3>
          <span class="e-edit-count" id="edit-change-count" aria-live="polite">${t('editAnswersNoChanges', {}, lang)}</span>
          <button class="e-edit-save" id="edit-save-btn" type="button" disabled>
            ${t('editAnswersSave', {}, lang)}
          </button>
        </header>
        <div class="e-edit-layout">
          <nav class="e-edit-axes" role="tablist" aria-label="Sections">
            ${activeSections.map(sec => {
              const firstIdx = steps.findIndex(s => s.group === sec.id);
              const sFullName = lang === "ro" ? (sec.nameRo || sec.name) : sec.name;
              const sDelta = getSectionDelta(sec.id);
              return `
                <button
                  type="button"
                  role="tab"
                  class="e-edit-axis ${sec.id === steps[currentStepIndex].group ? 'e-on' : ''}"
                  data-group="${sec.id}"
                  data-first="${firstIdx}"
                  style="--gc: ${sec.color};"
                  title="${sFullName}"
                >
                  ${sec.icon}
                  <span class="e-axis-title">${sFullName}</span>
                  <span class="e-axis-delta-pill" id="delta-pill-${sec.id}">${sDelta > 0 ? `+${sDelta}%` : `${sDelta}%`}</span>
                  <span class="e-edit-badge" id="badge-${sec.id}" style="display: none;">0</span>
                </button>
              `;
            }).join("")}
          </nav>
          <section class="e-edit-stage" aria-label="Questions Deck">
            <div class="e-deck-edit" id="edit-deck-container"></div>
            <nav class="e-edit-foot" aria-label="Navigation">
              <button class="e-edit-nav-btn" id="edit-back-btn" type="button" disabled>
                ← ${t('back', {}, lang)}
              </button>
              <span class="e-edit-counter" id="edit-counter-lbl">1/1</span>
              <button class="e-edit-nav-btn" id="edit-next-btn" type="button">
                ${t('next', {}, lang)} →
              </button>
            </nav>
          </section>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const deckContainer = backdrop.querySelector("#edit-deck-container");
    const countEl = backdrop.querySelector("#edit-change-count");
    const saveBtn = backdrop.querySelector("#edit-save-btn");
    const backBtn = backdrop.querySelector("#edit-back-btn");
    const nextBtn = backdrop.querySelector("#edit-next-btn");
    const counterEl = backdrop.querySelector("#edit-counter-lbl");

    const updateHeaderAndBadges = () => {
      const changes = countChanges();
      if (changes === 0) {
        countEl.textContent = t('editAnswersNoChanges', {}, lang);
        saveBtn.disabled = true;
      } else {
        const word = lang === "ro" ? (changes === 1 ? "răspuns modificat" : "răspunsuri modificate") : (changes === 1 ? "answer changed" : "answers changed");
        countEl.textContent = `${changes} ${word}`;
        saveBtn.disabled = false;
      }
      activeSections.forEach(sec => {
        const b = backdrop.querySelector(`#badge-${sec.id}`);
        if (b) {
          const gChanges = countGroupChanges(sec.id);
          if (gChanges > 0) {
            b.textContent = String(gChanges);
            b.style.display = "grid";
          } else {
            b.style.display = "none";
          }
        }
        const deltaPill = backdrop.querySelector(`#delta-pill-${sec.id}`);
        if (deltaPill) {
          const dVal = getSectionDelta(sec.id);
          deltaPill.textContent = dVal > 0 ? `+${dVal}%` : `${dVal}%`;
        }
      });
    };

    const renderDeck = () => {
      const currentStep = steps[currentStepIndex];
      const currentGroup = currentStep.group;
      const groupSteps = steps.filter(s => s.group === currentGroup);
      const groupFirstIndex = steps.findIndex(s => s.group === currentGroup);
      const inGroupIndex = currentStepIndex - groupFirstIndex;

      // Update Group Tabs active state
      backdrop.querySelectorAll(".e-edit-axis").forEach(tab => {
        const gId = tab.getAttribute("data-group");
        const isActive = gId === currentGroup;
        tab.classList.toggle("e-on", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        if (isActive) {
          tab.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      });

      // Update foot navigation
      backBtn.disabled = currentStepIndex === 0 || isSaving;
      nextBtn.disabled = currentStepIndex >= steps.length - 1 || isSaving;

      const groupDef = activeSections.find(s => s.id === currentGroup);
      const gName = lang === "ro" ? (groupDef?.nameRo || groupDef?.name || currentGroup) : (groupDef?.name || currentGroup);
      counterEl.textContent = `${gName} · ${inGroupIndex + 1}/${groupSteps.length}`;

      // Single fixed active card (No data-pos ghost cards)
      const q = currentStep.question;
      const isChanged = draftAnswers[q.id] !== initialAnswers[q.id];
      const currentAnswer = draftAnswers[q.id];
      const qNumStr = String(questions.indexOf(q) + 1).padStart(2, "0");
      const qText = getQuestionText(q, lang);

      let answersContentHtml = "";
      if ((q.format === "wouldYouRather" || q.format === "direct") && q.options) {
        answersContentHtml = `
          <div class="wyr-options-grid" role="radiogroup">
            ${q.options.map(opt => {
              const isSelected = currentAnswer === opt.id;
              const optText = (lang === "ro" && opt.textRo) ? opt.textRo : opt.text;
              return `
                <button type="button" class="answer-button ${isSelected ? 'selected' : ''}" data-answer="${opt.id}" data-qid="${q.id}" role="radio" aria-checked="${isSelected}">
                  <span class="answer-icon" aria-hidden="true">${opt.id}</span>
                  <span class="answer-label">${optText}</span>
                  <span class="answer-radio" aria-hidden="true"><span class="answer-radio-dot"></span></span>
                </button>
              `;
            }).join("")}
          </div>
        `;
      } else {
        const options = getAnswerOptions(lang);
        answersContentHtml = `
          <div class="answer-grid" role="radiogroup">
            ${options.map((opt) => {
              const isSelected = currentAnswer === opt.key;
              let iconSvg = ICONS.check;
              if (opt.key === "NEUTRAL") iconSvg = ICONS.minus;
              else if (opt.key === "DISAGREE" || opt.key === "STRONGLY_DISAGREE") iconSvg = ICONS.cross;
              return `
                <button class="answer-button answer-${opt.classSuffix} ${isSelected ? 'selected' : ''}" data-answer="${opt.key}" data-qid="${q.id}" type="button" role="radio" aria-checked="${isSelected}">
                  <span class="answer-icon" aria-hidden="true">${iconSvg}</span>
                  <span class="answer-label">${opt.label}</span>
                  <span class="answer-radio" aria-hidden="true"><span class="answer-radio-dot"></span></span>
                </button>
              `;
            }).join("")}
          </div>
        `;
      }

      const impact = calculateQuestionImpact(q, draftAnswers, questions, lang);

      deckContainer.innerHTML = `
        <div class="e-edit-card ${isChanged ? 'is-changed' : ''}" data-qid="${q.id}">
          <article class="question-card">
            <span class="question-number" aria-hidden="true">${qNumStr}</span>
            <header class="question-card-header">
              <div class="question-header-top">
                <div class="question-axis-tag" style="--tag-color: ${groupDef?.color || '#282828'};">
                  <i class="question-axis-tag-ico-wrap" aria-hidden="true">${groupDef?.icon || ''}</i>
                  <span>${getQuestionTagLabel(groupDef, lang)}</span>
                </div>
                <button class="inline-axis-info e-axis-info" id="edit-q-help-btn" type="button" aria-label="${t('inspectQuestion', {}, lang)}" title="${t('infoClickHint', {}, lang)}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
                ${impact ? `
                  <span class="e-impact-pill ${impact.className}" id="edit-q-impact-pill" title="${impact.tooltip}">
                    ${impact.text}
                  </span>
                ` : ''}
              </div>
              <h2>${qText}</h2>
            </header>
            ${answersContentHtml}
          </article>
        </div>
      `;

      // Help button click opens the exact modal specified
      deckContainer.querySelectorAll(".e-axis-info, .question-axis-tag, #edit-q-impact-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          this.showQuestionInfoModal(q, draftAnswers);
        });
      });

      // Attach answer selection event on card
      const activeCard = deckContainer.querySelector('.e-edit-card');
      if (activeCard) {
        activeCard.querySelectorAll("[data-answer]").forEach(btn => {
          btn.addEventListener("click", () => {
            if (isSaving) return;
            const qId = btn.getAttribute("data-qid");
            const ansKey = btn.getAttribute("data-answer");
            if (!qId || !ansKey) return;

            draftAnswers[qId] = ansKey;

            // Instant selection state update in 0ms (NO AUTO-ADVANCE)
            activeCard.querySelectorAll("[data-answer]").forEach(b => {
              const isSel = b.getAttribute("data-answer") === ansKey;
              b.classList.toggle("selected", isSel);
              b.setAttribute("aria-checked", String(isSel));
            });

            // Dynamically recalculate and update impact pill in real time
            const newImpact = calculateQuestionImpact(q, draftAnswers, questions, lang);
            const impactEl = activeCard.querySelector("#edit-q-impact-pill");
            if (impactEl && newImpact) {
              impactEl.className = `e-impact-pill ${newImpact.className}`;
              impactEl.textContent = newImpact.text;
              impactEl.title = newImpact.tooltip;
            }

            if (draftAnswers[qId] !== initialAnswers[qId]) {
              activeCard.classList.add("is-changed");
            } else {
              activeCard.classList.remove("is-changed");
            }

            updateHeaderAndBadges();
            // User advances deliberately using Next/Back or Arrow keys, preventing lag and jumping.
          });
        });
      }
    };

    const goTo = (newIndex) => {
      currentStepIndex = Math.max(0, Math.min(steps.length - 1, newIndex));
      renderDeck();
    };

    backBtn.addEventListener("click", () => goTo(currentStepIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentStepIndex + 1));

    backdrop.querySelectorAll(".e-edit-axis").forEach(tab => {
      tab.addEventListener("click", () => {
        const firstIdx = parseInt(tab.getAttribute("data-first"), 10);
        if (!isNaN(firstIdx)) goTo(firstIdx);
      });
    });

    const closeModal = () => {
      const activeModal = document.querySelector(".modal-overlay.active");
      if (activeModal) {
        this.closeModal();
        return;
      }
      if (countChanges() > 0) {
        if (!window.confirm(t('editAnswersDiscardConfirm', {}, lang))) return;
      }
      document.removeEventListener("keydown", handleKeyDown);
      backdrop.remove();
    };

    const handleKeyDown = (e) => {
      const activeModal = document.querySelector(".modal-overlay.active");
      if (activeModal) {
        if (e.key === "Escape") this.closeModal();
        return;
      }
      if (e.key === "ArrowLeft") goTo(currentStepIndex - 1);
      else if (e.key === "ArrowRight") goTo(currentStepIndex + 1);
      else if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    backdrop.querySelector("#edit-sheet-close-btn").addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    saveBtn.addEventListener("click", () => {
      if (isSaving || countChanges() === 0) return;
      isSaving = true;
      saveBtn.disabled = true;
      saveBtn.textContent = t('editAnswersSaving', {}, lang);

      setTimeout(() => {
        this.state.answers = { ...draftAnswers };
        try {
          this.state.save();
        } catch (e) {
          try {
            localStorage.setItem("8func_answers_v2", JSON.stringify(this.state.answers));
          } catch (_) {}
        }
        if (this.state.urlResultsScores) delete this.state.urlResultsScores;

        document.removeEventListener("keydown", handleKeyDown);
        backdrop.remove();
        this.renderResults();
        this.showToast(t('editAnswersSavedToast', {}, lang));
      }, 100);
    });

    updateHeaderAndBadges();
    renderDeck();
  }
}

/**
 * Renders high-resolution Comparison Card into phone screen & flat preview canvases
 */
function drawComparisonPhoneCard(canvas, personA, personB, matchPct, lang) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#0b0f19");
  bgGrad.addColorStop(0.5, "#151b2e");
  bgGrad.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Decorative glow
  const glow = ctx.createRadialGradient(w / 2, h * 0.35, 20, w / 2, h * 0.35, w * 0.7);
  glow.addColorStop(0, "rgba(57, 82, 150, 0.45)");
  glow.addColorStop(0.6, "rgba(224, 104, 43, 0.2)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 24px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("8Func", w / 2, 60);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 12px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "ro" ? "COMPARAȚIE COGNITIVĂ" : "COGNITIVE COMPARISON", w / 2, 85);

  // Duo Avatars
  const cx = w / 2;
  const cy = 160;

  // Avatar A
  ctx.beginPath();
  ctx.arc(cx - 38, cy, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#395296";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 28px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(personA.name.charAt(0).toUpperCase(), cx - 38, cy);

  // Avatar B
  ctx.beginPath();
  ctx.arc(cx + 38, cy, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#e0682b";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(personB.name.charAt(0).toUpperCase(), cx + 38, cy);

  // Names & Types
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${personA.name} × ${personB.name}`, w / 2, 235);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "700 14px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${personA.derivedType}  ·  ${personB.derivedType}`, w / 2, 260);

  // Match Ring / Big percentage
  ctx.beginPath();
  ctx.arc(w / 2, 340, 52, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(w / 2, 340, 52, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (matchPct / 100)));
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#10b981";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 34px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${matchPct}%`, w / 2, 345);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 11px system-ui, -apple-system, sans-serif";
  ctx.fillText(lang === "ro" ? "POTRIVIRE" : "MATCH", w / 2, 368);

  // 4 Axes Mini Visualizer
  const axesY = 430;
  const axes = [
    { label: "E / I", pA: personA.axisScores.EI.roundA, pB: personB.axisScores.EI.roundA },
    { label: "N / S", pA: personA.axisScores.NS.roundA, pB: personB.axisScores.NS.roundA },
    { label: "T / F", pA: personA.axisScores.TF.roundA, pB: personB.axisScores.TF.roundA },
    { label: "J / P", pA: personA.axisScores.JP.roundA, pB: personB.axisScores.JP.roundA }
  ];

  axes.forEach((ax, idx) => {
    const y = axesY + idx * 56;
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "700 12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(ax.label, 40, y);

    // Track
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    const trackX = 100;
    const trackW = w - 140;
    ctx.fillRect(trackX, y - 8, trackW, 8);

    // Midline
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(trackX + trackW / 2 - 1, y - 12, 2, 16);

    // Pin A
    const pinA_X = trackX + (trackW * (ax.pA / 100));
    ctx.beginPath();
    ctx.arc(pinA_X, y - 4, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#395296";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pin B
    const pinB_X = trackX + (trackW * (ax.pB / 100));
    ctx.beginPath();
    ctx.arc(pinB_X, y - 4, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#e0682b";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Footer badge
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "600 12px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("8func.org · Jungian Cognitive Assessment", w / 2, h - 35);
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
