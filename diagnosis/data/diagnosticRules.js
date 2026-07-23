/**
 * ===== Diagnostic Rules =====
 * @typedef {import('../types/diagnosis.js').DiagnosticRule} DiagnosticRule
 *
 * 規格四／六：不是 Scoring Rules，是「這幾個訊號同時出現，代表高度懷疑
 * 某個原因」。when 是 Condition[]（AND），可以跨越好幾題——這正是 Phase 1
 * 當時留給「combinationRules」的位置（見 commonQuestions.js 檔頭註解）。
 *
 * 每一條規則都要能回答兩個問題：
 *   1. 為什麼這些訊號同時成立，代表這個結論？（conclusionReasoning）
 *   2. 對應到 Marketing Knowledge Base 裡哪一則「根本原因」？（knowledgeIds）
 * 這樣結果頁與 AI 潤飾才有「證據可以追溯」，不是黑箱分數。
 *
 * @type {DiagnosticRule[]}
 */
export const diagnosticRules = [
  // ===== 使用者原話範例 1：Google 評價好、IG 追蹤數高，但沒有客人 =====
  {
    id: "rule_online_signal_no_offline_traffic",
    name: "口碑與社群聲量佳，但沒有客人上門",
    when: [
      { questionId: "restaurant_entry", operator: "equals", value: "few_customers" },
      { questionId: "rest_a1_google_reviews", operator: "equals", value: "good_and_many" },
      { questionId: "rest_a2_social_following", operator: "equals", value: "sizable" }
    ],
    hypothesisIds: ["online_to_offline_gap"],
    conclusionTitle: "你不是缺少知名度，而是缺少把知名度轉換成上門的橋樑",
    conclusionReasoning: "評價高、社群追蹤數也有規模，代表市場對你已經有正面印象，「沒有人知道你」不太可能是真正的原因。問題更可能出在「知道你」跟「決定上門」之間，缺乏清楚、低摩擦的引導。",
    confidence: "high",
    severity: "high",
    dimensions: ["conversion", "traffic"],
    knowledgeIds: ["kb_online_signal_no_offline_conversion"]
  },
  {
    id: "rule_online_to_action_unclear",
    name: "線上聲量沒有被轉換成明確的下一步行動",
    when: [{ questionId: "rest_a4_online_to_action", operator: "equals", value: "unclear" }],
    hypothesisIds: ["traffic_not_converting", "online_to_offline_gap"],
    conclusionTitle: "客戶看到你之後，不知道該怎麼採取下一步",
    conclusionReasoning: "客戶如果需要「自己想辦法」才能訂位或詢問，願意這樣做的人會大幅減少。這是轉換設計的問題，不是流量或知名度問題。",
    confidence: "high",
    severity: "high",
    dimensions: ["conversion"],
    knowledgeIds: ["kb_online_signal_no_offline_conversion", "kb_social_reach_no_cta"]
  },
  {
    id: "rule_weekday_demand_gap",
    name: "假日滿、平日很少，需求缺口只出現在特定時段",
    when: [{ questionId: "rest_a3_weekday_weekend_gap", operator: "equals", value: "big_gap" }],
    hypothesisIds: ["weekday_demand_gap"],
    conclusionTitle: "問題不是整體沒有需求，是平日缺乏讓人特地前來的理由",
    conclusionReasoning: "假日表現正常代表產品與服務本身沒有問題，平日的落差通常需要針對性的誘因（例如平日限定方案）而不是整體加大曝光。",
    confidence: "medium",
    severity: "medium",
    dimensions: ["market"],
    knowledgeIds: ["kb_online_signal_no_offline_conversion"]
  },

  // ===== 使用者原話範例 2：很多人詢問，但成交很低 =====
  {
    id: "rule_many_inquiry_wrong_audience",
    name: "詢問量大，但詢問的人不符合目標客群",
    when: [
      { questionId: "e2_inquiry_to_close", operator: "equals", value: "lt10" },
      { questionId: "fu_manyinquiry_5", operator: "equals", value: "no" }
    ],
    hypothesisIds: ["traffic_wrong_audience"],
    conclusionTitle: "問題不是銷售能力，是前端吸引到了錯的人",
    conclusionReasoning: "成交率低，但詢問的人本來就不太符合目標客群，代表流量或內容在源頭就篩選失準。就算優化銷售流程，只要進來的人不對，成交率也很難真正提升。",
    confidence: "high",
    severity: "high",
    dimensions: ["traffic", "positioning"],
    knowledgeIds: ["kb_high_traffic_low_conversion", "kb_positioning_unclear"]
  },
  {
    id: "rule_many_inquiry_process_broken",
    name: "詢問量大、客群也對，但成交率仍然低",
    when: [
      { questionId: "e2_inquiry_to_close", operator: "equals", value: "lt10" },
      { questionId: "fu_manyinquiry_5", operator: "equals", value: "yes" }
    ],
    hypothesisIds: ["conversion_process_broken"],
    conclusionTitle: "客群是對的，卡關的環節在銷售流程本身",
    conclusionReasoning: "詢問的人本來就符合目標客群，成交率卻仍然偏低，代表問題出在報價透明度、回覆速度、疑慮處理或流程斷點——需要往銷售流程裡找，而不是往流量裡找。",
    confidence: "high",
    severity: "high",
    dimensions: ["conversion"],
    knowledgeIds: ["kb_high_traffic_low_conversion"]
  },
  {
    id: "rule_slow_response_amplifies_dropoff",
    name: "回覆速度慢，正在放大詢問流失",
    when: [
      { questionId: "e2_inquiry_to_close", operator: "equals", value: "lt10" },
      { questionId: "fu_manyinquiry_3", operator: "equals", value: "slow" }
    ],
    hypothesisIds: ["conversion_process_broken"],
    conclusionTitle: "回覆速度可能是成交率低的直接原因之一",
    conclusionReasoning: "客戶詢問後的等待時間越長，購買意願下降得越快。這是成本最低、通常也最快能看到改善效果的環節。",
    confidence: "medium",
    severity: "medium",
    dimensions: ["conversion"],
    knowledgeIds: ["kb_high_traffic_low_conversion"]
  },

  // ===== 使用者原話範例 3：回購很好，但新客很少 =====
  {
    id: "rule_retention_good_acquisition_stalled",
    name: "回購穩定，但業績高度依賴舊客戶",
    when: [
      { questionId: "f1_repurchase", operator: "equals", value: "often" },
      { questionId: "f6_repeat_revenue_share", operator: "equals", value: "gt50" }
    ],
    hypothesisIds: ["acquisition_stalled_despite_retention"],
    conclusionTitle: "不是留客有問題，是新客開發已經停滯",
    conclusionReasoning: "回購頻繁、舊客戶又貢獻超過一半營收，代表留存機制其實運作得不錯。如果這時候把資源投入在「提升回購率」，效果會很有限——真正該優先處理的是新客開發管道太少或太弱。",
    confidence: "high",
    severity: "medium",
    dimensions: ["traffic"],
    knowledgeIds: ["kb_retention_good_acquisition_stalled"]
  },

  // ===== 廣告效率：有花錢但看不出成效（電商測試案例）=====
  {
    id: "rule_ads_spend_blind",
    name: "有投放廣告，但不知道 ROAS 也沒有轉換追蹤",
    when: [
      { questionId: "fu_ads_3", operator: "equals", value: "no" },
      { questionId: "fu_ads_4", operator: "equals", value: "no" }
    ],
    hypothesisIds: ["ads_no_tracking", "data_blindness"],
    conclusionTitle: "目前無法判斷廣告到底有沒有賺錢",
    conclusionReasoning: "不知道 ROAS、也沒有設定轉換追蹤，代表廣告花費與實際成效完全脫鉤。在補上追蹤之前，任何「加碼」或「砍預算」的決定都只是憑感覺。",
    confidence: "high",
    severity: "high",
    dimensions: ["system"],
    knowledgeIds: ["kb_ads_no_tracking"]
  },
  {
    id: "rule_ads_dependency_scaling",
    name: "停廣告後幾乎沒有自然流量，卻持續加碼",
    when: [
      { questionId: "fu_ads_7", operator: "equals", value: "no" },
      { questionId: "ecommerce_entry", operator: "equals", value: "ads_not_profitable" }
    ],
    hypothesisIds: ["ads_dependency"],
    conclusionTitle: "業績目前只是租來的流量，不是累積出來的資產",
    conclusionReasoning: "廣告停掉後自然流量幾乎歸零，代表目前的成長沒有轉換成任何長期資產（自然流量、名單、品牌記憶）。在轉換率與追蹤問題修好之前，加大廣告預算只會放大同樣的漏洞。",
    confidence: "high",
    severity: "high",
    dimensions: ["traffic"],
    knowledgeIds: ["kb_platform_dependency"]
  },

  // ===== 轉介紹依賴 + 沒有其他自主管道 =====
  {
    id: "rule_referral_dependency_no_owned_channel",
    name: "完全依賴介紹，也沒有官網等自主管道",
    when: [
      { questionId: "fu_referral_1", operator: "equals", value: "no" },
      { questionId: "d6_website", operator: "equals", value: "social_only" }
    ],
    hypothesisIds: ["referral_dependency", "channel_platform_dependency"],
    conclusionTitle: "業績穩定度掌握在別人手上，不是你自己手上",
    conclusionReasoning: "沒有其他穩定客源，也沒有自己的官網或名單，代表獲客完全仰賴別人願不願意主動介紹——這不是可以規劃、可以規模化的成長方式。",
    confidence: "high",
    severity: "high",
    dimensions: ["brand", "traffic"],
    knowledgeIds: ["kb_referral_dependency", "kb_platform_dependency"]
  },

  // ===== 顧問：服務未產品化（測試案例 C）=====
  {
    id: "rule_consultant_productization_gap",
    name: "完全客製報價，而且報價週期很長",
    when: [
      { questionId: "con_b1_has_packages", operator: "equals", value: "fully_custom" },
      { questionId: "con_b2_quote_time", operator: "equals", value: "over_week" }
    ],
    hypothesisIds: ["productization_gap"],
    conclusionTitle: "收入不穩定的根源，是服務還沒有被產品化",
    conclusionReasoning: "每次都要重新規劃、報價又常常拖過一週，代表銷售流程高度依賴臨時投入的時間，而不是可以複製的標準流程。這會同時拖慢成交速度，也讓收入難以預測。",
    confidence: "high",
    severity: "high",
    dimensions: ["offer", "system"],
    knowledgeIds: ["kb_productization_gap"]
  },

  // ===== SaaS：啟用缺口（測試案例 D）=====
  {
    id: "rule_saas_activation_gap",
    name: "沒有引導流程，團隊也說不清楚核心價值動作",
    when: [
      { questionId: "saas_a1_onboarding_guidance", operator: "equals", value: "none" },
      { questionId: "saas_a2_core_action_clarity", operator: "notEquals", value: "clear" }
    ],
    hypothesisIds: ["activation_gap"],
    conclusionTitle: "註冊數字不是問題，問題在使用者從來沒有真正體驗到產品",
    conclusionReasoning: "沒有引導流程，加上團隊自己都無法明確定義「核心價值動作」是什麼，代表啟用率低的根源是產品體驗設計，而不是獲客量不夠。",
    confidence: "high",
    severity: "high",
    dimensions: ["conversion", "offer"],
    knowledgeIds: ["kb_activation_gap"]
  },
  {
    id: "rule_saas_feature_treadmill_before_fix",
    name: "啟用或轉換問題還沒解決，卻優先投入新功能",
    when: [
      { questionId: "saas_entry", operator: "equals", value: "feature_treadmill" },
      { questionId: "saas_d1_feature_vs_fix_priority", operator: "equals", value: "new_features" }
    ],
    hypothesisIds: ["feature_or_traffic_distraction"],
    conclusionTitle: "先別再加新功能了——現有漏斗還沒有被修好",
    conclusionReasoning: "在啟用或轉換率還沒改善之前持續開發新功能，等於是在同一個有漏洞的水管上一直加水，成長數字不會因此改善，反而會拖慢真正該優先處理的修復工作。",
    confidence: "high",
    severity: "high",
    dimensions: ["system"],
    knowledgeIds: ["kb_distraction_before_core_fix"]
  },

  // ===== 尚未創業：過早投入品牌／廣告（測試案例 E）=====
  {
    id: "rule_prelaunch_premature_investment",
    name: "需求還沒驗證，資源卻已經投入品牌或廣告",
    when: [
      { questionId: "prelaunch_validation", operator: "equals", value: "no" },
      { questionId: "prelaunch_spending", operator: "equals", value: ["branding", "ads_plan"] }
    ],
    hypothesisIds: ["demand_unvalidated", "premature_investment"],
    conclusionTitle: "現在最優先的不是品牌或廣告，是先找到願意付錢的第一批人",
    conclusionReasoning: "還沒有和真實潛在客戶對話驗證需求，卻已經把資源投入品牌識別或廣告規劃，代表這些投入建立在未經證實的假設上——一旦方向需要調整，這些投入很可能需要重做。",
    confidence: "high",
    severity: "high",
    dimensions: ["market", "brand"],
    knowledgeIds: ["kb_demand_unvalidated"]
  },

  // ===== 通用：數據可視性不足（不評價，只分類）=====
  {
    id: "rule_data_blindness_reframe",
    name: "不知道自己的數據，是可視性問題，不是表現問題",
    when: [{ questionId: "g1_analytics_setup", operator: "notEquals", value: "yes" }],
    hypothesisIds: ["data_blindness"],
    conclusionTitle: "目前還沒辦法判斷問題出在流量、轉換還是回購",
    conclusionReasoning: "沒有基礎追蹤工具，不代表表現差，而是決策缺乏事實依據。這應該被優先分類為「先建立可視性」，而不是被當成一項需要被檢討的弱點。",
    confidence: "medium",
    severity: "medium",
    dimensions: ["system"],
    knowledgeIds: ["kb_data_blindness"]
  }
];

/** @param {string} id @returns {DiagnosticRule|undefined} */
export function getDiagnosticRuleById(id) {
  return diagnosticRules.find((r) => r.id === id);
}
