/**
 * 8Func - Comprehensive Data-Driven Scoring Engine
 * 
 * Answer Scale:
 * - Strongly Agree:     1.0
 * - Agree:              0.5
 * - Neutral:            0.0
 * - Disagree:          -0.5
 * - Strongly Disagree: -1.0
 * 
 * Multi-layer Integrative Architecture:
 * 1. Direct Axis & Cognitive Functions Scoring:
 *    - Agreement items contribute directly to target pole (or opposite pole on disagree).
 *    - WYR and Direct items contribute +1.0 to selected option pole.
 * 2. Two-Letter Combination Items (NT, NF, ST, SF, IJ, IP, EP, EJ):
 *    - Strong agree adds +1.0 to both constituent letters (e.g. NT -> +1 N, +1 T; IJ -> +1 I, +1 J).
 *    - Disagree adds +1.0 to both letters of opposite combination (e.g. NT -> SF; IJ -> EP).
 * 3. Cross-Synthesis (Temperament x Lifestyle):
 *    - Average between temperament (NT, NF, ST, SF) and lifestyle (IJ, IP, EP, EJ) boosts dominant and auxiliary functions (e.g. NT + IJ -> Ni & Te).
 * 4. Single-Letter Convergence:
 *    - Co-occurrence clusters (IN + NJ -> Ni, IP + TP -> Ti, EJ + TJ -> Te, etc.) boost corresponding functions.
 * 5. Cognitive Function Feedback:
 *    - Aggregate introverted vs extraverted cognitive balance tilts EI axis.
 *    - Extraverted judging (Te, Fe) vs perceiving (Ne, Se) reinforces J vs P axis.
 *    - Dominant & auxiliary function orientations reinforce EI and JP poles.
 */

import { FUNCTIONS_LIST } from "../data/functions.js";

export const ANSWER_OPTIONS = [
  {
    key: "STRONGLY_AGREE",
    points: 1.0,
    label: "Strongly agree",
    classSuffix: "strong-agree"
  },
  {
    key: "AGREE",
    points: 0.5,
    label: "Agree",
    classSuffix: "agree"
  },
  {
    key: "NEUTRAL",
    points: 0.0,
    label: "Neutral",
    classSuffix: "neutral"
  },
  {
    key: "DISAGREE",
    points: -0.5,
    label: "Disagree",
    classSuffix: "disagree"
  },
  {
    key: "STRONGLY_DISAGREE",
    points: -1.0,
    label: "Strongly disagree",
    classSuffix: "strong-disagree"
  }
];

export function getAnswerOptions(lang = "en") {
  const roLabels = {
    STRONGLY_AGREE: "Total de acord",
    AGREE: "De acord",
    NEUTRAL: "Neutru",
    DISAGREE: "Dezacord",
    STRONGLY_DISAGREE: "Total dezacord"
  };

  return ANSWER_OPTIONS.map(opt => ({
    ...opt,
    label: (lang === "ro" ? roLabels[opt.key] : opt.label) || opt.label
  }));
}

export const ANSWER_VALUE_MAP = {
  STRONGLY_AGREE: 1.0,
  AGREE: 0.5,
  NEUTRAL: 0.0,
  DISAGREE: -0.5,
  STRONGLY_DISAGREE: -1.0
};

export const AXIS_DIMENSIONS = [
  { id: "EI", poleA: "E", poleB: "I", nameA: "Extraversion", nameB: "Introversion" },
  { id: "NS", poleA: "N", poleB: "S", nameA: "Intuition", nameB: "Sensing" },
  { id: "TF", poleA: "T", poleB: "F", nameA: "Thinking", nameB: "Feeling" },
  { id: "JP", poleA: "J", poleB: "P", nameA: "Judging", nameB: "Perceiving" }
];

export const FUNC_VECTORS = {
  Ne: { EI:  1, NS:  1, TF:  0, JP: -1 },
  Ni: { EI: -1, NS:  1, TF:  0, JP:  1 },
  Se: { EI:  1, NS: -1, TF:  0, JP: -1 },
  Si: { EI: -1, NS: -1, TF:  0, JP:  1 },
  Te: { EI:  1, NS:  0, TF:  1, JP:  1 },
  Ti: { EI: -1, NS:  0, TF:  1, JP: -1 },
  Fe: { EI:  1, NS:  0, TF: -1, JP:  1 },
  Fi: { EI: -1, NS:  0, TF: -1, JP: -1 }
};

