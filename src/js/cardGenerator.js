/**
 * 8Func - High-Resolution Results Card Generator
 * Renders the complete pastel summary card matching the 8Func visual spec.
 */

import { COGNITIVE_FUNCTIONS } from "../data/functions.js";
import { TEMPERAMENTS } from "../data/mbtiTypes.js";

// Specific pastel/vibrant colors for each of the 8 cognitive functions matching the spec
export const FUNCTION_CARD_COLORS = {
  Ni: "#8d5b86", // pastel plum / purple
  Ti: "#52b6b6", // pastel teal
  Te: "#40b8c6", // pastel cyan
  Ne: "#7c5678", // pastel dark mauve/purple
  Se: "#e0bf38", // pastel yellow / gold
  Fi: "#71b272", // pastel sage green
  Fe: "#7ec768", // pastel lime green
  Si: "#d8b22a"  // pastel gold / amber
};

// Colors for the 4 Axis slider cards
export const AXIS_CARD_COLORS = {
  ENERGY: "#3e64b8",  // blue
  MIND: "#834e6c",    // plum / maroon
  NATURE: "#49b3b8",  // cyan / teal
  TACTICS: "#375ab8"  // deep blue
};

// Colors for the 2D Spectrum Quadrants (Mind & Nature)
export const QUADRANT_COLORS = {
  NF: "#9ac262", // top-left (green)
  NT: "#95637e", // top-right (purple)
  SF: "#e5c727", // bottom-left (yellow)
  ST: "#72cccd"  // bottom-right (cyan)
};

/**
 * Draws a rounded rectangle path on canvas.
 */
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: radius.tl || 0, tr: radius.tr || 0, br: radius.br || 0, bl: radius.bl || 0 };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

/**
 * Generates the complete high-resolution results card as a PNG data URL.
 */
