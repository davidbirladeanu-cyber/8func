/**
 * 8Func - Comprehensive Data-Driven Question Bank (100 Questions)
 * Formats: Deep (24), Short (36), Would You Rather (36), Direct Final (4)
 * Categories: 36 Axis Items (9 per dimension) + 64 Cognitive Function Items (8 per function)
 * Bilingual support (EN & RO) with explicit metadata explanations
 */

export const TEST_MODES = {
  rapid: {
    key: "rapid",
    name: "Fast",
    totalQuestions: 24,
    axisCount: 8,
    functionCount: 16,
    timeEst: "~3 min",
    badge: "Quick",
    subtitle: "24 questions (8 axis · 16 function)",
    description: "Fast pulse assessment measuring the 4 MBTI axes (2 per dimension) and all 8 cognitive functions (2 per function).",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  },
  standard: {
    key: "standard",
    name: "Standard",
    totalQuestions: 60,
    axisCount: 20,
    functionCount: 40,
    timeEst: "~7 min",
    badge: "Recommended",
    isPopular: true,
    subtitle: "60 questions (20 axis · 40 function)",
    description: "Balanced calibration with 5 items per axis dimension and 5 items per cognitive function.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`
  },
  complete: {
    key: "complete",
    name: "Complete",
    totalQuestions: 100,
    axisCount: 36,
    functionCount: 64,
    timeEst: "~12 min",
    badge: "Full Spectrum",
    subtitle: "100 questions (36 axis · 64 function)",
    description: "Complete assessment of all 100 items: 24 Deep questions, 36 Short questions, 36 Would You Rather dilemmas, and 4 Direct self-assessments.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
  }
};

// Aliases for compatibility
Object.defineProperty(TEST_MODES, "quick", { get() { return this.rapid; }, enumerable: false });
Object.defineProperty(TEST_MODES, "fast", { get() { return this.rapid; }, enumerable: false });
Object.defineProperty(TEST_MODES, "recommended", { get() { return this.standard; }, enumerable: false });

