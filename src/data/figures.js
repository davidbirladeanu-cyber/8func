/**
 * 8Func - Historical & Notable Figures Database
 * Each figure has a defined 8-function cognitive profile vector [0 - 100]
 */

export const NOTABLE_FIGURES = [
  {
    id: "da_vinci",
    name: "Leonardo da Vinci",
    role: "Polymath, Painter & Inventor",
    mbti: "ENTP",
    avatar: "🎨",
    quote: "Study the science of art. Study the art of science. Learn how to see.",
    scores: { Ne: 96, Ti: 92, Te: 62, Ni: 72, Fe: 64, Fi: 48, Se: 66, Si: 42 }
  },
  {
    id: "einstein",
    name: "Albert Einstein",
    role: "Theoretical Physicist",
    mbti: "INTP",
    avatar: "⚛️",
    quote: "Imagination is more important than knowledge.",
    scores: { Ne: 92, Ti: 98, Te: 56, Ni: 74, Fe: 46, Fi: 52, Se: 32, Si: 58 }
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    role: "Inventor & Electrical Engineer",
    mbti: "INTJ",
    avatar: "⚡",
    quote: "The present is theirs; the future, for which I really worked, is mine.",
    scores: { Ne: 72, Ti: 82, Te: 90, Ni: 98, Fe: 34, Fi: 64, Se: 36, Si: 48 }
  },
  {
    id: "aristotle",
    name: "Aristotle",
    role: "Philosopher & Polymath",
    mbti: "ENTJ",
    avatar: "🏛️",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    scores: { Ne: 66, Ti: 82, Te: 95, Ni: 88, Fe: 52, Fi: 44, Se: 70, Si: 56 }
  },
  {
    id: "jung",
    name: "Carl Gustav Jung",
    role: "Psychiatrist & Psychoanalyst",
    mbti: "INFJ",
    avatar: "🧠",
    quote: "Who looks outside, dreams; who looks inside, awakes.",
    scores: { Ne: 74, Ti: 78, Te: 52, Ni: 98, Fe: 88, Fi: 72, Se: 36, Si: 46 }
  },
  {
    id: "marcus_aurelius",
    name: "Marcus Aurelius",
    role: "Roman Emperor & Stoic Philosopher",
    mbti: "INFJ",
    avatar: "👑",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    scores: { Ne: 56, Ti: 86, Te: 72, Ni: 94, Fe: 76, Fi: 68, Se: 42, Si: 62 }
  },
  {
    id: "shakespeare",
    name: "William Shakespeare",
    role: "Playwright & Poet",
    mbti: "INFP",
    avatar: "✒️",
    quote: "All the world's a stage, and all the men and women merely players.",
    scores: { Ne: 92, Ti: 52, Te: 38, Ni: 76, Fe: 72, Fi: 98, Se: 46, Si: 62 }
  },
  {
    id: "mark_twain",
    name: "Mark Twain",
    role: "Novelist, Humorist & Essayist",
    mbti: "ENFP",
    avatar: "📖",
    quote: "The secret of getting ahead is getting started.",
    scores: { Ne: 96, Ti: 64, Te: 62, Ni: 62, Fe: 70, Fi: 88, Se: 58, Si: 38 }
  },
  {
    id: "steve_jobs",
    name: "Steve Jobs",
    role: "Co-Founder of Apple & Visionary",
    mbti: "ENTJ",
    avatar: "💻",
    quote: "Stay hungry, stay foolish.",
    scores: { Ne: 86, Ti: 66, Te: 94, Ni: 92, Fe: 54, Fi: 46, Se: 76, Si: 34 }
  },
  {
    id: "alan_turing",
    name: "Alan Turing",
    role: "Mathematician & Computer Scientist",
    mbti: "INTP",
    avatar: "🔐",
    quote: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.",
    scores: { Ne: 88, Ti: 98, Te: 62, Ni: 72, Fe: 34, Fi: 54, Se: 38, Si: 60 }
  },
  {
    id: "marie_curie",
    name: "Marie Curie",
    role: "Physicist & Chemist (Nobel Laureate)",
    mbti: "INTJ",
    avatar: "🧪",
    quote: "Nothing in life is to be feared, it is only to be understood.",
    scores: { Ne: 68, Ti: 86, Te: 88, Ni: 92, Fe: 36, Fi: 60, Se: 42, Si: 66 }
  },
  {
    id: "churchill",
    name: "Winston Churchill",
    role: "British Statesman & Wartime Leader",
    mbti: "ESTP",
    avatar: "🦁",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    scores: { Ne: 62, Ti: 84, Te: 78, Ni: 42, Fe: 68, Fi: 52, Se: 96, Si: 46 }
  },
  {
    id: "theodore_roosevelt",
    name: "Theodore Roosevelt",
    role: "US President & Explorer",
    mbti: "ESTP",
    avatar: "🧭",
    quote: "Do what you can, with what you have, where you are.",
    scores: { Ne: 64, Ti: 76, Te: 86, Ni: 56, Fe: 64, Fi: 54, Se: 94, Si: 52 }
  },
  {
    id: "george_washington",
    name: "George Washington",
    role: "Founding Father & 1st US President",
    mbti: "ISTJ",
    avatar: "🦅",
    quote: "Associate yourself with men of good quality if you esteem your own reputation.",
    scores: { Ne: 34, Ti: 72, Te: 90, Ni: 48, Fe: 52, Fi: 66, Se: 62, Si: 96 }
  },
  {
    id: "queen_elizabeth",
    name: "Queen Elizabeth II",
    role: "Queen of the United Kingdom",
    mbti: "ISTJ",
    avatar: "👑",
    quote: "I declare before you all that my whole life shall be devoted to your service.",
    scores: { Ne: 32, Ti: 66, Te: 86, Ni: 46, Fe: 64, Fi: 68, Se: 48, Si: 98 }
  },
  {
    id: "mother_teresa",
    name: "Mother Teresa",
    role: "Humanitarian & Saint",
    mbti: "ISFJ",
    avatar: "🕊️",
    quote: "Peace begins with a smile.",
    scores: { Ne: 34, Ti: 44, Te: 42, Ni: 48, Fe: 94, Fi: 76, Se: 52, Si: 95 }
  },
  {
    id: "martin_luther_king",
    name: "Martin Luther King Jr.",
    role: "Civil Rights Leader & Minister",
    mbti: "ENFJ",
    avatar: "🎙️",
    quote: "Darkness cannot drive out darkness; only light can do that.",
    scores: { Ne: 72, Ti: 54, Te: 58, Ni: 92, Fe: 98, Fi: 78, Se: 66, Si: 44 }
  },
  {
    id: "nelson_mandela",
    name: "Nelson Mandela",
    role: "Anti-Apartheid Activist & Statesman",
    mbti: "ENFJ",
    avatar: "🌍",
    quote: "It always seems impossible until it's done.",
    scores: { Ne: 66, Ti: 58, Te: 64, Ni: 90, Fe: 96, Fi: 74, Se: 62, Si: 50 }
  },
  {
    id: "frida_kahlo",
    name: "Frida Kahlo",
    role: "Artist & Visual Pioneer",
    mbti: "ISFP",
    avatar: "🌺",
    quote: "I paint my own reality.",
    scores: { Ne: 66, Ti: 44, Te: 36, Ni: 68, Fe: 62, Fi: 98, Se: 92, Si: 50 }
  },
  {
    id: "mozart",
    name: "Wolfgang Amadeus Mozart",
    role: "Classical Composer",
    mbti: "ESFP",
    avatar: "🎼",
    quote: "The music is not in the notes, but in the silence between.",
    scores: { Ne: 72, Ti: 52, Te: 62, Ni: 38, Fe: 68, Fi: 90, Se: 98, Si: 42 }
  },
  {
    id: "benjamin_franklin",
    name: "Benjamin Franklin",
    role: "Polymath, Statesman & Scientist",
    mbti: "ENTP",
    avatar: "🪁",
    quote: "An investment in knowledge pays the best interest.",
    scores: { Ne: 95, Ti: 90, Te: 76, Ni: 68, Fe: 72, Fi: 50, Se: 60, Si: 54 }
  },
  {
    id: "isaac_newton",
    name: "Sir Isaac Newton",
    role: "Mathematician, Astronomer & Physicist",
    mbti: "INTJ",
    avatar: "🍎",
    quote: "If I have seen further, it is by standing on the shoulders of giants.",
    scores: { Ne: 56, Ti: 94, Te: 88, Ni: 98, Fe: 24, Fi: 52, Se: 26, Si: 62 }
  },
  {
    id: "bruce_lee",
    name: "Bruce Lee",
    role: "Martial Artist, Philosopher & Actor",
    mbti: "ISTP",
    avatar: "🥋",
    quote: "Be like water, my friend.",
    scores: { Ne: 62, Ti: 96, Te: 68, Ni: 72, Fe: 44, Fi: 58, Se: 95, Si: 48 }
  },
  {
    id: "eleanor_roosevelt",
    name: "Eleanor Roosevelt",
    role: "First Lady, Diplomat & Activist",
    mbti: "ENFJ",
    avatar: "📜",
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    scores: { Ne: 70, Ti: 54, Te: 68, Ni: 88, Fe: 95, Fi: 78, Se: 60, Si: 56 }
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
