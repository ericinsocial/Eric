/**
 * ===== AI 行銷成長檢測：頁面主程式 =====
 * ES module（原生瀏覽器支援，不需要 bundler），負責把 /data 與 /engine
 * 兜起來變成畫面：基本設定（產業／商業模式／發展階段）→ 動態問答 →
 * （Phase 2 先以摘要畫面收尾，完整結果頁與計分／瓶頸分析在 Phase 3、4）。
 *
 * 不在這裡寫死任何「為什麼跳到哪一題」的判斷——那些邏輯全部在
 * engine/questionEngine.js 讀 /data 決定，這裡只負責畫面渲染與事件綁定。
 *
 * 隱私：只把使用者答案存在瀏覽器 localStorage 做「自動儲存進度」用，
 * 不會印出到 console，也不會送到任何第三方（規格十八）。
 */

import { industries } from "./data/industries.js";
import { businessModels } from "./data/businessModels.js";
import { stages } from "./data/stages.js";
import {
  createDiagnosisState,
  getNextQuestion,
  submitAnswer,
  isDiagnosisComplete,
  goBackOneQuestion,
  getProgressSection,
  PROGRESS_SECTION_LABELS,
  getQuestionById
} from "./engine/questionEngine.js";

const STORAGE_KEY = "eric_diagnosis_progress_v1";
const CATEGORY_LETTERS = ["a", "b", "c", "d", "e", "f", "g"];

const ui = {
  phase: "hero", // hero | industry | bizmodel | stage | question | done
  selection: { industry: null, businessModels: [], primaryBusinessModel: null, stage: null },
  diagState: null,
  currentQuestion: null,
  currentDraftValue: undefined
};

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- 進度儲存（僅存本機瀏覽器，不外送、不印出） ---------- */
function saveProgress() {
  if (!ui.diagState) return;
  try {
    const payload = {
      selection: ui.selection,
      diagState: {
        ...ui.diagState,
        askedIds: Array.from(ui.diagState.askedIds)
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // localStorage 不可用（無痕模式、容量已滿等）時安靜略過，不影響繼續作答
  }
}
function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.diagState || !data.selection) return null;
    return data;
  } catch (err) {
    return null;
  }
}
function clearSavedProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
}
function restoreDiagState(saved) {
  return {
    ...saved.diagState,
    askedIds: new Set(saved.diagState.askedIds)
  };
}

/* ---------- 通用畫面切換（沿用 calculator.js 已驗證過的卡片轉場模式） ---------- */
function renderCard(html) {
  const wizard = document.getElementById("diag-wizard");
  wizard.innerHTML = html;
  const card = wizard.querySelector(".diag-card");
  if (reducedMotion()) { card.classList.add("is-active"); return card; }
  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-active")));
  return card;
}
function transitionToCard(buildFn) {
  const wizard = document.getElementById("diag-wizard");
  const oldCard = wizard.querySelector(".diag-card");
  if (!oldCard || reducedMotion()) { buildFn(); return; }
  oldCard.classList.add("is-leaving");
  oldCard.classList.remove("is-active");
  setTimeout(buildFn, 180);
}

function updateProgressBar() {
  const bar = document.getElementById("diag-progress");
  const fill = document.getElementById("diag-progress-fill");
  const label = document.getElementById("diag-progress-label");
  if (ui.phase === "hero" || ui.phase === "done") { bar.hidden = true; return; }
  bar.hidden = false;

  if (ui.phase === "industry") { fill.style.width = "6%"; label.textContent = "基本設定"; return; }
  if (ui.phase === "bizmodel") { fill.style.width = "12%"; label.textContent = "基本設定"; return; }
  if (ui.phase === "stage") { fill.style.width = "18%"; label.textContent = "基本設定"; return; }

  // question 階段：用「已經回答過的共通題類別數／7」概估進度，
  // 只是給使用者一個大致的前進感，不是精確題數（規格十五）。
  const answeredCategories = new Set();
  Object.keys(ui.diagState.answers).forEach((id) => {
    const letter = id[0];
    if (CATEGORY_LETTERS.includes(letter)) answeredCategories.add(letter);
  });
  const pct = 20 + Math.min(1, answeredCategories.size / CATEGORY_LETTERS.length) * 76;
  fill.style.width = pct + "%";
  const section = ui.currentQuestion ? getProgressSection(ui.currentQuestion) : "basic";
  label.textContent = PROGRESS_SECTION_LABELS[section] || "行銷與轉換";
}