export const FUNCTION_AXIS_MAP = FUNC_VECTORS;

export const AXIS_FUNCTION_MAP = {
  EI: {
    poleA: "E",
    poleB: "I",
    posFuncs: ["Ne", "Se", "Te", "Fe"],
    negFuncs: ["Ni", "Si", "Ti", "Fi"],
    funcsA: ["Ne", "Se", "Te", "Fe"],
    funcsB: ["Ni", "Si", "Ti", "Fi"]
  },
  NS: {
    poleA: "N",
    poleB: "S",
    posFuncs: ["Ne", "Ni"],
    negFuncs: ["Se", "Si"],
    funcsA: ["Ne", "Ni"],
    funcsB: ["Se", "Si"]
  },
  TF: {
    poleA: "T",
    poleB: "F",
    posFuncs: ["Te", "Ti"],
    negFuncs: ["Fe", "Fi"],
    funcsA: ["Te", "Ti"],
    funcsB: ["Fe", "Fi"]
  },
  JP: {
    poleA: "J",
    poleB: "P",
    posFuncs: ["Te", "Fe"],
    negFuncs: ["Ne", "Se"],
    funcsA: ["Te", "Fe", "Ni", "Si"],
    funcsB: ["Ne", "Se", "Ti", "Fi"]
  }
};

const COMBO_OPPOSITES = {
  NT: "SF", NF: "ST", ST: "NF", SF: "NT",
  IJ: "EP", IP: "EJ", EP: "IJ", EJ: "IP"
};

const TYPE_FUNCTION_PAIRS = {
  "NT+IJ": { type: "INTJ", dom: "Ni", aux: "Te" },
  "NT+IP": { type: "INTP", dom: "Ti", aux: "Ne" },
  "NT+EJ": { type: "ENTJ", dom: "Te", aux: "Ni" },
  "NT+EP": { type: "ENTP", dom: "Ne", aux: "Ti" },

  "NF+IJ": { type: "INFJ", dom: "Ni", aux: "Fe" },
  "NF+IP": { type: "INFP", dom: "Fi", aux: "Ne" },
  "NF+EJ": { type: "ENFJ", dom: "Fe", aux: "Ni" },
  "NF+EP": { type: "ENFP", dom: "Ne", aux: "Fi" },

  "ST+IJ": { type: "ISTJ", dom: "Si", aux: "Te" },
  "ST+IP": { type: "ISTP", dom: "Ti", aux: "Se" },
  "ST+EJ": { type: "ESTJ", dom: "Te", aux: "Si" },
  "ST+EP": { type: "ESTP", dom: "Se", aux: "Ti" },

  "SF+IJ": { type: "ISFJ", dom: "Si", aux: "Fe" },
  "SF+IP": { type: "ISFP", dom: "Fi", aux: "Se" },
  "SF+EJ": { type: "ESFJ", dom: "Fe", aux: "Si" },
  "SF+EP": { type: "ESFP", dom: "Se", aux: "Fi" }
};

/**
 * Linear normalization: maps raw mean in [-1, +1] to percentage in [0, 100].
 * Strongly Disagree (-1) → 0%, Neutral (0) → 50%, Strongly Agree (+1) → 100%.
 */
export function meanToPercent(mean) {
  return Math.max(0.0, Math.min(100.0, ((mean + 1.0) / 2.0) * 100.0));
}

export const LIKERT_SCORE_MAP = {
  STRONGLY_AGREE: 100,
  AGREE: 75,
  NEUTRAL: 50,
  DISAGREE: 25,
  STRONGLY_DISAGREE: 0
};

export const LIKERT_RAW = {
  STRONGLY_AGREE: 1.0,
  AGREE: 0.75,
  NEUTRAL: 0.5,
  DISAGREE: 0.25,
  STRONGLY_DISAGREE: 0.0
};

