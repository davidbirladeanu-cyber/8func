/**
 * 8Func - 3D Personality Spectrum
 * An interactive, calm 3D spatial spectrum where:
 * - X: Extraversion vs Introversion (E% - I%)
 * - Z: Perceiving vs Judging (P% - J%)
 *   Forming the 4 Interaction Style Corners:
 *     - Colțul EP: E 100%, P 100%
 *     - Colțul EJ: E 100%, J 100%
 *     - Colțul IP: I 100%, P 100%
 *     - Colțul IJ: I 100%, J 100%
 * - Y: Intuition vs Sensing (N% - S%)
 * - Color: Temperament & Nature (NT, NF, SF, ST)
 * 100% percentage-based, zero lag, calm on-demand rendering.
 */

import { NOTABLE_FIGURES, calculateFigureSimilarity, getFigureRole } from "../data/figures.js";
import { MBTI_TYPES, getTypeTemperament } from "../data/mbtiTypes.js";
import { COGNITIVE_FUNCTIONS } from "../data/functions.js";
import { calculateScores } from "./scoring.js";
import { ICONS } from "./icons.js";
import { t } from "../data/translations.js";

// 3D Bounding Box Dimensions
const BOX_W = 1000; // X: Extraversion (+) vs Introversion (-)
const BOX_H = 750;  // Y: Intuition (+) vs Sensing (-)
const BOX_D = 1000; // Z: Perceiving (+) vs Judging (-)

const FUNCTIONS_LIST = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];

export const INTERACTION_STYLES = {
  EJ: {
    code: "EJ",
    name: "Directori (EJ)",
    nameEn: "Directors / In-Charge (EJ)",
    types: ["ENTJ", "ESTJ", "ENFJ", "ESFJ"],
    color: "#e11d48",
    colorBg: "rgba(225, 29, 72, 0.18)",
    desc: "Lideri orientați spre acțiune, decizii ferme, mobilizare și structură externă."
  },
  EP: {
    code: "EP",
    name: "Exploratori (EP)",
    nameEn: "Explorers / Initiators (EP)",
    types: ["ENTP", "ESTP", "ENFP", "ESFP"],
    color: "#f59e0b",
    colorBg: "rgba(245, 158, 11, 0.18)",
    desc: "Inițiatori entuziaști, brainstormeri flexibili, rapizi în adaptare și experimentare."
  },
  IJ: {
    code: "IJ",
    name: "Planificatori (IJ)",
    nameEn: "Planners / Chart-the-Course (IJ)",
    types: ["INTJ", "ISTJ", "INFJ", "ISFJ"],
    color: "#6366f1",
    colorBg: "rgba(99, 102, 241, 0.18)",
    desc: "Strategi reflexivi, concentrați pe previziune, traiectorie și structură profundă."
  },
  IP: {
    code: "IP",
    name: "Autonomi (IP)",
    nameEn: "Behind-the-Scenes / Observers (IP)",
    types: ["INTP", "ISTP", "INFP", "ISFP"],
    color: "#10b981",
    colorBg: "rgba(16, 185, 129, 0.18)",
    desc: "Gânditori independenți, analitici, orientați pe claritate internă și perfecțiune."
  }
};

export function getInteractionStyle(typeCode = "") {
  const upper = (typeCode || "").toUpperCase();
  const isE = upper.includes("E");
  const isJ = upper.includes("J");
  if (isE && isJ) return INTERACTION_STYLES.EJ;
  if (isE && !isJ) return INTERACTION_STYLES.EP;
  if (!isE && isJ) return INTERACTION_STYLES.IJ;
  return INTERACTION_STYLES.IP;
}

function getFuncTileColors(f) {
  if (f === "Ne" || f === "Ni") return { bg: "#95637e", text: "#ffffff" };
  if (f === "Te" || f === "Ti") return { bg: "#72cccd", text: "#0d2b2c" };
  if (f === "Se" || f === "Si") return { bg: "#e5c727", text: "#2a2100" };
  if (f === "Fe" || f === "Fi") return { bg: "#9ac262", text: "#142b08" };
  return { bg: "#95637e", text: "#ffffff" };
}

export class SpectrumController {
  constructor(app) {
    this.app = app;
    this.canvas = null;
    this.ctx = null;
    this.wrap = null;

    // 3D Spherical Orbit Camera
    this.camera = {
      theta: 0.52,      // Azimuth / Horizontal orbit angle (radians)
      phi: 0.32,        // Elevation / Pitch orbit angle (radians)
      radius: 1750,     // Distance from target
      target: { x: 0, y: 0, z: 0 },
      panX: 0,
      panY: 0
    };

    // Camera inertia
    this.velTheta = 0;
    this.velPhi = 0;

    // Active filter: "ALL" | "EJ" | "EP" | "IJ" | "IP" | "NT" | "NF" | "SF" | "ST"
    this.activeFilter = "ALL";
    this.activeView = "orbit";

    // Interaction state
    this.hoveredIndex = -1;
    this.selectedIndex = -1;
    this.userHovered = false;
    this.userSelected = false;

    this.isDragging = false;
    this.dragStart = { x: 0, y: 0, theta: 0, phi: 0 };
    this.dragDistance = 0;
    this.pointers = new Map();
    this.pinchStart = null;

    // Animation & rendering
    this.rafId = 0;
    this.cameraAnim = null;
    this.imageCache = new Map();

    // Search query
    this.searchQuery = "";

    // Build 3D data nodes (100% percentage-based coordinates)
    this.nodes = this.buildNodes();
  }

  buildNodes() {
    return NOTABLE_FIGURES.map((fig, idx) => {
      // 4 MBTI Axes Percentages
      const t = fig.axes ? fig.axes.T : (fig.mbti.includes("T") ? 75 : 25);
      const n = fig.axes ? fig.axes.N : (fig.mbti.includes("N") ? 75 : 25);
      const f = fig.axes ? fig.axes.F : 100 - t;
      const s = fig.axes ? fig.axes.S : 100 - n;
      const e = fig.axes ? fig.axes.E : (fig.mbti.includes("E") ? 75 : 25);
      const i = fig.axes ? fig.axes.I : 100 - e;
      const j = fig.axes ? fig.axes.J : (fig.mbti.includes("J") ? 75 : 25);
      const p = fig.axes ? fig.axes.P : 100 - j;

      // 100% PURE PERCENTAGE-BASED 3D COORDINATES:
      // X: Extraversion vs Introversion (E 100% -> +500, I 100% -> -500)
      const wx = ((e - 50) / 50) * (BOX_W / 2);

      // Z: Perceiving vs Judging (P 100% -> +500, J 100% -> -500)
      // This maps the 4 corners of (X, Z) cleanly:
      //  (+500, +500) -> Corner EP (E 100%, P 100%)
      //  (+500, -500) -> Corner EJ (E 100%, J 100%)
      //  (-500, +500) -> Corner IP (I 100%, P 100%)
      //  (-500, -500) -> Corner IJ (I 100%, J 100%)
      const wz = ((p - 50) / 50) * (BOX_D / 2);

      // Y: Intuition vs Sensing (N 100% -> +375 up, S 100% -> -375 down)
      const wy = ((n - 50) / 50) * (BOX_H / 2);

      const style = getInteractionStyle(fig.mbti);
      const temp = getTypeTemperament(fig.mbti);

      return {
        index: idx,
        id: fig.id,
        name: fig.name,
        profession: fig.profession,
        rawFig: fig,
        role: fig.role || fig.profession || "",
        mbti: fig.mbti,
        quote: fig.quote || "",
        photo: fig.photo,
        avatar: fig.avatar || fig.name.charAt(0),
        axes: fig.axes || { E: e, I: i, N: n, S: s, T: t, F: f, J: j, P: p },
        scores: fig.scores || {},
        tPct: t,
        nPct: n,
        fPct: f,
        sPct: s,
        ePct: e,
        iPct: i,
        jPct: j,
        pPct: p,
        x: wx,
        y: wy,
        z: wz,
        style,
        temp,
        color: temp.color,
        colorBg: temp.colorBg,
        tempName: temp.name
      };
    });
  }