/* ---------- Phase: 產業選擇 ---------- */
function buildIndustryHTML() {
  return `
    <div class="diag-card">
      <p class="diag-card-eyebrow">基本設定 · 1 / 3</p>
      <h2 class="diag-question">你的事業比較接近哪一種產業？</h2>
      <p class="diag-hint">選擇最接近的一項，後面的問題會依此調整</p>
      <div class="diag-picker-grid">
        ${industries.map((ind) => `
          <button type="button" class="diag-picker-card" data-id="${ind.id}">
            <span class="diag-picker-icon" aria-hidden="true">${ind.icon}</span>
            <span class="diag-picker-title">${ind.nameZh}</span>
            <span class="diag-picker-desc">${ind.description}</span>
          </button>
        `).join("")}
      </div>
      <div class="diag-nav">
        <button type="button" class="secondary-action diag-back-btn" id="diag-back">← 上一步</button>
        <p class="diag-key-hint">按 <kbd>Enter</kbd> 繼續，<kbd>Esc</kbd> 返回</p>
        <button type="button" class="primary-action diag-next-btn" id="diag-next" ${ui.selection.industry ? "" : "disabled"}>下一步 →</button>
      </div>
    </div>
  `;
}
function renderIndustryScreen() {
  ui.phase = "industry";
  const card = renderCard(buildIndustryHTML());
  if (ui.selection.industry) {
    const btn = card.querySelector(`.diag-picker-card[data-id="${ui.selection.industry}"]`);
    if (btn) btn.classList.add("is-selected");
  }
  card.querySelectorAll(".diag-picker-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      ui.selection.industry = btn.dataset.id;
      card.querySelectorAll(".diag-picker-card").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      document.getElementById("diag-next").disabled = false;
    });
  });
  document.getElementById("diag-back").addEventListener("click", () => transitionToCard(renderHero));
  document.getElementById("diag-next").addEventListener("click", () => {
    if (!ui.selection.industry) return;
    transitionToCard(renderBizModelScreen);
  });
  updateProgressBar();
}

