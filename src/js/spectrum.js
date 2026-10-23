/**
 * 8Func - Minimalist 12Axes-Style Personality Spectrum Canvas
 * All 347 personalities placed at their exact % coordinates on 4 quadrants without connecting lines.
 */

import { NOTABLE_FIGURES, calculateFigureSimilarity, getFigureRole } from "../data/figures.js";
import { MBTI_TYPES, getTypeTemperament } from "../data/mbtiTypes.js";
import { COGNITIVE_FUNCTIONS } from "../data/functions.js";
import { calculateScores } from "./scoring.js";
import { ICONS } from "./icons.js";
import { t } from "../data/translations.js";

// World coordinate dimensions (centered at 0, 0)
const WORLD_W = 1400;
const WORLD_H = 1000;
const PHOTO_ZOOM_THRESHOLD = 0.45;

const FUNCTIONS_LIST = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];

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

    // Viewport transform
    this.transform = { x: 0, y: 0, k: 1 };
    this.baseScale = 1;

    // Interaction state
    this.hoveredIndex = -1;
    this.selectedIndex = -1;
    this.userHovered = false;
    this.userSelected = false;

    this.isDragging = false;
    this.dragStart = { x: 0, y: 0, tx: 0, ty: 0 };
    this.dragDistance = 0;
    this.pointers = new Map();
    this.pinchStart = null;

    // Animation & rendering
    this.rafId = 0;
    this.flyRafId = 0;
    this.isReducedMotion = false;
    this.imageCache = new Map();

    // Search query
    this.searchQuery = "";

    // Build data nodes from 347 NOTABLE_FIGURES
    this.nodes = this.buildNodes();
  }

  buildNodes() {
    return NOTABLE_FIGURES.map((fig, idx) => {
      // X = T (0% F -> 100% T)
      // Y = N (0% S -> 100% N, top is N so negative in canvas)
      const t = fig.axes ? fig.axes.T : (fig.mbti.includes("T") ? 75 : 25);
      const n = fig.axes ? fig.axes.N : (fig.mbti.includes("N") ? 75 : 25);
      const f = fig.axes ? fig.axes.F : 100 - t;
      const s = fig.axes ? fig.axes.S : 100 - n;

      const wx = ((t - 50) / 50) * (WORLD_W / 2);
      const wy = -((n - 50) / 50) * (WORLD_H / 2);

      const temp = getTypeTemperament(fig.mbti);

      // Micro floating phase
      const phaseA = (idx * 2.399963) % (Math.PI * 2);
      const phaseB = (idx * 1.618034 + 1.3) % (Math.PI * 2);

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
        axes: fig.axes || { E: 50, I: 50, N: n, S: s, T: t, F: f, J: 50, P: 50 },
        scores: fig.scores || {},
        tPct: t,
        nPct: n,
        fPct: f,
        sPct: s,
        x: wx,
        y: wy,
        color: temp.color,
        colorBg: temp.colorBg,
        tempName: temp.name,
        phaseA,
        phaseB
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

    const wx = ((t - 50) / 50) * (WORLD_W / 2);
    const wy = -((n - 50) / 50) * (WORLD_H / 2);

    const derivedType = `${e >= i ? 'E' : 'I'}${n >= s ? 'N' : 'S'}${t >= f ? 'T' : 'F'}${j >= p ? 'J' : 'P'}`;

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
        <!-- Minimalist 12Axes Header -->
        <header class="sh tree-sh">
          <div class="sh-wrap">
            <button class="sh-logo" id="tree-nav-logo" type="button" aria-label="8Func Home">
              <b>8</b><span>func</span>
            </button>
            <nav class="sh-links" aria-label="Web">
              <button type="button" class="sh-link-btn" id="tree-nav-test">${lang === 'ro' ? 'Test' : 'Quiz'}</button>
              <button type="button" class="sh-link-btn" id="tree-nav-figures">${lang === 'ro' ? 'Personalități' : 'Personalities'}</button>
              <button type="button" class="sh-link-btn active" aria-current="page">${lang === 'ro' ? 'Spectru' : 'Spectrum'}</button>
              <button type="button" class="sh-lang" id="tree-nav-lang">${lang === 'ro' ? 'RO' : 'EN'}</button>
              <button type="button" class="theme-toggle" id="tree-nav-theme" aria-label="Toggle Theme">${isDark ? ICONS.sun : ICONS.moon}</button>
            </nav>
            <div class="sh-actions">
              <div class="tree-search">
                <input 
                  type="search" 
                  id="tree-search-input" 
                  placeholder="${lang === 'ro' ? 'Caută personalitate…' : 'Search personality…'}" 
                  aria-label="${lang === 'ro' ? 'Caută personalitate…' : 'Search personality…'}" 
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

        <!-- Fullscreen Canvas Stage -->
        <main class="tree-stage" id="tree-stage">
          <div class="tree-canvas-wrap" id="tree-canvas-wrap">
            <canvas class="tree-canvas" id="tree-canvas" aria-label="Web · Personalities"></canvas>
          </div>

          <!-- 4 Compass Cardinal Pole Labels -->
          <span class="tree-compass tree-compass-top">${lang === 'ro' ? 'INTUIȚIE' : 'INTUITION'}</span>
          <span class="tree-compass tree-compass-bottom">${lang === 'ro' ? 'SENZORIAL' : 'SENSING'}</span>
          <span class="tree-compass tree-compass-left">${lang === 'ro' ? 'SENTIMENT' : 'FEELING'}</span>
          <span class="tree-compass tree-compass-right">${lang === 'ro' ? 'GÂNDIRE' : 'THINKING'}</span>

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

    // Check reduced motion preference
    this.isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Size canvas properly
    this.resizeCanvas();
    this.fitToScreen();

    // Start render loop
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

  fitToScreen() {
    if (!this.wrap) return;
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;

    // Margin fit
    const scaleX = w / (WORLD_W * 1.15);
    const scaleY = h / (WORLD_H * 1.15);
    const k = Math.min(scaleX, scaleY);

    this.baseScale = k;
    this.transform = {
      k,
      x: w / 2,
      y: h / 2
    };
  }

  requestFrame() {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.draw());
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

  draw() {
    this.rafId = 0;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const wrap = this.wrap;
    if (!ctx || !canvas || !wrap) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const now = performance.now();
    const isDark = this.app.state.theme === "dark";

    const { x: panX, y: panY, k } = this.transform;
    const relZoom = k / this.baseScale;

    // Reset transform to DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Canvas background
    ctx.fillStyle = isDark ? "#101010" : "#F4F1E8";
    ctx.fillRect(0, 0, w, h);

    // 1. Subtle Quadrant Radial Tints (No harsh lines, pure minimalist beauty)
    const quadTints = [
      { x: WORLD_W * 0.25, y: -WORLD_H * 0.25, color: "rgba(149, 99, 126, 0.16)", label: "NT" }, // NT (Top-Right)
      { x: -WORLD_W * 0.25, y: -WORLD_H * 0.25, color: "rgba(154, 194, 98, 0.16)", label: "NF" }, // NF (Top-Left)
      { x: -WORLD_W * 0.25, y: WORLD_H * 0.25, color: "rgba(229, 199, 39, 0.14)", label: "SF" }, // SF (Bottom-Left)
      { x: WORLD_W * 0.25, y: WORLD_H * 0.25, color: "rgba(114, 204, 205, 0.16)", label: "ST" }  // ST (Bottom-Right)
    ];

    const quadR = (WORLD_W * 0.38) * k;
    quadTints.forEach(q => {
      const sx = q.x * k + panX;
      const sy = q.y * k + panY;
      if (sx + quadR < 0 || sx - quadR > w || sy + quadR < 0 || sy - quadR > h) return;

      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, quadR);
      grad.addColorStop(0, q.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(sx - quadR, sy - quadR, quadR * 2, quadR * 2);

      // Subtle Watermark Quadrant Letters
      const wmAlpha = Math.max(0.04, Math.min(0.08, 0.12 - relZoom * 0.02));
      if (wmAlpha > 0.02) {
        ctx.save();
        ctx.font = "800 64px Sora, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isDark ? `rgba(255,255,255,${wmAlpha})` : `rgba(16,16,16,${wmAlpha})`;
        ctx.fillText(q.label, sx, sy);
        ctx.restore();
      }
    });

    // 2. Subtle Minimalist Crosshairs (Center axes: x = 0, y = 0)
    const centerScreenX = 0 * k + panX;
    const centerScreenY = 0 * k + panY;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(16,16,16,0.08)";
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, centerScreenY);
    ctx.lineTo(w, centerScreenY);
    ctx.stroke();
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(centerScreenX, 0);
    ctx.lineTo(centerScreenX, h);
    ctx.stroke();
    ctx.restore();

    // 3. Render all 347 Personalities at their exact coordinates ("FARA LINII DE CONECTARE")
    const hovered = this.hoveredIndex;
    const selected = this.selectedIndex;
    const userData = this.getUserData();

    // Calculate screen positions
    const screenPos = new Float64Array(this.nodes.length * 2);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      // Gentle breathing float
      let floatX = 0;
      let floatY = 0;
      if (!this.isReducedMotion) {
        floatX = Math.sin(now / 1900 + n.phaseA) * 2.2 + Math.sin(now / 4700 + n.phaseB) * 2.8;
        floatY = Math.cos(now / 2300 + n.phaseB) * 2.2 + Math.sin(now / 5300 + n.phaseA) * 2.8;
      }

      screenPos[i * 2] = n.x * k + panX + floatX;
      screenPos[i * 2 + 1] = n.y * k + panY + floatY;
    }

    // Sort draw order: unselected first, hovered/selected on top
    const drawOrder = this.nodes.map((_, i) => i);
    drawOrder.sort((a, b) => {
      if (a === selected) return 1;
      if (b === selected) return -1;
      if (a === hovered) return 1;
      if (b === hovered) return -1;
      return 0;
    });

    // Node radius scales generously with zoom so photos and faces are clearly visible!
    const baseR = 18;
    const currentR = Math.max(12, Math.min(38, baseR * Math.pow(Math.max(relZoom, 0.4), 0.55)));

    // Draw individual personality nodes
    for (const i of drawOrder) {
      const sx = screenPos[i * 2];
      const sy = screenPos[i * 2 + 1];

      // Viewport culling
      if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;

      const node = this.nodes[i];
      const isHovered = i === hovered;
      const isSelected = i === selected;

      let r = currentR;
      if (isHovered || isSelected) r += 5;

      const photoImg = relZoom >= PHOTO_ZOOM_THRESHOLD && node.photo ? this.loadImage(node.photo) : null;

      // Draw avatar photo if loaded
      if (photoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.clip();
        const minDim = Math.min(photoImg.naturalWidth, photoImg.naturalHeight);
        ctx.drawImage(photoImg, 0, 0, minDim, minDim, sx - r, sy - r, r * 2, r * 2);
        ctx.restore();

        // Crisp colored ring
        ctx.save();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSelected || isHovered ? 3.5 : 2;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        // Fallback circle with temperament background and avatar letter/emoji
        ctx.save();
        ctx.fillStyle = node.colorBg || node.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSelected || isHovered ? 3 : 1.5;
        ctx.stroke();

        // Initial/Avatar inside
        if (r >= 12) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `700 ${Math.round(r * 0.85)}px Sora, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.avatar || node.name.charAt(0), sx, sy + 1);
        }
        ctx.restore();
      }

      // Outer animated accent ring when hovered or selected
      if (isHovered || isSelected) {
        ctx.save();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2.5;
        const pulse = Math.sin(now / 350) * 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, r + 5 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Name Label (drawn when zoomed in or when hovered/selected)
      const shouldDrawLabel = isHovered || isSelected || relZoom >= 1.4;
      if (shouldDrawLabel) {
        const labelText = isHovered || isSelected ? `${node.name} · ${node.mbti}` : node.name;
        const tx = sx + r + 6;
        const ty = sy;

        ctx.save();
        ctx.font = isHovered || isSelected ? "700 13px Poppins, sans-serif" : "600 12px Poppins, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // Halo outline
        ctx.lineWidth = 4;
        ctx.strokeStyle = isDark ? "rgba(16,16,16,0.95)" : "rgba(244,241,232,0.95)";
        ctx.strokeText(labelText, tx, ty);

        // Fill
        ctx.fillStyle = isHovered || isSelected ? (isDark ? "#ffffff" : "#101010") : (isDark ? "#e2ddcf" : "#22201b");
        ctx.fillText(labelText, tx, ty);
        ctx.restore();
      }
    }

    // 4. Render User ("TU") at their exact coordinates if they completed the test
    // "bila aia sa fie doar alba fara palpait si fara tu intj 96 86"
    if (userData.hasScores) {
      const ux = userData.x * k + panX;
      const uy = userData.y * k + panY;
      const isUserHovered = this.userHovered;
      const isUserSelected = this.userSelected;

      const baseUserR = 18;
      let userR = Math.max(13, Math.min(36, baseUserR * Math.pow(Math.max(relZoom, 0.4), 0.55)));
      if (isUserHovered || isUserSelected) userR += 4;

      ctx.save();
      // Drop shadow so it pops cleanly
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      // Solid pure white ball (NO pulsing, NO blinking, completely clean)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ux, uy, userR, 0, Math.PI * 2);
      ctx.fill();

      // Clean crisp dark/emerald border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = isUserSelected || isUserHovered ? "#10b981" : (isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.25)");
      ctx.lineWidth = isUserSelected || isUserHovered ? 3.5 : 2;
      ctx.stroke();
      ctx.restore();
    }

    // Continue animation loop if motion is enabled
    if (!this.isReducedMotion && !document.hidden) {
      this.rafId = requestAnimationFrame(() => this.draw());
    }
  }

  attachEvents() {
    const canvas = this.canvas;
    const wrap = this.wrap;
    if (!canvas || !wrap) return;

    // Window resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
      this.requestFrame();
    });
    resizeObserver.observe(wrap);

    // Mouse Pointer / Touch event handling
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // Find node closest to mouse (checking User first, then figures)
    const findHitNode = (mx, my) => {
      const { x: panX, y: panY, k } = this.transform;
      const relZoom = k / this.baseScale;
      const userData = this.getUserData();

      // 1. Check user node hit
      if (userData.hasScores) {
        const ux = userData.x * k + panX;
        const uy = userData.y * k + panY;
        const baseUserR = 18;
        const userR = Math.max(13, Math.min(36, baseUserR * Math.pow(Math.max(relZoom, 0.4), 0.55)));
        const dUser = Math.hypot(ux - mx, uy - my);
        if (dUser <= userR + 8) {
          return "user";
        }
      }

      // 2. Check personalities
      const baseR = 18;
      const currentR = Math.max(12, Math.min(38, baseR * Math.pow(Math.max(relZoom, 0.4), 0.55)));
      const hitThreshold = currentR + 8;

      let closestIdx = -1;
      let minDistance = hitThreshold;

      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        const sx = n.x * k + panX;
        const sy = n.y * k + panY;
        const d = Math.hypot(sx - mx, sy - my);
        if (d < minDistance) {
          minDistance = d;
          closestIdx = i;
        }
      }
      return closestIdx;
    };

    // Pointer Down (Mouse drag or touch start)
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, getPos(e));

      if (this.pointers.size === 1) {
        const p = getPos(e);
        this.isDragging = true;
        this.dragStart = { x: p.x, y: p.y, tx: this.transform.x, ty: this.transform.y };
        this.dragDistance = 0;
      } else if (this.pointers.size === 2) {
        // Pinch start
        const pts = Array.from(this.pointers.values());
        this.pinchStart = {
          dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
          k: this.transform.k
        };
      }
    });

    // Pointer Move
    canvas.addEventListener("pointermove", (e) => {
      const p = getPos(e);
      if (this.pointers.has(e.pointerId)) {
        this.pointers.set(e.pointerId, p);
      }

      // Two-finger pinch zoom
      if (this.pointers.size === 2 && this.pinchStart) {
        const pts = Array.from(this.pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const ratio = dist / this.pinchStart.dist;
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;

        const newK = Math.max(this.baseScale * 0.4, Math.min(this.baseScale * 12, this.pinchStart.k * ratio));
        const kRatio = newK / this.transform.k;

        this.transform = {
          k: newK,
          x: midX - (midX - this.transform.x) * kRatio,
          y: midY - (midY - this.transform.y) * kRatio
        };
        this.requestFrame();
        return;
      }

      // One-finger or mouse drag
      if (this.isDragging && this.pointers.size === 1) {
        const dx = p.x - this.dragStart.x;
        const dy = p.y - this.dragStart.y;
        this.dragDistance += Math.hypot(dx, dy);

        this.transform.x = this.dragStart.tx + dx;
        this.transform.y = this.dragStart.ty + dy;
        this.requestFrame();
      } else if (e.pointerType === "mouse") {
        // Check hover
        const hit = findHitNode(p.x, p.y);
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

      // If it was a click without significant drag
      if (this.isDragging && this.dragDistance < 6) {
        const p = getPos(e);
        const hit = findHitNode(p.x, p.y);
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

    // Pointer Leave
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
      cancelAnimationFrame(this.flyRafId);

      const p = getPos(e);
      const zoomFactor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016));
      const newK = Math.max(this.baseScale * 0.45, Math.min(this.baseScale * 12, this.transform.k * zoomFactor));
      const kRatio = newK / this.transform.k;

      this.transform = {
        k: newK,
        x: p.x - (p.x - this.transform.x) * kRatio,
        y: p.y - (p.y - this.transform.y) * kRatio
      };
      this.requestFrame();
    }, { passive: false });

    // Keyboard Esc to close
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.deselectNode();
      }
    });

    // Navigation buttons in header
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

    // Search Box live autocomplete
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
          .filter(n => n.name.toLowerCase().includes(q) || n.mbti.toLowerCase().includes(q))
          .slice(0, 6);

        if (matches.length === 0) {
          suggestionsList.style.display = "none";
          return;
        }

        suggestionsList.innerHTML = matches.map(m => `
          <li>
            <button type="button" data-idx="${m.index}">
              <span class="tree-dot" style="background: ${m.color};"></span>
              <span><b>${m.name}</b> <small style="opacity: 0.7;">(${m.mbti})</small></span>
            </button>
          </li>
        `).join("");

        suggestionsList.style.display = "block";

        suggestionsList.querySelectorAll("button").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            suggestionsList.style.display = "none";
            this.searchQuery = "";
            searchInput.value = "";
            this.selectNode(idx, true);
          });
        });
      });

      // Close dropdown on outside click
      document.addEventListener("click", (evt) => {
        if (!searchInput.contains(evt.target) && !suggestionsList.contains(evt.target)) {
          suggestionsList.style.display = "none";
        }
      });
    }
  }

  selectNode(idx, flyTo = true) {
    if (idx < 0 || idx >= this.nodes.length) return;
    this.selectedIndex = idx;
    this.userSelected = false;
    const node = this.nodes[idx];

    // Smooth fly to center
    if (flyTo) {
      this.flyToNode(node);
    }

    // Open detail side panel
    this.renderSidePanel(node);
    this.requestFrame();
  }

  selectUser() {
    const userData = this.getUserData();
    if (!userData.hasScores) return;

    this.userSelected = true;
    this.selectedIndex = -1;

    this.flyToNode({ x: userData.x, y: userData.y });
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

  flyToNode(node) {
    if (!this.wrap) return;
    cancelAnimationFrame(this.flyRafId);

    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;

    const startX = this.transform.x;
    const startY = this.transform.y;
    const startK = this.transform.k;

    const targetK = Math.max(startK, this.baseScale * 3.8);
    // Shift slightly to the left on desktop to leave room for side panel
    const offsetX = w > 820 ? 180 : 0;
    const targetX = (w - offsetX) / 2 - node.x * targetK;
    const targetY = h / 2 - node.y * targetK;

    const duration = 650;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const p = Math.min(1, elapsed / duration);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - p, 3);

      this.transform = {
        k: startK + (targetK - startK) * ease,
        x: startX + (targetX - startX) * ease,
        y: startY + (targetY - startY) * ease
      };

      this.requestFrame();

      if (p < 1) {
        this.flyRafId = requestAnimationFrame(animate);
      }
    };

    this.flyRafId = requestAnimationFrame(animate);
  }

  focusOnUser() {
    this.selectUser();
  }

  renderSidePanel(node) {
    const panel = document.getElementById("tree-panel");
    if (!panel) return;

    const lang = this.app.state.lang || "ro";
    const userData = this.getUserData();
    const cleanRole = getFigureRole(node.rawFig || node, lang);
    const mbtiData = MBTI_TYPES[node.mbti] || {};

    // Calculate similarity with user if available
    let simPct = null;
    if (userData.hasScores) {
      simPct = calculateFigureSimilarity(userData.percentages, userData.axisScores, node);
    }

    // Find 5 closest personalities on the spectrum
    const similar = this.nodes
      .filter(n => n.id !== node.id)
      .map(n => {
        const dist = Math.hypot(n.x - node.x, n.y - node.y);
        const match = Math.max(10, Math.min(99, Math.round(100 - (dist / WORLD_W) * 140)));
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
              ${simPct !== null ? `<span class="fig-modal-sim-tag">${simPct}% ${lang === 'ro' ? 'compatibilitate' : 'match'}</span>` : ''}
            </div>
            <h2 class="fig-modal-name">${node.name}</h2>
            <div class="fig-modal-role">${cleanRole}</div>
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

        <!-- Closest Personalities on Spectrum -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? 'Personalități Asemănătoare' : 'Closest on Spectrum'}</h4>
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
                  <span class="tree-similar-name">${sNode.name} <small style="opacity:0.75; font-weight:600;">(${sNode.mbti})</small></span>
                  <span class="tree-similar-pct">${match}%</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    panel.style.display = "flex";

    // Close button
    const closeBtn = document.getElementById("tree-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.deselectNode());
    }

    // Similar personality buttons navigate and fly camera
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

    // Closest figures to user's spectrum coordinates
    const similar = this.nodes
      .map(n => {
        const dist = Math.hypot(n.x - userData.x, n.y - userData.y);
        const match = Math.max(10, Math.min(99, Math.round(100 - (dist / WORLD_W) * 140)));
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
              <span class="fig-modal-sim-tag" style="background: #10b981;">${lang === 'ro' ? 'Profilul tău' : 'Your Profile'}</span>
            </div>
            <h2 class="fig-modal-name">${lang === 'ro' ? 'Poziția Ta pe Spectru' : 'Your Spectrum Position'}</h2>
            <div class="fig-modal-role">${Math.round(userData.tPct)}% Thinking · ${Math.round(userData.nPct)}% Intuition</div>
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

        <!-- Closest Personalities on Spectrum -->
        <div class="fig-modal-sec">
          <h4 class="fig-modal-sec-title">${lang === 'ro' ? 'Personalități Asemănătoare pe Spectru' : 'Closest Personalities on Spectrum'}</h4>
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
                  <span class="tree-similar-name">${sNode.name} <small style="opacity:0.75; font-weight:600;">(${sNode.mbti})</small></span>
                  <span class="tree-similar-pct">${match}%</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    panel.style.display = "flex";

    // Close button
    const closeBtn = document.getElementById("tree-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.deselectNode());
    }

    // Similar personality buttons navigate and fly camera
    panel.querySelectorAll("[data-sim-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sIdx = parseInt(btn.getAttribute("data-sim-idx"), 10);
        this.selectNode(sIdx, true);
      });
    });
  }
}
