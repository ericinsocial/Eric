/**
 * ===== 共通題庫 =====
 * @typedef {import('../types/diagnosis.js').Question} Question
 *
 * 分成兩個部分：
 *
 * 1. `commonQuestions`：規格七 A～G 類的基礎共通題，`conditions` 為空代表
 *    一定會被問到（questionEngine 仍會依 applicableIndustries／
 *    applicableStages／deprioritizeDimensions 過濾，見 stages.js 註解）。
 *
 * 2. `followUpQuestions`：規格八「動態追問邏輯」給的六組追問範例
 *    （沒有官網／有投廣告／經營社群但沒成效／詢問多成交少／回購率低／
 *    不知道自己的數據），由 commonQuestions 內對應題目的
 *    `followUpQuestionIds` 觸發，questionEngine 會控制每題最多追問一到
 *    三層（見規格八最後一段），避免無限循環。
 *
 * 計分只標示在「答案已經確定時」可以直接歸因的分數。規格十給的八條範例
 * 規則中，有兩條（「有投廣告但沒有轉換追蹤」「社群有高觸及但沒有
 * CTA」）本質上是「父題條件 + 子題答案」的組合——因為子題本身就是被
 * 父題答案觸發才會出現，所以把完整分數放在子題的對應選項上即可，不需要
 * 額外的組合規則。另外兩條（「同時服務五種以上完全不同客群」「完全依賴
 * 熟客介紹」）已經直接設計成單一題目的選項。真正需要「跨兩題」才能判斷
 * 的規則（例如「有穩定回購但沒有會員資料」＝ f1 回購頻率高 AND f2 沒有
 * CRM），無法用單題 scoring 表示，留給 Phase 3 scoringEngine 的
 * combinationRules 處理，並在下方以註解標明。
 *
 * @type {Question[]}
 */