/* ---------- Phase: 商業模式選擇（可複選＋一個主要） ---------- */
function buildBizModelHTML() {
  return `
    <div class="diag-card">
      <p class="diag-card-eyebrow">基本設定 · 2 / 3</p>
      <h2 class="diag-question">你的商業模式是？</h2>
      <p class="diag-hint">可以複選，選好之後點一次「★」標示你的<strong>主要</strong>模式</p>
      <div class="diag-chip-list">
        ${businessModels.map((bm) => `
          <button type="button" class="diag-chip" data-id="${bm.id}">
            <span class="diag-chip-star" aria-hidden="true">★</span>${bm.nameZh}
          </button>
        `).join("")}
      </div>
      <p class="diag-primary-hint" id="diag-primary-hint">尚未選擇主要商業模式</p>
      <div class="diag-nav">
        <button type="button" class="secondary-action diag-back-btn" id="diag-back">← 上一步</button>
        <p class="diag-key-hint">按 <kbd>Enter</kbd> 繼續，<kbd>Esc</kbd> 返回</p>
        <button type="button" class="primary-action diag-next-btn" id="diag-next" disabled>下一步 →</button>
      </div>
    </div>
  `;
}
function refreshBizModelChips(card) {
  card.querySelectorAll(".diag-chip").forEach((chip) => {
    const id = chip.dataset.id;
    chip.classList.toggle("is-selected", ui.selection.businessModels.includes(id));
    chip.classList.toggle("is-primary", ui.selection.primaryBusinessModel === id);
  });
  const hint = document.getElementById("diag-primary-hint");
  const primaryModel = businessModels.find((bm) => bm.id === ui.selection.primaryBusinessModel);
  hint.textContent = primaryModel ? `主要商業模式：${primaryModel.nameZh}` : "尚未選擇主要商業模式";
  document.getElementById("diag-next").disabled = !(ui.selection.businessModels.length > 0 && ui.selection.primaryBusinessModel);
}
function renderBizModelScreen() {
  ui.phase = "bizmodel";
  const card = renderCard(buildBizModelHTML());
  refreshBizModelChips(card);
  card.querySelectorAll(".diag-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const id = chip.dataset.id;
      const idx = ui.selection.businessModels.indexOf(id);
      if (idx >= 0) {
        ui.selection.businessModels.splice(idx, 1);
        if (ui.selection.primaryBusinessModel === id) {
          ui.selection.primaryBusinessModel = ui.selection.businessModels[0] || null;
        }
      } else {
        ui.selection.businessModels.push(id);
        if (!ui.selection.primaryBusinessModel) ui.selection.primaryBusinessModel = id;
        else if (ui.selection.businessModels.length === 1) ui.selection.primaryBusinessModel = id;
      }
      // 已選取的狀態下再次點擊、且不是唯一一個已選項目時，視為「設為主要」
      if (ui.selection.businessModels.includes(id) && ui.selection.businessModels.length > 1) {
        ui.selection.primaryBusinessModel = id;
      }
      refreshBizModelChips(card);
    });
  });
  document.getElementById("diag-back").addEventListener("click", () => transitionToCard(renderIndustryScreen));
  document.getElementById("diag-next").addEventListener("click", () => {
    if (!(ui.selection.businessModels.length > 0 && ui.selection.primaryBusinessModel)) return;
    transitionToCard(renderStageScreen);
  });
  updateProgressBar();
}

/* ---------- Phase: 發展階段選擇 ---------- */
function buildStageHTML() {
  return `
    <div class="diag-card">
      <p class="diag-card-eyebrow">基本設定 · 3 / 3</p>
      <h2 class="diag-question">你目前處於哪個發展階段？</h2>
      <p class="diag-hint">這會決定後面問題的深度與方向</p>
      <div class="diag-options is-single-col">
        ${stages.map((s) => `
          <button type="button" class="diag-option" data-id="${s.id}">
            <span class="diag-option-check" aria-hidden="true">✓</span>
            <span class="diag-option-title">${s.nameZh}</span>
            <span class="diag-option-desc">${s.description}</span>
          </button>
        `).join("")}
      </div>
      <div class="diag-nav">
        <button type="button" class="secondary-action diag-back-btn" id="diag-back">← 上一步</button>
        <p class="diag-key-hint">按 <kbd>Enter</kbd> 繼續，<kbd>Esc</kbd> 返回</p>
        <button type="button" class="primary-action diag-next-btn" id="diag-next" ${ui.selection.stage ? "" : "disabled"}>開始問答 →</button>
      </div>
    </div>
  `;
}
function renderStageScreen() {
  ui.phase = "stage";
  const card = renderCard(buildStageHTML());
  if (ui.selection.stage) {
    const btn = card.querySelector(`.diag-option[data-id="${ui.selection.stage}"]`);
    if (btn) btn.classList.add("is-selected");
  }
  card.querySelectorAll(".diag-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      ui.selection.stage = btn.dataset.id;
      card.querySelectorAll(".diag-option").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      document.getElementById("diag-next").disabled = false;
    });
  });
  document.getElementById("diag-back").addEventListener("click", () => transitionToCard(renderBizModelScreen));
  document.getElementById("diag-next").addEventListener("click", () => {
    if (!ui.selection.stage) return;
    startQuestions();
  });
  updateProgressBar();
}

