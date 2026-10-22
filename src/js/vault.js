/**
 * 8Func - Secret Submissions Vault
 * 
 * Silently records completed quiz JSON payloads into:
 * 1. Local disk folder (./submissions/) via Vite dev / preview server middleware
 * 2. Browser localStorage vault ("8func_vault_submissions")
 * 3. Optional remote Webhook (Discord / Google Apps Script / Custom backend)
 * 
 * Regular users NEVER see any notifications or toasts about saving.
 * The creator can access the Secret Admin Vault via:
 * - Keyboard shortcut: Ctrl + Shift + S (or Cmd + Shift + S)
 * - Clicking 5 times rapidly on the "8func" navbar logo
 * - Adding #vault or ?vault=true to the URL
 */

const STORAGE_KEYS = {
  VAULT: "8func_vault_submissions",
  WEBHOOK: "8func_vault_webhook"
};

export const DEFAULT_WEBHOOK_URL = "https://discord.com/api/webhooks/1562249394147819531/UV7KuqCcxVJ04P4kGB5BBPOVbHuoIcqHchXguXKBWNFNeRq-hUd31_vrLDcl99MN42-8";

/**
 * Silently records a completed quiz submission.
 * Completely invisible to the user.
 */
export async function recordQuizSubmission({ state, scores, topMbti }) {
  if (!state || !state.answers || Object.keys(state.answers).length === 0) {
    return null;
  }

  const now = new Date();
  const timestampIso = now.toISOString();
  const submissionId = "sub_" + now.getTime() + "_" + Math.random().toString(36).substring(2, 7);

  const payload = {
    id: submissionId,
    app: "8Func",
    version: "2.0",
    timestamp: timestampIso,
    localTime: now.toLocaleString("ro-RO"),
    mode: state.mode || "standard",
    orderMode: state.orderMode || "format",
    lang: state.lang || "ro",
    mbtiType: topMbti?.type || scores?.derivedType || "UNKNOWN",
    mbtiTitle: topMbti?.title || "",
    matchPercentage: topMbti?.matchPercentage ?? null,
    derivedType: scores?.derivedType || null,
    axisPercentages: scores?.axisPercentages || {},
    functionPercentages: scores?.percentages || {},
    answersCount: Object.keys(state.answers).length,
    totalQuestions: state.questions?.length || Object.keys(state.answers).length,
    answers: { ...state.answers },
    detailedResponses: (state.questions || []).map(q => ({
      id: q.id,
      category: q.category,
      format: q.format,
      target: q.target,
      oppositePole: q.oppositePole || q.opposite || null,
      dimension: q.dimension || null,
      responseKey: state.answers[q.id] || null,
      text: q.textRo || q.text
    }))
  };

  // 1. Silent localStorage recording
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VAULT);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    // Keep up to 300 entries
    if (list.length > 300) list.length = 300;
    localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(list));
  } catch (e) {
    // Silent fail
  }

  // 2. Silent background POST to local server (only when running locally in dev / preview)
  const isLocalhost = typeof window !== "undefined" && Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]"
  );

  if (isLocalhost) {
    try {
      const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL)
        ? import.meta.env.BASE_URL
        : "/";
      const endpoint = `${baseUrl.replace(/\/$/, "")}/api/save-quiz`;
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {
      // Silent fail
    }
  }

  // 3. Remote Webhook (Discord notification with full JSON attachment)
  try {
    const webhookUrl = localStorage.getItem(STORAGE_KEYS.WEBHOOK) || DEFAULT_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("http")) {
      sendToWebhook(webhookUrl, payload).catch(() => {});
    }
  } catch (e) {
    // Silent fail
  }

  return payload;
}

/**
 * Sends a submission payload to a webhook URL (formatted for Discord or generic HTTP endpoint).
 */
