/**
 * 8Func - Data-Driven Scoring Engine
 * 
 * Answer Scale:
 * - Strongly Agree:  1.0
 * - Agree:           0.5
 * - Neutral:         0.0
 * - Disagree:       -0.5
 * - Strongly Disagree: -1.0
 * 
 * Scoring Rules:
 * - Positive answer: add |value| to question.agreementPole
 * - Negative answer: add |value| to question.opposite
 * - Neutral answer: contributes 0
 * - Unanswered questions are excluded from denominators
 * 
 * Axis Normalization:
 * - meanA = sumContributionA / answeredCountAssignedToA
 * - meanB = sumContributionB / answeredCountAssignedToB
 * - poleA_pct = 50 + 50 * (meanA - meanB) / 2 (clamped to 0..100)
 * - poleB_pct = 100 - poleA_pct
 * 
 * Cognitive Functions Normalization:
 * - meanResponse = sum(answerValue) / answeredCountForFunction
 * - functionPct = ((meanResponse + 1) / 2) * 100 (clamped to 0..100)
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

export const FUNCTION_AXIS_MAP = {
  Ne: { EI: 1, NS: 1, JP: -1 },
  Ni: { EI: -1, NS: 1, JP: 1 },
  Se: { EI: 1, NS: -1, JP: -1 },
  Si: { EI: -1, NS: -1, JP: 1 },
  Te: { EI: 1, TF: 1, JP: 1 },
  Ti: { EI: -1, TF: 1, JP: -1 },
  Fe: { EI: 1, TF: -1, JP: 1 },
  Fi: { EI: -1, TF: -1, JP: -1 }
};

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
    posFuncs: ["Ni", "Si", "Te", "Fe"],
    negFuncs: ["Ne", "Se", "Ti", "Fi"],
    funcsA: ["Te", "Fe", "Ni", "Si"],
    funcsB: ["Ne", "Se", "Ti", "Fi"]
  }
};

/**
 * Calculates axis dichotomy scores and 8 cognitive functions via a pure cumulative model.
 * Every question answered casts its exact points and weights directly into the totals.
 * No arbitrary 70%/30% percentage blending is used.
 * 
 * @param {Array} questions - Active questions list
 * @param {Object} answers - Map { [questionId]: "STRONGLY_AGREE" | "AGREE" | ... }
 */
