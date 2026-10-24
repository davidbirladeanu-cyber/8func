import assert from "node:assert";
import { TEST_MODES, getQuestionsForMode, ALL_QUESTIONS, QUESTIONS_100, getQuestionText, getQuestionDescription, getQuestionExplanations } from "../src/data/questions.js";
import { calculateScores, ANSWER_OPTIONS, ANSWER_VALUE_MAP, AXIS_DIMENSIONS, getAnswerOptions, buildResultsUrlPath, parseResultsUrlPath } from "../src/js/scoring.js";
import { FUNCTIONS_LIST } from "../src/data/functions.js";
import { MBTI_TYPES, getTypeTemperament, calculateBestMbtiType } from "../src/data/mbtiTypes.js";
import { t } from "../src/data/translations.js";
import { NOTABLE_FIGURES, calculateFigureSimilarity, getRankedFigures, FUNCTIONS } from "../src/data/figures.js";

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
// 9. Cognitive Function Scoring: Scor Likert (0-100%) directly reflects agreement & polarity
// ----------------------------------------------------
test("Cognitive Function Scoring: Unipolar Likert scoring (agreement elevates target function without contaminating opposite function)", () => {
  const mockQuestions = [
    { id: "f_ne", category: "function", target: "Ne", agreementPole: "Ne", oppositePole: "Ni" },
    { id: "f_te", category: "function", target: "Te", agreementPole: "Te", oppositePole: "Ti" },
    { id: "f_ni", category: "function", target: "Ni", agreementPole: "Ni", oppositePole: "Ne" }
  ];

  const answers = {
    f_ne: "STRONGLY_AGREE", // Ne = 100%
    f_te: "AGREE",           // Te = 75%
    f_ni: "DISAGREE"         // Ni = 25% (unipolar direct score)
  };

  const res = calculateScores(mockQuestions, answers);
  assert.strictEqual(res.percentages.Ne, 100, "Ne should be 100% directly from SA");
  assert.strictEqual(res.percentages.Te, 75, "Te should be 75% directly from Agree");
  assert.strictEqual(res.percentages.Ni, 25, "Ni should be 25% directly from Disagree");
  assert.strictEqual(res.percentages.Ti, 50, "Unanswered Ti should remain baseline 50%");
});

