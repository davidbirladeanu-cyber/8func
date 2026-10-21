/**
 * 8Func - Comprehensive Bilingual Dictionary (English & Romanian)
 */

export const TRANSLATIONS = {
  en: {
    // Nav & Common
    skipLink: "Skip to content",
    switchThemeLight: "Switch to light mode",
    switchThemeDark: "Switch to dark mode",
    switchLang: "Comută în Română",
    langCode: "RO",
    currentLangName: "English",
    orderRandom: "Random",
    orderFormat: "Format",
    orderFunction: "Function",
    orderTooltip: "Order: {mode} (Click to switch)",
    retakeQuiz: "Retake quiz",
    restartQuiz: "Restart",
    changeMode: "Change version",
    back: "Back",
    next: "Next",
    finishQuiz: "Finish & View Results",
    questionMeta: "Question <b>{current}</b> of {total}",
    resetConfirm: "Reset current quiz and all answers?",
    retakeConfirm: "Retake this quiz from the beginning?",
    quizResetToast: "Quiz reset!",
    reportCopiedToast: "Report copied to clipboard!",
    dataExportedToast: "Anonymous raw data exported!",
    underQuestionsPrompt: "You have answered {answered} of {total} questions. View results anyway?",
    inspectQuestion: "Inspect question details",
    infoClickHint: "Info (click to reveal)",
    modalClose: "Close",
    modalUnderstood: "Understood",
    functionDetailsTitle: "Function Details",
    assessingCognitiveFunction: "Assessing Cognitive Function: {code} — {name}",
    lowerPole: "Lower Pole (Absent):",
    upperPole: "Upper Pole (Developed):",
    assessingAxisPole: "Assessing MBTI Axis Pole: {code} — {name}",
    opposingPole: "Opposing Pole:",
    underlyingDimension: "Underlying Dimension:",

    // Answer Choices
    answers: {
      STRONGLY_AGREE: "Strongly agree",
      AGREE: "Agree",
      NEUTRAL: "Neutral",
      DISAGREE: "Disagree",
      STRONGLY_DISAGREE: "Strongly disagree"
    },

    // Welcome Screen
    welcomeEyebrow: "Psychometric Cognitive Assessment",
    welcomeTitle: "Jungian Cognitive Functions & MBTI Archetypes",
    welcomeLead: "Discover your psychological engine through authentic 8-function cognitive polarity and 4 MBTI spectrum axes.",
    selectDepth: "Select Assessment Depth",
    questionsCount: "questions",
    startTest: "Start {name} Test",
    eightFunctionsTitle: "The 8 Jungian Cognitive Functions",
    eightFunctionsSub: "Click any function chip to inspect its psychological mechanism and polarity definition.",

    // Modes
    modes: {
      rapid: {
        name: "Fast",
        badge: "Quick",
        subtitle: "36 questions (32 deep · 4 direct)",
        description: "Fast pulse assessment with 32 deep questions and 4 direct self-assessments."
      },
      standard: {
        name: "Standard",
        badge: "Recommended",
        subtitle: "60 questions (32 deep · 24 simple · 4 direct)",
        description: "Balanced calibration with 32 deep items, 24 simple items, and 4 direct self-assessments."
      },
      complete: {
        name: "Complete",
        badge: "Full Profile",
        subtitle: "100 questions (32 deep · 32 simple · 32 WYR · 4 direct)",
        description: "Complete assessment of all 100 items: 32 Deep questions, 32 Simple questions, 32 Would You Rather dilemmas, and 4 Direct self-assessments."
      }
    },

    // Results Screen
    analysisComplete: "Analysis complete",
    yourCognitiveProfile: "Your cognitive <span>profile</span>",
    closeAlternative: "Mixed Spectrum · Close Alternative: {type} ({pct}%)",
    aSentenceDescribesYou: "A sentence that describes you",
    aboutArchetype: "About {title} ({type})",
    rankedHierarchyTitle: "COGNITIVE HIERARCHY",
    rankedHierarchySub: "Cognitive Function Agreement Scores (50% is neutral baseline)",
    agreementScoreLabel: "score",
    lowDataLabel: "Low data",
    mbtiAxesTitle: "4 Axes",
    mbtiAxesLead: "Direct axis preference scores calculated from axis item means centered at 50% (neutral).",
    scaleGuideTitle: "Scale Interpretation Guide:",
    scaleGuideDesc: "Percentages represent relative comparative preferences between pole item means centered at 50% (neutral baseline).",
    tierSlight: "50–54%: Slight preference",
    tierModerate: "55–64%: Moderate preference",
    tierStrong: "65–100%: Stronger preference",
    whatSetsYouApart: "Differences",
    whatSetsYouApartLead: "",
    highestAgreement: "Highest Function Agreement",
    lowestAgreement: "Lowest Function Agreement",
    highestCap: "is your primary cognitive engine, steering how you instinctively explore ideas and process truth.",
    balancedCap: "is your most balanced cognitive process, adapting fluidly across varied contexts.",
    lowestCap: "is your least utilized process, representing the cognitive blind spot you most often bypass.",
    otherPersonalitiesTitle: "Other personalities you resemble",
    otherPersonalitiesLead: "Secondary archetype alignments derived from your cognitive distribution.",
    figuresTitle: "Historical & Notable Figures",
    figuresLead: "Comparing your cognitive spectrum against notable minds throughout history.",
    tabSimilarFigures: "10 Most Similar Figures",
    tabOppositeFigures: "10 Polar Opposite Figures",
    compAnalysisTitle: "Comparative Analysis",
    compAnalysisLead: "Pick a historical figure to compare side-by-side across all 8 functions.",
    selectFigureLabel: "Select a figure:",
    youLabel: "You",
    reviewAnswers: "Review answers",
    copyReport: "Copy report",
    printDownload: "Download / Print",
    downloadAnswersJson: "Download answers (JSON)",
    uploadAnswersJson: "Upload answers (JSON)",
    answersLoadedToast: "Answers successfully loaded! Results updated.",
    invalidAnswersFileToast: "Invalid answers JSON file!",
    exportRawJson: "Export raw data (JSON)",

    // Breakdown Section
    breakdownEyebrow: "Score Transparency",
    breakdownTitle: "How your answers influenced each function & axis",
    breakdownLead: "Filter by any cognitive function or axis to see the exact questions that shaped your score, the choices you made, and their directional contribution.",
    filterAll: "All",
    filterAxisGroup: "Axes",
    filterFuncGroup: "Functions",
    yourAnswerLabel: "Your answer",
    impactLabel: "Directional pull",
    sharedUrlConsultationNote: "Viewing a shared profile link. Below is the full calibration guide showing how each question shapes scores.",
    questionsFoundForFilter: "{count} questions mapped to this focus",

    // Tiers
    tiers: {
      balanced: "Balanced (50% / 50%)",
      slight: "Slight preference (Mixed profile)",
      moderate: "Moderate preference",
      strong: "Stronger preference"
    },

    // Axis Labels
    axes: {
      IE: { title: "I — E", subtitle: "Energy: Introversion vs Extraversion", left: "I", leftName: "Introversion", right: "E", rightName: "Extraversion" },
      NS: { title: "N — S", subtitle: "Perception: Intuition vs Sensing", left: "N", leftName: "Intuition", right: "S", rightName: "Sensing" },
      TF: { title: "T — F", subtitle: "Judgment: Thinking vs Feeling", left: "T", leftName: "Thinking", right: "F", rightName: "Feeling" },
      PJ: { title: "P — J", subtitle: "Lifestyle: Perceiving vs Judging", left: "P", leftName: "Perceiving", right: "J", rightName: "Judging" }
    }
  },

  ro: {
    // Nav & Common
    skipLink: "Sari la conținut",
    switchThemeLight: "Comută pe modul luminos",
    switchThemeDark: "Comută pe modul întunecat",
    switchLang: "Switch to English",
    langCode: "EN",
    currentLangName: "Română",
    orderRandom: "Aleator",
    orderFormat: "Format",
    orderFunction: "Funcție",
    orderTooltip: "Ordine: {mode} (Click pentru schimbare)",
    retakeQuiz: "Reia testul",
    restartQuiz: "Reîncepe",
    changeMode: "Schimbă versiunea",
    back: "Înapoi",
    next: "Următoarea",
    finishQuiz: "Finalizează și vezi rezultatele",
    questionMeta: "Întrebarea <b>{current}</b> din {total}",
    resetConfirm: "Resetezi testul curent și toate răspunsurile date?",
    retakeConfirm: "Reiei acest test de la început?",
    quizResetToast: "Testul a fost resetat!",
    reportCopiedToast: "Raportul a fost copiat în clipboard!",
    dataExportedToast: "Datele brute anonime au fost exportate!",
    underQuestionsPrompt: "Ai răspuns la {answered} din {total} întrebări. Vezi rezultatele oricum?",
    inspectQuestion: "Vezi detalii despre întrebare",
    infoClickHint: "Informații (apasă pentru detalii)",
    modalClose: "Închide",
    modalUnderstood: "Am înțeles",
    functionDetailsTitle: "Detalii Funcție Cognitivă",
    assessingCognitiveFunction: "Evaluează Funcția Cognitivă: {code} — {name}",
    lowerPole: "Pol Inferior (Absent):",
    upperPole: "Pol Superior (Dezvoltat):",
    assessingAxisPole: "Evaluează Polul MBTI: {code} — {name}",
    opposingPole: "Pol Opus:",
    underlyingDimension: "Dimensiunea de Bază:",

    // Answer Choices
    answers: {
      STRONGLY_AGREE: "Total de acord",
      AGREE: "De acord",
      NEUTRAL: "Neutru",
      DISAGREE: "Dezacord",
      STRONGLY_DISAGREE: "Total dezacord"
    },

    // Welcome Screen
    welcomeEyebrow: "Evaluare Psihometrică Cognitivă",
    welcomeTitle: "Funcțiile Cognitive Jungiene & Arhetipurile MBTI",
    welcomeLead: "Descoperă-ți mecanismul psihologic prin polaritatea autentică a celor 8 funcții cognitive și a celor 4 axe spectrale MBTI.",
    selectDepth: "Alege Profunzimea Evaluării",
    questionsCount: "întrebări",
    startTest: "Începe testul {name}",
    eightFunctionsTitle: "Cele 8 Funcții Cognitive Jungiene",
    eightFunctionsSub: "Apasă pe oricare funcție pentru a-i explora mecanismul psihologic și definiția polarității.",

    // Modes
    modes: {
      rapid: {
        name: "Rapid",
        badge: "Rapid",
        subtitle: "36 întrebări (32 profunde · 4 directe)",
        description: "Evaluare rapidă cu 32 de întrebări profunde și 4 autoevaluări directe."
      },
      standard: {
        name: "Standard",
        badge: "Recomandat",
        subtitle: "60 întrebări (32 profunde · 24 simple · 4 directe)",
        description: "Calibrare echilibrată cu 32 de întrebări profunde, 24 simple și 4 autoevaluări directe."
      },
      complete: {
        name: "Complet",
        badge: "Profil Complet",
        subtitle: "100 întrebări (32 profunde · 32 simple · 32 WYR · 4 directe)",
        description: "Analiză detaliată completă cu toate cele 100 de întrebări: 32 profunde, 32 simple, 32 dileme Would You Rather și 4 autoevaluări directe."
      }
    },

    // Results Screen
    analysisComplete: "Analiză finalizată",
    yourCognitiveProfile: "Profilul tău <span>cognitiv</span>",
    closeAlternative: "Spectru Mixt · Alternativă Apropiată: {type} ({pct}%)",
    aSentenceDescribesYou: "O frază care te descrie",
    aboutArchetype: "Despre {title} ({type})",
    rankedHierarchyTitle: "COGNITIVE HIERARCHY",
    rankedHierarchySub: "Scoruri de Acord pentru Funcțiile Cognitive (50% este linia neutră de bază)",
    agreementScoreLabel: "scor",
    lowDataLabel: "Date limitate",
    mbtiAxesTitle: "4 Axe",
    mbtiAxesLead: "Scoruri directe de preferință calculate din mediile întrebărilor de axă centrate la 50% (neutru).",
    scaleGuideTitle: "Ghid de Interpretare a Scalei:",
    scaleGuideDesc: "Procentele reprezintă preferințe comparative relative între mediile polilor centrate la 50% (linie neutră).",
    tierSlight: "50–54%: Preferință ușoară",
    tierModerate: "55–64%: Preferință moderată",
    tierStrong: "65–100%: Preferință puternică",
    whatSetsYouApart: "Diferențe",
    whatSetsYouApartLead: "",
    highestAgreement: "Cel Mai Mare Acord Cognitiv",
    lowestAgreement: "Cel Mai Mic Acord Cognitiv",
    highestCap: "este motorul tău cognitiv principal, ghidând modul în care explorezi ideile și procesezi adevărul.",
    balancedCap: "este procesul tău cel mai echilibrat și versatil, adaptabil în funcție de context.",
    lowestCap: "este cel mai puțin utilizat proces al tău, reprezentând punctul orb cognitiv pe care îl ocolești cel mai des.",
    otherPersonalitiesTitle: "Resemble",
    otherPersonalitiesLead: "",
    figuresTitle: "Personalități & Figuri Istorice",
    figuresLead: "Comparație între spectrul tău cognitiv și minți remarcabile din istorie.",
    tabSimilarFigures: "10 Figuri cele mai similare",
    tabOppositeFigures: "10 Figuri polar opuse",
    compAnalysisTitle: "Analiză Comparativă",
    compAnalysisLead: "Alege o personalitate istorică pentru o comparație directă pe toate cele 8 funcții.",
    selectFigureLabel: "Selectează o personalitate:",
    youLabel: "Tu",
    reviewAnswers: "Revizuiește răspunsurile",
    copyReport: "Copiază raportul",
    printDownload: "Descarcă / Printează",
    downloadAnswersJson: "Descarcă răspunsurile (JSON)",
    uploadAnswersJson: "Încarcă răspunsuri (JSON)",
    answersLoadedToast: "Răspunsurile au fost încărcate! Rezultatele s-au actualizat.",
    invalidAnswersFileToast: "Fișierul JSON nu conține răspunsuri valide!",
    exportRawJson: "Exportă date brute (JSON)",

    // Breakdown Section
    breakdownEyebrow: "Transparență Totală",
    breakdownTitle: "Cum au influențat răspunsurile tale funcțiile și axele",
    breakdownLead: "Filtrează după orice funcție cognitivă sau axă pentru a vedea exact întrebările care ți-au format scorul, opțiunile alese și contribuția lor direcțională.",
    filterAll: "Toate",
    filterAxisGroup: "Axe",
    filterFuncGroup: "Funcții",
    yourAnswerLabel: "Răspunsul tău",
    impactLabel: "Influență și Direcție",
    sharedUrlConsultationNote: "Vizualizezi un profil dintr-un link partajat. Mai jos este ghidul complet ce arată cum influențează fiecare întrebare scorurile.",
    questionsFoundForFilter: "{count} întrebări asociate acestui filtru",

    // Tiers
    tiers: {
      balanced: "Echilibrat (50% / 50%)",
      slight: "Preferință ușoară (Profil mixt)",
      moderate: "Preferință moderată",
      strong: "Preferință puternică"
    },

    // Axis Labels
    axes: {
      IE: { title: "I — E", subtitle: "Energie: Introversie vs Extraversie", left: "I", leftName: "Introversie", right: "E", rightName: "Extraversie" },
      NS: { title: "N — S", subtitle: "Percepție: Intuiție vs Senzorial", left: "N", leftName: "Intuiție", right: "S", rightName: "Senzorial" },
      TF: { title: "T — F", subtitle: "Judecată: Gândire vs Afectiv", left: "T", leftName: "Gândire", right: "F", rightName: "Afectiv" },
      PJ: { title: "P — J", subtitle: "Stil de viață: Percepție vs Judecată", left: "P", leftName: "Percepție", right: "J", rightName: "Judecată" }
    }
  }
};

/**
 * Formats a translation string with replacements.
 * Example: t('questionMeta', { current: 1, total: 24 }, 'ro')
 */
export function t(key, params = {}, lang = "ro") {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dict[key] || TRANSLATIONS.en[key] || key;
  if (typeof text !== "string") return text;

  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
  });
  return text;
}