export const commonQuestions = [
  // ===== A. 基本營運 =====
  {
    id: "a1_launched",
    dimension: "market",
    question: "你的產品或服務已經正式開始販售了嗎？",
    answerType: "single",
    whyAsking: "確認事業是否已經正式進入市場，決定後續要驗證需求還是驗證成長瓶頸。",
    hypothesis: "尚未正式販售的使用者，問題核心通常是「需求是否存在」，而不是流量或轉換。",
    options: [
      { value: "yes", label: "是，已經正式販售" },
      { value: "soft", label: "小範圍測試中，還沒正式對外" },
      { value: "no", label: "還沒有，仍在規劃" }
    ],
    scoring: {
      yes: [{ dimension: "market", points: 6, kind: "positiveScore" }],
      soft: [{ dimension: "market", points: 0, kind: "positiveScore" }],
      no: [{ dimension: "market", points: -6, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { no: ["prelaunch_validation"] },
    priority: 1,
    tags: ["launch-status"],
    section: "basic"
  },
  {
    id: "a2_revenue_source",
    dimension: "offer",
    question: "目前主要收入來源是什麼？",
    answerType: "single",
    whyAsking: "了解收入是集中在單一商品，還是分散在很多品項。",
    hypothesis: "收入來源過度分散，代表產品定位或商業模式可能還沒收斂。",
    options: [
      { value: "single", label: "單一主力產品或服務" },
      { value: "few", label: "少數幾項產品或服務平均分攤" },
      { value: "many", label: "很多項產品或服務、來源分散" },
      { value: "unsure", label: "還不確定／尚未有收入" }
    ],
    scoring: {
      single: [{ dimension: "offer", points: 8, kind: "positiveScore" }],
      few: [{ dimension: "offer", points: 4, kind: "positiveScore" }],
      many: [{ dimension: "offer", points: -10, kind: "negativeScore", severity: "medium", insightId: "offer_too_scattered" }],
      unsure: [{ dimension: "offer", points: -4, kind: "negativeScore", severity: "low" }]
    },
    conditions: [{ questionId: "a1_launched", operator: "notEquals", value: "no" }],
    priority: 2,
    tags: ["revenue"],
    section: "basic"
  },
  {
    id: "a3_revenue_trend",
    dimension: "market",
    question: "最近三個月的營收趨勢如何？",
    answerType: "single",
    whyAsking: "確認目前是成長、持平還是下滑，決定診斷要優先找機會還是止血。",
    hypothesis: "營收下滑代表某個環節已經惡化一段時間，需要優先找出變化點，而不是急著擴大投入。",
    options: [
      { value: "growing", label: "持續成長" },
      { value: "flat", label: "大致持平" },
      { value: "declining", label: "下降中" },
      { value: "unsure", label: "還沒有穩定數字可以判斷" }
    ],
    scoring: {
      growing: [{ dimension: "market", points: 10, kind: "positiveScore" }],
      flat: [{ dimension: "market", points: -4, kind: "negativeScore", severity: "low" }],
      declining: [{ dimension: "market", points: -14, kind: "negativeScore", severity: "high", insightId: "risk_revenue_declining" }],
      unsure: [{ dimension: "market", points: -2, kind: "negativeScore", severity: "low" }]
    },
    conditions: [{ questionId: "a1_launched", operator: "notEquals", value: "no" }],
    priority: 3,
    tags: ["revenue", "trend"],
    section: "basic"
  },
  {
    id: "a4_biggest_problem",
    dimension: "system",
    question: "目前最大的經營困難是什麼？",
    description: "先選最主要的一項，後面會依照這題再問得更深入",
    answerType: "single",
    whyAsking: "找出使用者主觀認定最急迫的問題，作為後續追問路徑的入口。",
    hypothesis: "使用者自己感受到的問題，往往只是症狀，真正原因需要透過後續追問才能驗證。",
    // 有專屬 Industry Journey 的產業（見 data/industryJourneys.js）會用自己的
    // entryQuestion 取代這一題——同樣是「入口問題」，但選項與後續路徑是針對
    // 該產業設計的決策樹，而不是通用的七選一。questionEngine 會依這個旗標過濾。
    supersededByJourney: true,
    options: [
      { value: "no_clicks", label: "沒有人點擊／看到" },
      { value: "no_inquiry", label: "有曝光但沒人詢問" },
      { value: "low_close", label: "有詢問但成交率低" },
      { value: "low_repeat", label: "客戶不太回購" },
      { value: "no_tracking", label: "不知道問題出在哪裡（沒有數據）" },
      { value: "capacity", label: "接得住的客戶已經是產能上限" },
      { value: "other", label: "其他" }
    ],
    scoring: {
      no_clicks: [{ dimension: "traffic", points: -8, kind: "negativeScore", severity: "medium" }],
      no_inquiry: [{ dimension: "conversion", points: -8, kind: "negativeScore", severity: "medium" }],
      low_close: [{ dimension: "conversion", points: -10, kind: "negativeScore", severity: "medium" }],
      low_repeat: [{ dimension: "retention", points: -8, kind: "negativeScore", severity: "medium" }],
      no_tracking: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium", insightId: "system_no_visibility" }],
      capacity: [{ dimension: "system", points: 6, kind: "positiveScore" }],
      other: []
    },
    followUpQuestionIds: {
      no_inquiry: ["fu_social_1"],
      low_close: ["fu_manyinquiry_1"],
      low_repeat: ["fu_repurchase_1"],
      no_tracking: ["fu_nodata_1"]
    },
    priority: 4,
    tags: ["pain-point"],
    section: "basic"
  },
  {
    id: "a5_goal_3to6m",
    dimension: "market",
    question: "你希望未來三到六個月達成什麼目標？",
    answerType: "single",
    whyAsking: "了解使用者對成功的定義，讓建議的優先順序符合他真正在意的目標。",
    hypothesis: "目標與目前瓶頸不一致時（例如想擴大規模但連基本轉換都不穩定），代表需要先處理地基問題。",
    options: [
      { value: "more_customers", label: "增加新客戶數" },
      { value: "more_revenue", label: "提高整體營收" },
      { value: "more_repeat", label: "提高回購或續約" },
      { value: "build_system", label: "建立系統、減少人工依賴" },
      { value: "validate", label: "驗證這個產品／服務是否可行" },
      { value: "other", label: "其他" }
    ],
    scoring: { "*": [] },
    priority: 5,
    tags: ["goal"],
    section: "basic"
  },

  // ===== B. 客戶與定位 =====
  {
    id: "b1_describe_customer",
    dimension: "positioning",
    question: "你能否清楚描述最主要的客戶？",
    answerType: "single",
    whyAsking: "驗證使用者是否能具體描述客群，而不是用大家都可以這種模糊答案。",
    hypothesis: "無法具體描述客群，通常是後續內容、廣告、銷售說法都無法聚焦的根本原因（定位問題）。",
    options: [
      { value: "clear", label: "可以，很清楚知道是誰" },
      { value: "rough", label: "大概知道，但不算精確" },
      { value: "no", label: "還說不清楚" }
    ],
    scoring: {
      clear: [{ dimension: "positioning", points: 12, kind: "positiveScore" }],
      rough: [{ dimension: "positioning", points: 2, kind: "positiveScore" }],
      no: [{ dimension: "positioning", points: -14, kind: "negativeScore", severity: "high", insightId: "positioning_unclear" }]
    },
    priority: 10,
    tags: ["customer-clarity"],
    section: "positioning"
  },
  {
    id: "b2_segment_needs",
    dimension: "positioning",
    question: "不同客戶群是否有不同需求？",
    answerType: "single",
    whyAsking: "確認不同客群的需求是否被有意識地區分過。",
    hypothesis: "如果需求沒有被拆分過，代表行銷內容可能是一套說法打天下，轉換效果會被平均拉低。",
    options: [
      { value: "very_different", label: "差異很大，需要分開溝通" },
      { value: "somewhat", label: "有一些差異，但大致相似" },
      { value: "same", label: "基本上是同一種需求" }
    ],
    scoring: {
      very_different: [{ dimension: "positioning", points: -4, kind: "negativeScore", severity: "low" }],
      somewhat: [{ dimension: "positioning", points: 6, kind: "positiveScore" }],
      same: [{ dimension: "positioning", points: 8, kind: "positiveScore" }]
    },
    priority: 11,
    tags: ["customer-clarity"],
    section: "positioning"
  },
  {
    id: "b3_why_chosen",
    dimension: "brand",
    question: "客戶通常因為什麼原因選擇你？",
    answerType: "single",
    whyAsking: "了解客戶選擇的真正理由，判斷是靠品牌信任、價格，還是稀缺性。",
    hypothesis: "如果答案主要是價格，代表品牌信任與差異化尚未建立，一旦有更便宜的選擇就會流失客戶。",
    options: [
      { value: "price", label: "價格" },
      { value: "quality", label: "品質或專業度" },
      { value: "convenience", label: "方便、地點或速度" },
      { value: "relationship", label: "人情或信任關係" },
      { value: "brand", label: "品牌或口碑" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      price: [{ dimension: "brand", points: -6, kind: "negativeScore", severity: "medium", insightId: "brand_price_only" }],
      quality: [{ dimension: "brand", points: 10, kind: "positiveScore" }],
      convenience: [{ dimension: "brand", points: 4, kind: "positiveScore" }],
      relationship: [{ dimension: "brand", points: 2, kind: "positiveScore" }],
      brand: [{ dimension: "brand", points: 12, kind: "positiveScore" }],
      unsure: [{ dimension: "brand", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    priority: 12,
    tags: ["differentiation"],
    section: "positioning"
  },
  {
    id: "b4_understand_fast",
    dimension: "positioning",
    question: "客戶是否能快速理解你的特色？",
    answerType: "single",
    whyAsking: "驗證陌生客戶是否能在幾秒內看懂你在做什麼、適合誰。",
    hypothesis: "陌生客戶看不懂，會直接拉低廣告與內容的轉換率，而且很難用加大流量解決。",
    options: [
      { value: "yes", label: "可以，很快就懂" },
      { value: "sometimes", label: "要解釋一下才懂" },
      { value: "no", label: "常常要花很多時間解釋" }
    ],
    scoring: {
      yes: [{ dimension: "positioning", points: 8, kind: "positiveScore" }],
      sometimes: [{ dimension: "positioning", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "positioning", points: -10, kind: "negativeScore", severity: "medium", insightId: "positioning_hard_to_grasp" }]
    },
    priority: 13,
    tags: ["clarity"],
    section: "positioning"
  },
  {
    id: "b5_differentiation",
    dimension: "brand",
    question: "你和競爭者之間最明顯的差異是什麼？",
    description: "用一兩句話簡單描述即可",
    answerType: "text",
    whyAsking: "讓使用者用自己的話講出差異化，觀察答案是具體優勢還是空泛形容詞。",
    hypothesis: "講不出具體差異，代表市場上可能把你當成一般選項，而不是唯一選擇。",
    textConfig: { maxLength: 140, placeholder: "例如：我們是唯一提供到府維修的品牌" },
    scoring: { "*": [{ dimension: "brand", points: 4, kind: "positiveScore" }] },
    priority: 14,
    tags: ["differentiation", "optional"],
    section: "positioning"
  },
  {
    id: "b6_too_many_segments",
    dimension: "positioning",
    question: "你的品牌是否試圖同時服務太多不同客群？",
    answerType: "single",
    whyAsking: "檢查是否同時服務太多完全不同的客群。",
    hypothesis: "同時服務五種以上不同客群，會讓內容、定價、服務流程都難以統一，是定位分散的直接訊號。",
    options: [
      { value: "focused", label: "沒有，鎖定明確的單一客群" },
      { value: "few", label: "同時服務二到三種還算相關的客群" },
      { value: "scattered", label: "同時服務五種以上完全不同的客群" }
    ],
    scoring: {
      focused: [{ dimension: "positioning", points: 8, kind: "positiveScore" }],
      few: [{ dimension: "positioning", points: -2, kind: "negativeScore", severity: "low" }],
      scattered: [{ dimension: "positioning", points: -15, kind: "negativeScore", severity: "high", insightId: "positioning_too_scattered" }]
    },
    priority: 15,
    tags: ["customer-clarity"],
    section: "positioning"
  },

  // ===== C. 產品與方案 =====
  {
    id: "c1_product_count",
    dimension: "offer",
    question: "你目前有幾種主要產品或服務？",
    answerType: "number",
    whyAsking: "了解目前商品或服務的數量規模，判斷是否過於複雜。",
    hypothesis: "品項數量會影響客戶決策難度與內部管理複雜度，是產品階梯是否清楚的前置資訊。",
    numberConfig: { min: 0, max: 200, unit: "種" },
    scoring: { "*": [] },
    priority: 20,
    tags: ["offer-count"],
    section: "positioning"
  },
  {
    id: "c3_offer_ladder",
    dimension: "offer",
    question: "是否有明確的入門、核心與高價方案？",
    answerType: "single",
    whyAsking: "確認是否有從入門到進階的產品階梯。",
    hypothesis: "沒有產品階梯，客戶消費完一次後沒有自然的下一步，客單價與終身價值容易卡住。",
    options: [
      { value: "yes", label: "有，三個層級都清楚" },
      { value: "partial", label: "有一部分，但不完整" },
      { value: "no", label: "沒有，只有單一價格或方案" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 12, kind: "positiveScore" }],
      partial: [{ dimension: "offer", points: 2, kind: "positiveScore" }],
      no: [{ dimension: "offer", points: -8, kind: "negativeScore", severity: "medium", insightId: "offer_no_ladder" }]
    },
    priority: 21,
    tags: ["offer-ladder"],
    section: "positioning"
  },
  {
    id: "c4_price_too_high",
    dimension: "offer",
    question: "客戶是否常覺得價格太高？",
    answerType: "single",
    whyAsking: "了解客戶對價格的常見反應。",
    hypothesis: "如果客戶常覺得貴，問題通常不在價格本身，而在價值有沒有被說清楚（價值缺口）。",
    options: [
      { value: "often", label: "常常聽到這個反應" },
      { value: "sometimes", label: "偶爾會" },
      { value: "rarely", label: "很少" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      often: [{ dimension: "offer", points: -10, kind: "negativeScore", severity: "medium", insightId: "offer_value_gap" }],
      sometimes: [{ dimension: "offer", points: -2, kind: "negativeScore", severity: "low" }],
      rarely: [{ dimension: "offer", points: 8, kind: "positiveScore" }],
      unsure: [{ dimension: "offer", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 22,
    tags: ["pricing"],
    section: "positioning"
  },
  {
    id: "c5_choice_clarity",
    dimension: "offer",
    question: "客戶是否知道不同方案該如何選擇？",
    answerType: "single",
    whyAsking: "驗證客戶能否自己判斷該選哪個方案。",
    hypothesis: "選擇困難會直接造成決策拖延甚至放棄，是轉換流程的隱形摩擦。",
    options: [
      { value: "yes", label: "清楚，很少需要協助判斷" },
      { value: "confused", label: "常常需要我們協助判斷" },
      { value: "only_one", label: "目前只有一個選項，沒有選擇問題" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 8, kind: "positiveScore" }],
      confused: [{ dimension: "offer", points: -8, kind: "negativeScore", severity: "medium" }],
      only_one: [{ dimension: "offer", points: 0, kind: "positiveScore" }]
    },
    priority: 23,
    tags: ["offer-clarity"],
    section: "positioning"
  },
  {
    id: "c6_flagship_product",
    dimension: "offer",
    question: "你是否有一個容易理解的主打商品？",
    answerType: "single",
    whyAsking: "確認是否有一個容易介紹、容易記住的主打商品。",
    hypothesis: "沒有明確主打商品，廣告與內容很難聚焦，也會拉長客戶的理解與決策時間。",
    options: [
      { value: "yes", label: "有，一眼就知道主打什麼" },
      { value: "no", label: "沒有明確主打" },
      { value: "too_many", label: "主打太多項，反而不聚焦" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 10, kind: "positiveScore" }],
      no: [{ dimension: "offer", points: -8, kind: "negativeScore", severity: "medium" }],
      too_many: [{ dimension: "offer", points: -10, kind: "negativeScore", severity: "medium", insightId: "offer_too_scattered" }]
    },
    priority: 24,
    tags: ["offer-clarity"],
    section: "positioning"
  },

  // ===== D. 流量與曝光 =====
  {
    id: "d1_traffic_source",
    dimension: "traffic",
    question: "客戶目前主要從哪裡知道你？",
    description: "可複選",
    answerType: "multi",
    whyAsking: "了解客戶認識你的管道組合。",
    hypothesis: "這是後續判斷流量資產是自己擁有、還是完全依賴他人平台的基礎資料。",
    options: [
      { value: "search", label: "搜尋（Google／地圖）" },
      { value: "social", label: "社群平台" },
      { value: "referral", label: "熟客或朋友介紹" },
      { value: "ads", label: "廣告投放" },
      { value: "platform", label: "第三方平台（外送、電商平台等）" },
      { value: "walkin", label: "路過或自然來客" },
      { value: "other", label: "其他" }
    ],
    scoring: {
      search: [{ dimension: "traffic", points: 6, kind: "positiveScore" }],
      social: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      referral: [{ dimension: "brand", points: 3, kind: "positiveScore" }],
      ads: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      platform: [{ dimension: "traffic", points: 2, kind: "positiveScore" }],
      walkin: [{ dimension: "traffic", points: 2, kind: "positiveScore" }],
      other: []
    },
    priority: 30,
    tags: ["traffic-source"],
    section: "marketing"
  },
  {
    id: "d2_best_channel",
    dimension: "traffic",
    question: "哪一個渠道帶來最多有效客戶？",
    answerType: "single",
    whyAsking: "找出真正帶來有效客戶的渠道，而不是曝光量最大的渠道。",
    hypothesis: "知道主要有效渠道，代表已經具備基本的流量歸因意識，是數據成熟度的正向訊號。",
    options: [
      { value: "search", label: "搜尋（Google／地圖）" },
      { value: "social", label: "社群平台" },
      { value: "referral", label: "熟客或朋友介紹" },
      { value: "ads", label: "廣告投放" },
      { value: "platform", label: "第三方平台" },
      { value: "unsure", label: "不知道／沒有追蹤" }
    ],
    scoring: {
      search: [{ dimension: "traffic", points: 8, kind: "positiveScore" }, { dimension: "system", points: 4, kind: "positiveScore" }],
      social: [{ dimension: "traffic", points: 8, kind: "positiveScore" }, { dimension: "system", points: 4, kind: "positiveScore" }],
      referral: [{ dimension: "traffic", points: 8, kind: "positiveScore" }, { dimension: "system", points: 4, kind: "positiveScore" }],
      ads: [{ dimension: "traffic", points: 8, kind: "positiveScore" }, { dimension: "system", points: 4, kind: "positiveScore" }],
      platform: [{ dimension: "traffic", points: 8, kind: "positiveScore" }, { dimension: "system", points: 4, kind: "positiveScore" }],
      unsure: [{ dimension: "system", points: -10, kind: "negativeScore", severity: "medium", insightId: "system_no_visibility" }]
    },
    followUpQuestionIds: { referral: ["fu_referral_1"] },
    priority: 31,
    tags: ["traffic-source"],
    section: "marketing"
  },
  {
    id: "d3_organic_traffic",
    dimension: "traffic",
    question: "你目前是否有穩定的自然流量？",
    answerType: "single",
    whyAsking: "確認是否有不靠付費就能持續進來的流量。",
    hypothesis: "完全沒有自然流量，代表業績成長高度綁定持續的廣告花費，缺乏長期複利。",
    options: [
      { value: "yes", label: "有，不投廣告也有人上門" },
      { value: "somewhat", label: "偶爾有，不太穩定" },
      { value: "no", label: "幾乎沒有" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: 12, kind: "positiveScore" }],
      somewhat: [{ dimension: "traffic", points: 2, kind: "positiveScore" }],
      no: [{ dimension: "traffic", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    priority: 32,
    tags: ["organic"],
    section: "marketing"
  },
  {
    id: "d4_running_ads",
    dimension: "traffic",
    question: "是否正在投放廣告？",
    answerType: "single",
    whyAsking: "作為進入廣告相關追問鏈的觸發點。",
    hypothesis: "是否投放廣告，決定後續要驗證的是廣告效率問題，還是沒有廣告預算的問題。",
    options: [
      { value: "yes", label: "有，目前正在投放" },
      { value: "used_to", label: "以前投過，現在沒有" },
      { value: "no", label: "沒有投過廣告" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      used_to: [],
      no: []
    },
    followUpQuestionIds: { yes: ["fu_ads_1"], used_to: ["fu_ads_1"] },
    priority: 33,
    tags: ["ads"],
    section: "marketing"
  },
  {
    id: "d5_social_media",
    dimension: "traffic",
    question: "是否經營社群？",
    answerType: "single",
    whyAsking: "確認是否經營社群，作為進入社群成效追問鏈的觸發點。",
    hypothesis: "經營社群但沒有成效，通常不是內容不夠，而是流量到互動之間缺乏轉換設計。",
    options: [
      { value: "active", label: "有，持續經營中" },
      { value: "inactive", label: "有帳號，但很少更新" },
      { value: "no", label: "沒有經營" }
    ],
    scoring: {
      active: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      inactive: [{ dimension: "traffic", points: -6, kind: "negativeScore", severity: "low" }],
      no: []
    },
    priority: 34,
    tags: ["social"],
    section: "marketing"
  },
  {
    id: "d6_website",
    dimension: "traffic",
    question: "是否有官網或 Landing Page？",
    answerType: "single",
    whyAsking: "驗證目前是否擁有自己的流量資產，而不是完全依賴第三方平台。",
    hypothesis: "沒有官網代表所有客戶關係都建立在平台規則之上，長期會限制你能做的行銷動作與資料掌握度。",
    options: [
      { value: "both", label: "有官網，也有針對活動的 Landing Page" },
      { value: "website_only", label: "只有官網" },
      { value: "social_only", label: "沒有網站，只有社群或平台頁面" }
    ],
    scoring: {
      both: [{ dimension: "traffic", points: 10, kind: "positiveScore" }],
      website_only: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      social_only: [{ dimension: "traffic", points: -8, kind: "negativeScore", severity: "medium", insightId: "traffic_no_website" }]
    },
    followUpQuestionIds: { social_only: ["fu_nowebsite_1"] },
    priority: 35,
    tags: ["website"],
    section: "marketing"
  },
  {
    id: "d7_channel_tracking",
    dimension: "system",
    question: "是否能追蹤不同渠道的成效？",
    answerType: "single",
    whyAsking: "確認是否能分辨不同渠道各自的成效。",
    hypothesis: "無法追蹤渠道成效，代表任何加碼或砍預算的決定都只能憑感覺。",
    options: [
      { value: "yes", label: "可以，每個渠道成效都很清楚" },
      { value: "partial", label: "只知道大概，沒有精確數字" },
      { value: "no", label: "完全無法追蹤" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 10, kind: "positiveScore" }],
      partial: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium", insightId: "system_no_visibility" }]
    },
    priority: 36,
    tags: ["tracking"],
    section: "marketing"
  },
  {
    id: "d8_platform_concentration",
    dimension: "traffic",
    question: "流量是否過度集中在單一平台？",
    answerType: "single",
    whyAsking: "檢查曝光與名單來源是否集中在單一平台。",
    hypothesis: "高度集中在單一平台，一旦該平台規則改變、觸及下降，業績會直接被影響（平台依賴風險）。",
    options: [
      { value: "yes", label: "是，幾乎都靠同一個平台" },
      { value: "somewhat", label: "有一點集中，但還有其他來源" },
      { value: "no", label: "來源算分散" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: -10, kind: "negativeScore", severity: "medium", insightId: "risk_platform_dependency" }],
      somewhat: [{ dimension: "traffic", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "traffic", points: 6, kind: "positiveScore" }]
    },
    priority: 37,
    tags: ["platform-risk"],
    section: "marketing"
  },

  // ===== E. 轉換與成交 =====
  {
    id: "e1_contact_method",
    dimension: "conversion",
    question: "潛在客戶通常透過什麼方式聯絡或購買？",
    answerType: "single",
    whyAsking: "了解客戶完成聯絡或購買的實際路徑。",
    hypothesis: "聯絡或購買路徑越複雜，中途流失的機會就越大，是轉換流程摩擦的第一層線索。",
    options: [
      { value: "line", label: "LINE" },
      { value: "phone", label: "電話" },
      { value: "form", label: "表單" },
      { value: "instore", label: "直接到店／現場" },
      { value: "dm", label: "私訊或留言" },
      { value: "checkout", label: "線上直接下單" },
      { value: "other", label: "其他" }
    ],
    scoring: { "*": [] },
    priority: 40,
    tags: ["contact-method"],
    section: "marketing"
  },
  {
    id: "e2_inquiry_to_close",
    dimension: "conversion",
    question: "從詢問到成交的比例大約是多少？",
    answerType: "single",
    whyAsking: "量化詢問到成交的實際轉換率，而不是單純問成交好不好。",
    hypothesis: "如果流量與詢問量都足夠、但這個比例偏低，代表問題出在銷售流程，而不是流量不夠。",
    options: [
      { value: "lt10", label: "10 位詢問，成交不到 1 位" },
      { value: "10to30", label: "10 位詢問，成交約 1～3 位" },
      { value: "30to50", label: "10 位詢問，成交約 3～5 位" },
      { value: "gt50", label: "10 位詢問，成交超過 5 位" },
      { value: "unsure", label: "沒有特別統計過" }
    ],
    scoring: {
      lt10: [{ dimension: "traffic", points: 5, kind: "positiveScore" }, { dimension: "conversion", points: -20, kind: "negativeScore", severity: "high", insightId: "conversion_low_close_rate" }],
      "10to30": [{ dimension: "conversion", points: -8, kind: "negativeScore", severity: "medium" }],
      "30to50": [{ dimension: "conversion", points: 8, kind: "positiveScore" }],
      gt50: [{ dimension: "conversion", points: 14, kind: "positiveScore" }],
      unsure: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { lt10: ["fu_manyinquiry_1"], "10to30": ["fu_manyinquiry_1"] },
    priority: 41,
    tags: ["conversion-rate"],
    section: "marketing"
  },
  {
    id: "e3_dropoff_stage",
    dimension: "conversion",
    question: "客戶最常在哪一個階段離開？",
    answerType: "single",
    whyAsking: "定位客戶實際卡住、離開的環節。",
    hypothesis: "找到明確的流失階段，才能把資源投入在真正需要修的地方，而不是整體加大曝光。",
    options: [
      { value: "before_contact", label: "看到資訊後就沒有進一步聯絡" },
      { value: "after_price", label: "問到價格後就沒下文" },
      { value: "after_consult", label: "聊過或諮詢後沒有成交" },
      { value: "after_trial", label: "體驗或試用後沒有續買" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      before_contact: [{ dimension: "conversion", points: -10, kind: "negativeScore", severity: "medium" }],
      after_price: [{ dimension: "offer", points: -10, kind: "negativeScore", severity: "medium", insightId: "offer_value_gap" }],
      after_consult: [{ dimension: "conversion", points: -12, kind: "negativeScore", severity: "medium" }],
      after_trial: [{ dimension: "retention", points: -10, kind: "negativeScore", severity: "medium" }],
      unsure: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "low" }]
    },
    priority: 42,
    tags: ["dropoff"],
    section: "marketing"
  },
  {
    id: "e4_clear_cta",
    dimension: "conversion",
    question: "是否有清楚的 CTA（下一步行動呼籲）？",
    answerType: "single",
    whyAsking: "確認流量或內容是否有明確引導下一步的行動呼籲。",
    hypothesis: "沒有清楚 CTA，等於把已經願意注意你的人留在原地，是轉換率偏低的常見隱藏原因。",
    options: [
      { value: "yes", label: "有，客戶清楚知道該怎麼做" },
      { value: "somewhat", label: "有，但不夠明顯" },
      { value: "no", label: "沒有明確的下一步" }
    ],
    scoring: {
      yes: [{ dimension: "conversion", points: 10, kind: "positiveScore" }],
      somewhat: [{ dimension: "conversion", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "conversion", points: -12, kind: "negativeScore", severity: "medium", insightId: "conversion_no_cta" }]
    },
    priority: 43,
    tags: ["cta"],
    section: "marketing"
  },
  {
    id: "e5_sales_process",
    dimension: "conversion",
    question: "是否有標準銷售流程？",
    answerType: "single",
    whyAsking: "確認銷售流程是否標準化，還是每次都臨場發揮。",
    hypothesis: "沒有標準銷售流程，成交率會高度依賴當下狀態與人員經驗，難以穩定複製。",
    options: [
      { value: "yes", label: "有，流程清楚一致" },
      { value: "informal", label: "大致有，但每次都不太一樣" },
      { value: "no", label: "沒有固定流程" }
    ],
    scoring: {
      yes: [{ dimension: "conversion", points: 10, kind: "positiveScore" }, { dimension: "system", points: 6, kind: "positiveScore" }],
      informal: [{ dimension: "conversion", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "conversion", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    priority: 44,
    tags: ["sales-process"],
    section: "marketing"
  },
  {
    id: "e6_objection_handling",
    dimension: "conversion",
    question: "是否有處理常見疑慮的內容？",
    answerType: "single",
    whyAsking: "確認是否有事先處理常見疑慮的內容或話術。",
    hypothesis: "沒有處理常見疑慮，客戶的猶豫會停留在詢問階段，無法順利推進到成交。",
    options: [
      { value: "yes", label: "有，常見問題都準備好了" },
      { value: "some", label: "有一部分" },
      { value: "no", label: "沒有，都是臨場回答" }
    ],
    scoring: {
      yes: [{ dimension: "conversion", points: 8, kind: "positiveScore" }],
      some: [{ dimension: "conversion", points: 0, kind: "positiveScore" }],
      no: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "low" }]
    },
    priority: 45,
    tags: ["objection-handling"],
    section: "marketing"
  },
  {
    id: "e7_social_proof",
    dimension: "brand",
    question: "是否有案例、評價或成果證明？",
    answerType: "single",
    whyAsking: "確認是否有能讓陌生客戶快速信任的證明素材。",
    hypothesis: "缺乏案例、評價、實績，會拉長決策時間、降低轉換率，尤其對高單價或高風險決策更明顯。",
    options: [
      { value: "strong", label: "有，而且很有說服力" },
      { value: "some", label: "有一些，但不夠完整" },
      { value: "no", label: "幾乎沒有" }
    ],
    scoring: {
      strong: [{ dimension: "brand", points: 12, kind: "positiveScore" }],
      some: [{ dimension: "brand", points: 2, kind: "positiveScore" }],
      no: [{ dimension: "brand", points: -10, kind: "negativeScore", severity: "medium", insightId: "brand_no_proof" }]
    },
    priority: 46,
    tags: ["social-proof"],
    section: "marketing"
  },
  {
    id: "e8_lead_followup",
    dimension: "conversion",
    question: "是否會追蹤未立即成交的潛在客戶？",
    answerType: "single",
    whyAsking: "確認是否有機制持續跟進沒有立即成交的名單。",
    hypothesis: "沒有追蹤未成交名單，代表這些已經花成本取得的潛在客戶正在被動流失。",
    options: [
      { value: "systematic", label: "有系統性的追蹤機制" },
      { value: "sometimes", label: "偶爾會，看心情或狀況" },
      { value: "no", label: "沒有，沒回覆就算了" }
    ],
    scoring: {
      systematic: [{ dimension: "conversion", points: 12, kind: "positiveScore" }, { dimension: "system", points: 6, kind: "positiveScore" }],
      sometimes: [{ dimension: "conversion", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "conversion", points: -12, kind: "negativeScore", severity: "medium" }]
    },
    priority: 47,
    tags: ["lead-followup"],
    section: "marketing"
  },

  // ===== F. 留存與回購 =====
  {
    id: "f1_repurchase",
    dimension: "retention",
    question: "客戶是否會再次購買？",
    answerType: "single",
    whyAsking: "了解客戶是否會回購，作為進入回購率偏低追問鏈的觸發點。",
    hypothesis: "回購率低代表獲客成本必須不斷靠新客戶攤提，成長速度會比同業更辛苦。",
    options: [
      { value: "often", label: "常常，回購是主要營收來源" },
      { value: "sometimes", label: "偶爾會" },
      { value: "rarely", label: "很少" },
      { value: "not_applicable", label: "產品性質上本來就是一次性" },
      { value: "unsure", label: "還沒有足夠時間判斷" }
    ],
    scoring: {
      often: [{ dimension: "retention", points: 14, kind: "positiveScore" }],
      sometimes: [{ dimension: "retention", points: 2, kind: "positiveScore" }],
      rarely: [{ dimension: "retention", points: -14, kind: "negativeScore", severity: "high", insightId: "retention_low_repurchase" }],
      not_applicable: [],
      unsure: [{ dimension: "retention", points: -2, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { rarely: ["fu_repurchase_1"] },
    priority: 50,
    tags: ["repurchase"],
    section: "marketing"
  },
  {
    id: "f2_crm",
    dimension: "system",
    question: "是否有會員、名單或 CRM 系統？",
    answerType: "single",
    whyAsking: "確認是否有系統化保存客戶資料。",
    hypothesis: "沒有 CRM 或名單系統，就算想做回購喚回或會員經營，也缺乏可以執行的名單基礎。",
    options: [
      { value: "yes", label: "有，客戶資料集中管理" },
      { value: "basic", label: "有基本的名單，但沒有系統" },
      { value: "no", label: "沒有保存客戶資料" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 12, kind: "positiveScore" }],
      basic: [{ dimension: "system", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium", insightId: "system_no_crm" }]
    },
    priority: 51,
    tags: ["crm"],
    section: "marketing"
  },
  {
    id: "f3_recontact_old_customers",
    dimension: "retention",
    question: "是否有定期聯繫舊客戶？",
    answerType: "single",
    whyAsking: "確認是否有主動、定期地聯繫舊客戶。",
    hypothesis: "沒有定期聯繫，回購與否完全交給客戶自己記得，會讓原本可以累積的回購白白流失。",
    options: [
      { value: "yes", label: "有固定的聯繫節奏" },
      { value: "occasionally", label: "想到才聯繫" },
      { value: "no", label: "沒有主動聯繫" }
    ],
    scoring: {
      yes: [{ dimension: "retention", points: 10, kind: "positiveScore" }],
      occasionally: [{ dimension: "retention", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "retention", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    priority: 52,
    tags: ["reactivation"],
    section: "marketing"
  },
  {
    id: "f4_know_churn_reason",
    dimension: "retention",
    question: "是否知道客戶不再回購的原因？",
    answerType: "single",
    whyAsking: "確認是否清楚知道客戶不再回購的具體原因。",
    hypothesis: "不知道流失原因，代表任何留客動作都只能亂槍打鳥，無法對症下藥。",
    options: [
      { value: "yes", label: "清楚知道主要原因" },
      { value: "guess", label: "大概猜得到，沒有驗證過" },
      { value: "no", label: "完全不知道" }
    ],
    scoring: {
      yes: [{ dimension: "retention", points: 8, kind: "positiveScore" }],
      guess: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    priority: 53,
    tags: ["churn"],
    section: "marketing"
  },
  {
    id: "f5_referral_program",
    dimension: "retention",
    question: "是否有推薦或轉介紹機制？",
    answerType: "single",
    whyAsking: "確認是否有機制鼓勵、追蹤轉介紹。",
    hypothesis: "沒有機制的轉介紹是隨機且不可控的，無法規模化成穩定的客戶來源。",
    options: [
      { value: "structured", label: "有明確機制（例如推薦禮）" },
      { value: "informal", label: "客戶會自然推薦，但沒有機制" },
      { value: "no", label: "沒有，也很少被推薦" }
    ],
    scoring: {
      structured: [{ dimension: "retention", points: 10, kind: "positiveScore" }],
      informal: [{ dimension: "brand", points: 6, kind: "positiveScore" }],
      no: [{ dimension: "retention", points: -6, kind: "negativeScore", severity: "low" }]
    },
    priority: 54,
    tags: ["referral"],
    section: "marketing"
  },
  {
    id: "f6_repeat_revenue_share",
    dimension: "retention",
    question: "舊客戶營收占比大約多少？",
    answerType: "single",
    whyAsking: "量化舊客戶對營收的實際貢獻比例。",
    hypothesis: "舊客戶占比極端偏高或偏低，都指向不同的風險：偏低代表回購機制薄弱，偏高代表新客開發可能停滯。",
    options: [
      { value: "gt50", label: "超過一半" },
      { value: "20to50", label: "約兩到五成" },
      { value: "lt20", label: "不到兩成" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      gt50: [{ dimension: "retention", points: 12, kind: "positiveScore" }],
      "20to50": [{ dimension: "retention", points: 4, kind: "positiveScore" }],
      lt20: [{ dimension: "retention", points: -8, kind: "negativeScore", severity: "medium" }],
      unsure: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "low" }]
    },
    priority: 55,
    tags: ["repeat-revenue"],
    section: "marketing"
  },
  {
    id: "f7_longterm_offer",
    dimension: "retention",
    question: "是否有設計長期服務或訂閱方案？",
    answerType: "single",
    whyAsking: "確認是否有設計鼓勵長期關係的方案。",
    hypothesis: "沒有長期方案，客戶關係容易停在單次交易，難以累積終身價值。",
    options: [
      { value: "yes", label: "有" },
      { value: "considering", label: "正在考慮" },
      { value: "no", label: "沒有" }
    ],
    scoring: {
      yes: [{ dimension: "retention", points: 8, kind: "positiveScore" }],
      considering: [],
      no: [{ dimension: "retention", points: -2, kind: "negativeScore", severity: "low" }]
    },
    priority: 56,
    tags: ["subscription-offer"],
    section: "marketing"
  },

  // ===== G. 數據與系統 =====
  {
    id: "g1_analytics_setup",
    dimension: "system",
    question: "是否有設定 GA4 或其他數據追蹤工具？",
    answerType: "single",
    whyAsking: "確認是否有基本的數據追蹤工具。",
    hypothesis: "沒有設定追蹤工具，代表接下來所有流量夠不夠、轉換好不好的判斷都缺乏事實依據。",
    options: [
      { value: "yes", label: "有設定" },
      { value: "no", label: "沒有設定" },
      { value: "unsure", label: "不確定是否有設定" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 12, kind: "positiveScore" }],
      no: [{ dimension: "system", points: -10, kind: "negativeScore", severity: "medium" }],
      unsure: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium", insightId: "system_no_visibility" }]
    },
    followUpQuestionIds: { no: ["fu_nodata_1"], unsure: ["fu_nodata_1"] },
    priority: 60,
    tags: ["analytics"],
    section: "marketing"
  },
  {
    id: "g2_review_data_regularly",
    dimension: "system",
    question: "是否定期查看行銷數據？",
    answerType: "single",
    whyAsking: "確認就算有工具，是否真的有定期查看。",
    hypothesis: "裝了追蹤工具但不看數據，效果等同於沒有數據，決策仍然是憑感覺。",
    options: [
      { value: "yes", label: "有固定頻率查看" },
      { value: "occasionally", label: "偶爾看一下" },
      { value: "no", label: "幾乎不看" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      occasionally: [{ dimension: "system", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    priority: 61,
    tags: ["data-review"],
    section: "marketing"
  },
  {
    id: "g3_know_cac",
    dimension: "system",
    question: "是否知道每一位客戶的取得成本？",
    answerType: "single",
    whyAsking: "確認是否知道單一客戶的實際取得成本。",
    hypothesis: "不知道 CAC，就無法判斷目前的廣告或行銷投入究竟划不划算。",
    options: [
      { value: "yes", label: "清楚知道" },
      { value: "rough", label: "大概抓得出來" },
      { value: "no", label: "完全不知道" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 10, kind: "positiveScore" }],
      rough: [{ dimension: "system", points: 0, kind: "positiveScore" }],
      no: [{ dimension: "system", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    priority: 62,
    tags: ["cac"],
    section: "marketing"
  },
  {
    id: "g4_know_margin",
    dimension: "system",
    question: "是否知道每一個產品的毛利？",
    answerType: "single",
    whyAsking: "確認是否知道每個產品的實際毛利。",
    hypothesis: "不知道毛利，就算業績成長，也可能是在賠錢衝量而不自知。",
    options: [
      { value: "yes", label: "清楚知道" },
      { value: "some", label: "知道一部分" },
      { value: "no", label: "不清楚" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      some: [{ dimension: "system", points: 0, kind: "positiveScore" }],
      no: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "low" }]
    },
    priority: 63,
    tags: ["margin"],
    section: "marketing"
  },
  {
    id: "g5_track_inquiry_source",
    dimension: "system",
    question: "是否有紀錄每一筆詢問的來源？",
    answerType: "single",
    whyAsking: "確認每一筆詢問是否有紀錄來源。",
    hypothesis: "沒有紀錄詢問來源，就無法把成交歸因回正確的渠道，行銷預算分配會失準。",
    options: [
      { value: "yes", label: "有紀錄" },
      { value: "partial", label: "偶爾記錄" },
      { value: "no", label: "沒有紀錄" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      partial: [{ dimension: "system", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    priority: 64,
    tags: ["lead-source-tracking"],
    section: "marketing"
  },
  {
    id: "g6_automation",
    dimension: "system",
    question: "是否有使用自動化工具？",
    description: "例如自動回覆、排程貼文、自動化 Email 或 LINE 訊息",
    answerType: "single",
    whyAsking: "確認是否有使用自動化工具處理重複性行銷或客服工作。",
    hypothesis: "完全依賴人工處理，會限制成長規模，也容易因為忙碌而漏接客戶。",
    options: [
      { value: "yes", label: "有使用" },
      { value: "some", label: "用一點點" },
      { value: "no", label: "沒有使用" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      some: [{ dimension: "system", points: 0, kind: "positiveScore" }],
      no: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 65,
    tags: ["automation"],
    section: "marketing"
  },
  {
    id: "g7_single_person_dependency",
    dimension: "system",
    question: "行銷工作是否高度依賴某一個人？",
    answerType: "single",
    whyAsking: "確認行銷或業務是否高度依賴單一個人。",
    hypothesis: "過度依賴單一人力，一旦這個人時間被占滿或離開，成長會直接卡在產能上限（關鍵人力風險）。",
    options: [
      { value: "yes", label: "是，幾乎都靠一個人" },
      { value: "somewhat", label: "主要靠一人，但有其他人支援" },
      { value: "no", label: "已經有團隊分工" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium", insightId: "system_key_person_risk" }],
      somewhat: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: 10, kind: "positiveScore" }]
    },
    priority: 66,
    tags: ["team-dependency"],
    section: "marketing"
  },
  {
    id: "g8_standard_process",
    dimension: "system",
    question: "是否有標準流程或可複製的作業方式？",
    answerType: "single",
    whyAsking: "確認是否有標準化、可複製的作業方式。",
    hypothesis: "沒有標準流程，品質與效率會隨執行的人不同而大幅波動，難以規模化。",
    options: [
      { value: "yes", label: "有，新人也能照著做" },
      { value: "informal", label: "有慣例，但沒有寫下來" },
      { value: "no", label: "每次都靠臨場反應" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 12, kind: "positiveScore" }],
      informal: [{ dimension: "system", points: -2, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    priority: 67,
    tags: ["sop"],
    section: "marketing"
  }
];

/**
 * ===== 動態追問題庫（規格八）=====
 * 由 commonQuestions／industryQuestions 內對應題目的 followUpQuestionIds
 * 觸發，每組最多三層。id 前綴 fu_ 代表 follow-up。
 * @type {Question[]}
 */
export const followUpQuestions = [
  // --- 尚未創業：需求驗證（呼應規格九-16 與案例 E）---
  {
    id: "prelaunch_validation",
    dimension: "market",
    question: "目前是否已經和潛在客戶聊過、驗證這個需求真的存在？",
    answerType: "single",
    whyAsking: "在還沒有正式開始之前，確認需求是否已經被真實客戶驗證過，而不是自己假設出來的。",
    hypothesis: "沒有和真實客戶對話驗證過，代表接下來的品牌、網站、廣告投入都建立在未驗證的假設上，風險遠高於想像。",
    options: [
      { value: "yes", label: "有，已經訪談或試賣過" },
      { value: "no", label: "還沒有，先在準備品牌或產品" }
    ],
    scoring: {
      yes: [{ dimension: "market", points: 10, kind: "positiveScore" }],
      no: [{ dimension: "market", points: -12, kind: "negativeScore", severity: "high", insightId: "market_unvalidated" }]
    },
    followUpQuestionIds: { no: ["prelaunch_spending"] },
    priority: 100,
    tags: ["prelaunch", "validation"],
    applicableStages: ["idea", "preparing"],
    section: "basic"
  },
  {
    id: "prelaunch_spending",
    dimension: "system",
    question: "目前主要把時間或預算花在哪裡？",
    answerType: "single",
    whyAsking: "了解籌備期的資源實際花在哪裡。",
    hypothesis: "如果資源優先花在品牌識別、網站等看起來像正式營業的項目，而不是驗證需求，代表順序可能顛倒了。",
    options: [
      { value: "branding", label: "品牌識別、Logo、網站" },
      { value: "product_dev", label: "產品或服務本身的開發" },
      { value: "customer_talk", label: "找潛在客戶聊需求" },
      { value: "ads_plan", label: "規劃廣告或行銷" }
    ],
    scoring: {
      branding: [{ dimension: "market", points: -10, kind: "negativeScore", severity: "medium", insightId: "prelaunch_premature_branding" }],
      product_dev: [{ dimension: "market", points: -4, kind: "negativeScore", severity: "low" }],
      customer_talk: [{ dimension: "market", points: 10, kind: "positiveScore" }],
      ads_plan: [{ dimension: "market", points: -10, kind: "negativeScore", severity: "medium", insightId: "prelaunch_premature_ads" }]
    },
    priority: 101,
    tags: ["prelaunch"],
    applicableStages: ["idea", "preparing"],
    section: "basic"
  },

  // --- 沒有官網（規格八第一組）---
  {
    id: "fu_nowebsite_1",
    dimension: "traffic",
    question: "客戶目前主要透過哪裡了解你？",
    answerType: "single",
    whyAsking: "沒有官網的情況下，確認客戶實際認識你的管道。",
    hypothesis: "如果客戶完全透過單一第三方平台認識你，代表流量資產與客戶關係完全不在自己手上。",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "line", label: "LINE 官方帳號" },
      { value: "platform_page", label: "外送／電商等平台頁面" },
      { value: "other", label: "其他" }
    ],
    scoring: { "*": [] },
    followUpQuestionIds: { instagram: ["fu_nowebsite_2"], facebook: ["fu_nowebsite_2"], line: ["fu_nowebsite_2"], platform_page: ["fu_nowebsite_2"] },
    priority: 200,
    tags: ["no-website"],
    section: "marketing"
  },
  {
    id: "fu_nowebsite_2",
    dimension: "traffic",
    question: "是否曾因為平台限制（例如帳號被停用、觸及下降）而無法接觸既有客戶？",
    answerType: "single",
    whyAsking: "確認平台依賴是否已經造成實際傷害，而不只是理論風險。",
    hypothesis: "曾經因為平台限制而無法觸及既有客戶，代表這個風險已經不是假設，而是正在發生的問題。",
    options: [
      { value: "yes", label: "有發生過，造成明顯影響" },
      { value: "no", label: "沒有遇過" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: -14, kind: "negativeScore", severity: "high", insightId: "risk_platform_dependency" }],
      no: [],
      unsure: []
    },
    followUpQuestionIds: { yes: ["fu_nowebsite_3"] },
    priority: 201,
    tags: ["no-website", "platform-risk"],
    section: "marketing"
  },
  {
    id: "fu_nowebsite_3",
    dimension: "traffic",
    question: "是否有建立官網的打算？",
    answerType: "single",
    whyAsking: "了解使用者對建立官網這件事的意願與優先順序。",
    hypothesis: "如果沒有建立官網的打算，代表這個風險目前還沒有被使用者放進行動計畫裡，需要在結果頁明確點出來。",
    options: [
      { value: "yes", label: "有考慮" },
      { value: "no", label: "目前沒有計畫" },
      { value: "unsure", label: "還沒想過" }
    ],
    scoring: { "*": [] },
    priority: 202,
    tags: ["no-website"],
    section: "marketing"
  },

  // --- 有投放廣告（規格八第二組）---
  {
    id: "fu_ads_1",
    dimension: "traffic",
    question: "主要使用哪些廣告平台？",
    description: "可複選",
    answerType: "multi",
    whyAsking: "了解廣告投放的平台組合。",
    hypothesis: "平台選擇是否符合目標客群的使用習慣，會直接影響廣告效率。",
    options: [
      { value: "meta", label: "Meta（Facebook／Instagram）" },
      { value: "google", label: "Google" },
      { value: "line_ads", label: "LINE 廣告" },
      { value: "platform_ads", label: "平台內廣告（電商、外送等）" },
      { value: "other", label: "其他" }
    ],
    scoring: { "*": [] },
    followUpQuestionIds: { "*": ["fu_ads_2"] },
    priority: 210,
    tags: ["ads"],
    section: "marketing"
  },
  {
    id: "fu_ads_2",
    dimension: "traffic",
    question: "每月廣告預算大約多少？",
    answerType: "single",
    whyAsking: "了解實際的廣告投入規模。",
    hypothesis: "預算規模會影響後續判斷效率不好是因為方法錯誤，還是資料量本來就不足以優化。",
    options: [
      { value: "lt10k", label: "1 萬元以下" },
      { value: "10to50k", label: "1～5 萬元" },
      { value: "50to150k", label: "5～15 萬元" },
      { value: "gt150k", label: "15 萬元以上" }
    ],
    scoring: { "*": [] },
    followUpQuestionIds: { "*": ["fu_ads_3"] },
    priority: 211,
    tags: ["ads", "budget"],
    section: "marketing"
  },
  {
    id: "fu_ads_3",
    dimension: "system",
    question: "是否知道廣告的 ROAS（廣告投資報酬率）？",
    answerType: "single",
    whyAsking: "確認是否知道廣告的實際投資報酬率。",
    hypothesis: "不知道 ROAS，代表無法判斷廣告到底有沒有賺錢，只能憑感覺加碼或砍預算。",
    options: [
      { value: "yes", label: "知道，而且有持續追蹤" },
      { value: "rough", label: "大概知道，沒有精確數字" },
      { value: "no", label: "不知道" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 10, kind: "positiveScore" }],
      rough: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "high", insightId: "system_no_visibility" }]
    },
    followUpQuestionIds: { yes: ["fu_ads_4"], rough: ["fu_ads_4"], no: ["fu_ads_4"] },
    priority: 212,
    tags: ["ads", "roas"],
    section: "marketing"
  },
  {
    id: "fu_ads_4",
    dimension: "system",
    question: "是否有設定轉換追蹤（例如 Pixel、GA4 轉換事件）？",
    answerType: "single",
    whyAsking: "確認廣告是否有設定轉換追蹤。",
    hypothesis: "有投廣告但沒有轉換追蹤，代表花費與成效完全脫鉤，是最常見卻最容易被忽略的浪費來源。",
    options: [
      { value: "yes", label: "有設定" },
      { value: "no", label: "沒有設定" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 10, kind: "positiveScore" }],
      // 對應規格十範例規則：「有投廣告但沒有轉換追蹤」Traffic +3／System -15／Conversion -8
      // 因為這題只有在 d4（是否投廣告）回答 yes／used_to 時才會被觸發，
      // 所以「有投廣告」這個父條件已經內含在「能看到這題」這件事本身，
      // 分數可以直接放在這一題的 no 選項上，不需要額外的組合規則。
      no: [
        { dimension: "traffic", points: 3, kind: "positiveScore" },
        { dimension: "system", points: -15, kind: "negativeScore", severity: "high", insightId: "system_ads_no_tracking" },
        { dimension: "conversion", points: -8, kind: "negativeScore", severity: "medium" }
      ]
    },
    followUpQuestionIds: { "*": ["fu_ads_5"] },
    priority: 213,
    tags: ["ads", "tracking"],
    section: "marketing"
  },
  {
    id: "fu_ads_5",
    dimension: "conversion",
    question: "廣告主要導向哪裡？",
    answerType: "single",
    whyAsking: "確認廣告流量最終導向的頁面。",
    hypothesis: "如果廣告導向的是內容分散、沒有明確行動呼籲的頁面，流量會在到達的瞬間就開始流失。",
    options: [
      { value: "website", label: "官網或 Landing Page" },
      { value: "social_profile", label: "社群主頁" },
      { value: "line", label: "LINE 官方帳號" },
      { value: "instore", label: "直接到店" },
      { value: "form", label: "表單" }
    ],
    scoring: { "*": [] },
    followUpQuestionIds: { "*": ["fu_ads_6"] },
    priority: 214,
    tags: ["ads"],
    section: "marketing"
  },
  {
    id: "fu_ads_6",
    dimension: "conversion",
    question: "廣告帶來的主要是流量、名單，還是直接成交？",
    answerType: "single",
    whyAsking: "區分廣告帶來的究竟是曝光、名單，還是實際成交。",
    hypothesis: "如果廣告只帶來流量或名單、卻很少轉成交，問題在轉換流程，而不是廣告投放本身。",
    options: [
      { value: "traffic_only", label: "只有流量，沒有留下名單或成交" },
      { value: "leads", label: "有留下名單" },
      { value: "sales", label: "會直接成交" }
    ],
    scoring: {
      traffic_only: [{ dimension: "conversion", points: -12, kind: "negativeScore", severity: "medium", insightId: "conversion_traffic_not_converting" }],
      leads: [{ dimension: "conversion", points: 6, kind: "positiveScore" }],
      sales: [{ dimension: "conversion", points: 12, kind: "positiveScore" }]
    },
    followUpQuestionIds: { traffic_only: ["fu_ads_7"] },
    priority: 215,
    tags: ["ads"],
    section: "marketing"
  },
  {
    id: "fu_ads_7",
    dimension: "traffic",
    question: "廣告停掉後，是否仍有自然流量？",
    answerType: "single",
    whyAsking: "驗證業績是否過度依賴持續投放廣告才能維持。",
    hypothesis: "停廣告後自然流量掉到接近零，代表目前的成長沒有累積任何長期資產，只是租來的流量。",
    options: [
      { value: "yes", label: "有，還是有人上門" },
      { value: "no", label: "幾乎沒有" },
      { value: "unsure", label: "沒試過，不確定" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "traffic", points: -12, kind: "negativeScore", severity: "high", insightId: "risk_ads_dependency" }],
      unsure: []
    },
    priority: 216,
    tags: ["ads", "organic"],
    section: "marketing"
  },

  // --- 社群有流量但沒成效（規格八第三組）---
  {
    id: "fu_social_1",
    dimension: "traffic",
    question: "經營社群的主要目標是什麼？",
    answerType: "single",
    whyAsking: "釐清經營社群真正想達成的目標，而不是有經營就好。",
    hypothesis: "目標不清楚，就無法判斷有沒有成效該用什麼標準衡量，內容方向也容易發散。",
    options: [
      { value: "awareness", label: "增加知名度、觸及與按讚" },
      { value: "leads", label: "帶來詢問或名單" },
      { value: "sales", label: "直接帶來訂單或預約" },
      { value: "unsure", label: "沒有明確目標" }
    ],
    scoring: {
      awareness: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "low" }],
      leads: [],
      sales: [],
      unsure: [{ dimension: "conversion", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    followUpQuestionIds: { "*": ["fu_social_2"] },
    priority: 220,
    tags: ["social"],
    section: "marketing"
  },
  {
    id: "fu_social_2",
    dimension: "traffic",
    question: "貼文主要是哪一種內容類型？",
    answerType: "single",
    whyAsking: "了解目前內容的主要類型。",
    hypothesis: "內容類型如果只停留在單向宣傳，互動與信任建立的效果通常有限。",
    options: [
      { value: "product", label: "產品或服務介紹" },
      { value: "lifestyle", label: "生活風格、幕後花絮" },
      { value: "promo", label: "促銷優惠" },
      { value: "education", label: "知識或教學內容" },
      { value: "mixed", label: "混合各種類型" }
    ],
    scoring: { "*": [] },
    followUpQuestionIds: { "*": ["fu_social_3"] },
    priority: 221,
    tags: ["social"],
    section: "marketing"
  },
  {
    id: "fu_social_3",
    dimension: "conversion",
    question: "貼文是否有明確的 CTA？",
    answerType: "single",
    whyAsking: "確認貼文是否有明確引導下一步的行動呼籲。",
    hypothesis: "社群有觸及、互動，卻沒有 CTA，等於把注意力留在原地，無法轉換成詢問或訂單。",
    options: [
      { value: "yes", label: "有，會引導私訊、點連結或預約" },
      { value: "no", label: "沒有，主要是分享內容" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: 4, kind: "positiveScore" }],
      // 對應規格十範例規則：「社群有高觸及但沒有 CTA」Traffic +8／Conversion -12
      // 同理，這題只在「經營社群但覺得沒成效」路徑下才會出現，
      // 父條件已內含在「能看到這題」本身，分數直接放在 no 選項。
      no: [
        { dimension: "traffic", points: 8, kind: "positiveScore" },
        { dimension: "conversion", points: -12, kind: "negativeScore", severity: "high", insightId: "conversion_no_cta" }
      ]
    },
    followUpQuestionIds: { "*": ["fu_social_4"] },
    priority: 222,
    tags: ["social", "cta"],
    section: "marketing"
  },
  {
    id: "fu_social_4",
    dimension: "positioning",
    question: "留言互動的人，是否符合你的目標客群？",
    answerType: "single",
    whyAsking: "確認互動的人是否真的符合目標客群，而不只是很多人按讚。",
    hypothesis: "如果互動的人跟付費客群不同，觸及與互動數字會好看，但很難轉換成實際生意。",
    options: [
      { value: "yes", label: "大部分是" },
      { value: "no", label: "大多不是（同行、抽獎獵人等）" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      yes: [{ dimension: "positioning", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "positioning", points: -10, kind: "negativeScore", severity: "medium", insightId: "traffic_wrong_audience" }],
      unsure: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 223,
    tags: ["social", "audience-fit"],
    section: "marketing"
  },

  // --- 有很多人詢問但成交少（規格八第四組）---
  {
    id: "fu_manyinquiry_1",
    dimension: "conversion",
    question: "價格是否公開透明？",
    answerType: "single",
    whyAsking: "確認價格資訊是否透明公開。",
    hypothesis: "價格不透明會拉長詢問流程、篩掉不合適名單的能力也會變差，讓大量詢問裡混雜很多不會成交的人。",
    options: [
      { value: "public", label: "公開，客戶查得到" },
      { value: "quote_only", label: "需要詢問才知道" }
    ],
    scoring: {
      public: [{ dimension: "conversion", points: 6, kind: "positiveScore" }],
      quote_only: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { "*": ["fu_manyinquiry_2"] },
    priority: 230,
    tags: ["many-inquiry-low-close"],
    section: "marketing"
  },
  {
    id: "fu_manyinquiry_2",
    dimension: "offer",
    question: "客戶最常提出什麼疑慮？",
    answerType: "single",
    whyAsking: "找出客戶猶豫不決的具體原因。",
    hypothesis: "反覆出現的疑慮如果沒有被系統性處理，會持續在同一個環節流失客戶。",
    options: [
      { value: "price", label: "價格太高" },
      { value: "trust", label: "不確定效果或品質" },
      { value: "timing", label: "時機不對、還在考慮" },
      { value: "comparison", label: "在比較其他選擇" },
      { value: "unsure", label: "不清楚" }
    ],
    scoring: {
      price: [{ dimension: "offer", points: -10, kind: "negativeScore", severity: "medium", insightId: "offer_value_gap" }],
      trust: [{ dimension: "brand", points: -10, kind: "negativeScore", severity: "medium", insightId: "brand_no_proof" }],
      timing: [],
      comparison: [{ dimension: "positioning", points: -8, kind: "negativeScore", severity: "medium" }],
      unsure: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { "*": ["fu_manyinquiry_3"] },
    priority: 231,
    tags: ["many-inquiry-low-close"],
    section: "marketing"
  },
  {
    id: "fu_manyinquiry_3",
    dimension: "conversion",
    question: "回覆詢問的速度大約多快？",
    answerType: "single",
    whyAsking: "確認回覆詢問的速度。",
    hypothesis: "回覆速度太慢，客戶的購買意願會在等待期間快速下降，是常被低估的成交率殺手。",
    options: [
      { value: "fast", label: "幾乎即時，很快回覆" },
      { value: "hours", label: "幾小時內" },
      { value: "slow", label: "常常隔天或更久" }
    ],
    scoring: {
      fast: [{ dimension: "conversion", points: 8, kind: "positiveScore" }],
      hours: [{ dimension: "conversion", points: -2, kind: "negativeScore", severity: "low" }],
      slow: [{ dimension: "conversion", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    followUpQuestionIds: { "*": ["fu_manyinquiry_4"] },
    priority: 232,
    tags: ["many-inquiry-low-close", "response-time"],
    section: "marketing"
  },
  {
    id: "fu_manyinquiry_4",
    dimension: "conversion",
    question: "是否持續追蹤未成交的名單？",
    answerType: "single",
    whyAsking: "確認是否有持續追蹤沒有立即成交的名單。",
    hypothesis: "沒有追蹤機制，這些已經表達興趣的名單就會直接被浪費，而不是被延遲轉換。",
    options: [
      { value: "yes", label: "有，會定期回頭聯繫" },
      { value: "no", label: "沒有，回覆完就結束" }
    ],
    scoring: {
      yes: [{ dimension: "conversion", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "conversion", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    followUpQuestionIds: { "*": ["fu_manyinquiry_5"] },
    priority: 233,
    tags: ["many-inquiry-low-close"],
    section: "marketing"
  },
  {
    id: "fu_manyinquiry_5",
    dimension: "positioning",
    question: "詢問的人，是否大多符合你的目標客群？",
    answerType: "single",
    whyAsking: "確認詢問的人是否真的符合目標客群。",
    hypothesis: "如果詢問量大但客群不符，代表前端的流量或內容吸引到了錯的人，成交率低是必然結果，而不是銷售能力的問題。",
    options: [
      { value: "yes", label: "大多符合" },
      { value: "no", label: "很多其實不太符合" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      yes: [{ dimension: "positioning", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "positioning", points: -12, kind: "negativeScore", severity: "high", insightId: "traffic_wrong_audience" }],
      unsure: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 234,
    tags: ["many-inquiry-low-close", "audience-fit"],
    section: "marketing"
  },

  // --- 客戶很少回購（規格八第五組）---
  {
    id: "fu_repurchase_1",
    dimension: "retention",
    question: "這項產品或服務本身，是否具有自然的回購週期？",
    description: "例如耗材、保養品、定期維護等",
    answerType: "single",
    whyAsking: "確認產品本身是否有自然的回購週期，區分本來就不該回購和應該回購卻沒有。",
    hypothesis: "如果產品本身沒有自然回購週期（例如一次性高單價服務），低回購率可能是正常現象，而不是問題。",
    options: [
      { value: "yes", label: "有，理論上應該會回購" },
      { value: "no", label: "沒有，本來就偏一次性" },
      { value: "unsure", label: "不確定" }
    ],
    scoring: {
      yes: [],
      no: [],
      unsure: []
    },
    followUpQuestionIds: { yes: ["fu_repurchase_2"] },
    priority: 240,
    tags: ["repurchase"],
    section: "marketing"
  },
  {
    id: "fu_repurchase_2",
    dimension: "retention",
    question: "是否會主動提醒客戶該回購了？",
    answerType: "single",
    whyAsking: "確認是否有主動提醒客戶回購。",
    hypothesis: "沒有提醒機制，回購時機完全交給客戶自己記得，會流失掉本來可以被喚回的客戶。",
    options: [
      { value: "yes", label: "有主動提醒" },
      { value: "no", label: "沒有，靠客戶自己想起來" }
    ],
    scoring: {
      yes: [{ dimension: "retention", points: 10, kind: "positiveScore" }],
      no: [{ dimension: "retention", points: -12, kind: "negativeScore", severity: "high", insightId: "retention_no_reminder" }]
    },
    followUpQuestionIds: { "*": ["fu_repurchase_3"] },
    priority: 241,
    tags: ["repurchase"],
    section: "marketing"
  },
  {
    id: "fu_repurchase_3",
    dimension: "system",
    question: "是否有保存客戶的購買紀錄與聯絡方式？",
    answerType: "single",
    whyAsking: "確認是否保存了客戶的購買紀錄與聯絡方式。",
    hypothesis: "沒有保存資料，就算想做回購喚回，也沒有名單可以執行。",
    options: [
      { value: "yes", label: "有完整保存" },
      { value: "partial", label: "有一部分" },
      { value: "no", label: "沒有保存" }
    ],
    scoring: {
      yes: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      partial: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      // 呼應規格十範例規則「有穩定回購但沒有會員資料」的反向情境：
      // 這裡是「該回購但沒有資料」，屬於同一類「留存資產沒有被系統化」的問題，
      // 由 bottleneckEngine 在 Phase 3 依 f1／f2／這題的組合統一判斷嚴重性。
      no: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "high", insightId: "system_no_crm" }]
    },
    followUpQuestionIds: { "*": ["fu_repurchase_4"] },
    priority: 242,
    tags: ["repurchase", "crm"],
    section: "marketing"
  },
  {
    id: "fu_repurchase_4",
    dimension: "offer",
    question: "是否有提供會員或組合方案，鼓勵持續購買？",
    answerType: "single",
    whyAsking: "確認是否有設計誘因鼓勵持續購買。",
    hypothesis: "沒有會員或組合方案，客戶消費完一次後缺乏繼續買的明確理由。",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: { "*": ["fu_repurchase_5"] },
    priority: 243,
    tags: ["repurchase"],
    section: "marketing"
  },
  {
    id: "fu_repurchase_5",
    dimension: "retention",
    question: "客戶完成第一次交易後，是否還有後續接觸？",
    answerType: "single",
    whyAsking: "確認交易結束後是否還有後續接觸。",
    hypothesis: "如果交易一結束關係就中斷，客戶很容易在下一次需求出現時忘記你、或轉向其他選擇。",
    options: [
      { value: "yes", label: "有，會持續互動" },
      { value: "no", label: "沒有，交易完就結束了" }
    ],
    scoring: {
      yes: [{ dimension: "retention", points: 8, kind: "positiveScore" }],
      no: [{ dimension: "retention", points: -10, kind: "negativeScore", severity: "medium" }]
    },
    priority: 244,
    tags: ["repurchase"],
    section: "marketing"
  },

  // --- 熟客介紹作為唯一渠道 ---
  {
    id: "fu_referral_1",
    dimension: "traffic",
    question: "除了熟客介紹，是否還有其他穩定的客戶來源？",
    answerType: "single",
    whyAsking: "確認除了熟客介紹之外，是否還有其他穩定客源。",
    hypothesis: "完全依賴介紹，代表業績穩定度取決於別人願不願意主動幫你說話，而不是你能掌握的獲客管道。",
    options: [
      { value: "yes", label: "有，還有其他穩定管道" },
      { value: "no", label: "沒有，幾乎完全靠熟客介紹" }
    ],
    scoring: {
      yes: [{ dimension: "traffic", points: 6, kind: "positiveScore" }],
      // 對應規格十範例規則：「完全依賴熟客介紹」Brand +5／Traffic -12／System -10
      no: [
        { dimension: "brand", points: 5, kind: "positiveScore" },
        { dimension: "traffic", points: -12, kind: "negativeScore", severity: "high", insightId: "risk_referral_dependency" },
        { dimension: "system", points: -10, kind: "negativeScore", severity: "medium" }
      ]
    },
    priority: 250,
    tags: ["referral-dependency"],
    section: "marketing"
  },

  // --- 不知道自己的數據（規格八第六組，明確不判定為經營差）---
  {
    id: "fu_nodata_1",
    dimension: "system",
    question: "沒關係——這代表現階段還沒有辦法判斷問題出在流量還是轉換。你目前最想先看懂的是哪一件事？",
    description: "不知道數據不等於經營得不好，只是還缺一套基本的觀察方式",
    answerType: "single",
    whyAsking: "在使用者明確表示不知道自己的數據時，改用引導方式了解他最想先看懂的環節，避免讓他覺得被評價。",
    hypothesis: "不知道數據本身不是負向表現，而是決策可視性不足，後續建議應該先幫助他看見問題，而不是急著給答案。",
    options: [
      { value: "where_customers_from", label: "客戶到底從哪裡來" },
      { value: "why_not_close", label: "為什麼詢問了卻不成交" },
      { value: "why_not_return", label: "為什麼客戶不再回來" },
      { value: "overall_health", label: "整體經營狀況好不好" }
    ],
    scoring: {
      // 這一組不扣分，純粹用來決定「建議先建立最基本追蹤架構」要對準哪個方向，
      // 對應規格八：「不應直接判定經營很差，應識別為數據可視性不足」。
      "*": [{ dimension: "system", points: 0, kind: "positiveScore", insightId: "system_no_visibility" }]
    },
    priority: 260,
    tags: ["no-data", "visibility"],
    section: "marketing"
  }
];

/** @param {string} id @returns {Question|undefined} */
export function getCommonQuestionById(id) {
  return commonQuestions.find((q) => q.id === id) || followUpQuestions.find((q) => q.id === id);
}