  getUserData() {
    const state = this.app.state;
    let percentages = null;
    let axisScores = null;

    if (state.urlResultsScores) {
      percentages = state.urlResultsScores.percentages;
      axisScores = state.urlResultsScores.axisScores;
    } else if (state.lastUserResults) {
      percentages = state.lastUserResults.percentages;
      axisScores = state.lastUserResults.axisScores;
    } else if (state.questions && state.answers) {
      const scored = calculateScores(state.questions, state.answers);
      if (scored.isComplete && Object.keys(state.answers).length >= state.questions.length) {
        percentages = scored.percentages;
        axisScores = scored.axisScores;
      }
    }

    if (!percentages || !axisScores) {
      return { hasScores: false };
    }

    const t = axisScores?.TF?.roundA ?? 50;
    const n = axisScores?.NS?.roundA ?? 50;
    const f = axisScores?.TF?.roundB ?? (100 - t);
    const s = axisScores?.NS?.roundB ?? (100 - n);
    const e = axisScores?.EI?.roundA ?? 50;
    const i = axisScores?.EI?.roundB ?? (100 - e);
    const j = axisScores?.JP?.roundA ?? 50;
    const p = axisScores?.JP?.roundB ?? (100 - j);

    const derivedType = `${e >= i ? 'E' : 'I'}${n >= s ? 'N' : 'S'}${t >= f ? 'T' : 'F'}${j >= p ? 'J' : 'P'}`;
    const style = getInteractionStyle(derivedType);

    // Exact percentage-based 3D coordinates for user
    const wx = ((e - 50) / 50) * (BOX_W / 2);
    const wz = ((p - 50) / 50) * (BOX_D / 2);
    const wy = ((n - 50) / 50) * (BOX_H / 2);

    return {
      hasScores: true,
      userType: derivedType,
      tPct: t,
      nPct: n,
      fPct: f,
      sPct: s,
      ePct: e,
      iPct: i,
      jPct: j,
      pPct: p,
      x: wx,
      y: wy,
      z: wz,
      style,
      percentages,
      axisScores
    };
  }

  render() {
    const lang = this.app.state.lang || "ro";
    const isDark = this.app.state.theme === "dark";
    const userData = this.getUserData();
    const hasCompletedResults = userData.hasScores;

    this.app.root.innerHTML = `
      <div class="ed tree-page">
        <!-- Minimalist Header with Live Autocomplete -->
        <header class="sh tree-sh">
          <div class="sh-wrap">
            <button class="sh-logo" id="tree-nav-logo" type="button" aria-label="8Func Home">
              <b>8</b><span>func 3D</span>
            </button>
            <nav class="sh-links" aria-label="Web">
              <button type="button" class="sh-link-btn" id="tree-nav-test">${lang === 'ro' ? 'Test' : 'Quiz'}</button>
              <button type="button" class="sh-link-btn" id="tree-nav-figures">${lang === 'ro' ? 'Personalități' : 'Personalities'}</button>
              <button type="button" class="sh-link-btn active" aria-current="page">${lang === 'ro' ? 'Spectru 3D' : '3D Spectrum'}</button>
              <button type="button" class="sh-lang" id="tree-nav-lang">${lang === 'ro' ? 'RO' : 'EN'}</button>
              <button type="button" class="theme-toggle" id="tree-nav-theme" aria-label="Toggle Theme">${isDark ? ICONS.sun : ICONS.moon}</button>
            </nav>
            <div class="sh-actions">
              <div class="tree-search">
                <input 
                  type="search" 
                  id="tree-search-input" 
                  placeholder="${lang === 'ro' ? 'Caută personalitate…' : 'Search personality…'}" 
                  aria-label="${lang === 'ro' ? 'Caută personalitate' : 'Search personality'}" 
                  value="${this.searchQuery}"
                  autocomplete="off"
                />
                <ul class="tree-suggestions" id="tree-search-suggestions" style="display: none;"></ul>
              </div>
              <button class="sh-btn sh-btn-ghost" type="button" id="tree-btn-list-view">${lang === 'ro' ? 'Vezi în listă' : 'List view'}</button>
              <button class="sh-btn sh-btn-primary" type="button" id="tree-btn-start">
                <span>${hasCompletedResults ? (lang === 'ro' ? 'Rezultate' : 'Results') : (lang === 'ro' ? 'Fă testul' : 'Start')}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Fullscreen 3D Canvas Stage -->
        <main class="tree-stage" id="tree-stage">
          <div class="tree-canvas-wrap" id="tree-canvas-wrap">
            <canvas class="tree-canvas" id="tree-canvas" aria-label="3D Spectrum"></canvas>
          </div>

          <!-- 3D Hint -->
          <div class="tree-hint-3d">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            <span>${lang === 'ro' ? 'Trage pentru rotire 3D · Scroll pentru zoom' : 'Drag to rotate 3D · Scroll to zoom'}</span>
          </div>

          <!-- 3D Floating Stage Controls & Filter Toolbar -->
          <div class="tree-3d-controls" id="tree-3d-controls">
            <!-- View Mode Presets -->
            <div class="tree-3d-btn-group">
              <button type="button" class="tree-3d-btn active" data-view="orbit" id="btn-view-orbit" title="${lang === 'ro' ? 'Vedere 3D Orbit liberă' : 'Free 3D Orbit View'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span>3D Orbit</span>
              </button>
              <button type="button" class="tree-3d-btn" data-view="top" id="btn-view-top" title="${lang === 'ro' ? 'Planul Stilurilor (EJ, EP, IJ, IP de sus)' : 'Top-down styles view'}">
                <span>EJ · EP · IJ · IP (Colțuri)</span>
              </button>
              <button type="button" class="tree-3d-btn" data-view="front" id="btn-view-front" title="${lang === 'ro' ? 'Vedere frontală: Intuiție vs Senzorial' : 'Frontal view'}">
                <span>Intuiție · Senzorial</span>
              </button>
              ${userData.hasScores ? `
                <button type="button" class="tree-3d-btn" id="tree-3d-focus-user" title="${lang === 'ro' ? 'Centrează pe poziția ta' : 'Focus on you'}">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ffffff; box-shadow:0 0 5px #10b981;"></span>
                  <span>TU</span>
                </button>
              ` : ''}
              <button type="button" class="tree-3d-btn tree-3d-btn-icon" id="tree-3d-reset" title="${lang === 'ro' ? 'Resetează camera' : 'Reset Camera'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              </button>
            </div>

            <!-- Style & Temperament Filter Pills -->
            <div class="tree-3d-filter-group">
              <button type="button" class="tree-filter-pill active" data-filter="ALL">${lang === 'ro' ? 'Toți' : 'All'}</button>
              <span class="tree-filter-divider"></span>
              <button type="button" class="tree-filter-pill" data-filter="EJ" style="--pill-color: #e11d48;" title="Extraverted Judging: ENTJ, ESTJ, ENFJ, ESFJ">EJ</button>
              <button type="button" class="tree-filter-pill" data-filter="EP" style="--pill-color: #f59e0b;" title="Extraverted Perceiving: ENTP, ESTP, ENFP, ESFP">EP</button>
              <button type="button" class="tree-filter-pill" data-filter="IJ" style="--pill-color: #6366f1;" title="Introverted Judging: INTJ, ISTJ, INFJ, ISFJ">IJ</button>
              <button type="button" class="tree-filter-pill" data-filter="IP" style="--pill-color: #10b981;" title="Introverted Perceiving: INTP, ISTP, INFP, ISFP">IP</button>
              <span class="tree-filter-divider"></span>
              <button type="button" class="tree-filter-pill" data-filter="NT" style="--pill-color: #95637e;" title="Analysts: NT">NT</button>
              <button type="button" class="tree-filter-pill" data-filter="NF" style="--pill-color: #9ac262;" title="Diplomats: NF">NF</button>
              <button type="button" class="tree-filter-pill" data-filter="SF" style="--pill-color: #e5c727;" title="Explorers: SF">SF</button>
              <button type="button" class="tree-filter-pill" data-filter="ST" style="--pill-color: #72cccd;" title="Sentinels: ST">ST</button>
            </div>
          </div>

          <!-- Side Inspector Panel for Selected Person / User (Styled like fig-modal) -->
          <aside class="e-panel tree-panel" id="tree-panel" style="display: none;" aria-label="Personality detail"></aside>
        </main>
      </div>
    `;

    this.initCanvas();
    this.attachEvents();
  }

