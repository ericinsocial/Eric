/**
 * ===== AI 行銷成長檢測：共用型別定義 =====
 *
 * 專案目前沒有建置流程（無 bundler／無 TypeScript 編譯器，純靜態 GitHub
 * Pages），因此型別以 JSDoc typedef 呈現，而非 .ts 檔案。編輯器（VS Code
 * 等）仍可讀取這些 JSDoc 型別做自動完成與型別檢查；架構上與 TypeScript
 * 對齊，未來若專案改採建置流程，可直接把這些 typedef 轉成對應的
 * interface，不需要重新設計資料結構。
 *
 * 這個檔案不匯出任何執行期程式碼，只用來集中放置型別定義，供其他檔案
 * 用 `@typedef {import('../types/diagnosis.js').Industry} Industry` 參照。
 */

/**
 * @typedef {"market"|"positioning"|"offer"|"brand"|"traffic"|"conversion"|"retention"|"system"} Dimension
 * 八大診斷維度代號：
 * market 市場與需求／positioning 客群與定位／offer 產品與價值主張／
 * brand 品牌與信任／traffic 流量與曝光／conversion 轉換與成交／
 * retention 留存與回購／system 數據與營運
 */

/**
 * @typedef {Object} Industry
 * @property {string} id 產業代號，例如 "restaurant"
 * @property {string} nameZh 中文名稱
 * @property {string} nameEn 英文名稱
 * @property {string} description 簡短說明
 * @property {string} icon 視覺識別（emoji 或既有 icon 系統的 key）
 * @property {string[]} businessModels 適用的商業模式 id 列表
 * @property {string[]} keyMetrics 主要指標
 * @property {string[]} commonBottlenecks 常見瓶頸
 * @property {string} questionModule 對應的產業問題模組 id
 *   （對應 industryQuestions.js 內的 key；找不到時 fallback 用 "generic"）
 */

/**
 * @typedef {Object} BusinessModel
 * @property {string} id
 * @property {string} nameZh
 * @property {string} nameEn
 * @property {string} description
 */

/**
 * @typedef {Object} Stage
 * @property {string} id
 * @property {string} nameZh
 * @property {string} nameEn
 * @property {string} description
 * @property {number} order 成長順序（用於瓶頸引擎判斷「現階段合理性」，數字越小代表越早期）
 * @property {Dimension[]} deprioritizeDimensions
 *   這個階段不該優先深入詢問／評分的維度（例如尚未創業階段的 retention／system）
 */

/**
 * @typedef {"single"|"multi"|"number"|"text"} AnswerType
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} value
 * @property {string} label
 * @property {string} [description]
 */

/**
 * @typedef {Object} ScoreRule
 * 單一答案觸發的計分規則，一個 Question 的一個 option 可以對應多筆 ScoreRule
 * （例如同時影響 traffic 與 system）。
 * @property {Dimension} dimension 影響哪個維度
 * @property {number} points 正負分（例如 +12 或 -15）
 * @property {"positiveScore"|"negativeScore"} kind 用於結果頁分類正／負向證據
 * @property {number} [confidence] 0-1，這筆規則的判斷把握度，預設 1
 * @property {"low"|"medium"|"high"} [severity] 負向規則的嚴重性，用於瓶頸引擎排序
 * @property {string} [insightId] 觸發的 insight id（連結到 insights.js，用於結果頁「為什麼」「證據」文字）
 */

