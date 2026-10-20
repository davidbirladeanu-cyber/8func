/**
 * 8Func - Jungian Archetypes & Cognitive Stacks
 * Realistic Prototype Vector Matching Algorithm
 */

export const MBTI_TYPES = {
  // Analysts (NT)
  INTJ: {
    code: "INTJ",
    title: "Architect",
    subtitle: "Strategic Thinker",
    stack: ["Ni", "Te", "Fi", "Se"],
    shadow: ["Ne", "Ti", "Fe", "Si"],
    quote: "I synthesize complex variables into a single long-term trajectory and execute the plan with disciplined focus.",
    description: "Imaginative and strategic thinkers, with a plan for everything.",
    strengths: "Strategic foresight, structured discipline, ambitious vision."
  },
  INTP: {
    code: "INTP",
    title: "Logician",
    subtitle: "Innovative Inventor",
    stack: ["Ti", "Ne", "Si", "Fe"],
    shadow: ["Te", "Ni", "Se", "Fi"],
    quote: "I deconstruct systems to their foundational principles, seeking absolute internal logical consistency.",
    description: "Innovative inventors with an unquenchable thirst for knowledge.",
    strengths: "Rigorous logical analysis, theoretical curiosity, objective inquiry."
  },
  ENTJ: {
    code: "ENTJ",
    title: "Commander",
    subtitle: "Decisive Leader",
    stack: ["Te", "Ni", "Se", "Fi"],
    shadow: ["Ti", "Ne", "Si", "Fe"],
    quote: "I organize resources, build efficient structures, and make decisive calls to turn vision into measurable reality.",
    description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one.",
    strengths: "Decisive leadership, systemic efficiency, goal execution."
  },
  ENTP: {
    code: "ENTP",
    title: "Debater",
    subtitle: "Curious Thinker",
    stack: ["Ne", "Ti", "Fe", "Si"],
    shadow: ["Ni", "Te", "Fi", "Se"],
    quote: "I explore unexpected connections and challenge established rules to discover novel frontiers of what could be.",
    description: "Smart and curious thinkers who cannot resist an intellectual challenge.",
    strengths: "Divergent ideation, intellectual agility, rapid pattern-spotting."
  },

  // Diplomats (NF)
  INFJ: {
    code: "INFJ",
    title: "Advocate",
    subtitle: "Inspiring Idealist",
    stack: ["Ni", "Fe", "Ti", "Se"],
    shadow: ["Ne", "Fi", "Te", "Si"],
    quote: "I perceive underlying human patterns and dedicate my insight toward profound, compassionate growth.",
    description: "Quiet and mystical, yet very inspiring and tireless idealists.",
    strengths: "Psychological insight, altruistic purpose, conceptual depth."
  },
  INFP: {
    code: "INFP",
    title: "Mediator",
    subtitle: "Poetic Altruist",
    stack: ["Fi", "Ne", "Si", "Te"],
    shadow: ["Fe", "Ni", "Se", "Ti"],
    quote: "I seek authentic personal meaning and stay uncompromisingly true to my internal moral compass.",
    description: "Poetic, kind and altruistic people, always eager to help a good cause.",
    strengths: "Moral integrity, empathetic depth, authentic individuality."
  },
  ENFJ: {
    code: "ENFJ",
    title: "Protagonist",
    subtitle: "Charismatic Leader",
    stack: ["Fe", "Ni", "Se", "Ti"],
    shadow: ["Fi", "Ne", "Si", "Te"],
    quote: "I build collective harmony and inspire communities toward shared, noble aspirations.",
    description: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
    strengths: "Empathetic communication, social leadership, consensus building."
  },
  ENFP: {
    code: "ENFP",
    title: "Campaigner",
    subtitle: "Sociable Free Spirit",
    stack: ["Ne", "Fi", "Te", "Si"],
    shadow: ["Ni", "Fe", "Ti", "Se"],
    quote: "I illuminate human potential and ignite enthusiasm for possibilities that bring people together.",
    description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
    strengths: "Relational warmth, expansive creativity, champion of causes."
  },

  // Sentinels (SJ)
  ISTJ: {
    code: "ISTJ",
    title: "Logistician",
    subtitle: "Fact-Minded Realist",
    stack: ["Si", "Te", "Fi", "Ne"],
    shadow: ["Se", "Ti", "Fe", "Ni"],
    quote: "I rely on proven experience, thorough standards, and methodical duty to ensure lasting stability.",
    description: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
    strengths: "Steadfast reliability, meticulous recordkeeping, process integrity."
  },
  ISFJ: {
    code: "ISFJ",
    title: "Defender",
    subtitle: "Dedicated Protector",
    stack: ["Si", "Fe", "Ti", "Ne"],
    shadow: ["Se", "Fi", "Te", "Ni"],
    quote: "I preserve continuity, remember what matters, and quietly care for the practical needs of others.",
    description: "Very dedicated and warm protectors, always ready to defend their loved ones.",
    strengths: "Patient devotion, practical consideration, stabilizing loyalty."
  },
  ESTJ: {
    code: "ESTJ",
    title: "Executive",
    subtitle: "Administrative Leader",
    stack: ["Te", "Si", "Ne", "Fi"],
    shadow: ["Ti", "Se", "Ni", "Fe"],
    quote: "I implement structured procedures, clear expectations, and proven routines to ensure orderly success.",
    description: "Excellent administrators, unsurpassed at managing things – or people.",
    strengths: "Operational excellence, decisive clarity, practical fortitude."
  },
  ESFJ: {
    code: "ESFJ",
    title: "Consul",
    subtitle: "Caring Anchor",
    stack: ["Fe", "Si", "Ne", "Ti"],
    shadow: ["Fi", "Se", "Ni", "Te"],
    quote: "I cultivate belonging, support traditional bonds, and ensure everyone in the group is supported.",
    description: "Extraordinarily caring, social and popular people, always eager to help.",
    strengths: "Generous hospitality, interpersonal organization, social reliability."
  },

  // Explorers (SP)
  ISTP: {
    code: "ISTP",
    title: "Virtuoso",
    subtitle: "Practical Experimenter",
    stack: ["Ti", "Se", "Ni", "Fe"],
    shadow: ["Te", "Si", "Ne", "Fi"],
    quote: "I master tools and analyze mechanics with quiet, spontaneous mastery in the physical moment.",
    description: "Bold and practical experimenters, masters of all kinds of tools.",
    strengths: "Tactical problem-solving, composure under stress, mechanical nuance."
  },
  ISFP: {
    code: "ISFP",
    title: "Adventurer",
    subtitle: "Flexible Artist",
    stack: ["Fi", "Se", "Ni", "Te"],
    shadow: ["Fe", "Si", "Ne", "Ti"],
    quote: "I experience life deeply through tactile, aesthetic reality while honoring my quiet inner convictions.",
    description: "Flexible and charming artists, always ready to explore and experience something new.",
    strengths: "Aesthetic sensitivity, authentic living, gentle independence."
  },
  ESTP: {
    code: "ESTP",
    title: "Entrepreneur",
    subtitle: "Perceptive Pragmatist",
    stack: ["Se", "Ti", "Fe", "Ni"],
    shadow: ["Si", "Te", "Fi", "Ne"],
    quote: "I act immediately upon the realities in front of me, seizing opportunities with boldness and skill.",
    description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
    strengths: "Real-time adaptability, boldness, sensory engagement."
  },
  ESFP: {
    code: "ESFP",
    title: "Entertainer",
    subtitle: "Spontaneous Vitalist",
    stack: ["Se", "Fi", "Te", "Ni"],
    shadow: ["Si", "Fe", "Ti", "Ne"],
    quote: "I embrace the vitality of right now, bringing warmth, spontaneous energy, and direct engagement to life.",
    description: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
    strengths: "Vivacity, environmental engagement, expressive generosity."
  }
};