// ----------------------------------------------------
// 10. Axis Scoring: Raport Real Normalizat on direct axis questions
// ----------------------------------------------------
test("Axis Scoring: Raport Real Normalizat on direct axis questions", () => {
  const mockQuestions = [
    { id: "ax_ei", category: "axis", dimension: "EI", target: "I", agreementPole: "I", oppositePole: "E" },
    { id: "ax_ns", category: "axis", dimension: "NS", target: "N", agreementPole: "N", oppositePole: "S" },
    { id: "ax_tf", category: "axis", dimension: "TF", target: "T", agreementPole: "T", oppositePole: "F" },
    { id: "ax_jp", category: "axis", dimension: "JP", target: "J", agreementPole: "J", oppositePole: "P" }
  ];

  const answers = {
    ax_ei: "STRONGLY_AGREE", // I = 100%, E = 0%
    ax_ns: "AGREE",          // N = 75%, S = 25%
    ax_tf: "STRONGLY_AGREE", // T = 100%, F = 0%
    ax_jp: "STRONGLY_AGREE"  // J = 100%, P = 0%
  };

  const res = calculateScores(mockQuestions, answers);

  assert.strictEqual(res.axisPercentages.I, 100);
  assert.strictEqual(res.axisPercentages.E, 0);
  assert.strictEqual(res.axisScores.EI.dominant, "I");

  assert.strictEqual(res.axisPercentages.N, 75);
  assert.strictEqual(res.axisPercentages.S, 25);
  assert.strictEqual(res.axisScores.NS.dominant, "N");

  assert.strictEqual(res.axisPercentages.T, 100);
  assert.strictEqual(res.axisPercentages.F, 0);
  assert.strictEqual(res.axisScores.TF.dominant, "T");

  assert.strictEqual(res.axisPercentages.J, 100);
  assert.strictEqual(res.axisPercentages.P, 0);
  assert.strictEqual(res.axisScores.JP.dominant, "J");

  assert.strictEqual(res.derivedType, "INTJ");
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
// 12d. Combination Scoring: NT and IJ Likert responses recorded cleanly
// ----------------------------------------------------
test("Combination scoring: NT and IJ Likert responses recorded cleanly", () => {
  const mockQuestions = [
    { id: "q_nt", format: "deep", category: "combination", target: "NT", oppositePole: "SF", agreementPole: "NT" },
    { id: "q_ij", format: "deep", category: "combination", target: "IJ", oppositePole: "EP", agreementPole: "IJ" }
  ];

  const answers = {
    q_nt: "STRONGLY_AGREE",
    q_ij: "STRONGLY_AGREE"
  };

  const res = calculateScores(mockQuestions, answers);

  assert.strictEqual(res.answeredCount, 2);
  assert.ok(res.percentages !== undefined);
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
  const expectedPath = "/results/EI=80/NS=15/TF=10/JP=25/Ne=84/Ni=91/Se=54/Si=36/Te=97/Ti=84/Fe=39/Fi=89/";
  assert.strictEqual(path, expectedPath);

  // Test parsing new format
  const parsed = parseResultsUrlPath(expectedPath);
  assert.ok(parsed !== null);
  assert.strictEqual(parsed.EI, 80);
  assert.strictEqual(parsed.NS, 15);
  assert.strictEqual(parsed.TF, 10);
  assert.strictEqual(parsed.JP, 25);
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

  // Test backwards compatibility with legacy format
  const legacyPath = "/results/I=80/E=20/N=85/S=15/T=90/F=10/J=75/P=25/Ne=84/Ni=91/Se=54/Si=36/Te=97/Ti=84/Fe=39/Fi=89/";
  const parsedLegacy = parseResultsUrlPath(legacyPath);
  assert.ok(parsedLegacy !== null);
  assert.strictEqual(parsedLegacy.I, 80);
  assert.strictEqual(parsedLegacy.E, 20);
  assert.strictEqual(parsedLegacy.EI, 80);
});

// ----------------------------------------------------
// 14. Raport Real Normalizat: Axes sum to exactly 100% and reflect relative pole strength
// ----------------------------------------------------
test("Raport Real Normalizat: Axes sum to exactly 100% and reflect relative pole strength", () => {
  const mockQuestions = [
    { id: "direct_e", category: "axis", dimension: "EI", target: "E", agreementPole: "E", oppositePole: "I" },
    { id: "direct_i", category: "axis", dimension: "EI", target: "I", agreementPole: "I", oppositePole: "E" }
  ];

  // E answered STRONGLY_DISAGREE (0% E, 100% I), I answered STRONGLY_AGREE (100% I, 0% E)
  const answers = {
    direct_e: "STRONGLY_DISAGREE", // E gets 0, I gets 100
    direct_i: "STRONGLY_AGREE"      // I gets 100, E gets 0
  };

  const res = calculateScores(mockQuestions, answers);
  assert.strictEqual(res.axisPercentages.E, 0, "E should be 0%");
  assert.strictEqual(res.axisPercentages.I, 100, "I should be 100%");
  assert.strictEqual(res.axisPercentages.E + res.axisPercentages.I, 100, "Must sum to 100%");
  assert.strictEqual(res.axisScores.EI.dominant, "I");
});

// ----------------------------------------------------
// 22. Figure Similarity & Ranking Integrity
// ----------------------------------------------------
test("Figure Similarity and Ranking: FUNCTIONS is defined and similarity calculation runs correctly", () => {
  assert.ok(Array.isArray(FUNCTIONS), "FUNCTIONS must be an array");
  assert.strictEqual(FUNCTIONS.length, 8, "FUNCTIONS must have 8 cognitive functions");

  const mockUserScores = { Ne: 85, Ni: 60, Te: 75, Ti: 40, Fe: 35, Fi: 25, Se: 30, Si: 65 };
  const mockUserAxes = {
    EI: { pctA: 70, pctB: 30, roundA: 70, roundB: 30 },
    NS: { pctA: 80, pctB: 20, roundA: 80, roundB: 20 },
    TF: { pctA: 85, pctB: 15, roundA: 85, roundB: 15 },
    JP: { pctA: 90, pctB: 10, roundA: 90, roundB: 10 }
  };

  const sim = calculateFigureSimilarity(mockUserScores, mockUserAxes, NOTABLE_FIGURES[0]);
  assert.ok(typeof sim === "number" && sim >= 0 && sim <= 100, "Similarity must be a percentage between 0 and 100");

  const ranked = getRankedFigures(mockUserScores, mockUserAxes);
  assert.strictEqual(ranked.similar.length, 10, "Must have 10 similar figures");
  assert.strictEqual(ranked.opposite.length, 10, "Must have 10 opposite figures");
  assert.strictEqual(ranked.all.length, NOTABLE_FIGURES.length, "All figures must be processed");
  assert.ok(ranked.similar[0].similarity >= ranked.similar[9].similarity, "Similar figures must be sorted descending");
  assert.ok(ranked.opposite[0].similarity <= ranked.opposite[9].similarity, "Opposite figures must be sorted ascending");
});

// ----------------------------------------------------
// 23. INFJ vs ISTJ Differentiation & Stack Fit
// ----------------------------------------------------
test("INFJ vs ISTJ Differentiation: INFJ profile yields INFJ derivedType and ranking #1 without Si inflation", () => {
  const answers = {};
  ALL_QUESTIONS.forEach(q => {
    if (q.format === "wouldYouRather" || q.format === "direct") {
      const optA = q.options[0];
      const optB = q.options[1];
      const infjPoles = ["I", "N", "F", "J", "Ni", "Fe", "Ti", "NF", "IJ"];
      const istjPoles = ["S", "Si", "ST", "SF"];
      if (infjPoles.includes(optA.pole)) answers[q.id] = "A";
      else if (infjPoles.includes(optB.pole)) answers[q.id] = "B";
      else if (istjPoles.includes(optA.pole)) answers[q.id] = "B";
      else answers[q.id] = "A";
    } else {
      const t = q.target;
      if (["Ni", "Fe", "I", "N", "F", "J", "NF", "IJ"].includes(t)) answers[q.id] = "STRONGLY_AGREE";
      else if (t === "Ti") answers[q.id] = "AGREE";
      else if (t === "Se") answers[q.id] = "NEUTRAL";
      else if (["Ne", "Si", "S", "E", "T", "P", "ST", "SF", "EP"].includes(t)) answers[q.id] = "DISAGREE";
      else answers[q.id] = "NEUTRAL";
    }
  });

  const scores = calculateScores(ALL_QUESTIONS, answers);
  const rankings = calculateBestMbtiType(scores.percentages, scores.axisScores);

  assert.strictEqual(scores.derivedType, "INFJ", "INFJ profile must yield INFJ derivedType");
  assert.strictEqual(rankings[0].type, "INFJ", "INFJ must rank #1 in calculateBestMbtiType");
  assert.ok(scores.percentages.Ni > 80, `Ni must be high (>80%), got ${scores.percentages.Ni}%`);
  assert.ok(scores.percentages.Fe > 80, `Fe must be high (>80%), got ${scores.percentages.Fe}%`);
  assert.ok(scores.percentages.Si < 35, `Si must remain low (<35%), got ${scores.percentages.Si}%`);
  assert.ok(rankings.findIndex(r => r.type === "ISTJ") > 10, "ISTJ should not rank near the top for an INFJ");
});

console.log(`\nAll ${passedTests} tests passed successfully!`);