/**
 * @typedef {Object} Condition
 * 條件式跳題／子題觸發的判斷式，由 conditionEvaluator 解讀。
 * @property {string} questionId 依賴哪一題的答案
 * @property {"equals"|"notEquals"|"includes"|"excludes"|"gt"|"lt"|"gte"|"lte"} operator
 * @property {string|number|string[]} value 比較值。equals／notEquals 搭配字串陣列時，
 *   代表「符合其中之一」（例如判斷 single 題答案落在某幾個選項之一）；
 *   includes／excludes 則是判斷 multi 題答案是否包含某個值。
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {Dimension} dimension 這題主要對應的維度（追問題可能跨維度，實際計分以 options[].scoring 為準）
 * @property {string} question 題目文字
 * @property {string} [description] 題目輔助說明
 * @property {AnswerType} answerType
 * @property {string} whyAsking 為什麼要問這一題（給開發者／未來的我看，也是結果頁與 AI 引用推理過程的依據）——
 *   不是在說「我要知道這個資訊」，而是「我要驗證什麼」。例如「是否有官網？」的 whyAsking
 *   不是「我要知道有沒有官網」，而是「驗證目前是否擁有自己的流量資產」。
 * @property {string} hypothesis 這一題的答案，會支持或推翻哪一個假設（見 Hypothesis／DiagnosticRule）
 * @property {QuestionOption[]} [options] single／multi 題型使用
 * @property {{min?: number, max?: number, unit?: string, placeholder?: string}} [numberConfig] number 題型使用
 * @property {{maxLength?: number, placeholder?: string}} [textConfig] text 題型使用（盡量避免使用，見規格十五）
 * @property {Object.<string, ScoreRule[]>} [scoring]
 *   key 為 option value（number／text 題型可用 "*" 代表任何非空作答的固定分數）
 * @property {Condition[]} [conditions] 這一題「是否要出現」的條件（AND 關係）；沒有 conditions 代表一定會問（common 題庫的基礎題）
 * @property {Object.<string, string[]>} [followUpQuestionIds]
 *   key 為 option value，value 為觸發的追問題 id 列表（最多三層，由 questionEngine 控制深度避免無限循環）
 * @property {string[]} [applicableIndustries] 限定哪些產業會問這題；空陣列或省略代表全產業共通
 * @property {string[]} [applicableStages] 限定哪些發展階段會問這題；空陣列或省略代表全階段共通
 * @property {number} priority 同一批可問題目的排序優先度，數字越小越優先
 * @property {string[]} tags 自由標籤，用於除錯與資料檢視（例如 ["no-website", "ads"]）
 * @property {string} [section] 顯示進度用的階段名稱："basic"｜"positioning"｜"marketing"（對應規格十五的「基本狀況／客戶與定位／行銷與轉換」）
 * @property {boolean} [supersededByJourney] 這一題是通用的「入口問題」，但如果目前
 *   產業有專屬的 IndustryJourney，應該改問該產業自己的 entryQuestion——
 *   questionEngine 看到這個旗標為 true、且 getIndustryJourney(industry) 存在時，
 *   會跳過這一題（見 engine/questionEngine.js）。
 */

/**
 * @typedef {Object} Hypothesis
 * 規格三／四：系統不是在「問問題」，是在對一組懷疑做假設檢定。每一題、每一條
 * DiagnosticRule 都指向某個 Hypothesis；結果頁的「瓶頸」本質上就是「證據最充分、
 * 優先順序最高的 Hypothesis」。
 * @property {string} id
 * @property {Dimension} dimension
 * @property {string} title 例如「客群定位不清楚」
 * @property {string} description 這個假設具體代表什麼情境
 */

/**
 * @typedef {Object} KnowledgeRootCause
 * @property {string} cause 原因的簡短標籤，例如「服務體驗落差」
 * @property {string} explanation 完整說明這個原因如何導致問題
 * @property {string[]} [relatedSignals] 人類可讀的描述：哪些回答訊號會指向這個原因
 *   （不是機器條件，條件判斷仍由 DiagnosticRule.when 負責）
 */

/**
 * @typedef {Object} KnowledgeEntry
 * 規格五：Marketing Knowledge Base——不是題目，是「每一個行銷問題背後真正的原因」。
 * 結果頁與 AI 潤飾（Phase 4／5）都應該引用這裡的內容組句，而不是把解釋文字寫死在
 * 結果頁 component 或 prompt 裡。
 * @property {string} id
 * @property {string} title 例如「Google 評價不佳」
 * @property {Dimension} category
 * @property {string} summary 一句話摘要這個現象
 * @property {KnowledgeRootCause[]} rootCauses 可能的根本原因（通常不只一個）
 * @property {string[]} [relatedHypothesisIds]
 */

