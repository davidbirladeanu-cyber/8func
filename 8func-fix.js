// 8Func — întrebări rescrise + scoring curat
// Folosire în site: aplici PATCHES peste banca din questions.js, apoi scoreTest(bank, answers).
// Test local:  node 8func-fix.js Maria.json [--skip-changed]

/* ───────────────────────── 1. ÎNTREBĂRI RESCRISE ─────────────────────────
   Reguli: fără „acasă / rutină / singur / program” la funcții (asta e I/J),
   Se = percepție pe loc, Si = comparație cu memoria senzorială,
   combinațiile forțate împart o literă, ca să nu mai curgă puncte pe axa greșită. */
export const PATCHES = {
  // ── Axa N/S (înlocuiesc itemii universali) ──
  D03: { target: 'N', opposite: 'S', oppositePole: 'S', text: 'Mă plictisesc repede de detalii dacă nu văd ideea sau tiparul din spatele lor.' },
  D04: { target: 'S', opposite: 'N', oppositePole: 'N', text: 'Mă irită când cineva vorbește despre idei generale fără să-mi dea întâi fapte și exemple concrete.' },
  S04: { target: 'S', opposite: 'N', oppositePole: 'N', text: 'Nu mă interesează o idee până nu o văd demonstrată pe un caz concret.' },
  W04: { target: 'S', opposite: 'N', oppositePole: 'N', text: 'Când explici cuiva ceva nou:',
         A: 'Pornesc de la un exemplu concret și abia apoi generalizez.',
         B: 'Pornesc de la ideea generală și dau exemple doar dacă e nevoie.' },

  // ── Ne (unipolar) ──
  D09: { target: 'Ne', opposite: 'Si', oppositePole: 'Si', text: 'O idee nouă îmi aduce imediat în minte multe posibilități neașteptate, fără legătură cu ce știu deja.' },
  W09: { target: 'Ne', opposite: 'Si', oppositePole: 'Si', text: 'Ai de rezolvat ceva fără metodă clară:',
         A: 'Combin mai multe idei și inventez o abordare nouă.',
         B: 'Caut în memorie o situație concretă pe care am trăit-o și o adaptez.' },

  // ── Si = memorie senzorială + comparație cu „cum era” ──
  D10: { target: 'Si', opposite: 'Ne', oppositePole: 'Ne', text: 'Un gust, un miros sau o melodie îmi readuce instant un moment exact din trecut, cu tot cu cum mă simțeam atunci.' },
  D24: { target: 'Si', opposite: 'Se', oppositePole: 'Se', text: 'Observ imediat când ceva e puțin diferit față de cum era de obicei (un obiect mutat, un gust schimbat, un obicei al cuiva).' },
  S10: { target: 'Si', opposite: 'Ne', oppositePole: 'Ne', text: 'Când gust sau miros ceva, îmi amintesc imediat unde și când l-am mai simțit.' },
  S24: { target: 'Si', opposite: 'Se', oppositePole: 'Se', text: 'Observ repede când ceva s-a schimbat față de cum era înainte.' },
  W10: { target: 'Si', opposite: 'Ne', oppositePole: 'Ne', text: 'Când întâlnești un loc sau un lucru nou:',
         A: 'Îl compar imediat cu locuri și lucruri similare pe care le-am trăit.',
         B: 'Mă întreb ce alte variante și posibilități ar mai putea exista.' },
  W24: { target: 'Si', opposite: 'Se', oppositePole: 'Se', text: 'Când te întorci într-un loc pe care l-ai mai vizitat:',
         A: 'Observ ce s-a schimbat față de data trecută.',
         B: 'Mă atrage ce se întâmplă acum, indiferent cum era înainte.' },

  // ── Se = percepție/reacție pe loc (nu „aventură”) ──
  D23: { target: 'Se', opposite: 'Si', oppositePole: 'Si', text: 'Reacționez repede cu corpul și simțurile: prind ceva din zbor, mă feresc, observ o mișcare înainte să mă gândesc.' },
  S23: { target: 'Se', opposite: 'Si', oppositePole: 'Si', text: 'Observ detalii din jur pe loc (sunete, mișcări, mirosuri), fără să mă concentrez special.' },
  W23: { target: 'Se', opposite: 'Si', oppositePole: 'Si', text: 'După o călătorie, ce îți rămâne cel mai tare în minte:',
         A: 'Senzațiile de acolo, pe loc: culori, gusturi, sunete, mișcare.',
         B: 'Cum s-a legat de locurile și amintirile pe care le aveam deja.' },

  // ── Combinații: itemii SF nu mai sunt „grijă = S”; forțatele împart o literă ──
  D28: { target: 'SF', opposite: 'NT', oppositePole: 'NT', text: 'Țin minte detalii concrete despre cei dragi (ce le place, ce au mâncat, ce au spus data trecută) și le folosesc ca să le fac viața mai ușoară.' },
  S28: { target: 'SF', opposite: 'NT', oppositePole: 'NT', text: 'Țin minte ce le place celor apropiați (mâncare, obiceiuri, mici detalii) și le ofer exact asta fără să mi se ceară.' },
  W25: { target: 'NT', opposite: 'ST', oppositePole: 'ST', text: 'O zi liberă:',                       // împart T → măsoară N/S
         A: 'Mă cufund într-o problemă complexă ca s-o înțeleg.',
         B: 'Repar sau construiesc ceva concret, pe pași clari.' },
  W26: { target: 'SF', opposite: 'NF', oppositePole: 'NF', text: 'Un prieten are o problemă:',          // împart F → măsoară N/S
         A: 'Îl ajut concret: ce are nevoie acum, cu fapte și pași.',
         B: 'Îl ajut să înțeleagă ce vrea cu adevărat și ce sens are.' },
  W27: { target: 'NT', opposite: 'NF', oppositePole: 'NF', text: 'La un proiect în echipă:',            // împart N → măsoară T/F
         A: 'Găsesc structura de fond și strategia logică.',
         B: 'Mă asigur că toți înțeleg sensul și rămân motivați.' },
  W28: { target: 'ST', opposite: 'SF', oppositePole: 'SF', text: 'La un job, prefer:',                  // împart S → măsoară T/F
         A: 'Să execut bine sarcini concrete, cu rezultate măsurabile.',
         B: 'Să mă ocup de nevoile concrete ale colegilor (logistică, atmosferă).' },
};

