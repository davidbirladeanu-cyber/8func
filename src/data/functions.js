/**
 * 8Func - Carl Jung & MBTI Cognitive Functions Definitions (English)
 */
export const COGNITIVE_FUNCTIONS = {
  Ne: {
    id: "Ne",
    code: "Ne",
    name: "Extraverted Intuition",
    nameRo: "Intuiție Extravertită",
    keywords: "Possibilities, Connections & Exploration",
    keywordsRo: "Posibilități, Conexiuni & Explorare",
    color: "#95637e",
    colorLight: "rgba(149, 99, 126, 0.15)",
    colorDark: "#581C6E",
    description: "Generates a multitude of new ideas, cross-contextual connections, and explores divergent future possibilities without restriction.",
    descriptionRo: "Generează o multitudine de idei noi, conexiuni între contexte diferite și explorează posibilități viitoare divergente fără restricții.",
    spectrumLeft: "Linear thinking • Anchored in the familiar",
    spectrumRight: "Divergent exploration • Infinite possibilities",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>`
  },
  Ni: {
    id: "Ni",
    code: "Ni",
    name: "Introverted Intuition",
    nameRo: "Intuiție Introvertită",
    keywords: "Underlying Patterns & Synthesis",
    keywordsRo: "Tipare Profunde & Sinteză",
    color: "#95637e",
    colorLight: "rgba(149, 99, 126, 0.15)",
    colorDark: "#1E2785",
    description: "Synthesizes complex data into singular, unifying insights, discerning unseen trajectories and long-term implications.",
    descriptionRo: "Sintetizează date complexe în intuiții unificatoare clare, discernând traiectorii nevăzute și implicații pe termen lung.",
    spectrumLeft: "Lacks big picture • Reactive in the moment",
    spectrumRight: "Deep synthesis • Strategic foresight",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`
  },
  Te: {
    id: "Te",
    code: "Te",
    name: "Extraverted Thinking",
    nameRo: "Gândire Extravertită",
    keywords: "External Organization & Efficiency",
    keywordsRo: "Organizare Externă & Eficiență",
    color: "#72cccd",
    colorLight: "rgba(114, 204, 205, 0.15)",
    colorDark: "#075985",
    description: "Structures the external environment, optimizes resources, and drives toward measurable outcomes based on objective logic.",
    descriptionRo: "Structurează mediul exterior, optimizează resursele și urmărește rezultate măsurabile pe baza logicii obiective.",
    spectrumLeft: "Disorganized • Indifferent to results",
    spectrumRight: "Maximum efficiency • Objective structure",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <path d="M3 9h18"></path>
      <path d="M9 21V9"></path>
    </svg>`
  },
  Ti: {
    id: "Ti",
    code: "Ti",
    name: "Introverted Thinking",
    nameRo: "Gândire Introvertită",
    keywords: "Internal Consistency & Precision",
    keywordsRo: "Coerență Internă & Precizie",
    color: "#72cccd",
    colorLight: "rgba(114, 204, 205, 0.15)",
    colorDark: "#115E59",
    description: "Deconstructs concepts to their foundational mechanics, demanding uncompromising internal consistency and precise definitions.",
    descriptionRo: "Deconstruiește conceptele la mecanismele lor fundamentale, cerând o consecvență internă riguroasă și definiții precise.",
    spectrumLeft: "Uncritical acceptance • Logical flaws",
    spectrumRight: "Analytical precision • Coherent internal models",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>`
  },
  Fe: {
    id: "Fe",
    code: "Fe",
    name: "Extraverted Feeling",
    nameRo: "Afectiv Extravertit",
    keywords: "Group Dynamics & Social Harmony",
    keywordsRo: "Dinamica Grupului & Armonie Socială",
    color: "#9ac262",
    colorLight: "rgba(154, 194, 98, 0.15)",
    colorDark: "#166534",
    description: "Attunes to the emotional atmosphere, nurtures collective cohesion, and evaluates choices by their impact on human relationships.",
    descriptionRo: "Se conectează la atmosfera emoțională, cultivă coeziunea colectivă și evaluează alegerile prin prisma impactului asupra relațiilor umane.",
    spectrumLeft: "Social detachment • Insensitive to group",
    spectrumRight: "Collective harmony • Active empathy",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>`
  },
  Fi: {
    id: "Fi",
    code: "Fi",
    name: "Introverted Feeling",
    nameRo: "Afectiv Introvertit",
    keywords: "Personal Values & Authenticity",
    keywordsRo: "Valori Personale & Autenticitate",
    color: "#9ac262",
    colorLight: "rgba(154, 194, 98, 0.15)",
    colorDark: "#9A3412",
    description: "Guided by a profound internal moral compass, demanding complete congruence between external actions and authentic self-identity.",
    descriptionRo: "Ghidat de o busolă morală interioară profundă, cere o concordanță totală între acțiunile exterioare și identitatea de sine autentică.",
    spectrumLeft: "Moral conformity • Disconnected from self",
    spectrumRight: "Pure authenticity • Deep moral compass",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>`
  },
  Se: {
    id: "Se",
    code: "Se",
    name: "Extraverted Sensing",
    nameRo: "Senzorial Extravertit",
    keywords: "Present Reality & Direct Action",
    keywordsRo: "Realitatea Prezentă & Acțiune Directă",
    color: "#e5c727",
    colorLight: "rgba(229, 199, 39, 0.15)",
    colorDark: "#991B1B",
    description: "Immersed directly in tangible real-time stimuli, reacting swiftly and adaptively to physical surroundings without hesitation.",
    descriptionRo: "Imersat direct în stimuli tangibili în timp real, reacționează rapid și adaptabil la mediul fizic fără ezitare.",
    spectrumLeft: "Disconnected from reality • Physical passivity",
    spectrumRight: "Grounded in the present • Rapid sensory response",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>`
  },
  Si: {
    id: "Si",
    code: "Si",
    name: "Introverted Sensing",
    nameRo: "Senzorial Introvertit",
    keywords: "Past Experience & Continuity",
    keywordsRo: "Experiență Trecută & Continuitate",
    color: "#e5c727",
    colorLight: "rgba(229, 199, 39, 0.15)",
    colorDark: "#78350F",
    description: "Compares current circumstances against an extensive internal library of past precedent, valuing reliability, routine, and detail.",
    descriptionRo: "Compară circumstanțele actuale cu o bibliotecă internă vastă de precedente trecute, prețuind fiabilitatea, stabilitatea și atenția la detalii.",
    spectrumLeft: "Detached from past • Procedural instability",
    spectrumRight: "Detailed memory • Continuity & stability",
    icon: `<svg class="e-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>`
  }
};

export const FUNCTIONS_LIST = ["Ne", "Ni", "Te", "Ti", "Fe", "Fi", "Se", "Si"];
