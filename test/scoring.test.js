import assert from "node:assert";
import { TEST_MODES, getQuestionsForMode, ALL_QUESTIONS, QUESTIONS_100, getQuestionText, getQuestionDescription, getQuestionExplanations } from "../src/data/questions.js";
import { calculateScores, ANSWER_OPTIONS, ANSWER_VALUE_MAP, AXIS_DIMENSIONS, getAnswerOptions, buildResultsUrlPath, parseResultsUrlPath } from "../src/js/scoring.js";
import { FUNCTIONS_LIST } from "../src/data/functions.js";
import { MBTI_TYPES, getTypeTemperament, calculateBestMbtiType } from "../src/data/mbtiTypes.js";
import { t } from "../src/data/translations.js";

console.log("=========================================");
console.log("Running 8Func Scoring System Test Suite (100 Questions)");
console.log("=========================================\n");

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------
// 1. Test Configurations and Item Counts
// ----------------------------------------------------
// ----------------------------------------------------
// 1. Test Configurations and Item Counts
// ----------------------------------------------------
test("Rapid/Fast test configuration (36 questions = 32 deep + 4 direct)", () => {
  const rapidQs = getQuestionsForMode("rapid");
  assert.strictEqual(rapidQs.length, 36, "Rapid must have 36 questions");

  const deepQs = rapidQs.filter(q => q.format === "deep");
  const directQs = rapidQs.filter(q => q.format === "direct");
  assert.strictEqual(deepQs.length, 32, "Rapid must have 32 deep questions");
  assert.strictEqual(directQs.length, 4, "Rapid must have 4 direct questions");

  // Verify the 4 direct questions are strictly at the end
  const last4 = rapidQs.slice(-4).map(q => q.id);
  assert.deepStrictEqual(last4, ["F01", "F02", "F03", "F04"], "Direct questions must be strictly last");
});

test("Standard test configuration (60 questions = 32 deep + 24 simple + 4 direct)", () => {
  const standardQs = getQuestionsForMode("standard");
  assert.strictEqual(standardQs.length, 60, "Standard must have 60 questions");

  const deepQs = standardQs.filter(q => q.format === "deep");
  const shortQs = standardQs.filter(q => q.format === "short");
  const directQs = standardQs.filter(q => q.format === "direct");
  assert.strictEqual(deepQs.length, 32, "Standard must have 32 deep questions");
  assert.strictEqual(shortQs.length, 24, "Standard must have 24 simple questions");
  assert.strictEqual(directQs.length, 4, "Standard must have 4 direct questions");

  // Verify the 4 direct questions are strictly at the end
  const last4 = standardQs.slice(-4).map(q => q.id);
  assert.deepStrictEqual(last4, ["F01", "F02", "F03", "F04"], "Direct questions must be strictly last");
});

test("Complete test configuration (100 questions = 32 deep + 32 simple + 32 WYR + 4 direct)", () => {
  const completeQs = getQuestionsForMode("complete");
  assert.strictEqual(completeQs.length, 100, "Complete must have 100 questions");

  const deepQs = completeQs.filter(q => q.format === "deep");
  const shortQs = completeQs.filter(q => q.format === "short");
  const wyrQs = completeQs.filter(q => q.format === "wouldYouRather");
  const directQs = completeQs.filter(q => q.format === "direct");

  assert.strictEqual(deepQs.length, 32, "Must have 32 Deep questions");
  assert.strictEqual(shortQs.length, 32, "Must have 32 Short questions");
  assert.strictEqual(wyrQs.length, 32, "Must have 32 Would You Rather questions");
  assert.strictEqual(directQs.length, 4, "Must have 4 Direct questions");

  // Verify the 4 direct questions are strictly at the end
  const last4 = completeQs.slice(-4).map(q => q.id);
  assert.deepStrictEqual(last4, ["F01", "F02", "F03", "F04"], "Direct questions must be strictly last");
});

