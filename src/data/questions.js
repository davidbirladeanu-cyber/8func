/**
 * 8Func - Comprehensive Data-Driven Question Bank (100 Questions)
 * Formats: Deep (32), Simple/Short (32), Would You Rather (32), Frontal/Direct (4)
 * Categories:
 * - 8 I/E/N/S/T/F/J/P
 * - 8 Ne/Si Ni/Se Te/Fi Fi/Te
 * - 8 Ne/Ni Te/Ti Fe/Fi Se/Si
 * - 8 NT NF ST SF IJ IP EP EJ
 * Modes: Fast (36), Standard (60), Complete (100)
 * Direct Final questions (F01-F04) are ALWAYS the final 4 items in every order mode (random, format, function).
 * Bilingual support (EN & RO).
 */

export const TEST_MODES = {
  rapid: {
    key: "rapid",
    name: "Fast",
    totalQuestions: 36,
    timeEst: "~4 min",
    badge: "Quick",
    subtitle: "36 questions (32 deep · 4 direct)",
    description: "Fast pulse assessment with 32 deep questions and 4 direct self-assessments.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  },
  standard: {
    key: "standard",
    name: "Standard",
    totalQuestions: 60,
    timeEst: "~7 min",
    badge: "Recommended",
    isPopular: true,
    subtitle: "60 questions (32 deep · 24 simple · 4 direct)",
    description: "Balanced calibration with 32 deep items, 24 simple items, and 4 direct self-assessments.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`
  },
  complete: {
    key: "complete",
    name: "Complete",
    totalQuestions: 100,
    timeEst: "~12 min",
    badge: "Full Profile",
    subtitle: "100 questions (32 deep · 32 simple · 32 WYR · 4 direct)",
    description: "Complete assessment of all 100 items: 32 Deep questions, 32 Simple questions, 32 Would You Rather dilemmas, and 4 Direct self-assessments.",
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
    "target": "I",
    "oppositePole": "E",
    "text": "I understand my thoughts better after spending time alone than after a discussion.",
    "textRo": "Îmi înțeleg gândurile mai bine după ce am stat o vreme singur decât după o discuție.",
    "description": "Measures I vs E.",
    "descriptionRo": "Măsoară I vs E.",
    "agreementPole": "I",
    "agreementExplanation": "Agreement favors I.",
    "agreementExplanationRo": "Acordul favorizează I.",
    "disagreementExplanation": "Disagreement favors E.",
    "disagreementExplanationRo": "Dezacordul favorizează E.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D02",
    "format": "deep",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "I think more clearly when talking with someone than when staying alone with my thoughts.",
    "textRo": "Gândesc mai clar când vorbesc cu cineva decât când stau singur cu gândurile mele.",
    "description": "Measures E vs I.",
    "descriptionRo": "Măsoară E vs I.",
    "agreementPole": "E",
    "agreementExplanation": "Agreement favors E.",
    "agreementExplanationRo": "Acordul favorizează E.",
    "disagreementExplanation": "Disagreement favors I.",
    "disagreementExplanationRo": "Dezacordul favorizează I.",
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
    "text": "I am more interested in what information could mean than in its concrete details.",
    "textRo": "Mă interesează mai mult ce ar putea însemna o informație decât detaliile ei concrete.",
    "description": "Measures N vs S.",
    "descriptionRo": "Măsoară N vs S.",
    "agreementPole": "N",
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
    "text": "I trust what I can see and verify directly more than what can only be inferred.",
    "textRo": "Mă încred mai mult în ce pot vedea și verifica direct decât în ce se poate doar deduce.",
    "description": "Measures S vs N.",
    "descriptionRo": "Măsoară S vs N.",
    "agreementPole": "S",
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
    "text": "When making a decision, whether it is logically sound matters more than how people receive it.",
    "textRo": "Când iau o decizie, contează mai mult dacă e corectă logic decât cum o primesc oamenii.",
    "description": "Measures T vs F.",
    "descriptionRo": "Măsoară T vs F.",
    "agreementPole": "T",
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
    "text": "When making a decision, I focus more on its effect on people than on how logical it is.",
    "textRo": "Când iau o decizie, mă opresc mai mult la efectul ei asupra oamenilor decât la cât de logică e.",
    "description": "Measures F vs T.",
    "descriptionRo": "Măsoară F vs T.",
    "agreementPole": "F",
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
    "text": "I feel better when decisions are settled and the next steps are clearly defined.",
    "textRo": "Mă simt mai bine când deciziile sunt luate și pașii următori sunt clari.",
    "description": "Measures J vs P.",
    "descriptionRo": "Măsoară J vs P.",
    "agreementPole": "J",
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
    "text": "I prefer to keep options open as new information emerges rather than locking myself into a plan.",
    "textRo": "Prefer să las lucrurile deschise cât timp apar informații noi, în loc să mă blochez într-un plan.",
    "description": "Measures P vs J.",
    "descriptionRo": "Măsoară P vs J.",
    "agreementPole": "P",
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
    "subcategory": "polarity",
    "dimension": "Ne/Si",
    "target": "Ne",
    "oppositePole": "Si",
    "text": "A new idea brings unexpected possibilities to mind rather than similar situations I have lived through.",
    "textRo": "O idee nouă îmi aduce în minte mai degrabă posibilități neașteptate decât situații similare pe care le-am trăit.",
    "description": "Measures Ne vs Si.",
    "descriptionRo": "Măsoară Ne vs Si.",
    "agreementPole": "Ne",
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
    "subcategory": "polarity",
    "dimension": "Ne/Si",
    "target": "Si",
    "oppositePole": "Ne",
    "text": "Before trying something new, I look at how similar things unfolded in the past.",
    "textRo": "Înainte de a încerca ceva nou, mă uit cum au decurs lucruri asemănătoare în trecut.",
    "description": "Measures Si vs Ne.",
    "descriptionRo": "Măsoară Si vs Ne.",
    "agreementPole": "Si",
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
    "subcategory": "polarity",
    "dimension": "Ni/Se",
    "target": "Ni",
    "oppositePole": "Se",
    "text": "I often have a clear intuition of how things will connect before I can explain why.",
    "textRo": "Am adesea o intuiție clară despre cum se vor lega lucrurile, înainte să pot explica de ce.",
    "description": "Measures Ni vs Se.",
    "descriptionRo": "Măsoară Ni vs Se.",
    "agreementPole": "Ni",
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
    "subcategory": "polarity",
    "dimension": "Ni/Se",
    "target": "Se",
    "oppositePole": "Ni",
    "text": "I immediately notice what changes around me (objects, movement, sounds) without making a conscious effort.",
    "textRo": "Observ imediat ce se schimbă în jurul meu (obiecte, mișcări, zgomote), fără să mă concentrez special.",
    "description": "Measures Se vs Ni.",
    "descriptionRo": "Măsoară Se vs Ni.",
    "agreementPole": "Se",
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
    "subcategory": "polarity",
    "dimension": "Te/Fi",
    "target": "Te",
    "oppositePole": "Fi",
    "text": "If a decision delivers measurable results, I consider it good even if it does not match what I feel.",
    "textRo": "Dacă o decizie dă rezultate măsurabile, o consider bună chiar dacă nu se potrivește cu ce simt.",
    "description": "Measures Te vs Fi.",
    "descriptionRo": "Măsoară Te vs Fi.",
    "agreementPole": "Te",
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
    "subcategory": "polarity",
    "dimension": "Te/Fi",
    "target": "Fi",
    "oppositePole": "Te",
    "text": "I would rather forfeit a good result than support something that conflicts with my core values.",
    "textRo": "Prefer să renunț la un rezultat bun decât să susțin ceva ce intră în conflict cu valorile mele profunde.",
    "description": "Measures Fi vs Te.",
    "descriptionRo": "Măsoară Fi vs Te.",
    "agreementPole": "Fi",
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
    "subcategory": "polarity",
    "dimension": "Ti/Fe",
    "target": "Ti",
    "oppositePole": "Fe",
    "text": "I prefer to build an explanation until it is logically consistent rather than accepting it just because the group does.",
    "textRo": "Prefer să-mi construiesc o explicație până se leagă logic, decât s-o accept doar pentru că grupul o acceptă.",
    "description": "Measures Ti vs Fe.",
    "descriptionRo": "Măsoară Ti vs Fe.",
    "agreementPole": "Ti",
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
    "subcategory": "polarity",
    "dimension": "Ti/Fe",
    "target": "Fe",
    "oppositePole": "Ti",
    "text": "I spontaneously adjust my tone and words to match the emotional state of those in front of me.",
    "textRo": "Îmi ajustez spontan tonul și cuvintele după starea celor din fața mea, fără să mă gândesc la asta.",
    "description": "Measures Fe vs Ti.",
    "descriptionRo": "Măsoară Fe vs Ti.",
    "agreementPole": "Fe",
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
    "subcategory": "attitude",
    "dimension": "Ne/Ni",
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "I prefer generating multiple possibilities rather than limiting myself to a single final conclusion.",
    "textRo": "Prefer să generez multe posibilități decât să mă limitez la o singură concluzie finală.",
    "description": "Measures Ne vs Ni.",
    "descriptionRo": "Măsoară Ne vs Ni.",
    "agreementPole": "Ne",
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
    "subcategory": "attitude",
    "dimension": "Ne/Ni",
    "target": "Ni",
    "oppositePole": "Ne",
    "text": "I naturally synthesize scattered details into a single coherent vision instead of searching for alternatives.",
    "textRo": "Sintetizez natural detaliile răsfirate într-o singură viziune coerentă, în loc să caut alternative.",
    "description": "Measures Ni vs Ne.",
    "descriptionRo": "Măsoară Ni vs Ne.",
    "agreementPole": "Ni",
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
    "subcategory": "attitude",
    "dimension": "Te/Ti",
    "target": "Te",
    "oppositePole": "Ti",
    "text": "The fact that a system works efficiently is more important than understanding its exact underlying principles.",
    "textRo": "Faptul că un sistem funcționează eficient e mai important decât înțelegerea principiilor lui exacte.",
    "description": "Measures Te vs Ti.",
    "descriptionRo": "Măsoară Te vs Ti.",
    "agreementPole": "Te",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D20",
    "format": "deep",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Te/Ti",
    "target": "Ti",
    "oppositePole": "Te",
    "text": "I need to understand the precise underlying logic, even if that delays practical implementation.",
    "textRo": "Trebuie să înțeleg logica precisă din spate, chiar dacă asta întârzie implementarea practică.",
    "description": "Measures Ti vs Te.",
    "descriptionRo": "Măsoară Ti vs Te.",
    "agreementPole": "Ti",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D21",
    "format": "deep",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Fe/Fi",
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "Maintaining harmony in the group matters more to me than strictly expressing my own personal feelings.",
    "textRo": "Menținerea armoniei în grup contează mai mult pentru mine decât exprimarea strictă a sentimentelor mele.",
    "description": "Measures Fe vs Fi.",
    "descriptionRo": "Măsoară Fe vs Fi.",
    "agreementPole": "Fe",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D22",
    "format": "deep",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Fe/Fi",
    "target": "Fi",
    "oppositePole": "Fe",
    "text": "Staying true to my core values is more important than adapting to the emotional atmosphere of the group.",
    "textRo": "Să rămân fidel valorilor mele de bază e mai important decât să mă adaptez la starea emoțională a grupului.",
    "description": "Measures Fi vs Fe.",
    "descriptionRo": "Măsoară Fi vs Fe.",
    "agreementPole": "Fi",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D23",
    "format": "deep",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Se/Si",
    "target": "Se",
    "oppositePole": "Si",
    "text": "I feel most alive in the immediate reality of the present rather than relying on past experiences.",
    "textRo": "Mă simt plin de viață în realitatea imediată a prezentului, în loc să mă bazez pe experiențe trecute.",
    "description": "Measures Se vs Si.",
    "descriptionRo": "Măsoară Se vs Si.",
    "agreementPole": "Se",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D24",
    "format": "deep",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Se/Si",
    "target": "Si",
    "oppositePole": "Se",
    "text": "I rely heavily on proven methods from the past rather than spontaneously adapting to new circumstances.",
    "textRo": "Mă bazez mult pe metode verificate din trecut, în loc să mă adaptez spontan la circumstanțe noi.",
    "description": "Measures Si vs Se.",
    "descriptionRo": "Măsoară Si vs Se.",
    "agreementPole": "Si",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D25",
    "format": "deep",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NT/SF",
    "target": "NT",
    "oppositePole": "SF",
    "text": "I can spend hours trying to understand how a complex system or theory works, purely for the sake of understanding.",
    "textRo": "Pot petrece ore întregi încercând să înțeleg cum funcționează un sistem sau o teorie, doar de dragul înțelegerii.",
    "description": "Measures NT vs SF.",
    "descriptionRo": "Măsoară NT vs SF.",
    "agreementPole": "NT",
    "agreementExplanation": "Agreement favors NT.",
    "agreementExplanationRo": "Acordul favorizează NT.",
    "disagreementExplanation": "Disagreement favors SF.",
    "disagreementExplanationRo": "Dezacordul favorizează SF.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D26",
    "format": "deep",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NF/ST",
    "target": "NF",
    "oppositePole": "ST",
    "text": "I often reflect on the deeper meaning of things and how I could help people around me grow.",
    "textRo": "Mă gândesc des la ce sens au lucrurile și la cum aș putea ajuta oamenii din jur să se dezvolte.",
    "description": "Measures NF vs ST.",
    "descriptionRo": "Măsoară NF vs ST.",
    "agreementPole": "NF",
    "agreementExplanation": "Agreement favors NF.",
    "agreementExplanationRo": "Acordul favorizează NF.",
    "disagreementExplanation": "Disagreement favors ST.",
    "disagreementExplanationRo": "Dezacordul favorizează ST.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D27",
    "format": "deep",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NF/ST",
    "target": "ST",
    "oppositePole": "NF",
    "text": "I do best when I have a practical, concrete problem to solve using clear facts and methods.",
    "textRo": "Mă descurc cel mai bine când am o problemă practică, concretă, de rezolvat cu fapte și metode clare.",
    "description": "Measures ST vs NF.",
    "descriptionRo": "Măsoară ST vs NF.",
    "agreementPole": "ST",
    "agreementExplanation": "Agreement favors ST.",
    "agreementExplanationRo": "Acordul favorizează ST.",
    "disagreementExplanation": "Disagreement favors NF.",
    "disagreementExplanationRo": "Dezacordul favorizează NF.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D28",
    "format": "deep",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NT/SF",
    "target": "SF",
    "oppositePole": "NT",
    "text": "I enjoy taking concrete care of those around me: cooking, helping, and being there when they need me.",
    "textRo": "Îmi place să am grijă concret de cei din jur: să gătesc, să ajut, să fiu acolo când au nevoie.",
    "description": "Measures SF vs NT.",
    "descriptionRo": "Măsoară SF vs NT.",
    "agreementPole": "SF",
    "agreementExplanation": "Agreement favors SF.",
    "agreementExplanationRo": "Acordul favorizează SF.",
    "disagreementExplanation": "Disagreement favors NT.",
    "disagreementExplanationRo": "Dezacordul favorizează NT.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D29",
    "format": "deep",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IJ/EP",
    "target": "IJ",
    "oppositePole": "EP",
    "text": "I like having an orderly home, a stable routine, and staying in rather than going out without a plan.",
    "textRo": "Îmi place să am casa și lucrurile ordonate, o rutină stabilă și să stau acasă decât să ies fără un plan.",
    "description": "Measures IJ vs EP.",
    "descriptionRo": "Măsoară IJ vs EP.",
    "agreementPole": "IJ",
    "agreementExplanation": "Agreement favors IJ.",
    "agreementExplanationRo": "Acordul favorizează IJ.",
    "disagreementExplanation": "Disagreement favors EP.",
    "disagreementExplanationRo": "Dezacordul favorizează EP.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D30",
    "format": "deep",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IP/EJ",
    "target": "IP",
    "oppositePole": "EJ",
    "text": "I like being on my own, freely pursuing what fascinates me without a rigid schedule or giving explanations.",
    "textRo": "Îmi place să stau singur și să mă ocup liber de ce mă pasionează, fără program fix și fără să dau explicații.",
    "description": "Measures IP vs EJ.",
    "descriptionRo": "Măsoară IP vs EJ.",
    "agreementPole": "IP",
    "agreementExplanation": "Agreement favors IP.",
    "agreementExplanationRo": "Acordul favorizează IP.",
    "disagreementExplanation": "Disagreement favors EJ.",
    "disagreementExplanationRo": "Dezacordul favorizează EJ.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D31",
    "format": "deep",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IJ/EP",
    "target": "EP",
    "oppositePole": "IJ",
    "text": "I love going out, trying new things with new people, and seeing what happens on the spot without elaborate plans.",
    "textRo": "Îmi place să ies, să încerc lucruri noi cu oameni noi și să văd pe loc ce iese, fără prea multe planuri.",
    "description": "Measures EP vs IJ.",
    "descriptionRo": "Măsoară EP vs IJ.",
    "agreementPole": "EP",
    "agreementExplanation": "Agreement favors EP.",
    "agreementExplanationRo": "Acordul favorizează EP.",
    "disagreementExplanation": "Disagreement favors IJ.",
    "disagreementExplanationRo": "Dezacordul favorizează IJ.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D32",
    "format": "deep",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IP/EJ",
    "target": "EJ",
    "oppositePole": "IP",
    "text": "I enjoy organizing people and events: making the plan, assigning roles, and making sure things get done.",
    "textRo": "Îmi place să organizez oamenii și evenimentele: fac planul, împart rolurile și văd că lucrurile se fac.",
    "description": "Measures EJ vs IP.",
    "descriptionRo": "Măsoară EJ vs IP.",
    "agreementPole": "EJ",
    "agreementExplanation": "Agreement favors EJ.",
    "agreementExplanationRo": "Acordul favorizează EJ.",
    "disagreementExplanation": "Disagreement favors IP.",
    "disagreementExplanationRo": "Dezacordul favorizează IP.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S01",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "text": "After a day around many people, I need quiet time alone to recharge.",
    "textRo": "După o zi cu mulți oameni, am nevoie să stau singur ca să mă refac.",
    "description": "Measures I vs E.",
    "descriptionRo": "Măsoară I vs E.",
    "agreementPole": "I",
    "agreementExplanation": "Agreement favors I.",
    "agreementExplanationRo": "Acordul favorizează I.",
    "disagreementExplanation": "Disagreement favors E.",
    "disagreementExplanationRo": "Dezacordul favorizează E.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S02",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "After a day alone at home, I feel an urge to go out among people.",
    "textRo": "După o zi singur acasă, am chef să ies printre oameni.",
    "description": "Measures E vs I.",
    "descriptionRo": "Măsoară E vs I.",
    "agreementPole": "E",
    "agreementExplanation": "Agreement favors E.",
    "agreementExplanationRo": "Acordul favorizează E.",
    "disagreementExplanation": "Disagreement favors I.",
    "disagreementExplanationRo": "Dezacordul favorizează I.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S03",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "When reading something, I think about what it implies and where it could lead, not just what is written.",
    "textRo": "Când citesc ceva, mă gândesc la ce implică și la ce ar putea urma, nu doar la ce scrie.",
    "description": "Measures N vs S.",
    "descriptionRo": "Măsoară N vs S.",
    "agreementPole": "N",
    "agreementExplanation": "Agreement favors N.",
    "agreementExplanationRo": "Acordul favorizează N.",
    "disagreementExplanation": "Disagreement favors S.",
    "disagreementExplanationRo": "Dezacordul favorizează S.",
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
    "text": "When learning something new, I need concrete examples and exact steps, not general theories.",
    "textRo": "Când învăț ceva nou, am nevoie de exemple concrete și pași exacți, nu de idei generale.",
    "description": "Measures S vs N.",
    "descriptionRo": "Măsoară S vs N.",
    "agreementPole": "S",
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
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "When someone makes a mistake, I tell them directly what went wrong, even if it is uncomfortable.",
    "textRo": "Când cineva greșește, îi spun direct ce a mers prost, chiar dacă nu îi convine.",
    "description": "Measures T vs F.",
    "descriptionRo": "Măsoară T vs F.",
    "agreementPole": "T",
    "agreementExplanation": "Agreement favors T.",
    "agreementExplanationRo": "Acordul favorizează T.",
    "disagreementExplanation": "Disagreement favors F.",
    "disagreementExplanationRo": "Dezacordul favorizează F.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S06",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "text": "When someone makes a mistake, I choose my words carefully so they do not feel hurt.",
    "textRo": "Când cineva greșește, aleg cu grijă cum spun lucrurile ca să nu fie rănit.",
    "description": "Measures F vs T.",
    "descriptionRo": "Măsoară F vs T.",
    "agreementPole": "F",
    "agreementExplanation": "Agreement favors F.",
    "agreementExplanationRo": "Acordul favorizează F.",
    "disagreementExplanation": "Disagreement favors T.",
    "disagreementExplanationRo": "Dezacordul favorizează T.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S07",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "I make my checklist and plan for the day or week and follow through.",
    "textRo": "Îmi fac lista și planul pentru zi sau săptămână și le urmez.",
    "description": "Measures J vs P.",
    "descriptionRo": "Măsoară J vs P.",
    "agreementPole": "J",
    "agreementExplanation": "Agreement favors J.",
    "agreementExplanationRo": "Acordul favorizează J.",
    "disagreementExplanation": "Disagreement favors P.",
    "disagreementExplanationRo": "Dezacordul favorizează P.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S08",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "text": "I prefer to see how I feel that day and decide what to do in the moment.",
    "textRo": "Prefer să văd cum mă simt în ziua respectivă și să aleg pe moment ce fac.",
    "description": "Measures P vs J.",
    "descriptionRo": "Măsoară P vs J.",
    "agreementPole": "P",
    "agreementExplanation": "Agreement favors P.",
    "agreementExplanationRo": "Acordul favorizează P.",
    "disagreementExplanation": "Disagreement favors J.",
    "disagreementExplanationRo": "Dezacordul favorizează J.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S09",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ne/Si",
    "target": "Ne",
    "oppositePole": "Si",
    "text": "When something doesn't work, several different ideas quickly come to mind about what to try.",
    "textRo": "Când ceva nu merge, îmi vin repede mai multe idei diferite despre ce aș putea încerca.",
    "description": "Measures Ne vs Si.",
    "descriptionRo": "Măsoară Ne vs Si.",
    "agreementPole": "Ne",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S10",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ne/Si",
    "target": "Si",
    "oppositePole": "Ne",
    "text": "When something doesn't work, I look at how I solved something similar last time.",
    "textRo": "Când ceva nu merge, mă uit cum am rezolvat ceva asemănător data trecută.",
    "description": "Measures Si vs Ne.",
    "descriptionRo": "Măsoară Si vs Ne.",
    "agreementPole": "Si",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S11",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ni/Se",
    "target": "Ni",
    "oppositePole": "Se",
    "text": "I often have a gut feeling about how a situation will end without being able to say exactly why.",
    "textRo": "Am adesea o presimțire despre cum se va termina o situație, fără să pot spune exact de ce.",
    "description": "Measures Ni vs Se.",
    "descriptionRo": "Măsoară Ni vs Se.",
    "agreementPole": "Ni",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S12",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ni/Se",
    "target": "Se",
    "oppositePole": "Ni",
    "text": "I like trying things directly with my hands rather than overthinking them beforehand.",
    "textRo": "Îmi place să încerc lucrurile direct, cu mâinile, în loc să le gândesc mult înainte.",
    "description": "Measures Se vs Ni.",
    "descriptionRo": "Măsoară Se vs Ni.",
    "agreementPole": "Se",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S13",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Te/Fi",
    "target": "Te",
    "oppositePole": "Fi",
    "text": "When I have multiple tasks, I break them into measurable steps and stick to deadlines.",
    "textRo": "Când am mai multe sarcini, le împart în pași măsurabili și mă țin de termene.",
    "description": "Measures Te vs Fi.",
    "descriptionRo": "Măsoară Te vs Fi.",
    "agreementPole": "Te",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S14",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Te/Fi",
    "target": "Fi",
    "oppositePole": "Te",
    "text": "If a task contradicts what I believe in, I decline it even if I would gain something.",
    "textRo": "Dacă o sarcină mă contrazice în ce cred, o refuz chiar dacă aș câștiga ceva.",
    "description": "Measures Fi vs Te.",
    "descriptionRo": "Măsoară Fi vs Te.",
    "agreementPole": "Fi",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S15",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ti/Fe",
    "target": "Ti",
    "oppositePole": "Fe",
    "text": "If I notice a logical flaw in an argument, I point it out even if it spoils the mood.",
    "textRo": "Dacă observ o greșeală logică într-un argument, o spun, chiar dacă strică atmosfera.",
    "description": "Measures Ti vs Fe.",
    "descriptionRo": "Măsoară Ti vs Fe.",
    "agreementPole": "Ti",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S16",
    "format": "short",
    "category": "function",
    "subcategory": "polarity",
    "dimension": "Ti/Fe",
    "target": "Fe",
    "oppositePole": "Ti",
    "text": "I immediately notice when the mood in a room shifts and I adapt my behavior accordingly.",
    "textRo": "Observ imediat când atmosfera dintr-o cameră se schimbă și îmi adaptez comportamentul.",
    "description": "Measures Fe vs Ti.",
    "descriptionRo": "Măsoară Fe vs Ti.",
    "agreementPole": "Fe",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S17",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Ne/Ni",
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "When facing a problem, I write down as many possible solutions as I can before choosing one.",
    "textRo": "La o problemă, notez cât mai multe soluții posibile înainte să aleg una.",
    "description": "Measures Ne vs Ni.",
    "descriptionRo": "Măsoară Ne vs Ni.",
    "agreementPole": "Ne",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S18",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Ne/Ni",
    "target": "Ni",
    "oppositePole": "Ne",
    "text": "When facing a problem, I quickly pick a single direction and pursue it all the way.",
    "textRo": "La o problemă, aleg repede o singură direcție și o urmez până la capăt.",
    "description": "Measures Ni vs Ne.",
    "descriptionRo": "Măsoară Ni vs Ne.",
    "agreementPole": "Ni",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Ne.",
    "disagreementExplanationRo": "Dezacordul favorizează Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S19",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Te/Ti",
    "target": "Te",
    "oppositePole": "Ti",
    "text": "If something works, I use it, even if I do not understand exactly why it works.",
    "textRo": "Dacă ceva funcționează, îl folosesc, chiar dacă nu înțeleg exact de ce funcționează.",
    "description": "Measures Te vs Ti.",
    "descriptionRo": "Măsoară Te vs Ti.",
    "agreementPole": "Te",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S20",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Te/Ti",
    "target": "Ti",
    "oppositePole": "Te",
    "text": "I don't use something until I understand how and why it works.",
    "textRo": "Nu folosesc ceva până nu înțeleg cum și de ce funcționează.",
    "description": "Measures Ti vs Te.",
    "descriptionRo": "Măsoară Ti vs Te.",
    "agreementPole": "Ti",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Te.",
    "disagreementExplanationRo": "Dezacordul favorizează Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S21",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Fe/Fi",
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "When I am upset in a group, I keep it to myself so I don't ruin the atmosphere.",
    "textRo": "Când sunt supărat într-un grup, îmi țin starea pentru mine ca să nu stric atmosfera.",
    "description": "Measures Fe vs Fi.",
    "descriptionRo": "Măsoară Fe vs Fi.",
    "agreementPole": "Fe",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S22",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Fe/Fi",
    "target": "Fi",
    "oppositePole": "Fe",
    "text": "When I am upset in a group, I let my true feelings show, even if they clash with the mood.",
    "textRo": "Când sunt supărat într-un grup, las starea să se vadă, chiar dacă nu se potrivește cu atmosfera.",
    "description": "Measures Fi vs Fe.",
    "descriptionRo": "Măsoară Fi vs Fe.",
    "agreementPole": "Fi",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S23",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Se/Si",
    "target": "Se",
    "oppositePole": "Si",
    "text": "I relax best through intense, physical, or novel activities (sports, travel, food, adventure).",
    "textRo": "Mă relaxez cel mai bine făcând ceva fizic, intens sau nou (sport, drum, mâncare, aventură).",
    "description": "Measures Se vs Si.",
    "descriptionRo": "Măsoară Se vs Si.",
    "agreementPole": "Se",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S24",
    "format": "short",
    "category": "function",
    "subcategory": "attitude",
    "dimension": "Se/Si",
    "target": "Si",
    "oppositePole": "Se",
    "text": "I relax best with familiar comforts: the same place, favorite comfort food, a predictable routine.",
    "textRo": "Mă relaxez cel mai bine cu lucruri familiare: același loc, aceleași mâncăruri, aceeași rutină.",
    "description": "Measures Si vs Se.",
    "descriptionRo": "Măsoară Si vs Se.",
    "agreementPole": "Si",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S25",
    "format": "short",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NT/SF",
    "target": "NT",
    "oppositePole": "SF",
    "text": "I like breaking down a complicated problem (code, strategy, systems) until I grasp its structure.",
    "textRo": "Îmi place să desfac o problemă complicată (cod, strategie, sistem) până îi înțeleg structura.",
    "description": "Measures NT vs SF.",
    "descriptionRo": "Măsoară NT vs SF.",
    "agreementPole": "NT",
    "agreementExplanation": "Agreement favors NT.",
    "agreementExplanationRo": "Acordul favorizează NT.",
    "disagreementExplanation": "Disagreement favors SF.",
    "disagreementExplanationRo": "Dezacordul favorizează SF.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S26",
    "format": "short",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NF/ST",
    "target": "NF",
    "oppositePole": "ST",
    "text": "I love talking with someone about what they truly want from life and how they could get there.",
    "textRo": "Îmi place să vorbesc cu cineva despre ce vrea cu adevărat de la viață și cum ar putea ajunge acolo.",
    "description": "Measures NF vs ST.",
    "descriptionRo": "Măsoară NF vs ST.",
    "agreementPole": "NF",
    "agreementExplanation": "Agreement favors NF.",
    "agreementExplanationRo": "Acordul favorizează NF.",
    "disagreementExplanation": "Disagreement favors ST.",
    "disagreementExplanationRo": "Dezacordul favorizează ST.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S27",
    "format": "short",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NF/ST",
    "target": "ST",
    "oppositePole": "NF",
    "text": "I prefer repairing or building something useful with my hands, following clear steps, rather than debating theories.",
    "textRo": "Prefer să repar sau să fac ceva util cu mâna mea, urmând pași clari, decât să discut despre idei.",
    "description": "Measures ST vs NF.",
    "descriptionRo": "Măsoară ST vs NF.",
    "agreementPole": "ST",
    "agreementExplanation": "Agreement favors ST.",
    "agreementExplanationRo": "Acordul favorizează ST.",
    "disagreementExplanation": "Disagreement favors NF.",
    "disagreementExplanationRo": "Dezacordul favorizează NF.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S28",
    "format": "short",
    "category": "combination",
    "subcategory": "temperament",
    "dimension": "NT/SF",
    "target": "SF",
    "oppositePole": "NT",
    "text": "I notice what people around me need (food, assistance, attention) and offer it without being asked.",
    "textRo": "Observ de ce au nevoie cei din jur (mâncare, ajutor, atenție) și le dau asta fără să mi se ceară.",
    "description": "Measures SF vs NT.",
    "descriptionRo": "Măsoară SF vs NT.",
    "agreementPole": "SF",
    "agreementExplanation": "Agreement favors SF.",
    "agreementExplanationRo": "Acordul favorizează SF.",
    "disagreementExplanation": "Disagreement favors NT.",
    "disagreementExplanationRo": "Dezacordul favorizează NT.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S29",
    "format": "short",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IJ/EP",
    "target": "IJ",
    "oppositePole": "EP",
    "text": "I like keeping everything in its place at home and spending evenings with a stable routine.",
    "textRo": "Îmi place să am totul la locul lui acasă și să-mi petrec serile acasă, după un program stabil.",
    "description": "Measures IJ vs EP.",
    "descriptionRo": "Măsoară IJ vs EP.",
    "agreementPole": "IJ",
    "agreementExplanation": "Agreement favors IJ.",
    "agreementExplanationRo": "Acordul favorizează IJ.",
    "disagreementExplanation": "Disagreement favors EP.",
    "disagreementExplanationRo": "Dezacordul favorizează EP.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S30",
    "format": "short",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IP/EJ",
    "target": "IP",
    "oppositePole": "EJ",
    "text": "I willingly spend my time alone on a hobby or project, with no schedule and no planning.",
    "textRo": "Îmi petrec de bunăvoie timpul singur, cu un proiect sau hobby, fără program și fără să planific nimic.",
    "description": "Measures IP vs EJ.",
    "descriptionRo": "Măsoară IP vs EJ.",
    "agreementPole": "IP",
    "agreementExplanation": "Agreement favors IP.",
    "agreementExplanationRo": "Acordul favorizează IP.",
    "disagreementExplanation": "Disagreement favors EJ.",
    "disagreementExplanationRo": "Dezacordul favorizează EJ.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S31",
    "format": "short",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IJ/EP",
    "target": "EP",
    "oppositePole": "IJ",
    "text": "I readily say 'yes' to spontaneous plans with friends and just go with the flow.",
    "textRo": "Spun „da” repede la un plan spontan cu prietenii și mă las dus de val.",
    "description": "Measures EP vs IJ.",
    "descriptionRo": "Măsoară EP vs IJ.",
    "agreementPole": "EP",
    "agreementExplanation": "Agreement favors EP.",
    "agreementExplanationRo": "Acordul favorizează EP.",
    "disagreementExplanation": "Disagreement favors IJ.",
    "disagreementExplanationRo": "Dezacordul favorizează IJ.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S32",
    "format": "short",
    "category": "combination",
    "subcategory": "orientation",
    "dimension": "IP/EJ",
    "target": "EJ",
    "oppositePole": "IP",
    "text": "I am usually the one who organizes outings: picking the venue, the time, and rallying everyone.",
    "textRo": "Eu sunt cel care organizează ieșirile: aleg locul, ora și anunț pe toată lumea.",
    "description": "Measures EJ vs IP.",
    "descriptionRo": "Măsoară EJ vs IP.",
    "agreementPole": "EJ",
    "agreementExplanation": "Agreement favors EJ.",
    "agreementExplanationRo": "Acordul favorizează EJ.",
    "disagreementExplanation": "Disagreement favors IP.",
    "disagreementExplanationRo": "Dezacordul favorizează IP.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "W01",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "text": "Saturday evening after a demanding week:",
    "textRo": "Sâmbătă seara, după o săptămână grea:",
    "description": "Measures I vs E.",
    "descriptionRo": "Măsoară I vs E.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Stay home alone in peace and quiet.",
        "textRo": "Stau acasă singur, în liniște.",
        "explanation": "Selection favors I (+1.0).",
        "explanationRo": "Alegerea favorizează I (+1.0)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Go out with friends for dinner.",
        "textRo": "Ies cu prietenii la o masă.",
        "explanation": "Selection favors E (+1.0).",
        "explanationRo": "Alegerea favorizează E (+1.0)."
      }
    ]
  },
  {
    "id": "W02",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "When you have a new idea:",
    "textRo": "Când ai o idee nouă:",
    "description": "Measures E vs I.",
    "descriptionRo": "Măsoară E vs I.",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Discuss it immediately with someone.",
        "textRo": "O discut imediat cu cineva.",
        "explanation": "Selection favors E (+1.0).",
        "explanationRo": "Alegerea favorizează E (+1.0)."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Let it settle in your mind for a few days.",
        "textRo": "O las câteva zile să se așeze în minte.",
        "explanation": "Selection favors I (+1.0).",
        "explanationRo": "Alegerea favorizează I (+1.0)."
      }
    ]
  },
  {
    "id": "W03",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "When reading about something new:",
    "textRo": "Când citești despre un lucru nou:",
    "description": "Measures N vs S.",
    "descriptionRo": "Măsoară N vs S.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "I wonder what it could mean and where it could lead.",
        "textRo": "Mă întreb ce ar putea însemna și unde ar putea duce.",
        "explanation": "Selection favors N (+1.0).",
        "explanationRo": "Alegerea favorizează N (+1.0)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "I focus on exactly what it says, with numbers and concrete examples.",
        "textRo": "Mă interesează exact ce spune, cu cifre și exemple.",
        "explanation": "Selection favors S (+1.0).",
        "explanationRo": "Alegerea favorizează S (+1.0)."
      }
    ]
  },
  {
    "id": "W04",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "text": "When learning a software program or tool:",
    "textRo": "Când înveți un program sau un instrument:",
    "description": "Measures S vs N.",
    "descriptionRo": "Măsoară S vs N.",
    "options": [
      {
        "id": "A",
        "pole": "S",
        "text": "I follow the exact steps in a tutorial.",
        "textRo": "Urmez pașii exacți dintr-un tutorial.",
        "explanation": "Selection favors S (+1.0).",
        "explanationRo": "Alegerea favorizează S (+1.0)."
      },
      {
        "id": "B",
        "pole": "N",
        "text": "I tinker with it to grasp the overall concept.",
        "textRo": "Mă joc cu el ca să prind ideea generală.",
        "explanation": "Selection favors N (+1.0).",
        "explanationRo": "Alegerea favorizează N (+1.0)."
      }
    ]
  },
  {
    "id": "W05",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "A friend asks for your opinion on a plan that has a flaw:",
    "textRo": "Un prieten îți cere părerea despre un plan care are o problemă:",
    "description": "Measures T vs F.",
    "descriptionRo": "Măsoară T vs F.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "I tell them the issue straight up.",
        "textRo": "Îi spun direct problema.",
        "explanation": "Selection favors T (+1.0).",
        "explanationRo": "Alegerea favorizează T (+1.0)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "I mention what's good first, then gently bring up the issue.",
        "textRo": "Îi spun întâi ce e bun, apoi cu grijă problema.",
        "explanation": "Selection favors F (+1.0).",
        "explanationRo": "Alegerea favorizează F (+1.0)."
      }
    ]
  },
  {
    "id": "W06",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "text": "Choosing between two alternatives:",
    "textRo": "Ai de ales între două variante:",
    "description": "Measures F vs T.",
    "descriptionRo": "Măsoară F vs T.",
    "options": [
      {
        "id": "A",
        "pole": "F",
        "text": "I choose the one that hurts people close to me the least.",
        "textRo": "Aleg varianta care îi afectează mai puțin pe cei apropiați.",
        "explanation": "Selection favors F (+1.0).",
        "explanationRo": "Alegerea favorizează F (+1.0)."
      },
      {
        "id": "B",
        "pole": "T",
        "text": "I choose the better option based on objective criteria.",
        "textRo": "Aleg varianta mai bună după criterii obiective.",
        "explanation": "Selection favors T (+1.0).",
        "explanationRo": "Alegerea favorizează T (+1.0)."
      }
    ]
  },
  {
    "id": "W07",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "You have a trip in a month:",
    "textRo": "Ai o excursie peste o lună:",
    "description": "Measures J vs P.",
    "descriptionRo": "Măsoară J vs P.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "I plan the day-by-day itinerary well in advance.",
        "textRo": "Fac programul zi cu zi din timp.",
        "explanation": "Selection favors J (+1.0).",
        "explanationRo": "Alegerea favorizează J (+1.0)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "I see what to do each day once I'm there.",
        "textRo": "Văd pe loc ce fac în fiecare zi.",
        "explanation": "Selection favors P (+1.0).",
        "explanationRo": "Alegerea favorizează P (+1.0)."
      }
    ]
  },
  {
    "id": "W08",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "dilemma",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "text": "You have a deadline in a week:",
    "textRo": "Ai un termen peste o săptămână:",
    "description": "Measures P vs J.",
    "descriptionRo": "Măsoară P vs J.",
    "options": [
      {
        "id": "A",
        "pole": "P",
        "text": "I start late, when I feel the pressure.",
        "textRo": "Încep târziu, când simt presiunea.",
        "explanation": "Selection favors P (+1.0).",
        "explanationRo": "Alegerea favorizează P (+1.0)."
      },
      {
        "id": "B",
        "pole": "J",
        "text": "I finish early so I can have peace of mind.",
        "textRo": "Termin din timp ca să fiu liniștit.",
        "explanation": "Selection favors J (+1.0).",
        "explanationRo": "Alegerea favorizează J (+1.0)."
      }
    ]
  },
  {
    "id": "W09",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ne/Si",
    "target": "Ne",
    "oppositePole": "Si",
    "text": "You have a task with no established method:",
    "textRo": "Ai de făcut ceva pentru care nu ai o metodă clară:",
    "description": "Measures Ne vs Si.",
    "descriptionRo": "Măsoară Ne vs Si.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "I try something completely new.",
        "textRo": "Încerc ceva complet nou.",
        "explanation": "Selection favors Ne (+1.0).",
        "explanationRo": "Alegerea favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "I adapt what worked for something similar before.",
        "textRo": "Adaptez ce a funcționat la ceva asemănător înainte.",
        "explanation": "Selection favors Si (+1.0).",
        "explanationRo": "Alegerea favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W10",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ne/Si",
    "target": "Si",
    "oppositePole": "Ne",
    "text": "At a new restaurant:",
    "textRo": "Într-un restaurant nou:",
    "description": "Measures Si vs Ne.",
    "descriptionRo": "Măsoară Si vs Ne.",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "I order something similar to what I've enjoyed before.",
        "textRo": "Comand ceva asemănător cu ce mi-a plăcut înainte.",
        "explanation": "Selection favors Si (+1.0).",
        "explanationRo": "Alegerea favorizează Si (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "I order something I've never tasted.",
        "textRo": "Comand ceva ce n-am mai gustat.",
        "explanation": "Selection favors Ne (+1.0).",
        "explanationRo": "Alegerea favorizează Ne (+1.0)."
      }
    ]
  },
  {
    "id": "W11",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ni/Se",
    "target": "Se",
    "oppositePole": "Ni",
    "text": "When facing a complicated situation:",
    "textRo": "Când vezi o situație complicată:",
    "description": "Measures Se vs Ni.",
    "descriptionRo": "Măsoară Se vs Ni.",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "I focus on what is happening right now, concretely.",
        "textRo": "Mă concentrez pe ce se întâmplă acum, concret.",
        "explanation": "Selection favors Se (+1.0).",
        "explanationRo": "Alegerea favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "I look for the underlying pattern behind it.",
        "textRo": "Caut tiparul din spatele ei.",
        "explanation": "Selection favors Ni (+1.0).",
        "explanationRo": "Alegerea favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W12",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ni/Se",
    "target": "Ni",
    "oppositePole": "Se",
    "text": "When things are changing rapidly:",
    "textRo": "Când lucrurile se schimbă rapid:",
    "description": "Measures Ni vs Se.",
    "descriptionRo": "Măsoară Ni vs Se.",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "I remind myself of where I'm headed in the long run.",
        "textRo": "Îmi spun încotro merg pe termen lung.",
        "explanation": "Selection favors Ni (+1.0).",
        "explanationRo": "Alegerea favorizează Ni (+1.0)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "I react on the spot to whatever emerges.",
        "textRo": "Reacționez pe loc la ce apare.",
        "explanation": "Selection favors Se (+1.0).",
        "explanationRo": "Alegerea favorizează Se (+1.0)."
      }
    ]
  },
  {
    "id": "W13",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Te/Fi",
    "target": "Te",
    "oppositePole": "Fi",
    "text": "Choosing a life direction for the coming years:",
    "textRo": "Alegi o direcție pentru următorii ani:",
    "description": "Measures Te vs Fi.",
    "descriptionRo": "Măsoară Te vs Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "By clear criteria: earnings, efficiency, advancement.",
        "textRo": "După criterii clare: câștig, eficiență, avansare.",
        "explanation": "Selection favors Te (+1.0).",
        "explanationRo": "Alegerea favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "By what feels genuinely aligned with who I am.",
        "textRo": "După ce simt că mi se potrivește cu adevărat.",
        "explanation": "Selection favors Fi (+1.0).",
        "explanationRo": "Alegerea favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "W14",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Te/Fi",
    "target": "Fi",
    "oppositePole": "Te",
    "text": "A well-paying job that contradicts your core values:",
    "textRo": "Un job bine plătit care contrazice ce crezi:",
    "description": "Measures Fi vs Te.",
    "descriptionRo": "Măsoară Fi vs Te.",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "I refuse, even if I lose the advantage.",
        "textRo": "Refuz, chiar dacă pierd avantajul.",
        "explanation": "Selection favors Fi (+1.0).",
        "explanationRo": "Alegerea favorizează Fi (+1.0)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "I accept, if the practical results are good.",
        "textRo": "Accept, dacă rezultatele sunt bune.",
        "explanation": "Selection favors Te (+1.0).",
        "explanationRo": "Alegerea favorizează Te (+1.0)."
      }
    ]
  },
  {
    "id": "W15",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ti/Fe",
    "target": "Ti",
    "oppositePole": "Fe",
    "text": "In a team disagreement:",
    "textRo": "Într-un dezacord de echipă:",
    "description": "Measures Ti vs Fe.",
    "descriptionRo": "Măsoară Ti vs Fe.",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "I clarify the logic and precise definitions.",
        "textRo": "Clarific logica și termenii.",
        "explanation": "Selection favors Ti (+1.0).",
        "explanationRo": "Alegerea favorizează Ti (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "I calm the tone and restore the relationship.",
        "textRo": "Calmez tonul și refac relația.",
        "explanation": "Selection favors Fe (+1.0).",
        "explanationRo": "Alegerea favorizează Fe (+1.0)."
      }
    ]
  },
  {
    "id": "W16",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ti/Fe",
    "target": "Fe",
    "oppositePole": "Ti",
    "text": "When delivering critical feedback:",
    "textRo": "Când oferi un feedback critic:",
    "description": "Measures Fe vs Ti.",
    "descriptionRo": "Măsoară Fe vs Ti.",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "I think about how it will be received emotionally.",
        "textRo": "Mă gândesc cum va fi primit.",
        "explanation": "Selection favors Fe (+1.0).",
        "explanationRo": "Alegerea favorizează Fe (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "I ensure the explanation is logically sound and accurate.",
        "textRo": "Mă asigur că explicația e precisă și corectă.",
        "explanation": "Selection favors Ti (+1.0).",
        "explanationRo": "Alegerea favorizează Ti (+1.0)."
      }
    ]
  },
  {
    "id": "W17",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ne/Ni",
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "After a brainstorming session:",
    "textRo": "După un brainstorming:",
    "description": "Measures Ne vs Ni.",
    "descriptionRo": "Măsoară Ne vs Ni.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "I keep multiple directions open.",
        "textRo": "Păstrez mai multe direcții deschise.",
        "explanation": "Selection favors Ne (+1.0).",
        "explanationRo": "Alegerea favorizează Ne (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "I choose a single direction and stick to it.",
        "textRo": "Aleg o singură direcție și o urmez.",
        "explanation": "Selection favors Ni (+1.0).",
        "explanationRo": "Alegerea favorizează Ni (+1.0)."
      }
    ]
  },
  {
    "id": "W18",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Ne/Ni",
    "target": "Ni",
    "oppositePole": "Ne",
    "text": "When thinking about the future:",
    "textRo": "Când te gândești la viitor:",
    "description": "Measures Ni vs Ne.",
    "descriptionRo": "Măsoară Ni vs Ne.",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "I focus on one single likely trajectory.",
        "textRo": "Mă concentrez pe o singură variantă probabilă.",
        "explanation": "Selection favors Ni (+1.0).",
        "explanationRo": "Alegerea favorizează Ni (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "I imagine several diverse scenarios.",
        "textRo": "Imaginez mai multe scenarii diferite.",
        "explanation": "Selection favors Ne (+1.0).",
        "explanationRo": "Alegerea favorizează Ne (+1.0)."
      }
    ]
  },
  {
    "id": "W19",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Te/Ti",
    "target": "Te",
    "oppositePole": "Ti",
    "text": "A colleague proposes a shortcut:",
    "textRo": "Un coleg propune o scurtătură:",
    "description": "Measures Te vs Ti.",
    "descriptionRo": "Măsoară Te vs Ti.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "I try it; if it works, I use it.",
        "textRo": "O încerc; dacă merge, o folosesc.",
        "explanation": "Selection favors Te (+1.0).",
        "explanationRo": "Alegerea favorizează Te (+1.0)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "I want to know why it works before using it.",
        "textRo": "Vreau să știu de ce merge înainte s-o folosesc.",
        "explanation": "Selection favors Ti (+1.0).",
        "explanationRo": "Alegerea favorizează Ti (+1.0)."
      }
    ]
  },
  {
    "id": "W20",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Te/Ti",
    "target": "Ti",
    "oppositePole": "Te",
    "text": "Dealing with a technical problem:",
    "textRo": "La o problemă tehnică:",
    "description": "Measures Ti vs Te.",
    "descriptionRo": "Măsoară Ti vs Te.",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "I first understand why it broke down.",
        "textRo": "Înțeleg mai întâi de ce s-a stricat.",
        "explanation": "Selection favors Ti (+1.0).",
        "explanationRo": "Alegerea favorizează Ti (+1.0)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "I quickly fix whatever is visibly malfunctioning.",
        "textRo": "Repar rapid ce se vede că nu merge.",
        "explanation": "Selection favors Te (+1.0).",
        "explanationRo": "Alegerea favorizează Te (+1.0)."
      }
    ]
  },
  {
    "id": "W21",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Fe/Fi",
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "In social situations:",
    "textRo": "În situații sociale:",
    "description": "Measures Fe vs Fi.",
    "descriptionRo": "Măsoară Fe vs Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "I adapt my demeanor to match the atmosphere.",
        "textRo": "Îmi adaptez comportamentul la atmosferă.",
        "explanation": "Selection favors Fe (+1.0).",
        "explanationRo": "Alegerea favorizează Fe (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "I stay true to how I feel, regardless of the room's mood.",
        "textRo": "Rămân așa cum mă simt, indiferent de atmosferă.",
        "explanation": "Selection favors Fi (+1.0).",
        "explanationRo": "Alegerea favorizează Fi (+1.0)."
      }
    ]
  },
  {
    "id": "W22",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Fe/Fi",
    "target": "Fi",
    "oppositePole": "Fe",
    "text": "Someone asks you for a favor that compromises your beliefs:",
    "textRo": "Cineva te roagă ceva ce te contrazice:",
    "description": "Measures Fi vs Fe.",
    "descriptionRo": "Măsoară Fi vs Fe.",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "I ask myself whether I'm staying true to my principles.",
        "textRo": "Mă întreb dacă rămân fidel convingerilor mele.",
        "explanation": "Selection favors Fi (+1.0).",
        "explanationRo": "Alegerea favorizează Fi (+1.0)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "I worry about how hurt they will feel if I refuse.",
        "textRo": "Mă gândesc cât de rău se va simți dacă refuz.",
        "explanation": "Selection favors Fe (+1.0).",
        "explanationRo": "Alegerea favorizează Fe (+1.0)."
      }
    ]
  },
  {
    "id": "W23",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Se/Si",
    "target": "Se",
    "oppositePole": "Si",
    "text": "For a vacation:",
    "textRo": "Pentru o vacanță:",
    "description": "Measures Se vs Si.",
    "descriptionRo": "Măsoară Se vs Si.",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "A brand-new place with fresh sensations.",
        "textRo": "Un loc nou, cu senzații noi.",
        "explanation": "Selection favors Se (+1.0).",
        "explanationRo": "Alegerea favorizează Se (+1.0)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "A familiar, beloved destination.",
        "textRo": "Un loc cunoscut, care îmi place.",
        "explanation": "Selection favors Si (+1.0).",
        "explanationRo": "Alegerea favorizează Si (+1.0)."
      }
    ]
  },
  {
    "id": "W24",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "dilemma",
    "dimension": "Se/Si",
    "target": "Si",
    "oppositePole": "Se",
    "text": "On a free evening:",
    "textRo": "Într-o seară liberă:",
    "description": "Measures Si vs Se.",
    "descriptionRo": "Măsoară Si vs Se.",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "The same soothing routine that calms me.",
        "textRo": "Aceeași rutină care mă liniștește.",
        "explanation": "Selection favors Si (+1.0).",
        "explanationRo": "Alegerea favorizează Si (+1.0)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Something unexpected, physical, and exhilarating.",
        "textRo": "Ceva neașteptat, fizic și intens.",
        "explanation": "Selection favors Se (+1.0).",
        "explanationRo": "Alegerea favorizează Se (+1.0)."
      }
    ]
  },
  {
    "id": "W25",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "NT/SF",
    "target": "NT",
    "oppositePole": "SF",
    "text": "On a free day:",
    "textRo": "O zi liberă:",
    "description": "Measures NT vs SF.",
    "descriptionRo": "Măsoară NT vs SF.",
    "options": [
      {
        "id": "A",
        "pole": "NT",
        "text": "I immerse myself in a complex topic to understand it.",
        "textRo": "Mă cufund într-o problemă complexă ca s-o înțeleg.",
        "explanation": "Selection favors NT (+1.0).",
        "explanationRo": "Alegerea favorizează NT (+1.0)."
      },
      {
        "id": "B",
        "pole": "SF",
        "text": "I do something tangible for a loved one: cooking, helping, spending time.",
        "textRo": "Fac ceva concret pentru cineva drag: gătesc, ajut, ies împreună.",
        "explanation": "Selection favors SF (+1.0).",
        "explanationRo": "Alegerea favorizează SF (+1.0)."
      }
    ]
  },
  {
    "id": "W26",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "NT/SF",
    "target": "SF",
    "oppositePole": "NT",
    "text": "Your role on a team project:",
    "textRo": "La un proiect în echipă, rolul tău:",
    "description": "Measures SF vs NT.",
    "descriptionRo": "Măsoară SF vs NT.",
    "options": [
      {
        "id": "A",
        "pole": "SF",
        "text": "Taking care of team members' practical needs (logistics, morale).",
        "textRo": "Mă ocup de nevoile concrete ale colegilor (logistică, atmosferă).",
        "explanation": "Selection favors SF (+1.0).",
        "explanationRo": "Alegerea favorizează SF (+1.0)."
      },
      {
        "id": "B",
        "pole": "NT",
        "text": "Developing the foundational structure and strategy.",
        "textRo": "Găsesc structura de fond și strategia.",
        "explanation": "Selection favors NT (+1.0).",
        "explanationRo": "Alegerea favorizează NT (+1.0)."
      }
    ]
  },
  {
    "id": "W27",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "NF/ST",
    "target": "NF",
    "oppositePole": "ST",
    "text": "A friend has a problem:",
    "textRo": "Un prieten are o problemă:",
    "description": "Measures NF vs ST.",
    "descriptionRo": "Măsoară NF vs ST.",
    "options": [
      {
        "id": "A",
        "pole": "NF",
        "text": "I help them understand what they truly want and the deeper meaning.",
        "textRo": "Îl ajut să înțeleagă ce vrea cu adevărat și ce sens are.",
        "explanation": "Selection favors NF (+1.0).",
        "explanationRo": "Alegerea favorizează NF (+1.0)."
      },
      {
        "id": "B",
        "pole": "ST",
        "text": "I give them actionable, concrete steps to solve it.",
        "textRo": "Îi dau pași practici și concreți de rezolvare.",
        "explanation": "Selection favors ST (+1.0).",
        "explanationRo": "Alegerea favorizează ST (+1.0)."
      }
    ]
  },
  {
    "id": "W28",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "NF/ST",
    "target": "ST",
    "oppositePole": "NF",
    "text": "In your career, you prefer:",
    "textRo": "La un job, preferi:",
    "description": "Measures ST vs NF.",
    "descriptionRo": "Măsoară ST vs NF.",
    "options": [
      {
        "id": "A",
        "pole": "ST",
        "text": "Executing tangible tasks well, with visible outcomes.",
        "textRo": "Să execut bine sarcini concrete, cu rezultate vizibile.",
        "explanation": "Selection favors ST (+1.0).",
        "explanationRo": "Alegerea favorizează ST (+1.0)."
      },
      {
        "id": "B",
        "pole": "NF",
        "text": "Working toward a meaningful cause and inspiring others.",
        "textRo": "Să lucrez pentru o cauză în care cred și să inspir oameni.",
        "explanation": "Selection favors NF (+1.0).",
        "explanationRo": "Alegerea favorizează NF (+1.0)."
      }
    ]
  },
  {
    "id": "W29",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "IJ/EP",
    "target": "IJ",
    "oppositePole": "EP",
    "text": "A typical Sunday:",
    "textRo": "O duminică:",
    "description": "Measures IJ vs EP.",
    "descriptionRo": "Măsoară IJ vs EP.",
    "options": [
      {
        "id": "A",
        "pole": "IJ",
        "text": "An orderly home, predictable schedule, evening in.",
        "textRo": "Ordine în casă, program stabil, seara acasă.",
        "explanation": "Selection favors IJ (+1.0).",
        "explanationRo": "Alegerea favorizează IJ (+1.0)."
      },
      {
        "id": "B",
        "pole": "EP",
        "text": "Going out spontaneously and seeing where the day leads.",
        "textRo": "Ies spontan și văd unde mă duce ziua.",
        "explanation": "Selection favors EP (+1.0).",
        "explanationRo": "Alegerea favorizează EP (+1.0)."
      }
    ]
  },
  {
    "id": "W30",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "IJ/EP",
    "target": "EP",
    "oppositePole": "IJ",
    "text": "Free time:",
    "textRo": "Timpul liber:",
    "description": "Measures EP vs IJ.",
    "descriptionRo": "Măsoară EP vs IJ.",
    "options": [
      {
        "id": "A",
        "pole": "EP",
        "text": "With new people and no plan; seeing what unfolds.",
        "textRo": "Cu oameni noi, fără plan; văd ce iese.",
        "explanation": "Selection favors EP (+1.0).",
        "explanationRo": "Alegerea favorizează EP (+1.0)."
      },
      {
        "id": "B",
        "pole": "IJ",
        "text": "At home or with 1–2 close friends, something settled in advance.",
        "textRo": "Acasă sau cu 1–2 oameni apropiați, ceva stabilit din timp.",
        "explanation": "Selection favors IJ (+1.0).",
        "explanationRo": "Alegerea favorizează IJ (+1.0)."
      }
    ]
  },
  {
    "id": "W31",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "IP/EJ",
    "target": "IP",
    "oppositePole": "EJ",
    "text": "How do you work on a project?",
    "textRo": "Cum lucrezi la un proiect?",
    "description": "Measures IP vs EJ.",
    "descriptionRo": "Măsoară IP vs EJ.",
    "options": [
      {
        "id": "A",
        "pole": "IP",
        "text": "On my own, at my own pace, without a rigid schedule.",
        "textRo": "Singur, în ritmul meu, fără program fix.",
        "explanation": "Selection favors IP (+1.0).",
        "explanationRo": "Alegerea favorizează IP (+1.0)."
      },
      {
        "id": "B",
        "pole": "EJ",
        "text": "With a group, with clear roles and defined milestones.",
        "textRo": "Cu un grup, cu roluri și termene clare.",
        "explanation": "Selection favors EJ (+1.0).",
        "explanationRo": "Alegerea favorizează EJ (+1.0)."
      }
    ]
  },
  {
    "id": "W32",
    "format": "wouldYouRather",
    "category": "combination",
    "subcategory": "dilemma",
    "dimension": "IP/EJ",
    "target": "EJ",
    "oppositePole": "IP",
    "text": "The ideal vacation:",
    "textRo": "Vacanța ideală:",
    "description": "Measures EJ vs IP.",
    "descriptionRo": "Măsoară EJ vs IP.",
    "options": [
      {
        "id": "A",
        "pole": "EJ",
        "text": "Organized by me for a group, with a full itinerary.",
        "textRo": "Organizată de mine pentru un grup, cu program.",
        "explanation": "Selection favors EJ (+1.0).",
        "explanationRo": "Alegerea favorizează EJ (+1.0)."
      },
      {
        "id": "B",
        "pole": "IP",
        "text": "Solo or with one companion, no schedule; deciding on the spot.",
        "textRo": "Singur sau în doi, fără program; văd pe loc.",
        "explanation": "Selection favors IP (+1.0).",
        "explanationRo": "Alegerea favorizează IP (+1.0)."
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
    "text": "Do you consider yourself naturally more:",
    "textRo": "Te consideri o persoană:",
    "description": "Measures E vs I.",
    "descriptionRo": "Măsoară E vs I.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Introverted (recharge in solitude)",
        "textRo": "Introvertă (Introvert)",
        "explanation": "Selection favors I (+1.0).",
        "explanationRo": "Alegerea favorizează I (+1.0)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Extraverted (recharge among people)",
        "textRo": "Extrovertă (Extrovert)",
        "explanation": "Selection favors E (+1.0).",
        "explanationRo": "Alegerea favorizează E (+1.0)."
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
    "text": "Do you consider yourself naturally more:",
    "textRo": "Te consideri o persoană:",
    "description": "Measures N vs S.",
    "descriptionRo": "Măsoară N vs S.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Intuitive (abstract, big picture)",
        "textRo": "Abstractă / Intuitivă (Intuitive)",
        "explanation": "Selection favors N (+1.0).",
        "explanationRo": "Alegerea favorizează N (+1.0)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Sensing (concrete, realistic)",
        "textRo": "Senzorială / Concretă (Sensing)",
        "explanation": "Selection favors S (+1.0).",
        "explanationRo": "Alegerea favorizează S (+1.0)."
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
    "text": "Do you consider yourself naturally more:",
    "textRo": "Te consideri o persoană:",
    "description": "Measures T vs F.",
    "descriptionRo": "Măsoară T vs F.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Thinker (logic, objective truth)",
        "textRo": "Rațională (Thinker)",
        "explanation": "Selection favors T (+1.0).",
        "explanationRo": "Alegerea favorizează T (+1.0)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Feeler (empathy, human values)",
        "textRo": "Sentimentală (Feeler)",
        "explanation": "Selection favors F (+1.0).",
        "explanationRo": "Alegerea favorizează F (+1.0)."
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
    "text": "Do you consider yourself naturally more:",
    "textRo": "Te consideri o persoană:",
    "description": "Measures J vs P.",
    "descriptionRo": "Măsoară J vs P.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Organized (planned, structured)",
        "textRo": "Organizată (Organized / Judging)",
        "explanation": "Selection favors J (+1.0).",
        "explanationRo": "Alegerea favorizează J (+1.0)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Spontaneous (flexible, adaptive)",
        "textRo": "Spontană (Spontaneous / Perceiving)",
        "explanation": "Selection favors P (+1.0).",
        "explanationRo": "Alegerea favorizează P (+1.0)."
      }
    ]
  }
];

