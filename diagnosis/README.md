# AI 行銷成長檢測——架構筆記

這份文件記錄一次架構轉向：從「問卷」重新設計成「行銷顧問對話」。之後要
擴充產業、規則或知識庫時，先看這裡再動手。

## 核心模型

不是 `Question → Score → Result`，而是：

```
Conversation → Evidence → Hypothesis → Diagnosis → Recommendation
   入口對話      每題答案     系統的懷疑     規則判斷出的結論   之後才輪到 AI 潤飾文字
```

每一題不是「我要收集這個資訊」，而是「我要驗證某個假設」。這體現在
`Question.whyAsking`（為什麼問）與 `Question.hypothesis`（驗證什麼）——
`commonQuestions.js`、`journeyQuestions.js`、`industryJourneys.js` 裡的
每一題都有這兩個欄位。

## 四個新的資料層

```
diagnosis/data/
├── hypotheses.js        懷疑清單（Hypothesis）——所有題目與規則最終都指回這裡
├── knowledgeBase.js      Marketing Knowledge Base——每個行銷現象背後「真正的原因」
├── diagnosticRules.js    Diagnostic Rules——「這幾個訊號同時出現，代表懷疑 X」
└── industryJourneys.js   Industry Journey——決策樹，不是題庫

diagnosis/data/journeyQuestions.js   各 Journey 路徑專屬的新題目
diagnosis/engine/diagnosticRules.js  Diagnostic Rules 的評估引擎（純函式）
```

### 1. Hypothesis（`hypotheses.js`）

系統在懷疑的「原因」清單，例如 `positioning_unclear`、`ads_dependency`、
`online_to_offline_gap`。每一題的 `hypothesis` 欄位、每一條
`DiagnosticRule.hypothesisIds`、每一條 Journey 路徑的 `primaryHypothesisIds`
最後都指回這裡。**結果頁（Phase 4）的「主要瓶頸」，本質上就是目前證據
最充分、優先順序最高的 Hypothesis**，不是「分數最低的維度」。

### 2. Marketing Knowledge Base（`knowledgeBase.js`）

不是題目，是「這個現象可能的根本原因」，例如「Google 評價不佳」背後可能
是服務體驗落差、從未邀請評論、負評沒被回應、曝光基數太小。結果頁與 AI
潤飾（Phase 4／5）都應該**引用這裡的 `rootCauses` 組句，而不是把解釋文字
寫死在 component 或 prompt 裡**。用 `getKnowledgeEntriesForHypothesis(id)`
可以直接查某個假設對應哪些知識條目。

### 3. Diagnostic Rules（`diagnosticRules.js` + `engine/diagnosticRules.js`）

不是 Scoring Rules。範例：

> Google 評價好 AND IG 追蹤數高 AND 沒有客人
> → 懷疑 `online_to_offline_gap`（不是缺曝光，是缺轉換橋樑）

`DiagnosticRule.when` 是 `Condition[]`（AND 關係，可跨題），成立時輸出
`conclusionTitle` + `conclusionReasoning` + 對應的 `hypothesisIds` /
`knowledgeIds`。`evaluateDiagnosticRules(rules, answers)` 是純函式，回傳
「哪些規則成立＋依賴哪些實際答案（evidence）」，讓結論永遠可以追溯回
使用者的答案，不是黑箱。

`conditionEvaluator.js` 的 `equals`／`notEquals` 現在支援 value 是陣列
（代表「符合其中之一」），這是為了讓跨題規則能表達「這題答案是 A 或 B」
這種條件，不需要為此另外發明新的 operator。

**這一層目前只做「規則匹配」，不做「排序哪個最重要」**——那是 Phase 3
`bottleneckEngine` 的責任，會同時參考這裡的輸出、`scoringEngine` 的分數，
以及規格十一提到的「成長順序依賴鏈」（市場需求→定位→產品→品牌→流量→
轉換→留存→系統化）。

### 4. Industry Journey（`industryJourneys.js` + `journeyQuestions.js`）

每個產業的「入口問題」取代通用的 `a4_biggest_problem`
（見 `commonQuestions.js` 的 `supersededByJourney: true` 旗標）。入口的
每個答案會走向完全不同的問題路徑，而不是所有人回答同一套通用題。

目前完整建立了 5 個產業（對應規格二十一的 5 個測試案例）：

| 產業 | 入口問題的 4 條路徑 |
|---|---|
| 餐飲 | 沒客人／客單價低／回流差／太累 |
| 電商 | 廣告不賺錢／商品頁轉換低／回購低／看不懂數據 |
| 顧問 | 靠介紹／報價很累／詢問多不簽約／免費諮詢沒轉換 |
| SaaS | 註冊沒啟用／試用沒付費／流失高／一直做新功能 |
| 尚未創業 | 需求不確定／已經在花錢／沒有第一批客戶／想清楚沒開始 |

每條路徑會**盡量重用**既有的共通題／追問鏈（例如「回流差」直接接
`f1_repurchase` → `fu_repurchase_*`，「廣告不賺錢」直接接
`fu_ads_1..7`），只有既有題庫真的無法驗證該路徑假設時，才在
`journeyQuestions.js` 新增專屬題目（例如餐飲的 Google 評價／IG 追蹤數、
顧問的服務產品化程度）。

其餘 12 個產業目前還是用通用的 `a4_biggest_problem` 入口（它本身其實就是
一個簡化版的 Journey：7 選項分流到 `fu_social_*` / `fu_manyinquiry_*` /
`fu_repurchase_*` / `fu_nodata_1`）。要幫其他產業建一個完整 Journey時，
照著同一個模式：4 個左右互斥的入口選項 → 每個選項接一條路徑（新題目或
重用既有題）→ 在 `paths[]` 寫清楚這條路徑在驗證哪個 Hypothesis。

## Engine 的變化（`engine/questionEngine.js`）

- 基礎題池從單純的 `commonQuestions` 變成
  `commonQuestions ∪ journeyEntryQuestions`（各產業入口問題視為跟
  `a4_biggest_problem` 同層級的基礎題，一樣沒有 `conditions`，純粹靠
  `applicableIndustries` + `priority` 篩選排序）。
- `questionApplies()` 新增一條規則：`q.supersededByJourney &&
  getIndustryJourney(state.industry)` 為真時濾掉——一個通用的、資料驅動的
  規則，不是為每個產業寫 if/else。
- 其餘跳題／追問／回上一步／stage 過濾邏輯完全沒變。

## 目前狀態

已完成：Hypothesis 目錄、Knowledge Base、Diagnostic Rules（15 條，涵蓋
使用者提出的 3 個推理範例 + 原規格 5 個測試案例的預期瓶頸）、5 個產業的
完整 Journey、所有題目補上 `whyAsking` / `hypothesis`、engine 整合驗證
（含瀏覽器端 smoke test）。

**尚未做**（等這輪確認後才進 Phase 3）：`scoringEngine`（把
`DiagnosticRule` 的輸出跟現有的逐題 `scoring` 分數整合）、
`bottleneckEngine`（套用成長順序依賴鏈，決定「主要瓶頸」）、結果頁、
AI 潤飾串接、其餘 12 個產業的專屬 Journey。