test("Question metadata integrity & distinct texts across all 100 questions", () => {
  assert.strictEqual(ALL_QUESTIONS.length, 100, "Total pool must contain 100 questions");
  const ids = new Set();
  const texts = new Set();

  ALL_QUESTIONS.forEach(q => {
    assert.ok(q.id, "Question must have an id");
    assert.ok(!ids.has(q.id), `Duplicate question id: ${q.id}`);
    ids.add(q.id);

    assert.ok(q.text && q.text.trim().length > 5, `Question ${q.id} has invalid text`);
    const uniqueKey = q.format === "direct" ? `${q.text} [${q.dimension}]` : q.text;
    assert.ok(!texts.has(uniqueKey), `Duplicate question text found: "${q.text}"`);
    texts.add(uniqueKey);

    assert.ok(["axis", "function", "combination"].includes(q.category), `Invalid category for ${q.id}: ${q.category}`);
    assert.ok(["deep", "wouldYouRather", "short", "direct"].includes(q.format), `Invalid format for ${q.id}: ${q.format}`);
    assert.ok(q.target, `Question ${q.id} must define target`);

    // Description & bilingual support
    assert.ok(q.description && q.description.trim().length > 5, `Question ${q.id} must have description`);
    assert.ok(q.descriptionRo && q.descriptionRo.trim().length > 5, `Question ${q.id} must have descriptionRo`);

    if (q.format === "wouldYouRather" || q.format === "direct") {
      assert.ok(Array.isArray(q.options) && q.options.length === 2, `Question ${q.id} must have 2 options`);
      q.options.forEach(opt => {
        assert.ok(["A", "B"].includes(opt.id), `Option id must be A or B`);
        assert.ok(opt.text && opt.text.trim().length > 2, `Option text missing`);
        assert.ok(opt.textRo && opt.textRo.trim().length > 2, `Option textRo missing`);
        assert.ok(opt.pole, `Option pole missing`);
        assert.ok(opt.explanation && opt.explanation.trim().length > 5, `Option explanation missing`);
        assert.ok(opt.explanationRo && opt.explanationRo.trim().length > 5, `Option explanationRo missing`);
      });
    } else {
      assert.ok(q.oppositePole || q.opposite, `Agreement question ${q.id} must define oppositePole`);
      assert.ok(q.agreementPole, `Agreement question ${q.id} must define agreementPole`);
      assert.ok(q.agreementExplanation, `Agreement question ${q.id} must have agreementExplanation`);
      assert.ok(q.disagreementExplanation, `Agreement question ${q.id} must have disagreementExplanation`);
      assert.ok(q.neutralExplanation, `Agreement question ${q.id} must have neutralExplanation`);
    }
  });
});

// ----------------------------------------------------
// 2. Answer Scale and Values
// ----------------------------------------------------
test("Answer scale mappings and Neutral label", () => {
  assert.strictEqual(ANSWER_VALUE_MAP.STRONGLY_AGREE, 1.0);
  assert.strictEqual(ANSWER_VALUE_MAP.AGREE, 0.5);
  assert.strictEqual(ANSWER_VALUE_MAP.NEUTRAL, 0.0);
  assert.strictEqual(ANSWER_VALUE_MAP.DISAGREE, -0.5);
  assert.strictEqual(ANSWER_VALUE_MAP.STRONGLY_DISAGREE, -1.0);

  const neutralOption = ANSWER_OPTIONS.find(opt => opt.key === "NEUTRAL");
  assert.ok(neutralOption, "Neutral option must exist in ANSWER_OPTIONS");
  assert.strictEqual(neutralOption.label, "Neutral", "Option label must be strictly 'Neutral'");
  assert.strictEqual(neutralOption.points, 0.0);
});