  initCanvas() {
    this.wrap = document.getElementById("tree-canvas-wrap");
    this.canvas = document.getElementById("tree-canvas");
    if (!this.wrap || !this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.requestFrame();
  }

  resizeCanvas() {
    if (!this.wrap || !this.canvas) return;
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  /**
   * On-demand frame scheduler: only renders when needed, 0% CPU when idle!
   */
  requestFrame() {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = 0;
        this.draw();
      });
    }
  }

  loadImage(url) {
    if (!url) return null;
    let img = this.imageCache.get(url);
    if (!img) {
      img = new Image();
      img.decoding = "async";
      img.crossOrigin = "anonymous";
      img.onload = () => this.requestFrame();
      img.src = url;
      this.imageCache.set(url, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  }

  /**
   * Projects a 3D point (x, y, z) to 2D screen coordinates using spherical orbit camera
   */
  project3D(x, y, z, cx, cy) {
    const { theta, phi, radius, target, panX, panY } = this.camera;

    // Relative to target
    const dx = x - target.x;
    const dy = y - target.y;
    const dz = z - target.z;

    // Rotate horizontally by theta (yaw)
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const x1 = dx * cosT - dz * sinT;
    const z1 = dx * sinT + dz * cosT;

    // Rotate vertically by phi (pitch)
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);
    const y2 = dy * cosP - z1 * sinP;
    const z2 = dy * sinP + z1 * cosP;

    // Camera depth & perspective scaling
    const dist = radius - z2;
    if (dist < 80) return null; // Behind camera

    const fov = 1150;
    const scale = fov / dist;

    return {
      sx: cx + x1 * scale + panX,
      sy: cy - y2 * scale + panY,
      scale,
      zDepth: z2 // Higher means closer to viewer
    };
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const wrap = this.wrap;
    if (!ctx || !canvas || !wrap) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const now = performance.now();
    const isDark = this.app.state.theme === "dark";

    // Calm camera inertia settling
    if (!this.isDragging) {
      if (Math.abs(this.velTheta) > 0.0002 || Math.abs(this.velPhi) > 0.0002) {
        this.camera.theta += this.velTheta;
        this.camera.phi = Math.max(-1.42, Math.min(1.42, this.camera.phi + this.velPhi));
        this.velTheta *= 0.85;
        this.velPhi *= 0.85;
        this.requestFrame();
      } else {
        this.velTheta = 0;
        this.velPhi = 0;
      }
    }

    // Camera fly animation
    if (this.cameraAnim) {
      const elapsed = now - this.cameraAnim.startTime;
      const p = Math.min(1, elapsed / this.cameraAnim.duration);
      const ease = 1 - Math.pow(1 - p, 3); // Cubic ease out

      const s = this.cameraAnim.start;
      const t = this.cameraAnim.target;

      this.camera.theta = s.theta + (t.theta - s.theta) * ease;
      this.camera.phi = s.phi + (t.phi - s.phi) * ease;
      this.camera.radius = s.radius + (t.radius - s.radius) * ease;
      this.camera.target.x = s.tx + (t.tx - s.tx) * ease;
      this.camera.target.y = s.ty + (t.ty - s.ty) * ease;
      this.camera.target.z = s.tz + (t.tz - s.tz) * ease;

      if (p < 1) {
        this.requestFrame();
      } else {
        this.cameraAnim = null;
      }
    }

    // Reset transform to DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Canvas background
    ctx.fillStyle = isDark ? "#0d0f12" : "#F4F1E8";
    ctx.fillRect(0, 0, w, h);

    const hw = BOX_W / 2;
    const hh = BOX_H / 2;
    const hd = BOX_D / 2;
    const floorY = -hh;

    // 1. Draw 3D Floor Grid at Y = -hh with calm subtle lines
    ctx.save();
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(16,16,16,0.05)";
    ctx.lineWidth = 1;

    const gridLines = 8;
    for (let i = 0; i <= gridLines; i++) {
      const gx = -hw + (BOX_W / gridLines) * i;
      const pStart = this.project3D(gx, floorY, -hd, cx, cy);
      const pEnd = this.project3D(gx, floorY, hd, cx, cy);
      if (pStart && pEnd) {
        ctx.beginPath();
        ctx.moveTo(pStart.sx, pStart.sy);
        ctx.lineTo(pEnd.sx, pEnd.sy);
        ctx.stroke();
      }
    }

    for (let i = 0; i <= gridLines; i++) {
      const gz = -hd + (BOX_D / gridLines) * i;
      const pStart = this.project3D(-hw, floorY, gz, cx, cy);
      const pEnd = this.project3D(hw, floorY, gz, cx, cy);
      if (pStart && pEnd) {
        ctx.beginPath();
        ctx.moveTo(pStart.sx, pStart.sy);
        ctx.lineTo(pEnd.sx, pEnd.sy);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 2. Draw 3D Wireframe Bounding Box
    const corners = [
      { x: -hw, y: -hh, z: -hd },
      { x: hw, y: -hh, z: -hd },
      { x: hw, y: hh, z: -hd },
      { x: -hw, y: hh, z: -hd },
      { x: -hw, y: -hh, z: hd },
      { x: hw, y: -hh, z: hd },
      { x: hw, y: hh, z: hd },
      { x: -hw, y: hh, z: hd }
    ];

    const projectedCorners = corners.map(c => this.project3D(c.x, c.y, c.z, cx, cy));

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back
      [4, 5], [5, 6], [6, 7], [7, 4], // Front
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ];

    ctx.save();
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(16,16,16,0.09)";
    ctx.lineWidth = 1;
    edges.forEach(([a, b]) => {
      const pa = projectedCorners[a];
      const pb = projectedCorners[b];
      if (pa && pb) {
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
    });
    ctx.restore();

    // 3. Draw 3D Center Axes
    const pCenter = this.project3D(0, floorY, 0, cx, cy);
    const pPosX = this.project3D(hw, floorY, 0, cx, cy);
    const pNegX = this.project3D(-hw, floorY, 0, cx, cy);
    const pPosZ = this.project3D(0, floorY, hd, cx, cy);
    const pNegZ = this.project3D(0, floorY, -hd, cx, cy);
    const pTopY = this.project3D(0, hh, 0, cx, cy);
    const pBotY = this.project3D(0, -hh, 0, cx, cy);

    ctx.save();
    ctx.lineWidth = 1.2;

    // X Axis: Introvertit <-> Extravertit
    if (pNegX && pPosX) {
      ctx.strokeStyle = "rgba(114, 204, 205, 0.4)";
      ctx.beginPath();
      ctx.moveTo(pNegX.sx, pNegX.sy);
      ctx.lineTo(pPosX.sx, pPosX.sy);
      ctx.stroke();
    }

    // Z Axis: Judecată <-> Percepție
    if (pNegZ && pPosZ) {
      ctx.strokeStyle = "rgba(225, 29, 72, 0.4)";
      ctx.beginPath();
      ctx.moveTo(pNegZ.sx, pNegZ.sy);
      ctx.lineTo(pPosZ.sx, pPosZ.sy);
      ctx.stroke();
    }

    // Y Axis: Senzorial <-> Intuiție
    if (pBotY && pTopY) {
      ctx.strokeStyle = "rgba(149, 99, 126, 0.4)";
      ctx.beginPath();
      ctx.moveTo(pBotY.sx, pBotY.sy);
      ctx.lineTo(pTopY.sx, pTopY.sy);
      ctx.stroke();
    }
    ctx.restore();

    // 4. THE 4 PURE PERCENTAGE CORNERS:
    //  Corner (+hw, +hd): E 100%, P 100% -> COLȚUL EP
    //  Corner (+hw, -hd): E 100%, J 100% -> COLȚUL EJ
    //  Corner (-hw, +hd): I 100%, P 100% -> COLȚUL IP
    //  Corner (-hw, -hd): I 100%, J 100% -> COLȚUL IJ
    const corners4 = [
      {
        p: this.project3D(hw, floorY, hd, cx, cy),
        tag: "COLȚUL EP",
        sub: "E 100% · P 100%",
        color: "#f59e0b"
      },
      {
        p: this.project3D(hw, floorY, -hd, cx, cy),
        tag: "COLȚUL EJ",
        sub: "E 100% · J 100%",
        color: "#e11d48"
      },
      {
        p: this.project3D(-hw, floorY, hd, cx, cy),
        tag: "COLȚUL IP",
        sub: "I 100% · P 100%",
        color: "#10b981"
      },
      {
        p: this.project3D(-hw, floorY, -hd, cx, cy),
        tag: "COLȚUL IJ",
        sub: "I 100% · J 100%",
        color: "#6366f1"
      }
    ];

    corners4.forEach(c => {
      if (!c.p) return;
      ctx.save();
      const fs = Math.max(10, Math.min(14, 12 * c.p.scale));
      ctx.font = `800 ${fs}px Sora, sans-serif`;
      ctx.fillStyle = c.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Tag
      ctx.fillText(c.tag, c.p.sx, c.p.sy - 8);

      // Subtitle
      ctx.font = `600 ${Math.max(9, fs - 2)}px Poppins, sans-serif`;
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(16,16,16,0.7)";
      ctx.fillText(c.sub, c.p.sx, c.p.sy + 8);
      ctx.restore();
    });

    // 5. Cardinal Axis Labels
    const cardinalLabels = [
      { p: this.project3D(hw + 40, floorY, 0, cx, cy), text: "EXTRAVERSIE (E 100%)", color: "#f59e0b" },
      { p: this.project3D(-hw - 40, floorY, 0, cx, cy), text: "INTROVERSIE (I 100%)", color: "#6366f1" },
      { p: this.project3D(0, floorY, hd + 40, cx, cy), text: "PERCEPȚIE (P 100%)", color: "#10b981" },
      { p: this.project3D(0, floorY, -hd - 40, cx, cy), text: "JUDECATE (J 100%)", color: "#e11d48" },
      { p: this.project3D(0, hh + 35, 0, cx, cy), text: "INTUIȚIE (N 100%)", color: "#95637e" },
      { p: this.project3D(0, -hh - 35, 0, cx, cy), text: "SENZORIAL (S 100%)", color: "#e5c727" }
    ];

    cardinalLabels.forEach(cl => {
      if (!cl.p) return;
      ctx.save();
      const fs = Math.max(9, Math.min(12, 11 * cl.p.scale));
      ctx.font = `800 ${fs}px Sora, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = cl.color;
      ctx.fillText(cl.text, cl.p.sx, cl.p.sy);
      ctx.restore();
    });

    // 6. Project and Render all 347 Personalities + User ("TU")
    const hovered = this.hoveredIndex;
    const selected = this.selectedIndex;
    const userData = this.getUserData();

    // Prepare calm, stationary projected nodes (NO floating trig animations)
    const projectedNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const proj = this.project3D(n.x, n.y, n.z, cx, cy);
      if (!proj) continue;

      let matchesFilter = true;
      if (this.activeFilter !== "ALL") {
        if (["EJ", "EP", "IJ", "IP"].includes(this.activeFilter)) {
          matchesFilter = n.style.code === this.activeFilter;
        } else if (["NT", "NF", "SF", "ST"].includes(this.activeFilter)) {
          matchesFilter = n.temp.code === this.activeFilter;
        }
      }

      projectedNodes.push({
        node: n,
        index: i,
        sx: proj.sx,
        sy: proj.sy,
        scale: proj.scale,
        zDepth: proj.zDepth,
        matchesFilter
      });
    }

    // Project User ("TU")
    let projectedUser = null;
    if (userData.hasScores) {
      const uProj = this.project3D(userData.x, userData.y, userData.z, cx, cy);
      if (uProj) {
        projectedUser = {
          sx: uProj.sx,
          sy: uProj.sy,
          scale: uProj.scale,
          zDepth: uProj.zDepth
        };
      }
    }

    // Sort draw order by 3D depth (lowest zDepth = furthest, drawn first; highest = closest)
    projectedNodes.sort((a, b) => a.zDepth - b.zDepth);

    // Render 3D Personalities
    for (const item of projectedNodes) {
      const { node, index, sx, sy, scale, matchesFilter } = item;
      const isHovered = index === hovered;
      const isSelected = index === selected;

      // Generous, clearly visible radius scaling in 3D
      const baseR = 19;
      let r = Math.max(12, Math.min(42, baseR * scale));
      if (isHovered || isSelected) r += 5;

      const alpha = matchesFilter ? 1.0 : 0.15;
      ctx.save();
      ctx.globalAlpha = alpha;

      const photoImg = node.photo ? this.loadImage(node.photo) : null;

      // Draw avatar photo if loaded
      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.clip();
        const minDim = Math.min(photoImg.naturalWidth, photoImg.naturalHeight);
        ctx.drawImage(photoImg, 0, 0, minDim, minDim, sx - r, sy - r, r * 2, r * 2);
        ctx.restore();

        // Calm static border
        ctx.strokeStyle = isSelected || isHovered ? node.style.color : node.color;
        ctx.lineWidth = isSelected || isHovered ? 3.5 : 2;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Fallback circle with temperament color and initial
        ctx.fillStyle = node.colorBg || node.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected || isHovered ? node.style.color : node.color;
        ctx.lineWidth = isSelected || isHovered ? 3 : 1.5;
        ctx.stroke();

        if (r >= 12) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `700 ${Math.round(r * 0.85)}px Sora, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.avatar || node.name.charAt(0), sx, sy + 1);
        }
      }

      // Calm static highlight ring when hovered or selected (NO pulsing)
      if (isHovered || isSelected) {
        ctx.strokeStyle = node.style.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sx, sy, r + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Calm 3D Billboard Name Tag
      const shouldDrawLabel = isHovered || isSelected || scale >= 1.25;
      if (shouldDrawLabel && matchesFilter) {
        const labelText = isHovered || isSelected 
          ? `${node.name} · ${node.mbti} (${node.style.code})` 
          : `${node.name} · ${node.mbti}`;
        const tx = sx + r + 6;
        const ty = sy;

        const fontSize = Math.max(10, Math.min(14, 12 * Math.max(0.85, scale)));
        ctx.font = isHovered || isSelected ? `700 ${fontSize}px Poppins, sans-serif` : `600 ${fontSize}px Poppins, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // Halo outline
        ctx.lineWidth = 4;
        ctx.strokeStyle = isDark ? "rgba(13,15,18,0.96)" : "rgba(244,241,232,0.96)";
        ctx.strokeText(labelText, tx, ty);

        // Fill text
        ctx.fillStyle = isHovered || isSelected ? (isDark ? "#ffffff" : "#101010") : (isDark ? "#e2ddcf" : "#22201b");
        ctx.fillText(labelText, tx, ty);
      }

      ctx.restore();
    }

    // 7. Render User ("TU") in 3D:
    // Pure solid white ball without pulsing, without text on canvas!
    if (projectedUser) {
      const { sx: ux, sy: uy, scale: uScale } = projectedUser;
      const isUserHovered = this.userHovered;
      const isUserSelected = this.userSelected;

      const baseUserR = 19;
      let userR = Math.max(14, Math.min(38, baseUserR * uScale));
      if (isUserHovered || isUserSelected) userR += 4;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;

      // Solid pure white ball
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ux, uy, userR, 0, Math.PI * 2);
      ctx.fill();

      // Clean border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = isUserSelected || isUserHovered ? "#10b981" : (isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.25)");
      ctx.lineWidth = isUserSelected || isUserHovered ? 3.5 : 2;
      ctx.stroke();
      ctx.restore();
    }
  }

  attachEvents() {
    const canvas = this.canvas;
    const wrap = this.wrap;
    if (!canvas || !wrap) return;

    const resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
      this.requestFrame();
    });
    resizeObserver.observe(wrap);

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // 3D Hit Detection
    const findHitNode3D = (mx, my) => {
      const cx = wrap.clientWidth / 2;
      const cy = wrap.clientHeight / 2;
      const userData = this.getUserData();

      // 1. Check User node first
      if (userData.hasScores) {
        const uProj = this.project3D(userData.x, userData.y, userData.z, cx, cy);
        if (uProj) {
          const userR = Math.max(14, Math.min(38, 19 * uProj.scale));
          if (Math.hypot(uProj.sx - mx, uProj.sy - my) <= userR + 8) {
            return "user";
          }
        }
      }

      // 2. Check all nodes from closest to furthest
      const projected = [];
      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        const proj = this.project3D(n.x, n.y, n.z, cx, cy);
        if (proj) {
          projected.push({ index: i, sx: proj.sx, sy: proj.sy, scale: proj.scale, zDepth: proj.zDepth });
        }
      }

      projected.sort((a, b) => b.zDepth - a.zDepth);

      for (const item of projected) {
        const r = Math.max(12, Math.min(42, 19 * item.scale));
        if (Math.hypot(item.sx - mx, item.sy - my) <= r + 8) {
          return item.index;
        }
      }

      return -1;
    };

    // Pointer Down (Mouse drag or touch start)
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      const p = getPos(e);
      this.pointers.set(e.pointerId, p);

      if (this.pointers.size === 1) {
        this.isDragging = true;
        this.dragStart = { x: p.x, y: p.y, theta: this.camera.theta, phi: this.camera.phi };
        this.dragDistance = 0;
        this.velTheta = 0;
        this.velPhi = 0;
      } else if (this.pointers.size === 2) {
        const pts = Array.from(this.pointers.values());
        this.pinchStart = {
          dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
          radius: this.camera.radius
        };
      }
    });

    // Pointer Move (Smooth, calm 3D Orbit)
    canvas.addEventListener("pointermove", (e) => {
      const p = getPos(e);
      if (this.pointers.has(e.pointerId)) {
        this.pointers.set(e.pointerId, p);
      }

      // Pinch zoom
      if (this.pointers.size === 2 && this.pinchStart) {
        const pts = Array.from(this.pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const ratio = this.pinchStart.dist / dist;
        this.camera.radius = Math.max(700, Math.min(3800, this.pinchStart.radius * ratio));
        this.requestFrame();
        return;
      }

      // One-pointer drag orbit
      if (this.isDragging && this.pointers.size === 1) {
        const dx = p.x - this.dragStart.x;
        const dy = p.y - this.dragStart.y;
        this.dragDistance += Math.hypot(dx, dy);

        this.camera.theta = this.dragStart.theta - dx * 0.0055;
        this.camera.phi = Math.max(-1.42, Math.min(1.42, this.dragStart.phi + dy * 0.0055));

        this.velTheta = -dx * 0.0008;
        this.velPhi = dy * 0.0008;

        this.requestFrame();
      } else if (e.pointerType === "mouse") {
        const hit = findHitNode3D(p.x, p.y);
        const hitIsUser = hit === "user";
        const hitIdx = hitIsUser ? -1 : hit;

        if (hitIsUser !== this.userHovered || hitIdx !== this.hoveredIndex) {
          this.userHovered = hitIsUser;
          this.hoveredIndex = hitIdx;
          canvas.style.cursor = (hitIsUser || hitIdx >= 0) ? "pointer" : "grab";
          this.requestFrame();
        }
      }
    });

    // Pointer Up
    canvas.addEventListener("pointerup", (e) => {
      this.pointers.delete(e.pointerId);

      if (this.isDragging && this.dragDistance < 7) {
        const p = getPos(e);
        const hit = findHitNode3D(p.x, p.y);
        if (hit === "user") {
          this.selectUser();
        } else if (typeof hit === "number" && hit >= 0) {
          this.selectNode(hit, true);
        } else {
          this.deselectNode();
        }
      }

      if (this.pointers.size === 0) {
        this.isDragging = false;
        canvas.style.cursor = "grab";
      }
    });

    canvas.addEventListener("pointerleave", () => {
      if (this.hoveredIndex !== -1 || this.userHovered) {
        this.hoveredIndex = -1;
        this.userHovered = false;
        this.requestFrame();
      }
    });

    // Wheel Zoom
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = Math.exp(e.deltaY * 0.0014);
      this.camera.radius = Math.max(700, Math.min(3800, this.camera.radius * zoomFactor));
      this.requestFrame();
    }, { passive: false });

    // Keyboard Esc
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.deselectNode();
      }
    });

    // 3D View Presets
    document.querySelectorAll(".tree-3d-btn[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-view");
        this.setViewMode(mode);
      });
    });

    const resetBtn = document.getElementById("tree-3d-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.setViewMode("orbit"));
    }

    const focusUserBtn = document.getElementById("tree-3d-focus-user");
    if (focusUserBtn) {
      focusUserBtn.addEventListener("click", () => this.selectUser());
    }

    // Filter Pills
    document.querySelectorAll(".tree-filter-pill[data-filter]").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".tree-filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.activeFilter = pill.getAttribute("data-filter");
        this.requestFrame();
      });
    });

    // Search Autocomplete
    const searchInput = document.getElementById("tree-search-input");
    const suggestionsList = document.getElementById("tree-search-suggestions");
    if (searchInput && suggestionsList) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        this.searchQuery = q;

        if (q.length < 2) {
          suggestionsList.style.display = "none";
          suggestionsList.innerHTML = "";
          return;
        }

        const matches = this.nodes
          .filter(n => n.name.toLowerCase().includes(q) || n.mbti.toLowerCase().includes(q) || n.style.code.toLowerCase().includes(q))
          .slice(0, 6);

        if (matches.length === 0) {
          suggestionsList.style.display = "none";
          return;
        }

        suggestionsList.innerHTML = matches.map(m => `
          <li>
            <button type="button" data-idx="${m.index}">
              <span class="tree-dot" style="background: ${m.color};"></span>
              <span><b>${m.name}</b> <small style="opacity: 0.75;">(${m.mbti} · ${m.style.code})</small></span>
            </button>
          </li>
        `).join("");

        suggestionsList.style.display = "block";

        suggestionsList.querySelectorAll("button").forEach(b => {
          b.addEventListener("click", () => {
            const idx = parseInt(b.getAttribute("data-idx"), 10);
            suggestionsList.style.display = "none";
            this.searchQuery = "";
            searchInput.value = "";
            this.selectNode(idx, true);
          });
        });
      });

      document.addEventListener("click", (evt) => {
        if (!searchInput.contains(evt.target) && !suggestionsList.contains(evt.target)) {
          suggestionsList.style.display = "none";
        }
      });
    }

    // Nav Header Buttons
    const logoBtn = document.getElementById("tree-nav-logo");
    if (logoBtn) logoBtn.addEventListener("click", () => this.app.state.showWelcome());

    const testBtn = document.getElementById("tree-nav-test");
    if (testBtn) testBtn.addEventListener("click", () => this.app.state.showWelcome());

    const figuresBtn = document.getElementById("tree-nav-figures");
    if (figuresBtn) figuresBtn.addEventListener("click", () => this.app.state.showFigures());

    const listViewBtn = document.getElementById("tree-btn-list-view");
    if (listViewBtn) listViewBtn.addEventListener("click", () => this.app.state.showFigures());

    const startBtn = document.getElementById("tree-btn-start");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const userData = this.getUserData();
        if (userData.hasScores) {
          this.app.state.showResults();
        } else {
          this.app.state.showWelcome();
        }
      });
    }

    const langBtn = document.getElementById("tree-nav-lang");
    if (langBtn) langBtn.addEventListener("click", () => this.app.state.toggleLang());

    const themeBtn = document.getElementById("tree-nav-theme");
    if (themeBtn) themeBtn.addEventListener("click", () => this.app.state.toggleTheme());
  }

  setViewMode(mode) {
    document.querySelectorAll(".tree-3d-btn[data-view]").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-view") === mode);
    });

    let targetTheta = 0.52;
    let targetPhi = 0.32;
    let targetRadius = 1750;

    if (mode === "top") {
      // Top-Down View: Looks directly at the (X, Z) plane with the 4 corners: EJ, EP, IJ, IP
      targetTheta = 0;
      targetPhi = 1.48; // Almost 90 degrees top down
      targetRadius = 1600;
    } else if (mode === "front") {
      // Front View: Intuition vs Sensing on Y, Extraversion vs Introversion on X
      targetTheta = 0;
      targetPhi = 0;
      targetRadius = 1550;
    }

    this.animateCameraTo({
      theta: targetTheta,
      phi: targetPhi,
      radius: targetRadius,
      tx: 0,
      ty: 0,
      tz: 0
    });
  }

  animateCameraTo(target, duration = 400) {
    this.cameraAnim = {
      startTime: performance.now(),
      duration,
      start: {
        theta: this.camera.theta,
        phi: this.camera.phi,
        radius: this.camera.radius,
        tx: this.camera.target.x,
        ty: this.camera.target.y,
        tz: this.camera.target.z
      },
      target
    };
    this.requestFrame();
  }

  selectNode(idx, flyTo = true) {
    if (idx < 0 || idx >= this.nodes.length) return;
    this.selectedIndex = idx;
    this.userSelected = false;
    const node = this.nodes[idx];

    if (flyTo) {
      this.animateCameraTo({
        theta: this.camera.theta,
        phi: this.camera.phi,
        radius: Math.max(900, this.camera.radius * 0.75),
        tx: node.x,
        ty: node.y,
        tz: node.z
      });
    }

    this.renderSidePanel(node);
    this.requestFrame();
  }

  selectUser() {
    const userData = this.getUserData();
    if (!userData.hasScores) return;

    this.userSelected = true;
    this.selectedIndex = -1;

    this.animateCameraTo({
      theta: this.camera.theta,
      phi: this.camera.phi,
      radius: Math.max(900, this.camera.radius * 0.75),
      tx: userData.x,
      ty: userData.y,
      tz: userData.z
    });

    this.renderUserSidePanel(userData);
    this.requestFrame();
  }

  deselectNode() {
    this.selectedIndex = -1;
    this.userSelected = false;
    const panel = document.getElementById("tree-panel");
    if (panel) {
      panel.style.display = "none";
    }
    this.requestFrame();
  }

  renderSidePanel(node) {
    const panel = document.getElementById("tree-panel");
    if (!panel) return;

    const lang = this.app.state.lang || "ro";
    const userData = this.getUserData();
    const cleanRole = getFigureRole(node.rawFig || node, lang);

    let simPct = null;
    if (userData.hasScores) {
      simPct = calculateFigureSimilarity(userData.percentages, userData.axisScores, node);
    }

    // 5 closest personalities in 3D Euclidean distance
    const similar = this.nodes
      .filter(n => n.id !== node.id)
      .map(n => {
        const dist = Math.hypot(n.x - node.x, n.y - node.y, n.z - node.z);
        const match = Math.max(10, Math.min(99, Math.round(100 - (dist / BOX_W) * 120)));
        return { node: n, match };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    // 4 Spectrum Axes
    const figE = node.axes?.E ?? 50;
    const figI = node.axes?.I ?? (100 - figE);
    const figN = node.nPct ?? 50;
    const figS = node.sPct ?? (100 - figN);
    const figT = node.tPct ?? 50;
    const figF = node.fPct ?? (100 - figT);
    const figJ = node.axes?.J ?? 50;
    const figP = node.axes?.P ?? (100 - figJ);

    const axesList = [
      {
        id: "EI",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftName: lang === "ro" ? "Extraversie" : "Extravertit",
        rightName: lang === "ro" ? "Introversie" : "Introvertit",
        leftVal: figE,
        rightVal: figI,
        pos: Math.max(7, Math.min(93, figI)),
        color: "#4298b4"
      },
      {
        id: "NS",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftName: lang === "ro" ? "Intuiție" : "Intuitive",
        rightName: lang === "ro" ? "Senzorial" : "Observant",
        leftVal: figN,
        rightVal: figS,
        pos: Math.max(7, Math.min(93, figS)),
        color: node.color
      },
      {
        id: "TF",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftName: lang === "ro" ? "Gândire" : "Thinking",
        rightName: lang === "ro" ? "Sentiment" : "Feeling",
        leftVal: figT,
        rightVal: figF,
        pos: Math.max(7, Math.min(93, figF)),
        color: "#72cccd"
      },
      {
        id: "JP",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftName: lang === "ro" ? "Judecată" : "Judging",
        rightName: lang === "ro" ? "Percepție" : "Prospecting",
        leftVal: figJ,
        rightVal: figP,
        pos: Math.max(7, Math.min(93, figP)),
        color: "#88619a"
      }
    ];

    panel.innerHTML = `
      <div class="tree-panel-header" style="background: ${node.colorBg || node.color}; color: #ffffff;">
        <button type="button" class="tree-close" id="tree-panel-close" aria-label="Close">✕</button>
        <div class="fig-modal-profile">
          <div class="fig-modal-photo-wrap">
            ${node.photo ? `
              <img class="fig-modal-photo" src="${node.photo}" alt="${node.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="fig-modal-avatar-fallback" style="display:none; background: rgba(0,0,0,0.3); color: #ffffff;">${node.avatar || node.name.charAt(0)}</div>
            ` : `
              <div class="fig-modal-avatar-fallback" style="background: rgba(0,0,0,0.3); color: #ffffff;">${node.avatar || node.name.charAt(0)}</div>
            `}
          </div>
          <div class="fig-modal-profile-text">
            <div class="fig-modal-tags">
              <span class="fig-modal-mbti-tag">${node.mbti}</span>
              <span class="fig-modal-temp-tag">${node.tempName}</span>
              <span class="fig-modal-temp-tag" style="background: ${node.style.color};">${node.style.code}</span>
              ${simPct !== null ? `<span class="fig-modal-sim-tag">${simPct}% ${lang === 'ro' ? 'compatibilitate' : 'match'}</span>` : ''}
            </div>
            <h2 class="fig-modal-name">${node.name}</h2>
            <div class="fig-modal-role">${cleanRole} · <span style="opacity:0.9;">${node.style.name}</span></div>
          </div>
        </div>
      </div>

      <div class="tree-panel-body">
        ${node.quote ? `
          <div class="fig-modal-quote-box">
            <p class="fig-modal-quote">"${node.quote}"</p>
          </div>
        ` : ''}

        <!-- 4 Spectrum Axes with fig-modal-sec-title -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? '4 Axe' : '4 Axis'}</h4>
          <div class="fig-modal-axes-grid">
            ${axesList.map(ax => `
              <div class="fig-modal-axis-card">
                <div class="fig-modal-axis-head">
                  <span class="fig-modal-axis-name">${ax.name}</span>
                </div>
                <div class="fig-modal-axis-track">
                  <div class="fig-modal-axis-midpoint"></div>
                  <div class="fig-modal-axis-dot" style="left: ${ax.pos}%; background: ${ax.color};" title="${ax.rightVal >= ax.leftVal ? ax.rightName + ' ' + ax.rightVal + '%' : ax.leftName + ' ' + ax.leftVal + '%'}"></div>
                </div>
                <div class="fig-modal-axis-labels">
                  <span class="fig-modal-axis-lbl ${ax.leftVal >= ax.rightVal ? 'active-pole' : ''}">${ax.leftName} <b>${ax.leftVal}%</b></span>
                  <span class="fig-modal-axis-lbl ${ax.rightVal > ax.leftVal ? 'active-pole' : ''}"><b>${ax.rightVal}%</b> ${ax.rightName}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 8 Cognitive Functions Breakdown if present -->
        ${node.scores && Object.keys(node.scores).length >= 4 ? `
          <div class="fig-modal-sec">
            <h4 class="fig-modal-sec-title">8 Cognitive</h4>
            <div class="fig-modal-funcs-grid">
              ${FUNCTIONS_LIST.map(f => {
                const fPct = node.scores?.[f] ?? 50;
                const fColor = getFuncTileColors(f).bg;
                return `
                  <div class="fig-modal-func-item">
                    <div class="fig-modal-func-top">
                      <span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;">${f}</span>
                      <span class="fig-modal-func-pct"><b>${fPct}%</b></span>
                    </div>
                    <div class="fig-modal-func-track">
                      <div class="fig-modal-func-fill" style="width: ${fPct}%; background: ${fColor};"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : ''}

        <!-- Closest Personalities in 3D Spectrum -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? 'Personalități Asemănătoare în Spațiul 3D' : 'Closest in 3D Spectrum'}</h4>
          <ul class="tree-similar">
            ${similar.map(({ node: sNode, match }) => `
              <li>
                <button type="button" data-sim-idx="${sNode.index}">
                  ${sNode.photo ? `
                    <img class="tree-similar-img" src="${sNode.photo}" alt="${sNode.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
                    <span class="tree-dot" style="display:none; background: ${sNode.color}; width: 34px; height: 34px; border-radius: 50%;"></span>
                  ` : `
                    <span class="tree-dot" style="background: ${sNode.color}; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800;">${sNode.avatar || sNode.name.charAt(0)}</span>
                  `}
                  <span class="tree-similar-name">${sNode.name} <small style="opacity:0.75; font-weight:600;">(${sNode.mbti} · ${sNode.style.code})</small></span>
                  <span class="tree-similar-pct">${match}%</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    panel.style.display = "flex";

    const closeBtn = document.getElementById("tree-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.deselectNode());
    }

    panel.querySelectorAll("[data-sim-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sIdx = parseInt(btn.getAttribute("data-sim-idx"), 10);
        this.selectNode(sIdx, true);
      });
    });
  }

  renderUserSidePanel(userData) {
    const panel = document.getElementById("tree-panel");
    if (!panel) return;

    const lang = this.app.state.lang || "ro";
    const userTemp = getTypeTemperament(userData.userType);

    // 5 closest personalities to user in 3D Euclidean distance
    const similar = this.nodes
      .map(n => {
        const dist = Math.hypot(n.x - userData.x, n.y - userData.y, n.z - userData.z);
        const match = Math.max(10, Math.min(99, Math.round(100 - (dist / BOX_W) * 120)));
        return { node: n, match };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    // 4 Spectrum Axes
    const axesList = [
      {
        id: "EI",
        name: lang === "ro" ? "MINTE" : "MIND",
        leftName: lang === "ro" ? "Extraversie" : "Extravertit",
        rightName: lang === "ro" ? "Introversie" : "Introvertit",
        leftVal: Math.round(userData.ePct),
        rightVal: Math.round(userData.iPct),
        pos: Math.max(7, Math.min(93, Math.round(userData.iPct))),
        color: "#4298b4"
      },
      {
        id: "NS",
        name: lang === "ro" ? "ENERGIE" : "ENERGY",
        leftName: lang === "ro" ? "Intuiție" : "Intuitive",
        rightName: lang === "ro" ? "Senzorial" : "Observant",
        leftVal: Math.round(userData.nPct),
        rightVal: Math.round(userData.sPct),
        pos: Math.max(7, Math.min(93, Math.round(userData.sPct))),
        color: userTemp.color
      },
      {
        id: "TF",
        name: lang === "ro" ? "NATURĂ" : "NATURE",
        leftName: lang === "ro" ? "Gândire" : "Thinking",
        rightName: lang === "ro" ? "Sentiment" : "Feeling",
        leftVal: Math.round(userData.tPct),
        rightVal: Math.round(userData.fPct),
        pos: Math.max(7, Math.min(93, Math.round(userData.fPct))),
        color: "#72cccd"
      },
      {
        id: "JP",
        name: lang === "ro" ? "TACTICĂ" : "TACTICS",
        leftName: lang === "ro" ? "Judecată" : "Judging",
        rightName: lang === "ro" ? "Percepție" : "Prospecting",
        leftVal: Math.round(userData.jPct),
        rightVal: Math.round(userData.pPct),
        pos: Math.max(7, Math.min(93, Math.round(userData.pPct))),
        color: "#88619a"
      }
    ];

    panel.innerHTML = `
      <div class="tree-panel-header" style="background: linear-gradient(135deg, #102e24 0%, #1e4d3d 50%, #2f6b55 100%); color: #ffffff;">
        <button type="button" class="tree-close" id="tree-panel-close" aria-label="Close">✕</button>
        <div class="fig-modal-profile">
          <div class="fig-modal-photo-wrap">
            <div class="fig-modal-avatar-fallback" style="background: #ffffff; color: #102e24; font-weight: 900; font-size: 1.5rem; border: 3px solid rgba(255, 255, 255, 0.7); box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              TU
            </div>
          </div>
          <div class="fig-modal-profile-text">
            <div class="fig-modal-tags">
              <span class="fig-modal-mbti-tag" style="background: #ffffff; color: #102e24;">${userData.userType}</span>
              <span class="fig-modal-temp-tag">${userTemp.name}</span>
              <span class="fig-modal-temp-tag" style="background: ${userData.style.color};">${userData.style.code}</span>
              <span class="fig-modal-sim-tag" style="background: #10b981;">${lang === 'ro' ? 'Profilul tău' : 'Your Profile'}</span>
            </div>
            <h2 class="fig-modal-name">${lang === 'ro' ? 'Poziția Ta în Spațiul 3D' : 'Your 3D Position'}</h2>
            <div class="fig-modal-role">${userData.style.name} · ${Math.round(userData.ePct)}% E, ${Math.round(userData.pPct)}% P</div>
          </div>
        </div>
      </div>

      <div class="tree-panel-body">
        <!-- 4 Spectrum Axes with fig-modal-sec-title -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? '4 Axe Personale' : 'Your 4 Axes'}</h4>
          <div class="fig-modal-axes-grid">
            ${axesList.map(ax => `
              <div class="fig-modal-axis-card">
                <div class="fig-modal-axis-head">
                  <span class="fig-modal-axis-name">${ax.name}</span>
                </div>
                <div class="fig-modal-axis-track">
                  <div class="fig-modal-axis-midpoint"></div>
                  <div class="fig-modal-axis-dot" style="left: ${ax.pos}%; background: ${ax.color};" title="${ax.rightVal >= ax.leftVal ? ax.rightName + ' ' + ax.rightVal + '%' : ax.leftName + ' ' + ax.leftVal + '%'}"></div>
                </div>
                <div class="fig-modal-axis-labels">
                  <span class="fig-modal-axis-lbl ${ax.leftVal >= ax.rightVal ? 'active-pole' : ''}">${ax.leftName} <b>${ax.leftVal}%</b></span>
                  <span class="fig-modal-axis-lbl ${ax.rightVal > ax.leftVal ? 'active-pole' : ''}"><b>${ax.rightVal}%</b> ${ax.rightName}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 8 Cognitive Functions Breakdown if present -->
        ${userData.percentages ? `
          <div class="fig-modal-sec">
            <h4 class="fig-modal-sec-title">${lang === 'ro' ? '8 Funcții Cognitive' : '8 Cognitive Functions'}</h4>
            <div class="fig-modal-funcs-grid">
              ${FUNCTIONS_LIST.map(f => {
                const fPct = Math.round(userData.percentages[f] ?? 50);
                const fColor = getFuncTileColors(f).bg;
                return `
                  <div class="fig-modal-func-item">
                    <div class="fig-modal-func-top">
                      <span class="resemble-stack-pill" style="background: ${fColor}; color: #ffffff;">${f}</span>
                      <span class="fig-modal-func-pct"><b>${fPct}%</b></span>
                    </div>
                    <div class="fig-modal-func-track">
                      <div class="fig-modal-func-fill" style="width: ${fPct}%; background: ${fColor};"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : ''}

        <!-- Closest Personalities in 3D Spectrum -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? 'Personalități Asemănătoare în Spațiul 3D' : 'Closest in 3D Spectrum'}</h4>
          <ul class="tree-similar">
            ${similar.map(({ node: sNode, match }) => `
              <li>
                <button type="button" data-sim-idx="${sNode.index}">
                  ${sNode.photo ? `
                    <img class="tree-similar-img" src="${sNode.photo}" alt="${sNode.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
                    <span class="tree-dot" style="display:none; background: ${sNode.color}; width: 34px; height: 34px; border-radius: 50%;"></span>
                  ` : `
                    <span class="tree-dot" style="background: ${sNode.color}; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800;">${sNode.avatar || sNode.name.charAt(0)}</span>
                  `}
                  <span class="tree-similar-name">${sNode.name} <small style="opacity:0.75; font-weight:600;">(${sNode.mbti} · ${sNode.style.code})</small></span>
                  <span class="tree-similar-pct">${match}%</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    panel.style.display = "flex";

    const closeBtn = document.getElementById("tree-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.deselectNode());
    }

    panel.querySelectorAll("[data-sim-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sIdx = parseInt(btn.getAttribute("data-sim-idx"), 10);
        this.selectNode(sIdx, true);
      });
    });
  }
}