const ALL_FUNCS = ["Ne", "Ni", "Te", "Ti", "Fe", "Fi", "Se", "Si"];

export const TEMPERAMENTS = {
  NT: { code: "NT", name: "Analysts", color: "#95637e", colorBg: "rgba(149, 99, 126, 0.16)", colorBorder: "rgba(149, 99, 126, 0.4)" },
  NF: { code: "NF", name: "Diplomats", color: "#9ac262", colorBg: "rgba(154, 194, 98, 0.16)", colorBorder: "rgba(154, 194, 98, 0.4)" },
  SJ: { code: "SJ", name: "Sentinels", color: "#72cccd", colorBg: "rgba(114, 204, 205, 0.16)", colorBorder: "rgba(114, 204, 205, 0.4)" },
  SP: { code: "SP", name: "Explorers", color: "#e5c727", colorBg: "rgba(229, 199, 39, 0.16)", colorBorder: "rgba(229, 199, 39, 0.4)" }
};

export function getTypeTemperament(typeCode) {
  const upper = (typeCode || "").toUpperCase();
  if (upper.includes("N") && upper.includes("T")) return TEMPERAMENTS.NT;
  if (upper.includes("N") && upper.includes("F")) return TEMPERAMENTS.NF;
  if (upper.includes("S") && upper.includes("J")) return TEMPERAMENTS.SJ;
  if (upper.includes("S") && upper.includes("P")) return TEMPERAMENTS.SP;
  return TEMPERAMENTS.NT;
}

function getPrototypeVector(typeData) {
  const [dom, aux, tert, inf] = typeData.stack;
  const [sh5, sh6, sh7, sh8] = typeData.shadow;

  const target = {};
  target[dom] = 92;
  target[aux] = 82;
  target[tert] = 62;
  target[inf] = 42;
  target[sh5] = 52;
  target[sh6] = 50;
  target[sh7] = 36;
  target[sh8] = 30;
  return target;
}