export const ACQ_STRENGTH = 0.7;   // cât din tendința de a zice „da” la tot se scade
export const AXIS_STRETCH = 1.3;   // decompresie bare axe
export const FN_STRETCH = 1.6;     // decompresie bare funcții
export const W_AXIS = 1, W_FORCED_CROSS = 0.5, W_COMBO_FORCED = 0.5, W_COMBO_LIKERT = 0.25;

export const FN_LETTER = { Ne: 'N', Ni: 'N', Se: 'S', Si: 'S', Te: 'T', Ti: 'T', Fe: 'F', Fi: 'F' };

const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0.5);

/**
 * Calculates axis dichotomy scores (Raport Real Normalizat) and 8 cognitive functions (Scor Likert unipolar + stretch).
 */
export function calculateScores(questions, answers) {
  let answeredCount = 0;
  let agreeCount = 0;
  let disagreeCount = 0;
  let neutralCount = 0;

  // Track raw Likert scores for cognitive functions
  const fnS = {};
  FUNCTIONS_LIST.forEach(f => {
    fnS[f] = [];
  });

  // Track weighted scores for axes
  const axS = {
    EI: [],
    NS: [],
    TF: [],
    JP: []
  };

  const addAxis = (letter, valTowardLetter, w) => {
    const dim = AXIS_DIMENSIONS.find(d => d.poleA === letter || d.poleB === letter);
    if (!dim) return;
    const toA = letter === dim.poleA ? valTowardLetter : (1.0 - valTowardLetter);
    axS[dim.id].push({ v: toA, w });
  };

  // Acquiescence bias calculation across Likert answers (requires at least 8 Likert items to establish a baseline)
  const likValues = [];
  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey !== undefined && ansKey !== null && LIKERT_RAW[ansKey] !== undefined) {
      likValues.push(LIKERT_RAW[ansKey]);
    }
  });
  const acq = likValues.length >= 8 ? (mean(likValues) - 0.5) * ACQ_STRENGTH : 0;

  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;
    answeredCount++;

    const forced = q.format === "wouldYouRather" || q.format === "direct";
    let v = 0.5;

    if (forced) {
      agreeCount++;
      const optA = q.options?.[0];
      const isA = (ansKey === optA?.id || ansKey === "A");
      v = isA ? 1.0 : 0.0;
    } else {
      let rawVal = 0.5;
      if (typeof ansKey === "number") {
        if (ansKey >= -1.0 && ansKey <= 1.0) {
          rawVal = (ansKey + 1.0) / 2.0;
        } else {
          rawVal = ansKey / 100.0;
        }
      } else {
        rawVal = LIKERT_RAW[ansKey] ?? 0.5;
      }

      if (rawVal > 0.5) agreeCount++;
      else if (rawVal < 0.5) disagreeCount++;
      else neutralCount++;

      v = clamp01(rawVal - acq);
    }

    const target = q.target || q.agreementPole || q.options?.[0]?.pole;
    const opp = q.opposite || q.oppositePole || q.options?.[1]?.pole;

    if (q.category === "axis") {
      if (target) addAxis(target, v, W_AXIS);
    } else if (q.category === "function") {
      if (forced) {
        if (target && fnS[target]) fnS[target].push(v);
        if (opp && fnS[opp]) fnS[opp].push(1.0 - v);
        const lt = target ? FN_LETTER[target] : null;
        const lo = opp ? FN_LETTER[opp] : null;
        if (lt && lo && lt !== lo) addAxis(lt, v, W_FORCED_CROSS);
      } else {
        // Unipolar: opusul NU primeste nimic
        if (target && fnS[target]) fnS[target].push(v);
      }
    } else if (q.category === "combination") {
      const t = (target || "").split("");
      const o = (opp || "").split("");
      if (forced) {
        t.forEach((l, i) => {
          if (l !== o[i]) addAxis(l, v, W_COMBO_FORCED);
        });
      } else {
        t.forEach((l) => {
          addAxis(l, v, W_COMBO_LIKERT);
        });
      }
    }
  });

  // 1. Calculate cognitive function percentages (Scor Likert unipolar cu decompresie)
  const raw = {};
  const insufficientData = {};
  const functionWeights = {};
  const functionSums = {};
  const functionDirectPoints = {};

  FUNCTIONS_LIST.forEach(f => {
    const list = fnS[f] || [];
    functionWeights[f] = list.length;
    functionSums[f] = list.reduce((a, b) => a + b, 0);
    if (list.length > 0) {
      raw[f] = list.reduce((a, b) => a + b, 0) / list.length;
      insufficientData[f] = false;
      functionDirectPoints[f] = raw[f] * 100;
    } else {
      raw[f] = 0.5;
      insufficientData[f] = true;
      functionDirectPoints[f] = 50;
    }
  });

  const mu = mean(Object.values(raw));

  const percentages = {};
  const precisePercentages = {};
  FUNCTIONS_LIST.forEach(f => {
    const val = clamp(50 + (raw[f] - mu) * 100 * FN_STRETCH);
    precisePercentages[f] = val;
    percentages[f] = Math.round(val);
  });

  const ranking = [...FUNCTIONS_LIST].sort((a, b) => (raw[b] ?? 0.5) - (raw[a] ?? 0.5));

  // 2. Calculate 4 MBTI Spectrum axes
  const axisScores = {};
  const axisPercentages = {};

  AXIS_DIMENSIONS.forEach(dim => {
    const { poleA, poleB, id } = dim;
    const s = axS[id];
    const wsum = s.reduce((acc, curr) => acc + curr.w, 0);
    const m = wsum > 0 ? (s.reduce((acc, curr) => acc + curr.v * curr.w, 0) / wsum) : 0.5;
    const pa = clamp(50 + (m - 0.5) * 100 * AXIS_STRETCH);
    const roundA = Math.round(pa);
    const roundB = 100 - roundA;

    axisScores[id] = {
      dimension: id,
      poleA,
      poleB,
      pctA: pa,
      pctB: 100.0 - pa,
      roundA,
      roundB,
      dominant: (roundA >= roundB) ? poleA : poleB,
      directPctA: roundA,
      directPctB: roundB,
      funcPctA: roundA,
      funcPctB: roundB,
      rawMeanA: Math.round(m * 100),
      rawMeanB: Math.round((1.0 - m) * 100),
      directPointsA: m * 100,
      directPointsB: (1.0 - m) * 100,
      totalWeight: wsum
    };

    axisPercentages[poleA] = roundA;
    axisPercentages[poleB] = roundB;
  });

  // 3. Derived 4-letter type directly from the 4 axis dimensions
  const derivedType = `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;

  // Response bias checks
  let acquiescenceWarning = null;
  if (answeredCount >= 8) {
    const agreeRatio = agreeCount / answeredCount;
    const disagreeRatio = disagreeCount / answeredCount;
    const neutralRatio = neutralCount / answeredCount;

    if (agreeRatio >= 0.85) {
      acquiescenceWarning = {
        type: "high_agreement",
        label: "Notice: High Agreement Tendency",
        message: "You agreed with over 85% of statements. Cognitive polarity relies on differentiation—some functions may appear higher than your everyday natural focus."
      };
    } else if (disagreeRatio >= 0.85) {
      acquiescenceWarning = {
        type: "high_disagreement",
        label: "Notice: High Critical/Disagreement Tendency",
        message: "You disagreed with over 85% of statements. While critical reflection is valid, identifying your favored cognitive processes yields a sharper archetype match."
      };
    } else if (neutralRatio >= 0.60) {
      acquiescenceWarning = {
        type: "high_neutral",
        label: "Notice: High Neutrality (Mixed Profile)",
        message: "Over 60% of responses were context-dependent. This reflects a balanced, versatile profile with subtle differences between polarities."
      };
    }
  }

  const isComplete = answeredCount === questions.length;

  return {
    axisScores,
    axisPercentages,
    derivedType,
    rawScores: percentages,
    functionSums,
    functionWeights,
    functionDirectPoints,
    percentages,
    precisePercentages,
    insufficientData,
    acquiescenceWarning,
    answeredCount,
    totalQuestions: questions.length,
    isComplete,
    ranking
  };
}

/**
 * Builds the results URL path in the format:
 * /results/EI=60/NS=40/TF=50/JP=45/Ne=67/Ni=42/Se=58/Si=33/Te=25/Ti=58/Fe=50/Fi=67/
 * where EI, NS, TF, JP represent thumb position along the 4 Axes (0-100% of the right pole: I, S, F, P)
 */
export function buildResultsUrlPath(axisScores, percentages) {
  const EI = axisScores?.EI ? (axisScores.EI.roundB ?? Math.round(axisScores.EI.pctB)) : 50;
  const NS = axisScores?.NS ? (axisScores.NS.roundB ?? Math.round(axisScores.NS.pctB)) : 50;
  const TF = axisScores?.TF ? (axisScores.TF.roundB ?? Math.round(axisScores.TF.pctB)) : 50;
  const JP = axisScores?.JP ? (axisScores.JP.roundB ?? Math.round(axisScores.JP.pctB)) : 50;

  const Ne = percentages?.Ne ?? 50;
  const Ni = percentages?.Ni ?? 50;
  const Se = percentages?.Se ?? 50;
  const Si = percentages?.Si ?? 50;
  const Te = percentages?.Te ?? 50;
  const Ti = percentages?.Ti ?? 50;
  const Fe = percentages?.Fe ?? 50;
  const Fi = percentages?.Fi ?? 50;

  return `/results/EI=${EI}/NS=${NS}/TF=${TF}/JP=${JP}/Ne=${Ne}/Ni=${Ni}/Se=${Se}/Si=${Si}/Te=${Te}/Ti=${Ti}/Fe=${Fe}/Fi=${Fi}/`;
}

/**
 * Parses a results URL path and extracts the score percentages and axis scores
 * Supports both new /EI=../NS=../TF=../JP=../ and legacy /I=../E=../ formats
 */
export function parseResultsUrlPath(pathname) {
  if (!pathname || !pathname.includes("/results/")) return null;
  const match = pathname.match(/\/results\/([^#?]+)/);
  if (!match) return null;

  const segment = match[1];
  const parts = segment.split("/").filter(Boolean);
  const data = {};
  parts.forEach(p => {
    const [k, v] = p.split("=");
    if (k && v !== undefined) {
      const num = parseInt(v, 10);
      if (!isNaN(num)) {
        data[k] = Math.max(0, Math.min(100, num));
      }
    }
  });

  const keys = ["EI", "NS", "TF", "JP", "I", "E", "N", "S", "T", "F", "J", "P", "Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];
  const hasKeys = keys.some(k => data[k] !== undefined);
  if (!hasKeys) return null;

  const pI = data.EI !== undefined ? data.EI : (data.I ?? 50);
  const pE = data.EI !== undefined ? (100 - data.EI) : (data.E ?? 50);
  const pS = data.NS !== undefined ? data.NS : (data.S ?? 50);
  const pN = data.NS !== undefined ? (100 - data.NS) : (data.N ?? 50);
  const pF = data.TF !== undefined ? data.TF : (data.F ?? 50);
  const pT = data.TF !== undefined ? (100 - data.TF) : (data.T ?? 50);
  const pP = data.JP !== undefined ? data.JP : (data.P ?? 50);
  const pJ = data.JP !== undefined ? (100 - data.JP) : (data.J ?? 50);

  const derivedType = `${pE >= pI ? "E" : "I"}${pN >= pS ? "N" : "S"}${pT >= pF ? "T" : "F"}${pJ >= pP ? "J" : "P"}`;

  return {
    ...data,
    EI: pI,
    NS: pS,
    TF: pF,
    JP: pP,
    I: pI,
    E: pE,
    S: pS,
    N: pN,
    F: pF,
    T: pT,
    P: pP,
    J: pJ,
    percentages: {
      Ne: data.Ne ?? 50,
      Ni: data.Ni ?? 50,
      Se: data.Se ?? 50,
      Si: data.Si ?? 50,
      Te: data.Te ?? 50,
      Ti: data.Ti ?? 50,
      Fe: data.Fe ?? 50,
      Fi: data.Fi ?? 50
    },
    axisScores: {
      EI: { dimension: "EI", poleA: "E", poleB: "I", pctA: pE, pctB: pI, roundA: pE, roundB: pI, dominant: pE >= pI ? "E" : "I" },
      NS: { dimension: "NS", poleA: "N", poleB: "S", pctA: pN, pctB: pS, roundA: pN, roundB: pS, dominant: pN >= pS ? "N" : "S" },
      TF: { dimension: "TF", poleA: "T", poleB: "F", pctA: pT, pctB: pF, roundA: pT, roundB: pF, dominant: pT >= pF ? "T" : "F" },
      JP: { dimension: "JP", poleA: "J", poleB: "P", pctA: pJ, pctB: pP, roundA: pJ, roundB: pP, dominant: pJ >= pP ? "J" : "P" }
    },
    derivedType
  };
}

/**
 * Builds normalized score structures from axis numbers and function percentages
 */
function buildComparisonScores(pI, pS, pF, pP, percentages = {}) {
  const pE = 100 - pI;
  const pN = 100 - pS;
  const pT = 100 - pF;
  const pJ = 100 - pP;
  const axisScores = {
    EI: { dimension: "EI", poleA: "E", poleB: "I", pctA: pE, pctB: pI, roundA: pE, roundB: pI, dominant: pE >= pI ? "E" : "I" },
    NS: { dimension: "NS", poleA: "N", poleB: "S", pctA: pN, pctB: pS, roundA: pN, roundB: pS, dominant: pN >= pS ? "N" : "S" },
    TF: { dimension: "TF", poleA: "T", poleB: "F", pctA: pT, pctB: pF, roundA: pT, roundB: pF, dominant: pT >= pF ? "T" : "F" },
    JP: { dimension: "JP", poleA: "J", poleB: "P", pctA: pJ, pctB: pP, roundA: pJ, roundB: pP, dominant: pJ >= pP ? "J" : "P" }
  };
  const derivedType = `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;
  return {
    EI: pI,
    NS: pS,
    TF: pF,
    JP: pP,
    I: pI,
    E: pE,
    S: pS,
    N: pN,
    F: pF,
    T: pT,
    P: pP,
    J: pJ,
    percentages: {
      Ne: percentages?.Ne ?? 50,
      Ni: percentages?.Ni ?? 50,
      Se: percentages?.Se ?? 50,
      Si: percentages?.Si ?? 50,
      Te: percentages?.Te ?? 50,
      Ti: percentages?.Ti ?? 50,
      Fe: percentages?.Fe ?? 50,
      Fi: percentages?.Fi ?? 50
    },
    axisScores,
    derivedType
  };
}