/**
 * @typedef {Object} DiagnosticRule
 * 規格四／六：Diagnostic Rules，不是 Scoring Rules。重點不是「這題加幾分」，而是
 * 「這幾個訊號同時成立時，代表高度懷疑某個假設」。when 用 Condition[]（AND）判斷，
 * 條件可以跨越好幾題（例如 Google 評價好 AND IG 追蹤數高 AND 沒有客人）。
 * @property {string} id
 * @property {string} name 人類可讀的規則名稱，例如「口碑與聲量佳但沒有轉換到店」
 * @property {Condition[]} when 觸發條件（AND 關係），可以跨題
 * @property {string[]} hypothesisIds 觸發時，支持哪些 Hypothesis
 * @property {string} conclusionTitle 結果頁可以直接使用的結論標題
 * @property {string} conclusionReasoning 為什麼這些訊號組合起來會導出這個結論
 *   （會被結果頁／AI 引用，取代黑箱結果）
 * @property {"low"|"medium"|"high"} confidence
 * @property {"low"|"medium"|"high"} severity
 * @property {Dimension[]} dimensions 這條規則主要牽涉哪些維度
 * @property {string[]} [knowledgeIds] 對應的 Marketing Knowledge Base 條目 id
 */

/**
 * @typedef {Object} JourneyPath
 * 規格一／二：Industry Journey 的其中一條分支——使用者選了某個入口選項之後，
 * 會走的那一條「驗證假設」的路徑，而不是所有人都回答同一堆通用題目。
 * @property {string} entryValue 對應 entryQuestion 的選項 value
 * @property {string} label
 * @property {string} description 這條路徑主要在驗證什麼
 * @property {string[]} primaryHypothesisIds 這條路徑主要指向的假設
 * @property {string[]} questionIds 這條路徑會依序用到的題目 id（實際跳題仍由
 *   questionEngine 依 conditions／followUpQuestionIds 決定；這份清單是給文件與
 *   QA 用的「這條路徑大致長怎樣」）
 */

/**
 * @typedef {Object} IndustryJourney
 * 規格一／二：Industry Journey——決策樹，不是題庫。每個產業有自己的「入口問題」
 * （取代通用的『目前最大的經營困難是什麼？』），入口的每個答案會走向完全不同的
 * 問題路徑，而不是所有人都被問同一套通用題目。
 * @property {string} industryId
 * @property {Question} entryQuestion 這個產業專屬的入口問題
 * @property {JourneyPath[]} paths
 */

/**
 * @typedef {Object} Answer
 * @property {string} questionId
 * @property {string|string[]|number} value
 * @property {number} answeredAt 時間戳（ms）
 */

/**
 * @typedef {Object} Insight
 * 瓶頸／優勢／風險／浪費警告的文字模板，供 bottleneckEngine／recommendationEngine 挑選使用。
 * @property {string} id
 * @property {"bottleneck"|"strength"|"risk"|"wasteWarning"} type
 * @property {Dimension} [dimension]
 * @property {string} title
 * @property {string} template 內文模板，可包含 {{industry}} 等簡單佔位符
 * @property {string[]} [applicableIndustries]
 */

/**
 * @typedef {Object} DiagnosisScores
 * @property {number} market
 * @property {number} positioning
 * @property {number} offer
 * @property {number} brand
 * @property {number} traffic
 * @property {number} conversion
 * @property {number} retention
 * @property {number} system
 */

/**
 * @typedef {Object} BottleneckResult
 * @property {string} id
 * @property {string} title
 * @property {string} reason
 * @property {string[]} evidence
 * @property {Dimension} dimension
 * @property {number} score
 */

/**
 * @typedef {Object} Diagnosis
 * 最終診斷結果，符合規格十三給定的 JSON schema，是本系統唯一的「事實來源」——
 * AI 最終整理（Phase 5）只能根據這個物件改寫語氣，不能自行更改分數或瓶頸。
 * @property {string} diagnosisId
 * @property {string} industry
 * @property {string[]} businessModel
 * @property {string} stage
 * @property {string} [goal]
 * @property {DiagnosisScores} scores
 * @property {BottleneckResult} primaryBottleneck
 * @property {BottleneckResult[]} secondaryBottlenecks
 * @property {string[]} strengths
 * @property {string[]} risks
 * @property {string[]} wasteWarnings
 * @property {{sevenDays: string[], thirtyDays: string[], ninetyDays: string[]}} actions
 * @property {string[]} doNotDoYet
 * @property {string[]} recommendedMetrics
 * @property {string} summary
 * @property {number} createdAt
 * @property {number} [completedAt]
 */

export {};