// ----------------------------------------------------
// 3. Reverse-Direction Answers and Scoring Rules
// ----------------------------------------------------
test("Scoring rules: Positive agreement favors agreementPole, Disagreement favors opposite pole", () => {
  const mockQuestions = [
    {
      id: "q_e",
      category: "axis",
      dimension: "EI",
      target: "E",
      oppositePole: "I",
      agreementPole: "E"
    },
    {
      id: "q_i",
      category: "axis",
      dimension: "EI",
      target: "I",
      oppositePole: "E",
      agreementPole: "I"
    }
  ];

  const answersBoth = {
    q_e: "STRONGLY_DISAGREE", // -1.0 -> 1.0 added to I
    q_i: "STRONGLY_AGREE"     // 1.0 -> 1.0 added to I
  };
  const scoresBoth = calculateScores(mockQuestions, answersBoth);
  assert.strictEqual(scoresBoth.axisScores.EI.roundA, 0, "E should be 0%");
  assert.strictEqual(scoresBoth.axisScores.EI.roundB, 100, "I should be 100%");
  assert.strictEqual(scoresBoth.axisScores.EI.dominant, "I", "Dominant should be I");
});

test("Scoring rules: Neutral answer contributes 0 and preserves balance", () => {
  const mockQuestions = [
    { id: "q1", category: "axis", dimension: "TF", target: "T", oppositePole: "F", agreementPole: "T" },
    { id: "q2", category: "axis", dimension: "TF", target: "F", oppositePole: "T", agreementPole: "F" }
  ];

  const answers = {
    q1: "NEUTRAL",
    q2: "NEUTRAL"
  };
  const result = calculateScores(mockQuestions, answers);
  assert.strictEqual(result.axisScores.TF.pctA, 50.0);
  assert.strictEqual(result.axisScores.TF.pctB, 50.0);
});

// ----------------------------------------------------
// 4. Would You Rather Scoring
// ----------------------------------------------------
test("Would You Rather scoring: Option selection contributes +1 directly to target pole", () => {
  const mockWYR = [
    {
      id: "w_axis",
      format: "wouldYouRather",
      category: "axis",
      dimension: "NS",
      target: "N",
      options: [
        { id: "A", pole: "N", text: "Explore what it might imply." },
        { id: "B", pole: "S", text: "Study what the evidence shows." }
      ]
    },
    {
      id: "w_func",
      format: "wouldYouRather",
      category: "function",
      target: "Ne",
      options: [
        { id: "A", pole: "Ne", text: "Generate possibilities." },
        { id: "B", pole: "Si", text: "Use proven methods." }
      ]
    }
  ];

  // Selecting Option A for both
  const resA = calculateScores(mockWYR, {
    w_axis: "A",
    w_func: "A"
  });

  assert.strictEqual(resA.percentages.Ne, 100, "Ne should be 100% after selecting Option A (Ne +1)");
  assert.strictEqual(resA.axisScores.NS.dominant, "N", "N should dominate after selecting Option A (N +1)");

  // Selecting Option B for both
  const resB = calculateScores(mockWYR, {
    w_axis: "B",
    w_func: "B"
  });

  assert.strictEqual(resB.percentages.Si, 100, "Si should be 100% after selecting Option B (Si +1)");
  assert.strictEqual(resB.axisScores.NS.dominant, "S", "S should dominate after selecting Option B (S +1)");
});