/* ---------- Phase: 動態問答 ---------- */
function startQuestions() {
  ui.diagState = createDiagnosisState({
    industry: ui.selection.industry,
    businessModels: ui.selection.businessModels,
    primaryBusinessModel: ui.selection.primaryBusinessModel,
    stage: ui.selection.stage
  });
  advanceToNextQuestion();
}
function advanceToNextQuestion() {
  const next = getNextQuestion(ui.diagState);
  if (!next) { finishDiagnosis(); return; }
  ui.currentQuestion = next;
  ui.currentDraftValue = ui.diagState.answers[next.id];
  transitionToCard(renderQuestionScreen);
}

function buildAnswerBodyHTML(q) {
  if (q.answerType === "single") {
    return `<div class="diag-options ${q.options.length > 4 ? "" : "is-single-col"}">${q.options.map((opt) => `
      <button type="button" class="diag-option" data-value="${opt.value}">
        <span class="diag-option-check" aria-hidden="true">✓</span>
        <span class="diag-option-title">${opt.label}</span>
        ${opt.description ? `<span class="diag-option-desc">${opt.description}</span>` : ""}
      </button>
    `).join("")}</div>`;
  }
  if (q.answerType === "multi") {
    return `<div class="diag-options">${q.options.map((opt) => `
      <button type="button" class="diag-option" data-value="${opt.value}">
        <span class="diag-option-check" aria-hidden="true">✓</span>
        <span class="diag-option-title">${opt.label}</span>
        ${opt.description ? `<span class="diag-option-desc">${opt.description}</span>` : ""}
      </button>
    `).join("")}</div>`;
  }
  if (q.answerType === "number") {
    const cfg = q.numberConfig || {};
    return `
      <div class="diag-input-row">
        <label class="diag-input-label" for="diag-number-input">${cfg.unit ? `單位：${cfg.unit}` : "請輸入數字"}</label>
        <input type="number" inputmode="decimal" class="diag-input" id="diag-number-input"
          placeholder="${cfg.placeholder || ""}" ${cfg.min != null ? `min="${cfg.min}"` : ""} ${cfg.max != null ? `max="${cfg.max}"` : ""}>
      </div>
    `;
  }
  // text
  const cfg = q.textConfig || {};
  return `
    <div class="diag-input-row">
      <label class="diag-input-label" for="diag-text-input">選填 <span class="diag-input-optional">（可以直接跳過）</span></label>
      <textarea class="diag-textarea" id="diag-text-input" placeholder="${cfg.placeholder || ""}" ${cfg.maxLength ? `maxlength="${cfg.maxLength}"` : ""}></textarea>
    </div>
  `;
}
function buildQuestionHTML(q) {
  const section = getProgressSection(q);
  return `
    <div class="diag-card">
      <p class="diag-card-eyebrow">${PROGRESS_SECTION_LABELS[section] || "行銷與轉換"}</p>
      <h2 class="diag-question">${q.question}</h2>
      ${q.description ? `<p class="diag-hint">${q.description}</p>` : ""}
      ${buildAnswerBodyHTML(q)}
      <div class="diag-nav">
        <button type="button" class="secondary-action diag-back-btn" id="diag-back">← 上一步</button>
        <p class="diag-key-hint">按 <kbd>Enter</kbd> 繼續，<kbd>Esc</kbd> 返回</p>
        <button type="button" class="primary-action diag-next-btn" id="diag-next" ${q.answerType === "text" ? "" : "disabled"}>下一步 →</button>
      </div>
    </div>
  `;
}
function isDraftAnswered(q) {
  if (q.answerType === "single") return ui.currentDraftValue !== undefined && ui.currentDraftValue !== null;
  if (q.answerType === "multi") return Array.isArray(ui.currentDraftValue) && ui.currentDraftValue.length > 0;
  if (q.answerType === "number") return typeof ui.currentDraftValue === "number" && !Number.isNaN(ui.currentDraftValue);
  return true; // text 為選填，永遠可以繼續
}
function renderQuestionScreen() {
  ui.phase = "question";
  const q = ui.currentQuestion;
  const card = renderCard(buildQuestionHTML(q));
  const nextBtn = document.getElementById("diag-next");

  if (q.answerType === "single") {
    card.querySelectorAll(".diag-option").forEach((btn) => {
      if (btn.dataset.value === String(ui.currentDraftValue)) btn.classList.add("is-selected");
      btn.addEventListener("click", () => {
        ui.currentDraftValue = btn.dataset.value;
        card.querySelectorAll(".diag-option").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        nextBtn.disabled = false;
      });
    });
  } else if (q.answerType === "multi") {
    const current = Array.isArray(ui.currentDraftValue) ? ui.currentDraftValue.slice() : [];
    card.querySelectorAll(".diag-option").forEach((btn) => {
      if (current.includes(btn.dataset.value)) btn.classList.add("is-selected");
      btn.addEventListener("click", () => {
        const val = btn.dataset.value;
        const arr = Array.isArray(ui.currentDraftValue) ? ui.currentDraftValue.slice() : [];
        const pos = arr.indexOf(val);
        if (pos >= 0) arr.splice(pos, 1); else arr.push(val);
        ui.currentDraftValue = arr;
        btn.classList.toggle("is-selected", arr.includes(val));
        nextBtn.disabled = arr.length === 0;
      });
    });
  } else if (q.answerType === "number") {
    const input = card.querySelector("#diag-number-input");
    if (typeof ui.currentDraftValue === "number") input.value = ui.currentDraftValue;
    input.addEventListener("input", () => {
      const val = Number(input.value);
      if (input.value !== "" && !Number.isNaN(val)) {
        ui.currentDraftValue = val;
        nextBtn.disabled = false;
      } else {
        ui.currentDraftValue = undefined;
        nextBtn.disabled = true;
      }
    });
  } else {
    const textarea = card.querySelector("#diag-text-input");
    if (typeof ui.currentDraftValue === "string") textarea.value = ui.currentDraftValue;
    textarea.addEventListener("input", () => { ui.currentDraftValue = textarea.value; });
  }

  document.getElementById("diag-back").addEventListener("click", goBackFromQuestion);
  nextBtn.addEventListener("click", commitCurrentAnswer);
  updateProgressBar();
}
function commitCurrentAnswer() {
  const q = ui.currentQuestion;
  if (!isDraftAnswered(q)) return;
  const value = q.answerType === "text" ? (ui.currentDraftValue || "") : ui.currentDraftValue;
  submitAnswer(ui.diagState, q.id, value);
  saveProgress();
  advanceToNextQuestion();
}
function goBackFromQuestion() {
  if (ui.diagState.answerOrder.length === 0) {
    transitionToCard(renderStageScreen);
    return;
  }
  const lastId = ui.diagState.answerOrder[ui.diagState.answerOrder.length - 1];
  const lastValue = ui.diagState.answers[lastId];
  goBackOneQuestion(ui.diagState);
  ui.currentQuestion = getQuestionById(lastId);
  ui.currentDraftValue = lastValue;
  saveProgress();
  transitionToCard(renderQuestionScreen);
}