export const TARGET_ORDER = [
  "I", "E",
  "N", "S",
  "T", "F",
  "J", "P",
  "Ne", "Si", "Ni", "Se", "Te", "Fi", "Ti", "Fe",
  "NT", "NF", "ST", "SF", "IJ", "IP", "EP", "EJ"
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

  const deepQuestions = QUESTIONS_100.filter(q => q.format === "deep");
  const simpleQuestions = QUESTIONS_100.filter(q => q.format === "short");
  const wyrQuestions = QUESTIONS_100.filter(q => q.format === "wouldYouRather");
  const directFinalItems = QUESTIONS_100.filter(q => q.format === "direct");

  let baseNonDirect = [];

  if (mode.totalQuestions === 36) {
    // Fast: All 32 Deep questions
    baseNonDirect = [...deepQuestions];
  } else if (mode.totalQuestions === 60) {
    // Standard: 32 Deep + 24 Simple
    // 8 axis (S01-S08)
    const sAxis = simpleQuestions.slice(0, 8);
    // 4 opposing polarity (1 for each pair: Ne/Si, Ni/Se, Te/Fi, Ti/Fe)
    const sOpp = ["S09", "S12", "S13", "S16"].map(id => simpleQuestions.find(q => q.id === id)).filter(Boolean);
    // 4 attitude polarity (1 for each pair: Ne/Ni, Te/Ti, Fe/Fi, Se/Si)
    const sAtt = ["S18", "S20", "S22", "S24"].map(id => simpleQuestions.find(q => q.id === id)).filter(Boolean);
    // 8 combinations (1 for each NT, NF, ST, SF, IJ, IP, EP, EJ)
    const sComb = ["S25", "S26", "S27", "S28", "S29", "S30", "S31", "S32"].map(id => simpleQuestions.find(q => q.id === id)).filter(Boolean);

    baseNonDirect = [...deepQuestions, ...sAxis, ...sOpp, ...sAtt, ...sComb];
  } else {
    // Complete: All 96 non-direct questions (32 deep, 32 simple, 32 would you rather)
    baseNonDirect = [...deepQuestions, ...simpleQuestions, ...wyrQuestions];
  }

  let orderedNonDirect = [];

  if (resolvedOrder === "random") {
    orderedNonDirect = shuffle(baseNonDirect);
  } else if (resolvedOrder === "function") {
    orderedNonDirect = sortByFunction(baseNonDirect);
  } else {
    // Format order: Deep -> Simple -> Would You Rather
    const formatRank = { deep: 1, short: 2, wouldYouRather: 3 };
    orderedNonDirect = [...baseNonDirect].sort((a, b) => {
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

  // The 4 Frontal questions (F01-F04) are ALWAYS strictly the last 4 items in every mode
  return [...orderedNonDirect, ...directFinalItems];
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
