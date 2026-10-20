# 8Func — Jungian Cognitive Functions Test Across 8 Axes

A modern, responsive, and minimalist web application for assessing Carl Jung's 8 foundational cognitive functions (**Ne, Ni, Te, Ti, Fe, Fi, Se, Si**), inspired by the editorial design and structure of **12Axes**.

---

## ✨ Key Highlights

### 1. Test Length Selection (Mode Choice)
Every version guarantees an **exact 12.5% equal representation** across all 8 cognitive functions:
- ⚡ **Quick** — **24 questions** (~3 minutes): 3 questions per function. Fast pulse check.
- ⭐ **Recommended** — **40 questions** (~5 minutes): 5 questions per function. Balanced accuracy and speed.
- 🎯 **Precise** — **160 questions** (~18 minutes): 20 questions per function. Exhaustive psychological analysis measuring every nuance.

### 2. Quiz Interface (12Axes Minimalist Editorial Design)
- **Rounded Category Tag (Top-Left)**: Displays specific function color (`--pole`), crisp SVG icon, and function title (e.g., `Ne — Extraverted Intuition`). Includes an `(i)` button opening an explanatory modal.
- **Question Number (Top-Right)**: Large, faint number in `Sora` font (`01`, `02`, ...).
- **Legible Question Header**: High contrast, bold, spacious typography.
- **5 Vertical Answer Choices**:
  - `Strongly agree` (+1.0 point) — dark green circular icon with white checkmark
  - `Agree` (+0.5 points) — soft green circular icon with green checkmark
  - `Neutral or It depends` (0.0 points) — soft gray circular icon with minus
  - `Disagree` (-0.5 points) — soft red circular icon with red cross
  - `Strongly disagree` (-1.0 point) — deep crimson circular icon with white cross
- **Keyboard Shortcuts**: Numbers `1` to `5` for instantaneous answering; left/right arrows for navigation.
- **Advance on Answer**: Smooth automatic transition (220ms) with toggle switch.
- **Interactive Progress Bar**: Segmented progress tracking with click-to-jump capability.

### 3. Results Screen (8 Independent Axes & Jungian Architecture)
- **8 Independent Axes**:
  - `Ne` — Extraverted Intuition (Purple: `#8A3AA0`)
  - `Ni` — Introverted Intuition (Royal Indigo: `#3B49DF`)
  - `Te` — Extraverted Thinking (Steel Azure: `#0284C7`)
  - `Ti` — Introverted Thinking (Teal: `#0D9488`)
  - `Fe` — Extraverted Feeling (Emerald: `#16A34A`)
  - `Fi` — Introverted Feeling (Amber: `#EA580C`)
  - `Se` — Extraverted Sensing (Crimson: `#DC2626`)
  - `Si` — Introverted Sensing (Warm Bronze: `#B45309`)
- **Graphic Progress Slider**: Visual track with colored gradient fill, neutral 50% baseline marker, and smooth animation.
- **Extreme Spectrum Tags**: Rounded pill tags below each slider indicating the lower (absent) vs. upper (developed) poles.
- **MBTI Archetype Matching**: Automatically computes the closest matching 16 MBTI type using Grant Cognitive Hierarchy weights (Dominant x4, Auxiliary x3, Tertiary x2, Inferior x1).
- **Action Suite**: Retake quiz, change mode, review answers, copy text summary to clipboard, export/print PDF report.

---

## 📐 Scoring Formula

For any test mode where each function has $N_f$ questions ($N_f = 3$ for Quick, $N_f = 5$ for Recommended, $N_f = 20$ for Precise):
- Raw score per function: Sum of the $N_f$ answers (range: $-N_f$ to $+N_f$).
- Universal Percentage formula:
  $$\text{Percentage} = \left(\frac{\text{Raw Score} + N_f}{2 \times N_f}\right) \times 100$$
  - Minimum score (all Strongly Disagree): **0%**
  - Neutral baseline (all Neutral): **50%**
  - Maximum score (all Strongly Agree): **100%**

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   Generates optimized static assets in `dist/`.
