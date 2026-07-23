/**
 * ===== Industry Journey =====
 * @typedef {import('../types/diagnosis.js').IndustryJourney} IndustryJourney
 * @typedef {import('../types/diagnosis.js').Question} Question
 *
 * 規格一／二：這不是題庫，是決策樹。每個產業的 entryQuestion 取代通用的
 * 「目前最大的經營困難是什麼？」（a4_biggest_problem，見 commonQuestions.js
 * 的 supersededByJourney 旗標），問法與選項都針對該產業設計；不同入口答案
 * 會走向完全不同的問題路徑，而不是所有人都回答同一套通用題。
 *
 * 目前先完整建立 5 個測試案例產業（餐飲／電商／顧問／SaaS／尚未創業，對應
 * 規格二十一的 5 個測試情境），其餘產業維持使用通用的 a4_biggest_problem
 * 入口與追問鏈（fu_social_*／fu_manyinquiry_*／fu_repurchase_*／
 * fu_nodata_1）——這些通用追問鏈本身已經是簡化版的 journey，之後要幫其他
 * 產業建立專屬 Journey 時，可以參照這裡的模式：
 *   1. 用 4 個左右、彼此語意上互斥的選項當作入口
 *   2. 每個選項 followUpQuestionIds 指向該路徑的第一題（可以是新題目，
 *      也可以直接重用既有的共通題／追問鏈，例如 f1_repurchase、fu_ads_1）
 *   3. 在 paths[] 裡用文件化的方式寫清楚這條路徑主要在驗證哪個 Hypothesis
 *
 * @type {IndustryJourney[]}
 */