export const QUESTIONS_100 = [
  {
    "id": "D01",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "text": "Talking through an important idea with others often helps me discover what I actually think.",
    "textRo": "Discutarea unei idei importante cu alții mă ajută adesea să descopăr ce gândesc cu adevărat.",
    "description": "Measures Extraversion vs Introversion. Agree: E. Disagree: I.",
    "descriptionRo": "Măsoară Extraversie vs Introversie. De acord: E. Dezacord: I.",
    "agreementExplanation": "Agreement favors E.",
    "agreementExplanationRo": "Acordul favorizează E.",
    "disagreementExplanation": "Disagreement favors I.",
    "disagreementExplanationRo": "Dezacordul favorizează I.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D02",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "agreementPole": "I",
    "text": "I need quiet time to understand my thoughts before sharing them.",
    "textRo": "Am nevoie de timp în liniște pentru a-mi înțelege gândurile înainte de a le împărtăși.",
    "description": "Measures Introversion vs Extraversion. Agree: I. Disagree: E.",
    "descriptionRo": "Măsoară Introversie vs Extraversie. De acord: I. Dezacord: E.",
    "agreementExplanation": "Agreement favors I.",
    "agreementExplanationRo": "Acordul favorizează I.",
    "disagreementExplanation": "Disagreement favors E.",
    "disagreementExplanationRo": "Dezacordul favorizează E.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D03",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I am more interested in what information could mean than its immediate practical details.",
    "textRo": "Mă interesează mai mult ce ar putea însemna informația decât detaliile ei practice imediate.",
    "description": "Measures Intuition vs Sensing. Agree: N. Disagree: S.",
    "descriptionRo": "Măsoară Intuiție vs Senzorial. De acord: N. Dezacord: S.",
    "agreementExplanation": "Agreement favors N.",
    "agreementExplanationRo": "Acordul favorizează N.",
    "disagreementExplanation": "Disagreement favors S.",
    "disagreementExplanationRo": "Dezacordul favorizează S.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D04",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "text": "Direct evidence matters more to me than an appealing theory.",
    "textRo": "Dovezile directe contează mai mult pentru mine decât o teorie atrăgătoare.",
    "description": "Measures Sensing vs Intuition. Agree: S. Disagree: N.",
    "descriptionRo": "Măsoară Senzorial vs Intuiție. De acord: S. Dezacord: N.",
    "agreementExplanation": "Agreement favors S.",
    "agreementExplanationRo": "Acordul favorizează S.",
    "disagreementExplanation": "Disagreement favors N.",
    "disagreementExplanationRo": "Dezacordul favorizează N.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D05",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "Consistent reasoning matters more to me than keeping everyone pleased.",
    "textRo": "Raționamentul consecvent contează mai mult pentru mine decât să fie toată lumea mulțumită.",
    "description": "Measures Thinking vs Feeling. Agree: T. Disagree: F.",
    "descriptionRo": "Măsoară Gândire vs Afectiv. De acord: T. Dezacord: F.",
    "agreementExplanation": "Agreement favors T.",
    "agreementExplanationRo": "Acordul favorizează T.",
    "disagreementExplanation": "Disagreement favors F.",
    "disagreementExplanationRo": "Dezacordul favorizează F.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D06",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "text": "When making a decision, I focus more on its effect on people than on how logically sound it is.",
    "textRo": "Când iau o decizie, mă opresc mai mult la efectul ei asupra oamenilor decât la cât de corectă e logic.",
    "description": "Measures Feeling vs Thinking. Agree: F. Disagree: T.",
    "descriptionRo": "Măsoară Afectiv vs Gândire. De acord: F. Dezacord: T.",
    "agreementExplanation": "Agreement favors F.",
    "agreementExplanationRo": "Acordul favorizează F.",
    "disagreementExplanation": "Disagreement favors T.",
    "disagreementExplanationRo": "Dezacordul favorizează T.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D07",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "I feel more comfortable when decisions are settled and next steps are clear.",
    "textRo": "Mă simt mai confortabil când deciziile sunt stabilite și pașii următori sunt clari.",
    "description": "Measures Judging vs Perceiving. Agree: J. Disagree: P.",
    "descriptionRo": "Măsoară Judecată vs Percepție. De acord: J. Dezacord: P.",
    "agreementExplanation": "Agreement favors J.",
    "agreementExplanationRo": "Acordul favorizează J.",
    "disagreementExplanation": "Disagreement favors P.",
    "disagreementExplanationRo": "Dezacordul favorizează P.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D08",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "text": "I prefer keeping options open until I have explored all alternatives.",
    "textRo": "Prefer să păstrez opțiunile deschise până când explorez toate alternativele.",
    "description": "Measures Perceiving vs Judging. Agree: P. Disagree: J.",
    "descriptionRo": "Măsoară Percepție vs Judecată. De acord: P. Dezacord: J.",
    "agreementExplanation": "Agreement favors P.",
    "agreementExplanationRo": "Acordul favorizează P.",
    "disagreementExplanation": "Disagreement favors J.",
    "disagreementExplanationRo": "Dezacordul favorizează J.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D09",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "A new idea brings unexpected possibilities to mind rather than similar situations I have experienced.",
    "textRo": "O idee nouă îmi aduce în minte mai degrabă posibilități neașteptate decât situații similare pe care le-am trăit.",
    "description": "Measures cognitive function Ne vs Si. Agree: Ne. Disagree: Si.",
    "descriptionRo": "Măsoară funcția cognitivă Ne vs Si. De acord: Ne. Dezacord: Si.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D10",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "Before trying something new, I look at how similar things unfolded in the past.",
    "textRo": "Înainte de a încerca ceva nou, mă uit cum au decurs lucruri asemănătoare în trecut.",
    "description": "Measures cognitive function Si vs Ne. Agree: Si. Disagree: Ne.",
    "descriptionRo": "Măsoară funcția cognitivă Si vs Ne. De acord: Si. Dezacord: Ne.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D11",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I often have a clear intuition about how things will connect before I can explain why.",
    "textRo": "Am adesea o intuiție clară despre cum se vor lega lucrurile, înainte să pot explica de ce.",
    "description": "Measures cognitive function Ni vs Se. Agree: Ni. Disagree: Se.",
    "descriptionRo": "Măsoară funcția cognitivă Ni vs Se. De acord: Ni. Dezacord: Se.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D12",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I immediately notice what changes around me (objects, movements, sounds) without specially focusing.",
    "textRo": "Observ imediat ce se schimbă în jurul meu (obiecte, mișcări, zgomote), fără să mă concentrez special.",
    "description": "Measures cognitive function Se vs Ni. Agree: Se. Disagree: Ni.",
    "descriptionRo": "Măsoară funcția cognitivă Se vs Ni. De acord: Se. Dezacord: Ni.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D13",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "If a decision yields measurable results, I consider it good even if it does not fit what I feel.",
    "textRo": "Dacă o decizie dă rezultate măsurabile, o consider bună chiar dacă nu se potrivește cu ce simt.",
    "description": "Measures cognitive function Te vs Fi. Agree: Te. Disagree: Fi.",
    "descriptionRo": "Măsoară funcția cognitivă Te vs Fi. De acord: Te. Dezacord: Fi.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D14",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I prefer to forfeit a good result rather than support something that conflicts with my deep values.",
    "textRo": "Prefer să renunț la un rezultat bun decât să susțin ceva ce intră în conflict cu valorile mele profunde.",
    "description": "Measures cognitive function Fi vs Te. Agree: Fi. Disagree: Te.",
    "descriptionRo": "Măsoară funcția cognitivă Fi vs Te. De acord: Fi. Dezacord: Te.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D15",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I prefer building an explanation until it connects logically, rather than accepting it just because the group does.",
    "textRo": "Prefer să-mi construiesc o explicație până se leagă logic, decât s-o accept doar pentru că grupul o acceptă.",
    "description": "Measures cognitive function Ti vs Fe. Agree: Ti. Disagree: Fe.",
    "descriptionRo": "Măsoară funcția cognitivă Ti vs Fe. De acord: Ti. Dezacord: Fe.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D16",
    "format": "deep",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I spontaneously adjust my tone and words to the state of those before me without thinking about it.",
    "textRo": "Îmi ajustez spontan tonul și cuvintele după starea celor din fața mea, fără să mă gândesc la asta.",
    "description": "Measures cognitive function Fe vs Ti. Agree: Fe. Disagree: Ti.",
    "descriptionRo": "Măsoară funcția cognitivă Fe vs Ti. De acord: Fe. Dezacord: Ti.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D17",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "agreementPole": "Ne",
    "text": "I prefer generating many possibilities rather than limiting myself to a single final conclusion.",
    "textRo": "Prefer să generez multe posibilități decât să mă limitez la o singură concluzie finală.",
    "description": "Measures cognitive function Ne vs Ni. Agree: Ne. Disagree: Ni.",
    "descriptionRo": "Măsoară funcția cognitivă Ne vs Ni. De acord: Ne. Dezacord: Ni.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D18",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "agreementPole": "Ni",
    "text": "I naturally synthesize scattered details into a single coherent vision, rather than seeking alternatives.",
    "textRo": "Sintetizez natural detaliile răsfirate într-o singură viziune coerentă, în loc să caut alternative.",
    "description": "Measures cognitive function Ni vs Ne. Agree: Ni. Disagree: Ne.",
    "descriptionRo": "Măsoară funcția cognitivă Ni vs Ne. De acord: Ni. Dezacord: Ne.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D19",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "agreementPole": "Se",
    "text": "I feel most alive in the immediate reality of the present, rather than relying on past experiences.",
    "textRo": "Mă simt plin de viață în realitatea imediată a prezentului, în loc să mă bazez pe experiențe trecute.",
    "description": "Measures cognitive function Se vs Si. Agree: Se. Disagree: Si.",
    "descriptionRo": "Măsoară funcția cognitivă Se vs Si. De acord: Se. Dezacord: Si.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D20",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "agreementPole": "Si",
    "text": "I rely heavily on proven methods from the past, rather than adapting spontaneously to new circumstances.",
    "textRo": "Mă bazez mult pe metode verificate din trecut, în loc să mă adaptez spontan la circumstanțe noi.",
    "description": "Measures cognitive function Si vs Se. Agree: Si. Disagree: Se.",
    "descriptionRo": "Măsoară funcția cognitivă Si vs Se. De acord: Si. Dezacord: Se.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D21",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "agreementPole": "Te",
    "text": "The fact that a system works efficiently is more important than understanding its exact logical principles.",
    "textRo": "Faptul că un sistem funcționează eficient e mai important decât înțelegerea principiilor logice exacte.",
    "description": "Measures cognitive function Te vs Ti. Agree: Te. Disagree: Ti.",
    "descriptionRo": "Măsoară funcția cognitivă Te vs Ti. De acord: Te. Dezacord: Ti.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D22",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "agreementPole": "Ti",
    "text": "I need to understand the precise logic behind it, even if that delays practical implementation.",
    "textRo": "Trebuie să înțeleg logica precisă din spate, chiar dacă asta întârzie implementarea practică.",
    "description": "Measures cognitive function Ti vs Te. Agree: Ti. Disagree: Te.",
    "descriptionRo": "Măsoară funcția cognitivă Ti vs Te. De acord: Ti. Dezacord: Te.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D23",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "agreementPole": "Fe",
    "text": "Maintaining group harmony matters more to me than strictly asserting my personal feelings.",
    "textRo": "Menținerea armoniei în grup contează mai mult pentru mine decât afirmarea strictă a sentimentelor mele.",
    "description": "Measures cognitive function Fe vs Fi. Agree: Fe. Disagree: Fi.",
    "descriptionRo": "Măsoară funcția cognitivă Fe vs Fi. De acord: Fe. Dezacord: Fi.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D24",
    "format": "deep",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "agreementPole": "Fi",
    "text": "Staying true to my core values is more important than adapting to the group's emotional state.",
    "textRo": "Să rămân fidel valorilor mele de bază e mai important decât să mă adaptez la starea emoțională a grupului.",
    "description": "Measures cognitive function Fi vs Fe. Agree: Fi. Disagree: Fe.",
    "descriptionRo": "Măsoară funcția cognitivă Fi vs Fe. De acord: Fi. Dezacord: Fe.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S01",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "weight": 1,
    "text": "I clarify my thoughts better by talking with someone than sitting alone with them.",
    "textRo": "Îmi clarific gândurile mai bine vorbind cu cineva decât stând singur cu ele.",
    "description": "Compares Extraversion with Introversion. Agree: E. Disagree: I.",
    "descriptionRo": "Compară Extraversie cu Introversie. De acord: E. Dezacord: I.",
    "agreementExplanation": "Agreement favors E.",
    "agreementExplanationRo": "Acordul favorizează E.",
    "disagreementExplanation": "Disagreement favors I.",
    "disagreementExplanationRo": "Dezacordul favorizează I.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S02",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "agreementPole": "I",
    "weight": 2,
    "text": "I prefer preparing what I want to say in my mind rather than improvising during the conversation.",
    "textRo": "Prefer să-mi pregătesc în minte ce vreau să spun decât să improvizez în timpul conversației.",
    "description": "Compares Introversion with Extraversion. Agree: I. Disagree: E.",
    "descriptionRo": "Compară Introversie cu Extraversie. De acord: I. Dezacord: E.",
    "agreementExplanation": "Agreement favors I.",
    "agreementExplanationRo": "Acordul favorizează I.",
    "disagreementExplanation": "Disagreement favors E.",
    "disagreementExplanationRo": "Dezacordul favorizează E.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S03",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "weight": 1,
    "text": "After a day spent among people, I feel energized rather than drained of energy.",
    "textRo": "După o zi petrecută printre oameni mă simt mai degrabă încărcat decât golit de energie.",
    "description": "Compares Extraversion with Introversion. Agree: E. Disagree: I.",
    "descriptionRo": "Compară Extraversie cu Introversie. De acord: E. Dezacord: I.",
    "agreementExplanation": "Agreement favors E.",
    "agreementExplanationRo": "Acordul favorizează E.",
    "disagreementExplanation": "Disagreement favors I.",
    "disagreementExplanationRo": "Dezacordul favorizează I.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S04",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "weight": 1,
    "text": "I trust what I can directly see and verify more than what can only be inferred.",
    "textRo": "Mă încred mai mult în ce pot vedea și verifica direct decât în ce se poate doar deduce.",
    "description": "Compares Sensing with Intuition. Agree: S. Disagree: N.",
    "descriptionRo": "Compară Senzorial cu Intuiție. De acord: S. Dezacord: N.",
    "agreementExplanation": "Agreement favors S.",
    "agreementExplanationRo": "Acordul favorizează S.",
    "disagreementExplanation": "Disagreement favors N.",
    "disagreementExplanationRo": "Dezacordul favorizează N.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S05",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "weight": 2,
    "text": "I am more drawn to what a situation could become than what it concretely is right now.",
    "textRo": "Mă atrage mai mult ce ar putea deveni o situație decât ce este ea concret acum.",
    "description": "Compares Intuition with Sensing. Agree: N. Disagree: S.",
    "descriptionRo": "Compară Intuiție cu Senzorial. De acord: N. Dezacord: S.",
    "agreementExplanation": "Agreement favors N.",
    "agreementExplanationRo": "Acordul favorizează N.",
    "disagreementExplanation": "Disagreement favors S.",
    "disagreementExplanationRo": "Dezacordul favorizează S.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S06",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "weight": 1,
    "text": "I prefer working with concrete, exact details rather than general ideas.",
    "textRo": "Prefer să lucrez cu detalii concrete și exacte decât cu idei generale.",
    "description": "Compares Sensing with Intuition. Agree: S. Disagree: N.",
    "descriptionRo": "Compară Senzorial cu Intuiție. De acord: S. Dezacord: N.",
    "agreementExplanation": "Agreement favors S.",
    "agreementExplanationRo": "Acordul favorizează S.",
    "disagreementExplanation": "Disagreement favors N.",
    "disagreementExplanationRo": "Dezacordul favorizează N.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S07",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "weight": 1,
    "text": "When evaluating an idea, I first ask how it will affect people, then whether it is correct.",
    "textRo": "Când evaluez o idee, mă întreb mai întâi cum îi va afecta pe oameni, apoi dacă e corectă.",
    "description": "Compares Feeling with Thinking. Agree: F. Disagree: T.",
    "descriptionRo": "Compară Afectiv cu Gândire. De acord: F. Dezacord: T.",
    "agreementExplanation": "Agreement favors F.",
    "agreementExplanationRo": "Acordul favorizează F.",
    "disagreementExplanation": "Disagreement favors T.",
    "disagreementExplanationRo": "Dezacordul favorizează T.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S08",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "weight": 2,
    "text": "When someone asks my opinion, I say what is correct, even if it is not pleasing to hear.",
    "textRo": "Când cineva îmi cere părerea, spun ce e corect, chiar dacă nu îi face plăcere.",
    "description": "Compares Thinking with Feeling. Agree: T. Disagree: F.",
    "descriptionRo": "Compară Gândire cu Afectiv. De acord: T. Dezacord: F.",
    "agreementExplanation": "Agreement favors T.",
    "agreementExplanationRo": "Acordul favorizează T.",
    "disagreementExplanation": "Disagreement favors F.",
    "disagreementExplanationRo": "Dezacordul favorizează F.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S09",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "weight": 1,
    "text": "I can overlook a logical flaw if I see that someone's feelings are at stake.",
    "textRo": "Pot trece peste o eroare logică dacă văd că sunt în joc sentimentele cuiva.",
    "description": "Compares Feeling with Thinking. Agree: F. Disagree: T.",
    "descriptionRo": "Compară Afectiv cu Gândire. De acord: F. Dezacord: T.",
    "agreementExplanation": "Agreement favors F.",
    "agreementExplanationRo": "Acordul favorizează F.",
    "disagreementExplanation": "Disagreement favors T.",
    "disagreementExplanationRo": "Dezacordul favorizează T.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S10",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "weight": 1,
    "text": "I prefer deciding as I go when I see how things evolve, rather than fixing the plan from the start.",
    "textRo": "Prefer să decid pe parcurs, când văd cum evoluează lucrurile, decât să fixez planul din start.",
    "description": "Compares Perceiving with Judging. Agree: P. Disagree: J.",
    "descriptionRo": "Compară Percepție cu Judecată. De acord: P. Dezacord: J.",
    "agreementExplanation": "Agreement favors P.",
    "agreementExplanationRo": "Acordul favorizează P.",
    "disagreementExplanation": "Disagreement favors J.",
    "disagreementExplanationRo": "Dezacordul favorizează J.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S11",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "weight": 2,
    "text": "I feel better when I know in advance what comes next than when leaving things open.",
    "textRo": "Mă simt mai bine când știu din timp ce urmează decât când las lucrurile deschise.",
    "description": "Compares Judging with Perceiving. Agree: J. Disagree: P.",
    "descriptionRo": "Compară Judecată cu Percepție. De acord: J. Dezacord: P.",
    "agreementExplanation": "Agreement favors J.",
    "agreementExplanationRo": "Acordul favorizează J.",
    "disagreementExplanation": "Disagreement favors P.",
    "disagreementExplanationRo": "Dezacordul favorizează P.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S12",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "weight": 1,
    "text": "Closing a decision too early bothers me more than leaving it open.",
    "textRo": "Mă deranjează mai tare să închid o decizie prea devreme decât să o las deschisă.",
    "description": "Compares Perceiving with Judging. Agree: P. Disagree: J.",
    "descriptionRo": "Compară Percepție cu Judecată. De acord: P. Dezacord: J.",
    "agreementExplanation": "Agreement favors P.",
    "agreementExplanationRo": "Acordul favorizează P.",
    "disagreementExplanation": "Disagreement favors J.",
    "disagreementExplanationRo": "Dezacordul favorizează J.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S13",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "weight": 1,
    "text": "When something is unclear, multiple possible explanations come to mind without knowing which is right initially.",
    "textRo": "Când ceva e neclar, îmi vin în minte mai multe explicații posibile, fără să știu de la început care e cea bună.",
    "description": "Compares cognitive function Ne with Si. Agree: Ne. Disagree: Si.",
    "descriptionRo": "Compară funcția cognitivă Ne cu Si. De acord: Ne. Dezacord: Si.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S14",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "weight": 1,
    "text": "When something is unclear, I first look for a similar situation I have already experienced.",
    "textRo": "Când ceva e neclar, caut mai întâi o situație asemănătoare pe care am trăit-o deja.",
    "description": "Compares cognitive function Si with Ne. Agree: Si. Disagree: Ne.",
    "descriptionRo": "Compară funcția cognitivă Si cu Ne. De acord: Si. Dezacord: Ne.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S15",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "weight": 1,
    "text": "I quickly get bored repeating a familiar method and seek to change it.",
    "textRo": "Mă plictisesc repede când repet o metodă cunoscută și caut să o schimb.",
    "description": "Compares cognitive function Ne with Si. Agree: Ne. Disagree: Si.",
    "descriptionRo": "Compară funcția cognitivă Ne cu Si. De acord: Ne. Dezacord: Si.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S16",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "weight": 1,
    "text": "I often \"know\" where things are headed long-term, without being able to point out the steps that brought me there.",
    "textRo": "Deseori „știu” încotro merg lucrurile pe termen lung, fără să pot arăta pașii prin care am ajuns la asta.",
    "description": "Compares cognitive function Ni with Se. Agree: Ni. Disagree: Se.",
    "descriptionRo": "Compară funcția cognitivă Ni cu Se. De acord: Ni. Dezacord: Se.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S17",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "weight": 1,
    "text": "I learn better by trying directly with my hands and body, rather than thinking through the concept first.",
    "textRo": "Învăț mai bine încercând direct, cu mâinile și corpul, decât gândind mai întâi conceptul.",
    "description": "Compares cognitive function Se with Ni. Agree: Se. Disagree: Ni.",
    "descriptionRo": "Compară funcția cognitivă Se cu Ni. De acord: Se. Dezacord: Ni.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S18",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "weight": 1,
    "text": "I quickly notice physical environment details (a moved object, a new sound) that others do not see.",
    "textRo": "Observ repede detalii din mediul fizic (un obiect mutat, un zgomot nou) pe care alții nu le văd.",
    "description": "Compares cognitive function Se with Ni. Agree: Se. Disagree: Ni.",
    "descriptionRo": "Compară funcția cognitivă Se cu Ni. De acord: Se. Dezacord: Ni.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S19",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "weight": 1,
    "text": "When I have multiple tasks, I break them into measurable steps and track them by results.",
    "textRo": "Când am mai multe sarcini, le împart în pași măsurabili și le urmăresc după rezultate.",
    "description": "Compares cognitive function Te with Fi. Agree: Te. Disagree: Fi.",
    "descriptionRo": "Compară funcția cognitivă Te cu Fi. De acord: Te. Dezacord: Fi.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S20",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "weight": 1,
    "text": "If a task contradicts what I believe in, I refuse it even if it would yield good results.",
    "textRo": "Dacă o sarcină mă contrazice în ce cred, o refuz chiar dacă ar da rezultate bune.",
    "description": "Compares cognitive function Fi with Te. Agree: Fi. Disagree: Te.",
    "descriptionRo": "Compară funcția cognitivă Fi cu Te. De acord: Fi. Dezacord: Te.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S21",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "weight": 1,
    "text": "I choose between options based on objective criteria (cost, time, efficiency), not on how I feel.",
    "textRo": "Aleg între variante după criterii obiective (cost, timp, eficiență), nu după cum simt.",
    "description": "Compares cognitive function Te with Fi. Agree: Te. Disagree: Fi.",
    "descriptionRo": "Compară funcția cognitivă Te cu Fi. De acord: Te. Dezacord: Fi.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S22",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "weight": 1,
    "text": "If an argument has a logical flaw, I point it out, even if that dampens the mood.",
    "textRo": "Dacă un argument are o fisură logică, o spun, chiar dacă asta strică atmosfera.",
    "description": "Compares cognitive function Ti with Fe. Agree: Ti. Disagree: Fe.",
    "descriptionRo": "Compară funcția cognitivă Ti cu Fe. De acord: Ti. Dezacord: Fe.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S23",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "weight": 1,
    "text": "In a discussion, I notice how those around me feel faster than any inconsistencies in what is said.",
    "textRo": "Într-o discuție, observ mai repede cum se simt cei din jur decât ce inconsecvențe apar în ce se spune.",
    "description": "Compares cognitive function Fe with Ti. Agree: Fe. Disagree: Ti.",
    "descriptionRo": "Compară funcția cognitivă Fe cu Ti. De acord: Fe. Dezacord: Ti.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S24",
    "format": "short",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "weight": 1,
    "text": "I choose my words according to who is listening, even if it means not stating everything I think exactly.",
    "textRo": "Îmi aleg cuvintele după cine mă ascultă, chiar dacă asta înseamnă să nu spun tot ce gândesc, exact.",
    "description": "Compares cognitive function Fe with Ti. Agree: Fe. Disagree: Ti.",
    "descriptionRo": "Compară funcția cognitivă Fe cu Ti. De acord: Fe. Dezacord: Ti.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S25",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "agreementPole": "Ne",
    "weight": 1,
    "text": "When solving a problem, I prefer generating many possible paths rather than picking a single one early.",
    "textRo": "Când rezolv o problemă, prefer să generez multe căi posibile decât să aleg una singură devreme.",
    "description": "Compares cognitive function Ne with Ni. Agree: Ne. Disagree: Ni.",
    "descriptionRo": "Compară funcția cognitivă Ne cu Ni. De acord: Ne. Dezacord: Ni.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S26",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "agreementPole": "Ni",
    "weight": 1,
    "text": "When seeing many separate data points, I feel the need to reduce them to a single central idea.",
    "textRo": "Când văd multe date separate, simt nevoia să le reduc la o singură idee centrală.",
    "description": "Compares cognitive function Ni with Ne. Agree: Ni. Disagree: Ne.",
    "descriptionRo": "Compară funcția cognitivă Ni cu Ne. De acord: Ni. Dezacord: Ne.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S27",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "agreementPole": "Ni",
    "weight": 1,
    "text": "I feel more confident after arriving at a single conclusion than when multiple variants remain.",
    "textRo": "Mă simt mai sigur după ce am ajuns la o singură concluzie decât când rămân mai multe variante.",
    "description": "Compares cognitive function Ni with Ne. Agree: Ni. Disagree: Ne.",
    "descriptionRo": "Compară funcția cognitivă Ni cu Ne. De acord: Ni. Dezacord: Ne.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S28",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "agreementPole": "Si",
    "weight": 1,
    "text": "In new situations, my reaction stems more from what I remember than what I perceive in this moment.",
    "textRo": "În situații noi, reacția mea vine mai mult din ce îmi amintesc decât din ce percep în acest moment.",
    "description": "Compares cognitive function Si with Se. Agree: Si. Disagree: Se.",
    "descriptionRo": "Compară funcția cognitivă Si cu Se. De acord: Si. Dezacord: Se.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S29",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "agreementPole": "Se",
    "weight": 1,
    "text": "I enjoy intense physical experiences lived in the present moment the most.",
    "textRo": "Mă bucur cel mai mult de experiențe fizice intense, trăite în prezent.",
    "description": "Compares cognitive function Se with Si. Agree: Se. Disagree: Si.",
    "descriptionRo": "Compară funcția cognitivă Se cu Si. De acord: Se. Dezacord: Si.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S30",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "agreementPole": "Si",
    "weight": 1,
    "text": "A familiar place, taste, or scent comforts me more than a new and intense one.",
    "textRo": "Un loc, un gust sau un miros familiar mă liniștește mai mult decât unul nou și intens.",
    "description": "Compares cognitive function Si with Se. Agree: Si. Disagree: Se.",
    "descriptionRo": "Compară funcția cognitivă Si cu Se. De acord: Si. Dezacord: Se.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S31",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "agreementPole": "Te",
    "weight": 1,
    "text": "It satisfies me more to finish something that works than to completely understand its mechanism.",
    "textRo": "Mă satisface mai mult să termin ceva care funcționează decât să-i înțeleg complet mecanismul.",
    "description": "Compares cognitive function Te with Ti. Agree: Te. Disagree: Ti.",
    "descriptionRo": "Compară funcția cognitivă Te cu Ti. De acord: Te. Dezacord: Ti.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S32",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "agreementPole": "Ti",
    "weight": 1,
    "text": "I stick with a problem until I understand its logic completely, even if the practical solution is already sufficient.",
    "textRo": "Rămân la o problemă până îi înțeleg complet logica, chiar dacă soluția practică ar fi deja suficientă.",
    "description": "Compares cognitive function Ti with Te. Agree: Ti. Disagree: Te.",
    "descriptionRo": "Compară funcția cognitivă Ti cu Te. De acord: Ti. Dezacord: Te.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S33",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "agreementPole": "Ti",
    "weight": 1,
    "text": "A solution that works but cannot be logically explained bothers me.",
    "textRo": "Mă deranjează o soluție care merge, dar pe care nu o pot explica logic.",
    "description": "Compares cognitive function Ti with Te. Agree: Ti. Disagree: Te.",
    "descriptionRo": "Compară funcția cognitivă Ti cu Te. De acord: Ti. Dezacord: Te.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S34",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "agreementPole": "Fi",
    "weight": 1,
    "text": "I express my feelings as I feel them, even if they don't match the group's mood.",
    "textRo": "Îmi exprim sentimentele așa cum le simt, chiar dacă nu se potrivesc cu starea grupului.",
    "description": "Compares cognitive function Fi with Fe. Agree: Fi. Disagree: Fe.",
    "descriptionRo": "Compară funcția cognitivă Fi cu Fe. De acord: Fi. Dezacord: Fe.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S35",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "agreementPole": "Fe",
    "weight": 1,
    "text": "I adapt how I show my feelings to the state of the group.",
    "textRo": "Îmi adaptez felul în care îmi arăt sentimentele după starea grupului.",
    "description": "Compares cognitive function Fe with Fi. Agree: Fe. Disagree: Fi.",
    "descriptionRo": "Compară funcția cognitivă Fe cu Fi. De acord: Fe. Dezacord: Fi.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S36",
    "format": "short",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "agreementPole": "Fi",
    "weight": 1,
    "text": "A feeling I experience strongly but cannot explain matters more to me than others' opinions.",
    "textRo": "Un sentiment pe care îl simt puternic, dar nu îl pot explica, contează pentru mine mai mult decât părerea celorlalți.",
    "description": "Compares cognitive function Fi with Fe. Agree: Fi. Disagree: Fe.",
    "descriptionRo": "Compară funcția cognitivă Fi cu Fe. De acord: Fi. Dezacord: Fe.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "W01",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "When you have a new idea, what do you do first?",
    "textRo": "Când ai o idee nouă, ce faci mai întâi?",
    "description": "Dilemma balancing Extraversion (Option A) vs Introversion (Option B).",
    "descriptionRo": "Dilemă între Extraversie (Opțiunea A) și Introversie (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Tell it to someone to hear it out loud.",
        "textRo": "O spun cuiva, ca s-o aud cu voce tare.",
        "explanation": "Favors E (+1.0).",
        "explanationRo": "Favorizează E (+1.0)."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Let it settle in my mind before speaking.",
        "textRo": "O las să se așeze în minte înainte s-o spun.",
        "explanation": "Favors I (+1.0).",
        "explanationRo": "Favorizează I (+1.0)."
      }
    ]
  },
  {
    "id": "W02",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "text": "After a hard week, how do you recharge?",
    "textRo": "După o săptămână grea, cum te încarci?",
    "description": "Dilemma balancing Introversion (Option A) vs Extraversion (Option B).",
    "descriptionRo": "Dilemă între Introversie (Opțiunea A) și Extraversie (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Stay alone in quiet reflection.",
        "textRo": "Stau singur, în liniște.",
        "explanation": "Favors I (+1.0).",
        "explanationRo": "Favorizează I (+1.0)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Go out and socialize among people.",
        "textRo": "Ies printre oameni.",
        "explanation": "Favors E (+1.0).",
        "explanationRo": "Favorizează E (+1.0)."
      }
    ]
  },
  {
    "id": "W03",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "At an event with many strangers:",
    "textRo": "La un eveniment cu mulți necunoscuți:",
    "description": "Dilemma balancing Extraversion (Option A) vs Introversion (Option B).",
    "descriptionRo": "Dilemă între Extraversie (Opțiunea A) și Introversie (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Approach as many people as possible.",
        "textRo": "Mă apropii de cât mai mulți.",
        "explanation": "Favors E (+1.0).",
        "explanationRo": "Favorizează E (+1.0)."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Stay with 1–2 people and converse deeply.",
        "textRo": "Rămân cu 1–2 persoane și vorbesc mai profund.",
        "explanation": "Favors I (+1.0).",
        "explanationRo": "Favorizează I (+1.0)."
      }
    ]
  },
  {
    "id": "W04",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "When learning something new, what draws you in more?",
    "textRo": "Când afli ceva nou, ce te atrage mai mult?",
    "description": "Dilemma balancing Intuition (Option A) vs Sensing (Option B).",
    "descriptionRo": "Dilemă între Intuiție (Opțiunea A) și Senzorial (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "What can be inferred from it about other things.",
        "textRo": "Ce se poate deduce din el despre alte lucruri.",
        "explanation": "Favors N (+1.0).",
        "explanationRo": "Favorizează N (+1.0)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "What it concretely and accurately shows as is.",
        "textRo": "Ce arată concret și exact, așa cum e acum.",
        "explanation": "Favors S (+1.0).",
        "explanationRo": "Favorizează S (+1.0)."
      }
    ]
  },
  {
    "id": "W05",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "text": "When learning a new skill:",
    "textRo": "Când înveți o abilitate nouă:",
    "description": "Dilemma balancing Sensing (Option A) vs Intuition (Option B).",
    "descriptionRo": "Dilemă între Senzorial (Opțiunea A) și Intuiție (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "S",
        "text": "I want concrete examples and exact steps.",
        "textRo": "Vreau exemple concrete și pași exacți.",
        "explanation": "Favors S (+1.0).",
        "explanationRo": "Favorizează S (+1.0)."
      },
      {
        "id": "B",
        "pole": "N",
        "text": "I want to understand the overarching concept behind it.",
        "textRo": "Vreau să înțeleg ideea generală din spatele ei.",
        "explanation": "Favors N (+1.0).",
        "explanationRo": "Favorizează N (+1.0)."
      }
    ]
  },
  {
    "id": "W06",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "text": "At an exhibition:",
    "textRo": "La o expoziție:",
    "description": "Dilemma balancing Sensing (Option A) vs Intuition (Option B).",
    "descriptionRo": "Dilemă între Senzorial (Opțiunea A) și Intuiție (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "S",
        "text": "Focus on the details of each individual piece.",
        "textRo": "Mă opresc la detaliile fiecărei piese.",
        "explanation": "Favors S (+1.0).",
        "explanationRo": "Favorizează S (+1.0)."
      },
      {
        "id": "B",
        "pole": "N",
        "text": "Reflect on what all the pieces signify together.",
        "textRo": "Mă gândesc ce vor să spună toate împreună.",
        "explanation": "Favors N (+1.0).",
        "explanationRo": "Favorizează N (+1.0)."
      }
    ]
  },
  {
    "id": "W07",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "text": "When making a tough decision, what weighs more heavily?",
    "textRo": "Când trebuie luată o decizie grea, ce cântărește mai mult?",
    "description": "Dilemma balancing Feeling (Option A) vs Thinking (Option B).",
    "descriptionRo": "Dilemă între Afectiv (Opțiunea A) și Gândire (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "F",
        "text": "The personal situation of each person involved.",
        "textRo": "Situația fiecărui om implicat.",
        "explanation": "Favors F (+1.0).",
        "explanationRo": "Favorizează F (+1.0)."
      },
      {
        "id": "B",
        "pole": "T",
        "text": "The most logically consistent rule.",
        "textRo": "Regula cea mai consecventă.",
        "explanation": "Favors T (+1.0).",
        "explanationRo": "Favorizează T (+1.0)."
      }
    ]
  },
  {
    "id": "W08",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "A colleague made a mistake and needs feedback:",
    "textRo": "Un coleg a greșit și va fi criticat:",
    "description": "Dilemma balancing Thinking (Option A) vs Feeling (Option B).",
    "descriptionRo": "Dilemă între Gândire (Opțiunea A) și Afectiv (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Tell them directly what failed so they don't repeat it.",
        "textRo": "Îi spun direct ce nu a mers, ca să nu repete.",
        "explanation": "Favors T (+1.0).",
        "explanationRo": "Favorizează T (+1.0)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Tell them gently, considering how they arrived at the mistake.",
        "textRo": "Îi spun cu grijă, ținând cont de cum a ajuns la greșeală.",
        "explanation": "Favors F (+1.0).",
        "explanationRo": "Favorizează F (+1.0)."
      }
    ]
  },
  {
    "id": "W09",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "text": "How do you choose between two job offers?",
    "textRo": "Cum alegi între două oferte de muncă?",
    "description": "Dilemma balancing Feeling (Option A) vs Thinking (Option B).",
    "descriptionRo": "Dilemă între Afectiv (Opțiunea A) și Gândire (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "F",
        "text": "Consider how those close to me will be affected.",
        "textRo": "Mă gândesc cum vor fi afectați cei apropiați de alegerea mea.",
        "explanation": "Favors F (+1.0).",
        "explanationRo": "Favorizează F (+1.0)."
      },
      {
        "id": "B",
        "pole": "T",
        "text": "Compare objective criteria, one by one.",
        "textRo": "Compar criteriile obiective, una câte una.",
        "explanation": "Favors T (+1.0).",
        "explanationRo": "Favorizează T (+1.0)."
      }
    ]
  },
  {
    "id": "W10",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "When working on a long-term project:",
    "textRo": "Când lucrezi la un proiect lung:",
    "description": "Dilemma balancing Judging (Option A) vs Perceiving (Option B).",
    "descriptionRo": "Dilemă între Judecată (Opțiunea A) și Percepție (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Set a clear plan from the start and adhere to it.",
        "textRo": "Stabilesc un plan clar de la început și îl respect.",
        "explanation": "Favors J (+1.0).",
        "explanationRo": "Favorizează J (+1.0)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Keep the plan flexible and adjust along the way.",
        "textRo": "Las planul flexibil și ajustez pe parcurs.",
        "explanation": "Favors P (+1.0).",
        "explanationRo": "Favorizează P (+1.0)."
      }
    ]
  },
  {
    "id": "W11",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "text": "Friday evening with no obligations:",
    "textRo": "Vineri seara, fără obligații:",
    "description": "Dilemma balancing Perceiving (Option A) vs Judging (Option B).",
    "descriptionRo": "Dilemă între Percepție (Opțiunea A) și Judecată (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "P",
        "text": "Decide on the spot what to do.",
        "textRo": "Decid pe loc ce fac.",
        "explanation": "Favors P (+1.0).",
        "explanationRo": "Favorizează P (+1.0)."
      },
      {
        "id": "B",
        "pole": "J",
        "text": "Already have something arranged in advance.",
        "textRo": "Am deja ceva stabilit din timp.",
        "explanation": "Favors J (+1.0).",
        "explanationRo": "Favorizează J (+1.0)."
      }
    ]
  },
  {
    "id": "W12",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "When facing a deadline:",
    "textRo": "Când ai un termen:",
    "description": "Dilemma balancing Judging (Option A) vs Perceiving (Option B).",
    "descriptionRo": "Dilemă între Judecată (Opțiunea A) și Percepție (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Finish ahead of time to avoid stress.",
        "textRo": "Termin din timp, ca să nu mă streseze.",
        "explanation": "Favors J (+1.0).",
        "explanationRo": "Favorizează J (+1.0)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Work best right up against the deadline.",
        "textRo": "Lucrez cel mai bine aproape de termen.",
        "explanation": "Favors P (+1.0).",
        "explanationRo": "Favorizează P (+1.0)."
      }
    ]
  },
  {
    "id": "W13",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Si",
    "text": "When a project stalls:",
    "textRo": "Când un proiect stagnează:",
    "description": "Dilemma balancing Ne (Option A) vs Si (Option B).",
    "descriptionRo": "Dilemă între funcția Ne (Opțiunea A) și Si (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Try something unconventional, even if never seen before.",
        "textRo": "Încerc ceva neconvențional, chiar dacă nu am mai văzut așa ceva.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Refine and improve an approach I already know well.",
        "textRo": "Îmbunătățesc o abordare pe care o cunosc deja.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W14",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Ne",
    "text": "With a tight deadline, what do you trust more?",
    "textRo": "Când ai un termen strâns, în ce ai mai multă încredere?",
    "description": "Dilemma balancing Si (Option A) vs Ne (Option B).",
    "descriptionRo": "Dilemă între funcția Si (Opțiunea A) și Ne (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "In a proven method that worked previously.",
        "textRo": "Într-o metodă care a funcționat anterior.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "In a fresh solution invented on the spot.",
        "textRo": "Într-o soluție nouă pe care o inventez acum.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      }
    ]
  },
  {
    "id": "W15",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Si",
    "text": "At a new restaurant:",
    "textRo": "La un restaurant nou:",
    "description": "Dilemma balancing Ne (Option A) vs Si (Option B).",
    "descriptionRo": "Dilemă între funcția Ne (Opțiunea A) și Si (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Order something I have never tasted before.",
        "textRo": "Comand ceva ce n-am mai gustat.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Order something similar to what I enjoyed before.",
        "textRo": "Comand ceva asemănător cu ce mi-a plăcut înainte.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W16",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "text": "When observing a complex situation, what draws your attention?",
    "textRo": "Când observi o situație complexă, ce îți atrage atenția?",
    "description": "Dilemma balancing Se (Option A) vs Ni (Option B).",
    "descriptionRo": "Dilemă între funcția Se (Opțiunea A) și Ni (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "What is happening right now, concretely.",
        "textRo": "Ce se întâmplă chiar acum, concret.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "The hidden pattern underlying surface appearances.",
        "textRo": "Tiparul ascuns din spatele aparențelor.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W17",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Se",
    "text": "When events shift rapidly:",
    "textRo": "Când evenimentele se schimbă rapid:",
    "description": "Dilemma balancing Ni (Option A) vs Se (Option B).",
    "descriptionRo": "Dilemă între funcția Ni (Opțiunea A) și Se (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Interpret which direction they lead long-term.",
        "textRo": "Interpretez în ce direcție merg pe termen lung.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "React in real time to whatever emerges.",
        "textRo": "Reacționez în timp real la ce apare.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      }
    ]
  },
  {
    "id": "W18",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "text": "In an unfamiliar city:",
    "textRo": "Într-un oraș necunoscut:",
    "description": "Dilemma balancing Se (Option A) vs Ni (Option B).",
    "descriptionRo": "Dilemă între funcția Se (Opțiunea A) și Ni (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "Immerse myself in what I see, hear, and sense.",
        "textRo": "Mă las purtat de ce văd, aud și miros.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Follow an intuitive sense of what is worth discovering.",
        "textRo": "Mă ghidez după o intuiție despre ce merită văzut.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W19",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Fi",
    "text": "When launching a strategic project, what is essential?",
    "textRo": "Când demarezi un proiect strategic, ce e esențial?",
    "description": "Dilemma balancing Te (Option A) vs Fi (Option B).",
    "descriptionRo": "Dilemă între funcția Te (Opțiunea A) și Fi (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "A practical roadmap with clear metrics and deadlines.",
        "textRo": "Un plan practic cu termene și criterii clare.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Ensuring it aligns with my personal convictions.",
        "textRo": "Să fie în acord cu convingerile mele.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "W20",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Te",
    "text": "When choosing a major life direction, what guides you?",
    "textRo": "Când alegi o direcție majoră, pe ce te bazezi?",
    "description": "Dilemma balancing Fi (Option A) vs Te (Option B).",
    "descriptionRo": "Dilemă între funcția Fi (Opțiunea A) și Te (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "What feels deeply authentic and true to myself.",
        "textRo": "Pe ce simt că e autentic pentru mine.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Objective criteria of efficiency and outcomes.",
        "textRo": "Pe criterii obiective de eficiență.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      }
    ]
  },
  {
    "id": "W21",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Fi",
    "text": "A well-paying job that contradicts your beliefs:",
    "textRo": "Un job care plătește bine, dar contrazice ce crezi:",
    "description": "Dilemma balancing Te (Option A) vs Fi (Option B).",
    "descriptionRo": "Dilemă între funcția Te (Opțiunea A) și Fi (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Accept if practical results and compensation are sound.",
        "textRo": "Accept dacă rezultatele sunt bune.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Decline, even if giving up the advantage.",
        "textRo": "Refuz, chiar dacă pierd avantajul.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "W22",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Fe",
    "text": "When team disagreement arises, what is your initial impulse?",
    "textRo": "Când apare un dezacord într-o echipă, care e primul tău impuls?",
    "description": "Dilemma balancing Ti (Option A) vs Fe (Option B).",
    "descriptionRo": "Dilemă între funcția Ti (Opțiunea A) și Fe (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Clarify the core logic and definitions of terms.",
        "textRo": "Să clarific logica și definițiile termenilor.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Soothe emotional tensions and restore mutual understanding.",
        "textRo": "Să calmez tonul și să refac buna înțelegere.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      }
    ]
  },
  {
    "id": "W23",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Ti",
    "text": "When delivering critical feedback:",
    "textRo": "Când oferi un feedback critic:",
    "description": "Dilemma balancing Fe (Option A) vs Ti (Option B).",
    "descriptionRo": "Dilemă între funcția Fe (Opțiunea A) și Ti (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Carefully weigh how the person will emotionally receive it.",
        "textRo": "Mă gândesc cum va fi primit de acea persoană.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Ensure the underlying reasoning is rigorous and precise.",
        "textRo": "Mă asigur că raționamentul e precis și corect.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      }
    ]
  },
  {
    "id": "W24",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Fe",
    "text": "Someone makes an imprecise claim and everyone nods along:",
    "textRo": "Cineva afirmă ceva neprecis și toți dau din cap:",
    "description": "Dilemma balancing Ti (Option A) vs Fe (Option B).",
    "descriptionRo": "Dilemă între funcția Ti (Opțiunea A) și Fe (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Ask what exactly they mean by that claim.",
        "textRo": "Întreb ce înseamnă exact.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Let it pass so as not to interrupt group flow.",
        "textRo": "Las așa, ca să nu rup ritmul grupului.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      }
    ]
  },
  {
    "id": "W25",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "When thinking about the future:",
    "textRo": "Când te gândești la viitor:",
    "description": "Dilemma balancing Ne (Option A) vs Ni (Option B).",
    "descriptionRo": "Dilemă între funcția Ne (Opțiunea A) și Ni (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Envision multiple divergent possibilities.",
        "textRo": "Imaginez mai multe variante diferite.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Converge onto a single most probable vision.",
        "textRo": "Mă concentrez pe o singură variantă probabilă.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W26",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "text": "When anticipating future developments:",
    "textRo": "Când anticipezi cum vor evolua lucrurile:",
    "description": "Dilemma balancing Ni (Option A) vs Ne (Option B).",
    "descriptionRo": "Dilemă între funcția Ni (Opțiunea A) și Ne (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Anticipate the single most likely culmination.",
        "textRo": "Anticipez cel mai probabil deznodământ.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "Explore multiple wildly divergent scenarios.",
        "textRo": "Explorez mai multe scenarii complet diferite.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      }
    ]
  },
  {
    "id": "W27",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "At the end of a brainstorming session:",
    "textRo": "La finalul unui brainstorming:",
    "description": "Dilemma balancing Ne (Option A) vs Ni (Option B).",
    "descriptionRo": "Dilemă între funcția Ne (Opțiunea A) și Ni (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Leave several promising directions open.",
        "textRo": "Las mai multe direcții deschise.",
        "explanation": "Favors Ne (+1.0).",
        "explanationRo": "Favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Select one singular path and pursue it to fruition.",
        "textRo": "Aleg o singură direcție și o urmăresc până la capăt.",
        "explanation": "Favors Ni (+1.0).",
        "explanationRo": "Favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W28",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "text": "On a vacation:",
    "textRo": "Într-o vacanță:",
    "description": "Dilemma balancing Se (Option A) vs Si (Option B).",
    "descriptionRo": "Dilemă între funcția Se (Opțiunea A) și Si (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "Visit a brand-new destination for fresh sensory thrills.",
        "textRo": "Merg într-un loc nou, să trăiesc senzații noi.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Return to a beloved, familiar haven I know well.",
        "textRo": "Mă întorc într-un loc pe care îl cunosc și îmi place.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W29",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "text": "For relaxation and free time, what do you prefer?",
    "textRo": "Pentru relaxare și timp liber, ce preferi?",
    "description": "Dilemma balancing Si (Option A) vs Se (Option B).",
    "descriptionRo": "Dilemă între funcția Si (Opțiunea A) și Se (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "Choose comfortable, deeply familiar sensations.",
        "textRo": "Să aleg senzații confortabile și familiare.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Seek novel, vivid, and stimulating experiences.",
        "textRo": "Să caut senzații intense și noi.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      }
    ]
  },
  {
    "id": "W30",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "text": "At a live concert or match:",
    "textRo": "La un concert sau meci:",
    "description": "Dilemma balancing Se (Option A) vs Si (Option B).",
    "descriptionRo": "Dilemă între funcția Se (Opțiunea A) și Si (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "Fully immerse myself in the spontaneous live moment.",
        "textRo": "Mă las absorbit de ce se întâmplă pe loc.",
        "explanation": "Favors Se (+1.0).",
        "explanationRo": "Favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Savor how it rekindles memories of past experiences.",
        "textRo": "Mă bucur mai ales de ce îmi amintește de alte dăți.",
        "explanation": "Favors Si (+1.0).",
        "explanationRo": "Favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W31",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "text": "When troubleshooting a technical issue:",
    "textRo": "În rezolvarea unei probleme tehnice:",
    "description": "Dilemma balancing Te (Option A) vs Ti (Option B).",
    "descriptionRo": "Dilemă între funcția Te (Opțiunea A) și Ti (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Deploy whatever works immediately, even without full theory.",
        "textRo": "Folosesc ce merge acum, chiar dacă nu înțeleg tot.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Understand root cause principles first, then fix.",
        "textRo": "Mai întâi înțeleg de ce se strică, apoi repar.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      }
    ]
  },
  {
    "id": "W32",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "text": "When problem-solving, which role feels more natural?",
    "textRo": "În rezolvarea problemelor, ce rol îți vine mai natural?",
    "description": "Dilemma balancing Ti (Option A) vs Te (Option B).",
    "descriptionRo": "Dilemă între funcția Ti (Opțiunea A) și Te (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Deconstruct a framework to pinpoint logical inconsistencies.",
        "textRo": "Să analizez un sistem ca să găsesc inconsecvențe logice.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Coordinate resources and people toward practical milestones.",
        "textRo": "Să organizez oamenii pentru un scop practic.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      }
    ]
  },
  {
    "id": "W33",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "text": "A colleague suggests a quick shortcut:",
    "textRo": "Un coleg propune un shortcut:",
    "description": "Dilemma balancing Te (Option A) vs Ti (Option B).",
    "descriptionRo": "Dilemă între funcția Te (Opțiunea A) și Ti (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Test it quickly; if it works, adopt it immediately.",
        "textRo": "Îl verific rapid; dacă merge, îl folosesc.",
        "explanation": "Favors Te (+1.0).",
        "explanationRo": "Favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Insist on understanding why it works before applying it.",
        "textRo": "Vreau să știu de ce funcționează înainte să-l folosesc.",
        "explanation": "Favors Ti (+1.0).",
        "explanationRo": "Favorizează Ti (+1.0)."
      }
    ]
  },
  {
    "id": "W34",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "When upset while in a group setting:",
    "textRo": "Când ești supărat într-un grup:",
    "description": "Dilemma balancing Fe (Option A) vs Fi (Option B).",
    "descriptionRo": "Dilemă între funcția Fe (Opțiunea A) și Fi (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Conceal distress to protect group harmony.",
        "textRo": "Îmi ascund puțin starea, ca să nu strice atmosfera.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Let my state show authentically; it is mine to own.",
        "textRo": "Las starea să se vadă; e a mea.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "W35",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "text": "In social gatherings, how do you choose to express yourself?",
    "textRo": "În situații sociale, cum alegi să te exprimi?",
    "description": "Dilemma balancing Fi (Option A) vs Fe (Option B).",
    "descriptionRo": "Dilemă între funcția Fi (Opțiunea A) și Fe (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "Express genuine inner feelings with strict sincerity.",
        "textRo": "Exprim exact ce simt înăuntrul meu.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Attune tone and cadence to the shared social atmosphere.",
        "textRo": "Îmi adaptez exprimarea la atmosfera și tonul grupului.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      }
    ]
  },
  {
    "id": "W36",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "inverted",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "Someone requests something that contradicts your principles:",
    "textRo": "Cineva te roagă ceva care te contrazice:",
    "description": "Dilemma balancing Fe (Option A) vs Fi (Option B).",
    "descriptionRo": "Dilemă între funcția Fe (Opțiunea A) și Fi (Opțiunea B).",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Consider how hurt they will feel if I refuse.",
        "textRo": "Mă gândesc cât de rău se va simți dacă refuz.",
        "explanation": "Favors Fe (+1.0).",
        "explanationRo": "Favorizează Fe (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Weigh whether I can preserve inner personal integrity.",
        "textRo": "Mă întreb dacă mai pot rămâne fidel convingerilor mele.",
        "explanation": "Favors Fi (+1.0).",
        "explanationRo": "Favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "F01",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "Do you consider yourself more naturally:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Self-assessment calibrating Introversion vs Extraversion.",
    "descriptionRo": "Autoevaluare calibrând Introversie vs Extraversie.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Introvert (recharge in solitude)",
        "textRo": "Introvert (mă încarc singur)",
        "explanation": "Direct selection: I (+1.0).",
        "explanationRo": "Alegere directă: I (+1.0)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Extravert (recharge among people)",
        "textRo": "Extrovert (mă încarc printre oameni)",
        "explanation": "Direct selection: E (+1.0).",
        "explanationRo": "Alegere directă: E (+1.0)."
      }
    ]
  },
  {
    "id": "F02",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "Do you consider yourself more naturally:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Self-assessment calibrating Intuition vs Sensing.",
    "descriptionRo": "Autoevaluare calibrând Intuiție vs Senzorial.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Intuitive (focus on big picture and potential)",
        "textRo": "Intuitiv (mă concentrez pe imaginea de ansamblu și pe ce ar putea fi)",
        "explanation": "Direct selection: N (+1.0).",
        "explanationRo": "Alegere directă: N (+1.0)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Sensing (focus on concrete details and reality)",
        "textRo": "Senzorial (mă concentrez pe detalii concrete și pe ce este)",
        "explanation": "Direct selection: S (+1.0).",
        "explanationRo": "Alegere directă: S (+1.0)."
      }
    ]
  },
  {
    "id": "F03",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "Do you consider yourself more naturally:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Self-assessment calibrating Thinking vs Feeling.",
    "descriptionRo": "Autoevaluare calibrând Gândire vs Afectiv.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Decide based on logic and objective criteria",
        "textRo": "Decid după logică și criterii obiective",
        "explanation": "Direct selection: T (+1.0).",
        "explanationRo": "Alegere directă: T (+1.0)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Decide based on values and human impact",
        "textRo": "Decid după valori și impactul asupra oamenilor",
        "explanation": "Direct selection: F (+1.0).",
        "explanationRo": "Alegere directă: F (+1.0)."
      }
    ]
  },
  {
    "id": "F04",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "Do you consider yourself more naturally:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Self-assessment calibrating Judging vs Perceiving.",
    "descriptionRo": "Autoevaluare calibrând Judecată vs Percepție.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Planned / Predictable",
        "textRo": "Planificat / Predictibil",
        "explanation": "Direct selection: J (+1.0).",
        "explanationRo": "Alegere directă: J (+1.0)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Spontaneous / Flexible",
        "textRo": "Spontan / Flexibil",
        "explanation": "Direct selection: P (+1.0).",
        "explanationRo": "Alegere directă: P (+1.0)."
      }
    ]
  }
];

