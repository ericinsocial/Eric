/**
 * ===== Industry Journey 專屬問題 =====
 * @typedef {import('../types/diagnosis.js').Question} Question
 *
 * 這些題目只會透過 industryJourneys.js 的入口問題（entryQuestion）或路徑上
 * 前一題的 followUpQuestionIds 觸發，本身不放進 commonQuestions 的基礎題池，
 * 也刻意不加 `conditions`——跟 commonQuestions.js 裡 fu_* 系列追問題的慣例一致
 * （路徑上下文本身就是「有沒有被問到」的唯一條件）。
 *
 * 只有在既有的共通題／追問鏈（fu_ads_*／fu_repurchase_*／fu_manyinquiry_*／
 * fu_referral_*／fu_nodata_1／f1_repurchase／f4_know_churn_reason／
 * g7_single_person_dependency 等）不足以驗證該路徑的假設時，才在這裡新增
 * 專屬題目——例如「有客人但客單價低」需要的證據，共通題庫裡沒有對應題目。
 *
 * @type {Question[]}
 */
export const journeyQuestions = [
  // ===== 餐飲：路徑 A（沒什麼客人）=====
  {
    id: "rest_a1_google_reviews",
    dimension: "brand",
    question: "Google 評價大概是什麼狀況？",
    answerType: "single",
    whyAsking: "區分「沒有評價」和「評價好但沒有人來」是完全不同的兩種問題。",
    hypothesis: "如果評價高且數量不少，代表市場對品質已經有正面印象，沒客人的原因不太可能是「東西不好」。",
    options: [
      { value: "good_and_many", label: "評價高，數量也不少" },
      { value: "good_but_few", label: "評價高，但數量很少" },
      { value: "average_or_poor", label: "普通或偏差" },
      { value: "not_sure", label: "沒特別注意過" }
    ],
    scoring: {
      good_and_many: [{ dimension: "brand", points: 10, kind: "positiveScore" }],
      good_but_few: [{ dimension: "brand", points: 2, kind: "positiveScore" }],
      average_or_poor: [{ dimension: "brand", points: -10, kind: "negativeScore", severity: "medium" }],
      not_sure: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }]
    },
    followUpQuestionIds: {
      good_and_many: ["rest_a2_social_following"],
      good_but_few: ["rest_a2_social_following"],
      average_or_poor: ["rest_a2_social_following"],
      not_sure: ["rest_a2_social_following"]
    },
    priority: 4.1,
    tags: ["restaurant", "journey-a"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },
  {
    id: "rest_a2_social_following",
    dimension: "traffic",
    question: "IG／FB 追蹤數大概是什麼狀況？",
    answerType: "single",
    whyAsking: "確認社群聲量的規模，判斷「沒客人」是不是純粹曝光不足。",
    hypothesis: "如果追蹤數已經有一定規模，代表曝光本身不是主要瓶頸，問題更可能出在「看到之後有沒有行動」。",
    options: [
      { value: "sizable", label: "有一定規模，還在成長" },
      { value: "small", label: "人數不多" },
      { value: "not_active", label: "沒有在經營" }
    ],
    scoring: {
      sizable: [{ dimension: "traffic", points: 8, kind: "positiveScore" }],
      small: [{ dimension: "traffic", points: -4, kind: "negativeScore", severity: "low" }],
      not_active: [{ dimension: "traffic", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    followUpQuestionIds: {
      sizable: ["rest_a3_weekday_weekend_gap"],
      small: ["rest_a3_weekday_weekend_gap"],
      not_active: ["rest_a3_weekday_weekend_gap"]
    },
    priority: 4.2,
    tags: ["restaurant", "journey-a"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },
  {
    id: "rest_a3_weekday_weekend_gap",
    dimension: "market",
    question: "平日跟假日的來客數，落差大嗎？",
    answerType: "single",
    whyAsking: "區分「整體都沒客人」和「只有特定時段沒客人」，兩者的因應方式完全不同。",
    hypothesis: "假日滿、平日很少，代表問題不是整體需求不足，而是平日缺乏讓人特地前來的理由或誘因（離峰需求缺口）。",
    options: [
      { value: "big_gap", label: "假日幾乎滿，平日很少" },
      { value: "both_low", label: "平日假日都不太理想" },
      { value: "both_ok", label: "其實落差不大" }
    ],
    scoring: {
      big_gap: [{ dimension: "market", points: -6, kind: "negativeScore", severity: "medium" }],
      both_low: [{ dimension: "market", points: -12, kind: "negativeScore", severity: "high" }],
      both_ok: [{ dimension: "market", points: 4, kind: "positiveScore" }]
    },
    followUpQuestionIds: {
      big_gap: ["rest_a4_online_to_action"],
      both_low: ["rest_a4_online_to_action"],
      both_ok: ["rest_a4_online_to_action"]
    },
    priority: 4.3,
    tags: ["restaurant", "journey-a"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },
  {
    id: "rest_a4_online_to_action",
    dimension: "conversion",
    question: "客戶看到你的評價或社群之後，知道該怎麼採取下一步嗎（訂位、私訊、直接到店）？",
    answerType: "single",
    whyAsking: "驗證「知道你」跟「決定行動」之間，是否有清楚、低摩擦的橋樑。",
    hypothesis: "如果評價與社群聲量都好、但這一題答案是不清楚，代表問題出在「線上聲量沒有被轉換成實際行動」，而不是知名度不夠。",
    options: [
      { value: "clear", label: "很清楚，管道明確" },
      { value: "unclear", label: "不清楚，需要自己問" }
    ],
    scoring: {
      clear: [{ dimension: "conversion", points: 10, kind: "positiveScore" }],
      unclear: [{ dimension: "conversion", points: -14, kind: "negativeScore", severity: "high", insightId: "conversion_no_cta" }]
    },
    priority: 4.4,
    tags: ["restaurant", "journey-a"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },

  // ===== 餐飲：路徑 B（有客人但客單價低）=====
  {
    id: "rest_b1_ticket_awareness",
    dimension: "offer",
    question: "你知道目前平均客單價大概多少嗎？",
    answerType: "single",
    whyAsking: "確認客單價是否被有意識地追蹤，還是只是「感覺偏低」。",
    hypothesis: "不知道實際數字，代表接下來要驗證的是「有沒有主動提升客單價的設計」，而不是先假設價格定錯。",
    options: [
      { value: "yes_tracked", label: "知道，而且有在追蹤" },
      { value: "rough_guess", label: "大概知道，沒有精確追蹤" },
      { value: "no_idea", label: "沒有概念" }
    ],
    scoring: {
      yes_tracked: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      rough_guess: [{ dimension: "system", points: 0, kind: "positiveScore" }],
      no_idea: [{ dimension: "system", points: -8, kind: "negativeScore", severity: "medium" }]
    },
    followUpQuestionIds: {
      yes_tracked: ["rest_b2_addon_offer"],
      rough_guess: ["rest_b2_addon_offer"],
      no_idea: ["rest_b2_addon_offer"]
    },
    priority: 4.1,
    tags: ["restaurant", "journey-b"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },
  {
    id: "rest_b2_addon_offer",
    dimension: "offer",
    question: "是否有設計加購、套餐或升級選項，鼓勵客戶多消費一點？",
    answerType: "single",
    whyAsking: "確認客單價偏低是不是因為根本沒有「多消費」的選項可以選。",
    hypothesis: "沒有加購或套餐設計，客戶不是不想多花，而是根本沒有被給予選擇——這是產品階梯（offer ladder）缺口，不是客群問題。",
    options: [
      { value: "yes", label: "有，而且效果不錯" },
      { value: "have_but_weak", label: "有，但效果不明顯" },
      { value: "no", label: "沒有設計過" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 10, kind: "positiveScore" }],
      have_but_weak: [{ dimension: "offer", points: -4, kind: "negativeScore", severity: "low" }],
      no: [{ dimension: "offer", points: -12, kind: "negativeScore", severity: "medium", insightId: "offer_no_ladder" }]
    },
    priority: 4.2,
    tags: ["restaurant", "journey-b"],
    section: "marketing",
    applicableIndustries: ["restaurant"]
  },

  // ===== 電商：路徑 B（流量進來但很少加購物車／結帳）=====
  {
    id: "ec_b1_pdp_trust",
    dimension: "brand",
    question: "商品頁上是否有評價、詳細規格或使用情境照片？",
    answerType: "single",
    whyAsking: "確認商品頁本身是否具備讓陌生訪客產生信任、做出購買決定的元素。",
    hypothesis: "商品頁缺乏信任元素，訪客即使有興趣也會因為不確定而離開，這是轉換率偏低的常見隱藏原因，跟流量品質無關。",
    options: [
      { value: "complete", label: "都有，內容算完整" },
      { value: "partial", label: "有一部分" },
      { value: "minimal", label: "幾乎沒有，只有基本資訊" }
    ],
    scoring: {
      complete: [{ dimension: "brand", points: 10, kind: "positiveScore" }],
      partial: [{ dimension: "brand", points: -4, kind: "negativeScore", severity: "low" }],
      minimal: [{ dimension: "brand", points: -12, kind: "negativeScore", severity: "medium", insightId: "brand_no_proof" }]
    },
    followUpQuestionIds: {
      complete: ["ec_b2_checkout_friction"],
      partial: ["ec_b2_checkout_friction"],
      minimal: ["ec_b2_checkout_friction"]
    },
    priority: 4.1,
    tags: ["ecommerce", "journey-b"],
    section: "marketing",
    applicableIndustries: ["ecommerce"]
  },
  {
    id: "ec_b2_checkout_friction",
    dimension: "conversion",
    question: "結帳流程大概需要幾個步驟／欄位？",
    answerType: "single",
    whyAsking: "確認結帳本身是否是流失的環節，而不是商品頁或流量的問題。",
    hypothesis: "結帳步驟越多、欄位越複雜，棄單率通常越高——這是轉換流程摩擦，跟商品吸引力無關。",
    options: [
      { value: "simple", label: "很簡單，幾步就完成" },
      { value: "moderate", label: "還好，中等複雜度" },
      { value: "complex", label: "步驟多、欄位多" },
      { value: "not_sure", label: "沒特別檢視過" }
    ],
    scoring: {
      simple: [{ dimension: "conversion", points: 8, kind: "positiveScore" }],
      moderate: [{ dimension: "conversion", points: -2, kind: "negativeScore", severity: "low" }],
      complex: [{ dimension: "conversion", points: -12, kind: "negativeScore", severity: "medium" }],
      not_sure: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 4.2,
    tags: ["ecommerce", "journey-b"],
    section: "marketing",
    applicableIndustries: ["ecommerce"]
  },

  // ===== 顧問：路徑 B（每次都要重新報價）=====
  {
    id: "con_b1_has_packages",
    dimension: "offer",
    question: "是否有幾個固定的服務方案（例如基礎／進階／完整），還是每次都重新規劃？",
    answerType: "single",
    whyAsking: "確認服務是否已經被產品化，還是完全依賴客製。",
    hypothesis: "沒有固定方案，代表每一次銷售都要重新教育客戶、重新報價，這是收入不穩定與難以規模化的根本原因（服務尚未產品化）。",
    options: [
      { value: "fixed_packages", label: "有幾個固定方案" },
      { value: "loose_framework", label: "有大致架構，但常常調整" },
      { value: "fully_custom", label: "每次都是全新規劃" }
    ],
    scoring: {
      fixed_packages: [{ dimension: "offer", points: 12, kind: "positiveScore" }],
      loose_framework: [{ dimension: "offer", points: -2, kind: "negativeScore", severity: "low" }],
      fully_custom: [{ dimension: "offer", points: -14, kind: "negativeScore", severity: "high" }]
    },
    followUpQuestionIds: {
      fixed_packages: ["con_b2_quote_time"],
      loose_framework: ["con_b2_quote_time"],
      fully_custom: ["con_b2_quote_time"]
    },
    priority: 4.1,
    tags: ["consultant", "journey-b"],
    section: "marketing",
    applicableIndustries: ["consultant"]
  },
  {
    id: "con_b2_quote_time",
    dimension: "system",
    question: "從客戶詢問到你給出報價，大概需要多久？",
    answerType: "single",
    whyAsking: "量化「每次重新報價」造成的實際延遲，確認是否已經影響成交速度。",
    hypothesis: "報價時間越長，代表銷售流程越依賴臨時規劃，客戶的決策動能也容易在等待中流失。",
    options: [
      { value: "same_day", label: "當天就能給" },
      { value: "few_days", label: "大約需要幾天" },
      { value: "over_week", label: "常常超過一週" }
    ],
    scoring: {
      same_day: [{ dimension: "system", points: 8, kind: "positiveScore" }],
      few_days: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      over_week: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "medium" }]
    },
    priority: 4.2,
    tags: ["consultant", "journey-b"],
    section: "marketing",
    applicableIndustries: ["consultant"]
  },

  // ===== 顧問：路徑 D（免費諮詢做很多，但沒有轉換）=====
  {
    id: "con_d1_free_consult_volume",
    dimension: "conversion",
    question: "免費諮詢／試聊之後，實際簽約的比例大概是多少？",
    answerType: "single",
    whyAsking: "確認免費諮詢是否真的在篩選、培養客戶，還是純粹在消耗時間。",
    hypothesis: "免費諮詢量大但簽約比例很低，代表免費諮詢的定位或流程需要重新設計，而不是繼續增加諮詢的曝光。",
    options: [
      { value: "high", label: "大部分都會簽約" },
      { value: "some", label: "約三到五成會簽約" },
      { value: "low", label: "很少真的簽約" }
    ],
    scoring: {
      high: [{ dimension: "conversion", points: 10, kind: "positiveScore" }],
      some: [{ dimension: "conversion", points: -2, kind: "negativeScore", severity: "low" }],
      low: [{ dimension: "conversion", points: -14, kind: "negativeScore", severity: "high" }]
    },
    priority: 4.1,
    tags: ["consultant", "journey-d"],
    section: "marketing",
    applicableIndustries: ["consultant"]
  },

  // ===== SaaS：路徑 A（註冊多但很少真的開始用）=====
  {
    id: "saas_a1_onboarding_guidance",
    dimension: "conversion",
    question: "使用者註冊後，是否有清楚的引導完成第一個關鍵動作？",
    answerType: "single",
    whyAsking: "確認啟用率低是不是因為缺乏引導，而不是產品本身沒有價值。",
    hypothesis: "沒有清楚引導，使用者註冊後不知道第一步該做什麼，很容易直接流失（啟用缺口）。",
    options: [
      { value: "guided", label: "有明確的引導流程" },
      { value: "partial", label: "有一些提示，不完整" },
      { value: "none", label: "註冊完就直接丟到主畫面" }
    ],
    scoring: {
      guided: [{ dimension: "conversion", points: 10, kind: "positiveScore" }],
      partial: [{ dimension: "conversion", points: -4, kind: "negativeScore", severity: "low" }],
      none: [{ dimension: "conversion", points: -14, kind: "negativeScore", severity: "high" }]
    },
    followUpQuestionIds: {
      guided: ["saas_a2_core_action_clarity"],
      partial: ["saas_a2_core_action_clarity"],
      none: ["saas_a2_core_action_clarity"]
    },
    priority: 4.1,
    tags: ["saas", "journey-a"],
    section: "marketing",
    applicableIndustries: ["saas"]
  },
  {
    id: "saas_a2_core_action_clarity",
    dimension: "offer",
    question: "你是否清楚定義「使用者做完哪個動作，就算真正體驗到產品價值」？",
    answerType: "single",
    whyAsking: "確認團隊自己是否清楚核心價值時刻（aha moment），這是設計引導流程的前提。",
    hypothesis: "連團隊自己都說不清楚核心動作是什麼，代表啟用率低的根源可能是「價值主張不夠具體」，而不是引導流程的技術問題。",
    options: [
      { value: "clear", label: "很清楚，而且全公司有共識" },
      { value: "vague", label: "大概知道，但沒有明確定義" },
      { value: "no", label: "沒有特別定義過" }
    ],
    scoring: {
      clear: [{ dimension: "offer", points: 10, kind: "positiveScore" }],
      vague: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "medium" }],
      no: [{ dimension: "offer", points: -12, kind: "negativeScore", severity: "high" }]
    },
    priority: 4.2,
    tags: ["saas", "journey-a"],
    section: "marketing",
    applicableIndustries: ["saas"]
  },

  // ===== SaaS：路徑 B（試用但付費轉換低）=====
  {
    id: "saas_b1_paywall_clarity",
    dimension: "offer",
    question: "使用者在付費前，是否已經體驗到「值得付費」的具體效果？",
    answerType: "single",
    whyAsking: "區分「付費轉換低」是因為方案設計問題，還是使用者根本還沒體驗到價值就被要求付費。",
    hypothesis: "如果使用者在付費當下還沒體驗到具體效果，付費轉換低是必然結果——問題不在定價，而在價值有沒有先被體驗到。",
    options: [
      { value: "yes", label: "有，付費前就感受得到效果" },
      { value: "unclear", label: "不確定，因人而異" },
      { value: "no", label: "大部分人還沒感受到就要付費" }
    ],
    scoring: {
      yes: [{ dimension: "offer", points: 10, kind: "positiveScore" }],
      unclear: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "medium" }],
      no: [{ dimension: "offer", points: -14, kind: "negativeScore", severity: "high", insightId: "offer_value_gap" }]
    },
    priority: 4.1,
    tags: ["saas", "journey-b"],
    section: "marketing",
    applicableIndustries: ["saas"]
  },

  // ===== SaaS：路徑 D（一直做新功能，但成長沒有起色）=====
  {
    id: "saas_d1_feature_vs_fix_priority",
    dimension: "system",
    question: "團隊目前的開發資源，主要投入在新功能，還是修正啟用／轉換流程？",
    answerType: "single",
    whyAsking: "確認資源分配是否跟真正的瓶頸對齊。",
    hypothesis: "如果啟用或轉換數字本來就不理想，卻持續優先投入新功能開發，等於在放大同一個漏洞，而不是修補它。",
    options: [
      { value: "new_features", label: "主要在做新功能" },
      { value: "mixed", label: "兩邊都有，沒有明確優先順序" },
      { value: "fixing_funnel", label: "目前優先在修正啟用／轉換流程" }
    ],
    scoring: {
      new_features: [{ dimension: "system", points: -12, kind: "negativeScore", severity: "high" }],
      mixed: [{ dimension: "system", points: -4, kind: "negativeScore", severity: "low" }],
      fixing_funnel: [{ dimension: "system", points: 10, kind: "positiveScore" }]
    },
    priority: 4.1,
    tags: ["saas", "journey-d"],
    section: "marketing",
    applicableIndustries: ["saas"]
  },

  // ===== 尚未創業：路徑 C（不知道第一批客戶從哪裡來）=====
  {
    id: "pre_c1_first_customer_channel",
    dimension: "market",
    question: "如果現在就要找到第一批願意付錢的客戶，你會從哪裡開始？",
    answerType: "single",
    whyAsking: "確認使用者對「第一批客戶從哪裡來」是否有具體想法，而不只是有產品構想。",
    hypothesis: "答不出具體管道，代表接下來最優先的工作是找到並接觸真實的潛在客戶，而不是先做行銷素材或廣告。",
    options: [
      { value: "clear_channel", label: "有具體想法，知道去哪裡找" },
      { value: "vague_idea", label: "有一些方向，但不確定" },
      { value: "no_idea", label: "完全沒有頭緒" }
    ],
    scoring: {
      clear_channel: [{ dimension: "market", points: 10, kind: "positiveScore" }],
      vague_idea: [{ dimension: "market", points: -6, kind: "negativeScore", severity: "medium" }],
      no_idea: [{ dimension: "market", points: -14, kind: "negativeScore", severity: "high" }]
    },
    priority: 4.1,
    tags: ["prelaunch", "journey-c"],
    section: "basic",
    applicableIndustries: ["prelaunch"],
    applicableStages: ["idea", "preparing"]
  },

  // ===== 尚未創業：路徑 D（想清楚了，但還沒開始執行）=====
  {
    id: "pre_d1_blocking_reason",
    dimension: "market",
    question: "目前卡住你、還沒開始執行的主要原因是什麼？",
    answerType: "single",
    whyAsking: "區分「還沒開始」是因為缺資源、缺信心，還是缺乏一個明確的第一步。",
    hypothesis: "如果卡住的原因是「不知道第一步該做什麼」，代表需要的不是更多規劃，而是一個具體、低風險的驗證行動。",
    options: [
      { value: "no_first_step", label: "不知道第一步該做什麼" },
      { value: "resources", label: "資金或時間還沒到位" },
      { value: "confidence", label: "還在猶豫，怕做不好" }
    ],
    scoring: {
      no_first_step: [{ dimension: "market", points: -8, kind: "negativeScore", severity: "medium" }],
      resources: [{ dimension: "market", points: -4, kind: "negativeScore", severity: "low" }],
      confidence: [{ dimension: "market", points: -4, kind: "negativeScore", severity: "low" }]
    },
    priority: 4.1,
    tags: ["prelaunch", "journey-d"],
    section: "basic",
    applicableIndustries: ["prelaunch"],
    applicableStages: ["idea", "preparing"]
  }
];

/** @param {string} id @returns {Question|undefined} */
export function getJourneyQuestionById(id) {
  return journeyQuestions.find((q) => q.id === id);
}