/* ---------- Phase 2 收尾：摘要畫面（完整結果頁在 Phase 4 建立） ---------- */
function finishDiagnosis() {
  ui.phase = "done";
  ui.diagState.completedAt = Date.now();
  saveProgress();
  document.getElementById("diag-wizard").hidden = true;
  document.getElementById("diag-results").hidden = false;
  updateProgressBar();
  renderSummaryScreen();
  window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}
function renderSummaryScreen() {
  const industry = industries.find((i) => i.id === ui.selection.industry);
  const stage = stages.find((s) => s.id === ui.selection.stage);
  const primaryModel = businessModels.find((b) => b.id === ui.selection.primaryBusinessModel);
  const answeredCount = Object.keys(ui.diagState.answers).length;
  const root = document.getElementById("diag-results");
  root.innerHTML = `
    <div class="diag-summary-card">
      <h2 class="diag-summary-title">問答已完成</h2>
      <p class="diag-summary-note">已經收集到足夠的資料。計分、瓶頸分析與完整的個人化建議頁面正在後續階段建置中，目前先讓你確認已經收集到的基本資料是否正確。</p>
      <div class="diag-summary-list">
        <div class="diag-summary-item"><strong>產業</strong>${industry ? industry.nameZh : "—"}</div>
        <div class="diag-summary-item"><strong>主要商業模式</strong>${primaryModel ? primaryModel.nameZh : "—"}（共選擇 ${ui.selection.businessModels.length} 項）</div>
        <div class="diag-summary-item"><strong>發展階段</strong>${stage ? stage.nameZh : "—"}</div>
        <div class="diag-summary-item"><strong>已回答題數</strong>${answeredCount} 題</div>
      </div>
      <button type="button" class="secondary-action diag-restart-btn" id="diag-restart">重新開始檢測</button>
    </div>
  `;
  document.getElementById("diag-restart").addEventListener("click", restart);
}