export function getAxisPercentagesForMatching(percentages = {}, axisScoresOrPercentages = null) {
  if (axisScoresOrPercentages) {
    if (axisScoresOrPercentages.axisPercentages) {
      return axisScoresOrPercentages.axisPercentages;
    }
    if (axisScoresOrPercentages.E !== undefined || axisScoresOrPercentages.I !== undefined) {
      return axisScoresOrPercentages;
    }
    if (axisScoresOrPercentages.EI && axisScoresOrPercentages.EI.pctA !== undefined) {
      return {
        E: axisScoresOrPercentages.EI.pctA,
        I: axisScoresOrPercentages.EI.pctB,
        N: axisScoresOrPercentages.NS.pctA,
        S: axisScoresOrPercentages.NS.pctB,
        T: axisScoresOrPercentages.TF.pctA,
        F: axisScoresOrPercentages.TF.pctB,
        J: axisScoresOrPercentages.JP.pctA,
        P: axisScoresOrPercentages.JP.pctB
      };
    }
  }

  // Fallback: derive directly from cognitive functions if direct axis scores not supplied
  const getP = (f) => (percentages && percentages[f] !== undefined ? percentages[f] : 50);
  const meanE = (getP("Ne") + getP("Se") + getP("Te") + getP("Fe")) / 4;
  const meanI = (getP("Ni") + getP("Si") + getP("Ti") + getP("Fi")) / 4;
  const pctE = Math.max(0, Math.min(100, 50 + (meanE - meanI) / 2));

  const meanN = (getP("Ne") + getP("Ni")) / 2;
  const meanS = (getP("Se") + getP("Si")) / 2;
  const pctN = Math.max(0, Math.min(100, 50 + (meanN - meanS) / 2));

  const meanT = (getP("Te") + getP("Ti")) / 2;
  const meanF = (getP("Fe") + getP("Fi")) / 2;
  const pctT = Math.max(0, Math.min(100, 50 + (meanT - meanF) / 2));

  const meanJ = (getP("Te") + getP("Fe") + getP("Ni") + getP("Si")) / 4;
  const meanP = (getP("Ne") + getP("Se") + getP("Ti") + getP("Fi")) / 4;
  const pctJ = Math.max(0, Math.min(100, 50 + (meanJ - meanP) / 2));

  return {
    E: pctE,
    I: 100 - pctE,
    N: pctN,
    S: 100 - pctN,
    T: pctT,
    F: 100 - pctT,
    J: pctJ,
    P: 100 - pctJ
  };
}

export function calculateBestMbtiType(percentages, axisScoresOrPercentages = null) {
  const axisPcts = getAxisPercentagesForMatching(percentages, axisScoresOrPercentages);

  const scores = Object.entries(MBTI_TYPES).map(([typeKey, typeData]) => {
    const target = getPrototypeVector(typeData);

    let weightedDiff = 0;
    let totalWeights = 0;

    ALL_FUNCS.forEach(f => {
      const u = percentages[f] ?? 50;
      const t = target[f];
      let w = 1.0;
      if (f === typeData.stack[0]) w = 2.5;
      else if (f === typeData.stack[1]) w = 2.0;
      else if (f === typeData.stack[2]) w = 1.4;
      else if (f === typeData.stack[3]) w = 1.2;

      weightedDiff += Math.abs(u - t) * w;
      totalWeights += w;
    });

    const avgDiff = weightedDiff / totalWeights;
    const rawFuncMatch = Math.max(0, 100 - avgDiff * 1.15);

    // Calculate match from the 4 MBTI Spectrum Axes (E/I, N/S, T/F, J/P)
    const letters = typeKey.split("");
    const axisMatch = (
      (axisPcts[letters[0]] ?? 50) +
      (axisPcts[letters[1]] ?? 50) +
      (axisPcts[letters[2]] ?? 50) +
      (axisPcts[letters[3]] ?? 50)
    ) / 4.0;

    // Integrated match combining 8 cognitive functions and 4 spectrum axes
    const compositeRaw = 0.55 * rawFuncMatch + 0.45 * axisMatch;
    const matchPercentage = Math.min(100, Math.max(35, Math.round(compositeRaw)));
    const temp = getTypeTemperament(typeKey);

    return {
      type: typeKey,
      ...typeData,
      temperament: temp.code,
      temperamentName: temp.name,
      temperamentColor: temp.color,
      temperamentBg: temp.colorBg,
      temperamentBorder: temp.colorBorder,
      functionMatch: Math.round(rawFuncMatch),
      axisMatch: Math.round(axisMatch),
      matchPercentage
    };
  });

  scores.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return scores;
}