export function calculateScores(questions, answers) {
  let answeredCount = 0;
  let agreeCount = 0;
  let disagreeCount = 0;
  let neutralCount = 0;

  // Cumulative sums and weights for the 8 cognitive functions
  const functionSums = {};
  const functionWeights = {};
  const functionDirectPoints = {};
  const functionAxisPoints = {};
  FUNCTIONS_LIST.forEach(f => {
    functionSums[f] = 0;
    functionWeights[f] = 0;
    functionDirectPoints[f] = 0;
    functionAxisPoints[f] = 0;
  });

  // Cumulative sums and weights for the 4 MBTI Spectrum axes
  const axisSums = { EI: 0, NS: 0, TF: 0, JP: 0 };
  const axisWeights = { EI: 0, NS: 0, TF: 0, JP: 0 };
  const axisDirectPoints = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  const axisFuncPoints = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;
    answeredCount++;

    const weight = (typeof q.weight === "number") ? q.weight : 1.0;

    if (q.format === "wouldYouRather" || q.format === "direct") {
      const selectedOption = (q.options || []).find(o => o.id === ansKey);
      if (!selectedOption) return;

      agreeCount++;
      const targetPole = selectedOption.pole;

      if (q.category === "axis") {
        const dimId = q.dimension || (
          ["E", "I"].includes(targetPole) ? "EI" :
          ["N", "S"].includes(targetPole) ? "NS" :
          ["T", "F"].includes(targetPole) ? "TF" : "JP"
        );
        const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
        const signedVal = (targetPole === dim.poleA ? 1.0 : -1.0) * weight;

        axisSums[dimId] += signedVal;
        axisWeights[dimId] += weight;
        if (signedVal > 0) axisDirectPoints[dim.poleA] += Math.abs(signedVal);
        else axisDirectPoints[dim.poleB] += Math.abs(signedVal);

        // Ripple to associated cognitive functions
        const fMap = AXIS_FUNCTION_MAP[dimId];
        if (fMap) {
          fMap.posFuncs.forEach(f => {
            functionSums[f] += signedVal;
            functionWeights[f] += weight;
            functionAxisPoints[f] += signedVal;
          });
          fMap.negFuncs.forEach(f => {
            functionSums[f] -= signedVal;
            functionWeights[f] += weight;
            functionAxisPoints[f] -= signedVal;
          });
        }
      } else if (q.category === "function") {
        const fTarget = targetPole;
        const unselected = (q.options || []).find(o => o.id !== ansKey);
        const fOpp = unselected ? unselected.pole : (q.oppositePole || null);

        // Target function gains positive points
        functionSums[fTarget] += 1.0 * weight;
        functionWeights[fTarget] += weight;
        functionDirectPoints[fTarget] += 1.0 * weight;

        // Bipolar deduction: opposing function receives negative points
        if (fOpp && functionSums[fOpp] !== undefined) {
          functionSums[fOpp] -= 1.0 * weight;
          functionWeights[fOpp] += weight;
          functionDirectPoints[fOpp] -= 1.0 * weight;
        }

        // Ripple to MBTI axes
        const aMap = FUNCTION_AXIS_MAP[fTarget];
        if (aMap) {
          Object.entries(aMap).forEach(([dimId, dir]) => {
            const impact = dir * 1.0 * weight;
            axisSums[dimId] += impact;
            axisWeights[dimId] += weight;
            const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
            if (impact > 0) axisFuncPoints[dim.poleA] += impact;
            else if (impact < 0) axisFuncPoints[dim.poleB] += Math.abs(impact);
          });
        }
      }
      return;
    }

    // Likert Scale (-1.0 to +1.0)
    const val = (typeof ansKey === "number") ? ansKey : (ANSWER_VALUE_MAP[ansKey] ?? 0);
    if (val > 0) agreeCount++;
    else if (val < 0) disagreeCount++;
    else neutralCount++;

    if (q.category === "axis") {
      const dimId = q.dimension || (
        ["E", "I"].includes(q.target || q.agreementPole) ? "EI" :
        ["N", "S"].includes(q.target || q.agreementPole) ? "NS" :
        ["T", "F"].includes(q.target || q.agreementPole) ? "TF" : "JP"
      );
      const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
      const agreePole = q.agreementPole || q.target;
      const signedVal = (agreePole === dim.poleA ? val : -val) * weight;

      axisSums[dimId] += signedVal;
      axisWeights[dimId] += weight;
      if (signedVal > 0) axisDirectPoints[dim.poleA] += Math.abs(signedVal);
      else if (signedVal < 0) axisDirectPoints[dim.poleB] += Math.abs(signedVal);

      // Ripple to associated cognitive functions
      const fMap = AXIS_FUNCTION_MAP[dimId];
      if (fMap) {
        fMap.posFuncs.forEach(f => {
          functionSums[f] += signedVal;
          functionWeights[f] += weight;
          functionAxisPoints[f] += signedVal;
        });
        fMap.negFuncs.forEach(f => {
          functionSums[f] -= signedVal;
          functionWeights[f] += weight;
          functionAxisPoints[f] -= signedVal;
        });
      }
    } else if (q.category === "function" || q.functionId || q.target) {
      const fTarget = q.target || q.functionId || q.agreementPole;
      const fOpp = q.oppositePole || q.opposite;

      // Target function receives signed value
      if (functionSums[fTarget] !== undefined) {
        functionSums[fTarget] += val * weight;
        functionWeights[fTarget] += weight;
        functionDirectPoints[fTarget] += val * weight;
      }

      // Bipolar deduction: opposing function receives inverse signed value
      if (fOpp && functionSums[fOpp] !== undefined) {
        functionSums[fOpp] -= val * weight;
        functionWeights[fOpp] += weight;
        functionDirectPoints[fOpp] -= val * weight;
      }

      // Ripple to MBTI axes
      const aMap = FUNCTION_AXIS_MAP[fTarget];
      if (aMap) {
        Object.entries(aMap).forEach(([dimId, dir]) => {
          const impact = dir * val * weight;
          axisSums[dimId] += impact;
          axisWeights[dimId] += weight;
          const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
          if (impact > 0) axisFuncPoints[dim.poleA] += impact;
          else if (impact < 0) axisFuncPoints[dim.poleB] += Math.abs(impact);
        });
      }
    }
  });

  // ==========================================
  // Cognitive Functions Cumulative Normalization
  // functionPct = ((meanResponse + 1) / 2) * 100
  // ==========================================
  const percentages = {};
  const precisePercentages = {};
  const insufficientData = {};

  FUNCTIONS_LIST.forEach(f => {
    const totalW = functionWeights[f] || 0;
    const sum = functionSums[f] || 0;

    let pct = 50.0;
    if (totalW > 0) {
      const meanResponse = sum / totalW;
      pct = ((meanResponse + 1.0) / 2.0) * 100.0;
      pct = Math.max(0.0, Math.min(100.0, pct));
    }

    precisePercentages[f] = pct;
    percentages[f] = Math.round(pct);
    insufficientData[f] = (totalW === 0);
  });

  // ==========================================
  // Axis Dimension Cumulative Normalization (Pure Cumulative Model)
  // Axis percentage derived directly from cumulative signed points and total weights.
  // No arbitrary 70%/30% or 60%/40% percentage blending!
  // ==========================================
  const axisScores = {};
  const axisPercentages = {};

  AXIS_DIMENSIONS.forEach(dim => {
    const { poleA, poleB, id } = dim;
    const totalW = axisWeights[id] || 0;
    const sum = axisSums[id] || 0;

    let finalPctA = 50.0;
    if (totalW > 0) {
      const meanAxis = sum / totalW;
      finalPctA = ((meanAxis + 1.0) / 2.0) * 100.0;
      finalPctA = Math.max(0.0, Math.min(100.0, finalPctA));
    }
    finalPctA = Math.max(0.0, Math.min(100.0, finalPctA));
    const finalPctB = 100.0 - finalPctA;

    axisScores[id] = {
      dimension: id,
      poleA,
      poleB,
      pctA: finalPctA,
      pctB: finalPctB,
      roundA: Math.round(finalPctA),
      roundB: Math.round(finalPctB),
      dominant: (finalPctA >= finalPctB) ? poleA : poleB,
      directPointsA: axisDirectPoints[poleA] || 0,
      directPointsB: axisDirectPoints[poleB] || 0,
      funcPointsA: axisFuncPoints[poleA] || 0,
      funcPointsB: axisFuncPoints[poleB] || 0,
      totalWeight: totalW
    };

    axisPercentages[poleA] = Math.round(finalPctA);
    axisPercentages[poleB] = Math.round(finalPctB);
  });

  // Calculate 4-letter type directly from the 4 cumulative axis dimensions
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
    rawScores: functionSums,
    functionSums,
    functionWeights,
    functionDirectPoints,
    functionAxisPoints,
    percentages,
    precisePercentages,
    insufficientData,
    acquiescenceWarning,
    answeredCount,
    totalQuestions: questions.length,
    isComplete
  };
}