export function generateResultsCardCanvas({
  topMbti,
  percentages,
  axisScores,
  similarFigures = [],
  lang = "ro"
}) {
  const canvas = document.createElement("canvas");
  const scale = 2; // Retina 2x scale for ultra-crisp output
  const baseW = 840;
  const baseH = 1080;

  canvas.width = baseW * scale;
  canvas.height = baseH * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // 1. Background Gradient (deep dark personality color)
  const tempCode = topMbti?.temperament || "NT";
  let bgDarkStart = "#241635";
  let bgDarkEnd = "#120b1b";
  let ambientGlowColor = "rgba(149, 99, 126, 0.32)";

  if (tempCode === "NF") {
    bgDarkStart = "#172b1b";
    bgDarkEnd = "#0a160d";
    ambientGlowColor = "rgba(154, 194, 98, 0.28)";
  } else if (tempCode === "SJ") {
    bgDarkStart = "#12252c";
    bgDarkEnd = "#081318";
    ambientGlowColor = "rgba(114, 204, 205, 0.28)";
  } else if (tempCode === "SP") {
    bgDarkStart = "#2b210f";
    bgDarkEnd = "#130e06";
    ambientGlowColor = "rgba(229, 199, 39, 0.28)";
  }

  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, baseW, baseH);
  bgGrad.addColorStop(0, bgDarkStart);
  bgGrad.addColorStop(1, bgDarkEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, baseW, baseH);

  // Ambient radial glows for rich visual texture
  const glow1 = ctx.createRadialGradient(baseW * 0.85, baseH * 0.15, 20, baseW * 0.85, baseH * 0.15, 380);
  glow1.addColorStop(0, ambientGlowColor);
  glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, baseW, baseH);

  const glow2 = ctx.createRadialGradient(baseW * 0.15, baseH * 0.85, 20, baseW * 0.15, baseH * 0.85, 320);
  glow2.addColorStop(0, ambientGlowColor);
  glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, baseW, baseH);

  // ----------------------------------------------------
  // HEADER
  // ----------------------------------------------------
  const marginX = 40;
  let curY = 40;

  // 8func logo badge
  // White pill container
  roundRect(ctx, marginX, curY, 44, 44, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Number 8
  ctx.fillStyle = "#101010";
  ctx.font = "900 26px 'Sora', 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("8", marginX + 22, curY + 23);

  // Text "func"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 32px 'Sora', 'Poppins', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("func", marginX + 54, curY + 23);

  curY += 66;

  // Personality Family (Temperament title)
  const tempTitle = (topMbti?.temperamentName || "Analysts").toUpperCase();
  const tempAccentColor = topMbti?.temperamentColor || "#a78bfa";
  ctx.fillStyle = tempAccentColor;
  ctx.font = "800 15px 'Sora', 'Poppins', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.letterSpacing = "0.08em";
  ctx.fillText(tempTitle, marginX, curY);

  curY += 34;

  // Personality Title & Code: e.g. "Architect (INTJ)"
  const titleText = `${topMbti?.title || "Architect"} `;
  const codeText = `(${topMbti?.type || "INTJ"})`;

  ctx.font = "900 38px 'Sora', 'Poppins', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(titleText, marginX, curY);
  const titleWidth = ctx.measureText(titleText).width;

  ctx.fillStyle = tempAccentColor;
  ctx.fillText(codeText, marginX + titleWidth, curY);

  curY += 28; // Spacing before grid

  // ----------------------------------------------------
  // MAIN GRID: LEFT (350px) & RIGHT (390px)
  // ----------------------------------------------------
  const gridTopY = curY;
  const leftColX = marginX;
  const leftColW = 350;
  const gapCol = 20;
  const rightColX = leftColX + leftColW + gapCol; // 410
  const rightColW = 390;

  // ----------------------------------------------------
  // LEFT COLUMN: 8 Cognitive Functions (Ranked #1 to #8)
  // ----------------------------------------------------
  const funcsList = ["Ni", "Ne", "Te", "Ti", "Fe", "Fi", "Se", "Si"];
  const rankedFuncs = funcsList
    .map(f => ({ func: f, score: percentages?.[f] ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const fCardW = (leftColW - 14) / 2; // 168px
  const fCardH = 92;
  const fGap = 12;

  rankedFuncs.forEach((item, idx) => {
    const colIdx = idx % 2;
    const rowIdx = Math.floor(idx / 2);
    const cardX = leftColX + colIdx * (fCardW + 14);
    const cardY = gridTopY + rowIdx * (fCardH + fGap);
    const cardColor = FUNCTION_CARD_COLORS[item.func] || "#7c5678";

    // Card background
    roundRect(ctx, cardX, cardY, fCardW, fCardH, 16);
    ctx.fillStyle = cardColor;
    ctx.fill();

    // Subtle inset top highlight
    ctx.save();
    roundRect(ctx, cardX, cardY, fCardW, fCardH, 16);
    ctx.clip();
    const hlGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 25);
    hlGrad.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    hlGrad.addColorStop(1, "transparent");
    ctx.fillStyle = hlGrad;
    ctx.fillRect(cardX, cardY, fCardW, 25);
    ctx.restore();

    // Rank (e.g. #1)
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = "800 13px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`#${idx + 1}`, cardX + fCardW / 2, cardY + 11);

    // Function name (e.g. Ni)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 32px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.func, cardX + fCardW / 2, cardY + 49);

    // Score (e.g. 94% score)
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "700 13px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${item.score}% score`, cardX + fCardW / 2, cardY + fCardH - 9);
  });

  const funcsTotalHeight = 4 * fCardH + 3 * fGap; // 404px

  // ----------------------------------------------------
  // LEFT COLUMN: 2D Spectrum Compass (Mind & Nature)
  // ----------------------------------------------------
  const matrixY = gridTopY + funcsTotalHeight + 16;
  const matrixSize = leftColW; // 350x350px
  const quadHalf = matrixSize / 2; // 175px

  ctx.save();
  roundRect(ctx, leftColX, matrixY, matrixSize, matrixSize, 20);
  ctx.clip();

  // Quadrants:
  // Top-Left: NF (green)
  ctx.fillStyle = QUADRANT_COLORS.NF;
  ctx.fillRect(leftColX, matrixY, quadHalf, quadHalf);

  // Top-Right: NT (purple)
  ctx.fillStyle = QUADRANT_COLORS.NT;
  ctx.fillRect(leftColX + quadHalf, matrixY, quadHalf, quadHalf);

  // Bottom-Left: SF (yellow)
  ctx.fillStyle = QUADRANT_COLORS.SF;
  ctx.fillRect(leftColX, matrixY + quadHalf, quadHalf, quadHalf);

  // Bottom-Right: ST (cyan)
  ctx.fillStyle = QUADRANT_COLORS.ST;
  ctx.fillRect(leftColX + quadHalf, matrixY + quadHalf, quadHalf, quadHalf);

  // Thin dividing line
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftColX, matrixY + quadHalf);
  ctx.lineTo(leftColX + matrixSize, matrixY + quadHalf);
  ctx.moveTo(leftColX + quadHalf, matrixY);
  ctx.lineTo(leftColX + quadHalf, matrixY + matrixSize);
  ctx.stroke();

  // User position dot (F left 0%, T right 100% / N top 0%, S bottom 100%)
  const pN = axisScores?.NS?.roundA ?? 50;
  const pT = axisScores?.TF?.roundA ?? 50;
  const compassX = Math.max(12, Math.min(88, pT));
  const compassY = Math.max(12, Math.min(88, 100 - pN));

  const dotPxX = leftColX + (compassX / 100) * matrixSize;
  const dotPxY = matrixY + (compassY / 100) * matrixSize;

  // Outer glow
  ctx.beginPath();
  ctx.arc(dotPxX, dotPxY, 14, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fill();

  // Solid white center dot
  ctx.beginPath();
  ctx.arc(dotPxX, dotPxY, 8.5, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.restore();

  // ----------------------------------------------------
  // RIGHT COLUMN: 4 MBTI Spectrum Axis Sliders
  // ----------------------------------------------------
  const pE = axisScores?.EI?.roundA ?? 50;
  const pI = axisScores?.EI?.roundB ?? 50;
  const pS = axisScores?.NS?.roundB ?? 50;
  const pF = axisScores?.TF?.roundB ?? 50;
  const pJ = axisScores?.JP?.roundA ?? 50;
  const pP = axisScores?.JP?.roundB ?? 50;

  const axisData = [
    {
      title: "ENERGY",
      color: AXIS_CARD_COLORS.ENERGY,
      leftLabel: `Extraversion ${pE}%`,
      rightLabel: `${pI}% Introversion`,
      // Slider thumb: 0% E -> 100% I
      pct: pI
    },
    {
      title: "MIND",
      color: AXIS_CARD_COLORS.MIND,
      leftLabel: `Intuition ${pN}%`,
      rightLabel: `${pS}% Sensing`,
      // Slider thumb: 0% N -> 100% S
      pct: pS
    },
    {
      title: "NATURE",
      color: AXIS_CARD_COLORS.NATURE,
      leftLabel: `Thinking ${pT}%`,
      rightLabel: `${pF}% Feeling`,
      // Slider thumb: 0% T -> 100% F
      pct: pF
    },
    {
      title: "TACTICS",
      color: AXIS_CARD_COLORS.TACTICS,
      leftLabel: `Judging ${pJ}%`,
      rightLabel: `${pP}% Perceiving`,
      // Slider thumb: 0% J -> 100% P
      pct: pP
    }
  ];

  const axisCardH = 92;
  const axisGap = 12;

  axisData.forEach((ax, idx) => {
    const cardY = gridTopY + idx * (axisCardH + axisGap);

    // Card background
    roundRect(ctx, rightColX, cardY, rightColW, axisCardH, 16);
    ctx.fillStyle = ax.color;
    ctx.fill();

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 12px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.letterSpacing = "0.08em";
    ctx.fillText(ax.title, rightColX + 22, cardY + 16);

    // Slider track
    const trackPad = 22;
    const trackX1 = rightColX + trackPad;
    const trackW = rightColW - trackPad * 2;
    const trackY = cardY + 45;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trackX1, trackY);
    ctx.lineTo(trackX1 + trackW, trackY);
    ctx.stroke();

    // White thumb knob
    const thumbX = trackX1 + (Math.max(4, Math.min(96, ax.pct)) / 100) * trackW;
    ctx.beginPath();
    ctx.arc(thumbX, trackY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Labels below track
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 12px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(ax.leftLabel, trackX1, cardY + axisCardH - 12);

    ctx.textAlign = "right";
    ctx.fillText(ax.rightLabel, trackX1 + trackW, cardY + axisCardH - 12);
  });

  const axisTotalHeight = 4 * axisCardH + 3 * axisGap; // 404px

  // ----------------------------------------------------
  // RIGHT COLUMN: Top 3 Similar Personalities (Notable Figures)
  // ----------------------------------------------------
  const figuresY = gridTopY + axisTotalHeight + 16;
  const top3 = (similarFigures || []).slice(0, 3);

  // If less than 3, fallback mock
  const displayFigures = top3.length >= 3 ? top3 : [
    { name: "Lilith", role: "Artist & Actor · INTJ", mbti: "INTJ", similarity: 94, avatar: "🎨" },
    { name: "Karl Marx", role: "Philosopher · INTJ", mbti: "INTJ", similarity: 88, avatar: "🏛️" },
    { name: "Solomon", role: "Lider & Politician · INTJ", mbti: "INTJ", similarity: 87, avatar: "👑" }
  ];

  const figCardH = 76;
  const figGap = 12;

  displayFigures.forEach((fig, idx) => {
    const cardY = figuresY + idx * (figCardH + figGap);

    // Card background (deep pastel card)
    roundRect(ctx, rightColX, cardY, rightColW, figCardH, 14);
    ctx.fillStyle = "rgba(80, 52, 75, 0.75)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Avatar circle
    const avX = rightColX + 16;
    const avY = cardY + 16;
    const avSize = 36;
    ctx.beginPath();
    ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.fill();

    // Avatar icon/emoji
    ctx.font = "20px 'Sora', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fig.avatar || "👤", avX + avSize / 2, avY + avSize / 2 + 1);

    // Name
    const textStartX = avX + avSize + 14;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 15px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(fig.name || "Notable Figure", textStartX, cardY + 14);

    // Role & MBTI
    const roleText = fig.role || `${fig.profession || 'Leader'} · ${fig.mbti}`;
    ctx.fillStyle = "rgba(240, 220, 245, 0.85)";
    ctx.font = "600 12px 'Sora', 'Poppins', sans-serif";
    ctx.fillText(roleText, textStartX, cardY + 34);

    // Similarity %
    const simPct = fig.similarity ?? 90;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 16px 'Sora', 'Poppins', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`${simPct}%`, rightColX + rightColW - 18, cardY + 14);

    // Progress bar at bottom
    const barX = textStartX;
    const barW = (rightColX + rightColW - 18) - barX;
    const barY = cardY + 56;
    const barH = 5;

    // Track
    roundRect(ctx, barX, barY, barW, barH, 2.5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    // Fill
    const fillW = Math.max(4, (simPct / 100) * barW);
    roundRect(ctx, barX, barY, fillW, barH, 2.5);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  });

  return canvas.toDataURL("image/png");
}

/**
 * Opens a modal preview allowing the user to view, copy, or download the generated card.
 */
export function openResultsImageModal({
  dataUrl,
  topMbti,
  lang = "ro"
}) {
  const existingModal = document.getElementById("results-image-modal");
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div class="modal-overlay is-open" id="results-image-modal" style="display: flex; z-index: 9999;">
      <div class="modal-content" style="max-width: 580px; width: 92%; padding: 1.5rem; max-height: 90vh; display: flex; flex-direction: column;">
        <header class="modal-header" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
          <h3 class="modal-title" style="margin: 0; font-size: 1.25rem; font-weight: 800;">
            ${lang === "ro" ? "Card Rezultate 8Func" : "8Func Results Share Card"}
          </h3>
          <button class="modal-close" type="button" id="img-modal-close-x" style="background:none; border:none; cursor:pointer; font-size: 1.5rem; color: var(--text-muted);">&times;</button>
        </header>
        
        <div class="modal-body" style="overflow-y: auto; text-align: center; padding: 0.5rem 0;">
          <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.45); display: inline-block; max-width: 100%;">
            <img src="${dataUrl}" alt="8Func Results Card" style="width: 100%; height: auto; display: block;" />
          </div>
        </div>
        
        <footer class="modal-actions" style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
          <button class="e-btn e-btn-outline" type="button" id="img-modal-copy-btn">
            📋 <span>${lang === "ro" ? "Copiază Imaginea" : "Copy Image"}</span>
          </button>
          <a class="e-btn e-btn-primary" id="img-modal-download-btn" href="${dataUrl}" download="8Func-${topMbti?.type || 'Results'}-${topMbti?.title || 'Profile'}.png">
            📥 <span>${lang === "ro" ? "Descarcă PNG" : "Download PNG"}</span>
          </a>
          <button class="e-btn e-btn-outline" type="button" id="img-modal-close-btn">
            ${lang === "ro" ? "Închide" : "Close"}
          </button>
        </footer>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("results-image-modal");
  const close = () => modal?.remove();

  document.getElementById("img-modal-close-x")?.addEventListener("click", close);
  document.getElementById("img-modal-close-btn")?.addEventListener("click", close);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Copy to clipboard handler
  document.getElementById("img-modal-copy-btn")?.addEventListener("click", async () => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      const btnSpan = document.querySelector("#img-modal-copy-btn span");
      if (btnSpan) {
        const oldText = btnSpan.textContent;
        btnSpan.textContent = lang === "ro" ? "Copiat în clipboard!" : "Copied to clipboard!";
        setTimeout(() => { btnSpan.textContent = oldText; }, 2000);
      }
    } catch (err) {
      alert(lang === "ro" ? "Nu s-a putut copia automat. Te rugăm să descarci fișierul PNG." : "Could not copy automatically. Please download the PNG.");
    }
  });
}
