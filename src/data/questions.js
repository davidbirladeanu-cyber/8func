/**
 * 8Func - Comprehensive Data-Driven Question Bank (100 Questions)
 * Formats: Deep (24), Would You Rather (24), Short (52)
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
    description: "Complete assessment of all 100 items featuring full axis calibration, deep cognitive function resolution, and paired Would You Rather dilemmas.",
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
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "text": "Talking through an important idea often helps me discover what I actually think.",
    "textRo": "Discutarea unei idei importante mă ajută adesea să descopăr ceea ce gândesc cu adevărat.",
    "description": "Measures external processing of thoughts through interaction.",
    "descriptionRo": "Măsoară procesarea externă a gândurilor prin dialog și interacțiune.",
    "agreementExplanation": "Agreement favors E: developing and clarifying thoughts through verbal exchange.",
    "agreementExplanationRo": "Acordul favorizează E: clarificarea și formularea gândurilor prin schimb verbal cu ceilalți.",
    "disagreementExplanation": "Disagreement shifts contribution toward I: preference for private reflection before sharing.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre I: preferință pentru reflecție individuală înainte de comunicare.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D02",
    "format": "deep",
    "category": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "agreementPole": "I",
    "text": "I need quiet time to understand my thoughts before sharing them.",
    "textRo": "Am nevoie de timp în liniște pentru a-mi înțelege gândurile înainte de a le împărtăși.",
    "description": "Measures private processing before external communication.",
    "descriptionRo": "Măsoară procesarea internă și reflecția privată înainte de expunere.",
    "agreementExplanation": "Agreement favors I: relying on internal reflection to consolidate thoughts.",
    "agreementExplanationRo": "Acordul favorizează I: nevoia de liniște pentru a-și clarifica gândurile.",
    "disagreementExplanation": "Disagreement shifts contribution toward E: comfortable developing ideas interactively.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre E: ușurință în a gândi și formula idei în timp ce vorbește.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D03",
    "format": "deep",
    "category": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I am more interested in what information could mean than its immediate practical details.",
    "textRo": "Mă interesează mai mult ce ar putea însemna informația decât detaliile ei imediat practice.",
    "description": "Measures focus on abstract possibilities and broader implications.",
    "descriptionRo": "Măsoară interesul pentru semnificații conceptuale, implicații și potențial.",
    "agreementExplanation": "Agreement favors N: prioritizing potential, conceptual connections, and meaning.",
    "agreementExplanationRo": "Acordul favorizează N: atenție acordată implicațiilor viitoare și tiparelor abstracte.",
    "disagreementExplanation": "Disagreement shifts contribution toward S: prioritizing concrete, directly useful facts.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre S: atenție acordată faptelor concrete și utilității imediate.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D04",
    "format": "deep",
    "category": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "text": "Direct evidence matters more to me than an appealing theory.",
    "textRo": "Dovezile directe contează mai mult pentru mine decât o teorie atrăgătoare.",
    "description": "Measures reliance on verifiable sensory evidence over speculative concepts.",
    "descriptionRo": "Măsoară ancorarea în date tangibile și verificabile în fața teoriilor speculative.",
    "agreementExplanation": "Agreement favors S: valuing observable, empirical evidence and concrete reality.",
    "agreementExplanationRo": "Acordul favorizează S: valorizarea dovezilor empirice și a certitudinilor practice.",
    "disagreementExplanation": "Disagreement shifts contribution toward N: willingness to explore theoretical possibilities.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre N: deschidere către modele teoretice și explorare ipotetică.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D05",
    "format": "deep",
    "category": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "Consistent reasoning matters more to me than keeping everyone pleased.",
    "textRo": "Raționamentul consecvent contează mai mult pentru mine decât a-i menține pe toți mulțumiți.",
    "description": "Measures adherence to objective logic over interpersonal consensus.",
    "descriptionRo": "Măsoară prioritatea acordată logicii consecvente în detrimentul confortului social.",
    "agreementExplanation": "Agreement favors T: objective principles and impartial consistency take precedence.",
    "agreementExplanationRo": "Acordul favorizează T: deciziile se bazează pe principii logice imparțiale.",
    "disagreementExplanation": "Disagreement shifts contribution toward F: prioritizing human impact and harmony.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre F: acordă atenție impactului emoțional și armoniei umane.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D06",
    "format": "deep",
    "category": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "text": "A decision's effect on people matters as much as its logical soundness.",
    "textRo": "Efectul unei decizii asupra oamenilor contează la fel de mult ca validitatea ei logică.",
    "description": "Measures integration of human values and empathetic impact in evaluation.",
    "descriptionRo": "Măsoară integrarea valorilor umane și a empatiei în procesul de luare a deciziilor.",
    "agreementExplanation": "Agreement favors F: personal and relational impact is central to decision quality.",
    "agreementExplanationRo": "Acordul favorizează F: consecințele umane și valorile personale sunt fundamentale.",
    "disagreementExplanation": "Disagreement shifts contribution toward T: prioritizing detached logical evaluation.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre T: prioritate acordată criteriilor logice impersonale.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D07",
    "format": "deep",
    "category": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "I feel more comfortable when decisions are settled and next steps are clear.",
    "textRo": "Mă simt mai confortabil când deciziile sunt stabilite și pașii următori sunt clari.",
    "description": "Measures preference for closure, structure, and definite direction.",
    "descriptionRo": "Măsoară preferința pentru certitudine, claritate și planificare predictibilă.",
    "agreementExplanation": "Agreement favors J: comfort with defined structure, deadlines, and closure.",
    "agreementExplanationRo": "Acordul favorizează J: stabilitatea dată de planuri ferme și rezolvare timpurie.",
    "disagreementExplanation": "Disagreement shifts contribution toward P: comfort with ambiguity and evolving plans.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre P: confort cu flexibilitatea și opțiunile deschise.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D08",
    "format": "deep",
    "category": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "text": "I prefer keeping options open until I have explored alternatives.",
    "textRo": "Prefer să păstrez opțiunile deschise până când explorez alternativele.",
    "description": "Measures preference for flexibility and ongoing exploration before deciding.",
    "descriptionRo": "Măsoară orientarea spre adaptare continuă și explorarea opțiunilor disponibile.",
    "agreementExplanation": "Agreement favors P: reserving commitment to allow emerging opportunities.",
    "agreementExplanationRo": "Acordul favorizează P: dorința de adaptabilitate și explorare înainte de decizie.",
    "disagreementExplanation": "Disagreement shifts contribution toward J: preference for early commitment and order.",
    "disagreementExplanationRo": "Dezacordul orientează scorul spre J: preferință pentru decizii luate din timp și organizare.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D09",
    "format": "deep",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "One idea often opens several unrelated possibilities worth exploring.",
    "textRo": "O singură idee deschide adesea mai multe posibilități fără legătură aparentă care merită explorate.",
    "description": "Measures divergent ideation and exploring branching possibilities.",
    "descriptionRo": "Măsoară generarea divergentă de idei și explorarea posibilităților conexe.",
    "agreementExplanation": "Agreement favors Ne: cognitive drive to explore diverse conceptual branches.",
    "agreementExplanationRo": "Acordul favorizează Ne: tendința de a genera căi și alternative multiple dintr-un stimul.",
    "disagreementExplanation": "Disagreement shifts contribution toward Si: preference for familiar, established reference points.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Si: ancorare în experiențe și metode verificate.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D10",
    "format": "deep",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "I enjoy finding unexpected connections between subjects that seem unrelated.",
    "textRo": "Îmi place să găsesc conexiuni neașteptate între subiecte care par fără legătură.",
    "description": "Measures associative exploration and cross-domain pattern finding.",
    "descriptionRo": "Măsoară gândirea asociativă și corelarea conceptelor din domenii diferite.",
    "agreementExplanation": "Agreement favors Ne: discovering novel conceptual links across domains.",
    "agreementExplanationRo": "Acordul favorizează Ne: identificarea intuitivă a punților între subiecte diferite.",
    "disagreementExplanation": "Disagreement shifts contribution toward Si: keeping domains grounded in their standard contexts.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Si: atenție la contextul clar și faptele directe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D11",
    "format": "deep",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "Different details often come together into one underlying explanation.",
    "textRo": "Detalii diferite se unesc adesea într-o singură explicație profundă de ansamblu.",
    "description": "Measures convergent synthesis into a single root principle or vision.",
    "descriptionRo": "Măsoară sinteza convergentă a diverselor date într-o viziune unificatoare.",
    "agreementExplanation": "Agreement favors Ni: synthesizing disparate observations into a coherent essence.",
    "agreementExplanationRo": "Acordul favorizează Ni: căutarea tiparului central care explică întregul fenomen.",
    "disagreementExplanation": "Disagreement shifts contribution toward Se: valuing details as independent, immediate experiences.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Se: aprecierea detaliilor pentru realitatea lor palpabilă imediată.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D12",
    "format": "deep",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I often sense where a situation is heading before I can fully explain why.",
    "textRo": "Simt adesea încotro se îndreaptă o situație înainte de a putea explica pe deplin de ce.",
    "description": "Measures intuitive foresight and anticipating the trajectory of events.",
    "descriptionRo": "Măsoară presimțirea direcției pe termen lung a unei evoluții.",
    "agreementExplanation": "Agreement favors Ni: intuitive perception of trajectory and outcome.",
    "agreementExplanationRo": "Acordul favorizează Ni: anticipare integrată a direcției viitoare a evenimentelor.",
    "disagreementExplanation": "Disagreement shifts contribution toward Se: focusing on real-time present facts rather than predictions.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Se: focalizare pe acțiunea directă în momentul prezent.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D13",
    "format": "deep",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "When a project stalls, I look for practical steps that restore progress.",
    "textRo": "Când un proiect se blochează, caut pași practici care să restabilească progresul.",
    "description": "Measures goal execution and organizing external systems for measurable output.",
    "descriptionRo": "Măsoară pragmatismul executiv și mobilizarea resurselor pentru rezultate.",
    "agreementExplanation": "Agreement favors Te: pragmatic troubleshooting to achieve functional results.",
    "agreementExplanationRo": "Acordul favorizează Te: deblocarea situațiilor prin organizare și acțiune sistematică.",
    "disagreementExplanation": "Disagreement shifts contribution toward Fi: prioritizing value alignment over sheer expediency.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Fi: prioritate acordată alinierii morale și autenticității.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D14",
    "format": "deep",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "Clear goals and measurable progress help me judge whether a method works.",
    "textRo": "Obiectivele clare și progresul măsurabil mă ajută să judec dacă o metodă funcționează.",
    "description": "Measures reliance on external benchmarks and objective success metrics.",
    "descriptionRo": "Măsoară evaluarea eficienței prin indicatori măsurabili de succes.",
    "agreementExplanation": "Agreement favors Te: using concrete criteria and efficiency to determine success.",
    "agreementExplanationRo": "Acordul favorizează Te: criterii empirice și obiective de performanță.",
    "disagreementExplanation": "Disagreement shifts contribution toward Fi: evaluating success through personal resonance.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Fi: evaluarea rezultatelor prin satisfacție interioară.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D15",
    "format": "deep",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "An explanation bothers me when its parts do not fit together logically.",
    "textRo": "O explicație mă deranjează atunci când părțile ei nu se potrivesc logic între ele.",
    "description": "Measures scrutiny for internal consistency and deductive structural integrity.",
    "descriptionRo": "Măsoară sensibilitatea la contradicții interne și coerență logică.",
    "agreementExplanation": "Agreement favors Ti: demanding precise logical coherence within conceptual frameworks.",
    "agreementExplanationRo": "Acordul favorizează Ti: analiză deductivă strictă și eliminarea incoerențelor.",
    "disagreementExplanation": "Disagreement shifts contribution toward Fe: prioritizing contextual harmony and practical utility.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Fe: prioritate acordată bunei înțelegeri și utilității practice.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D16",
    "format": "deep",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I want to understand exactly how something works before accepting an explanation.",
    "textRo": "Vreau să înțeleg exact cum funcționează un lucru înainte de a accepta o explicație.",
    "description": "Measures deep conceptual deconstruction and precise mechanical understanding.",
    "descriptionRo": "Măsoară nevoia de înțelegere mecanică și principială riguroasă.",
    "agreementExplanation": "Agreement favors Ti: deep architectural understanding of principles and mechanisms.",
    "agreementExplanationRo": "Acordul favorizează Ti: dorința de a stăpâni mecanismele fundamentale pas cu pas.",
    "disagreementExplanation": "Disagreement shifts contribution toward Fe: accepting shared conventions without full deconstruction.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Fe: acceptarea consensului funcțional în grup.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D17",
    "format": "deep",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I notice shifts in group atmosphere even when nobody names them.",
    "textRo": "Observ schimbările din atmosfera grupului chiar și când nimeni nu le numește direct.",
    "description": "Measures sensitivity to collective emotional dynamics and unspoken group tone.",
    "descriptionRo": "Măsoară percepția empatică a stării de spirit colective și a climatului relațional.",
    "agreementExplanation": "Agreement favors Fe: acute awareness of group harmony and emotional subtext.",
    "agreementExplanationRo": "Acordul favorizează Fe: receptivitate la dinamica afectivă și climatul social.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ti: evaluating situations purely on explicit facts and arguments.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ti: focalizare pe substanța logică, independent de atmosferă.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D18",
    "format": "deep",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I consider how a decision may affect trust and cooperation within a group.",
    "textRo": "Iau în considerare modul în care o decizie poate influența încrederea și cooperarea dintr-un grup.",
    "description": "Measures relational foresight and preserving collective trust.",
    "descriptionRo": "Măsoară responsabilitatea față de coeziunea grupului și cooperarea reciprocă.",
    "agreementExplanation": "Agreement favors Fe: actively safeguarding social capital and group morale.",
    "agreementExplanationRo": "Acordul favorizează Fe: construirea consensului și protejarea cooperării pe termen lung.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ti: prioritizing correctness of reasoning over consensus.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ti: decizii bazate pe adevăr tehnic, chiar incomod.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D19",
    "format": "deep",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I struggle to support a choice that conflicts with my deepest values.",
    "textRo": "Îmi este greu să susțin o alegere care intră în conflict cu valorile mele cele mai profunde.",
    "description": "Measures internal moral integrity and resistance to compromising personal ethics.",
    "descriptionRo": "Măsoară fidelitatea de neclintit față de busola etică interioară.",
    "agreementExplanation": "Agreement favors Fi: refusal to compromise authentic individual principles.",
    "agreementExplanationRo": "Acordul favorizează Fi: integritate morală independentă de presiunea exterioară.",
    "disagreementExplanation": "Disagreement shifts contribution toward Te: willingness to adapt to pragmatic situational needs.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Te: disponibilitate de a prioritiza succesul practic.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D20",
    "format": "deep",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "Understanding what genuinely matters to me helps me make difficult decisions.",
    "textRo": "Înțelegerea a ceea ce contează cu adevărat pentru mine mă ajută să iau decizii dificile.",
    "description": "Measures self-attunement to personal significance and authentic conviction.",
    "descriptionRo": "Măsoară ancorarea deciziilor în claritatea valorilor personale autentice.",
    "agreementExplanation": "Agreement favors Fi: anchoring major choices in nuanced personal values.",
    "agreementExplanationRo": "Acordul favorizează Fi: claritate lăuntrică despre ceea ce are valoare autentică.",
    "disagreementExplanation": "Disagreement shifts contribution toward Te: relying on external benchmarks and utility.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Te: orientare după metrici obiective de utilitate.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D21",
    "format": "deep",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I prefer responding directly to what is happening rather than predicting it at length.",
    "textRo": "Prefer să răspund direct la ceea ce se întâmplă acum în loc să fac predicții îndelungate.",
    "description": "Measures real-time immersion and sensory adaptability in the immediate moment.",
    "descriptionRo": "Măsoară trăirea directă în prezent și reacția spontană la realitatea din jur.",
    "agreementExplanation": "Agreement favors Se: spontaneous sensory engagement with what is currently real.",
    "agreementExplanationRo": "Acordul favorizează Se: implicare vie și adaptabilă în dinamica clipei prezente.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ni: preference for strategic anticipation and trajectory.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ni: preferință pentru proiecție strategică și viziune.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D22",
    "format": "deep",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I notice changes and opportunities in my immediate surroundings quickly.",
    "textRo": "Observ rapid schimbările și oportunitățile apărute în mediul meu imediat.",
    "description": "Measures high physical acuity and quick reflexes to immediate sensory shifts.",
    "descriptionRo": "Măsoară acuitatea perceptivă imediată față de stimulii și mediul din jur.",
    "agreementExplanation": "Agreement favors Se: rapid scanning of tangible physical opportunities.",
    "agreementExplanationRo": "Acordul favorizează Se: agilitate în captarea oportunităților practice din mediu.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ni: focus on internal meanings rather than external cues.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ni: focalizare pe semnificații interioare abstracte.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D23",
    "format": "deep",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "Past experiences help me recognize what is familiar or unusual now.",
    "textRo": "Experiențele din trecut mă ajută să recunosc ce este familiar sau neobișnuit în prezent.",
    "description": "Measures internal sensory memory and benchmarking present data against precedent.",
    "descriptionRo": "Măsoară compararea experienței curente cu arhiva memoriei și a precedentelor.",
    "agreementExplanation": "Agreement favors Si: strong comparative reliance on accumulated past reality.",
    "agreementExplanationRo": "Acordul favorizează Si: utilizarea metodică a precedentelor pentru evaluarea noului.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ne: treating situations as novel possibilities.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ne: abordarea situațiilor ca posibilități noi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "D24",
    "format": "deep",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "Before replacing a familiar method, I want to understand why it works.",
    "textRo": "Înainte de a înlocui o metodă familiară, vreau să înțeleg de ce funcționează.",
    "description": "Measures procedural conservation and respecting proven historical effectiveness.",
    "descriptionRo": "Măsoară prudența procedurală și respectul pentru practicile deja probate.",
    "agreementExplanation": "Agreement favors Si: ensuring stability and continuity before entertaining change.",
    "agreementExplanationRo": "Acordul favorizează Si: prezervarea rutinelor testate și a continuității sigure.",
    "disagreementExplanation": "Disagreement shifts contribution toward Ne: eagerness to innovate without precedent.",
    "disagreementExplanationRo": "Dezacordul orientează contribuția spre Ne: entuziasm pentru inovație fără constrângeri din trecut.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "W01",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "EI",
    "target": "E",
    "text": "When exploring a new idea, which do you naturally prefer?",
    "textRo": "Când explorezi o idee nouă, ce preferi în mod natural?",
    "description": "Compares external social ideation with private reflective processing.",
    "descriptionRo": "Compară explorarea ideilor prin dialog social cu reflecția privată.",
    "options": [
      {
        "id": "A",
        "pole": "E",
        "text": "Talk through a new idea with a group.",
        "textRo": "Să discut ideea într-un grup pentru a o clarifica.",
        "explanation": "Favors E: develops thoughts through social exchange and outward momentum.",
        "explanationRo": "Favorizează E: dezvoltă gândurile prin schimb social și interacțiune externă."
      },
      {
        "id": "B",
        "pole": "I",
        "text": "Think it through privately first.",
        "textRo": "Să o gândesc mai întâi în liniște, pe cont propriu.",
        "explanation": "Favors I: prefers consolidating ideas in personal contemplation first.",
        "explanationRo": "Favorizează I: preferă consolidarea ideilor în contemplare privată înainte de partajare."
      }
    ]
  },
  {
    "id": "W02",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "EI",
    "target": "I",
    "text": "To recharge after a demanding week, which do you prefer?",
    "textRo": "Pentru a-ți reîncărca bateriile după o săptămână plină, ce ai alege?",
    "description": "Compares solitary restoration with energizing social engagement.",
    "descriptionRo": "Compară refacerea energiei prin solitudine cu stimularea socială activă.",
    "options": [
      {
        "id": "A",
        "pole": "I",
        "text": "Spend a quiet evening alone.",
        "textRo": "Să petrec o seară liniștită de unul singur.",
        "explanation": "Favors I: solitude and low sensory stimulation restore vital energy.",
        "explanationRo": "Favorizează I: solitudinea și reducerea stimulilor externi refac energia vitală."
      },
      {
        "id": "B",
        "pole": "E",
        "text": "Join friends for an energetic evening.",
        "textRo": "Să ies cu prietenii pentru o seară energică.",
        "explanation": "Favors E: active social engagement and dynamic company boost energy.",
        "explanationRo": "Favorizează E: interacțiunea socială vie și anturajul dinamic oferă energie proaspătă."
      }
    ]
  },
  {
    "id": "W03",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "NS",
    "target": "N",
    "text": "When encountering a new discovery, which interests you more?",
    "textRo": "Când descoperi ceva nou, ce te captivează mai mult?",
    "description": "Compares investigating conceptual implications with studying concrete evidence.",
    "descriptionRo": "Compară explorarea implicațiilor viitoare cu examinarea datelor concrete.",
    "options": [
      {
        "id": "A",
        "pole": "N",
        "text": "Explore what a discovery might imply.",
        "textRo": "Să explorez ce ar putea implica această descoperire pe viitor.",
        "explanation": "Favors N: conceptual curiosity about future possibilities and implications.",
        "explanationRo": "Favorizează N: curiozitate conceptuală față de posibilitățile și implicațiile de perspectivă."
      },
      {
        "id": "B",
        "pole": "S",
        "text": "Study exactly what the evidence shows.",
        "textRo": "Să studiez exact ce arată dovezile concrete și datele prezente.",
        "explanation": "Favors S: focus on verifiable facts, empirical evidence, and exact details.",
        "explanationRo": "Favorizează S: concentrare pe date verificabile, dovezi empirice și detalii exacte."
      }
    ]
  },
  {
    "id": "W04",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "NS",
    "target": "S",
    "text": "When learning something unfamiliar, which approach do you prefer?",
    "textRo": "Când înveți ceva nou, care abordare ți se potrivește mai bine?",
    "description": "Compares hands-on empirical demonstration with theoretical modeling.",
    "descriptionRo": "Compară învățarea practică pe exemple reale cu înțelegerea teoriei prealabile.",
    "options": [
      {
        "id": "A",
        "pole": "S",
        "text": "Learn by handling a real example.",
        "textRo": "Să învăț exersând direct pe un exemplu real și palpabil.",
        "explanation": "Favors S: hands-on tactile practice provides immediate concrete mastery.",
        "explanationRo": "Favorizează S: practica aplicată și experiența directă asigură stăpânirea concretă."
      },
      {
        "id": "B",
        "pole": "N",
        "text": "Explore the theory behind it first.",
        "textRo": "Să explorez mai întâi teoria și principiile din spatele său.",
        "explanation": "Favors N: conceptual understanding of underlying models before practical steps.",
        "explanationRo": "Favorizează N: înțelegerea conceptuală a modelului teoretic înainte de aplicare."
      }
    ]
  },
  {
    "id": "W05",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "TF",
    "target": "T",
    "text": "When establishing a standard procedure, what is your priority?",
    "textRo": "Când stabilești o procedură sau o regulă, ce este prioritar?",
    "description": "Compares universal consistency with contextual individual empathy.",
    "descriptionRo": "Compară consecvența logică universală cu adaptarea la circumstanțe individuale.",
    "options": [
      {
        "id": "A",
        "pole": "T",
        "text": "Choose the most consistent rule.",
        "textRo": "Să aleg regula cea mai consecventă și imparțială.",
        "explanation": "Favors T: prioritizes objective logic, fair impartiality, and consistent criteria.",
        "explanationRo": "Favorizează T: prioritizează imparțialitatea, consecvența logică și criteriile clare."
      },
      {
        "id": "B",
        "pole": "F",
        "text": "Consider individual circumstances.",
        "textRo": "Să țin cont de circumstanțele și nevoile fiecărei persoane.",
        "explanation": "Favors F: prioritizes empathetic context, human nuance, and compassion.",
        "explanationRo": "Favorizează F: prioritizează contextul uman, compasiunea și nuanțele personale."
      }
    ]
  },
  {
    "id": "W06",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "TF",
    "target": "F",
    "text": "When evaluating an important proposal, which do you examine first?",
    "textRo": "Când evaluezi o propunere importantă, ce examinezi mai întâi?",
    "description": "Compares human impact with analytical logical rigor.",
    "descriptionRo": "Compară impactul asupra oamenilor cu rigoarea raționamentului logic.",
    "options": [
      {
        "id": "A",
        "pole": "F",
        "text": "Consider how a decision affects people.",
        "textRo": "Să analizez cum va influența decizia starea și viața oamenilor.",
        "explanation": "Favors F: focuses on emotional well-being, personal values, and relational impact.",
        "explanationRo": "Favorizează F: atenție prioritară la bunăstarea emoțională și valorile celor implicați."
      },
      {
        "id": "B",
        "pole": "T",
        "text": "Check whether the reasoning is consistent.",
        "textRo": "Să verific dacă argumentele și logica internă sunt impecabile.",
        "explanation": "Favors T: focuses on logical validity, premise integrity, and structural soundness.",
        "explanationRo": "Favorizează T: atenție prioritară la validitatea logică și lipsa fisurilor în raționament."
      }
    ]
  },
  {
    "id": "W07",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "JP",
    "target": "J",
    "text": "When starting an important project, which style fits you better?",
    "textRo": "Când începi un proiect important, care stil ți se potrivește mai bine?",
    "description": "Compares structured planned execution with open-ended adaptability.",
    "descriptionRo": "Compară execuția după un plan stabilit cu flexibilitatea deschisă pe parcurs.",
    "options": [
      {
        "id": "A",
        "pole": "J",
        "text": "Set a plan and follow it.",
        "textRo": "Să stabilesc un plan clar de la început și să-l respect.",
        "explanation": "Favors J: structured execution, clear milestones, and systematic discipline.",
        "explanationRo": "Favorizează J: execuție structurată, etape clare și disciplină metodică."
      },
      {
        "id": "B",
        "pole": "P",
        "text": "Keep the plan flexible.",
        "textRo": "Să păstrez planul flexibil pentru a mă adapta pe măsură ce avansez.",
        "explanation": "Favors P: adaptable maneuvering, spontaneous adjustments, and responsive flow.",
        "explanationRo": "Favorizează P: adaptabilitate fluidă, ajustări spontane și libertate de acțiune."
      }
    ]
  },
  {
    "id": "W08",
    "format": "wouldYouRather",
    "category": "axis",
    "dimension": "JP",
    "target": "P",
    "text": "When making a final choice, what is your preferred timing?",
    "textRo": "Când trebuie să iei o decizie finală, care este ritmul tău preferat?",
    "description": "Compares exploratory delay with decisive closure.",
    "descriptionRo": "Compară explorarea alternativelor suplimentare cu luarea promptă a deciziei.",
    "options": [
      {
        "id": "A",
        "pole": "P",
        "text": "Explore more options before committing.",
        "textRo": "Să explorez mai multe opțiuni înainte de a mă angaja definitiv.",
        "explanation": "Favors P: keeps possibility horizons open to capture superior options.",
        "explanationRo": "Favorizează P: menține opțiunile deschise pentru a include orice alternativă mai bună."
      },
      {
        "id": "B",
        "pole": "J",
        "text": "Decide with the information already available.",
        "textRo": "Să decid prompt pe baza informațiilor deja disponibile.",
        "explanation": "Favors J: values prompt closure and clear direction over indefinite exploration.",
        "explanationRo": "Favorizează J: valorizează decizia asumată din timp și claritatea direcției."
      }
    ]
  },
  {
    "id": "W09",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ne",
    "text": "When tackling a challenge at work, which excites you more?",
    "textRo": "Când ai în față o provocare, ce te inspiră mai mult?",
    "description": "Compares divergent exploration (Ne) with refining a proven approach (Si).",
    "descriptionRo": "Compară explorarea ideilor neconvenționale (Ne) cu perfecționarea metodei consacrate (Si).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Generate unconventional possibilities.",
        "textRo": "Să generez posibilități neconvenționale și abordări cu totul noi.",
        "explanation": "Favors Ne: pioneering new frontiers and divergent possibilities.",
        "explanationRo": "Favorizează Ne: deschidere către inovație, posibilități originale și asocieri inedite."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Improve a familiar approach.",
        "textRo": "Să îmbunătățesc o abordare familiară și deja testată.",
        "explanation": "Favors Si: optimizing proven practices and cumulative past experience.",
        "explanationRo": "Favorizează Si: optimizarea metodelor verificate și a experienței acumulate."
      }
    ]
  },
  {
    "id": "W10",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ne",
    "text": "In a collaborative session, which role energizes you most?",
    "textRo": "Într-o sesiune de lucru, ce rol te stimulează mai mult?",
    "description": "Compares brainstorming multiple paths (Ne) with relying on proven precedents (Si).",
    "descriptionRo": "Compară brainstorming-ul de soluții multiple (Ne) cu aplicarea soluțiilor dovedite (Si).",
    "options": [
      {
        "id": "A",
        "pole": "Ne",
        "text": "Brainstorm many solutions.",
        "textRo": "Să propun cât mai multe unghiuri și soluții posibile.",
        "explanation": "Favors Ne: rapid ideation and wide-ranging possibility scanning.",
        "explanationRo": "Favorizează Ne: abundență de idei și explorarea rapidă a multiplelor direcții."
      },
      {
        "id": "B",
        "pole": "Si",
        "text": "Follow a method that worked before.",
        "textRo": "Să urmăresc o metodă care a dat rezultate sigure în trecut.",
        "explanation": "Favors Si: anchoring execution in dependable, verified precedents.",
        "explanationRo": "Favorizează Si: ancorarea acțiunii în bune practici și certitudini sigure."
      }
    ]
  },
  {
    "id": "W11",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ni",
    "text": "When analyzing complex circumstances, what do you look for first?",
    "textRo": "Când analizezi o situație complexă, ce cauți mai întâi?",
    "description": "Compares uncovering the underlying pattern (Ni) with focusing on immediate reality (Se).",
    "descriptionRo": "Compară descoperirea tiparului ascuns (Ni) cu focalizarea pe realitatea din prezent (Se).",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Search for the hidden pattern.",
        "textRo": "Să caut tiparul ascuns din spatele aparențelor.",
        "explanation": "Favors Ni: identifying deeper holistic patterns and underlying drivers.",
        "explanationRo": "Favorizează Ni: pătrunderea intuitivă a semnificației și a cauzelor subtile."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Focus on what is happening right now.",
        "textRo": "Să mă concentrez exact pe ceea ce se întâmplă chiar acum.",
        "explanation": "Favors Se: acute engagement with immediate tangible reality.",
        "explanationRo": "Favorizează Se: atenție la faptele prezente palpabile și la datele concrete din teren."
      }
    ]
  },
  {
    "id": "W12",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ni",
    "text": "When navigating an uncertain situation, which is your natural instinct?",
    "textRo": "Când navighezi printr-o situație cu incertitudine, care este primul tău impuls?",
    "description": "Compares predicting the future course (Ni) with real-time feedback reaction (Se).",
    "descriptionRo": "Compară anticiparea direcției de viitor (Ni) cu reacția în timp real la desfășurarea faptelor (Se).",
    "options": [
      {
        "id": "A",
        "pole": "Ni",
        "text": "Predict where events may lead.",
        "textRo": "Să anticipez încotro vor duce evenimentele pe termen lung.",
        "explanation": "Favors Ni: visionary foresight and trajectory projection.",
        "explanationRo": "Favorizează Ni: anticipare vizionară și orientare după traiectoria viitoare."
      },
      {
        "id": "B",
        "pole": "Se",
        "text": "Respond to details as they unfold.",
        "textRo": "Să răspund la detalii și oportunități pe măsură ce apar în timp real.",
        "explanation": "Favors Se: tactical agility and real-time sensory reaction.",
        "explanationRo": "Favorizează Se: reacție tactică promptă și adaptare imediată la mediu."
      }
    ]
  },
  {
    "id": "W13",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Te",
    "text": "When leading an initiative, what is your primary focus?",
    "textRo": "Când coordonezi o inițiativă, pe ce pui cel mai mult accentul?",
    "description": "Compares structured pragmatic execution (Te) with authentic value alignment (Fi).",
    "descriptionRo": "Compară planificarea practică cu etape clare (Te) cu alinierea la convingerile lăuntrice (Fi).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Build a practical plan with milestones.",
        "textRo": "Să construiesc un plan practic, cu etape și termene clare.",
        "explanation": "Favors Te: building structured systems for measurable objective achievement.",
        "explanationRo": "Favorizează Te: organizarea resurselor pentru eficiență maximă și livrare la timp."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Ensure the decision reflects personal convictions.",
        "textRo": "Să mă asigur că decizia reflectă convingerile mele autentice.",
        "explanation": "Favors Fi: safeguarding inner integrity and deep personal values.",
        "explanationRo": "Favorizează Fi: fidelitate absolută față de valorile morale și semnificația personală."
      }
    ]
  },
  {
    "id": "W14",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Te",
    "text": "When choosing between competing proposals, which criterion comes first?",
    "textRo": "Când alegi între două propuneri, ce criteriu este decisiv?",
    "description": "Compares objective performance metrics (Te) with personal authenticity (Fi).",
    "descriptionRo": "Compară rezultatele măsurabile dovedite (Te) cu acordul profund interior (Fi).",
    "options": [
      {
        "id": "A",
        "pole": "Te",
        "text": "Choose the option with measurable results.",
        "textRo": "Să aleg opțiunea cu cele mai clare rezultate măsurabile.",
        "explanation": "Favors Te: empirical effectiveness, utility, and concrete performance.",
        "explanationRo": "Favorizează Te: criterii obiective de eficiență, randament și utilitate dovedită."
      },
      {
        "id": "B",
        "pole": "Fi",
        "text": "Choose the option that feels personally right.",
        "textRo": "Să aleg opțiunea pe care o simt profund corectă la nivel personal.",
        "explanation": "Favors Fi: internal moral alignment and intuitive ethical congruence.",
        "explanationRo": "Favorizează Fi: liniște sufletească și concordanță cu propria conștiință."
      }
    ]
  },
  {
    "id": "W15",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ti",
    "text": "When resolving a debate, which is more essential to you?",
    "textRo": "Când aplanezi o dispută, ce este mai esențial pentru tine?",
    "description": "Compares conceptual definition clarity (Ti) with relational consensus (Fe).",
    "descriptionRo": "Compară clarificarea logicii și a definițiilor (Ti) cu restabilirea bunei înțelegeri (Fe).",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Clarify the logic and definitions.",
        "textRo": "Să clarificăm logica exactă și definițiile termenilor folosiți.",
        "explanation": "Favors Ti: exacting conceptual clarity and precise deductive reasoning.",
        "explanationRo": "Favorizează Ti: claritate analitică strictă și eliminarea confuziilor de sens."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Restore shared understanding.",
        "textRo": "Să restabilim buna înțelegere și armonia dintre oameni.",
        "explanation": "Favors Fe: restoring interpersonal trust and collaborative connection.",
        "explanationRo": "Favorizează Fe: restabilirea apropierii umane, a respectului și a cooperării."
      }
    ]
  },
  {
    "id": "W16",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Ti",
    "text": "When analyzing a detailed argument, which instinct dominates?",
    "textRo": "Când analizezi o argumentație, ce instinct este predominant?",
    "description": "Compares critical logical testing (Ti) with constructive social facilitation (Fe).",
    "descriptionRo": "Compară testarea critică a contradicțiilor (Ti) cu comunicarea constructivă în grup (Fe).",
    "options": [
      {
        "id": "A",
        "pole": "Ti",
        "text": "Test every claim for contradictions.",
        "textRo": "Să testez fiecare afirmație pentru a vedea dacă există contradicții.",
        "explanation": "Favors Ti: rigorous internal scrutiny to ensure absolute logical integrity.",
        "explanationRo": "Favorizează Ti: căutarea riguroasă a inconsistențelor pentru validitate certă."
      },
      {
        "id": "B",
        "pole": "Fe",
        "text": "Find a way for everyone to communicate constructively.",
        "textRo": "Să găsesc o cale prin care toată lumea să comunice constructiv.",
        "explanation": "Favors Fe: empathetic facilitation and positive group dialogue.",
        "explanationRo": "Favorizează Fe: facilitare empatică pentru un schimb deschis și constructiv."
      }
    ]
  },
  {
    "id": "W17",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Fe",
    "text": "When offering critical feedback, what is your chief consideration?",
    "textRo": "Când oferi un feedback critic, la ce ești cel mai atent?",
    "description": "Compares relational tact (Fe) with technical unvarnished precision (Ti).",
    "descriptionRo": "Compară tactul relațional pentru protejarea încrederii (Fe) cu precizia analitică directă (Ti).",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Phrase feedback to preserve trust.",
        "textRo": "Să formulez mesajul astfel încât să păstrez încrederea și respectul reciproc.",
        "explanation": "Favors Fe: conscious framing to support morale and relational rapport.",
        "explanationRo": "Favorizează Fe: adaptarea tonului pentru a proteja stima de sine și deschiderea celuilalt."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "State the reasoning as precisely as possible.",
        "textRo": "Să expun raționamentul cât mai exact și obiectiv posibil.",
        "explanation": "Favors Ti: prioritizing unadulterated analytical truth above emotional nuance.",
        "explanationRo": "Favorizează Ti: prioritate absolută pentru acuratețea faptelor și claritatea logică."
      }
    ]
  },
  {
    "id": "W18",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Fe",
    "text": "In a team impasse, where does your contribution naturally go?",
    "textRo": "Într-un impas de echipă, unde intervii cel mai firesc?",
    "description": "Compares bridging social consensus (Fe) with pinpointing logical fallacies (Ti).",
    "descriptionRo": "Compară găsirea numitorului comun între oameni (Fe) cu identificarea erorii logice (Ti).",
    "options": [
      {
        "id": "A",
        "pole": "Fe",
        "text": "Help a group find common ground.",
        "textRo": "Să ajut grupul să descopere un numitor comun și să colaboreze.",
        "explanation": "Favors Fe: building bridges, empathetic synthesis, and collective morale.",
        "explanationRo": "Favorizează Fe: apropierea punctelor de vedere și reclădirea solidarității."
      },
      {
        "id": "B",
        "pole": "Ti",
        "text": "Identify exactly where an argument fails.",
        "textRo": "Să identific cu exactitate unde anume greșește raționamentul tehnic.",
        "explanation": "Favors Ti: precise forensic deconstruction of arguments and false premises.",
        "explanationRo": "Favorizează Ti: identificarea chirurgicală a erorii de logică sau a premisei false."
      }
    ]
  },
  {
    "id": "W19",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Fi",
    "text": "When facing a major compromise, which stands highest?",
    "textRo": "În fața unui compromis dificil, ce prevalează pentru tine?",
    "description": "Compares maintaining personal conviction (Fi) with driving goal attainment (Te).",
    "descriptionRo": "Compară rămânerea fidel unui principiu propriu (Fi) cu atingerea obiectivului propus (Te).",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "Stay true to a personal principle.",
        "textRo": "Să rămân fidel unui principiu personal, chiar dacă pierd un avantaj.",
        "explanation": "Favors Fi: uncompromising moral authenticity over external victory.",
        "explanationRo": "Favorizează Fi: fidelitate neclintită față de sine, indiferent de costuri exterioare."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Choose the option most likely to achieve the goal.",
        "textRo": "Să aleg opțiunea cu cele mai mari șanse de a atinge obiectivul concret.",
        "explanation": "Favors Te: tactical pragmatism aimed at decisive mission success.",
        "explanationRo": "Favorizează Te: pragmatism eficient centrat pe obținerea victoriei sau a rezultatului dorit."
      }
    ]
  },
  {
    "id": "W20",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Fi",
    "text": "When judging personal success, what matters most to your conscience?",
    "textRo": "Când evaluezi reușita unei acțiuni, ce contează cel mai mult pentru conștiința ta?",
    "description": "Compares inner authenticity (Fi) with external objective performance (Te).",
    "descriptionRo": "Compară autenticitatea trăită interior (Fi) cu succesul validat extern (Te).",
    "options": [
      {
        "id": "A",
        "pole": "Fi",
        "text": "Decide what feels authentic to you.",
        "textRo": "Să știu că am fost 100% autentic și fidel propriei conștiințe.",
        "explanation": "Favors Fi: deep personal integrity as the ultimate internal compass.",
        "explanationRo": "Favorizează Fi: liniștea că alegerea respectă în profunzime cine ești cu adevărat."
      },
      {
        "id": "B",
        "pole": "Te",
        "text": "Decide using objective performance criteria.",
        "textRo": "Să văd că rezultatele concrete și performanța depășesc standardele obiective.",
        "explanation": "Favors Te: verifiable achievements and tangible benchmarks of excellence.",
        "explanationRo": "Favorizează Te: confirmare empirică prin excelență măsurabilă și impact practic."
      }
    ]
  },
  {
    "id": "W21",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Se",
    "text": "When exploring a new physical pursuit, how do you prefer to start?",
    "textRo": "Când începi o activitate fizică sau practică nouă, cum începi de obicei?",
    "description": "Compares direct trial and real-time adjustment (Se) with mental visualization (Ni).",
    "descriptionRo": "Compară încercarea directă pe loc (Se) cu vizualizarea mentală a rezultatului (Ni).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "Try the activity and adjust as you go.",
        "textRo": "Să mă apuc direct și să mă adaptez din mers.",
        "explanation": "Favors Se: dynamic bodily engagement and learning through immediate tactile feedback.",
        "explanationRo": "Favorizează Se: învățare kinestezică directă și coordonare intuitivă în acțiune."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Visualize where it might lead.",
        "textRo": "Să vizualizez mai întâi în minte tehnica și unde mă va conduce.",
        "explanation": "Favors Ni: internal conceptual rehearsal and anticipating the trajectory.",
        "explanationRo": "Favorizează Ni: repetiție mentală interioară și proiecția clară a traiectoriei."
      }
    ]
  },
  {
    "id": "W22",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Se",
    "text": "In a rapidly evolving physical environment, what is your forte?",
    "textRo": "Într-un mediu cu schimbări rapide, care este atuul tău principal?",
    "description": "Compares real-time sensory reaction (Se) with long-range strategic interpretation (Ni).",
    "descriptionRo": "Compară reflexele rapide în timp real (Se) cu interpretarea cursului strategic pe termen lung (Ni).",
    "options": [
      {
        "id": "A",
        "pole": "Se",
        "text": "React to changing conditions in real time.",
        "textRo": "Să reacționez instantaneu la condițiile în schimbare.",
        "explanation": "Favors Se: real-time physical presence, sharp observation, and decisive agility.",
        "explanationRo": "Favorizează Se: prezență vie, reflexe prompte și reacție imediată la datele mediului."
      },
      {
        "id": "B",
        "pole": "Ni",
        "text": "Interpret the long-term direction of events.",
        "textRo": "Să interpretez direcția pe termen lung spre care conduc aceste evenimente.",
        "explanation": "Favors Ni: seeing beyond immediate chaos to the overarching future convergence.",
        "explanationRo": "Favorizează Ni: deslușirea semnificației strategice de ansamblu dincolo de stimulii de moment."
      }
    ]
  },
  {
    "id": "W23",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Si",
    "text": "When approaching an unfamiliar challenge, what do you look to first?",
    "textRo": "Când te confrunți cu o problemă nouă, ce consulți mai întâi în gând?",
    "description": "Compares drawing on memory of past events (Si) with envisioning multiple alternatives (Ne).",
    "descriptionRo": "Compară amintirea detaliilor din situații similare din trecut (Si) cu imaginarea scenariilor noi (Ne).",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "Compare the situation with a specific past experience.",
        "textRo": "Să compar situația cu o experiență concretă trăită în trecut.",
        "explanation": "Favors Si: cross-referencing memory storehouses to identify reliable precedents.",
        "explanationRo": "Favorizează Si: utilizarea bazei de date a memoriei pentru a găsi paralele sigure."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "Imagine several possible developments.",
        "textRo": "Să îmi imaginez mai multe evoluții și posibilități inedite.",
        "explanation": "Favors Ne: speculative ideation and exploring branching hypothetical scenarios.",
        "explanationRo": "Favorizează Ne: generare de ipoteze noi și scenarii alternative deschise."
      }
    ]
  },
  {
    "id": "W24",
    "format": "wouldYouRather",
    "category": "function",
    "target": "Si",
    "text": "When executing a critical procedure, which philosophy suits you better?",
    "textRo": "Când realizezi o sarcină importantă, ce filozofie preferi?",
    "description": "Compares disciplined reliance on proven methods (Si) with experimental trial (Ne).",
    "descriptionRo": "Compară utilizarea metodelor verificate (Si) cu experimentarea unei abordări diferite (Ne).",
    "options": [
      {
        "id": "A",
        "pole": "Si",
        "text": "Use a familiar method that has proven reliable.",
        "textRo": "Să folosesc o metodă familiară, a cărei siguranță este deja dovedită.",
        "explanation": "Favors Si: preserving continuity, meticulous reliability, and avoiding needless error.",
        "explanationRo": "Favorizează Si: respectarea bunelor practici verificate și prevenirea erorilor prin consecvență."
      },
      {
        "id": "B",
        "pole": "Ne",
        "text": "Experiment with a different approach.",
        "textRo": "Să experimentez o abordare diferită pentru a descoperi ceva mai bun.",
        "explanation": "Favors Ne: creative willingness to challenge routines to find superior innovations.",
        "explanationRo": "Favorizează Ne: curaj creativ de a testa alternative pentru a descoperi noi oportunități."
      }
    ]
  },
  {
    "id": "S01",
    "format": "short",
    "category": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "text": "I clarify my thoughts by discussing them aloud.",
    "textRo": "Îmi clarific gândurile discutându-le cu voce tare.",
    "description": "Measures whether verbal interaction helps organize thinking.",
    "descriptionRo": "Măsoară dacă exprimarea verbală ajută la organizarea gândirii.",
    "agreementExplanation": "Agreement favors E: developing thoughts through external discussion.",
    "agreementExplanationRo": "Acordul favorizează E: clarificarea gândurilor prin dialog extern.",
    "disagreementExplanation": "Disagreement favors I: less reliance on talking to process thoughts.",
    "disagreementExplanationRo": "Dezacordul favorizează I: reflecție internă înainte de exprimare.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S02",
    "format": "short",
    "category": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "agreementPole": "I",
    "text": "I rehearse important thoughts privately before sharing them.",
    "textRo": "Îmi ordonez gândurile importante în liniște înainte de a le împărtăși.",
    "description": "Measures private preparation before interpersonal communication.",
    "descriptionRo": "Măsoară pregătirea internă înainte de comunicare.",
    "agreementExplanation": "Agreement favors I: private internal preparation.",
    "agreementExplanationRo": "Acordul favorizează I: procesare solitară a gândurilor.",
    "disagreementExplanation": "Disagreement favors E: spontaneous verbal formulation.",
    "disagreementExplanationRo": "Dezacordul favorizează E: formulare spontană în conversație.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S03",
    "format": "short",
    "category": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "text": "Sharing ideas energizes me during collaborative work.",
    "textRo": "Schimbul de idei mă energizează în timpul lucrului în echipă.",
    "description": "Measures social stimulation from collaborative interaction.",
    "descriptionRo": "Măsoară stimularea energetică obținută din colaborare.",
    "agreementExplanation": "Agreement favors E: social and interactive vitality.",
    "agreementExplanationRo": "Acordul favorizează E: energie crescută din colaborare vie.",
    "disagreementExplanation": "Disagreement favors I: independent work preserves more energy.",
    "disagreementExplanationRo": "Dezacordul favorizează I: lucrul individual conservă mai bine energia.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S04",
    "format": "short",
    "category": "axis",
    "dimension": "EI",
    "target": "I",
    "oppositePole": "E",
    "agreementPole": "I",
    "text": "I need solitude after prolonged social interaction.",
    "textRo": "Am nevoie de solitudine după o interacțiune socială prelungită.",
    "description": "Measures solitary recovery after sustained social exposure.",
    "descriptionRo": "Măsoară nevoia de refacere în singurătate după socializare.",
    "agreementExplanation": "Agreement favors I: solitude restores energy reserves.",
    "agreementExplanationRo": "Acordul favorizează I: solitudinea reface rezervele de energie.",
    "disagreementExplanation": "Disagreement favors E: prolonged social contact remains energizing.",
    "disagreementExplanationRo": "Dezacordul favorizează E: contactul social prelungit rămâne stimulant.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S05",
    "format": "short",
    "category": "axis",
    "dimension": "EI",
    "target": "E",
    "oppositePole": "I",
    "agreementPole": "E",
    "text": "I enjoy thinking through problems with other people.",
    "textRo": "Îmi place să rezolv probleme gândind împreună cu ceilalți.",
    "description": "Measures preference for interactive group problem-solving.",
    "descriptionRo": "Măsoară preferința pentru rezolvarea interactivă a problemelor.",
    "agreementExplanation": "Agreement favors E: interactive problem-solving orientation.",
    "agreementExplanationRo": "Acordul favorizează E: rezolvarea problemelor prin cooperare directă.",
    "disagreementExplanation": "Disagreement favors I: preference leans toward individual analysis.",
    "disagreementExplanationRo": "Dezacordul favorizează I: analiză aprofundată pe cont propriu.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S06",
    "format": "short",
    "category": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I look for implications beyond the facts presented.",
    "textRo": "Caut implicații dincolo de faptele prezentate.",
    "description": "Measures interpreting underlying potential beyond concrete facts.",
    "descriptionRo": "Măsoară deslușirea implicațiilor ascunse dincolo de faptele brute.",
    "agreementExplanation": "Agreement favors N: interpreting possibilities and future implications.",
    "agreementExplanationRo": "Acordul favorizează N: atenție acordată posibilităților viitoare.",
    "disagreementExplanation": "Disagreement favors S: attending strictly to concrete facts.",
    "disagreementExplanationRo": "Dezacordul favorizează S: atenție strictă la faptele concrete verificate.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S07",
    "format": "short",
    "category": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "text": "I trust details I can directly verify.",
    "textRo": "Mă bazez pe detalii pe care le pot verifica direct.",
    "description": "Measures reliance on verifiable tangible evidence.",
    "descriptionRo": "Măsoară încrederea în date tangibile și verificabile direct.",
    "agreementExplanation": "Agreement favors S: concrete verification provides confidence.",
    "agreementExplanationRo": "Acordul favorizează S: încredere în ceea ce este observabil și concret.",
    "disagreementExplanation": "Disagreement favors N: open to abstract or conceptual possibilities.",
    "disagreementExplanationRo": "Dezacordul favorizează N: deschidere către ipoteze abstracte și concepte.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S08",
    "format": "short",
    "category": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I often imagine what a current idea could become.",
    "textRo": "Îmi imaginez adesea ce ar putea deveni o idee în viitor.",
    "description": "Measures visualizing future potential and conceptual evolution.",
    "descriptionRo": "Măsoară vizualizarea potențialului și a evoluției unei idei.",
    "agreementExplanation": "Agreement favors N: orientation toward future potential.",
    "agreementExplanationRo": "Acordul favorizează N: orientare spre viziune și potențial de viitor.",
    "disagreementExplanation": "Disagreement favors S: focus on present utility and reality.",
    "disagreementExplanationRo": "Dezacordul favorizează S: concentrare pe realitatea și utilitatea prezentă.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S09",
    "format": "short",
    "category": "axis",
    "dimension": "NS",
    "target": "S",
    "oppositePole": "N",
    "agreementPole": "S",
    "text": "I prefer examples that demonstrate exactly how something works.",
    "textRo": "Prefer exemple care arată exact cum funcționează un lucru.",
    "description": "Measures preference for clear tangible demonstration over theory.",
    "descriptionRo": "Măsoară preferința pentru demonstrații practice în locul teoriei pure.",
    "agreementExplanation": "Agreement favors S: concrete practical demonstration.",
    "agreementExplanationRo": "Acordul favorizează S: demonstrație practică și aplicată.",
    "disagreementExplanation": "Disagreement favors N: interest in broad theoretical concepts.",
    "disagreementExplanationRo": "Dezacordul favorizează N: interes pentru concepte generale de ansamblu.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S10",
    "format": "short",
    "category": "axis",
    "dimension": "NS",
    "target": "N",
    "oppositePole": "S",
    "agreementPole": "N",
    "text": "I connect ideas from seemingly unrelated subjects.",
    "textRo": "Fac legături între idei din domenii aparent diferite.",
    "description": "Measures cross-domain associative ideation.",
    "descriptionRo": "Măsoară corelarea ideilor din sfere de cunoaștere diferite.",
    "agreementExplanation": "Agreement favors N: spontaneous cross-domain connections.",
    "agreementExplanationRo": "Acordul favorizează N: corelații intuitive între domenii diverse.",
    "disagreementExplanation": "Disagreement favors S: keeping domains focused on immediate facts.",
    "disagreementExplanationRo": "Dezacordul favorizează S: atenție concentrată pe contextul specific imediat.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S11",
    "format": "short",
    "category": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "I evaluate arguments by checking their logical consistency.",
    "textRo": "Evaluez argumentele verificându-le coerența logică.",
    "description": "Measures testing statements for internal logical validity.",
    "descriptionRo": "Măsoară evaluarea argumentelor după validitatea lor logică.",
    "agreementExplanation": "Agreement favors T: objective logical evaluation.",
    "agreementExplanationRo": "Acordul favorizează T: rigoare în evaluarea rațională.",
    "disagreementExplanation": "Disagreement favors F: taking personal values and tone into account.",
    "disagreementExplanationRo": "Dezacordul favorizează F: acordă atenție și rezonanței umane sau etice.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S12",
    "format": "short",
    "category": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "text": "I consider how decisions affect people's feelings.",
    "textRo": "Iau în considerare cum afectează deciziile sentimentele oamenilor.",
    "description": "Measures attention to human emotional consequences.",
    "descriptionRo": "Măsoară empatia față de impactul afectiv al alegerilor.",
    "agreementExplanation": "Agreement favors F: emotional impact matters fundamentally.",
    "agreementExplanationRo": "Acordul favorizează F: sensibilitate față de trăirile celor implicați.",
    "disagreementExplanation": "Disagreement favors T: impersonal criteria take priority over sentiment.",
    "disagreementExplanationRo": "Dezacordul favorizează T: criterii obiective plasate înaintea sentimentelor.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S13",
    "format": "short",
    "category": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "I prefer rules that apply consistently across similar cases.",
    "textRo": "Prefer reguli care se aplică consecvent în situații similare.",
    "description": "Measures preference for universal impartial standards.",
    "descriptionRo": "Măsoară preferința pentru standarde universale și echitabile prin logică.",
    "agreementExplanation": "Agreement favors T: impartial and uniform rule application.",
    "agreementExplanationRo": "Acordul favorizează T: aplicare imparțială și uniformă a regulilor.",
    "disagreementExplanation": "Disagreement favors F: flexibility based on personal human context.",
    "disagreementExplanationRo": "Dezacordul favorizează F: flexibilitate bazată pe circumstanțe personale.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S14",
    "format": "short",
    "category": "axis",
    "dimension": "TF",
    "target": "F",
    "oppositePole": "T",
    "agreementPole": "F",
    "text": "Personal circumstances can change how I judge a decision.",
    "textRo": "Circumstanțele personale pot schimba modul în care judec o decizie.",
    "description": "Measures adapting evaluation to individual human realities.",
    "descriptionRo": "Măsoară nuanțarea deciziei în funcție de situația umană specifică.",
    "agreementExplanation": "Agreement favors F: contextual and empathetic evaluation.",
    "agreementExplanationRo": "Acordul favorizează F: judecată nuanțată contextual și empatic.",
    "disagreementExplanation": "Disagreement favors T: adherence to consistent impartial benchmarks.",
    "disagreementExplanationRo": "Dezacordul favorizează T: respectarea reperelor obiective consecvente.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S15",
    "format": "short",
    "category": "axis",
    "dimension": "TF",
    "target": "T",
    "oppositePole": "F",
    "agreementPole": "T",
    "text": "I challenge conclusions when the reasoning seems flawed.",
    "textRo": "Contest concluziile atunci când raționamentul pare greșit.",
    "description": "Measures willingness to question claims that lack logical rigor.",
    "descriptionRo": "Măsoară curajul de a contesta afirmațiile lipsite de logică.",
    "agreementExplanation": "Agreement favors T: intellectual scrutiny of arguments.",
    "agreementExplanationRo": "Acordul favorizează T: vigilență critică față de fisurile logice.",
    "disagreementExplanation": "Disagreement favors F: preserving interpersonal harmony over debating.",
    "disagreementExplanationRo": "Dezacordul favorizează F: menținerea atmosferei calde înaintea disputelor.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S16",
    "format": "short",
    "category": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "I settle deadlines and plans well in advance.",
    "textRo": "Stabilesc termenele și planurile cu mult timp înainte.",
    "description": "Measures early planning and clear advance scheduling.",
    "descriptionRo": "Măsoară planificarea din timp și stabilirea termenelor clare.",
    "agreementExplanation": "Agreement favors J: forward scheduling and advance preparation.",
    "agreementExplanationRo": "Acordul favorizează J: organizare metodică din timp.",
    "disagreementExplanation": "Disagreement favors P: comfortable with open deadlines.",
    "disagreementExplanationRo": "Dezacordul favorizează P: lejeritate față de orare fixe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S17",
    "format": "short",
    "category": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "text": "I change plans when better options appear.",
    "textRo": "Schimb planurile atunci când apar opțiuni mai bune.",
    "description": "Measures adaptability and pivoting when superior alternatives emerge.",
    "descriptionRo": "Măsoară adaptabilitatea rapidă când se ivesc oportunități noi.",
    "agreementExplanation": "Agreement favors P: agile responsiveness to better opportunities.",
    "agreementExplanationRo": "Acordul favorizează P: flexibilitate de a alege oportunități superioare.",
    "disagreementExplanation": "Disagreement favors J: preference for seeing planned commitments through.",
    "disagreementExplanationRo": "Dezacordul favorizează J: perseverență în ducerea planului inițial la capăt.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S18",
    "format": "short",
    "category": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "I prefer finishing decisions before starting something new.",
    "textRo": "Prefer să finalizez deciziile înainte de a începe ceva nou.",
    "description": "Measures drive for complete closure before moving to new tasks.",
    "descriptionRo": "Măsoară nevoia de a finaliza o sarcină înainte de o alta.",
    "agreementExplanation": "Agreement favors J: commitment to resolution and completion.",
    "agreementExplanationRo": "Acordul favorizează J: dorință de încheiere și ordine metodică.",
    "disagreementExplanation": "Disagreement favors P: comfortable managing multiple open initiatives.",
    "disagreementExplanationRo": "Dezacordul favorizează P: confort în jonglarea cu mai multe proiecte deschise.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S19",
    "format": "short",
    "category": "axis",
    "dimension": "JP",
    "target": "P",
    "oppositePole": "J",
    "agreementPole": "P",
    "text": "I enjoy leaving room for spontaneous opportunities.",
    "textRo": "Îmi place să las loc pentru oportunități spontane.",
    "description": "Measures valuing open unstructured space in schedule.",
    "descriptionRo": "Măsoară aprecierea spontaneității în programul zilnic.",
    "agreementExplanation": "Agreement favors P: keeping schedules open for spontaneity.",
    "agreementExplanationRo": "Acordul favorizează P: libertate pentru evenimente neprevăzute plăcute.",
    "disagreementExplanation": "Disagreement favors J: preferring predictable structured routines.",
    "disagreementExplanationRo": "Dezacordul favorizează J: preferință pentru predictibilitate și structură clară.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S20",
    "format": "short",
    "category": "axis",
    "dimension": "JP",
    "target": "J",
    "oppositePole": "P",
    "agreementPole": "J",
    "text": "Unresolved plans make it difficult for me to relax.",
    "textRo": "Planurile nerezolvate îmi creează dificultăți în a mă relaxa.",
    "description": "Measures internal tension associated with lingering ambiguity.",
    "descriptionRo": "Măsoară disconfortul creat de treburile lăsate neterminate.",
    "agreementExplanation": "Agreement favors J: psychological desire for settled closure.",
    "agreementExplanationRo": "Acordul favorizează J: liniște sufletească obținută după stabilirea clară a lucrurilor.",
    "disagreementExplanation": "Disagreement favors P: high tolerance for uncertainty and open loops.",
    "disagreementExplanationRo": "Dezacordul favorizează P: toleranță ridicată la incertitudine și relaxare fără planuri fixe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S21",
    "format": "short",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "I generate alternative explanations when something seems unclear.",
    "textRo": "Generez explicații alternative atunci când ceva pare neclar.",
    "description": "Measures generating branching hypotheses when encountering ambiguity.",
    "descriptionRo": "Măsoară explorarea mai multor ipoteze în fața incertitudinii.",
    "agreementExplanation": "Agreement favors Ne: cognitive exploration of multiple possibilities.",
    "agreementExplanationRo": "Acordul favorizează Ne: explorare activă a posibilităților variate.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ne and shifts contribution toward Si.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ne și orientează contribuția spre Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S22",
    "format": "short",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "I enjoy combining ideas from unrelated topics.",
    "textRo": "Îmi place să combin idei din subiecte fără legătură.",
    "description": "Measures creative synthesis across distant domains.",
    "descriptionRo": "Măsoară asocierile creative între concepte eterogene.",
    "agreementExplanation": "Agreement favors Ne: cross-domain creative ideation.",
    "agreementExplanationRo": "Acordul favorizează Ne: sinteză creativă prin conectarea noțiunilor diferite.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ne and shifts contribution toward Si.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ne și orientează contribuția spre Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S23",
    "format": "short",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "I keep exploring alternatives after finding one workable solution.",
    "textRo": "Continui să explorez alternative chiar și după ce găsesc o soluție funcțională.",
    "description": "Measures continuous ideation and curiosity beyond immediate needs.",
    "descriptionRo": "Măsoară curiozitatea continuă chiar și după găsirea unei soluții funcționale.",
    "agreementExplanation": "Agreement favors Ne: pursuing richer options beyond the first viable answer.",
    "agreementExplanationRo": "Acordul favorizează Ne: căutarea continuă de noi perspective și variante superioare.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ne and shifts contribution toward Si.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ne și orientează contribuția spre Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S24",
    "format": "short",
    "category": "function",
    "target": "Ne",
    "oppositePole": "Si",
    "agreementPole": "Ne",
    "text": "I question familiar assumptions to discover other possibilities.",
    "textRo": "Pun la îndoială ipotezele obișnuite pentru a descoperi noi posibilități.",
    "description": "Measures reframing premises to unlock fresh perspectives.",
    "descriptionRo": "Măsoară redefinirea premiselor pentru a debloca unghiuri noi de vedere.",
    "agreementExplanation": "Agreement favors Ne: challenging established assumptions.",
    "agreementExplanationRo": "Acordul favorizează Ne: reevaluarea convențiilor pentru descoperirea necunoscutului.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ne and shifts contribution toward Si.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ne și orientează contribuția spre Si.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S25",
    "format": "short",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I search for one pattern connecting separate events.",
    "textRo": "Caut tiparul unic care leagă evenimente separate.",
    "description": "Measures synthesizing disparate occurrences into a unified pattern.",
    "descriptionRo": "Măsoară identificarea tiparului central care conectează evenimentele.",
    "agreementExplanation": "Agreement favors Ni: intuitive convergence toward root patterns.",
    "agreementExplanationRo": "Acordul favorizează Ni: convergență intuitivă spre tiparul profund comun.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ni and shifts contribution toward Se.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ni și orientează contribuția spre Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S26",
    "format": "short",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I often anticipate where a situation is heading.",
    "textRo": "Anticipez adesea încotro se îndreaptă o situație.",
    "description": "Measures trajectory foresight and intuitive expectation of outcomes.",
    "descriptionRo": "Măsoară anticiparea mersului lucrurilor și a direcției viitoare.",
    "agreementExplanation": "Agreement favors Ni: intuitive anticipation of developmental trajectory.",
    "agreementExplanationRo": "Acordul favorizează Ni: anticiparea traiectoriei logice a unei situații.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ni and shifts contribution toward Se.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ni și orientează contribuția spre Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S27",
    "format": "short",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I seek the underlying meaning behind recurring events.",
    "textRo": "Caut semnificația profundă din spatele evenimentelor repetitive.",
    "description": "Measures uncovering thematic significance beneath surface repetitions.",
    "descriptionRo": "Măsoară căutarea semnificației subtile dincolo de aparențe.",
    "agreementExplanation": "Agreement favors Ni: depth interpretation of symbolic patterns.",
    "agreementExplanationRo": "Acordul favorizează Ni: descifrarea sensului ascuns și a cauzelor profunde.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ni and shifts contribution toward Se.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ni și orientează contribuția spre Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S28",
    "format": "short",
    "category": "function",
    "target": "Ni",
    "oppositePole": "Se",
    "agreementPole": "Ni",
    "text": "I form an overall impression before explaining its details.",
    "textRo": "Îmi formez o impresie de ansamblu înainte de a explica detaliile.",
    "description": "Measures holistic intuition preceding explicit granular breakdown.",
    "descriptionRo": "Măsoară percepția globală intuitivă care precede detaliile explicite.",
    "agreementExplanation": "Agreement favors Ni: holistic gestalt perception.",
    "agreementExplanationRo": "Acordul favorizează Ni: intuiție globală a întregului înainte de detalii.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ni and shifts contribution toward Se.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ni și orientează contribuția spre Se.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S29",
    "format": "short",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "I organize complex tasks into measurable steps.",
    "textRo": "Organizez sarcinile complexe în pași măsurabili.",
    "description": "Measures breaking work down into concrete milestone structures.",
    "descriptionRo": "Măsoară structurarea muncii complexe în etape clare și măsurabile.",
    "agreementExplanation": "Agreement favors Te: pragmatic planning and structured execution.",
    "agreementExplanationRo": "Acordul favorizează Te: planificare metodică orientată spre rezultate clare.",
    "disagreementExplanation": "Disagreement indicates less agreement with Te and shifts contribution toward Fi.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Te și orientează contribuția spre Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S30",
    "format": "short",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "I judge methods by their practical results.",
    "textRo": "Judec metodele după rezultatele lor practice.",
    "description": "Measures pragmatic accountability to tangible output.",
    "descriptionRo": "Măsoară evaluarea metodelor pe baza randamentului și a utilității concrete.",
    "agreementExplanation": "Agreement favors Te: empirical outcome-driven assessment.",
    "agreementExplanationRo": "Acordul favorizează Te: evaluare centrată pe rezultate și eficiență.",
    "disagreementExplanation": "Disagreement indicates less agreement with Te and shifts contribution toward Fi.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Te și orientează contribuția spre Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S31",
    "format": "short",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "I establish clear responsibilities when coordinating work.",
    "textRo": "Stabilesc responsabilități clare când coordonez o activitate.",
    "description": "Measures defining operational roles and systemic clarity.",
    "descriptionRo": "Măsoară clarificarea rolurilor și responsabilităților în echipă.",
    "agreementExplanation": "Agreement favors Te: defining operational ownership and workflow accountability.",
    "agreementExplanationRo": "Acordul favorizează Te: alocarea ordonată a rolurilor pentru eficiență colectivă.",
    "disagreementExplanation": "Disagreement indicates less agreement with Te and shifts contribution toward Fi.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Te și orientează contribuția spre Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S32",
    "format": "short",
    "category": "function",
    "target": "Te",
    "oppositePole": "Fi",
    "agreementPole": "Te",
    "text": "I prioritize tasks according to urgency and impact.",
    "textRo": "Prioritizez sarcinile în funcție de urgență și impact.",
    "description": "Measures objective prioritization based on utility matrices.",
    "descriptionRo": "Măsoară prioritizarea rațională a priorităților după impactul real.",
    "agreementExplanation": "Agreement favors Te: strategic triage and resource efficiency.",
    "agreementExplanationRo": "Acordul favorizează Te: prioritizare rațională a resurselor și timpului.",
    "disagreementExplanation": "Disagreement indicates less agreement with Te and shifts contribution toward Fi.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Te și orientează contribuția spre Fi.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S33",
    "format": "short",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I check whether each step in an argument follows logically.",
    "textRo": "Verific dacă fiecare pas dintr-un argument decurge logic din cel precedent.",
    "description": "Measures deductive validation of reasoning steps.",
    "descriptionRo": "Măsoară verificarea deductivă pas cu pas a coerenței argumentului.",
    "agreementExplanation": "Agreement favors Ti: deductive rigor and logical continuity.",
    "agreementExplanationRo": "Acordul favorizează Ti: rigoare analitică și lanț deductiv fără cusur.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ti and shifts contribution toward Fe.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ti și orientează contribuția spre Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S34",
    "format": "short",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I question definitions when explanations seem imprecise.",
    "textRo": "Pun la îndoială definițiile când explicațiile par imprecise.",
    "description": "Measures semantic precision and conceptual exactness.",
    "descriptionRo": "Măsoară exigența pentru precizia termenilor și exactitatea semantică.",
    "agreementExplanation": "Agreement favors Ti: conceptual exactness and precise vocabulary.",
    "agreementExplanationRo": "Acordul favorizează Ti: clarificarea precisă a termenilor și conceptelor.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ti and shifts contribution toward Fe.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ti și orientează contribuția spre Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S35",
    "format": "short",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I notice contradictions between statements that sound convincing.",
    "textRo": "Observ contradicții între afirmații care sună convingător.",
    "description": "Measures spotting logical inconsistencies behind persuasive rhetoric.",
    "descriptionRo": "Măsoară depistarea contradicțiilor ascunse sub un limbaj persuasiv.",
    "agreementExplanation": "Agreement favors Ti: detecting analytical contradictions.",
    "agreementExplanationRo": "Acordul favorizează Ti: discernământ critic în identificarea fisurilor logice.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ti and shifts contribution toward Fe.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ti și orientează contribuția spre Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S36",
    "format": "short",
    "category": "function",
    "target": "Ti",
    "oppositePole": "Fe",
    "agreementPole": "Ti",
    "text": "I need to understand a mechanism before accepting its explanation.",
    "textRo": "Trebuie să înțeleg mecanismul din spate înainte de a accepta o explicație.",
    "description": "Measures structural deconstruction and inner comprehension.",
    "descriptionRo": "Măsoară nevoia de a pătrunde mecanismul intern înainte de a da crezare.",
    "agreementExplanation": "Agreement favors Ti: foundational mechanical understanding.",
    "agreementExplanationRo": "Acordul favorizează Ti: dorința de înțelegere structurală a principiilor de bază.",
    "disagreementExplanation": "Disagreement indicates less agreement with Ti and shifts contribution toward Fe.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Ti și orientează contribuția spre Fe.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S37",
    "format": "short",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I notice when someone feels excluded from a group.",
    "textRo": "Observ când cineva se simte exclus dintr-un grup.",
    "description": "Measures interpersonal empathy and social inclusion awareness.",
    "descriptionRo": "Măsoară sensibilitatea empatică la starea de integrare a celor din grup.",
    "agreementExplanation": "Agreement favors Fe: awareness of inclusion and social bonding.",
    "agreementExplanationRo": "Acordul favorizează Fe: atenție empatică la sentimentul de apartenență al celorlalți.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fe and shifts contribution toward Ti.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fe și orientează contribuția spre Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S38",
    "format": "short",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I adjust my wording to prevent unnecessary interpersonal tension.",
    "textRo": "Îmi adaptez cuvintele pentru a preveni tensiuni inutile.",
    "description": "Measures relational consideration in verbal communication.",
    "descriptionRo": "Măsoară adaptarea diplomatică a comunicării pentru a proteja buna înțelegere.",
    "agreementExplanation": "Agreement favors Fe: considerate and harmonizing communication.",
    "agreementExplanationRo": "Acordul favorizează Fe: grijă pentru ton și păstrarea unei atmosfere constructive.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fe and shifts contribution toward Ti.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fe și orientează contribuția spre Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S39",
    "format": "short",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I help people find common ground during disagreements.",
    "textRo": "Îi ajut pe oameni să găsească un numitor comun în neînțelegeri.",
    "description": "Measures social mediation and facilitating interpersonal consensus.",
    "descriptionRo": "Măsoară abilitatea de mediere și de apropiere a punctelor de vedere diferite.",
    "agreementExplanation": "Agreement favors Fe: relational bridging and group consensus building.",
    "agreementExplanationRo": "Acordul favorizează Fe: mediere empatică pentru restabilirea cooperării.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fe and shifts contribution toward Ti.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fe și orientează contribuția spre Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S40",
    "format": "short",
    "category": "function",
    "target": "Fe",
    "oppositePole": "Ti",
    "agreementPole": "Fe",
    "text": "I consider group morale when introducing difficult changes.",
    "textRo": "Țin cont de moralul grupului când introduc schimbări dificile.",
    "description": "Measures leadership sensitivity to collective morale and shared sentiment.",
    "descriptionRo": "Măsoară susținerea moralului colectiv în momentele de transformare.",
    "agreementExplanation": "Agreement favors Fe: empathetic collective stewardship.",
    "agreementExplanationRo": "Acordul favorizează Fe: respect pentru climatul uman și încrederea colectivă.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fe and shifts contribution toward Ti.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fe și orientează contribuția spre Ti.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S41",
    "format": "short",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I reject choices that violate my core values.",
    "textRo": "Refuz alegerile care îmi încalcă valorile fundamentale.",
    "description": "Measures firm boundary protection for personal ethical convictions.",
    "descriptionRo": "Măsoară refuzul ferm de a face compromisuri etice contrare sinelui.",
    "agreementExplanation": "Agreement favors Fi: steadfast adherence to individual ethical values.",
    "agreementExplanationRo": "Acordul favorizează Fi: protejarea fermă a principiilor morale proprii.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fi and shifts contribution toward Te.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fi și orientează contribuția spre Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S42",
    "format": "short",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I need my actions to feel personally authentic.",
    "textRo": "Am nevoie ca acțiunile mele să fie profund autentice.",
    "description": "Measures aligning outward behavior with internal authenticity.",
    "descriptionRo": "Măsoară nevoia ca faptele exterioare să fie în armonie cu sinele interior.",
    "agreementExplanation": "Agreement favors Fi: deep congruence between action and identity.",
    "agreementExplanationRo": "Acordul favorizează Fi: autenticitate sufletească și respingerea fațadei.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fi and shifts contribution toward Te.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fi și orientează contribuția spre Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S43",
    "format": "short",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I evaluate choices against my own deeply held principles.",
    "textRo": "Îmi evaluez alegerile raportându-mă la propriile mele principii.",
    "description": "Measures self-directed moral evaluation.",
    "descriptionRo": "Măsoară raportarea deciziilor la propria conștiință și busolă internă.",
    "agreementExplanation": "Agreement favors Fi: autonomous internal value system.",
    "agreementExplanationRo": "Acordul favorizează Fi: independență etică și respect pentru propriile convingeri.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fi and shifts contribution toward Te.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fi și orientează contribuția spre Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S44",
    "format": "short",
    "category": "function",
    "target": "Fi",
    "oppositePole": "Te",
    "agreementPole": "Fi",
    "text": "I distinguish personal convictions from others' expectations.",
    "textRo": "Disting clar convingerile mele de așteptările celorlalți.",
    "description": "Measures boundary clarity between self-identity and external social norms.",
    "descriptionRo": "Măsoară separarea clară dintre identitatea personală și presiunea socială.",
    "agreementExplanation": "Agreement favors Fi: individual value boundaries distinct from collective pressure.",
    "agreementExplanationRo": "Acordul favorizează Fi: claritate lăuntrică în fața conformismului exterior.",
    "disagreementExplanation": "Disagreement indicates less agreement with Fi and shifts contribution toward Te.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Fi și orientează contribuția spre Te.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S45",
    "format": "short",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I learn unfamiliar skills by trying them directly.",
    "textRo": "Învăț abilități noi încercându-le direct în practică.",
    "description": "Measures hands-on tactile and kinesthetic learning.",
    "descriptionRo": "Măsoară învățarea practică, tactilă și directă prin încercare.",
    "agreementExplanation": "Agreement favors Se: direct experiential learning.",
    "agreementExplanationRo": "Acordul favorizează Se: învățare practică prin acțiune și contact nemijlocit.",
    "disagreementExplanation": "Disagreement indicates less agreement with Se and shifts contribution toward Ni.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Se și orientează contribuția spre Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S46",
    "format": "short",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I react quickly when circumstances change unexpectedly.",
    "textRo": "Reacționez rapid când circumstanțele se schimbă pe neașteptate.",
    "description": "Measures agility and quick adaptation to changing sensory cues.",
    "descriptionRo": "Măsoară reflexele rapide și adaptarea spontană la neprevăzut.",
    "agreementExplanation": "Agreement favors Se: tactical adaptability in changing environments.",
    "agreementExplanationRo": "Acordul favorizează Se: adaptabilitate promptă la condițiile concrete ale momentului.",
    "disagreementExplanation": "Disagreement indicates less agreement with Se and shifts contribution toward Ni.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Se și orientează contribuția spre Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S47",
    "format": "short",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I notice immediate changes in my physical surroundings.",
    "textRo": "Observ imediat schimbările apărute în mediul meu fizic.",
    "description": "Measures sharp real-time environmental sensory awareness.",
    "descriptionRo": "Măsoară atenția vie la modificările concrete din mediul ambiant.",
    "agreementExplanation": "Agreement favors Se: acute sensory attentiveness to physical reality.",
    "agreementExplanationRo": "Acordul favorizează Se: vigilență senzorială și percepție ascuțită a mediului.",
    "disagreementExplanation": "Disagreement indicates less agreement with Se and shifts contribution toward Ni.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Se și orientează contribuția spre Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S48",
    "format": "short",
    "category": "function",
    "target": "Se",
    "oppositePole": "Ni",
    "agreementPole": "Se",
    "text": "I prefer experiencing an activity over imagining it beforehand.",
    "textRo": "Prefer să trăiesc o experiență direct decât să mi-o imaginez dinainte.",
    "description": "Measures preference for tangible reality over mental simulation.",
    "descriptionRo": "Măsoară preferința pentru contactul viu cu realitatea în fața reveriei.",
    "agreementExplanation": "Agreement favors Se: immersive direct engagement over speculation.",
    "agreementExplanationRo": "Acordul favorizează Se: trăire nemijlocită și prezență deplină în acțiune.",
    "disagreementExplanation": "Disagreement indicates less agreement with Se and shifts contribution toward Ni.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Se și orientează contribuția spre Ni.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S49",
    "format": "short",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "I compare new situations with specific past experiences.",
    "textRo": "Compar situațiile noi cu experiențe specifice din trecut.",
    "description": "Measures comparing current occurrences with detailed memory archives.",
    "descriptionRo": "Măsoară raportarea noilor situații la memoria experiențelor anterioare.",
    "agreementExplanation": "Agreement favors Si: anchoring understanding in personal precedent.",
    "agreementExplanationRo": "Acordul favorizează Si: evaluare metodică prin analogie cu trecutul trăit.",
    "disagreementExplanation": "Disagreement indicates less agreement with Si and shifts contribution toward Ne.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Si și orientează contribuția spre Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S50",
    "format": "short",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "I prefer understanding a proven method before replacing it.",
    "textRo": "Prefer să înțeleg bine o metodă dovedită înainte de a o înlocui.",
    "description": "Measures respect for proven track records and continuity.",
    "descriptionRo": "Măsoară prudența procedurală și valorizarea eficienței confirmate.",
    "agreementExplanation": "Agreement favors Si: stability and valuing tested experience.",
    "agreementExplanationRo": "Acordul favorizează Si: stabilitate și respect pentru practicile confirmate.",
    "disagreementExplanation": "Disagreement indicates less agreement with Si and shifts contribution toward Ne.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Si și orientează contribuția spre Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S51",
    "format": "short",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "I remember practical details that help in similar situations.",
    "textRo": "Rețin detalii practice care mă ajută în situații similare.",
    "description": "Measures retaining specific operational details from experience.",
    "descriptionRo": "Măsoară memoria detaliilor concrete pentru folosire ulterioară.",
    "agreementExplanation": "Agreement favors Si: detailed sensory memory recall.",
    "agreementExplanationRo": "Acordul favorizează Si: memorie precisă a detaliilor tehnice și de context.",
    "disagreementExplanation": "Disagreement indicates less agreement with Si and shifts contribution toward Ne.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Si și orientează contribuția spre Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  },
  {
    "id": "S52",
    "format": "short",
    "category": "function",
    "target": "Si",
    "oppositePole": "Ne",
    "agreementPole": "Si",
    "text": "I notice when something differs from my usual experience.",
    "textRo": "Observ imediat când ceva diferă de experiența mea obișnuită.",
    "description": "Measures sensitivity to deviations from established internal standards.",
    "descriptionRo": "Măsoară sesizarea instantanee a abaterilor de la norma familiară.",
    "agreementExplanation": "Agreement favors Si: benchmarking against internalized familiar baselines.",
    "agreementExplanationRo": "Acordul favorizează Si: atenție fină la discrepanțele față de tiparul cunoscut.",
    "disagreementExplanation": "Disagreement indicates less agreement with Si and shifts contribution toward Ne.",
    "disagreementExplanationRo": "Dezacordul indică o preferință mai scăzută pentru Si și orientează contribuția spre Ne.",
    "neutralExplanation": "Neutral contributes no directional score.",
    "neutralExplanationRo": "Răspunsul neutru nu înclină scorul în nicio direcție."
  }
];

export const QUESTIONS_80 = QUESTIONS_100.slice(0, 80); // Compatibility alias
export const ALL_QUESTIONS = QUESTIONS_100;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestionsForMode(modeKey = "standard", shouldShuffle = true) {
  const normalizedKey = (modeKey === "quick" || modeKey === "fast") ? "rapid" : ((modeKey === "recommended") ? "standard" : modeKey);
  const mode = TEST_MODES[normalizedKey] || TEST_MODES.standard;

  let questions = [];
  if (mode.totalQuestions === 24) {
    // Fast: All 24 Deep questions (8 axis + 16 function items)
    // Random as axes and functions
    const deepQuestions = QUESTIONS_100.filter(q => q.format === "deep");
    questions = shouldShuffle ? shuffle(deepQuestions) : [...deepQuestions];
  } else if (mode.totalQuestions === 60) {
    // Standard: 20 axis items + 40 function items (60 total)
    // Flow:
    // 1. Întrebări complexe (Deep): 8 axis + 16 function = 24 items (shuffled internally)
    // 2. Întrebări simple (Short): 4 axis + 8 function = 12 items (shuffled internally)
    // 3. Ce ai alege la final (Would You Rather): 8 axis + 16 function = 24 items (shuffled internally)
    const deepAxis = QUESTIONS_100.filter(q => q.format === "deep" && q.category === "axis"); // 8
    const deepFunc = QUESTIONS_100.filter(q => q.format === "deep" && q.category === "function"); // 16
    const deepPhase = shouldShuffle ? shuffle([...deepAxis, ...deepFunc]) : [...deepAxis, ...deepFunc]; // 24

    const shortAxis = ["S01", "S06", "S11", "S16"].map(id => QUESTIONS_100.find(q => q.id === id)); // 4
    const shortFunc = ["S21", "S25", "S29", "S33", "S37", "S41", "S45", "S49"].map(id => QUESTIONS_100.find(q => q.id === id)); // 8
    const shortPhase = shouldShuffle ? shuffle([...shortAxis, ...shortFunc]) : [...shortAxis, ...shortFunc]; // 12

    const wyrAxis = QUESTIONS_100.filter(q => q.format === "wouldYouRather" && q.category === "axis"); // 8
    const wyrFunc = QUESTIONS_100.filter(q => q.format === "wouldYouRather" && q.category === "function"); // 16
    const wyrPhase = shouldShuffle ? shuffle([...wyrAxis, ...wyrFunc]) : [...wyrAxis, ...wyrFunc]; // 24

    questions = [...deepPhase, ...shortPhase, ...wyrPhase];
  } else {
    // Complete: All 100 questions
    // Flow:
    // 1. Întrebări complexe (Deep): 24 items (8 axis + 16 function, shuffled internally)
    // 2. Întrebări simple (Short): 52 items (20 axis + 32 function, shuffled internally)
    // 3. Ce ai alege la final (Would You Rather): 24 items (8 axis + 16 function, shuffled internally)
    const deepPhase = QUESTIONS_100.filter(q => q.format === "deep"); // 24
    const shortPhase = QUESTIONS_100.filter(q => q.format === "short"); // 52
    const wyrPhase = QUESTIONS_100.filter(q => q.format === "wouldYouRather"); // 24

    const deepShuffled = shouldShuffle ? shuffle(deepPhase) : [...deepPhase];
    const shortShuffled = shouldShuffle ? shuffle(shortPhase) : [...shortPhase];
    const wyrShuffled = shouldShuffle ? shuffle(wyrPhase) : [...wyrPhase];

    questions = [...deepShuffled, ...shortShuffled, ...wyrShuffled];
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
  if (question.format === "wouldYouRather") {
    return {
      type: "wouldYouRather",
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