/* ───────────────────────── 2. CONSTANTE ───────────────────────── */
export const LIKERT = { STRONGLY_AGREE: 1, AGREE: 0.75, NEUTRAL: 0.5, DISAGREE: 0.25, STRONGLY_DISAGREE: 0 };
export const FN = ['Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi', 'Se', 'Si'];
export const FN_LETTER = { Ne: 'N', Ni: 'N', Se: 'S', Si: 'S', Te: 'T', Ti: 'T', Fe: 'F', Fi: 'F' };
export const AXES = [['I', 'E'], ['N', 'S'], ['T', 'F'], ['J', 'P']]; // primul = polul „A”

export const ACQ_STRENGTH = 0.7;   // cât din tendința de a zice „da” la tot se scade
export const AXIS_STRETCH = 1.3;   // decompresie bare axe
export const FN_STRETCH = 1.6;     // decompresie bare funcții
export const W_AXIS = 1, W_FORCED_CROSS = 0.5, W_COMBO_FORCED = 0.5, W_COMBO_LIKERT = 0.25;

export const STACKS = {
  INTJ: 'Ni Te Fi Se Ne Ti Fe Si', INTP: 'Ti Ne Si Fe Te Ni Se Fi',
  ENTJ: 'Te Ni Se Fi Ti Ne Si Fe', ENTP: 'Ne Ti Fe Si Ni Te Fi Se',
  INFJ: 'Ni Fe Ti Se Ne Fi Te Si', INFP: 'Fi Ne Si Te Fe Ni Se Ti',
  ENFJ: 'Fe Ni Se Ti Fi Ne Si Te', ENFP: 'Ne Fi Te Si Ni Fe Ti Se',
  ISTJ: 'Si Te Fi Ne Se Ti Fe Ni', ISFJ: 'Si Fe Ti Ne Se Fi Te Ni',
  ESTJ: 'Te Si Ne Fi Ti Se Ni Fe', ESFJ: 'Fe Si Ne Ti Fi Se Ni Te',
  ISTP: 'Ti Se Ni Fe Te Si Ne Fi', ISFP: 'Fi Se Ni Te Fe Si Ne Ti',
  ESTP: 'Se Ti Fe Ni Si Te Fi Ne', ESFP: 'Se Fi Te Ni Si Fe Ti Ne',
};
export const RANK_W = [5, 4, 2, 1, 0.5, 0.5, 0.25, 0.25];

export const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0.5);

/* ───────────────────────── 3. SCORING ───────────────────────── */
export function applyPatches(bank) {
  return bank.map((q) => (PATCHES[q.id] ? { ...q, ...PATCHES[q.id] } : q));
}

