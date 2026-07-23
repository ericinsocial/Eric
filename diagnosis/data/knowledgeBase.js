/**
 * ===== Marketing Knowledge Base =====
 * @typedef {import('../types/diagnosis.js').KnowledgeEntry} KnowledgeEntry
 *
 * 規格五：這不是題目，是「每一個行銷問題背後真正的原因」。
 *
 * 結果頁（Phase 4）與 AI 潤飾（Phase 5）都應該從這裡取用 rootCauses 組句，
 * 而不是把解釋文字寫死在 component 或 prompt 裡——這樣同一個現象
 * （例如「Google 評價不佳」）不管出現在哪個產業、哪一條 DiagnosticRule，
 * 引用到的原因說明都是同一套、可以集中維護的內容。
 *
 * @type {KnowledgeEntry[]}
 */
export const knowledgeBase = [
  {
    id: "kb_google_review_weak",
    title: "Google 評價不佳或數量太少",
    category: "brand",
    summary: "陌生客戶決策前最常參考的信任訊號之一，評價差或評論數太少都會直接拉低轉換率。",
    rootCauses: [
      { cause: "服務體驗落差", explanation: "實際服務品質不穩定，或某個環節（等待時間、溝通、售後）持續讓客戶不滿。", relatedSignals: ["客戶疑慮反覆集中在同一個主題", "銷售流程中出現明顯的抱怨"] },
      { cause: "從未主動邀請評論", explanation: "滿意的客戶通常不會主動留評論，沒有主動邀請機制，評論數就會停留在早期的少數幾則。", relatedSignals: ["沒有售後跟進機制", "沒有標準化的邀請評論流程"] },
      { cause: "負評沒有被妥善回應", explanation: "未回應或處理不當的負評會被後續瀏覽者放大解讀，比負評本身更影響信任。", relatedSignals: ["缺乏處理負評的標準做法"] },
      { cause: "曝光基數太小", explanation: "來店或消費的人數本身就不多，即使滿意度高，能留下評論的絕對數量也會偏少。", relatedSignals: ["整體流量或來客數偏低"] }
    ],
    relatedHypothesisIds: ["brand_trust_deficit", "brand_no_proof"]
  },
  {
    id: "kb_online_signal_no_offline_conversion",
    title: "線上聲量好但沒有實際上門或成交",
    category: "conversion",
    summary: "評價、追蹤數、觸及等線上訊號正常，卻沒有反映在實際客流或營收上。",
    rootCauses: [
      { cause: "線上內容沒有明確的行動呼籲", explanation: "貼文、頁面只做曝光或品牌形象，沒有清楚引導「下一步該怎麼做」（訂位、私訊、點擊連結）。", relatedSignals: ["沒有明確 CTA"] },
      { cause: "線上關注者與實際消費客群不重疊", explanation: "追蹤、按讚的人可能是同行、朋友或路過流量，不是真正會消費的目標客群。", relatedSignals: ["互動的人跟目標客群不符"] },
      { cause: "從關注到行動之間的路徑太長或太模糊", explanation: "客戶想行動時（例如訂位、詢問）找不到明確、低摩擦的管道。", relatedSignals: ["聯絡或購買方式不明確", "沒有官網或穩定的聯絡入口"] },
      { cause: "特定時段或情境的需求缺口", explanation: "整體聲量沒問題，但特定時段（例如平日）本身的到店動機或誘因不足。", relatedSignals: ["假日與平日來客落差大"] }
    ],
    relatedHypothesisIds: ["online_to_offline_gap", "traffic_not_converting", "weekday_demand_gap"]
  },
  {
    id: "kb_high_traffic_low_conversion",
    title: "流量或詢問量足夠，但轉換率偏低",
    category: "conversion",
    summary: "不缺人看到，缺的是把看到的人變成客戶的機制。",
    rootCauses: [
      { cause: "缺乏清楚的下一步行動呼籲", explanation: "頁面或內容沒有明確告訴訪客現在該做什麼。", relatedSignals: ["沒有明確 CTA"] },
      { cause: "報價或方案不透明", explanation: "客戶需要額外詢問才能知道價格區間，拉長並增加了決策阻力，也讓不合適的名單混進來。", relatedSignals: ["價格不公開"] },
      { cause: "回應速度太慢", explanation: "詢問後的等待時間越長，購買意願下降得越快。", relatedSignals: ["回覆詢問的速度慢"] },
      { cause: "常見疑慮沒有被事先處理", explanation: "客戶的猶豫反覆卡在同一個問題上，卻沒有對應的說明或素材化解。", relatedSignals: ["同樣的疑慮反覆出現"] },
      { cause: "流量本身跟目標客群不符", explanation: "進來的人不是真正的潛在客戶，轉換率自然被拉低，這不是銷售能力的問題。", relatedSignals: ["詢問的人不符合目標客群"] }
    ],
    relatedHypothesisIds: ["conversion_low_close_despite_inquiry", "conversion_process_broken", "traffic_wrong_audience"]
  },
  {
    id: "kb_referral_dependency",
    title: "過度依賴熟客介紹",
    category: "brand",
    summary: "業績穩定度取決於別人願不願意主動幫忙說話，而不是可以自己掌握的獲客管道。",
    rootCauses: [
      { cause: "沒有建立其他穩定的獲客管道", explanation: "從未投入時間或預算經營官網、社群、廣告等自主管道，介紹成了唯一的來源。", relatedSignals: ["沒有官網", "沒有投放廣告", "沒有經營社群"] },
      { cause: "沒有把介紹系統化", explanation: "介紹完全隨機發生，沒有機制主動邀請或獎勵介紹，規模無法擴大。", relatedSignals: ["沒有轉介紹機制"] },
      { cause: "品牌本身缺乏可被陌生人快速理解的說法", explanation: "熟人介紹時可以口頭補充脈絡，但陌生客戶接觸不到這層解釋，轉換率會明顯較低。", relatedSignals: ["陌生客戶難以快速理解服務內容"] }
    ],
    relatedHypothesisIds: ["referral_dependency", "channel_platform_dependency"]
  },
  {
    id: "kb_positioning_unclear",
    title: "客群定位不清楚",
    category: "positioning",
    summary: "說不出主要客戶是誰、有什麼需求，導致所有行銷內容都難以聚焦。",
    rootCauses: [
      { cause: "同時想服務太多不同的人", explanation: "為了不放棄任何潛在客戶，內容與方案被迫變得通用、沒有針對性。", relatedSignals: ["同時服務五種以上不同客群"] },
      { cause: "從未系統化整理過現有客戶輪廓", explanation: "業務是憑經驗累積的，但沒有被歸納成清楚、可以拿來做內容或投放依據的描述。", relatedSignals: ["無法具體描述主要客戶"] },
      { cause: "產品本身定位就很廣泛", explanation: "產品或服務設計之初就沒有鎖定特定客群，導致行銷端很難收斂。", relatedSignals: ["收入來源分散在很多不同品項"] }
    ],
    relatedHypothesisIds: ["positioning_unclear", "positioning_scattered"]
  },
  {
    id: "kb_offer_value_gap",
    title: "客戶常覺得價格太高",
    category: "offer",
    summary: "問題通常不在價格本身，而在價值有沒有被具體、有說服力地說清楚。",
    rootCauses: [
      { cause: "價值主張停留在形容詞，不夠具體", explanation: "用「專業」「用心」等空泛詞彙描述，客戶無法連結到實際的效益或差異。", relatedSignals: ["講不出具體差異化"] },
      { cause: "沒有對比或錨點", explanation: "客戶沒有參考基準來理解「為什麼值這個價格」，只能直接比價格數字。", relatedSignals: ["缺乏案例或成果證明"] },
      { cause: "產品／方案本身缺乏清楚的階梯", explanation: "客戶被迫直接面對一個較高的價格點，缺乏低門檻的入門選項先建立信任。", relatedSignals: ["沒有入門、核心、高價方案的區分"] }
    ],
    relatedHypothesisIds: ["offer_value_gap", "offer_no_ladder", "brand_no_proof"]
  },
  {
    id: "kb_platform_dependency",
    title: "流量與客戶關係過度集中在單一平台",
    category: "traffic",
    summary: "沒有自己的官網或名單，客戶關係完全建立在第三方平台規則之上。",
    rootCauses: [
      { cause: "從未投入建立自有的流量資產", explanation: "官網、Email、會員名單等自己能掌握的資產一直被視為「之後再說」。", relatedSignals: ["沒有官網", "沒有 CRM 或名單系統"] },
      { cause: "單一平台早期效果太好，缺乏轉移誘因", explanation: "因為某個平台一開始帶來不錯的成效，導致資源長期只投入這一個管道。", relatedSignals: ["流量集中在單一平台"] }
    ],
    relatedHypothesisIds: ["channel_platform_dependency", "ads_dependency"]
  },
  {
    id: "kb_ads_no_tracking",
    title: "有投放廣告但沒有轉換追蹤",
    category: "system",
    summary: "廣告花費與實際成效完全脫鉤，無法判斷是否划算。",
    rootCauses: [
      { cause: "從未設定 Pixel／轉換事件", explanation: "廣告帳戶本身沒有串接追蹤工具，平台演算法也因此無法針對真正的轉換目標優化。", relatedSignals: ["沒有設定轉換追蹤"] },
      { cause: "轉換行為發生在無法追蹤的管道", explanation: "例如客戶改用電話或到店直接消費，這類轉換天生就難以用單一像素追蹤到。", relatedSignals: ["主要成交方式難以線上追蹤"] },
      { cause: "沒有查看數據的習慣", explanation: "即使設定了追蹤，也沒有定期查看與調整，效果等同於沒有追蹤。", relatedSignals: ["不會定期查看行銷數據"] }
    ],
    relatedHypothesisIds: ["ads_no_tracking", "data_blindness"]
  },
  {
    id: "kb_social_reach_no_cta",
    title: "社群有觸及、有互動，但沒有成效",
    category: "conversion",
    summary: "觸及與互動數字好看，卻沒有轉換成詢問或訂單。",
    rootCauses: [
      { cause: "內容目標從一開始就不清楚", explanation: "經營社群沒有明確要達成什麼（品牌、導購、招募），內容方向因此發散。", relatedSignals: ["經營社群的目標不明確"] },
      { cause: "貼文缺乏明確的下一步行動呼籲", explanation: "內容停留在單向分享，沒有引導讀者留言、私訊、點擊或訂位。", relatedSignals: ["貼文沒有明確 CTA"] },
      { cause: "互動的人不是目標客群", explanation: "觸及演算法把內容推給廣泛受眾，願意互動的人不一定是會消費的人。", relatedSignals: ["互動的人跟目標客群不符"] }
    ],
    relatedHypothesisIds: ["traffic_not_converting", "traffic_wrong_audience"]
  },
  {
    id: "kb_retention_no_system",
    title: "客戶很少回購",
    category: "retention",
    summary: "回購與否完全交給客戶自己記得，沒有系統支撐。",
    rootCauses: [
      { cause: "沒有保存客戶資料", explanation: "連基本的購買紀錄與聯絡方式都沒有留下，喚回動作根本無從執行。", relatedSignals: ["沒有 CRM 或名單系統"] },
      { cause: "沒有主動提醒或誘因", explanation: "即使產品有自然的回購週期，也沒有任何機制在對的時間點提醒客戶。", relatedSignals: ["不會主動提醒客戶回購"] },
      { cause: "交易結束後關係就中斷", explanation: "沒有售後或後續接觸，客戶容易在下次需求出現時忘記你。", relatedSignals: ["交易後沒有後續接觸"] },
      { cause: "產品本身沒有自然回購週期", explanation: "某些一次性、高單價服務本來就不該用回購率來評價，需要先確認這一點再下判斷。", relatedSignals: ["產品屬於一次性交易"] }
    ],
    relatedHypothesisIds: ["retention_no_system"]
  },
  {
    id: "kb_retention_good_acquisition_stalled",
    title: "回購穩定但新客很少",
    category: "traffic",
    summary: "既有客戶經營得不錯，但新客開發管道薄弱或停滯。",
    rootCauses: [
      { cause: "長期依賴同一批舊客戶，沒有持續投入獲客", explanation: "資源與精力優先放在維繫現有關係，新客開發被長期擱置。", relatedSignals: ["舊客戶營收占比極高"] },
      { cause: "獲客管道單一且沒有擴張", explanation: "只靠原本奏效的一個管道（例如熟客介紹），沒有測試其他管道。", relatedSignals: ["過度依賴介紹", "流量來源單一"] }
    ],
    relatedHypothesisIds: ["acquisition_stalled_despite_retention", "referral_dependency"]
  },
  {
    id: "kb_data_blindness",
    title: "不知道問題出在流量、轉換還是回購",
    category: "system",
    summary: "這不是表現差，而是決策可視性不足——沒有數據可以判斷問題真正的位置。",
    rootCauses: [
      { cause: "從未設定基礎追蹤工具", explanation: "連最基本的流量或轉換數字都沒有被記錄下來。", relatedSignals: ["沒有設定 GA4 或其他追蹤工具"] },
      { cause: "有工具但沒有查看的習慣", explanation: "追蹤已經存在，但沒有被納入日常或週期性的營運習慣中。", relatedSignals: ["不會定期查看數據"] },
      { cause: "詢問或成交沒有被歸因到來源", explanation: "就算知道流量數字，也不知道哪些流量真正變成了詢問或訂單。", relatedSignals: ["沒有紀錄詢問來源"] }
    ],
    relatedHypothesisIds: ["data_blindness"]
  },
  {
    id: "kb_capacity_ceiling",
    title: "業務高度依賴單一人力",
    category: "system",
    summary: "成長被綁在一個人的時間與精力上限。",
    rootCauses: [
      { cause: "關鍵知識與客戶關係都只在一個人身上", explanation: "沒有標準流程或文件化，導致工作無法轉移或分攤。", relatedSignals: ["沒有標準流程", "行銷或業務高度依賴單一個人"] },
      { cause: "缺乏自動化或工具輔助", explanation: "重複性工作仍然全靠人工處理，占用大量本可以用來擴張的時間。", relatedSignals: ["沒有使用自動化工具"] }
    ],
    relatedHypothesisIds: ["capacity_ceiling"]
  },
  {
    id: "kb_demand_unvalidated",
    title: "需求尚未經過驗證",
    category: "market",
    summary: "還沒有和真實潛在客戶對話確認需求存在，就投入品牌與行銷資源。",
    rootCauses: [
      { cause: "跳過訪談直接進入執行階段", explanation: "把「我覺得市場需要」當成已經驗證的事實，沒有實際找目標客戶確認。", relatedSignals: ["尚未和潛在客戶對話驗證"] },
      { cause: "資源優先花在看起來像正式營業的項目", explanation: "品牌識別、網站等「看得見的進度」比驗證需求更容易讓人有安全感，但風險更高。", relatedSignals: ["資源優先花在品牌或網站"] }
    ],
    relatedHypothesisIds: ["demand_unvalidated", "premature_investment"]
  },
  {
    id: "kb_productization_gap",
    title: "服務尚未產品化",
    category: "offer",
    summary: "每次客製報價、沒有標準方案，導致收入不穩定，也難以規模化。",
    rootCauses: [
      { cause: "服務內容因人因案而異，從未標準化", explanation: "每個客戶的服務範圍、交付方式都不同，難以複製與定價。", relatedSignals: ["每次客製化報價"] },
      { cause: "過度依賴一對一服務時間", explanation: "收入與投入的時間直接綁定，產能上限就是收入上限。", relatedSignals: ["只能一對一服務"] }
    ],
    relatedHypothesisIds: ["productization_gap", "capacity_ceiling"]
  },
  {
    id: "kb_activation_gap",
    title: "使用者進來了，但沒有完成關鍵行動",
    category: "conversion",
    summary: "註冊、到店、加入的人不少，但沒有體驗到核心價值，後續轉換與續用自然偏低。",
    rootCauses: [
      { cause: "引導流程沒有聚焦在單一關鍵行動", explanation: "一開始就丟出太多功能或選項，使用者不知道第一步該做什麼。", relatedSignals: ["缺乏清楚的入門引導"] },
      { cause: "核心價值需要一定門檻才能體驗到", explanation: "價值的展現需要使用者投入一定設定或使用時間，但目前的流程沒有幫助他們跨過這個門檻。", relatedSignals: ["核心操作完成率低"] }
    ],
    relatedHypothesisIds: ["activation_gap"]
  },
  {
    id: "kb_distraction_before_core_fix",
    title: "核心問題還沒解決，卻優先擴大投入",
    category: "system",
    summary: "在啟用或轉換問題還沒修好之前，優先加開新功能或加大廣告曝光，等於放大同一個漏洞。",
    rootCauses: [
      { cause: "把「量不夠」誤判為問題根源", explanation: "實際問題是既有流量／使用者沒有被妥善轉換，而不是量不夠多。", relatedSignals: ["轉換或啟用率低但持續加大投放或開發"] }
    ],
    relatedHypothesisIds: ["feature_or_traffic_distraction", "traffic_not_converting", "activation_gap"]
  }
];

/** @param {string} id @returns {KnowledgeEntry|undefined} */
export function getKnowledgeEntryById(id) {
  return knowledgeBase.find((k) => k.id === id);
}

/** @param {string} hypothesisId @returns {KnowledgeEntry[]} */
export function getKnowledgeEntriesForHypothesis(hypothesisId) {
  return knowledgeBase.filter((k) => (k.relatedHypothesisIds || []).includes(hypothesisId));
}