export const industryJourneys = [
  {
    industryId: "restaurant",
    entryQuestion: {
      id: "restaurant_entry",
      dimension: "system",
      question: "先問最重要的一件事：目前最讓你困擾的是什麼？",
      description: "選一個最主要的，後面會針對這個狀況深入了解，不會問一堆跟你無關的題目",
      answerType: "single",
      whyAsking: "作為整個對話的入口，依照實際困擾分流到完全不同的驗證路徑，而不是讓所有餐飲業者回答同一套題目。",
      hypothesis: "選擇的入口決定了後續要驗證流量問題、客單價問題、回流問題還是產能問題——四條路徑背後懷疑的原因完全不同。",
      options: [
        { value: "few_customers", label: "沒什麼客人上門" },
        { value: "low_ticket", label: "有客人，但客單價偏低" },
        { value: "low_repeat", label: "有客人，但很少回流" },
        { value: "operational_burnout", label: "每天都很忙很累，但賺得不多" }
      ],
      scoring: {
        few_customers: [{ dimension: "traffic", points: -6, kind: "negativeScore", severity: "medium" }],
        low_ticket: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "medium" }],
        low_repeat: [{ dimension: "retention", points: -6, kind: "negativeScore", severity: "medium" }],
        operational_burnout: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "medium" }]
      },
      followUpQuestionIds: {
        few_customers: ["rest_a1_google_reviews"],
        low_ticket: ["rest_b1_ticket_awareness"],
        low_repeat: ["f1_repurchase"],
        operational_burnout: ["g7_single_person_dependency"]
      },
      priority: 4,
      tags: ["restaurant", "journey-entry"],
      section: "basic",
      applicableIndustries: ["restaurant"]
    },
    paths: [
      {
        entryValue: "few_customers",
        label: "沒什麼客人上門",
        description: "驗證這是整體流量不足、離峰時段缺口，還是線上聲量沒有被轉換成實際上門的行動。",
        primaryHypothesisIds: ["online_to_offline_gap", "weekday_demand_gap", "traffic_not_converting"],
        questionIds: ["rest_a1_google_reviews", "rest_a2_social_following", "rest_a3_weekday_weekend_gap", "rest_a4_online_to_action"]
      },
      {
        entryValue: "low_ticket",
        label: "有客人，但客單價偏低",
        description: "驗證客單價偏低是因為沒有追蹤、還是根本沒有設計加購／套餐等提升客單價的選項。",
        primaryHypothesisIds: ["offer_no_ladder", "offer_value_gap"],
        questionIds: ["rest_b1_ticket_awareness", "rest_b2_addon_offer"]
      },
      {
        entryValue: "low_repeat",
        label: "有客人，但很少回流",
        description: "重用既有的回購率追問鏈，驗證是否有名單、提醒、誘因等回購機制。",
        primaryHypothesisIds: ["retention_no_system"],
        questionIds: ["f1_repurchase", "fu_repurchase_1", "fu_repurchase_2", "fu_repurchase_3", "fu_repurchase_4", "fu_repurchase_5"]
      },
      {
        entryValue: "operational_burnout",
        label: "每天都很忙很累，但賺得不多",
        description: "驗證是否過度依賴單一人力、缺乏標準流程，導致成長被產能天花板卡住。",
        primaryHypothesisIds: ["capacity_ceiling"],
        questionIds: ["g7_single_person_dependency", "g8_standard_process"]
      }
    ]
  },
  {
    industryId: "ecommerce",
    entryQuestion: {
      id: "ecommerce_entry",
      dimension: "system",
      question: "先問最重要的一件事：目前最讓你困擾的是什麼？",
      description: "選一個最主要的，後面會針對這個狀況深入了解",
      answerType: "single",
      whyAsking: "把電商最常見的四種困擾分流成完全不同的驗證路徑，而不是不分青紅皂白地問完整套漏斗題目。",
      hypothesis: "廣告賺不到錢、商品頁轉換低、回購低、看不懂數據，背後對應的分別是廣告效率、頁面信任與摩擦、留存機制、數據可視性四種不同問題。",
      options: [
        { value: "ads_not_profitable", label: "廣告開了，但賺不到什麼錢" },
        { value: "low_pdp_conversion", label: "流量進來，但很少加購物車或結帳" },
        { value: "low_repurchase", label: "買過的人，很少回購" },
        { value: "data_blindness", label: "不知道錢花在哪裡才有效" }
      ],
      scoring: {
        ads_not_profitable: [{ dimension: "traffic", points: -4, kind: "negativeScore", severity: "medium" }],
        low_pdp_conversion: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "medium" }],
        low_repurchase: [{ dimension: "retention", points: -6, kind: "negativeScore", severity: "medium" }],
        data_blindness: [{ dimension: "system", points: -6, kind: "negativeScore", severity: "medium" }]
      },
      followUpQuestionIds: {
        ads_not_profitable: ["fu_ads_1"],
        low_pdp_conversion: ["ec_b1_pdp_trust"],
        low_repurchase: ["f1_repurchase"],
        data_blindness: ["fu_nodata_1"]
      },
      priority: 4,
      tags: ["ecommerce", "journey-entry"],
      section: "basic",
      applicableIndustries: ["ecommerce"]
    },
    paths: [
      {
        entryValue: "ads_not_profitable",
        label: "廣告開了，但賺不到什麼錢",
        description: "重用既有的廣告追問鏈，驗證是否有轉換追蹤、是否知道 ROAS、停廣告後是否還有自然流量。",
        primaryHypothesisIds: ["ads_no_tracking", "ads_dependency"],
        questionIds: ["fu_ads_1", "fu_ads_2", "fu_ads_3", "fu_ads_4", "fu_ads_5", "fu_ads_6", "fu_ads_7"]
      },
      {
        entryValue: "low_pdp_conversion",
        label: "流量進來，但很少加購物車或結帳",
        description: "驗證商品頁是否具備信任元素、結帳流程是否有不必要的摩擦。",
        primaryHypothesisIds: ["brand_no_proof", "traffic_not_converting"],
        questionIds: ["ec_b1_pdp_trust", "ec_b2_checkout_friction"]
      },
      {
        entryValue: "low_repurchase",
        label: "買過的人，很少回購",
        description: "重用既有的回購率追問鏈。",
        primaryHypothesisIds: ["retention_no_system"],
        questionIds: ["f1_repurchase", "fu_repurchase_1", "fu_repurchase_2", "fu_repurchase_3", "fu_repurchase_4", "fu_repurchase_5"]
      },
      {
        entryValue: "data_blindness",
        label: "不知道錢花在哪裡才有效",
        description: "重用既有的「不知道數據」追問鏈，先幫助使用者釐清最想看懂的環節，而不是評價他。",
        primaryHypothesisIds: ["data_blindness"],
        questionIds: ["fu_nodata_1"]
      }
    ]
  },
  {
    industryId: "consultant",
    entryQuestion: {
      id: "consultant_entry",
      dimension: "system",
      question: "先問最重要的一件事：目前最讓你困擾的是什麼？",
      description: "選一個最主要的，後面會針對這個狀況深入了解",
      answerType: "single",
      whyAsking: "顧問／自由工作者最常見的困擾往往互相糾結（案源、報價、成交、免費諮詢），先分流才能問到真正對的問題。",
      hypothesis: "案源不穩定、報價很累、詢問多不簽約、免費諮詢沒轉換，背後分別對應獲客管道、產品化程度、銷售流程、免費機制設計四種不同問題。",
      options: [
        { value: "referral_only", label: "案源不穩定，幾乎都靠別人介紹" },
        { value: "custom_quoting", label: "每次都要重新報價，很累" },
        { value: "many_inquiries_low_close", label: "詢問的人不少，但很少真的簽約" },
        { value: "free_consult_no_convert", label: "免費諮詢做很多，但很少轉換" }
      ],
      scoring: {
        referral_only: [{ dimension: "traffic", points: -4, kind: "negativeScore", severity: "medium" }],
        custom_quoting: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "medium" }],
        many_inquiries_low_close: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "medium" }],
        free_consult_no_convert: [{ dimension: "conversion", points: -6, kind: "negativeScore", severity: "medium" }]
      },
      followUpQuestionIds: {
        referral_only: ["fu_referral_1"],
        custom_quoting: ["con_b1_has_packages"],
        many_inquiries_low_close: ["fu_manyinquiry_1"],
        free_consult_no_convert: ["con_d1_free_consult_volume"]
      },
      priority: 4,
      tags: ["consultant", "journey-entry"],
      section: "basic",
      applicableIndustries: ["consultant"]
    },
    paths: [
      {
        entryValue: "referral_only",
        label: "案源不穩定，幾乎都靠別人介紹",
        description: "重用既有的轉介紹依賴追問鏈。",
        primaryHypothesisIds: ["referral_dependency"],
        questionIds: ["fu_referral_1"]
      },
      {
        entryValue: "custom_quoting",
        label: "每次都要重新報價，很累",
        description: "驗證服務是否已經產品化，以及客製報價實際拖慢了多少銷售速度。",
        primaryHypothesisIds: ["productization_gap"],
        questionIds: ["con_b1_has_packages", "con_b2_quote_time"]
      },
      {
        entryValue: "many_inquiries_low_close",
        label: "詢問的人不少，但很少真的簽約",
        description: "重用既有的詢問多成交少追問鏈。",
        primaryHypothesisIds: ["conversion_process_broken", "conversion_low_close_despite_inquiry"],
        questionIds: ["fu_manyinquiry_1", "fu_manyinquiry_2", "fu_manyinquiry_3", "fu_manyinquiry_4", "fu_manyinquiry_5"]
      },
      {
        entryValue: "free_consult_no_convert",
        label: "免費諮詢做很多，但很少轉換",
        description: "驗證免費諮詢是否真的在篩選與培養客戶，還是純粹消耗時間。",
        primaryHypothesisIds: ["conversion_process_broken", "capacity_ceiling"],
        questionIds: ["con_d1_free_consult_volume"]
      }
    ]
  },
  {
    industryId: "saas",
    entryQuestion: {
      id: "saas_entry",
      dimension: "system",
      question: "先問最重要的一件事：目前最讓你困擾的是什麼？",
      description: "選一個最主要的，後面會針對這個狀況深入了解",
      answerType: "single",
      whyAsking: "SaaS 的成長瓶頸幾乎都卡在漏斗的不同環節（啟用、付費轉換、留存、資源分配），先分流才能問到真正卡住的地方。",
      hypothesis: "註冊沒啟用、試用沒付費、付費會流失、一直做新功能，分別對應啟用設計、價值體驗時機、流失原因、資源分配四種不同問題。",
      options: [
        { value: "low_activation", label: "註冊很多，但很少真的開始用" },
        { value: "low_trial_to_paid", label: "有人在用，但付費轉換很低" },
        { value: "high_churn", label: "有付費，但流失率偏高" },
        { value: "feature_treadmill", label: "一直在做新功能，但成長沒有起色" }
      ],
      scoring: {
        low_activation: [{ dimension: "conversion", points: -8, kind: "negativeScore", severity: "high" }],
        low_trial_to_paid: [{ dimension: "offer", points: -6, kind: "negativeScore", severity: "medium" }],
        high_churn: [{ dimension: "retention", points: -6, kind: "negativeScore", severity: "medium" }],
        feature_treadmill: [{ dimension: "system", points: -8, kind: "negativeScore", severity: "high" }]
      },
      followUpQuestionIds: {
        low_activation: ["saas_a1_onboarding_guidance"],
        low_trial_to_paid: ["saas_b1_paywall_clarity"],
        high_churn: ["f4_know_churn_reason"],
        feature_treadmill: ["saas_d1_feature_vs_fix_priority"]
      },
      priority: 4,
      tags: ["saas", "journey-entry"],
      section: "basic",
      applicableIndustries: ["saas"]
    },
    paths: [
      {
        entryValue: "low_activation",
        label: "註冊很多，但很少真的開始用",
        description: "驗證是否有清楚的啟用引導，以及團隊是否清楚定義核心價值動作。",
        primaryHypothesisIds: ["activation_gap"],
        questionIds: ["saas_a1_onboarding_guidance", "saas_a2_core_action_clarity"]
      },
      {
        entryValue: "low_trial_to_paid",
        label: "有人在用，但付費轉換很低",
        description: "驗證使用者是否在付費前就已經體驗到具體價值。",
        primaryHypothesisIds: ["offer_value_gap", "activation_gap"],
        questionIds: ["saas_b1_paywall_clarity"]
      },
      {
        entryValue: "high_churn",
        label: "有付費，但流失率偏高",
        description: "重用既有的流失原因追問題。",
        primaryHypothesisIds: ["retention_no_system"],
        questionIds: ["f4_know_churn_reason"]
      },
      {
        entryValue: "feature_treadmill",
        label: "一直在做新功能，但成長沒有起色",
        description: "驗證資源分配是否對齊真正的瓶頸——在啟用／轉換問題還沒解決前繼續加開功能，等於放大同一個漏洞。",
        primaryHypothesisIds: ["feature_or_traffic_distraction"],
        questionIds: ["saas_d1_feature_vs_fix_priority"]
      }
    ]
  },
  {
    industryId: "prelaunch",
    entryQuestion: {
      id: "prelaunch_entry",
      dimension: "market",
      question: "先問最重要的一件事：目前卡住你的主要是什麼？",
      description: "選一個最主要的，後面會針對這個狀況深入了解",
      answerType: "single",
      whyAsking: "還沒開始營業的使用者，卡住的原因差異很大——有人是需求沒驗證，有人是已經開始花錢卻方向錯了，先分流才不會用同一套邏輯評價每個人。",
      hypothesis: "需求不確定、已經在花錢、不知道客戶從哪來、想清楚但沒開始，分別對應需求驗證、資源投入順序、通路規劃、行動門檻四種不同問題。",
      options: [
        { value: "demand_unknown", label: "還不確定真的有人會買" },
        { value: "premature_spending", label: "已經開始花錢在品牌或網站" },
        { value: "no_first_customers", label: "不知道第一批客戶從哪裡來" },
        { value: "ready_not_started", label: "想清楚了，但還沒開始執行" }
      ],
      scoring: {
        demand_unknown: [{ dimension: "market", points: -8, kind: "negativeScore", severity: "high" }],
        premature_spending: [{ dimension: "brand", points: -8, kind: "negativeScore", severity: "high" }],
        no_first_customers: [{ dimension: "market", points: -6, kind: "negativeScore", severity: "medium" }],
        ready_not_started: [{ dimension: "market", points: -2, kind: "negativeScore", severity: "low" }]
      },
      followUpQuestionIds: {
        demand_unknown: ["prelaunch_validation"],
        premature_spending: ["prelaunch_spending"],
        no_first_customers: ["pre_c1_first_customer_channel"],
        ready_not_started: ["pre_d1_blocking_reason"]
      },
      priority: 4,
      tags: ["prelaunch", "journey-entry"],
      section: "basic",
      applicableIndustries: ["prelaunch"],
      applicableStages: ["idea", "preparing"]
    },
    paths: [
      {
        entryValue: "demand_unknown",
        label: "還不確定真的有人會買",
        description: "重用既有的需求驗證追問題。",
        primaryHypothesisIds: ["demand_unvalidated"],
        questionIds: ["prelaunch_validation"]
      },
      {
        entryValue: "premature_spending",
        label: "已經開始花錢在品牌或網站",
        description: "重用既有的資源分配追問題，檢查順序是否顛倒。",
        primaryHypothesisIds: ["premature_investment"],
        questionIds: ["prelaunch_spending"]
      },
      {
        entryValue: "no_first_customers",
        label: "不知道第一批客戶從哪裡來",
        description: "驗證是否有具體、可執行的第一批客戶接觸管道。",
        primaryHypothesisIds: ["demand_unvalidated"],
        questionIds: ["pre_c1_first_customer_channel"]
      },
      {
        entryValue: "ready_not_started",
        label: "想清楚了，但還沒開始執行",
        description: "找出真正卡住行動的原因，是缺第一步、缺資源，還是缺信心。",
        primaryHypothesisIds: ["demand_unvalidated"],
        questionIds: ["pre_d1_blocking_reason"]
      }
    ]
  }
];

/** @param {string} industryId @returns {IndustryJourney|undefined} */
export function getIndustryJourney(industryId) {
  return industryJourneys.find((j) => j.industryId === industryId);
}