export function scoreTest(bank, answers) {
  const fnS = Object.fromEntries(FN.map((f) => [f, []]));
  const axS = Object.fromEntries(AXES.map((p) => [p.join(''), []])); // {v: spre polul A, w}

  // baza de „acord la tot” a respondentului (corectează acquiescence)
  const lik = Object.values(answers).filter((a) => LIKERT[a] !== undefined).map((a) => LIKERT[a]);
  const acq = lik.length ? (mean(lik) - 0.5) * ACQ_STRENGTH : 0;

  const addAxis = (letter, valTowardLetter, w) => {
    const pair = AXES.find((p) => p.includes(letter));
    if (!pair) return;
    const toA = letter === pair[0] ? valTowardLetter : 1 - valTowardLetter;
    axS[pair.join('')].push({ v: toA, w });
  };

  for (const q of bank) {
    const a = answers[q.id];
    if (!a) continue;
    const forced = a === 'A' || a === 'B';
    const pickT = a === 'A'; // A = polul țintă
    const v = forced ? (pickT ? 1 : 0) : clamp01(LIKERT[a] - acq);

    if (q.category === 'axis') {
      addAxis(q.target, v, W_AXIS);
    } else if (q.category === 'function') {
      const opp = q.opposite || q.oppositePole;
      if (forced) {
        fnS[q.target].push(v);
        if (opp && fnS[opp]) fnS[opp].push(1 - v);
        const lt = FN_LETTER[q.target], lo = opp ? FN_LETTER[opp] : null;
        if (lt && lo && lt !== lo) addAxis(lt, v, W_FORCED_CROSS);   // Ne↔Si, Ni↔Se, Te↔Fi, Ti↔Fe
      } else {
        fnS[q.target].push(v);                           // unipolar: opusul NU primește nimic
      }
    } else if (q.category === 'combination') {
      const opp = q.opposite || q.oppositePole || '';
      const t = (q.target || '').split(''), o = opp.split('');
      if (forced) {
        t.forEach((l, i) => { if (l !== o[i]) addAxis(l, v, W_COMBO_FORCED); });
      } else {
        t.forEach((l) => addAxis(l, v, W_COMBO_LIKERT));
      }
    }
  }

  // axe
  const axis = {};
  for (const p of AXES) {
    const s = axS[p.join('')];
    const wsum = s.reduce((x, y) => x + y.w, 0);
    const m = wsum ? s.reduce((x, y) => x + y.v * y.w, 0) / wsum : 0.5;
    const pa = clamp(50 + (m - 0.5) * 100 * AXIS_STRETCH);
    axis[p[0]] = Math.round(pa);
    axis[p[1]] = Math.round(100 - pa);
  }

  // funcții
  const raw = Object.fromEntries(FN.map((f) => [f, mean(fnS[f])]));
  const mu = mean(Object.values(raw));
  const fnPct = {};
  FN.forEach((f) => { fnPct[f] = Math.round(clamp(50 + (raw[f] - mu) * 100 * FN_STRETCH)); });
  const ranking = [...FN].sort((a, b) => raw[b] - raw[a]);

  // potrivire tip: 60% stivă (normalizată la penalizarea maximă posibilă) + 40% axe
  const matches = Object.entries(STACKS).map(([type, st]) => {
    const ideal = st.split(' ');
    let pen = 0, maxPen = 0;
    ideal.forEach((f, i) => {
      const myRank = ranking.indexOf(f);
      pen += RANK_W[i] * Math.abs(myRank - i);
      maxPen += RANK_W[i] * Math.max(i, 7 - i);
    });
    const stack = 100 * (1 - pen / maxPen);
    const ax = mean(type.split('').map((l) => axis[l]));
    return { type, score: Math.round(0.6 * stack + 0.4 * ax), stack: Math.round(stack), axes: Math.round(ax) };
  }).sort((x, y) => y.score - x.score);

  const derived = AXES.map((p) => (axis[p[0]] >= 50 ? p[0] : p[1])).join('');

  return { axis, functions: fnPct, ranking, derivedType: derived, matches: matches.slice(0, 5) };
}

/* ───────────────────────── 4. CLI RUNNER ───────────────────────── */
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('8func-fix.js')) {
  import('fs').then((fs) => {
    const file = process.argv[2];
    if (!file) {
      console.log('Usage: node 8func-fix.js <result.json> [--skip-changed]');
      process.exit(0);
    }
    const skip = process.argv.includes('--skip-changed');
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    let bank = d.detailedResponses
      ? d.detailedResponses.map(({ id, category, format, target, oppositePole }) => ({ id, category, format, target, opposite: oppositePole }))
      : [];
    if (!bank.length && d.questions) {
      bank = d.questions;
    }
    bank = skip ? bank.filter((q) => !PATCHES[q.id]) : applyPatches(bank);
    console.log(JSON.stringify(scoreTest(bank, d.answers), null, 2));
  });
}
