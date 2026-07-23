/**
 * ===== 條件判斷引擎 =====
 * @typedef {import('../types/diagnosis.js').Condition} Condition
 *
 * 純函式，只依賴傳入的 answers 物件，不持有狀態。question.conditions 之間
 * 是 AND 關係（見 types/diagnosis.js 的 Question.conditions 註解）。
 */

/**
 * @param {Condition} condition
 * @param {Object.<string, string|string[]|number>} answers
 * @returns {boolean}
 */
export function evaluateCondition(condition, answers) {
  const answer = answers[condition.questionId];
  if (answer === undefined || answer === null) return false;

  switch (condition.operator) {
    case "equals": {
      // value 可以是單一值，也可以是陣列代表「符合其中之一」
      // （例如 DiagnosticRule 需要判斷 single 題答案是否落在某幾個選項之一）。
      const targets = Array.isArray(condition.value) ? condition.value : [condition.value];
      return Array.isArray(answer) ? answer.some((v) => targets.includes(v)) : targets.includes(answer);
    }
    case "notEquals": {
      const targets = Array.isArray(condition.value) ? condition.value : [condition.value];
      return Array.isArray(answer) ? !answer.some((v) => targets.includes(v)) : !targets.includes(answer);
    }
    case "includes": {
      if (!Array.isArray(answer)) return false;
      const targets = Array.isArray(condition.value) ? condition.value : [condition.value];
      return targets.some((v) => answer.includes(v));
    }
    case "excludes": {
      if (!Array.isArray(answer)) return true;
      const targets = Array.isArray(condition.value) ? condition.value : [condition.value];
      return !targets.some((v) => answer.includes(v));
    }
    case "gt":
      return Number(answer) > Number(condition.value);
    case "lt":
      return Number(answer) < Number(condition.value);
    case "gte":
      return Number(answer) >= Number(condition.value);
    case "lte":
      return Number(answer) <= Number(condition.value);
    default:
      return false;
  }
}

/**
 * conditions 為空／未設定時視為「一定成立」（沒有前置條件的共通基礎題）。
 * @param {Condition[]|undefined} conditions
 * @param {Object.<string, string|string[]|number>} answers
 * @returns {boolean}
 */
export function evaluateConditions(conditions, answers) {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => evaluateCondition(c, answers));
}
