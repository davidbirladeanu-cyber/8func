/**
 * 8Func - Historical & Notable Figures Database
 * Each figure has a defined 8-function cognitive profile vector [0 - 100] and photo portrait
 */

export const NOTABLE_FIGURES = [
  {
    id: "marcus_aurelius",
    name: "Marcus Aurelius",
    role: "Roman Emperor & Stoic Philosopher",
    mbti: "INFJ",
    avatar: "👑",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marcus_Aurelius_Met_1989.176.jpg/220px-Marcus_Aurelius_Met_1989.176.jpg",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    scores: { Ne: 56, Ti: 86, Te: 72, Ni: 94, Fe: 76, Fi: 68, Se: 42, Si: 62 }
  },
  {
    id: "foucault",
    name: "Michel Foucault",
    role: "Philosopher & Social Theorist",
    mbti: "INTP",
    avatar: "📚",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Michel_Foucault_1974.jpg/220px-Michel_Foucault_1974.jpg",
    quote: "Knowledge is not for knowing: knowledge is for cutting.",
    scores: { Ne: 90, Ti: 95, Te: 60, Ni: 80, Fe: 48, Fi: 54, Se: 40, Si: 55 }
  },
  {
    id: "chomsky",
    name: "Noam Chomsky",
    role: "Linguist & Intellectual Critic",
    mbti: "INFJ",
    avatar: "🌐",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Noam_Chomsky_portrait_2017_retouched.png/220px-Noam_Chomsky_portrait_2017_retouched.png",
    quote: "If we choose, we can live in a world of comforting illusion.",
    scores: { Ne: 78, Ti: 82, Te: 65, Ni: 95, Fe: 86, Fi: 70, Se: 32, Si: 50 }
  },
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    role: "Philosopher & Cultural Critic",
    mbti: "INTJ",
    avatar: "⚡",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/220px-Nietzsche187a.jpg",
    quote: "He who has a why to live can bear almost any how.",
    scores: { Ne: 70, Ti: 84, Te: 88, Ni: 98, Fe: 32, Fi: 86, Se: 40, Si: 42 }
  },
  {
    id: "trump",
    name: "Donald Trump",
    role: "Politician & Real Estate Developer",
    mbti: "ESTP",
    avatar: "🏢",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg",
    quote: "Think big and kick ass in business and life.",
    scores: { Ne: 65, Ti: 68, Te: 85, Ni: 38, Fe: 60, Fi: 50, Se: 98, Si: 44 }
  },
  {
    id: "da_vinci",
    name: "Leonardo da Vinci",
    role: "Polymath, Painter & Inventor",
    mbti: "ENTP",
    avatar: "🎨",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/220px-Leonardo_self.jpg",
    quote: "Study the science of art. Study the art of science. Learn how to see.",
    scores: { Ne: 96, Ti: 92, Te: 62, Ni: 72, Fe: 64, Fi: 48, Se: 66, Si: 42 }
  },
  {
    id: "einstein",
    name: "Albert Einstein",
    role: "Theoretical Physicist",
    mbti: "INTP",
    avatar: "⚛️",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/220px-Albert_Einstein_Head.jpg",
    quote: "Imagination is more important than knowledge.",
    scores: { Ne: 92, Ti: 98, Te: 56, Ni: 74, Fe: 46, Fi: 52, Se: 32, Si: 58 }
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    role: "Inventor & Electrical Engineer",
    mbti: "INTJ",
    avatar: "⚡",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/220px-N.Tesla.JPG",
    quote: "The present is theirs; the future, for which I really worked, is mine.",
    scores: { Ne: 72, Ti: 82, Te: 90, Ni: 98, Fe: 34, Fi: 64, Se: 36, Si: 48 }
  },
  {
    id: "aristotle",
    name: "Aristotle",
    role: "Philosopher & Polymath",
    mbti: "ENTJ",
    avatar: "🏛️",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/220px-Aristotle_Altemps_Inv8575.jpg",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    scores: { Ne: 66, Ti: 82, Te: 95, Ni: 88, Fe: 52, Fi: 44, Se: 70, Si: 56 }
  },
  {
    id: "jung",
    name: "Carl Gustav Jung",
    role: "Psychiatrist & Psychoanalyst",
    mbti: "INFJ",
    avatar: "🧠",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Carl_Gustav_Jung_1910.jpg/220px-Carl_Gustav_Jung_1910.jpg",
    quote: "Who looks outside, dreams; who looks inside, awakes.",
    scores: { Ne: 74, Ti: 78, Te: 52, Ni: 98, Fe: 88, Fi: 72, Se: 36, Si: 46 }
  },
  {
    id: "shakespeare",
    name: "William Shakespeare",
    role: "Playwright & Poet",
    mbti: "INFP",
    avatar: "✒️",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/220px-Shakespeare.jpg",
    quote: "All the world's a stage, and all the men and women merely players.",
    scores: { Ne: 92, Ti: 52, Te: 38, Ni: 76, Fe: 72, Fi: 98, Se: 46, Si: 62 }
  },
  {
    id: "mark_twain",
    name: "Mark Twain",
    role: "Novelist, Humorist & Essayist",
    mbti: "ENFP",
    avatar: "📖",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/220px-Mark_Twain_by_AF_Bradley.jpg",
    quote: "The secret of getting ahead is getting started.",
    scores: { Ne: 96, Ti: 64, Te: 62, Ni: 62, Fe: 70, Fi: 88, Se: 58, Si: 38 }
  },
  {
    id: "steve_jobs",
    name: "Steve Jobs",
    role: "Co-Founder of Apple & Visionary",
    mbti: "ENTJ",
    avatar: "💻",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/220px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg",
    quote: "Stay hungry, stay foolish.",
    scores: { Ne: 86, Ti: 66, Te: 94, Ni: 92, Fe: 54, Fi: 46, Se: 76, Si: 34 }
  },
  {
    id: "alan_turing",
    name: "Alan Turing",
    role: "Mathematician & Cryptanalyst",
    mbti: "INTP",
    avatar: "🔐",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/220px-Alan_Turing_Aged_16.jpg",
    quote: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.",
    scores: { Ne: 88, Ti: 98, Te: 62, Ni: 72, Fe: 34, Fi: 54, Se: 38, Si: 60 }
  },
  {
    id: "marie_curie",
    name: "Marie Curie",
    role: "Physicist & Chemist (Nobel Laureate)",
    mbti: "INTJ",
    avatar: "🧪",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.png/220px-Marie_Curie_c1920.png",
    quote: "Nothing in life is to be feared, it is only to be understood.",
    scores: { Ne: 68, Ti: 86, Te: 88, Ni: 92, Fe: 36, Fi: 60, Se: 42, Si: 66 }
  },
  {
    id: "churchill",
    name: "Winston Churchill",
    role: "British Statesman & Wartime Leader",
    mbti: "ESTP",
    avatar: "🦁",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_1941%2C_by_Yousuf_Karsh.jpg/220px-Sir_Winston_Churchill_-_1941%2C_by_Yousuf_Karsh.jpg",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    scores: { Ne: 62, Ti: 84, Te: 78, Ni: 42, Fe: 68, Fi: 52, Se: 96, Si: 46 }
  },
  {
    id: "isaac_newton",
    name: "Sir Isaac Newton",
    role: "Mathematician & Physicist",
    mbti: "INTJ",
    avatar: "🍎",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/220px-GodfreyKneller-IsaacNewton-1689.jpg",
    quote: "If I have seen further, it is by standing on the shoulders of giants.",
    scores: { Ne: 56, Ti: 94, Te: 88, Ni: 98, Fe: 24, Fi: 52, Se: 26, Si: 62 }
  },
  {
    id: "bruce_lee",
    name: "Bruce Lee",
    role: "Martial Artist & Philosopher",
    mbti: "ISTP",
    avatar: "🥋",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bruce_Lee_1973.jpg/220px-Bruce_Lee_1973.jpg",
    quote: "Be like water, my friend.",
    scores: { Ne: 62, Ti: 96, Te: 68, Ni: 72, Fe: 44, Fi: 58, Se: 95, Si: 48 }
  },
  {
    id: "frida_kahlo",
    name: "Frida Kahlo",
    role: "Visual Artist & Surrealist",
    mbti: "ISFP",
    avatar: "🌺",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/220px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
    quote: "I paint my own reality.",
    scores: { Ne: 66, Ti: 44, Te: 36, Ni: 68, Fe: 62, Fi: 98, Se: 92, Si: 50 }
  },
  {
    id: "mozart",
    name: "Wolfgang Amadeus Mozart",
    role: "Classical Composer & Prodigy",
    mbti: "ESFP",
    avatar: "🎼",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wolfgang-amadeus-mozart_1.jpg/220px-Wolfgang-amadeus-mozart_1.jpg",
    quote: "The music is not in the notes, but in the silence between.",
    scores: { Ne: 72, Ti: 52, Te: 62, Ni: 38, Fe: 68, Fi: 90, Se: 98, Si: 42 }
  },
  {
    id: "martin_luther_king",
    name: "Martin Luther King Jr.",
    role: "Civil Rights Leader & Minister",
    mbti: "ENFJ",
    avatar: "🎙️",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/220px-Martin_Luther_King%2C_Jr..jpg",
    quote: "Darkness cannot drive out darkness; only light can do that.",
    scores: { Ne: 72, Ti: 54, Te: 58, Ni: 92, Fe: 98, Fi: 78, Se: 66, Si: 44 }
  },
  {
    id: "nelson_mandela",
    name: "Nelson Mandela",
    role: "Anti-Apartheid Activist & Statesman",
    mbti: "ENFJ",
    avatar: "🌍",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/220px-Nelson_Mandela_1994.jpg",
    quote: "It always seems impossible until it's done.",
    scores: { Ne: 66, Ti: 58, Te: 64, Ni: 90, Fe: 96, Fi: 74, Se: 62, Si: 50 }
  }
];

const FUNCTIONS = ["Ne", "Ni", "Te", "Ti", "Fe", "Fi", "Se", "Si"];

/**
 * Calculates similarity percentage between a user's percentage vector and a figure
 * Mean Absolute Difference inverted to 0-100%
 */
export function calculateFigureSimilarity(userScores, figureScores) {
  let totalDiff = 0;
  FUNCTIONS.forEach(f => {
    const u = userScores[f] ?? 50;
    const fig = figureScores[f] ?? 50;
    totalDiff += Math.abs(u - fig);
  });
  const avgDiff = totalDiff / FUNCTIONS.length; // 0 to 100
  const similarity = Math.round(Math.max(0, Math.min(100, 100 - avgDiff)));
  return similarity;
}

/**
 * Returns Top 10 Similar and Top 10 Opposite Figures
 */
export function getRankedFigures(userScores) {
  const list = NOTABLE_FIGURES.map(fig => {
    const similarity = calculateFigureSimilarity(userScores, fig.scores);
    return {
      ...fig,
      similarity,
      oppositeScore: 100 - similarity
    };
  });

  const similar = [...list].sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  const opposite = [...list].sort((a, b) => a.similarity - b.similarity).slice(0, 10);

  return { similar, opposite, all: list };
}