// ----------------------------------------------------
// 5. Cognitive Functions Normalization Formula (Linear: no contrast gain)
// ----------------------------------------------------
test("Cognitive function normalization: linear scale — SD=0%, Neutral=50%, SA=100%", () => {
  const mockQuestions = [
    { id: "ne_1", category: "function", target: "Ne", oppositePole: "Si", agreementPole: "Ne" },
    { id: "ne_2", category: "function", target: "Ne", oppositePole: "Si", agreementPole: "Ne" }
  ];

  // Case 1: Strongly Agree (1.0) + Agree (0.5) -> mean = 0.75 -> (0.75+1)/2*100 = 87.5% -> round 88%
  const res1 = calculateScores(mockQuestions, {
    ne_1: "STRONGLY_AGREE",
    ne_2: "AGREE"
  });
  assert.strictEqual(res1.percentages.Ne, 88);
  assert.strictEqual(res1.precisePercentages.Ne, 87.5);

  // Case 2: Neutral (0.0) -> mean = 0.0 -> 50%
  const res2 = calculateScores(mockQuestions, {
    ne_1: "NEUTRAL",
    ne_2: "NEUTRAL"
  });
  assert.strictEqual(res2.percentages.Ne, 50);

  // Case 3: Strongly Disagree (-1.0) -> mean = -1.0 -> 0%
  const res3 = calculateScores(mockQuestions, {
    ne_1: "STRONGLY_DISAGREE",
    ne_2: "STRONGLY_DISAGREE"
  });
  assert.strictEqual(res3.percentages.Ne, 0);

  // Case 4: AGREE only -> mean = 0.5 -> (0.5+1)/2*100 = 75%
  const res4 = calculateScores([mockQuestions[0]], { ne_1: "AGREE" });
  assert.strictEqual(res4.percentages.Ne, 75);

  // Case 5: DISAGREE only -> mean = -0.5 -> (-0.5+1)/2*100 = 25%
  const res5 = calculateScores([mockQuestions[0]], { ne_1: "DISAGREE" });
  assert.strictEqual(res5.percentages.Ne, 25);
});

// ----------------------------------------------------
// 6. Unanswered Questions & Zero Division Handling
// ----------------------------------------------------
test("Unanswered questions are excluded from denominator & zero division is avoided", () => {
  const rapidQs = getQuestionsForMode("rapid");
  
  const emptyRes = calculateScores(rapidQs, {});
  assert.strictEqual(emptyRes.answeredCount, 0);
  assert.strictEqual(emptyRes.isComplete, false);

  AXIS_DIMENSIONS.forEach(dim => {
    assert.strictEqual(emptyRes.axisScores[dim.id].pctA, 50.0);
    assert.strictEqual(emptyRes.axisScores[dim.id].pctB, 50.0);
  });

  FUNCTIONS_LIST.forEach(f => {
    assert.strictEqual(emptyRes.percentages[f], 50);
    assert.strictEqual(emptyRes.insufficientData[f], true);
  });

  const partialAnswers = { [rapidQs[0].id]: "AGREE" };
  const partialRes = calculateScores(rapidQs, partialAnswers);
  assert.strictEqual(partialRes.answeredCount, 1);
  assert.strictEqual(partialRes.isComplete, false);
});

// ----------------------------------------------------
// 7. Verification of all 16 MBTI types in MBTI_TYPES
// ----------------------------------------------------
test("All 16 derived types exist in MBTI_TYPES dictionary", () => {
  const poles = [
    ["E", "I"],
    ["N", "S"],
    ["T", "F"],
    ["J", "P"]
  ];

  for (const e of poles[0]) {
    for (const n of poles[1]) {
      for (const t of poles[2]) {
        for (const j of poles[3]) {
          const type = `${e}${n}${t}${j}`;
          assert.ok(MBTI_TYPES[type], `MBTI_TYPES must contain ${type}`);
          assert.ok(MBTI_TYPES[type].title, `${type} must have a title`);
          const temp = getTypeTemperament(type);
          assert.ok(temp && temp.code, `${type} must have a valid temperament`);
        }
      }
    }
  }
});

