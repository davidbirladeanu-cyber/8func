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
  ORDER: "8func_order_v2",
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

    // Question order mode: 'format' (Deep -> Short -> WYR -> Direct), 'function' (I -> E -> N -> S...), or 'random'
    const savedOrder = localStorage.getItem(STORAGE_KEYS.ORDER);
    this.orderMode = (savedOrder === "format" || savedOrder === "function" || savedOrder === "random")
      ? savedOrder
      : "format";
    this.randomized = this.orderMode === "random";

    // Build question bank for mode
    this.questions = getQuestionsForMode(this.mode, this.orderMode);

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

    // Load persisted user results for Match comparisons
    try {
      const savedLast = localStorage.getItem('8func_last_user_results');
      if (savedLast) this.lastUserResults = JSON.parse(savedLast);
    } catch (e) {}

    // Screen state & URL results check
    const isFiguresPath = window.location.pathname.includes("/figures") || window.location.hash === "#figures" || window.location.pathname.includes("/personalitati");
    const parsedUrlScores = parseResultsUrlPath(window.location.pathname) || parseResultsUrlPath(window.location.hash);
    if (parsedUrlScores) {
      this.screen = "results";
      this.urlResultsScores = parsedUrlScores;
      this.lastUserResults = { percentages: parsedUrlScores.percentages, axisScores: parsedUrlScores.axisScores };
      try {
        localStorage.setItem('8func_last_user_results', JSON.stringify(this.lastUserResults));
      } catch (e) {}
    } else if (isFiguresPath) {
      this.screen = "figures";
      this.urlResultsScores = null;
    } else {
      this.urlResultsScores = null;
      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN);
      const { percentages, axisScores, isComplete } = calculateScores(this.questions, this.answers);
      if (isComplete && Object.keys(this.answers).length >= this.questions.length) {
        this.lastUserResults = { percentages, axisScores };
        try {
          localStorage.setItem('8func_last_user_results', JSON.stringify(this.lastUserResults));
        } catch (e) {}
      }

      if (savedScreen === "figures") {
        this.screen = "figures";
      } else if (savedScreen === "results" || (isComplete && Object.keys(this.answers).length >= this.questions.length)) {
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

      if (this.questions && this.answers) {
        const { percentages, axisScores, isComplete } = calculateScores(this.questions, this.answers);
        if (isComplete && Object.keys(this.answers).length >= this.questions.length) {
          this.lastUserResults = { percentages, axisScores };
          localStorage.setItem('8func_last_user_results', JSON.stringify(this.lastUserResults));
        }
      }
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  selectMode(modeKey) {
    if (!TEST_MODES[modeKey]) return;
    this.mode = modeKey;
    this.questions = getQuestionsForMode(this.mode, this.orderMode);
    this.answers = {};
    this.currentIndex = 0;
    this.urlResultsScores = null;
    this.screen = "quiz";
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "/";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", baseUrl);
    }
    this.notify();
  }

  showWelcome() {
    this.screen = "welcome";
    this.urlResultsScores = null;
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "/";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", baseUrl);
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

  toggleOrderMode() {
    const modes = ["format", "function", "random"];
    const nextIdx = (modes.indexOf(this.orderMode) + 1) % modes.length;
    this.setOrderMode(modes[nextIdx]);
  }

  setOrderMode(newOrder) {
    if (!["format", "function", "random"].includes(newOrder)) return;
    this.orderMode = newOrder;
    this.randomized = this.orderMode === "random";
    try {
      localStorage.setItem(STORAGE_KEYS.ORDER, this.orderMode);
    } catch (e) {
      console.warn("Storage save error", e);
    }

    const currentQId = this.questions[this.currentIndex]?.id;
    this.questions = getQuestionsForMode(this.mode, this.orderMode);

    if (currentQId) {
      const newIdx = this.questions.findIndex(q => q.id === currentQId);
      if (newIdx !== -1) {
        this.currentIndex = newIdx;
      } else {
        this.currentIndex = Math.min(this.currentIndex, this.questions.length - 1);
      }
    }
    this.notify();
  }

  toggleRandomize() {
    this.toggleOrderMode();
  }

  loadAnswers(importedAnswers, mode = null) {
    if (!importedAnswers || typeof importedAnswers !== "object") return;
    this.answers = importedAnswers;
    if (mode && TEST_MODES[mode]) {
      this.mode = mode;
    } else {
      const count = Object.keys(importedAnswers).length;
      if (count > 60) this.mode = "complete";
      else if (count > 24) this.mode = "standard";
      else this.mode = "rapid";
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(this.answers));
      localStorage.setItem(STORAGE_KEYS.MODE, this.mode);
    } catch (e) {
      console.warn("Storage save error", e);
    }
    this.urlResultsScores = null;
    this.questions = getQuestionsForMode(this.mode, this.orderMode);
    this.screen = "results";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", "/");
    }
    this.notify();
  }

  showResults() {
    this.screen = "results";
    this.notify();
  }

  showFigures() {
    this.screen = "figures";
    this.notify();
  }

  showQuiz() {
    this.screen = "quiz";
    this.notify();
  }

  resetQuiz() {
    this.questions = getQuestionsForMode(this.mode, this.orderMode);
    this.answers = {};
    this.currentIndex = 0;
    this.urlResultsScores = null;
    this.screen = "quiz";
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "/";
    if (window.location.pathname.includes("/results/")) {
      history.pushState(null, "", baseUrl);
    }
    this.notify();
  }
}