export const TARGET_ORDER = [
  "I", "E",
  "N", "S",
  "T", "F",
  "J", "P",
  "Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"
];

const TARGET_ORDER_MAP = new Map(
  TARGET_ORDER.map((target, index) => [target.toUpperCase(), index])
);

export function sortQuestionsByTarget(questions) {
  return [...questions].sort((a, b) => {
    const aTargetKey = (a.target || "").toUpperCase();
    const bTargetKey = (b.target || "").toUpperCase();

    const aIdx = TARGET_ORDER_MAP.has(aTargetKey) ? TARGET_ORDER_MAP.get(aTargetKey) : 999;
    const bIdx = TARGET_ORDER_MAP.has(bTargetKey) ? TARGET_ORDER_MAP.get(bTargetKey) : 999;

    if (aIdx !== bIdx) {
      return aIdx - bIdx;
    }

    return (a.id || "").localeCompare(b.id || "");
  });
}

export function sortQuestionsByFormatAndTarget(questions) {
  const formatRank = { deep: 1, short: 2, wouldYouRather: 3, direct: 4 };
  return [...questions].sort((a, b) => {
    const fA = formatRank[a.format] || 99;
    const fB = formatRank[b.format] || 99;
    if (fA !== fB) return fA - fB;

    const aTargetKey = (a.target || "").toUpperCase();
    const bTargetKey = (b.target || "").toUpperCase();
    const aIdx = TARGET_ORDER_MAP.has(aTargetKey) ? TARGET_ORDER_MAP.get(aTargetKey) : 999;
    const bIdx = TARGET_ORDER_MAP.has(bTargetKey) ? TARGET_ORDER_MAP.get(bTargetKey) : 999;
    if (aIdx !== bIdx) return aIdx - bIdx;

    return (a.id || "").localeCompare(b.id || "");
  });
}