/**
 * Builds the results URL path in the format requested by the user:
 * /results/I=80/E=80/N=80/S=80/T=80/F=80/J=80/P=80/Ne=80/Ni=80/Se=80/Si=80/Te=80/Ti=80/Fe=80/Fi=80/
 */
export function buildResultsUrlPath(axisScores, percentages) {
  const I = axisScores?.EI ? (axisScores.EI.roundB ?? Math.round(axisScores.EI.pctB)) : 50;
  const E = axisScores?.EI ? (axisScores.EI.roundA ?? Math.round(axisScores.EI.pctA)) : 50;
  const N = axisScores?.NS ? (axisScores.NS.roundA ?? Math.round(axisScores.NS.pctA)) : 50;
  const S = axisScores?.NS ? (axisScores.NS.roundB ?? Math.round(axisScores.NS.pctB)) : 50;
  const T = axisScores?.TF ? (axisScores.TF.roundA ?? Math.round(axisScores.TF.pctA)) : 50;
  const F = axisScores?.TF ? (axisScores.TF.roundB ?? Math.round(axisScores.TF.pctB)) : 50;
  const J = axisScores?.JP ? (axisScores.JP.roundA ?? Math.round(axisScores.JP.pctA)) : 50;
  const P = axisScores?.JP ? (axisScores.JP.roundB ?? Math.round(axisScores.JP.pctB)) : 50;

  const Ne = percentages?.Ne ?? 50;
  const Ni = percentages?.Ni ?? 50;
  const Se = percentages?.Se ?? 50;
  const Si = percentages?.Si ?? 50;
  const Te = percentages?.Te ?? 50;
  const Ti = percentages?.Ti ?? 50;
  const Fe = percentages?.Fe ?? 50;
  const Fi = percentages?.Fi ?? 50;

  return `/results/I=${I}/E=${E}/N=${N}/S=${S}/T=${T}/F=${F}/J=${J}/P=${P}/Ne=${Ne}/Ni=${Ni}/Se=${Se}/Si=${Si}/Te=${Te}/Ti=${Ti}/Fe=${Fe}/Fi=${Fi}/`;
}

/**
 * Parses a results URL path and extracts the 16 score percentages
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

  const keys = ["I", "E", "N", "S", "T", "F", "J", "P", "Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];
  const hasKeys = keys.some(k => data[k] !== undefined);
  if (!hasKeys) return null;

  return data;
}
