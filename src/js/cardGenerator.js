/**
 * 8Func - High-Resolution Results Card Generator (A4 Spec)
 * Renders the complete pastel summary card matching the 8Func visual spec in full A4 ratio.
 */

import { FUNCTIONS_LIST } from "../data/functions.js";
import { getFigureRole } from "../data/figures.js";

// Specific pastel/vibrant colors for each of the 8 cognitive functions matching the exact website spec
export function getFunctionCardColor(f) {
  if (f === "Ne" || f === "Ni") return "#95637e";
  if (f === "Te" || f === "Ti") return "#72cccd";
  if (f === "Se" || f === "Si") return "#e5c727";
  if (f === "Fe" || f === "Fi") return "#9ac262";
  return "#95637e";
}

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
  NT: "#95637e", // top-right (purple)
  SF: "#e5c727", // bottom-left (yellow)
  ST: "#72cccd"  // bottom-right (cyan)
};

/**
 * Draws a rounded rectangle path on canvas.
 */
function roundRect(ctx, x, y, width, height, radius) {
  const maxR = Math.min(width, height) / 2;
  if (typeof radius === "number") {
    const r = Math.max(0, Math.min(radius, maxR));
    radius = { tl: r, tr: r, br: r, bl: r };
  } else {
    radius = {
      tl: Math.max(0, Math.min(radius?.tl || 0, maxR)),
      tr: Math.max(0, Math.min(radius?.tr || 0, maxR)),
      br: Math.max(0, Math.min(radius?.br || 0, maxR)),
      bl: Math.max(0, Math.min(radius?.bl || 0, maxR))
    };
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
 * Safely preloads an image with CORS enabled, with a fast timeout fallback.
 */
function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    const timer = setTimeout(() => resolve(null), 3000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Generates the complete high-resolution results card as a PNG data URL in A4 portrait ratio.
 * Features:
 * - A4 Portrait canvas proportions (840 x 1188)
 * - Match circle ring (with circular track and percentage in center)
 * - Dynamic cognitive function colors matching DOM position
 * - Exact slider positions & values
 * - 2D Spectrum quadrant with accurate coordinates & figure photo dot
 * - 4 Similar figures with real Wikipedia portrait photos
 */
export async function generateResultsCardCanvas({
  topMbti,
  percentages,
  axisScores,
  similarFigures = [],
  lang = "ro"
}) {
  const canvas = document.createElement("canvas");
  const scale = 2; // Retina 2x scale for ultra-crisp output (1680 x 2376)
  const baseW = 840;
  const baseH = 1188; // Standard A4 ratio (1 : 1.4142)

  canvas.width = baseW * scale;
  canvas.height = baseH * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const FONT_FAMILY = "'Poppins', 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // Preload top 4 figure images in parallel
  const top4 = (similarFigures || []).slice(0, 4);
  const loadedFigureImages = await Promise.all(
    top4.map(fig => preloadImage(fig.photo))
  );

  // 1. Sleek, clean dark background gradient (no fuzzy glows)
  const tempCode = topMbti?.temperament || "NT";
  let bgDarkStart = "#1a1320";
  let bgDarkEnd = "#0f0b13";

  if (tempCode === "NF") {
    bgDarkStart = "#121d15";
    bgDarkEnd = "#09110b";
  } else if (tempCode === "SJ") {
    bgDarkStart = "#111d21";
    bgDarkEnd = "#081013";
  } else if (tempCode === "SP") {
    bgDarkStart = "#1f1a10";
    bgDarkEnd = "#100d07";
  }

  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, baseH);
  bgGrad.addColorStop(0, bgDarkStart);
  bgGrad.addColorStop(1, bgDarkEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, baseW, baseH);

  // ----------------------------------------------------
  // HEADER
  // ----------------------------------------------------
  const marginX = 40;
  let curY = 38;

  // 1. 8func logo badge (left)
  roundRect(ctx, marginX, curY, 44, 44, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Number "8"
  ctx.fillStyle = "#111111";
  ctx.font = `800 26px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("8", marginX + 22, curY + 23);

  // Text "func"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 30px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("func", marginX + 54, curY + 23);

  // 2. Top Right: Circular Match Ring
  const matchPct = topMbti?.matchPercentage ?? 90;
  const tempAccentColor = topMbti?.temperamentColor || "#95637e";
  const ringRadius = 58;
  const ringCenterX = baseW - marginX - ringRadius - 6;
  const ringCenterY = 96;

  // Background ring track (in translucent personality color)
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 11;
  ctx.stroke();

  // Arc progress (personality color)
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (matchPct / 100) * (Math.PI * 2);
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, ringRadius, startAngle, endAngle);
  ctx.strokeStyle = tempAccentColor;
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.stroke();

  // Text inside circle: big percentage + MATCH below
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 36px ${FONT_FAMILY}`;
  ctx.fillText(`${matchPct}%`, ringCenterX, ringCenterY - 6);

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = `800 12.5px ${FONT_FAMILY}`;
  ctx.fillText("MATCH", ringCenterX, ringCenterY + 18);

  // 3. Hero Personality Info (left side below logo)
  curY += 56;

  // e-tag-hero: smooth pill with solid temperament color & white text
  const tempTitle = (topMbti?.temperamentName || "Analysts").toUpperCase();
  ctx.font = `800 11.5px ${FONT_FAMILY}`;
  const tagTextW = ctx.measureText(tempTitle).width;
  const tagPillW = tagTextW + 28;
  const tagPillH = 25;

  roundRect(ctx, marginX, curY, tagPillW, tagPillH, 999);
  ctx.fillStyle = tempAccentColor;
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tempTitle, marginX + tagPillW / 2, curY + tagPillH / 2 + 0.5);

  curY += 34;

  // Personality Title & Code: e.g. "Architect (INTJ)"
  const titleText = `${topMbti?.title || "Architect"} `;
  const codeText = `(${topMbti?.type || "INTJ"})`;

  ctx.font = `800 35px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(titleText, marginX, curY);
  const titleWidth = ctx.measureText(titleText).width;

  ctx.fillStyle = tempAccentColor;
  ctx.fillText(codeText, marginX + titleWidth, curY);

  curY += 46;

  // Function Stack Pills (squarish, solidly colored with function colors)
  const stack = topMbti?.stack || ["Ni", "Te", "Fi", "Se"];
  const pillW = 32;
  const pillH = 28;
  const pillGap = 8;

  stack.forEach((st, idx) => {
    const pillX = marginX + idx * (pillW + pillGap);
    const pillColor = getFunctionCardColor(st);
    roundRect(ctx, pillX, curY, pillW, pillH, 6);
    ctx.fillStyle = pillColor;
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 12.5px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(st, pillX + pillW / 2, curY + pillH / 2 + 0.5);
  });

  curY += 42; // Spacing before main 2-column grid

  // ----------------------------------------------------
  // MAIN GRID: BALANCED 2 COLUMNS (368px each, 24px gap)
  // ----------------------------------------------------
  const gridTopY = curY;
  const colW = 368;
  const leftColX = marginX; // 40
  const colGap = 24;
  const rightColX = leftColX + colW + colGap; // 432

  // ----------------------------------------------------
  // LEFT COLUMN: 8 Cognitive Functions Grid
  // Ranked #1 to #8 with dynamic colors matching the DOM
  // ----------------------------------------------------
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `800 12px ${FONT_FAMILY}`;
  ctx.fillText(lang === "ro" ? "IERARHIA COGNITIVĂ" : "COGNITIVE HIERARCHY", leftColX, gridTopY);

  const funcsList = FUNCTIONS_LIST || ["Ni", "Ne", "Te", "Ti", "Fe", "Fi", "Se", "Si"];
  const rankedFuncs = funcsList
    .map(f => ({ func: f, score: percentages?.[f] ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const fCardsTopY = gridTopY + 22;
  const fCardW = (colW - 12) / 2; // 178px
  const fCardH = 86;
  const fGapY = 10;
  const fGapX = 12;

  rankedFuncs.forEach((item, idx) => {
    const colIdx = idx % 2;
    const rowIdx = Math.floor(idx / 2);
    const cardX = leftColX + colIdx * (fCardW + fGapX);
    const cardY = fCardsTopY + rowIdx * (fCardH + fGapY);
    const cardColor = getFunctionCardColor(item.func);

    // Card background - clean solid pastel color (no shine/glare)
    roundRect(ctx, cardX, cardY, fCardW, fCardH, 14);
    ctx.fillStyle = cardColor;
    ctx.fill();

    // Rank (e.g. #1)
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = `800 12px ${FONT_FAMILY}`;
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
    ctx.font = `700 12px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${item.score}% score`, cardX + fCardW / 2, cardY + fCardH - 10);
  });

  const funcsTotalHeight = 4 * fCardH + 3 * fGapY; // 374px

  // ----------------------------------------------------
  // LEFT COLUMN: 2D Spectrum Quadrant Matrix
  // Perfectly square (368x368px), clean bordered
  // ----------------------------------------------------
  const matrixSectionY = fCardsTopY + funcsTotalHeight + 20;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `800 12px ${FONT_FAMILY}`;
  ctx.fillText("SPECTRUM", leftColX, matrixSectionY);

  const matrixY = matrixSectionY + 22;
  const matrixSize = colW; // 368px
  const quadHalf = matrixSize / 2; // 184px

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

  // Thin dividing crosshair lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftColX, matrixY + quadHalf);
  ctx.lineTo(leftColX + matrixSize, matrixY + quadHalf);
  ctx.moveTo(leftColX + quadHalf, matrixY);
  ctx.lineTo(leftColX + quadHalf, matrixY + matrixSize);
  ctx.stroke();

  // Quadrant Cardinal Labels inside
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.font = `800 11.5px ${FONT_FAMILY}`;
  ctx.textAlign = "center";

  // Top (Intuition)
  ctx.textBaseline = "top";
  ctx.fillText(lang === "ro" ? "INTUIȚIE" : "INTUITION", leftColX + quadHalf, matrixY + 12);

  // Bottom (Sensing)
  ctx.textBaseline = "bottom";
  ctx.fillText(lang === "ro" ? "SENZORIAL" : "SENSING", leftColX + quadHalf, matrixY + matrixSize - 12);

  // Left (Feeling)
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(lang === "ro" ? "SENTIMENT" : "FEELING", leftColX + 14, matrixY + quadHalf);
  ctx.restore();

  // Right (Thinking)
  ctx.save();
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(lang === "ro" ? "GÂNDIRE" : "THINKING", leftColX + matrixSize - 14, matrixY + quadHalf);
  ctx.restore();

  // User position dot (F left 0%, T right 100% / N top 0%, S bottom 100%)
  const pN = axisScores?.NS?.roundA ?? 50;
  const pT = axisScores?.TF?.roundA ?? 50;
  const compassX = Math.max(12, Math.min(88, pT));
  const compassY = Math.max(12, Math.min(88, 100 - pN));

  const dotPxX = leftColX + (compassX / 100) * matrixSize;
  const dotPxY = matrixY + (compassY / 100) * matrixSize;

  // Solid white user dot (crisp, no glow, subtle dark outline)
  ctx.beginPath();
  ctx.arc(dotPxX, dotPxY, 9, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.stroke();

  ctx.restore();

  // ----------------------------------------------------
  // RIGHT COLUMN: 4 Spectrum Axis Sliders (Title: 4 AXES)
  // Exactly matching the 374px height of the left function cards
  // ----------------------------------------------------
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `800 12px ${FONT_FAMILY}`;
  ctx.fillText(lang === "ro" ? "CELE 4 AXE" : "4 AXES", rightColX, gridTopY);

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
      title: lang === "ro" ? "ENERGIE" : "ENERGY",
      color: AXIS_CARD_COLORS.ENERGY,
      leftLabel: lang === "ro" ? `Extraversie ${pE}%` : `Extraversion ${pE}%`,
      rightLabel: lang === "ro" ? `${pI}% Introversie` : `${pI}% Introversion`,
      pct: calcThumbPct(pE, pI)
    },
    {
      title: lang === "ro" ? "MINTE" : "MIND",
      color: AXIS_CARD_COLORS.MIND,
      leftLabel: lang === "ro" ? `Intuiție ${pN}%` : `Intuition ${pN}%`,
      rightLabel: lang === "ro" ? `${pS}% Senzorial` : `${pS}% Sensing`,
      pct: calcThumbPct(pN, pS)
    },
    {
      title: lang === "ro" ? "NATURĂ" : "NATURE",
      color: AXIS_CARD_COLORS.NATURE,
      leftLabel: lang === "ro" ? `Gândire ${pT}%` : `Thinking ${pT}%`,
      rightLabel: lang === "ro" ? `${pF}% Sentiment` : `${pF}% Feeling`,
      pct: calcThumbPct(pT, pF)
    },
    {
      title: lang === "ro" ? "TACTICĂ" : "TACTICS",
      color: AXIS_CARD_COLORS.TACTICS,
      leftLabel: lang === "ro" ? `Judecată ${pJ}%` : `Judging ${pJ}%`,
      rightLabel: lang === "ro" ? `${pP}% Percepție` : `${pP}% Perceiving`,
      pct: calcThumbPct(pJ, pP)
    }
  ];

  const axisCardsTopY = gridTopY + 22;
  const axisCardH = 86;
  const axisGapY = 10;

  axisData.forEach((ax, idx) => {
    const cardY = axisCardsTopY + idx * (axisCardH + axisGapY);

    // Card background - clean flat solid color (no shine/glare)
    roundRect(ctx, rightColX, cardY, colW, axisCardH, 14);
    ctx.fillStyle = ax.color;
    ctx.fill();

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 12px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(ax.title, rightColX + 20, cardY + 14);

    // Slider track
    const trackPad = 20;
    const trackX1 = rightColX + trackPad;
    const trackW = colW - trackPad * 2;
    const trackY = cardY + 43;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trackX1, trackY);
    ctx.lineTo(trackX1 + trackW, trackY);
    ctx.stroke();

    // White thumb knob (no glow, clean solid circle)
    const thumbX = trackX1 + (Math.max(4, Math.min(96, ax.pct)) / 100) * trackW;
    ctx.beginPath();
    ctx.arc(thumbX, trackY, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Labels below track
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 12px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(ax.leftLabel, trackX1, cardY + axisCardH - 11);

    ctx.textAlign = "right";
    ctx.fillText(ax.rightLabel, trackX1 + trackW, cardY + axisCardH - 11);
  });

  const axisTotalHeight = 4 * axisCardH + 3 * axisGapY; // 374px

  // ----------------------------------------------------
  // RIGHT COLUMN: 4 Similar Personalities (Notable Figures)
  // Matching the 2D Quadrant Matrix height (368px)
  // ----------------------------------------------------
  const figuresSectionY = axisCardsTopY + axisTotalHeight + 20;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `800 12px ${FONT_FAMILY}`;
  ctx.fillText(lang === "ro" ? "PERSONALITĂȚI SIMILARE" : "SIMILAR FIGURES", rightColX, figuresSectionY);

  const figuresY = figuresSectionY + 22;
  const figCardH = 82;
  const figGapY = 13.3;

  const fallbackFigures = [
    { name: "Mehmed the Conqueror", role: "Leader & Politician", mbti: topMbti?.type || "INTJ", similarity: 93, avatar: "👑" },
    { name: "Augustus Octavian", role: "Leader & Politician", mbti: topMbti?.type || "INTJ", similarity: 93, avatar: "🏛️" },
    { name: "Bobby Fischer", role: "Athlete", mbti: topMbti?.type || "INTJ", similarity: 92, avatar: "♟️" },
    { name: "Christopher Nolan", role: "Artist & Actor", mbti: topMbti?.type || "INTJ", similarity: 91, avatar: "🎬" }
  ];

  const figuresToRender = top4.length > 0 ? top4 : fallbackFigures;

  figuresToRender.forEach((fig, idx) => {
    const cardY = figuresY + idx * (figCardH + figGapY);
    const simPct = fig.similarity || 85;

    // Card background
    roundRect(ctx, rightColX, cardY, colW, figCardH, 16);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fill();

    // Avatar (circular photo or fallback) - Crop with proper aspect ratio without stretching
    const avatarCenterX = rightColX + 34;
    const avatarCenterY = cardY + figCardH / 2;
    const avatarR = 24;
    const preloadedImg = loadedFigureImages[idx];

    if (preloadedImg) {
      const imgW = preloadedImg.naturalWidth || preloadedImg.width || 1;
      const imgH = preloadedImg.naturalHeight || preloadedImg.height || 1;
      const minDim = Math.min(imgW, imgH);
      const sx = (imgW - minDim) / 2;
      const sy = (imgH - minDim) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(preloadedImg, sx, sy, minDim, minDim, avatarCenterX - avatarR, avatarCenterY - avatarR, avatarR * 2, avatarR * 2);
      ctx.restore();

      // Clean white ring border around photo
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else {
      // Fallback circular avatar
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = `800 16px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fig.avatar || fig.name.charAt(0), avatarCenterX, avatarCenterY);
    }

    // Text Details - formal, clean, unstretched
    const textStartX = rightColX + 68;

    // Line 1: Figure Name (left) & Match % (right)
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 15.5px ${FONT_FAMILY}`;

    let displayName = fig.name;
    if (ctx.measureText(displayName).width > 200) {
      displayName = displayName.slice(0, 19) + "…";
    }
    ctx.fillText(displayName, textStartX, cardY + 12);

    // Similarity % (right)
    ctx.textAlign = "right";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 18px ${FONT_FAMILY}`;
    ctx.fillText(`${simPct}%`, rightColX + colW - 18, cardY + 11);

    // Line 2: Role + MBTI Badge
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    ctx.font = `500 12px ${FONT_FAMILY}`;

    let roleText = getFigureRole(fig, lang) || fig.profession || (lang === "en" ? "Notable figure" : "Personalitate notabilă");
    if (ctx.measureText(roleText).width > 160) {
      roleText = roleText.slice(0, 16) + "…";
    }
    ctx.fillText(roleText, textStartX, cardY + 34);
    const roleWidth = ctx.measureText(roleText).width;

    // MBTI badge pill
    const pillX = textStartX + roleWidth + 8;
    const pillY = cardY + 32;
    const mbtiPillW = 42;
    const mbtiPillH = 18;
    roundRect(ctx, pillX, pillY, mbtiPillW, mbtiPillH, 5);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `800 10.5px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fig.mbti || "INTJ", pillX + mbtiPillW / 2, pillY + mbtiPillH / 2 + 0.5);

    // Line 3: Progress bar at bottom
    const barX = textStartX;
    const barW = (rightColX + colW - 18) - barX;
    const barY = cardY + 58;
    const barH = 5;

    // Track
    roundRect(ctx, barX, barY, barW, barH, 2.5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fill();

    // Fill
    const fillW = Math.max(6, (simPct / 100) * barW);
    roundRect(ctx, barX, barY, fillW, barH, 2.5);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  });

  // ----------------------------------------------------
  // FOOTER (A4 Bottom)
  // ----------------------------------------------------
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = `700 18px ${FONT_FAMILY}`;
  ctx.fillText("8func.com", baseW / 2, baseH - 34);

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
}