export function sortByFunction(questions) {
  const formatRank = { deep: 1, short: 2, wouldYouRather: 3, direct: 4 };
  return [...questions].sort((a, b) => {
    const aTargetKey = (a.target || "").toUpperCase();
    const bTargetKey = (b.target || "").toUpperCase();
    const aIdx = TARGET_ORDER_MAP.has(aTargetKey) ? TARGET_ORDER_MAP.get(aTargetKey) : 999;
    const bIdx = TARGET_ORDER_MAP.has(bTargetKey) ? TARGET_ORDER_MAP.get(bTargetKey) : 999;
    if (aIdx !== bIdx) return aIdx - bIdx;

    const fA = formatRank[a.format] || 99;
    const fB = formatRank[b.format] || 99;
    if (fA !== fB) return fA - fB;

    return (a.id || "").localeCompare(b.id || "");
  });
}

export const QUESTIONS_80 = QUESTIONS_100.slice(0, 80); // Compatibility alias
export const ALL_QUESTIONS = sortQuestionsByFormatAndTarget(QUESTIONS_100);

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestionsForMode(modeKey = "standard", orderMode = "format") {
  // Support boolean backward-compatibility (shouldShuffle: true => 'random', false => 'format')
  let resolvedOrder = "format";
  if (orderMode === true || orderMode === "random") {
    resolvedOrder = "random";
  } else if (orderMode === "function") {
    resolvedOrder = "function";
  } else {
    resolvedOrder = "format";
  }

  const normalizedKey = (modeKey === "quick" || modeKey === "fast") ? "rapid" : ((modeKey === "recommended") ? "standard" : modeKey);
  const mode = TEST_MODES[normalizedKey] || TEST_MODES.standard;

  let baseQuestions = [];
  if (mode.totalQuestions === 24) {
    // Fast: All 24 Deep questions (8 axis + 16 function items)
    baseQuestions = QUESTIONS_100.filter(q => q.format === "deep");
  } else if (mode.totalQuestions === 60) {
    // Standard: 20 axis items + 40 function items (60 total)
    const deepQuestions = QUESTIONS_100.filter(q => q.format === "deep"); // 24
    const shortAxisIds = ["S01", "S04", "S07", "S10"]; // 4 (EI, NS, TF, JP)
    const shortFuncIds = ["S13", "S14", "S16", "S17", "S19", "S20", "S22", "S23", "S25", "S28", "S31", "S34"]; // 12
    const shortItems = [...shortAxisIds, ...shortFuncIds].map(id => QUESTIONS_100.find(q => q.id === id));

    const wyrAxisIds = ["W01", "W04", "W07", "W10"]; // 4 (EI, NS, TF, JP)
    const wyrFuncIds = ["W13", "W14", "W16", "W17", "W19", "W20", "W22", "W23", "W26", "W29", "W32", "W35"]; // 12
    const wyrItems = [...wyrAxisIds, ...wyrFuncIds].map(id => QUESTIONS_100.find(q => q.id === id));

    const directFinalItems = QUESTIONS_100.filter(q => q.format === "direct"); // 4 (F01-F04)
    baseQuestions = [...deepQuestions, ...shortItems, ...wyrItems, ...directFinalItems];
  } else {
    // Complete: All 100 questions
    baseQuestions = [...QUESTIONS_100];
  }

  if (resolvedOrder === "random") {
    return shuffle(baseQuestions);
  }

  if (resolvedOrder === "function") {
    return sortByFunction(baseQuestions);
  }

  // Format order: Deep -> Short -> Would You Rather -> Direct
  // (within each format, sorted by target order: I, E, N, S, T, F, J, P, Ne, Ni, Se, Si, Te, Ti, Fe, Fi)
  const deepPhase = sortQuestionsByTarget(baseQuestions.filter(q => q.format === "deep"));
  const shortPhase = sortQuestionsByTarget(baseQuestions.filter(q => q.format === "short"));
  const wyrPhase = sortQuestionsByTarget(baseQuestions.filter(q => q.format === "wouldYouRather"));
  const directPhase = sortQuestionsByTarget(baseQuestions.filter(q => q.format === "direct"));

  return [...deepPhase, ...shortPhase, ...wyrPhase, ...directPhase];
}