// ----------------------------------------------------
// 8. Bilingual Question Support and Language Toggling
// ----------------------------------------------------
test("All 100 questions have complete Romanian translations (textRo) & explanations", () => {
  assert.strictEqual(ALL_QUESTIONS.length, 100);
  ALL_QUESTIONS.forEach(q => {
    assert.ok(q.text && q.text.trim().length > 5, `EN text missing for question ${q.id}`);
    assert.ok(q.textRo && q.textRo.trim().length > 5, `RO text missing for question ${q.id}`);
    assert.strictEqual(getQuestionText(q, "en"), q.text);
    assert.strictEqual(getQuestionText(q, "ro"), q.textRo);

    assert.ok(getQuestionDescription(q, "en").length > 5);
    assert.ok(getQuestionDescription(q, "ro").length > 5);

    const expls = getQuestionExplanations(q, "ro");
    assert.ok(expls !== null);
  });

  const roOptions = getAnswerOptions("ro");
  const enOptions = getAnswerOptions("en");
  assert.strictEqual(roOptions.length, 5);
  assert.strictEqual(enOptions.length, 5);

  const roNeutral = roOptions.find(o => o.key === "NEUTRAL");
  assert.strictEqual(roNeutral.label, "Neutru");

  const enNeutral = enOptions.find(o => o.key === "NEUTRAL");
  assert.strictEqual(enNeutral.label, "Neutral");
});

// ----------------------------------------------------
// 9. Clean Cognitive Function Scoring: Choosing Te does not decrease Ti
// ----------------------------------------------------
test("Clean Function Scoring: Choosing Te does not decrease Ti, functions contribute via templates", () => {
  const mockQuestions = [
    { id: "f_ne", category: "function", target: "Ne", agreementPole: "Ne", oppositePole: "Ni" },
    { id: "f_te", category: "function", target: "Te", agreementPole: "Te", oppositePole: "Ti" }
  ];

  const answers = {
    f_ne: 1.0, // Strongly Agree with Ne
    f_te: 1.0  // Strongly Agree with Te
  };

  const res = calculateScores(mockQuestions, answers);
  // Ne increases to 100%, Ni remains unpenalized at baseline 50%
  assert.strictEqual(res.percentages.Ne, 100);
  assert.strictEqual(res.percentages.Ni, 50);

  // Te increases to 100%, Ti remains unpenalized at baseline 50%
  assert.strictEqual(res.percentages.Te, 100);
  assert.strictEqual(res.percentages.Ti, 50);

  // Both Ne and Te are Extraverted functions -> E template is higher than I template
  assert.ok(res.axisScores.EI.pctA > 50, "Extraversion should be greater than 50%");
  assert.strictEqual(res.axisScores.EI.dominant, "E");

  // Ne boosts N on NS axis via function template
  assert.ok(res.axisScores.NS.pctA > 50, "N should be greater than 50%");

  // Te boosts T on TF axis via function template
  assert.ok(res.axisScores.TF.pctA > 50, "T should be greater than 50%");
});

// ----------------------------------------------------
// 10. Integrated Model: 100% Ni boosts I, N, and J
// ----------------------------------------------------
test("Integrated Model: 100% Ni boosts I, N, and J simultaneously on the 4 MBTI Spectrum Axes", () => {
  const rapidQs = getQuestionsForMode("rapid");
  const answers = {};

  rapidQs.filter(q => q.category === "function" && q.target === "Ni").forEach(q => {
    answers[q.id] = "STRONGLY_AGREE";
  });

  const res = calculateScores(rapidQs, answers);

  assert.strictEqual(res.percentages.Ni, 100);
  assert.ok(res.axisScores.EI.pctB > 50, `I (${res.axisScores.EI.pctB}%) must be greater than 50%`);
  assert.strictEqual(res.axisScores.EI.dominant, "I", "Dominant pole on EI must be I");

  assert.ok(res.axisScores.NS.pctA > 50, `N (${res.axisScores.NS.pctA}%) must be greater than 50%`);
  assert.strictEqual(res.axisScores.NS.dominant, "N", "Dominant pole on NS must be N");

  assert.ok(res.axisScores.JP.pctA > 50, `J (${res.axisScores.JP.pctA}%) must be greater than 50%`);
  assert.strictEqual(res.axisScores.JP.dominant, "J", "Dominant pole on JP must be J");

  assert.strictEqual(res.axisScores.TF.pctA, 50.0, "TF should remain 50%");
});