/* ---------- Hero / 啟動與重新開始 ---------- */
function buildHeroResumeHTML() {
  const saved = loadSavedProgress();
  if (!saved) return "";
  return `<div class="diag-hero-resume">
    <button type="button" class="secondary-action" id="diag-resume-btn">繼續上次未完成的檢測</button>
  </div>`;
}
function renderHero() {
  ui.phase = "hero";
  document.getElementById("diag-results").hidden = true;
  document.getElementById("diag-wizard").hidden = true;
  document.getElementById("diag-hero").hidden = false;
  updateProgressBar();

  const resumeHost = document.getElementById("diag-hero");
  let resumeBtn = document.getElementById("diag-resume-btn");
  if (resumeBtn) resumeBtn.remove();
  const saved = loadSavedProgress();
  if (saved) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary-action";
    btn.id = "diag-resume-btn";
    btn.style.marginTop = "10px";
    btn.textContent = "繼續上次未完成的檢測";
    btn.addEventListener("click", () => resumeFromSaved(saved));
    resumeHost.appendChild(btn);
  }
  window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}
function resumeFromSaved(saved) {
  ui.selection = saved.selection;
  ui.diagState = restoreDiagState(saved);
  document.getElementById("diag-hero").hidden = true;
  document.getElementById("diag-wizard").hidden = false;
  advanceToNextQuestion();
}
function startFresh() {
  clearSavedProgress();
  ui.selection = { industry: null, businessModels: [], primaryBusinessModel: null, stage: null };
  ui.diagState = null;
  ui.currentQuestion = null;
  ui.currentDraftValue = undefined;
  document.getElementById("diag-hero").hidden = true;
  document.getElementById("diag-wizard").hidden = false;
  renderIndustryScreen();
}
function restart() {
  clearSavedProgress();
  ui.selection = { industry: null, businessModels: [], primaryBusinessModel: null, stage: null };
  ui.diagState = null;
  ui.currentQuestion = null;
  ui.currentDraftValue = undefined;
  document.getElementById("diag-results").hidden = true;
  renderHero();
}

/* ---------- 鍵盤操作 ---------- */
function setupKeyboardNav() {
  document.addEventListener("keydown", (e) => {
    const wizard = document.getElementById("diag-wizard");
    if (wizard.hidden) return;
    const isTyping = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
    if (e.key === "Enter") {
      if (isTyping && document.activeElement.tagName === "TEXTAREA") return; // 允許換行
      e.preventDefault();
      const nextBtn = document.getElementById("diag-next");
      if (nextBtn && !nextBtn.disabled) nextBtn.click();
    } else if (e.key === "Escape") {
      e.preventDefault();
      const backBtn = document.getElementById("diag-back");
      if (backBtn) backBtn.click();
    }
  });
}

/* ---------- 啟動 ---------- */
function init() {
  document.getElementById("diag-start-btn").addEventListener("click", startFresh);
  setupKeyboardNav();
  renderHero();
}

document.addEventListener("DOMContentLoaded", init);
