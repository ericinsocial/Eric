/**
 * ===== Diagnostic Rules 評估引擎 =====
 * @typedef {import('../types/diagnosis.js').DiagnosticRule} DiagnosticRule
 *
 * 規格四／六：純函式，輸入目前的作答狀態，輸出「哪些規則成立」——每一條
 * 成立的規則都附帶它依賴的實際答案（evidence），讓結果頁與 AI 都能講出
 * 「因為你回答了 X、Y，所以判斷是 Z」，而不是端出一個算不出來源的結論。
 *
 * 這裡完全不做「分數加總」或「排序哪個最重要」——那是 bottleneckEngine
 * （Phase 3）的責任，會同時參考這裡的輸出與 scoringEngine 的分數。
 */

import { evaluateConditions } from "./conditionEvaluator.js";

/**
 * @param {DiagnosticRule[]} rules
 * @param {Object.<string, string|string[]|number>} answers
 * @returns {Array<{rule: DiagnosticRule, evidence: {questionId: string, value: string|string[]|number}[]}>}
 */
export function evaluateDiagnosticRules(rules, answers) {
  const matched = [];
  rules.forEach((rule) => {
    if (!evaluateConditions(rule.when, answers)) return;
    const evidence = rule.when.map((c) => ({ questionId: c.questionId, value: answers[c.questionId] }));
    matched.push({ rule, evidence });
  });
  return matched;
}

const CONFIDENCE_RANK = { high: 3, medium: 2, low: 1 };
const SEVERITY_RANK = { high: 3, medium: 2, low: 1 };

/**
 * 依 severity 優先、confidence 其次排序，方便結果頁決定呈現順序。
 * 不代表最終的「主要瓶頸」——那還要再疊加 bottleneckEngine 的成長順序依賴判斷。
 * @param {Array<{rule: DiagnosticRule, evidence: any[]}>} matches
 */
export function rankDiagnosticMatches(matches) {
  return [...matches].sort((a, b) => {
    const severityDiff = (SEVERITY_RANK[b.rule.severity] || 0) - (SEVERITY_RANK[a.rule.severity] || 0);
    if (severityDiff !== 0) return severityDiff;
    return (CONFIDENCE_RANK[b.rule.confidence] || 0) - (CONFIDENCE_RANK[a.rule.confidence] || 0);
  });
}

/**
 * 收集一組匹配規則背後涉及的所有 hypothesisId（去重），方便快速看出
 * 目前證據指向哪些假設。
 * @param {Array<{rule: DiagnosticRule}>} matches
 * @returns {string[]}
 */
export function collectHypothesisIds(matches) {
  const ids = new Set();
  matches.forEach((m) => m.rule.hypothesisIds.forEach((id) => ids.add(id)));
  return Array.from(ids);
}
