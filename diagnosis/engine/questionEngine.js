/**
 * ===== 動態追問引擎 =====
 * @typedef {import('../types/diagnosis.js').Question} Question
 * @typedef {import('../types/diagnosis.js').Answer} Answer
 *
 * 這是規格八點名「最重要的部分」的實作：條件與跳題邏輯完全資料化
 * （見 commonQuestions.js 的 conditions／followUpQuestionIds），這個檔案
 * 只負責「讀資料、依狀態決定下一題」，不寫死任何一題的判斷邏輯，避免在
 * component 裡出現大量 if/else。
 *
 * 核心規則：
 * 1. 每次都優先清空「追問佇列」（pendingFollowUps）——使用者剛觸發的
 *    追問鏈，要在下一題立刻出現，而不是排到所有基礎題問完之後。
 * 2. 追問佇列清空後，才依 priority 由基礎題庫（commonQuestions）挑下一題。
 * 3. 題目是否出現，除了 conditions／applicableIndustries／applicableStages
 *    之外，也會用 stage.deprioritizeDimensions 過濾——例如「尚未創業」
 *    階段的 deprioritizeDimensions 包含 traffic／conversion／retention／
 *    system，所以不會被一直追問 GA4、廣告 ROAS 或會員回購率
 *    （對應規格五的明確例子），不需要在每一題資料上手動加條件。
 */

import { evaluateConditions } from "./conditionEvaluator.js";
import { commonQuestions, followUpQuestions } from "../data/commonQuestions.js";
import { getStageById } from "../data/stages.js";

const ALL_QUESTIONS = [...commonQuestions, ...followUpQuestions];
const QUESTION_MAP = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

/** @param {string} id @returns {Question|undefined} */
export function getQuestionById(id) {
  return QUESTION_MAP.get(id);
}

/**
 * @param {{industry: string, businessModels: string[], primaryBusinessModel: string, stage: string}} setup
 */
export function createDiagnosisState(setup) {
  return {
    industry: setup.industry,
    businessModels: setup.businessModels,
    primaryBusinessModel: setup.primaryBusinessModel,
    stage: setup.stage,
    /** @type {Object.<string, string|string[]|number>} */
    answers: {},
    /** @type {string[]} 依作答順序記錄的題目 id，供上一步／進度使用 */
    answerOrder: [],
    /** @type {string[]} 追問鏈佇列（FIFO），由 submitAnswer 動態注入 */
    pendingFollowUps: [],
    /** @type {Set<string>} 已經呈現給使用者的題目 id（不論是否已作答） */
    askedIds: new Set(),
    startedAt: Date.now()
  };
}

function questionApplies(q, state) {
  if (q.applicableIndustries && q.applicableIndustries.length && !q.applicableIndustries.includes(state.industry)) {
    return false;
  }
  if (q.applicableStages && q.applicableStages.length && !q.applicableStages.includes(state.stage)) {
    return false;
  }
  const stage = getStageById(state.stage);
  if (stage && stage.deprioritizeDimensions && stage.deprioritizeDimensions.includes(q.dimension)) {
    return false;
  }
  if (!evaluateConditions(q.conditions, state.answers)) return false;
  return true;
}

function getBaseCandidates(state) {
  return commonQuestions
    .filter((q) => state.answers[q.id] === undefined && !state.askedIds.has(q.id))
    .filter((q) => questionApplies(q, state))
    .sort((a, b) => a.priority - b.priority);
}

/**
 * 回傳下一題，沒有下一題（診斷已完成）時回傳 null。
 * 不會改變 answers，但會把回傳的題目標記為「已呈現」（askedIds）。
 * @returns {Question|null}
 */
export function getNextQuestion(state) {
  while (state.pendingFollowUps.length > 0) {
    const id = state.pendingFollowUps.shift();
    if (state.answers[id] !== undefined) continue;
    const q = getQuestionById(id);
    if (!q) continue;
    if (!questionApplies(q, state)) continue;
    state.askedIds.add(id);
    return q;
  }
  const candidates = getBaseCandidates(state);
  if (candidates.length === 0) return null;
  const next = candidates[0];
  state.askedIds.add(next.id);
  return next;
}

/**
 * @param {ReturnType<typeof createDiagnosisState>} state
 * @param {string} questionId
 * @param {string|string[]|number} value
 */
export function submitAnswer(state, questionId, value) {
  const q = getQuestionById(questionId);
  if (!q) throw new Error(`Unknown question id: ${questionId}`);

  state.answers[questionId] = value;
  if (!state.answerOrder.includes(questionId)) state.answerOrder.push(questionId);

  if (q.followUpQuestionIds) {
    const selectedValues = Array.isArray(value) ? value : [value];
    const newIds = [];
    selectedValues.forEach((v) => {
      const ids = q.followUpQuestionIds[String(v)];
      if (!ids) return;
      ids.forEach((id) => {
        if (!state.askedIds.has(id) && !newIds.includes(id)) newIds.push(id);
      });
    });
    // 新觸發的追問插入佇列最前面：緊接在觸發題之後立刻出現，
    // 而不是排到目前佇列裡其他（較早觸發的）追問鏈之後。
    state.pendingFollowUps = newIds.concat(state.pendingFollowUps);
  }
}

/** @returns {boolean} 是否已經沒有可問的題目（共通問題階段結束） */
export function isDiagnosisComplete(state) {
  if (state.pendingFollowUps.some((id) => state.answers[id] === undefined)) return false;
  return getBaseCandidates(state).length === 0;
}

/**
 * 上一步：撤銷最近一次作答，並清掉因此觸發、但使用者還沒回答的追問，
 * 因為重新作答很可能走向不同的追問鏈。已經回答過的追問題目維持保留
 * （使用者可以繼續往回撤銷）。
 * @returns {string|null} 被撤銷的題目 id
 */
export function goBackOneQuestion(state) {
  const lastId = state.answerOrder.pop();
  if (!lastId) return null;
  delete state.answers[lastId];
  state.askedIds.delete(lastId);

  const q = getQuestionById(lastId);
  if (q && q.followUpQuestionIds) {
    const triggeredIds = new Set(Object.values(q.followUpQuestionIds).flat());
    state.pendingFollowUps = state.pendingFollowUps.filter((id) => !triggeredIds.has(id));
    triggeredIds.forEach((id) => {
      if (state.answers[id] === undefined) state.askedIds.delete(id);
    });
  }
  return lastId;
}

/**
 * 進度用的階段標籤（規格十五：不顯示固定題數，只顯示所在階段）。
 * @param {Question} question
 * @returns {"basic"|"positioning"|"marketing"}
 */
export function getProgressSection(question) {
  return question.section || "marketing";
}

export const PROGRESS_SECTION_LABELS = {
  basic: "基本狀況",
  positioning: "客戶與定位",
  marketing: "行銷與轉換"
};
