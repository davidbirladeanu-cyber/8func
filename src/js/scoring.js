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

/**
 * Calculates axis dichotomy scores and 8 cognitive functions via a clean, calibrated cumulative engine.
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
  FUNCTIONS_LIST.forEach(f => {
    functionSums[f] = 0;
    functionWeights[f] = 0;
    functionDirectPoints[f] = 0;
  });

  // Cumulative sums and weights for the 4 MBTI Spectrum axes
  const axisSums = { EI: 0, NS: 0, TF: 0, JP: 0 };
  const axisWeights = { EI: 0, NS: 0, TF: 0, JP: 0 };
  const axisDirectPoints = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  const letterWeights = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  // Combination tracking (NT, NF, ST, SF, IJ, IP, EP, EJ)
  const comboSums = { NT: 0, NF: 0, ST: 0, SF: 0, IJ: 0, IP: 0, EP: 0, EJ: 0 };
  const comboWeights = { NT: 0, NF: 0, ST: 0, SF: 0, IJ: 0, IP: 0, EP: 0, EJ: 0 };

  questions.forEach(q => {
    const ansKey = answers[q.id];
    if (ansKey === undefined || ansKey === null) return;
    answeredCount++;

    const baseWeight = 1.0;

    let val = 0;
    let targetPole = null;
    let fOpp = null;

    if (q.format === "wouldYouRather" || q.format === "direct") {
      const selectedOption = (q.options || []).find(o => o.id === ansKey);
      if (!selectedOption) return;

      agreeCount++;
      targetPole = selectedOption.pole;
      val = 1.0;
      const unselected = (q.options || []).find(o => o.id !== ansKey);
      fOpp = unselected ? unselected.pole : (q.oppositePole || null);

      if (["E", "I", "N", "S", "T", "F", "J", "P"].includes(targetPole)) {
        const dimId = ["E", "I"].includes(targetPole) ? "EI" :
                      ["N", "S"].includes(targetPole) ? "NS" :
                      ["T", "F"].includes(targetPole) ? "TF" : "JP";
        const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
        const signedVal = (targetPole === dim.poleA ? 1.0 : -1.0);

        axisSums[dimId] += signedVal * baseWeight;
        axisWeights[dimId] += baseWeight;
        axisDirectPoints[targetPole] += baseWeight;
        letterWeights[targetPole] += baseWeight;
      } else if (FUNCTIONS_LIST.includes(targetPole)) {
        functionSums[targetPole] += val * baseWeight;
        functionWeights[targetPole] += baseWeight;
        functionDirectPoints[targetPole] += val * baseWeight;
      } else if (comboSums[targetPole] !== undefined) {
        // Two-letter combination option in WYR
        comboSums[targetPole] += val * baseWeight;
        comboWeights[targetPole] += baseWeight;

        // Adds +1.0 to both constituent letters
        const [l1, l2] = targetPole.split("");
        [l1, l2].forEach(l => {
          axisDirectPoints[l] += baseWeight;
          letterWeights[l] += baseWeight;
          const dimId = ["E", "I"].includes(l) ? "EI" :
                        ["N", "S"].includes(l) ? "NS" :
                        ["T", "F"].includes(l) ? "TF" : "JP";
          const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
          const signedVal = (l === dim.poleA ? 1.0 : -1.0);
          axisSums[dimId] += signedVal * baseWeight * 0.5;
          axisWeights[dimId] += baseWeight * 0.5;
        });
      }
    } else {
      // 5-point agreement scale
      val = (typeof ansKey === "number") ? ansKey : (ANSWER_VALUE_MAP[ansKey] ?? 0);
      if (val > 0) agreeCount++;
      else if (val < 0) disagreeCount++;
      else neutralCount++;

      targetPole = q.agreementPole || q.target;
      fOpp = q.oppositePole || q.opposite;

      if (q.category === "axis" || ["E", "I", "N", "S", "T", "F", "J", "P"].includes(targetPole)) {
        const dimId = q.dimension || (
          ["E", "I"].includes(targetPole) ? "EI" :
          ["N", "S"].includes(targetPole) ? "NS" :
          ["T", "F"].includes(targetPole) ? "TF" : "JP"
        );
        const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
        const signedVal = (targetPole === dim.poleA ? val : -val);

        axisSums[dimId] += signedVal * baseWeight;
        axisWeights[dimId] += baseWeight;
        if (signedVal > 0) {
          axisDirectPoints[dim.poleA] += Math.abs(signedVal) * baseWeight;
        } else if (signedVal < 0) {
          axisDirectPoints[dim.poleB] += Math.abs(signedVal) * baseWeight;
        }
        letterWeights[dim.poleA] += baseWeight;
        letterWeights[dim.poleB] += baseWeight;
      } else if (q.category === "function" || FUNCTIONS_LIST.includes(targetPole)) {
        functionSums[targetPole] += val * baseWeight;
        functionWeights[targetPole] += baseWeight;
        functionDirectPoints[targetPole] += val * baseWeight;
      } else if (q.category === "combination" || comboSums[targetPole] !== undefined) {
        // Two-letter combination item (NT, NF, ST, SF, IJ, IP, EP, EJ)
        const combo = targetPole;
        const oppCombo = fOpp || COMBO_OPPOSITES[combo];
        comboSums[combo] += val * baseWeight;
        comboWeights[combo] += baseWeight;

        const [l1, l2] = combo.split("");
        const [o1, o2] = oppCombo.split("");

        if (val > 0) {
          axisDirectPoints[l1] += Math.abs(val) * baseWeight;
          axisDirectPoints[l2] += Math.abs(val) * baseWeight;
        } else if (val < 0) {
          axisDirectPoints[o1] += Math.abs(val) * baseWeight;
          axisDirectPoints[o2] += Math.abs(val) * baseWeight;
        }
        letterWeights[l1] += baseWeight;
        letterWeights[l2] += baseWeight;
        letterWeights[o1] += baseWeight;
        letterWeights[o2] += baseWeight;

        // Propagate half-weight to the underlying axis dimensions
        [l1, l2].forEach(l => {
          const dimId = ["E", "I"].includes(l) ? "EI" :
                        ["N", "S"].includes(l) ? "NS" :
                        ["T", "F"].includes(l) ? "TF" : "JP";
          const dim = AXIS_DIMENSIONS.find(d => d.id === dimId);
          const signedVal = (l === dim.poleA ? val : -val);
          axisSums[dimId] += signedVal * baseWeight * 0.5;
          axisWeights[dimId] += baseWeight * 0.5;
        });
      }
    }
  });

  // Cross-synthesis: Temperament (NT/NF/ST/SF) x Orientation (IJ/IP/EP/EJ)
  const temperaments = ["NT", "NF", "ST", "SF"];
  const orientations = ["IJ", "IP", "EP", "EJ"];

  temperaments.forEach(temp => {
    orientations.forEach(ori => {
      const key = `${temp}+${ori}`;
      const mapping = TYPE_FUNCTION_PAIRS[key];
      if (!mapping) return;

      const meanTemp = comboWeights[temp] > 0 ? (comboSums[temp] / comboWeights[temp]) : 0;
      const meanOri = comboWeights[ori] > 0 ? (comboSums[ori] / comboWeights[ori]) : 0;

      if (meanTemp > 0 && meanOri > 0) {
        const boost = (meanTemp + meanOri) / 2.0;
        functionSums[mapping.dom] += boost * 1.2;
        functionWeights[mapping.dom] += 0.8;
        functionSums[mapping.aux] += boost * 0.8;
        functionWeights[mapping.aux] += 0.6;
      }
    });
  });

  // Single-letter convergence to cognitive functions
  const getLetterMean = (l) => letterWeights[l] > 0 ? (axisDirectPoints[l] / letterWeights[l]) : 0.0;
  const mI = getLetterMean("I"), mE = getLetterMean("E");
  const mN = getLetterMean("N"), mS = getLetterMean("S");
  const mT = getLetterMean("T"), mF = getLetterMean("F");
  const mJ = getLetterMean("J"), mP = getLetterMean("P");

  if (mI > mE && mN > mS && mJ > mP) {
    const niBoost = ((mI - mE) + (mN - mS) + (mJ - mP)) / 3.0;
    functionSums.Ni += niBoost * 0.8;
    functionWeights.Ni += 0.5;
  }
  if (mI > mE && mT > mF && mP > mJ) {
    const tiBoost = ((mI - mE) + (mT - mF) + (mP - mJ)) / 3.0;
    functionSums.Ti += tiBoost * 0.8;
    functionWeights.Ti += 0.5;
  }
  if (mE > mI && mT > mF && mJ > mP) {
    const teBoost = ((mE - mI) + (mT - mF) + (mJ - mP)) / 3.0;
    functionSums.Te += teBoost * 0.8;
    functionWeights.Te += 0.5;
  }
  if (mE > mI && mN > mS && mP > mJ) {
    const neBoost = ((mE - mI) + (mN - mS) + (mP - mJ)) / 3.0;
    functionSums.Ne += neBoost * 0.8;
    functionWeights.Ne += 0.5;
  }
  if (mI > mE && mF > mT && mP > mJ) {
    const fiBoost = ((mI - mE) + (mF - mT) + (mP - mJ)) / 3.0;
    functionSums.Fi += fiBoost * 0.8;
    functionWeights.Fi += 0.5;
  }
  if (mE > mI && mF > mT && mJ > mP) {
    const feBoost = ((mE - mI) + (mF - mT) + (mJ - mP)) / 3.0;
    functionSums.Fe += feBoost * 0.8;
    functionWeights.Fe += 0.5;
  }
  if (mI > mE && mS > mN && mJ > mP) {
    const siBoost = ((mI - mE) + (mS - mN) + (mJ - mP)) / 3.0;
    functionSums.Si += siBoost * 0.8;
    functionWeights.Si += 0.5;
  }
  if (mE > mI && mS > mN && mP > mJ) {
    const seBoost = ((mE - mI) + (mS - mN) + (mP - mJ)) / 3.0;
    functionSums.Se += seBoost * 0.8;
    functionWeights.Se += 0.5;
  }

  // Calculate cognitive functions percentages
  const percentages = {};
  const precisePercentages = {};
  const insufficientData = {};

  FUNCTIONS_LIST.forEach(f => {
    const totalW = functionWeights[f] || 0;
    const sum = functionSums[f] || 0;

    let pct = 50.0;
    if (totalW > 0) {
      const meanResponse = sum / totalW;
      pct = meanToPercent(meanResponse);
      pct = Math.max(0.0, Math.min(100.0, pct));
    }

    precisePercentages[f] = pct;
    percentages[f] = Math.round(pct);
    insufficientData[f] = (totalW === 0);
  });

  // Calculate 4 MBTI Spectrum axes
  const axisScores = {};
  const axisPercentages = {};

  // Cognitive Function Feedback to Axes
  const sumI = (precisePercentages.Ni + precisePercentages.Fi + precisePercentages.Si + precisePercentages.Ti) / 4.0;
  const sumE = (precisePercentages.Ne + precisePercentages.Fe + precisePercentages.Se + precisePercentages.Te) / 4.0;

  const extraJudging = (precisePercentages.Te + precisePercentages.Fe) / 2.0;
  const extraPerceiving = (precisePercentages.Ne + precisePercentages.Se) / 2.0;

  AXIS_DIMENSIONS.forEach(dim => {
    const { poleA, poleB, id } = dim;
    const dimConfig = AXIS_FUNCTION_MAP[id];

    // 1. Direct Axis questions
    const directW = axisWeights[id] || 0;
    const directSum = axisSums[id] || 0;
    let directPctA = 50.0;
    if (directW > 0) {
      const meanDirect = directSum / directW;
      directPctA = Math.max(0.0, Math.min(100.0, meanToPercent(meanDirect)));
    }
    const directPctB = 100.0 - directPctA;

    // 2. Cognitive Function Template
    const meanFuncA = dimConfig.funcsA.reduce((sum, f) => sum + precisePercentages[f], 0) / dimConfig.funcsA.length;
    const meanFuncB = dimConfig.funcsB.reduce((sum, f) => sum + precisePercentages[f], 0) / dimConfig.funcsB.length;
    const funcPctA = Math.max(0.0, Math.min(100.0, 50.0 + (meanFuncA - meanFuncB)));
    const funcPctB = 100.0 - funcPctA;

    // 3. Final Combined Axis Score: 70% Direct Axis Questions + 30% Function Template
    let finalPctA = 50.0;
    const totalFuncW = dimConfig.funcsA.concat(dimConfig.funcsB).reduce((sum, f) => sum + (functionWeights[f] || 0), 0);

    if (directW > 0 && totalFuncW > 0) {
      finalPctA = 0.70 * directPctA + 0.30 * funcPctA;
    } else if (directW > 0) {
      finalPctA = directPctA;
    } else if (totalFuncW > 0) {
      finalPctA = funcPctA;
    } else {
      finalPctA = 50.0;
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
      directPctA: Math.round(directPctA),
      directPctB: Math.round(directPctB),
      funcPctA: Math.round(funcPctA),
      funcPctB: Math.round(funcPctB),
      directPointsA: axisDirectPoints[poleA] || 0,
      directPointsB: axisDirectPoints[poleB] || 0,
      totalWeight: directW
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
 * Builds the results URL path in the format:
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
