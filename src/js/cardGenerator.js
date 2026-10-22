/**
 * 8Func - High-Resolution Results Card Generator
 * Renders the complete pastel summary card matching the 8Func visual spec.
 */

import { COGNITIVE_FUNCTIONS } from "../data/functions.js";
import { TEMPERAMENTS } from "../data/mbtiTypes.js";

// Specific pastel/vibrant colors for each of the 8 cognitive functions matching the exact reference spec
export const FUNCTION_CARD_COLORS = {
  Ni: "#8e5f78", // rich muted plum/mauve
  Ti: "#7ccddb", // crisp pastel sky blue/cyan
  Te: "#72cccd", // vibrant pastel cyan
  Ne: "#82596f", // muted plum
  Se: "#e0bf38", // pastel golden yellow
  Fi: "#94cdd0", // soft pastel sage teal
  Fe: "#9ac262", // vibrant pastel lime green
  Si: "#e5c727"  // pastel mustard gold
};

// Colors for the 4 Axis slider cards
export const AXIS_CARD_COLORS = {
  ENERGY: "#394e8b",  // deep vibrant blue
  MIND: "#8e5f78",    // rich muted plum
  NATURE: "#72cccd",  // crisp cyan
  TACTICS: "#395296"  // deep royal blue
};

// Colors for the 2D Spectrum Quadrants (Mind & Nature)
export const QUADRANT_COLORS = {
  NF: "#9ac262", // top-left (green)
  NT: "#90607a", // top-right (purple)
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
 * Balanced squarish layout (760x920) with 4 similar figures and top-right match percentage.
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
  const baseW = 760;
  const baseH = 920;

  canvas.width = baseW * scale;
  canvas.height = baseH * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const FONT_FAMILY = "'Poppins', 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // 1. Background Gradient (deep rich dark personality color)
  const tempCode = topMbti?.temperament || "NT";
  let bgDarkStart = "#241828";
  let bgDarkEnd = "#140c17";
  let ambientGlowColor = "rgba(144, 96, 122, 0.35)";

  if (tempCode === "NF") {
    bgDarkStart = "#18281c";
    bgDarkEnd = "#0c170e";
    ambientGlowColor = "rgba(154, 194, 98, 0.32)";
  } else if (tempCode === "SJ") {
    bgDarkStart = "#15242b";
    bgDarkEnd = "#0b151a";
    ambientGlowColor = "rgba(114, 204, 205, 0.32)";
  } else if (tempCode === "SP") {
    bgDarkStart = "#2b2112";
    bgDarkEnd = "#160f07";
    ambientGlowColor = "rgba(229, 199, 39, 0.32)";
  }

  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, baseW, baseH);
  bgGrad.addColorStop(0, bgDarkStart);
  bgGrad.addColorStop(1, bgDarkEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, baseW, baseH);

  // Subtle ambient radial glows for high-end aesthetic depth
  const glow1 = ctx.createRadialGradient(baseW * 0.85, baseH * 0.15, 20, baseW * 0.85, baseH * 0.15, 340);
  glow1.addColorStop(0, ambientGlowColor);
  glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, baseW, baseH);

  const glow2 = ctx.createRadialGradient(baseW * 0.15, baseH * 0.85, 20, baseW * 0.15, baseH * 0.85, 300);
  glow2.addColorStop(0, ambientGlowColor);
  glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, baseW, baseH);

  // ----------------------------------------------------
  // HEADER
  // ----------------------------------------------------
  const marginX = 36;
  let curY = 36;

  // 1. 8func logo badge (left)
  roundRect(ctx, marginX, curY, 40, 40, 10);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Number "8"
  ctx.fillStyle = "#111111";
  ctx.font = `800 24px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("8", marginX + 20, curY + 21);

  // Text "func"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 28px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("func", marginX + 50, curY + 21);

  // 2. Top Right Matching Percentage Badge
  const matchPct = topMbti?.matchPercentage ?? 90;
  const badgeW = 138;
  const badgeH = 42;
  const badgeX = baseW - marginX - badgeW;
  const badgeY = curY - 1;

  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 21);
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Badge Text: "94%" (bright white) + "MATCH" (accent)
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `800 17px ${FONT_FAMILY}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`${matchPct}%`, badgeX + 16, badgeY + 21);
  const numW = ctx.measureText(`${matchPct}%`).width;

  ctx.font = `700 11px ${FONT_FAMILY}`;
  ctx.fillStyle = topMbti?.temperamentColor || "rgba(255, 255, 255, 0.85)";
  ctx.fillText("MATCH", badgeX + 16 + numW + 7, badgeY + 21.5);

  curY += 58;

  // Personality Family (Temperament title: e.g. "ANALYSTS")
  const tempTitle = (topMbti?.temperamentName || "Analysts").toUpperCase();
  const tempAccentColor = topMbti?.temperamentColor || "#a78bfa";
  ctx.fillStyle = tempAccentColor;
  ctx.font = `800 13px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(tempTitle, marginX, curY);

  curY += 26;

  // Personality Title & Code: e.g. "Architect (INTJ)"
  const titleText = `${topMbti?.title || "Architect"} `;
  const codeText = `(${topMbti?.type || "INTJ"})`;

  ctx.font = `800 32px ${FONT_FAMILY}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(titleText, marginX, curY);
  const titleWidth = ctx.measureText(titleText).width;

  ctx.fillStyle = tempAccentColor;
  ctx.fillText(codeText, marginX + titleWidth, curY);

  curY += 26; // Spacing before main grid

  // ----------------------------------------------------
  // MAIN GRID: LEFT (328px) & RIGHT (344px)
  // ----------------------------------------------------
  const gridTopY = curY;
  const leftColX = marginX;
  const leftColW = 328;
  const gapCol = 16;
  const rightColX = leftColX + leftColW + gapCol; // 380px
  const rightColW = 344;

  // ----------------------------------------------------
  // LEFT COLUMN: 8 Cognitive Functions (Ranked #1 to #8)
  // ----------------------------------------------------
  const funcsList = ["Ni", "Ne", "Te", "Ti", "Fe", "Fi", "Se", "Si"];
  const rankedFuncs = funcsList
    .map(f => ({ func: f, score: percentages?.[f] ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const fCardW = (leftColW - 12) / 2; // 158px
  const fCardH = 82;
  const fGapY = 10;
  const fGapX = 12;

  rankedFuncs.forEach((item, idx) => {
    const colIdx = idx % 2;
    const rowIdx = Math.floor(idx / 2);
    const cardX = leftColX + colIdx * (fCardW + fGapX);
    const cardY = gridTopY + rowIdx * (fCardH + fGapY);
    const cardColor = FUNCTION_CARD_COLORS[item.func] || "#8e5f78";

    // Card background
    roundRect(ctx, cardX, cardY, fCardW, fCardH, 14);
    ctx.fillStyle = cardColor;
    ctx.fill();

    // Subtle inset top highlight
    ctx.save();
    roundRect(ctx, cardX, cardY, fCardW, fCardH, 14);
    ctx.clip();
    const hlGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 22);
    hlGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    hlGrad.addColorStop(1, "transparent");
    ctx.fillStyle = hlGrad;
    ctx.fillRect(cardX, cardY, fCardW, 22);
    ctx.restore();

    // Rank (e.g. #1)
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = `700 12px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`#${idx + 1}`, cardX + fCardW / 2, cardY + 11);

    // Function name (e.g. Ni)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 28px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.func, cardX + fCardW / 2, cardY + 44);

    // Score (e.g. 94% score)
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = `600 11.5px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${item.score}% score`, cardX + fCardW / 2, cardY + fCardH - 8);
  });

  const funcsTotalHeight = 4 * fCardH + 3 * fGapY; // 358px

  // ----------------------------------------------------
  // LEFT COLUMN: 2D Spectrum Compass (Mind & Nature)
  // Perfectly square (328x328) with rounded corners
  // ----------------------------------------------------
  const matrixY = gridTopY + funcsTotalHeight + 14;
  const matrixSize = leftColW; // 328x328px
  const quadHalf = matrixSize / 2; // 164px

  ctx.save();
  roundRect(ctx, leftColX, matrixY, matrixSize, matrixSize, 18);
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
  ctx.arc(dotPxX, dotPxY, 13, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.fill();

  // Solid white center dot
  ctx.beginPath();
  ctx.arc(dotPxX, dotPxY, 7.5, 0, Math.PI * 2);
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

  const calcThumbPct = (poleA, poleB) => {
    const sum = (poleA ?? 50) + (poleB ?? 50);
    if (sum <= 0) return 50;
    return Math.round(((poleB ?? 50) / sum) * 100);
  };

  const axisData = [
    {
      title: "ENERGY",
      color: AXIS_CARD_COLORS.ENERGY,
      leftLabel: `Extraversion ${pE}%`,
      rightLabel: `${pI}% Introversion`,
      pct: calcThumbPct(pE, pI)
    },
    {
      title: "MIND",
      color: AXIS_CARD_COLORS.MIND,
      leftLabel: `Intuition ${pN}%`,
      rightLabel: `${pS}% Sensing`,
      pct: calcThumbPct(pN, pS)
    },
    {
      title: "NATURE",
      color: AXIS_CARD_COLORS.NATURE,
      leftLabel: `Thinking ${pT}%`,
      rightLabel: `${pF}% Feeling`,
      pct: calcThumbPct(pT, pF)
    },
    {
      title: "TACTICS",
      color: AXIS_CARD_COLORS.TACTICS,
      leftLabel: `Judging ${pJ}%`,
      rightLabel: `${pP}% Perceiving`,
      pct: calcThumbPct(pJ, pP)
    }
  ];

  const axisCardH = 82;
  const axisGapY = 10;

  axisData.forEach((ax, idx) => {
    const cardY = gridTopY + idx * (axisCardH + axisGapY);

    // Card background
    roundRect(ctx, rightColX, cardY, rightColW, axisCardH, 14);
    ctx.fillStyle = ax.color;
    ctx.fill();

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 11.5px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(ax.title, rightColX + 18, cardY + 13);

    // Slider track
    const trackPad = 18;
    const trackX1 = rightColX + trackPad;
    const trackW = rightColW - trackPad * 2;
    const trackY = cardY + 40;

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
    ctx.arc(thumbX, trackY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Labels below track
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `600 11.5px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(ax.leftLabel, trackX1, cardY + axisCardH - 10);

    ctx.textAlign = "right";
    ctx.fillText(ax.rightLabel, trackX1 + trackW, cardY + axisCardH - 10);
  });

  const axisTotalHeight = 4 * axisCardH + 3 * axisGapY; // 358px

  // ----------------------------------------------------
  // RIGHT COLUMN: 4 Similar Personalities (Notable Figures)
  // Stacked to match the 328px height of the 2D Quadrant Matrix!
  // ----------------------------------------------------
  const figuresY = gridTopY + axisTotalHeight + 14;
  const top4 = (similarFigures || []).slice(0, 4);

  const fallbackFigures = [
    { name: "Lilith", role: "Artist & Actor", mbti: topMbti?.type || "INTJ", similarity: 94, avatar: "🎨" },
    { name: "Karl Marx", role: "Philosopher", mbti: topMbti?.type || "INTJ", similarity: 88, avatar: "🏛️" },
    { name: "Solomon", role: "Lider & Politician", mbti: topMbti?.type || "INTJ", similarity: 87, avatar: "👑" },
    { name: "Friedrich Nietzsche", role: "Philosopher & Writer", mbti: topMbti?.type || "INTJ", similarity: 85, avatar: "⚡" }
  ];

  const displayFigures = top4.length >= 4 ? top4 : [...top4, ...fallbackFigures.slice(top4.length)];

  const figCardH = 74.5;
  const figGap = 10;

  displayFigures.forEach((fig, idx) => {
    const cardY = figuresY + idx * (figCardH + figGap);

    // Card background (deep tinted pastel card)
    roundRect(ctx, rightColX, cardY, rightColW, figCardH, 12);
    ctx.fillStyle = "rgba(75, 46, 68, 0.82)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Avatar circle (centered vertically)
    const avRadius = 17;
    const avCenterX = rightColX + 16 + avRadius;
    const avCenterY = cardY + figCardH / 2;

    ctx.beginPath();
    ctx.arc(avCenterX, avCenterY, avRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.fill();

    // Avatar icon/emoji
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fig.avatar || "👤", avCenterX, avCenterY + 1);

    // Text block
    const textStartX = rightColX + 54;

    // Line 1: Name and Similarity %
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 13.5px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(fig.name || "Notable Figure", textStartX, cardY + 12);

    const simPct = fig.similarity ?? 90;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 14px ${FONT_FAMILY}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`${simPct}%`, rightColX + rightColW - 16, cardY + 12);

    // Line 2: Role & MBTI pill
    const cleanRole = (fig.role ? fig.role.replace(/\s*·\s*[A-Z]{4}\s*$/i, "").trim() : (fig.profession || "Leader"));
    ctx.fillStyle = "rgba(240, 225, 245, 0.85)";
    ctx.font = `500 11px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(cleanRole, textStartX, cardY + 32);
    const roleWidth = ctx.measureText(cleanRole).width;

    // MBTI badge pill
    const pillX = textStartX + roleWidth + 6;
    const pillY = cardY + 30;
    const pillW = 40;
    const pillH = 16;
    roundRect(ctx, pillX, pillY, pillW, pillH, 4);
    ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 9.5px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fig.mbti || "INTJ", pillX + pillW / 2, pillY + pillH / 2 + 0.5);

    // Line 3: Progress bar at bottom
    const barX = textStartX;
    const barW = (rightColX + rightColW - 16) - barX;
    const barY = cardY + 55;
    const barH = 4;

    // Track
    roundRect(ctx, barX, barY, barW, barH, 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fill();

    // Fill
    const fillW = Math.max(4, (simPct / 100) * barW);
    roundRect(ctx, barX, barY, fillW, barH, 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  });

  return canvas.toDataURL("image/png");
}

/**
 * Converts a base64 data URL to a standard binary Blob safely without fetch().
 */
export function dataUrlToBlob(dataUrl) {
  try {
    const parts = dataUrl.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("dataUrlToBlob error:", e);
    return null;
  }
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

  const blob = dataUrlToBlob(dataUrl);
  const blobUrl = blob ? URL.createObjectURL(blob) : dataUrl;
  const fileName = `8Func-${topMbti?.type || 'Results'}-${topMbti?.title || 'Profile'}.png`;

  const modalHtml = `
    <div class="modal-overlay active is-open" id="results-image-modal" style="display: flex !important; z-index: 99999; opacity: 1 !important; pointer-events: auto !important; visibility: visible !important;">
      <div class="modal-content" style="max-width: 580px; width: 92%; padding: 1.5rem; max-height: 90vh; display: flex; flex-direction: column; opacity: 1 !important; transform: scale(1) !important;">
        <header class="modal-header" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
          <h3 class="modal-title" style="margin: 0; font-size: 1.25rem; font-weight: 800;">
            ${lang === "ro" ? "Card Rezultate 8Func" : "8Func Results Share Card"}
          </h3>
          <button class="modal-close" type="button" id="img-modal-close-x" style="background:none; border:none; cursor:pointer; font-size: 1.6rem; color: var(--text-muted); line-height: 1;">&times;</button>
        </header>
        
        <div class="modal-body" style="overflow-y: auto; text-align: center; padding: 0.5rem 0;">
          <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.45); display: inline-block; max-width: 100%;">
            <img src="${blobUrl}" alt="8Func Results Card" style="width: 100%; height: auto; display: block;" />
          </div>
        </div>
        
        <footer class="modal-actions" style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
          <button class="e-btn e-btn-outline" type="button" id="img-modal-share-btn" style="display: none;">
            🔗 <span>${lang === "ro" ? "Distribuie" : "Share"}</span>
          </button>
          <button class="e-btn e-btn-outline" type="button" id="img-modal-copy-btn">
            📋 <span>${lang === "ro" ? "Copiază Imaginea" : "Copy Image"}</span>
          </button>
          <a class="e-btn e-btn-primary" id="img-modal-download-btn" href="${blobUrl}" download="${fileName}">
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
  const close = () => {
    modal?.remove();
    if (blobUrl && blobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(blobUrl);
    }
  };

  document.getElementById("img-modal-close-x")?.addEventListener("click", close);
  document.getElementById("img-modal-close-btn")?.addEventListener("click", close);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Native Web Share API if supported
  const shareBtn = document.getElementById("img-modal-share-btn");
  if (shareBtn && navigator.share && blob) {
    shareBtn.style.display = "inline-flex";
    shareBtn.addEventListener("click", async () => {
      try {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `8Func - ${topMbti?.title || 'Profile'} (${topMbti?.type || 'MBTI'})`,
            text: `Rezultatele mele 8Func: ${topMbti?.title || 'Profile'} (${topMbti?.type || 'MBTI'})!`,
            files: [file]
          });
        } else {
          await navigator.share({
            title: `8Func - ${topMbti?.type || 'Results'}`,
            url: window.location.href
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") console.warn("Share error:", err);
      }
    });
  }

  // Copy to clipboard handler
  document.getElementById("img-modal-copy-btn")?.addEventListener("click", async () => {
    try {
      if (!blob) throw new Error("Image blob unavailable");
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        const btnSpan = document.querySelector("#img-modal-copy-btn span");
        if (btnSpan) {
          const oldText = btnSpan.textContent;
          btnSpan.textContent = lang === "ro" ? "Copiat în clipboard!" : "Copied to clipboard!";
          setTimeout(() => { btnSpan.textContent = oldText; }, 2000);
        }
      } else {
        throw new Error("Clipboard API unsupported");
      }
    } catch (err) {
      console.warn("Clipboard copy unavailable, downloading PNG instead:", err);
      // Trigger download fallback
      const dlLink = document.getElementById("img-modal-download-btn");
      if (dlLink) dlLink.click();
    }
  });

  // Download button handler to ensure download trigger on mobile
  document.getElementById("img-modal-download-btn")?.addEventListener("click", () => {
    const btnSpan = document.querySelector("#img-modal-download-btn span");
    if (btnSpan) {
      const oldText = btnSpan.textContent;
      btnSpan.textContent = lang === "ro" ? "Se descarcă..." : "Downloading...";
      setTimeout(() => { btnSpan.textContent = oldText; }, 1500);
    }
  });
}
