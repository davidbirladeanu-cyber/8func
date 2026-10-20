/**
 * 8Func - State Management with Mode Selection & LocalStorage Persistence
 */

import { getQuestionsForMode, TEST_MODES } from "../data/questions.js";
import { calculateScores, parseResultsUrlPath } from "./scoring.js";

const STORAGE_KEYS = {
  MODE: "8func_mode_v2",
  ANSWERS: "8func_answers_v2",
  INDEX: "8func_current_index_v2",
  RANDOMIZED: "8func_randomized_v2",
  AUTO_ADVANCE: "8func_auto_advance_v2",
  THEME: "8func_theme_v2",
  LANG: "8func_lang_v2",
  SCREEN: "8func_screen_v2"
};

export class AppState {
  constructor() {
    // Language (ro or en) - defaults to ro
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
    this.lang = (savedLang === "en" || savedLang === "ro") ? savedLang : "ro";
    document.documentElement.setAttribute("lang", this.lang);

    // Mode (rapid, standard, complete)
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
    this.mode = TEST_MODES[savedMode] ? savedMode : "standard";

    // Ordering is always randomized within phases
    this.randomized = true;

    // Build question bank for mode
    this.questions = getQuestionsForMode(this.mode);

    // Load answers map
    try {
      this.answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS)) || {};
    } catch {
      this.answers = {};
    }

    // Load question index
    const savedIndex = parseInt(localStorage.getItem(STORAGE_KEYS.INDEX), 10);
    this.currentIndex = !isNaN(savedIndex) && savedIndex >= 0 && savedIndex < this.questions.length ? savedIndex : 0;

    // Auto advance on answer (always active on click)
    this.autoAdvance = true;

    // Theme (light or dark)
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      this.theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Screen state & URL results check
    const parsedUrlScores = parseResultsUrlPath(window.location.pathname) || parseResultsUrlPath(window.location.hash);
    if (parsedUrlScores) {
      this.screen = "results";
      this.urlResultsScores = parsedUrlScores;
    } else {
      this.urlResultsScores = null;
      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN);
      const { isComplete } = calculateScores(this.questions, this.answers);

      if (savedScreen === "results" || (isComplete && Object.keys(this.answers).length >= this.questions.length)) {
        this.screen = "results";
      } else if (savedScreen === "quiz" && Object.keys(this.answers).length > 0) {
        this.screen = "quiz";
      } else {
        this.screen = "welcome";
      }
    }

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
    this.save();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, this.mode);
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(this.answers));
      localStorage.setItem(STORAGE_KEYS.INDEX, this.currentIndex.toString());
      localStorage.setItem(STORAGE_KEYS.AUTO_ADVANCE, this.autoAdvance.toString());
      localStorage.setItem(STORAGE_KEYS.RANDOMIZED, this.randomized.toString());
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
      localStorage.setItem(STORAGE_KEYS.LANG, this.lang);
      localStorage.setItem(STORAGE_KEYS.SCREEN, this.screen);
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  selectMode(modeKey) {
    if (!TEST_MODES[modeKey]) return;
    this.mode = modeKey;
    this.questions = getQuestionsForMode(this.mode);
    this.answers = {};
    this.currentIndex = 0;
    this.urlResultsScores = null;
    this.screen = "quiz";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", "/");
    }
    this.notify();
  }

  showWelcome() {
    this.screen = "welcome";
    this.urlResultsScores = null;
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", "/");
    }
    this.notify();
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  getModeConfig() {
    return TEST_MODES[this.mode] || TEST_MODES.standard;
  }

  setAnswer(questionId, answerKey) {
    this.answers[questionId] = answerKey;
    this.notify();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.notify();
      return true;
    } else {
      const { isComplete } = calculateScores(this.questions, this.answers);
      if (isComplete) {
        this.screen = "results";
      }
      this.notify();
      return false;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notify();
      return true;
    }
    return false;
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.screen = "quiz";
      this.notify();
    }
  }

  toggleAutoAdvance() {
    this.autoAdvance = !this.autoAdvance;
    this.notify();
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    this.notify();
  }

  toggleLang() {
    this.lang = this.lang === "ro" ? "en" : "ro";
    document.documentElement.setAttribute("lang", this.lang);
    this.notify();
  }

  toggleRandomize() {
    this.randomized = !this.randomized;
    this.questions = getQuestionsForMode(this.mode, this.randomized);
    this.currentIndex = 0;
    this.notify();
  }

  showResults() {
    this.screen = "results";
    this.notify();
  }

  showQuiz() {
    this.screen = "quiz";
    this.notify();
  }

  resetQuiz() {
    this.questions = getQuestionsForMode(this.mode);
    this.answers = {};
    this.currentIndex = 0;
    this.urlResultsScores = null;
    this.screen = "quiz";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", "/");
    }
    this.notify();
  }
}
