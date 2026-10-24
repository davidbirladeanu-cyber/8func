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

export const COGNITIVE_STACKS = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Si'],
  ESFP: ['Se', 'Fi', 'Te', 'Si']
};

export const STACK_WEIGHTS = [1.0, 0.75, 0.5, 0.25];

export function calculateStackFit(type, functionPercentages) {
  const stack = COGNITIVE_STACKS[type];
  if (!stack) return 50;
  const weightedSum = stack.reduce((s, fn, idx) => s + STACK_WEIGHTS[idx] * (functionPercentages[fn] ?? 50), 0);
  return weightedSum / 2.5; // normalized 0..100
}

/**
 * Calculates axis dichotomy scores (Raport Real Normalizat) and 8 cognitive functions (Scor Likert 0-100%).
 * Features:
 * 1. Strict unipolar scoring for cognitive functions (no cross-function pollution).
 * 2. Separate measurement channels (axis items, function items, combination items).
 * 3. Reduced-weight disagreement mirroring on axes (55%) to prevent 4/3 item asymmetry.
 * 4. Grand-mean respondent centering to eliminate acquiescence ("agreeing to everything") bias.
 * 5. Weighted Jungian stack fit matching (60% stack fit + 40% axis letters fit).
 */
export function calculateScores(questions, answers) {
  let answeredCount = 0;
  let agreeCount = 0;
  let disagreeCount = 0;
  let neutralCount = 0;

  // Track raw Likert ratings across all answered items for personal baseline centering
  const allLikertValues = [];
  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;
    if (q.format !== "wouldYouRather" && q.format !== "direct") {
      let val = 50;
      if (typeof ansKey === "number") {
        if (ansKey >= -1.0 && ansKey <= 1.0) val = Math.max(0, Math.min(100, ((ansKey + 1.0) / 2.0) * 100.0));
        else val = Math.max(0, Math.min(100, ansKey));
      } else {
        val = LIKERT_SCORE_MAP[ansKey] ?? 50;
      }
      allLikertValues.push(val);
    }
  });

  const userMean = allLikertValues.length > 0
    ? (allLikertValues.reduce((a, b) => a + b, 0) / allLikertValues.length)
    : 50.0;

  // Apply personal mean-centering on cognitive functions when at least 4 Likert items were answered
  const userCenteringOffset = allLikertValues.length >= 4 ? (userMean - 50.0) : 0.0;

  // Pre-count axis questions per pole to calibrate 4/3 item balance
  const axisItemCounts = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  questions.forEach(q => {
    if (q.category === "axis" && q.target && axisItemCounts[q.target] !== undefined) {
      axisItemCounts[q.target]++;
    }
  });

  // Track raw weighted scores for cognitive functions (0 to 100)
  const functionScores = {};
  FUNCTIONS_LIST.forEach(f => {
    functionScores[f] = [];
  });

  // Track raw weighted scores for axis poles (0 to 100)
  const axisPoles = { E: [], I: [], N: [], S: [], T: [], F: [], J: [], P: [] };

  // Combination tracking (NT, NF, ST, SF, IJ, IP, EP, EJ)
  const comboScores = { NT: [], NF: [], ST: [], SF: [], IJ: [], IP: [], EP: [], EJ: [] };

  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;
    answeredCount++;

    if (q.format === "wouldYouRather" || q.format === "direct") {
      agreeCount++;
      const optA = q.options?.[0];
      const optB = q.options?.[1];
      const isA = (ansKey === optA?.id);
      const isB = (ansKey === optB?.id);

      const selPole = isA ? optA?.pole : (isB ? optB?.pole : null);
      const unselPole = isA ? optB?.pole : (isB ? optA?.pole : null);

      if (q.category === "axis" || ["E", "I", "N", "S", "T", "F", "J", "P"].includes(selPole)) {
        if (selPole && axisPoles[selPole]) axisPoles[selPole].push({ score: 100, weight: 1.0 });
        if (unselPole && axisPoles[unselPole]) axisPoles[unselPole].push({ score: 0, weight: 0.55 });
      } else if (q.category === "function" || FUNCTIONS_LIST.includes(selPole)) {
        // WYR for functions acts as a lightweight tie-breaker (weight 0.5); unselected pole is not penalized
        if (selPole && functionScores[selPole]) functionScores[selPole].push({ score: 100, weight: 0.5 });
      } else if (q.category === "combination" || comboScores[selPole]) {
        if (selPole && comboScores[selPole]) comboScores[selPole].push({ score: 100, weight: 0.5 });
        if (selPole && typeof selPole === "string" && selPole.length === 2) {
          const [l1, l2] = selPole.split("");
          if (axisPoles[l1]) axisPoles[l1].push({ score: 100, weight: 0.5 });
          if (axisPoles[l2]) axisPoles[l2].push({ score: 100, weight: 0.5 });
        }
      }
    } else {
      // 5-point Likert scale (0 - 100%)
      let scoreTarget = 50;
      if (typeof ansKey === "number") {
        if (ansKey >= -1.0 && ansKey <= 1.0) {
          scoreTarget = Math.max(0, Math.min(100, ((ansKey + 1.0) / 2.0) * 100.0));
        } else {
          scoreTarget = Math.max(0, Math.min(100, ansKey));
        }
      } else {
        scoreTarget = LIKERT_SCORE_MAP[ansKey] ?? 50;
      }

      if (scoreTarget > 50) agreeCount++;
      else if (scoreTarget < 50) disagreeCount++;
      else neutralCount++;

      const target = q.agreementPole || q.target;
      const opp = q.oppositePole || q.opposite;

      if (q.category === "axis" || ["E", "I", "N", "S", "T", "F", "J", "P"].includes(target)) {
        // Channel: Axis items score only axis letters
        // 4/3 pole balancing: balance weight so poles with 4 items vs 3 items have identical total weight
        const dimId = q.dimension || (["E", "I"].includes(target) ? "EI" : ["N", "S"].includes(target) ? "NS" : ["T", "F"].includes(target) ? "TF" : "JP");
        const dimConfig = AXIS_DIMENSIONS.find(d => d.id === dimId);
        let poleWeight = 1.0;
        if (dimConfig) {
          const countTarget = axisItemCounts[target] || 1;
          const countOpp = axisItemCounts[opp] || 1;
          if (countTarget !== countOpp && countTarget > 0 && countOpp > 0) {
            poleWeight = 3.5 / countTarget;
          }
        }

        if (target && axisPoles[target]) {
          axisPoles[target].push({ score: scoreTarget, weight: poleWeight });
        }
        if (opp && axisPoles[opp]) {
          const oppScore = 100 - scoreTarget;
          // Agreement mirrors at full weight; disagreement mirrors at reduced weight (55%)
          const oppWeight = scoreTarget >= 50 ? poleWeight : (poleWeight * 0.55);
          axisPoles[opp].push({ score: oppScore, weight: oppWeight });
        }
      } else if (q.category === "function" || FUNCTIONS_LIST.includes(target)) {
        // Channel: Function items are STRICTLY UNIPOLAR.
        // Agreement raises target function, disagreement lowers it.
        // Opposite function receives NOTHING (eliminates Si inflation on Ne disagreement).
        if (target && functionScores[target]) {
          functionScores[target].push({ score: scoreTarget, weight: 1.0 });
        }
      } else if (q.category === "combination" || comboScores[target]) {
        // Channel: Combinations score combination track and contribute 50% each to constituent letters
        if (target && comboScores[target]) {
          comboScores[target].push({ score: scoreTarget, weight: 1.0 });
        }
        if (target && typeof target === "string" && target.length === 2) {
          const [l1, l2] = target.split("");
          if (axisPoles[l1]) axisPoles[l1].push({ score: scoreTarget, weight: 0.5 });
          if (axisPoles[l2]) axisPoles[l2].push({ score: scoreTarget, weight: 0.5 });
        }
        if (opp && typeof opp === "string" && opp.length === 2) {
          const [ol1, ol2] = opp.split("");
          const oppScore = 100 - scoreTarget;
          const oppW = scoreTarget >= 50 ? 0.5 : (0.5 * 0.55);
          if (axisPoles[ol1]) axisPoles[ol1].push({ score: oppScore, weight: oppW });
          if (axisPoles[ol2]) axisPoles[ol2].push({ score: oppScore, weight: oppW });
        }
      }
    }
  });

  // 1. Calculate cognitive function percentages (unipolar + respondent centering)
  const percentages = {};
  const precisePercentages = {};
  const insufficientData = {};
  const functionSums = {};
  const functionWeights = {};
  const functionDirectPoints = {};

  FUNCTIONS_LIST.forEach(f => {
    const list = functionScores[f] || [];
    if (list.length > 0) {
      const totalW = list.reduce((a, b) => a + b.weight, 0);
      const rawMean = list.reduce((a, b) => a + b.score * b.weight, 0) / (totalW || 1);
      const centered = rawMean - userCenteringOffset;
      precisePercentages[f] = Math.max(0, Math.min(100, centered));
      percentages[f] = Math.round(precisePercentages[f]);
      insufficientData[f] = false;
      functionSums[f] = list.reduce((a, b) => a + b.score, 0);
      functionWeights[f] = list.length;
      functionDirectPoints[f] = rawMean;
    } else {
      precisePercentages[f] = 50.0;
      percentages[f] = 50;
      insufficientData[f] = true;
      functionSums[f] = 0;
      functionWeights[f] = 0;
      functionDirectPoints[f] = 50;
    }
  });

  // 2. Calculate 4 MBTI Spectrum axes via Raport Real Normalizat
  const axisScores = {};
  const axisPercentages = {};

  AXIS_DIMENSIONS.forEach(dim => {
    const { poleA, poleB, id } = dim;
    const listA = axisPoles[poleA] || [];
    const listB = axisPoles[poleB] || [];

    const totalWA = listA.reduce((a, b) => a + b.weight, 0);
    const totalWB = listB.reduce((a, b) => a + b.weight, 0);

    const rawMeanA = listA.length > 0 ? (listA.reduce((a, b) => a + b.score * b.weight, 0) / totalWA) : 50.0;
    const rawMeanB = listB.length > 0 ? (listB.reduce((a, b) => a + b.score * b.weight, 0) / totalWB) : 50.0;

    const sumMeans = rawMeanA + rawMeanB;
    let pctA = 50.0;
    let pctB = 50.0;

    if (sumMeans > 0) {
      pctA = (rawMeanA / sumMeans) * 100.0;
      pctB = 100.0 - pctA;
    }

    const roundA = Math.round(pctA);
    const roundB = 100 - roundA;

    axisScores[id] = {
      dimension: id,
      poleA,
      poleB,
      pctA,
      pctB,
      roundA,
      roundB,
      dominant: (pctA >= pctB) ? poleA : poleB,
      directPctA: roundA,
      directPctB: roundB,
      funcPctA: roundA,
      funcPctB: roundB,
      rawMeanA: Math.round(rawMeanA),
      rawMeanB: Math.round(rawMeanB),
      directPointsA: rawMeanA,
      directPointsB: rawMeanB,
      totalWeight: listA.length + listB.length
    };

    axisPercentages[poleA] = roundA;
    axisPercentages[poleB] = roundB;
  });

  // 3. Derived 4-letter type determined via weighted stack fit + axis alignment
  // 60% function stack fit + 40% axis letters alignment
  const typeRankings = Object.keys(COGNITIVE_STACKS).map(typeKey => {
    const stackFit = calculateStackFit(typeKey, percentages);
    const letters = typeKey.split("");
    const axisMatch = (
      (axisPercentages[letters[0]] ?? 50) +
      (axisPercentages[letters[1]] ?? 50) +
      (axisPercentages[letters[2]] ?? 50) +
      (axisPercentages[letters[3]] ?? 50)
    ) / 4.0;
    const rawFinalScore = 0.60 * stackFit + 0.40 * axisMatch;
    return {
      type: typeKey,
      stackFit: Math.round(stackFit),
      axisMatch: Math.round(axisMatch),
      finalScore: Math.round(rawFinalScore),
      rawFinalScore
    };
  });
  typeRankings.sort((a, b) => b.rawFinalScore - a.rawFinalScore);

  const derivedType = answeredCount > 0
    ? typeRankings[0].type
    : `${axisScores.EI.dominant}${axisScores.NS.dominant}${axisScores.TF.dominant}${axisScores.JP.dominant}`;

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
    typeRankings,
    rawScores: percentages,
    functionSums,
    functionWeights,
    functionDirectPoints,
    percentages,
    precisePercentages,
    insufficientData,
    acquiescenceWarning,
    userMeanLikert: Math.round(userMean),
    answeredCount,
    totalQuestions: questions.length,
    isComplete
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
    }
  };
}