async function sendToWebhook(webhookUrl, payload) {
  if (webhookUrl.includes("discord.com/api/webhooks")) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const form = new FormData();
    const safeType = payload.mbtiType || "RESULT";
    const safeDate = (payload.timestamp || "").slice(0, 10);
    const safeId = (payload.id || "").slice(-5);
    const filename = `8func_${safeType}_${safeDate}_${safeId}.json`;
    form.append("files[0]", blob, filename);

    // Format top cognitive functions
    const topFuncs = Object.entries(payload.functionPercentages || {})
      .sort((a, b) => b[1] - a[1])
      .map(([fn, pct]) => `**${fn}**: ${pct}%`)
      .join(" · ");

    // Format axes
    const axes = payload.axisPercentages || {};
    const axesStr = `E/I: ${axes.EI ?? 50}% · N/S: ${axes.NS ?? 50}% · T/F: ${axes.TF ?? 50}% · P/J: ${axes.JP ?? 50}%`;

    const embed = {
      title: `🎯 Nou Test 8Func Finalizat: ${payload.mbtiType} (${payload.matchPercentage ?? 0}% match)`,
      description: payload.mbtiTitle ? `**${payload.mbtiTitle}**` : undefined,
      color: 0x101010,
      fields: [
        { name: "📋 Mod Test", value: `\`${payload.mode}\` (${payload.answersCount}/${payload.totalQuestions} răspunsuri)`, inline: true },
        { name: "🕒 Data & Ora", value: payload.localTime || payload.timestamp?.slice(0, 16) || "N/A", inline: true },
        { name: "🧠 Top Funcții", value: topFuncs || "N/A", inline: false },
        { name: "⚖️ Balanță Axe", value: axesStr, inline: false }
      ],
      footer: { text: "Fișierul JSON complet cu toate răspunsurile este atașat mai jos." }
    };

    form.append("payload_json", JSON.stringify({
      embeds: [embed]
    }));

    await fetch(webhookUrl, { method: "POST", body: form });
  } else {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors"
    });
  }
}

/**
 * Retrieve all vault submissions from localStorage
 */
export function getVaultSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VAULT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all submissions from localStorage
 */
