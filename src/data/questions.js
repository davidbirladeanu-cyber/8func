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
    "text": "Talking through an important idea often helps me discover what I actually think.",
    "textRo": "Discutarea unei idei importante mă ajută adesea să descopăr ceea ce gândesc cu adevărat.",
    "description": "External processing of ideas. Agree: E (thinking through interaction). Disagree: I (private processing).",
    "descriptionRo": "Procesarea externă a ideilor. De acord: E (gândire prin interacțiune). Dezacord: I (procesare internă).",
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
    "description": "Internal reflection before sharing. Agree: I (private processing). Disagree: E (external processing).",
    "descriptionRo": "Reflecție privată înainte de partajare. De acord: I (nevoie de liniște). Dezacord: E (ușurință în dialog).",
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
    "description": "Abstract possibilities and implications. Agree: N (abstract potential). Disagree: S (concrete details).",
    "descriptionRo": "Posibilități abstracte și semnificații. De acord: N (potențial abstract). Dezacord: S (fapte concrete).",
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
    "description": "Concrete observable facts. Agree: S (concrete facts). Disagree: N (theoretical exploration).",
    "descriptionRo": "Fapte observabile concrete. De acord: S (dovezi directe). Dezacord: N (teorii și concepte).",
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
    "description": "Impersonal logical criteria. Agree: T (logic). Disagree: F (interpersonal harmony).",
    "descriptionRo": "Criterii logice impersonale. De acord: T (coerență logică). Dezacord: F (armonie interpersonală).",
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
    "text": "A decision's effect on people matters as much as its logical soundness.",
    "textRo": "Efectul unei decizii asupra oamenilor contează la fel de mult ca logica ei impecabilă.",
    "description": "Human impact and values. Agree: F (human impact). Disagree: T (logical soundness).",
    "descriptionRo": "Impact uman și valori. De acord: F (sentimente și empatie). Dezacord: T (logică strictă).",
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
    "description": "Preference for closure and defined structure. Agree: J (closure/structure). Disagree: P (open options).",
    "descriptionRo": "Preferință pentru finalitate și claritate. De acord: J (structură stabilită). Dezacord: P (opțiuni deschise).",
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
    "text": "I prefer keeping options open until I have explored alternatives.",
    "textRo": "Prefer să păstrez opțiunile deschise până când explorez toate alternativele.",
    "description": "Flexibility before deciding. Agree: P (flexibility/openness). Disagree: J (early closure).",
    "descriptionRo": "Flexibilitate și amânarea deciziei finale. De acord: P (adaptabilitate). Dezacord: J (structură fixă).",
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
    "text": "One idea often opens several unrelated possibilities worth exploring.",
    "textRo": "O idee deschide adesea mai multe posibilități fără legătură între ele, care merită explorate.",
    "description": "Divergent associative brainstorming. Agree: Ne (divergent exploration). Disagree: Si (proven reference).",
    "descriptionRo": "Explorare divergentă de posibilități. De acord: Ne (asocieri multiple). Dezacord: Si (metode consacrate).",
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
    "text": "Before replacing a familiar method, I want to understand why it works.",
    "textRo": "Înainte de a înlocui o metodă familiară, vreau să înțeleg de ce funcționează.",
    "description": "Reliance on proven experience. Agree: Si (proven reference). Disagree: Ne (speculative replacement).",
    "descriptionRo": "Bază pe experiență și rutină sigură. De acord: Si (referință dovedită). Dezacord: Ne (experimentare).",
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
    "text": "Different details often come together into one underlying explanation.",
    "textRo": "Detalii diferite se unesc adesea într-o singură explicație profundă.",
    "description": "Convergent synthesis of meaning. Agree: Ni (synthesis). Disagree: Se (focus on isolated details).",
    "descriptionRo": "Sinteză profundă a detaliilor. De acord: Ni (viziune centrală). Dezacord: Se (atenție la concret).",
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
    "text": "I notice changes and opportunities in my immediate surroundings quickly.",
    "textRo": "Observ rapid schimbările și oportunitățile din mediul meu fizic imediat.",
    "description": "Real-time sensory awareness. Agree: Se (present reality). Disagree: Ni (detached interpretation).",
    "descriptionRo": "Conștientizare senzorială imediată. De acord: Se (realitate prezentă). Dezacord: Ni (anticipare abstractă).",
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
    "text": "When a project stalls, I look for practical steps that restore progress.",
    "textRo": "Când un proiect stagnează, caut pași practici pentru a relua progresul.",
    "description": "Organizing action for measurable execution. Agree: Te (execution). Disagree: Fi (inner values over pace).",
    "descriptionRo": "Organizarea acțiunii pentru eficiență. De acord: Te (execuție practică). Dezacord: Fi (alinieri de valori).",
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
    "text": "I struggle to support a choice that conflicts with my deepest values.",
    "textRo": "Îmi este greu să susțin o alegere care intră în conflict cu valorile mele profunde.",
    "description": "Inner moral alignment. Agree: Fi (inner values). Disagree: Te (external utilitarian goals).",
    "descriptionRo": "Aliniere cu valorile interne. De acord: Fi (principii personale). Dezacord: Te (scopuri pur pragmatice).",
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
    "text": "An explanation bothers me when its parts do not fit together logically.",
    "textRo": "O explicație mă deranjează dacă componentele ei nu se leagă logic.",
    "description": "Internal logical precision. Agree: Ti (internal logic). Disagree: Fe (interpersonal diplomacy).",
    "descriptionRo": "Consecvență logică internă. De acord: Ti (logică deductivă). Dezacord: Fe (armonie în comunicare).",
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
    "text": "I notice shifts in group atmosphere even when nobody names them.",
    "textRo": "Observ schimbările din atmosfera grupului chiar dacă nimeni nu le numește cu voce tare.",
    "description": "Awareness of collective dynamics. Agree: Fe (social vibe). Disagree: Ti (objective detachment).",
    "descriptionRo": "Empatie și conștientizarea stării grupului. De acord: Fe (dinamică colectivă). Dezacord: Ti (analiză neutră).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "agreementPole": "Ne",
    "text": "I prefer generating many possibilities rather than narrowing down to one ultimate conclusion.",
    "textRo": "Prefer să generez multe posibilități decât să mă limitez la o singură concluzie finală.",
    "description": "Divergent expansion vs convergent focus. Agree: Ne (expansion). Disagree: Ni (convergence).",
    "descriptionRo": "Explorare divergentă vs convergență focalizată. De acord: Ne (expansiune). Dezacord: Ni (concentrare pe o viziune).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "agreementPole": "Ni",
    "text": "I naturally synthesize scattered details into a single cohesive vision rather than brainstorming alternatives.",
    "textRo": "Sintetizez natural detaliile răsfirate într-o singură viziune coerentă, în loc să caut alternative.",
    "description": "Singular visionary synthesis. Agree: Ni (convergence). Disagree: Ne (branching alternatives).",
    "descriptionRo": "Sinteză vizionară coerentă. De acord: Ni (convergență). Dezacord: Ne (ramificare de idei noi).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "agreementPole": "Se",
    "text": "I thrive on the immediate reality of the present moment rather than relying on past experiences.",
    "textRo": "Mă simt plin de viață în realitatea imediată a prezentului, în loc să mă bazez pe experiențe trecute.",
    "description": "Direct immersion in current sensation. Agree: Se (current stimuli). Disagree: Si (memory reference).",
    "descriptionRo": "Trăire directă a prezentului. De acord: Se (stimuli actuali). Dezacord: Si (memorie și referințe).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "agreementPole": "Si",
    "text": "I rely heavily on proven past methods rather than spontaneously adapting to current physical conditions.",
    "textRo": "Mă bazez mult pe metode verificate din trecut, în loc să mă adaptez spontan la circumstanțe noi.",
    "description": "Stability through established precedent. Agree: Si (proven past). Disagree: Se (spontaneous reaction).",
    "descriptionRo": "Stabilitate prin precedente verificate. De acord: Si (trecut sigur). Dezacord: Se (adaptare spontană).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "agreementPole": "Te",
    "text": "Getting a system to work effectively is more important than understanding its exact logical principles.",
    "textRo": "Faptul ca un sistem să funcționeze eficient este mai important decât înțelegerea principiilor logice exacte.",
    "description": "Pragmatic empirical results. Agree: Te (results). Disagree: Ti (pure logic).",
    "descriptionRo": "Rezultate practice și eficiență. De acord: Te (rezultate). Dezacord: Ti (logică pură).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "agreementPole": "Ti",
    "text": "I must understand the precise underlying logic, even if it delays practical implementation.",
    "textRo": "Trebuie să înțeleg logica precisă din spate, chiar dacă asta întârzie implementarea practică.",
    "description": "Rigorous logical clarity before action. Agree: Ti (pure logic). Disagree: Te (fast execution).",
    "descriptionRo": "Claritate și rigoare logică înainte de acțiune. De acord: Ti (analiză logică). Dezacord: Te (execuție rapidă).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "agreementPole": "Fe",
    "text": "Maintaining group harmony matters more to me than staying strictly true to my independent feelings.",
    "textRo": "Menținerea armoniei în grup contează mai mult pentru mine decât afirmarea strictă a sentimentelor mele.",
    "description": "Collective cohesion over personal feeling. Agree: Fe (collective harmony). Disagree: Fi (individual conviction).",
    "descriptionRo": "Coeziune colectivă peste stările individuale. De acord: Fe (armonie de grup). Dezacord: Fi (autenticitate personală).",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "agreementPole": "Fi",
    "text": "Staying authentic to my core values is more important than adapting to the group's emotional atmosphere.",
    "textRo": "Să rămân fidel valorilor mele de bază este mai important decât să mă adaptez la starea emoțională a grupului.",
    "description": "Inner moral authenticity. Agree: Fi (individual authenticity). Disagree: Fe (social accommodation).",
    "descriptionRo": "Autenticitate și principii morale interioare. De acord: Fi (principii proprii). Dezacord: Fe (adaptare la grup).",
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
    "text": "I clarify my thoughts by discussing them aloud.",
    "textRo": "Îmi clarific gândurile discutându-le cu voce tare.",
    "description": "Measures preference for E vs I.",
    "descriptionRo": "Măsoară preferința pentru E față de I.",
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
    "text": "I rehearse important thoughts privately before sharing them.",
    "textRo": "Îmi exersez gândurile importante în minte înainte de a le împărtăși.",
    "description": "Measures preference for I vs E.",
    "descriptionRo": "Măsoară preferința pentru I față de E.",
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
    "text": "Sharing ideas energizes me during collaborative work.",
    "textRo": "Împărtășirea ideilor mă energizează în timpul lucrului în echipă.",
    "description": "Measures preference for E vs I.",
    "descriptionRo": "Măsoară preferința pentru E față de I.",
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
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I look for implications beyond the facts presented.",
    "textRo": "Caut implicații dincolo de faptele prezentate direct.",
    "description": "Measures preference for N vs S.",
    "descriptionRo": "Măsoară preferința pentru N față de S.",
    "agreementExplanation": "Agreement favors N.",
    "agreementExplanationRo": "Acordul favorizează N.",
    "disagreementExplanation": "Disagreement favors S.",
    "disagreementExplanationRo": "Dezacordul favorizează S.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S05",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "text": "I trust details I can directly verify.",
    "textRo": "Am încredere în detaliile pe care le pot verifica direct.",
    "description": "Measures preference for S vs N.",
    "descriptionRo": "Măsoară preferința pentru S față de N.",
    "agreementExplanation": "Agreement favors S.",
    "agreementExplanationRo": "Acordul favorizează S.",
    "disagreementExplanation": "Disagreement favors N.",
    "disagreementExplanationRo": "Dezacordul favorizează N.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S06",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I often imagine what a current idea could become.",
    "textRo": "Îmi imaginez adesea ce ar putea deveni o idee actuală.",
    "description": "Measures preference for N vs S.",
    "descriptionRo": "Măsoară preferința pentru N față de S.",
    "agreementExplanation": "Agreement favors N.",
    "agreementExplanationRo": "Acordul favorizează N.",
    "disagreementExplanation": "Disagreement favors S.",
    "disagreementExplanationRo": "Dezacordul favorizează S.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S07",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "I evaluate arguments by checking their logical consistency.",
    "textRo": "Evaluez argumentele verificându-le consecvența logică.",
    "description": "Measures preference for T vs F.",
    "descriptionRo": "Măsoară preferința pentru T față de F.",
    "agreementExplanation": "Agreement favors T.",
    "agreementExplanationRo": "Acordul favorizează T.",
    "disagreementExplanation": "Disagreement favors F.",
    "disagreementExplanationRo": "Dezacordul favorizează F.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S08",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "text": "I consider how decisions affect people's feelings.",
    "textRo": "Iau în considerare modul în care deciziile afectează sentimentele oamenilor.",
    "description": "Measures preference for F vs T.",
    "descriptionRo": "Măsoară preferința pentru F față de T.",
    "agreementExplanation": "Agreement favors F.",
    "agreementExplanationRo": "Acordul favorizează F.",
    "disagreementExplanation": "Disagreement favors T.",
    "disagreementExplanationRo": "Dezacordul favorizează T.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S09",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "I challenge conclusions when the reasoning seems flawed.",
    "textRo": "Contest concluziile când raționamentul pare greșit.",
    "description": "Measures preference for T vs F.",
    "descriptionRo": "Măsoară preferința pentru T față de F.",
    "agreementExplanation": "Agreement favors T.",
    "agreementExplanationRo": "Acordul favorizează T.",
    "disagreementExplanation": "Disagreement favors F.",
    "disagreementExplanationRo": "Dezacordul favorizează F.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S10",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "I settle deadlines and plans well in advance.",
    "textRo": "Stabilesc termenele limită și planurile din timp.",
    "description": "Measures preference for J vs P.",
    "descriptionRo": "Măsoară preferința pentru J față de P.",
    "agreementExplanation": "Agreement favors J.",
    "agreementExplanationRo": "Acordul favorizează J.",
    "disagreementExplanation": "Disagreement favors P.",
    "disagreementExplanationRo": "Dezacordul favorizează P.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S11",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "text": "I change plans when better options appear.",
    "textRo": "Îmi schimb planurile când apar opțiuni mai bune.",
    "description": "Measures preference for P vs J.",
    "descriptionRo": "Măsoară preferința pentru P față de J.",
    "agreementExplanation": "Agreement favors P.",
    "agreementExplanationRo": "Acordul favorizează P.",
    "disagreementExplanation": "Disagreement favors J.",
    "disagreementExplanationRo": "Dezacordul favorizează J.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S12",
    "format": "short",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "Unresolved plans make it difficult for me to relax.",
    "textRo": "Planurile nerezolvate mă împiedică să mă relaxez.",
    "description": "Measures preference for J vs P.",
    "descriptionRo": "Măsoară preferința pentru J față de P.",
    "agreementExplanation": "Agreement favors J.",
    "agreementExplanationRo": "Acordul favorizează J.",
    "disagreementExplanation": "Disagreement favors P.",
    "disagreementExplanationRo": "Dezacordul favorizează P.",
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
    "text": "I generate alternative explanations when something seems unclear.",
    "textRo": "Generez explicații alternative când ceva pare neclar.",
    "description": "Measures preference for Ne vs Si.",
    "descriptionRo": "Măsoară preferința pentru Ne față de Si.",
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
    "text": "I compare new situations with specific past experiences.",
    "textRo": "Compar situațiile noi cu experiențe specifice din trecut.",
    "description": "Measures preference for Si vs Ne.",
    "descriptionRo": "Măsoară preferința pentru Si față de Ne.",
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
    "text": "I question familiar assumptions to discover other possibilities.",
    "textRo": "Pun la îndoială presupunerile cunoscute pentru a găsi alte posibilități.",
    "description": "Measures preference for Ne vs Si.",
    "descriptionRo": "Măsoară preferința pentru Ne față de Si.",
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
    "text": "I search for one pattern connecting separate events.",
    "textRo": "Caut un singur tipar care leagă evenimente separate.",
    "description": "Measures preference for Ni vs Se.",
    "descriptionRo": "Măsoară preferința pentru Ni față de Se.",
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
    "text": "I learn unfamiliar skills by trying them directly.",
    "textRo": "Învăț abilități necunoscute încercându-le direct în practică.",
    "description": "Measures preference for Se vs Ni.",
    "descriptionRo": "Măsoară preferința pentru Se față de Ni.",
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
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I form an overall impression before explaining its details.",
    "textRo": "Îmi formez o impresie generală înainte de a explica detaliile.",
    "description": "Measures preference for Ni vs Se.",
    "descriptionRo": "Măsoară preferința pentru Ni față de Se.",
    "agreementExplanation": "Agreement favors Ni.",
    "agreementExplanationRo": "Acordul favorizează Ni.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
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
    "text": "I organize complex tasks into measurable steps.",
    "textRo": "Organizez sarcinile complexe în pași măsurabili.",
    "description": "Measures preference for Te vs Fi.",
    "descriptionRo": "Măsoară preferința pentru Te față de Fi.",
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
    "text": "I reject choices that violate my core values.",
    "textRo": "Resping alegerile care îmi încalcă valorile de bază.",
    "description": "Measures preference for Fi vs Te.",
    "descriptionRo": "Măsoară preferința pentru Fi față de Te.",
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
    "text": "I prioritize tasks according to urgency and impact.",
    "textRo": "Prioritizez sarcinile după urgență și impact.",
    "description": "Measures preference for Te vs Fi.",
    "descriptionRo": "Măsoară preferința pentru Te față de Fi.",
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
    "text": "I check whether each step in an argument follows logically.",
    "textRo": "Verific dacă fiecare pas dintr-un argument decurge logic.",
    "description": "Measures preference for Ti vs Fe.",
    "descriptionRo": "Măsoară preferința pentru Ti față de Fe.",
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
    "text": "I notice when someone feels excluded from a group.",
    "textRo": "Observ când cineva se simte exclus dintr-un grup.",
    "description": "Measures preference for Fe vs Ti.",
    "descriptionRo": "Măsoară preferința pentru Fe față de Ti.",
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
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I question definitions when explanations seem imprecise.",
    "textRo": "Pun la îndoială definițiile când explicațiile par imprecise.",
    "description": "Measures preference for Ti vs Fe.",
    "descriptionRo": "Măsoară preferința pentru Ti față de Fe.",
    "agreementExplanation": "Agreement favors Ti.",
    "agreementExplanationRo": "Acordul favorizează Ti.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S25",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "agreementPole": "Ne",
    "text": "I brainstorm many paths instead of one final vision.",
    "textRo": "Generez mai multe căi în loc să mă limitez la o singură viziune.",
    "description": "Measures preference for Ne vs Ni.",
    "descriptionRo": "Măsoară preferința pentru Ne față de Ni.",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "agreementPole": "Ni",
    "text": "I narrow down possibilities into a single clear insight.",
    "textRo": "Restrâng posibilitățile într-o singură perspectivă clară.",
    "description": "Measures preference for Ni vs Ne.",
    "descriptionRo": "Măsoară preferința pentru Ni față de Ne.",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "agreementPole": "Ne",
    "text": "Endless alternative ideas appeal to me more than one conclusion.",
    "textRo": "Ideile alternative nesfârșite mă atrag mai mult decât o singură concluzie.",
    "description": "Measures preference for Ne vs Ni.",
    "descriptionRo": "Măsoară preferința pentru Ne față de Ni.",
    "agreementExplanation": "Agreement favors Ne.",
    "agreementExplanationRo": "Acordul favorizează Ne.",
    "disagreementExplanation": "Disagreement favors Ni.",
    "disagreementExplanationRo": "Dezacordul favorizează Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S28",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "agreementPole": "Se",
    "text": "I react to present stimuli rather than past memories.",
    "textRo": "Reacționez la stimulii prezenți mai degrabă decât la amintirile din trecut.",
    "description": "Measures preference for Se vs Si.",
    "descriptionRo": "Măsoară preferința pentru Se față de Si.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S29",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "agreementPole": "Si",
    "text": "I trust familiar routines over spontaneous new experiences.",
    "textRo": "Am încredere în rutine familiare mai mult decât în experiențe spontane.",
    "description": "Measures preference for Si vs Se.",
    "descriptionRo": "Măsoară preferința pentru Si față de Se.",
    "agreementExplanation": "Agreement favors Si.",
    "agreementExplanationRo": "Acordul favorizează Si.",
    "disagreementExplanation": "Disagreement favors Se.",
    "disagreementExplanationRo": "Dezacordul favorizează Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S30",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "agreementPole": "Se",
    "text": "I prefer living in the moment over repeating past successes.",
    "textRo": "Prefer să trăiesc în prezent decât să repet succese din trecut.",
    "description": "Measures preference for Se vs Si.",
    "descriptionRo": "Măsoară preferința pentru Se față de Si.",
    "agreementExplanation": "Agreement favors Se.",
    "agreementExplanationRo": "Acordul favorizează Se.",
    "disagreementExplanation": "Disagreement favors Si.",
    "disagreementExplanationRo": "Dezacordul favorizează Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S31",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "agreementPole": "Te",
    "text": "I prioritize practical results over perfect logical understanding.",
    "textRo": "Prioritizez rezultatele practice în fața unei înțelegeri logice perfecte.",
    "description": "Measures preference for Te vs Ti.",
    "descriptionRo": "Măsoară preferința pentru Te față de Ti.",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "agreementPole": "Ti",
    "text": "Internal logical consistency matters more than external efficiency.",
    "textRo": "Consecvența logică internă contează mai mult decât eficiența externă.",
    "description": "Measures preference for Ti vs Te.",
    "descriptionRo": "Măsoară preferința pentru Ti față de Te.",
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
    "subcategory": "same_type",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "agreementPole": "Te",
    "text": "I focus on getting things done rather than pure theory.",
    "textRo": "Mă concentrez pe finalizarea lucrurilor mai mult decât pe teoria pură.",
    "description": "Measures preference for Te vs Ti.",
    "descriptionRo": "Măsoară preferința pentru Te față de Ti.",
    "agreementExplanation": "Agreement favors Te.",
    "agreementExplanationRo": "Acordul favorizează Te.",
    "disagreementExplanation": "Disagreement favors Ti.",
    "disagreementExplanationRo": "Dezacordul favorizează Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S34",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "agreementPole": "Fe",
    "text": "I adjust my values to maintain group harmony.",
    "textRo": "Îmi adaptez exprimarea valorilor pentru a menține armonia în grup.",
    "description": "Measures preference for Fe vs Fi.",
    "descriptionRo": "Măsoară preferința pentru Fe față de Fi.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S35",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "agreementPole": "Fi",
    "text": "My personal authenticity outweighs external social expectations.",
    "textRo": "Autenticitatea mea personală cântărește mai mult decât așteptările sociale.",
    "description": "Measures preference for Fi vs Fe.",
    "descriptionRo": "Măsoară preferința pentru Fi față de Fe.",
    "agreementExplanation": "Agreement favors Fi.",
    "agreementExplanationRo": "Acordul favorizează Fi.",
    "disagreementExplanation": "Disagreement favors Fe.",
    "disagreementExplanationRo": "Dezacordul favorizează Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S36",
    "format": "short",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "agreementPole": "Fe",
    "text": "I prioritize collective feelings over my individual emotions.",
    "textRo": "Prioritizez sentimentele colective în fața emoțiilor mele individuale.",
    "description": "Measures preference for Fe vs Fi.",
    "descriptionRo": "Măsoară preferința pentru Fe față de Fi.",
    "agreementExplanation": "Agreement favors Fe.",
    "agreementExplanationRo": "Acordul favorizează Fe.",
    "disagreementExplanation": "Disagreement favors Fi.",
    "disagreementExplanationRo": "Dezacordul favorizează Fi.",
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
    "text": "When developing an idea, which do you prefer?",
    "textRo": "Când dezvolți o idee, ce preferi mai degrabă?",
    "description": "Compares E with I.",
    "descriptionRo": "Compară preferința pentru E cu cea pentru I.",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Talk through an idea with a group.",
        "textRo": "Să discut ideea în grup.",
        "explanation": "Favors E (+1).",
        "explanationRo": "Favorizează E (+1)."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Think it through privately first.",
        "textRo": "Să o gândesc mai întâi în liniște, pe cont propriu.",
        "explanation": "Favors I (+1).",
        "explanationRo": "Favorizează I (+1)."
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
    "text": "To recharge after a demanding week, which do you prefer?",
    "textRo": "Pentru a-ți reîncărca bateriile după o săptămână plină, ce ai alege?",
    "description": "Compares I with E.",
    "descriptionRo": "Compară preferința pentru I cu cea pentru E.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Spend a quiet evening alone.",
        "textRo": "Să petrec o seară liniștită de unul singur.",
        "explanation": "Favors I (+1).",
        "explanationRo": "Favorizează I (+1)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Join friends for an energetic evening.",
        "textRo": "Să ies cu prietenii pentru o seară energică.",
        "explanation": "Favors E (+1).",
        "explanationRo": "Favorizează E (+1)."
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
    "text": "In your daily rhythm, what restores your energy most?",
    "textRo": "În ritmul tău zilnic, ce îți reface cel mai mult energia?",
    "description": "Compares E with I.",
    "descriptionRo": "Compară preferința pentru E cu cea pentru I.",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Gain energy from social interactions.",
        "textRo": "Să primesc energie din interacțiunile sociale.",
        "explanation": "Favors E (+1).",
        "explanationRo": "Favorizează E (+1)."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Recharge by spending time alone.",
        "textRo": "Să mă reîncarc petrecând timp în solitudine.",
        "explanation": "Favors I (+1).",
        "explanationRo": "Favorizează I (+1)."
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
    "text": "When encountering a new discovery, which interests you more?",
    "textRo": "Când descoperi ceva nou, ce te captivează mai mult?",
    "description": "Compares N with S.",
    "descriptionRo": "Compară preferința pentru N cu cea pentru S.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Explore what a discovery might imply.",
        "textRo": "Să explorez ce ar putea implica o descoperire.",
        "explanation": "Favors N (+1).",
        "explanationRo": "Favorizează N (+1)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Study exactly what the evidence shows.",
        "textRo": "Să studiez exact ce arată dovezile concrete.",
        "explanation": "Favors S (+1).",
        "explanationRo": "Favorizează S (+1)."
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
    "text": "When mastering a new concept, what is your approach?",
    "textRo": "Când vrei să înveți un concept nou, ce abordare preferi?",
    "description": "Compares S with N.",
    "descriptionRo": "Compară preferința pentru S cu cea pentru N.",
    "options": [
      {
        "id": "A",
        "pole": "S",
        "text": "Learn by handling a real example.",
        "textRo": "Să învăț analizând un exemplu concret din viața reală.",
        "explanation": "Favors S (+1).",
        "explanationRo": "Favorizează S (+1)."
      },
      {
        "id": "B",
        "pole": "N",
        "text": "Explore the theory behind it first.",
        "textRo": "Să explorez mai întâi teoria din spatele lui.",
        "explanation": "Favors N (+1).",
        "explanationRo": "Favorizează N (+1)."
      }
    ]
  },
  {
    "id": "W06",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "When evaluating an opportunity, which is your priority?",
    "textRo": "Când evaluezi o oportunitate, pe ce te concentrezi primordial?",
    "description": "Compares N with S.",
    "descriptionRo": "Compară preferința pentru N cu cea pentru S.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Focus on future potential.",
        "textRo": "Să mă concentrez pe potențialul de viitor.",
        "explanation": "Favors N (+1).",
        "explanationRo": "Favorizează N (+1)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Focus on current reality.",
        "textRo": "Să mă concentrez pe realitatea prezentă.",
        "explanation": "Favors S (+1).",
        "explanationRo": "Favorizează S (+1)."
      }
    ]
  },
  {
    "id": "W07",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "When making a controversial decision, which matters more?",
    "textRo": "Când trebuie luată o decizie dificilă, ce contează mai mult?",
    "description": "Compares T with F.",
    "descriptionRo": "Compară preferința pentru T cu cea pentru F.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Choose the most consistent rule.",
        "textRo": "Să aleg regula cea mai consecventă și logică.",
        "explanation": "Favors T (+1).",
        "explanationRo": "Favorizează T (+1)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Consider individual circumstances.",
        "textRo": "Să țin cont de circumstanțele fiecărui om implicat.",
        "explanation": "Favors F (+1).",
        "explanationRo": "Favorizează F (+1)."
      }
    ]
  },
  {
    "id": "W08",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "text": "When reviewing an important policy, which comes first?",
    "textRo": "Când analizezi o măsură importantă, la ce te uiți mai întâi?",
    "description": "Compares F with T.",
    "descriptionRo": "Compară preferința pentru F cu cea pentru T.",
    "options": [
      {
        "id": "A",
        "pole": "F",
        "text": "Consider how a decision affects people.",
        "textRo": "Să țin cont de modul în care decizia afectează oamenii.",
        "explanation": "Favors F (+1).",
        "explanationRo": "Favorizează F (+1)."
      },
      {
        "id": "B",
        "pole": "T",
        "text": "Check whether the reasoning is consistent.",
        "textRo": "Să verific dacă raționamentul este riguros și consecvent.",
        "explanation": "Favors T (+1).",
        "explanationRo": "Favorizează T (+1)."
      }
    ]
  },
  {
    "id": "W09",
    "format": "wouldYouRather",
    "category": "axis",
    "subcategory": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "In critical moments, on what do you base your choices?",
    "textRo": "În momentele critice, pe ce îți întemeiezi alegerile?",
    "description": "Compares T with F.",
    "descriptionRo": "Compară preferința pentru T cu cea pentru F.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Base choices on objective logic.",
        "textRo": "Să îmi bazez alegerile pe logică obiectivă.",
        "explanation": "Favors T (+1).",
        "explanationRo": "Favorizează T (+1)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Base choices on personal values.",
        "textRo": "Să îmi bazez alegerile pe valorile mele personale.",
        "explanation": "Favors F (+1).",
        "explanationRo": "Favorizează F (+1)."
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
    "text": "When managing a long project, which style fits you best?",
    "textRo": "Când lucrezi la un proiect lung, ce stil ți se potrivește?",
    "description": "Compares J with P.",
    "descriptionRo": "Compară preferința pentru J cu cea pentru P.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Set a plan and follow it.",
        "textRo": "Să stabilesc un plan clar de la început și să-l respect.",
        "explanation": "Favors J (+1).",
        "explanationRo": "Favorizează J (+1)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Keep the plan flexible.",
        "textRo": "Să păstrez planul flexibil pentru a mă adapta pe parcurs.",
        "explanation": "Favors P (+1).",
        "explanationRo": "Favorizează P (+1)."
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
    "text": "Before committing to a path, which approach do you take?",
    "textRo": "Înainte de a lua o decizie definitivă, cum procedezi?",
    "description": "Compares P with J.",
    "descriptionRo": "Compară preferința pentru P cu cea pentru J.",
    "options": [
      {
        "id": "A",
        "pole": "P",
        "text": "Explore more options before committing.",
        "textRo": "Să explorez mai multe opțiuni înainte de a mă angaja.",
        "explanation": "Favors P (+1).",
        "explanationRo": "Favorizează P (+1)."
      },
      {
        "id": "B",
        "pole": "J",
        "text": "Decide with the information already available.",
        "textRo": "Să tranșez decizia cu informațiile deja disponibile.",
        "explanation": "Favors J (+1).",
        "explanationRo": "Favorizează J (+1)."
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
    "text": "How do you prefer your everyday lifestyle to feel?",
    "textRo": "Cum preferi să arate viața ta de zi cu zi?",
    "description": "Compares J with P.",
    "descriptionRo": "Compară preferința pentru J cu cea pentru P.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Have a structured daily routine.",
        "textRo": "Să am o rutină zilnică bine structurată.",
        "explanation": "Favors J (+1).",
        "explanationRo": "Favorizează J (+1)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Take each day as it comes.",
        "textRo": "Să iau fiecare zi așa cum vine, fără constrângeri.",
        "explanation": "Favors P (+1).",
        "explanationRo": "Favorizează P (+1)."
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
    "text": "When tackling a stagnation, which approach do you take?",
    "textRo": "Când un proiect stagnează, ce abordare alegi?",
    "description": "Compares Ne with Si.",
    "descriptionRo": "Compară preferința pentru Ne cu cea pentru Si.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Generate unconventional possibilities.",
        "textRo": "Să generez posibilități neconvenționale.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Improve a familiar approach.",
        "textRo": "Să perfecționez o abordare familiară și verificată.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
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
    "text": "When facing a challenging deadline, which do you trust?",
    "textRo": "Când ai un termen limită strâns, în ce ai mai multă încredere?",
    "description": "Compares Si with Ne.",
    "descriptionRo": "Compară preferința pentru Si cu cea pentru Ne.",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "Follow a method that worked before.",
        "textRo": "Să urmez o metodă care a funcționat cu succes anterior.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "Brainstorm many completely new solutions.",
        "textRo": "Să fac brainstorming pentru soluții complet noi.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
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
    "text": "When working on a solution, what drives you?",
    "textRo": "Când dezvolți o soluție, ce te motivează mai mult?",
    "description": "Compares Ne with Si.",
    "descriptionRo": "Compară preferința pentru Ne cu cea pentru Si.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Experiment with a different approach.",
        "textRo": "Să experimentez o abordare complet diferită.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Use a familiar method that has proven reliable.",
        "textRo": "Să folosesc o metodă familiară care s-a dovedit de încredere.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
      }
    ]
  },
  {
    "id": "W16",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Se",
    "text": "When observing a complex situation, what draws your focus?",
    "textRo": "Când observi o situație complexă, ce îți atrage atenția?",
    "description": "Compares Ni with Se.",
    "descriptionRo": "Compară preferința pentru Ni cu cea pentru Se.",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Search for the hidden pattern.",
        "textRo": "Să caut tiparul ascuns din spatele aparențelor.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Focus on what is happening right now.",
        "textRo": "Să mă concentrez pe ceea ce se întâmplă chiar acum.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
      }
    ]
  },
  {
    "id": "W17",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Ni",
    "text": "When events shift rapidly, how do you respond?",
    "textRo": "Când evenimentele se schimbă rapid, cum reacționezi?",
    "description": "Compares Se with Ni.",
    "descriptionRo": "Compară preferința pentru Se cu cea pentru Ni.",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "React to changing conditions in real time.",
        "textRo": "Să reacționez în timp real la condițiile în schimbare.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Interpret the long-term direction of events.",
        "textRo": "Să interpretez direcția pe termen lung a evenimentelor.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      }
    ]
  },
  {
    "id": "W18",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "opposite",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Se",
    "text": "When navigating an unpredictable journey, what guides you?",
    "textRo": "Când navighezi printr-o situație imprevizibilă, ce te ghidează?",
    "description": "Compares Ni with Se.",
    "descriptionRo": "Compară preferința pentru Ni cu cea pentru Se.",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Predict where events may lead.",
        "textRo": "Să prevăd încotro ar putea duce desfășurarea evenimentelor.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Respond to details as they unfold.",
        "textRo": "Să răspund la detalii pe măsură ce acestea apar.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
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
    "text": "When initiating a strategic venture, what is essential?",
    "textRo": "Când demarezi un proiect strategic, ce este esențial?",
    "description": "Compares Te with Fi.",
    "descriptionRo": "Compară preferința pentru Te cu cea pentru Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Build a practical plan with milestones.",
        "textRo": "Să construiesc un plan practic cu termene clare.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Ensure the decision reflects personal convictions.",
        "textRo": "Să mă asigur că decizia reflectă convingerile mele profunde.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
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
    "text": "When choosing between major life directions, how do you decide?",
    "textRo": "Când alegi o direcție majoră, pe ce te bazezi?",
    "description": "Compares Fi with Te.",
    "descriptionRo": "Compară preferința pentru Fi cu cea pentru Te.",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "Decide what feels authentic to you.",
        "textRo": "Să decid ceea ce se simte cu adevărat autentic pentru mine.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Decide using objective performance criteria.",
        "textRo": "Să decid folosind criterii obiective de eficiență.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
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
    "text": "When judging whether a project succeeded, what metric counts?",
    "textRo": "Când judeci succesul unui demers, ce criteriu are întâietate?",
    "description": "Compares Te with Fi.",
    "descriptionRo": "Compară preferința pentru Te cu cea pentru Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Choose the option with measurable results.",
        "textRo": "Să aleg opțiunea cu rezultate măsurabile și clare.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Choose the option that feels personally right.",
        "textRo": "Să aleg opțiunea care se simte corectă din punct de vedere etic.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
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
    "text": "When a team disagreement arises, what is your first impulse?",
    "textRo": "Când apare un dezacord într-o echipă, care este primul tău impuls?",
    "description": "Compares Ti with Fe.",
    "descriptionRo": "Compară preferința pentru Ti cu cea pentru Fe.",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Clarify the logic and definitions.",
        "textRo": "Să clarific logica și definițiile termenilor folosiți.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Restore shared understanding.",
        "textRo": "Să restabilesc buna înțelegere și armonia dintre oameni.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
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
    "text": "When offering critical feedback, how do you frame it?",
    "textRo": "Când oferi un feedback sensibil, cum îl formulezi?",
    "description": "Compares Fe with Ti.",
    "descriptionRo": "Compară preferința pentru Fe cu cea pentru Ti.",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Phrase feedback to preserve trust.",
        "textRo": "Să formulez feedback-ul pentru a proteja relația și încrederea.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "State the reasoning as precisely as possible.",
        "textRo": "Să expun raționamentul cât mai precis și obiectiv posibil.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
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
    "text": "In an intellectual debate, what is your primary focus?",
    "textRo": "Într-o dezbatere importantă, ce urmărești cu prioritate?",
    "description": "Compares Ti with Fe.",
    "descriptionRo": "Compară preferința pentru Ti cu cea pentru Fe.",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Identify exactly where an argument fails.",
        "textRo": "Să identific exact unde eșuează logica unui argument.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Help a group find common ground.",
        "textRo": "Să ajut grupul să găsească un numitor comun și consens.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
      }
    ]
  },
  {
    "id": "W25",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "When brainstorming the future, which feels more natural?",
    "textRo": "Când te gândești la viitor, ce ți se pare mai natural?",
    "description": "Compares Ne with Ni.",
    "descriptionRo": "Compară preferința pentru Ne cu cea pentru Ni.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Brainstorm endless alternatives.",
        "textRo": "Să explorez alternative și posibilități nesfârșite.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Synthesize one clear vision.",
        "textRo": "Să sintetizez totul într-o singură viziune clară.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      }
    ]
  },
  {
    "id": "W26",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ni",
    "oppositePole": "Ne",
    "text": "When anticipating what will happen, which do you do?",
    "textRo": "Când anticipezi cum vor evolua lucrurile, ce faci?",
    "description": "Compares Ni with Ne.",
    "descriptionRo": "Compară preferința pentru Ni cu cea pentru Ne.",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Anticipate the single most likely outcome.",
        "textRo": "Să anticipez deznodământul cel mai probabil.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "Explore multiple completely different futures.",
        "textRo": "Să explorez scenarii multiple și complet diferite.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
      }
    ]
  },
  {
    "id": "W27",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ne",
    "oppositePole": "Ni",
    "text": "When developing an idea, how do your thoughts move?",
    "textRo": "Când dezvolți o idee, în ce direcție tind gândurile tale să meargă?",
    "description": "Compares Ne with Ni.",
    "descriptionRo": "Compară preferința pentru Ne cu cea pentru Ni.",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Keep ideas branching outward continuously.",
        "textRo": "Să las ideile să se ramifice continuu spre noi piste.",
        "explanation": "Favors Ne (+1).",
        "explanationRo": "Favorizează Ne (+1)."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Pull concepts together into a central point.",
        "textRo": "Să adun conceptele spre un nucleu central unitar.",
        "explanation": "Favors Ni (+1).",
        "explanationRo": "Favorizează Ni (+1)."
      }
    ]
  },
  {
    "id": "W28",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "text": "When entering an unfamiliar environment, what do you rely on?",
    "textRo": "Când intri într-un mediu nefamiliar, pe ce te bazezi?",
    "description": "Compares Se with Si.",
    "descriptionRo": "Compară preferința pentru Se cu cea pentru Si.",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "React spontaneously to current events.",
        "textRo": "Să reacționez spontan la ceea ce se întâmplă pe moment.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Rely on a proven past routine.",
        "textRo": "Să mă bazez pe o rutină verificată din trecut.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
      }
    ]
  },
  {
    "id": "W29",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Si",
    "oppositePole": "Se",
    "text": "For relaxation and leisure, which sounds better?",
    "textRo": "Pentru relaxare și timp liber, ce preferi?",
    "description": "Compares Si with Se.",
    "descriptionRo": "Compară preferința pentru Si cu cea pentru Se.",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "Stick to comfortable, familiar sensations.",
        "textRo": "Să aleg senzații confortabile și familiare.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Seek out thrilling new physical experiences.",
        "textRo": "Să caut experiențe fizice noi și captivante.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
      }
    ]
  },
  {
    "id": "W30",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Se",
    "oppositePole": "Si",
    "text": "When a surprising crisis unfolds, what is your mindset?",
    "textRo": "Când apare o situație neașteptată, cum o gestionezi?",
    "description": "Compares Se with Si.",
    "descriptionRo": "Compară preferința pentru Se cu cea pentru Si.",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "Handle things as they happen right now.",
        "textRo": "Să rezolv lucrurile direct, pe măsură ce se întâmplă.",
        "explanation": "Favors Se (+1).",
        "explanationRo": "Favorizează Se (+1)."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Compare current events to what happened before.",
        "textRo": "Să compar evenimentele cu ce s-a întâmplat anterior.",
        "explanation": "Favors Si (+1).",
        "explanationRo": "Favorizează Si (+1)."
      }
    ]
  },
  {
    "id": "W31",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "text": "Under pressure to deliver, what is your priority?",
    "textRo": "Sub presiunea livrării unui rezultat, ce alegi?",
    "description": "Compares Te with Ti.",
    "descriptionRo": "Compară preferința pentru Te cu cea pentru Ti.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Execute a flawed plan that gets results.",
        "textRo": "Să execut un plan imperfect dar care aduce rezultate rapide.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Perfect the underlying logic before acting.",
        "textRo": "Să perfecționez logica de bază înainte de a trece la acțiune.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
      }
    ]
  },
  {
    "id": "W32",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Ti",
    "oppositePole": "Te",
    "text": "In problem solving, which role comes more naturally?",
    "textRo": "În rezolvarea problemelor, ce rol îți vine mai natural?",
    "description": "Compares Ti with Te.",
    "descriptionRo": "Compară preferința pentru Ti cu cea pentru Te.",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Analyze a system to find logical inconsistencies.",
        "textRo": "Să analizez un sistem pentru a găsi incoerențe logice.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Organize people to achieve a practical goal.",
        "textRo": "Să organizez oamenii pentru a atinge un obiectiv practic.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
      }
    ]
  },
  {
    "id": "W33",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Te",
    "oppositePole": "Ti",
    "text": "When evaluating a methodology, what matters more?",
    "textRo": "Când evaluezi o metodologie, ce are prioritate?",
    "description": "Compares Te with Ti.",
    "descriptionRo": "Compară preferința pentru Te cu cea pentru Ti.",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Focus on measurable metrics and efficiency.",
        "textRo": "Să mă concentrez pe indicatori măsurabili și eficiență.",
        "explanation": "Favors Te (+1).",
        "explanationRo": "Favorizează Te (+1)."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Focus on precise definitions and pure understanding.",
        "textRo": "Să mă concentrez pe definiții precise și înțelegere de fond.",
        "explanation": "Favors Ti (+1).",
        "explanationRo": "Favorizează Ti (+1)."
      }
    ]
  },
  {
    "id": "W34",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "In group deliberations, which is your priority?",
    "textRo": "Într-o deliberare de grup, ce consideri mai important?",
    "description": "Compares Fe with Fi.",
    "descriptionRo": "Compară preferința pentru Fe cu cea pentru Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Ensure everyone in the group feels included.",
        "textRo": "Să mă asigur că toată lumea din grup se simte inclusă.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Ensure your decision aligns with your deep morals.",
        "textRo": "Să mă asigur că decizia se aliniază cu morala mea profundă.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
      }
    ]
  },
  {
    "id": "W35",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fi",
    "oppositePole": "Fe",
    "text": "In social situations, how do you express yourself?",
    "textRo": "În situații sociale, cum alegi să te exprimi?",
    "description": "Compares Fi with Fe.",
    "descriptionRo": "Compară preferința pentru Fi cu cea pentru Fe.",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "Express exactly what you authentically feel inside.",
        "textRo": "Să exprim exact ceea ce simt în mod autentic în interior.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Adapt your expression to fit the social vibe.",
        "textRo": "Să îmi adaptez exprimarea la atmosfera și tonul grupului.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
      }
    ]
  },
  {
    "id": "W36",
    "format": "wouldYouRather",
    "category": "function",
    "subcategory": "same_type",
    "dimension": null,
    "target": "Fe",
    "oppositePole": "Fi",
    "text": "When values clash, which guiding principle wins?",
    "textRo": "Când valorile intră în conflict, ce principiu călăuzitor primează?",
    "description": "Compares Fe with Fi.",
    "descriptionRo": "Compară preferința pentru Fe cu cea pentru Fi.",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Prioritize collective harmony and shared values.",
        "textRo": "Să prioritizez armonia colectivă și valorile comune.",
        "explanation": "Favors Fe (+1).",
        "explanationRo": "Favorizează Fe (+1)."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Prioritize individual, personal convictions.",
        "textRo": "Să prioritizez convingerile individuale și personale.",
        "explanation": "Favors Fi (+1).",
        "explanationRo": "Favorizează Fi (+1)."
      }
    ]
  },
  {
    "id": "F01",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct_final",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "text": "Do you consider yourself more:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Direct self-assessment for the EI axis.",
    "descriptionRo": "Autoevaluare directă pentru axa EI.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Introvert",
        "textRo": "Introvert",
        "explanation": "Direct selection: I (+1).",
        "explanationRo": "Alegere directă: I (+1)."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Extrovert",
        "textRo": "Extrovert",
        "explanation": "Direct selection: E (+1).",
        "explanationRo": "Alegere directă: E (+1)."
      }
    ]
  },
  {
    "id": "F02",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct_final",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "text": "Do you consider yourself more:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Direct self-assessment for the NS axis.",
    "descriptionRo": "Autoevaluare directă pentru axa NS.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Intuitive / Analytical (I focus on the big picture and abstract concepts)",
        "textRo": "Intuitiv / Analitic (Mă concentrez pe imaginea de ansamblu și abstract)",
        "explanation": "Direct selection: N (+1).",
        "explanationRo": "Alegere directă: N (+1)."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Sensing / Observant (I focus on concrete details and present realities)",
        "textRo": "Senzorial / Observator (Mă concentrez pe detalii concrete și prezent)",
        "explanation": "Direct selection: S (+1).",
        "explanationRo": "Alegere directă: S (+1)."
      }
    ]
  },
  {
    "id": "F03",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct_final",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "text": "Do you consider yourself more:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Direct self-assessment for the TF axis.",
    "descriptionRo": "Autoevaluare directă pentru axa TF.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Logical / Rational (I make decisions based on objectivity)",
        "textRo": "Logic / Rațional (Iau decizii bazate pe obiectivitate)",
        "explanation": "Direct selection: T (+1).",
        "explanationRo": "Alegere directă: T (+1)."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Feeling / Empathetic (I make decisions based on values and human impact)",
        "textRo": "Sentimental / Empatic (Iau decizii bazate pe valori și impactul asupra oamenilor)",
        "explanation": "Direct selection: F (+1).",
        "explanationRo": "Alegere directă: F (+1)."
      }
    ]
  },
  {
    "id": "F04",
    "format": "direct",
    "category": "axis",
    "subcategory": "direct_final",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "text": "Do you consider yourself more:",
    "textRo": "Te consideri mai degrabă:",
    "description": "Direct self-assessment for the JP axis.",
    "descriptionRo": "Autoevaluare directă pentru axa JP.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Organized / Structured",
        "textRo": "Organizat / Structurat",
        "explanation": "Direct selection: J (+1).",
        "explanationRo": "Alegere directă: J (+1)."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Spontaneous / Flexible",
        "textRo": "Spontan / Flexibil",
        "explanation": "Direct selection: P (+1).",
        "explanationRo": "Alegere directă: P (+1)."
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

export function getQuestionsForMode(modeKey = "standard", shouldShuffle = false) {
  const normalizedKey = (modeKey === "quick" || modeKey === "fast") ? "rapid" : ((modeKey === "recommended") ? "standard" : modeKey);
  const mode = TEST_MODES[normalizedKey] || TEST_MODES.standard;

  let questions = [];
  if (mode.totalQuestions === 24) {
    // Fast: All 24 Deep questions (8 axis + 16 function items)
    // Sorted by target: I, E, N, S, T, F, J, P, Ne, Ni, Se, Si, Te, Ti, Fe, Fi
    const deepQuestions = QUESTIONS_100.filter(q => q.format === "deep");
    questions = shouldShuffle ? shuffle(deepQuestions) : sortQuestionsByTarget(deepQuestions);
  } else if (mode.totalQuestions === 60) {
    // Standard: 20 axis items + 40 function items (60 total)
    // Flow:
    // 1. Deep (24): 8 axis + 16 function
    // 2. Short (16): 4 axis + 12 function
    // 3. Would You Rather (16): 4 axis + 12 function
    // 4. Direct Final (4): 4 axis (F01-F04)
    // Each phase sorted by target: I, E, N, S, T, F, J, P, Ne, Ni, Se, Si, Te, Ti, Fe, Fi
    const deepQuestions = QUESTIONS_100.filter(q => q.format === "deep"); // 24
    const deepPhase = shouldShuffle ? shuffle(deepQuestions) : sortQuestionsByTarget(deepQuestions);

    const shortAxisIds = ["S01", "S04", "S07", "S10"]; // 4 (EI, NS, TF, JP)
    const shortFuncIds = ["S13", "S14", "S16", "S17", "S19", "S20", "S22", "S23", "S25", "S28", "S31", "S34"]; // 12
    const shortItems = [...shortAxisIds, ...shortFuncIds].map(id => QUESTIONS_100.find(q => q.id === id));
    const shortPhase = shouldShuffle ? shuffle(shortItems) : sortQuestionsByTarget(shortItems);

    const wyrAxisIds = ["W01", "W04", "W07", "W10"]; // 4 (EI, NS, TF, JP)
    const wyrFuncIds = ["W13", "W14", "W16", "W17", "W19", "W20", "W22", "W23", "W26", "W29", "W32", "W35"]; // 12
    const wyrItems = [...wyrAxisIds, ...wyrFuncIds].map(id => QUESTIONS_100.find(q => q.id === id));
    const wyrPhase = shouldShuffle ? shuffle(wyrItems) : sortQuestionsByTarget(wyrItems);

    const directFinalItems = QUESTIONS_100.filter(q => q.format === "direct"); // 4 (F01-F04)
    const directFinalPhase = shouldShuffle ? shuffle(directFinalItems) : sortQuestionsByTarget(directFinalItems);

    questions = [...deepPhase, ...shortPhase, ...wyrPhase, ...directFinalPhase];
  } else {
    // Complete: All 100 questions
    // Flow:
    // 1. Deep (24 questions)
    // 2. Short (36 questions)
    // 3. Would You Rather (36 questions)
    // 4. Direct Final (4 questions: F01-F04)
    // Each phase sorted by target: I, E, N, S, T, F, J, P, Ne, Ni, Se, Si, Te, Ti, Fe, Fi
    const deepPhase = QUESTIONS_100.filter(q => q.format === "deep"); // 24
    const shortPhase = QUESTIONS_100.filter(q => q.format === "short"); // 36
    const wyrPhase = QUESTIONS_100.filter(q => q.format === "wouldYouRather"); // 36
    const directFinalPhase = QUESTIONS_100.filter(q => q.format === "direct"); // 4

    const deepOrdered = shouldShuffle ? shuffle(deepPhase) : sortQuestionsByTarget(deepPhase);
    const shortOrdered = shouldShuffle ? shuffle(shortPhase) : sortQuestionsByTarget(shortPhase);
    const wyrOrdered = shouldShuffle ? shuffle(wyrPhase) : sortQuestionsByTarget(wyrPhase);
    const directOrdered = shouldShuffle ? shuffle(directFinalPhase) : sortQuestionsByTarget(directFinalPhase);

    questions = [...deepOrdered, ...shortOrdered, ...wyrOrdered, ...directOrdered];
  }

  return questions;
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
