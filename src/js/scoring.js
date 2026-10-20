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

export const AXIS_FUNCTION_MAP = {
  EI: {
    poleA: "E",
    poleB: "I",
    funcsA: ["Ne", "Se", "Te", "Fe"],
    funcsB: ["Ni", "Si", "Ti", "Fi"]
  },
  NS: {
    poleA: "N",
    poleB: "S",
    funcsA: ["Ne", "Ni"],
    funcsB: ["Se", "Si"]
  },
  TF: {
    poleA: "T",
    poleB: "F",
    funcsA: ["Te", "Ti"],
    funcsB: ["Fe", "Fi"]
  },
  JP: {
    poleA: "J",
    poleB: "P",
    funcsA: ["Te", "Fe", "Ni", "Si"],
    funcsB: ["Ne", "Se", "Ti", "Fi"]
  }
};

/**
 * Calculates axis dichotomy scores and 8 independent cognitive function agreement scores.
 * 
 * @param {Array} questions - Active questions list
 * @param {Object} answers - Map { [questionId]: "STRONGLY_AGREE" | "AGREE" | ... }
 */
export function calculateScores(questions, answers) {
  // Total answered tracking
  let answeredCount = 0;
  let agreeCount = 0;
  let disagreeCount = 0;
  let neutralCount = 0;

  // Axis contributions and assigned counts
  const axisContributions = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  const axisAssignedAnswered = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  // Function sum of responses and count per function
  const functionResponseSums = {};
  const functionAnsweredCounts = {};
  FUNCTIONS_LIST.forEach(f => {
    functionResponseSums[f] = 0;
    functionAnsweredCounts[f] = 0;
  });

  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;

    if (q.format === "wouldYouRather") {
      answeredCount++;
      const selectedOption = (q.options || []).find(o => o.id === ansKey);
      if (selectedOption) {
        agreeCount++;
        const targetPole = selectedOption.pole;
        if (q.category === "axis") {
          axisContributions[targetPole] = (axisContributions[targetPole] || 0) + 1.0;
          axisAssignedAnswered[targetPole] = (axisAssignedAnswered[targetPole] || 0) + 1;
        } else if (q.category === "function") {
          if (functionResponseSums[targetPole] !== undefined) {
            functionResponseSums[targetPole] += 1.0;
            functionAnsweredCounts[targetPole]++;
          }
        }
      }
      return;
    }

    const val = (typeof ansKey === "number") ? ansKey : (ANSWER_VALUE_MAP[ansKey] ?? 0);
    answeredCount++;

    if (val > 0) agreeCount++;
    else if (val < 0) disagreeCount++;
    else neutralCount++;

    if (q.category === "axis") {
      const agreePole = q.agreementPole || q.target;
      const oppPole = q.oppositePole || q.opposite;
      // Track answered question assigned to its agreementPole
      if (axisAssignedAnswered[agreePole] !== undefined) {
        axisAssignedAnswered[agreePole]++;
      }

      // Positive value -> add |val| to agreementPole
      // Negative value -> add |val| to opposite pole
      if (val > 0) {
        axisContributions[agreePole] = (axisContributions[agreePole] || 0) + Math.abs(val);
      } else if (val < 0) {
        axisContributions[oppPole] = (axisContributions[oppPole] || 0) + Math.abs(val);
      }
    } else if (q.category === "function" || q.functionId || q.target) {
      const f = q.target || q.functionId || q.agreementPole;
      if (functionResponseSums[f] !== undefined) {
        functionResponseSums[f] += val;
        functionAnsweredCounts[f]++;
      }
    }
  });

  // ==========================================
  // Cognitive Functions Normalization
  // functionPct = ((meanResponse + 1) / 2) * 100
  // ==========================================
  const percentages = {};
  const precisePercentages = {};
  const insufficientData = {};

  FUNCTIONS_LIST.forEach(f => {
    const n = functionAnsweredCounts[f] || 0;
    const sum = functionResponseSums[f] || 0;

    let pct = 50.0;
    if (n > 0) {
      const meanResponse = sum / n;
      pct = ((meanResponse + 1.0) / 2.0) * 100.0;
      pct = Math.max(0.0, Math.min(100.0, pct));
    }

    precisePercentages[f] = pct;
    percentages[f] = Math.round(pct);
    insufficientData[f] = (n === 0);
  });

  // ==========================================
  // Axis Dimension Normalization (Integrated 70/30 Model)
  // Combines direct axis items (30%) and cognitive functions (70%):
  // - EI integrates E/I direct items and Ne, Se, Te, Fe vs Ni, Si, Ti, Fi
  // - NS integrates N/S direct items and Ne, Ni vs Se, Si
  // - TF integrates T/F direct items and Te, Ti vs Fe, Fi
  // - JP integrates J/P direct items and Te, Fe, Ni, Si vs Ne, Se, Ti, Fi
  // ==========================================
  const axisScores = {};
  const axisPercentages = {};

  AXIS_DIMENSIONS.forEach(dim => {
    const { poleA, poleB } = dim;
    const countA = axisAssignedAnswered[poleA] || 0;
    const countB = axisAssignedAnswered[poleB] || 0;
    const hasAxisQuestions = (countA > 0 || countB > 0);

    const meanA = countA > 0 ? (axisContributions[poleA] / countA) : 0;
    const meanB = countB > 0 ? (axisContributions[poleB] / countB) : 0;

    let axisPctA = 50.0;
    if (hasAxisQuestions) {
      axisPctA = 50.0 + 50.0 * (meanA - meanB) / 2.0;
      axisPctA = Math.max(0.0, Math.min(100.0, axisPctA));
    }

    const fMap = AXIS_FUNCTION_MAP[dim.id];
    let countFuncA = 0;
    let countFuncB = 0;
    let sumPctA = 0;
    let sumPctB = 0;

    fMap.funcsA.forEach(f => {
      sumPctA += precisePercentages[f];
      countFuncA += (functionAnsweredCounts[f] || 0);
    });
    fMap.funcsB.forEach(f => {
      sumPctB += precisePercentages[f];
      countFuncB += (functionAnsweredCounts[f] || 0);
    });

    const meanFuncA = sumPctA / fMap.funcsA.length;
    const meanFuncB = sumPctB / fMap.funcsB.length;
    const hasFuncQuestions = (countFuncA > 0 || countFuncB > 0);

    let funcPctA = 50.0;
    if (hasFuncQuestions) {
      // Direct net difference without artificial halving
      funcPctA = 50.0 + (meanFuncA - meanFuncB);
      funcPctA = Math.max(0.0, Math.min(100.0, funcPctA));
    }

    let finalPctA = 50.0;
    if (hasAxisQuestions && hasFuncQuestions) {
      // Configured 70% cognitive function substrate + 30% direct self-report
      finalPctA = 0.30 * axisPctA + 0.70 * funcPctA;
    } else if (hasAxisQuestions) {
      finalPctA = axisPctA;
    } else if (hasFuncQuestions) {
      finalPctA = funcPctA;
    } else {
      finalPctA = 50.0;
    }
    finalPctA = Math.max(0.0, Math.min(100.0, finalPctA));
    const finalPctB = 100.0 - finalPctA;

    axisScores[dim.id] = {
      dimension: dim.id,
      poleA,
      poleB,
      meanA,
      meanB,
      countA,
      countB,
      axisPctA,
      axisPctB: 100.0 - axisPctA,
      funcPctA,
      funcPctB: 100.0 - funcPctA,
      pctA: finalPctA,
      pctB: finalPctB,
      roundA: Math.round(finalPctA),
      roundB: Math.round(finalPctB),
      dominant: (finalPctA >= finalPctB) ? poleA : poleB
    };

    axisPercentages[poleA] = Math.round(finalPctA);
    axisPercentages[poleB] = Math.round(finalPctB);
  });

  // Calculate 4-letter type directly from the 4 integrated axis dimensions
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
    rawScores: functionResponseSums,
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