export function getQuestionText(question, lang = "en") {
  if (!question) return "";
  if (lang === "ro" && question.textRo) return question.textRo;
  return question.text;
}

export function getQuestionDescription(question, lang = "en") {
  if (!question) return "";
  if (lang === "ro" && question.descriptionRo) return question.descriptionRo;
  return question.description || "";
}

export function getQuestionExplanations(question, lang = "en") {
  if (!question) return null;
  if (question.format === "wouldYouRather" || question.format === "direct") {
    return {
      type: question.format,
      options: (question.options || []).map(opt => ({
        id: opt.id,
        pole: opt.pole,
        text: (lang === "ro" && opt.textRo) ? opt.textRo : opt.text,
        explanation: (lang === "ro" && opt.explanationRo) ? opt.explanationRo : opt.explanation
      }))
    };
  }

  return {
    type: "agreement",
    target: question.target,
    oppositePole: question.oppositePole || question.opposite,
    agreementPole: question.agreementPole || question.target,
    agreementExplanation: (lang === "ro" && question.agreementExplanationRo) ? question.agreementExplanationRo : question.agreementExplanation,
    disagreementExplanation: (lang === "ro" && question.disagreementExplanationRo) ? question.disagreementExplanationRo : question.disagreementExplanation,
    neutralExplanation: (lang === "ro" && question.neutralExplanationRo) ? question.neutralExplanationRo : question.neutralExplanation
  };
}