// ----------------------------------------------------
// 11. Integrated Personality Match: calculateBestMbtiType
// ----------------------------------------------------
test("Integrated Personality Match: calculateBestMbtiType integrates 8 cognitive functions and 4 spectrum axes", () => {
  const rapidQs = getQuestionsForMode("rapid");
  const answers = {};

  // Pure INTJ profile: high Ni, high Te, high I, N, T, J
  rapidQs.forEach(q => {
    if (q.category === "axis") {
      if (["I", "N", "T", "J"].includes(q.agreementPole)) answers[q.id] = "STRONGLY_AGREE";
      else answers[q.id] = "STRONGLY_DISAGREE";
    } else if (q.category === "function") {
      if (["Ni", "Te"].includes(q.target)) answers[q.id] = "STRONGLY_AGREE";
      else if (["Fi", "Se"].includes(q.target)) answers[q.id] = "NEUTRAL";
      else answers[q.id] = "STRONGLY_DISAGREE";
    }
  });

  const res = calculateScores(rapidQs, answers);
  const rankings = calculateBestMbtiType(res.percentages, res.axisScores);

  assert.ok(rankings.length === 16, "Must rank all 16 types");
  assert.strictEqual(rankings[0].type, "INTJ", "Top match must be INTJ");
  assert.ok(rankings[0].matchPercentage >= 80, `INTJ match (${rankings[0].matchPercentage}%) should be >= 80%`);
  assert.ok(rankings[0].axisMatch >= 75, `INTJ axis match (${rankings[0].axisMatch}%) should be >= 75%`);
  assert.ok(rankings[0].functionMatch >= 80, `INTJ rank-based stack score (${rankings[0].functionMatch}%) should be >= 80%`);

  const esfpMatch = rankings.find(r => r.type === "ESFP");
  assert.ok(esfpMatch.matchPercentage < rankings[0].matchPercentage, "ESFP match must be lower than INTJ");
});

// ----------------------------------------------------
// 12. Question Phase Ordering: Complex (Deep) -> Simple (Short) -> Would You Rather -> Direct Final
// ----------------------------------------------------
test("Question Phase Ordering: Deep questions first, then Short, then Would You Rather, then Direct Final", () => {
  const completeQs = getQuestionsForMode("complete");
  assert.strictEqual(completeQs.length, 100);

  // First 32 must all be Deep
  for (let i = 0; i < 32; i++) {
    assert.strictEqual(completeQs[i].format, "deep", `Question at index ${i} must be deep, got ${completeQs[i].format}`);
  }
  // Next 32 must all be Short
  for (let i = 32; i < 64; i++) {
    assert.strictEqual(completeQs[i].format, "short", `Question at index ${i} must be short, got ${completeQs[i].format}`);
  }
  // Next 32 must all be Would You Rather
  for (let i = 64; i < 96; i++) {
    assert.strictEqual(completeQs[i].format, "wouldYouRather", `Question at index ${i} must be wouldYouRather, got ${completeQs[i].format}`);
  }
  // Last 4 must all be Direct Final
  for (let i = 96; i < 100; i++) {
    assert.strictEqual(completeQs[i].format, "direct", `Question at index ${i} must be direct, got ${completeQs[i].format}`);
  }

  const standardQs = getQuestionsForMode("standard");
  assert.strictEqual(standardQs.length, 60);
  for (let i = 0; i < 32; i++) {
    assert.strictEqual(standardQs[i].format, "deep", `Standard at ${i} must be deep`);
  }
  for (let i = 32; i < 56; i++) {
    assert.strictEqual(standardQs[i].format, "short", `Standard at ${i} must be short`);
  }
  for (let i = 56; i < 60; i++) {
    assert.strictEqual(standardQs[i].format, "direct", `Standard at ${i} must be direct`);
  }
});