function buildComparisonFromDict(data) {
  const pI = data.EI !== undefined ? data.EI : (data.I ?? 50);
  const pS = data.NS !== undefined ? data.NS : (data.S ?? 50);
  const pF = data.TF !== undefined ? data.TF : (data.F ?? 50);
  const pP = data.JP !== undefined ? data.JP : (data.P ?? 50);
  return buildComparisonScores(pI, pS, pF, pP, {
    Ne: data.Ne ?? 50,
    Ni: data.Ni ?? 50,
    Se: data.Se ?? 50,
    Si: data.Si ?? 50,
    Te: data.Te ?? 50,
    Ti: data.Ti ?? 50,
    Fe: data.Fe ?? 50,
    Fi: data.Fi ?? 50
  });
}

/**
 * Robustly parses another person's result link or vector.
 * Supports:
 * 1. 8Func standard results URL /results/EI=../NS=../
 * 2. 12Axes result URLs (?est=..&rep=.. or /compare/people?a=..&b=..)
 * 3. Comma-separated 12-value lists
 * 4. Query string or segment parameters (EI=..&NS=..)
 */
export function parseComparisonInputLink(linkStr) {
  if (!linkStr) return null;
  const decoded = decodeURIComponent(String(linkStr).trim());

  // 1. Direct standard 8Func path check
  const standard = parseResultsUrlPath(decoded);
  if (standard) return standard;

  // 2. URL parsing (handling query params, hashes, 12Axes URLs, nested b= or a= params)
  const urlObj = (() => {
    try {
      return new URL(decoded, "https://8func.com");
    } catch (e) {
      return null;
    }
  })();

  if (urlObj) {
    const p = urlObj.searchParams;

    // Check if b= or a= is present (nested URL or comma list from 12Axes compare)
    const nested = p.get("b") || p.get("a");
    if (nested && nested !== decoded) {
      const nestedParsed = parseComparisonInputLink(nested);
      if (nestedParsed) return nestedParsed;
    }

    // Check 12Axes standard query params (est, rep, pod, imi, dip, int, eco, con, com, rel, mor, tec)
    if (p.has("est") || p.has("rep") || p.has("eco") || p.has("pod")) {
      const pEI = Math.max(0, Math.min(100, Math.round(parseFloat(p.get("est") || 50))));
      const pNS = Math.max(0, Math.min(100, Math.round(parseFloat(p.get("rep") || 50))));
      const pTF = Math.max(0, Math.min(100, Math.round(parseFloat(p.get("pod") || 50))));
      const pJP = Math.max(0, Math.min(100, Math.round(parseFloat(p.get("imi") || 50))));
      return buildComparisonScores(pEI, pNS, pTF, pJP, {
        Ne: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("dip") || 50)))),
        Ni: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("int") || 50)))),
        Se: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("eco") || 50)))),
        Si: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("con") || 50)))),
        Te: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("com") || 50)))),
        Ti: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("rel") || 50)))),
        Fe: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("mor") || 50)))),
        Fi: Math.max(0, Math.min(100, Math.round(parseFloat(p.get("tec") || 50))))
      });
    }

    // Check query params with EI=, NS=, etc.
    if (p.has("EI") || p.has("NS") || p.has("I") || p.has("E")) {
      const data = {};
      for (const [k, v] of p.entries()) {
        const n = parseFloat(v);
        if (!isNaN(n)) data[k] = Math.max(0, Math.min(100, Math.round(n)));
      }
      return buildComparisonFromDict(data);
    }
  }

  // 3. Comma-separated numerical values (12 numbers)
  if (decoded.includes(",")) {
    const nums = decoded.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length >= 4) {
      const pEI = Math.max(0, Math.min(100, Math.round(nums[0] ?? 50)));
      const pNS = Math.max(0, Math.min(100, Math.round(nums[1] ?? 50)));
      const pTF = Math.max(0, Math.min(100, Math.round(nums[2] ?? 50)));
      const pJP = Math.max(0, Math.min(100, Math.round(nums[3] ?? 50)));
      const funcs = {
        Ne: Math.max(0, Math.min(100, Math.round(nums[4] ?? 50))),
        Ni: Math.max(0, Math.min(100, Math.round(nums[5] ?? 50))),
        Se: Math.max(0, Math.min(100, Math.round(nums[6] ?? 50))),
        Si: Math.max(0, Math.min(100, Math.round(nums[7] ?? 50))),
        Te: Math.max(0, Math.min(100, Math.round(nums[8] ?? 50))),
        Ti: Math.max(0, Math.min(100, Math.round(nums[9] ?? 50))),
        Fe: Math.max(0, Math.min(100, Math.round(nums[10] ?? 50))),
        Fi: Math.max(0, Math.min(100, Math.round(nums[11] ?? 50)))
      };
      return buildComparisonScores(pEI, pNS, pTF, pJP, funcs);
    }
  }

  // 4. Raw key-value segments like EI=60/NS=40/... without leading /results/
  if (decoded.includes("=") && (decoded.includes("EI=") || decoded.includes("NS="))) {
    const parts = decoded.split(/[\/\s&]+/).filter(Boolean);
    const data = {};
    parts.forEach(p => {
      const [k, v] = p.split("=");
      if (k && v !== undefined) {
        const num = parseFloat(v);
        if (!isNaN(num)) data[k] = Math.max(0, Math.min(100, Math.round(num)));
      }
    });
    if (Object.keys(data).length >= 4) {
      return buildComparisonFromDict(data);
    }
  }

  return null;
}