export function clearVaultSubmissions() {
  try {
    localStorage.removeItem(STORAGE_KEYS.VAULT);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download a single submission JSON
 */
export function downloadSingleSubmission(sub) {
  const safeTime = (sub.timestamp || new Date().toISOString()).replace(/[:.]/g, "-");
  const filename = `quiz_${safeTime}_${sub.mbtiType || "RESULT"}_${sub.mode || "quiz"}.json`;
  const blob = new Blob([JSON.stringify(sub, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download all submissions as individual JSON files
 */
export function downloadAllSubmissions() {
  const list = getVaultSubmissions();
  if (!list.length) return 0;

  list.forEach((sub, idx) => {
    setTimeout(() => {
      downloadSingleSubmission(sub);
    }, idx * 150);
  });
  return list.length;
}

/**
 * Download all submissions combined into a single archive JSON file
 */
export function downloadCombinedVault() {
  const list = getVaultSubmissions();
  const payload = {
    app: "8Func Vault Archive",
    exportDate: new Date().toISOString(),
    totalSubmissions: list.length,
    submissions: list
  };
  const safeDate = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `8func_all_submissions_${safeDate}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open the Secret Admin Vault Modal
 */
export function openVaultModal() {
  let modal = document.getElementById("secret-vault-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "secret-vault-modal";
    modal.className = "modal-overlay";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    document.body.appendChild(modal);
  }

  renderVaultContent(modal);
  modal.classList.add("active");
}

/**
 * Close the Secret Admin Vault Modal
 */
export function closeVaultModal() {
  const modal = document.getElementById("secret-vault-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

/**
 * Render modal contents
 */
function renderVaultContent(modal) {
  const submissions = getVaultSubmissions();
  const currentWebhook = localStorage.getItem(STORAGE_KEYS.WEBHOOK) || DEFAULT_WEBHOOK_URL;

  const itemsHtml = submissions.length === 0
    ? `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); background: var(--paper); border: 1px dashed var(--line); border-radius: var(--radius-lg);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📂</div>
        <div style="font-weight: 700; color: var(--text-strong); margin-bottom: 0.25rem;">Niciun chestionar stocat încă</div>
        <p style="font-size: 0.85rem; margin: 0;">De fiecare dată când cineva finalizează un test, răspunsurile JSON vor apărea automat aici și în folderul <code>./submissions/</code>.</p>
      </div>
    `
    : submissions.map((sub, idx) => {
        const topFuncs = Object.entries(sub.functionPercentages || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([fn, pct]) => `${fn}: ${pct}%`)
          .join(" · ");

        return `
          <div class="vault-item" data-idx="${idx}" style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.9rem; margin-bottom: 0.65rem; transition: border-color var(--transition-fast);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 800; font-size: 1.05rem; color: var(--accent);">${sub.mbtiType || "UNKNOWN"}</span>
                ${sub.matchPercentage ? `<span style="font-size: 0.8rem; font-weight: 700; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); padding: 0.1rem 0.45rem; border-radius: var(--radius-pill);">${sub.matchPercentage}% match</span>` : ""}
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">${sub.mode} · ${sub.answersCount} răspunsuri</span>
              </div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${sub.localTime || sub.timestamp?.slice(0, 16)}</span>
            </div>
            ${topFuncs ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.6rem;">Top funcții: <strong style="color: var(--text-strong);">${topFuncs}</strong></div>` : ""}
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="vault-btn-dl" data-idx="${idx}" style="padding: 0.35rem 0.75rem; border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 700; background: var(--accent); color: #fff; border: none; cursor: pointer;">
                📥 Descarcă JSON
              </button>
              <button type="button" class="vault-btn-view" data-idx="${idx}" style="padding: 0.35rem 0.75rem; border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 600; background: var(--card-bg); color: var(--text-strong); border: 1px solid var(--line); cursor: pointer;">
                👁️ Vezi date
              </button>
              <button type="button" class="vault-btn-del" data-idx="${idx}" style="padding: 0.35rem 0.65rem; border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 600; background: transparent; color: var(--critical, #E0535E); border: 1px solid transparent; cursor: pointer; margin-left: auto;">
                Șterge
              </button>
            </div>
            <div class="vault-item-preview" id="vault-preview-${idx}" style="display: none; margin-top: 0.65rem; padding: 0.75rem; background: var(--card-bg); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 0.72rem; max-height: 200px; overflow-y: auto;">
              <pre style="margin: 0; white-space: pre-wrap; font-family: monospace;">${JSON.stringify(sub, null, 2)}</pre>
            </div>
          </div>
        `;
      }).join("");

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 680px; max-height: 90vh;">
      <header class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.3rem;">🔒</span>
          <div>
            <h3 class="modal-title" style="margin: 0;">Seif Secret Răspunsuri (Admin)</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Panou ascuns · Utilizatorii nu văd și nu știu de acest seif</span>
          </div>
        </div>
        <button class="modal-close" type="button" id="vault-modal-close-btn" aria-label="Închide">
          <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </header>

      <div class="modal-body" style="padding-top: 0.5rem;">
        <!-- Banner info -->
        <div style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.82rem; line-height: 1.45;">
          <div>📁 <b>Salvare locală pe disc:</b> În folderul <code>./submissions/</code> (salvat automat la fiecare quiz în dev/preview).</div>
          <div style="margin-top: 0.25rem;">💾 <b>Stocate în acest browser:</b> <strong>${submissions.length}</strong> teste completate.</div>
        </div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" id="vault-dl-all-btn" class="e-btn e-btn-primary e-btn-sm" style="flex: 1; min-width: 180px; justify-content: center;" ${submissions.length === 0 ? "disabled" : ""}>
            📥 Descarcă Toate (JSON-uri Separate)
          </button>
          <button type="button" id="vault-dl-combined-btn" class="e-btn e-btn-secondary e-btn-sm" style="flex: 1; min-width: 180px; justify-content: center;" ${submissions.length === 0 ? "disabled" : ""}>
            📦 Arhivă Unică (${submissions.length})
          </button>
        </div>

        <!-- Optional Webhook config toggle -->
        <details style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.65rem 0.9rem; margin-bottom: 1rem; font-size: 0.85rem;">
          <summary style="font-weight: 700; cursor: pointer; color: var(--text-strong);">
            🌐 Opțional: Configurare Webhook (Discord / Google Apps Script)
          </summary>
          <div style="margin-top: 0.65rem;">
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem; line-height: 1.4;">
              Dacă pui testul pe GitHub Pages și vrei să primești răspunsurile de la alte persoane direct pe Discord (cu fișierul JSON atașat), lipește un <b>Discord Webhook URL</b> aici:
            </p>
            <div style="display: flex; gap: 0.4rem;">
              <input type="url" id="vault-webhook-input" value="${currentWebhook}" placeholder="https://discord.com/api/webhooks/..." style="flex: 1; padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); border: 1.5px solid var(--line); background: var(--card-bg); color: var(--text-strong); font-size: 0.8rem;">
              <button type="button" id="vault-webhook-save-btn" style="padding: 0.45rem 0.85rem; border-radius: var(--radius-sm); background: var(--accent); color: #fff; font-weight: 700; font-size: 0.8rem; border: none; cursor: pointer;">
                Salvează
              </button>
            </div>
            <div id="vault-webhook-status" style="font-size: 0.75rem; margin-top: 0.35rem; color: var(--accent); font-weight: 600;"></div>
          </div>
        </details>

        <!-- Submissions list -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            Istoric Teste Salvate (${submissions.length})
          </span>
          ${submissions.length > 0 ? `
            <button type="button" id="vault-clear-all-btn" style="background: none; border: none; color: var(--critical, #E0535E); font-size: 0.75rem; font-weight: 700; cursor: pointer;">
              🗑️ Golește Istoricul
            </button>
          ` : ""}
        </div>

        <div style="max-height: 380px; overflow-y: auto; padding-right: 0.2rem;">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;

  attachVaultEvents(modal);
}

/**
 * Attach interaction events to the vault modal
 */
function attachVaultEvents(modal) {
  const closeBtn = modal.querySelector("#vault-modal-close-btn");
  if (closeBtn) closeBtn.addEventListener("click", closeVaultModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVaultModal();
  });

  const dlAllBtn = modal.querySelector("#vault-dl-all-btn");
  if (dlAllBtn) {
    dlAllBtn.addEventListener("click", () => {
      const count = downloadAllSubmissions();
      dlAllBtn.textContent = `✓ S-au descărcat ${count} fișiere!`;
      setTimeout(() => { dlAllBtn.textContent = "📥 Descarcă Toate (JSON-uri Separate)"; }, 2500);
    });
  }

  const dlCombBtn = modal.querySelector("#vault-dl-combined-btn");
  if (dlCombBtn) {
    dlCombBtn.addEventListener("click", () => {
      downloadCombinedVault();
      dlCombBtn.textContent = "✓ Descărcat!";
      setTimeout(() => { dlCombBtn.textContent = "📦 Arhivă Unică"; }, 2000);
    });
  }

  const webhookInput = modal.querySelector("#vault-webhook-input");
  const webhookSaveBtn = modal.querySelector("#vault-webhook-save-btn");
  const webhookStatus = modal.querySelector("#vault-webhook-status");
  if (webhookSaveBtn && webhookInput) {
    webhookSaveBtn.addEventListener("click", () => {
      const val = webhookInput.value.trim();
      localStorage.setItem(STORAGE_KEYS.WEBHOOK, val);
      if (webhookStatus) {
        webhookStatus.textContent = val ? "✓ Webhook salvat cu succes!" : "Webhook dezactivat.";
        setTimeout(() => { webhookStatus.textContent = ""; }, 3000);
      }
    });
  }

  const clearBtn = modal.querySelector("#vault-clear-all-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Sigur vrei să ștergi toate testele stocate în acest browser?")) {
        clearVaultSubmissions();
        renderVaultContent(modal);
      }
    });
  }

  // Individual item buttons
  const submissions = getVaultSubmissions();

  modal.querySelectorAll(".vault-btn-dl").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (!isNaN(idx) && submissions[idx]) {
        downloadSingleSubmission(submissions[idx]);
      }
    });
  });

  modal.querySelectorAll(".vault-btn-view").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const preview = modal.querySelector(`#vault-preview-${idx}`);
      if (preview) {
        const isHidden = preview.style.display === "none";
        preview.style.display = isHidden ? "block" : "none";
        btn.textContent = isHidden ? "Ascunde" : "👁️ Vezi date";
      }
    });
  });

  modal.querySelectorAll(".vault-btn-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (!isNaN(idx) && submissions[idx]) {
        submissions.splice(idx, 1);
        localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(submissions));
        renderVaultContent(modal);
      }
    });
  });
}

/**
 * Initialize global secret triggers for the admin vault:
 * 1. Ctrl + Shift + S
 * 2. Rapid clicks on logo
 * 3. URL hash #vault or ?vault=true
 */
export function initVaultTriggers() {
  // 1. Keyboard shortcut
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "S" || e.key === "s")) {
      e.preventDefault();
      openVaultModal();
    }
  });

  // 2. URL trigger
  const checkUrl = () => {
    if (window.location.hash === "#vault" || window.location.search.includes("vault=1") || window.location.search.includes("vault=true")) {
      openVaultModal();
    }
  };
  checkUrl();
  window.addEventListener("hashchange", checkUrl);

  // 3. Logo rapid click handler
  let logoClicks = 0;
  let logoTimer = null;
  document.addEventListener("click", (e) => {
    const logo = e.target.closest("#nav-logo-btn");
    if (logo) {
      logoClicks++;
      clearTimeout(logoTimer);
      if (logoClicks >= 5) {
        logoClicks = 0;
        openVaultModal();
      } else {
        logoTimer = setTimeout(() => {
          logoClicks = 0;
        }, 1500);
      }
    }
  });
}