// ----------------------------------------------------
// 12b. Deterministic Target Sorting Order & Frontal Questions strictly last
// ----------------------------------------------------
test("Frontal questions (F01-F04) are ALWAYS strictly the last 4 questions across all test modes and all order modes", () => {
  ["rapid", "standard", "complete"].forEach(mode => {
    ["format", "random", "function"].forEach(order => {
      const qs = getQuestionsForMode(mode, order);
      const last4 = qs.slice(-4).map(q => q.id);
      assert.deepStrictEqual(last4, ["F01", "F02", "F03", "F04"], `Mode ${mode} + Order ${order} must end with F01, F02, F03, F04`);
      
      // Verify no direct questions appear before the last 4
      const preceding = qs.slice(0, -4);
      assert.strictEqual(preceding.some(q => q.format === "direct"), false, `No direct questions should appear prior to last 4 in ${mode} + ${order}`);
    });
  });
});

test("Target Sorting Order: Questions sorted by TARGET_ORDER", () => {
  const TARGET_ORDER = [
    "I", "E",
    "N", "S",
    "T", "F",
    "J", "P",
    "Ne", "Si", "Ni", "Se", "Te", "Fi", "Ti", "Fe",
    "NT", "NF", "ST", "SF", "IJ", "IP", "EP", "EJ"
  ];
  const targetRank = new Map(TARGET_ORDER.map((t, idx) => [t.toUpperCase(), idx]));

  // Function mode: Non-direct questions are monotonic across test by target
  const funcQs = getQuestionsForMode("complete", "function");
  assert.strictEqual(funcQs.length, 100);
  const nonDirect = funcQs.slice(0, 96);
  let prevRank = -1;
  nonDirect.forEach(q => {
    const rank = targetRank.get((q.target || "").toUpperCase());
    assert.ok(rank !== undefined, `Target ${q.target} on question ${q.id} must be in TARGET_ORDER`);
    assert.ok(rank >= prevRank, `Function mode: question ${q.id} (target ${q.target}, rank ${rank}) must be >= ${prevRank}`);
    prevRank = rank;
  });

  // Random mode: Contains all 100 items with F01-F04 at the end
  const randQs = getQuestionsForMode("complete", "random");
  assert.strictEqual(randQs.length, 100);
  const ids = new Set(randQs.map(q => q.id));
  assert.strictEqual(ids.size, 100);
});

// ----------------------------------------------------
// 12d. Combination & Cross-Synthesis Scoring Rules
// ----------------------------------------------------
test("Combination scoring: NT strong agree adds to N and T, IJ adds to I and J, cross-synthesis boosts Ni and Te", () => {
  const mockQuestions = [
    { id: "q_nt", format: "deep", category: "combination", target: "NT", oppositePole: "SF", agreementPole: "NT" },
    { id: "q_ij", format: "deep", category: "combination", target: "IJ", oppositePole: "EP", agreementPole: "IJ" }
  ];

  const answers = {
    q_nt: "STRONGLY_AGREE",
    q_ij: "STRONGLY_AGREE"
  };

  const res = calculateScores(mockQuestions, answers);

  // Directly boosts N, T, I, J points
  assert.ok(res.axisScores.NS.directPointsA > 0, "N should receive direct points");
  assert.ok(res.axisScores.TF.directPointsA > 0, "T should receive direct points");
  assert.ok(res.axisScores.EI.directPointsB > 0, "I should receive direct points");
  assert.ok(res.axisScores.JP.directPointsA > 0, "J should receive direct points");

  // Cross-synthesis NT + IJ -> INTJ -> boosts Ni and Te
  assert.ok(res.percentages.Ni > 50, "Ni should be boosted above baseline by NT+IJ cross-synthesis");
  assert.ok(res.percentages.Te > 50, "Te should be boosted above baseline by NT+IJ cross-synthesis");
});

// ----------------------------------------------------
// 13. Results URL Path: Building and Parsing Format
// ----------------------------------------------------
test("Results URL Path: Format matches /results/I=80/E=80/N=80/S=80/T=80/F=80/J=80/P=80/Ne=80/Ni=80/Se=80/Si=80/Te=80/Ti=80/Fe=80/Fi=80/", () => {
  const mockAxisScores = {
    EI: { roundB: 80, roundA: 20 },
    NS: { roundA: 85, roundB: 15 },
    TF: { roundA: 90, roundB: 10 },
    JP: { roundA: 75, roundB: 25 }
  };
  const mockPercentages = {
    Ne: 84,
    Ni: 91,
    Se: 54,
    Si: 36,
    Te: 97,
    Ti: 84,
    Fe: 39,
    Fi: 89
  };

  const path = buildResultsUrlPath(mockAxisScores, mockPercentages);
  const expectedPath = "/results/I=80/E=20/N=85/S=15/T=90/F=10/J=75/P=25/Ne=84/Ni=91/Se=54/Si=36/Te=97/Ti=84/Fe=39/Fi=89/";
  assert.strictEqual(path, expectedPath);

  // Test parsing
  const parsed = parseResultsUrlPath(expectedPath);
  assert.ok(parsed !== null);
  assert.strictEqual(parsed.I, 80);
  assert.strictEqual(parsed.E, 20);
  assert.strictEqual(parsed.N, 85);
  assert.strictEqual(parsed.S, 15);
  assert.strictEqual(parsed.T, 90);
  assert.strictEqual(parsed.F, 10);
  assert.strictEqual(parsed.J, 75);
  assert.strictEqual(parsed.P, 25);
  assert.strictEqual(parsed.Ne, 84);
  assert.strictEqual(parsed.Ni, 91);
  assert.strictEqual(parsed.Se, 54);
  assert.strictEqual(parsed.Si, 36);
  assert.strictEqual(parsed.Te, 97);
  assert.strictEqual(parsed.Ti, 84);
  assert.strictEqual(parsed.Fe, 39);
  assert.strictEqual(parsed.Fi, 89);
});

// ----------------------------------------------------
// 14. Explicit 70% Direct Axis + 30% Function Template Weighting
// ----------------------------------------------------
test("Axis scoring weights: exactly 70% from direct axis questions and 30% from function template", () => {
  const mockQuestions = [
    // 1 direct EI question (answering Strongly Agree for E)
    { id: "direct_ei", category: "axis", dimension: "EI", agreementPole: "E", oppositePole: "I" },
    // Function questions: Ni at 100% (I favoured), Ne at 25% (E slightly favoured via Ne)
    { id: "func_ni", category: "function", target: "Ni", agreementPole: "Ni" },
    { id: "func_ne", category: "function", target: "Ne", agreementPole: "Ne" }
  ];

  // Linear scale: Ne=25% needs mean = 25/100*2-1 = -0.5 -> DISAGREE
  const answers = {
    direct_ei: 1.0,      // Direct E vote -> directPctE = 100%
    func_ni: 1.0,        // Ni = 100%
    func_ne: -0.5        // Ne = 25% (DISAGREE)
  };

  const res = calculateScores(mockQuestions, answers);
  assert.strictEqual(res.axisScores.EI.directPctA, 100, "Direct E percentage should be 100%");

  // Final E = 0.70 * directPctA + 0.30 * funcPctA
  const expectedCombinedE = Math.round(0.70 * res.axisScores.EI.directPctA + 0.30 * res.axisScores.EI.funcPctA);
  assert.strictEqual(res.axisScores.EI.roundA, expectedCombinedE);
  assert.ok(res.axisScores.EI.roundA >= 70, "E should be at least 70% due to 70% direct axis weight");
});

console.log(`\nAll ${passedTests} tests passed successfully!`);

