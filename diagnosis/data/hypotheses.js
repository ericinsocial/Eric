/**
 * ===== 假設目錄 =====
 * @typedef {import('../types/diagnosis.js').Hypothesis} Hypothesis
 *
 * 這是整個診斷系統的「懷疑清單」。每一題的 hypothesis 欄位、每一條
 * DiagnosticRule 的 hypothesisIds、每一條 IndustryJourney 路徑的
 * primaryHypothesisIds，最後都會指回這裡的其中幾個 id。
 *
 * 結果頁（Phase 4）呈現的「主要瓶頸」本質上就是：目前證據最充分、
 * 優先順序最高的 Hypothesis，而不是「分數最低的維度」。
 *
 * @type {Hypothesis[]}
 */
export const hypotheses = [
  {
    id: "positioning_unclear",
    dimension: "positioning",
    title: "客群定位不清楚",
    description: "無法具體描述主要客戶是誰、有什麼需求，導致內容、廣告、銷售說法都難以聚焦。"
  },
  {
    id: "positioning_scattered",
    dimension: "positioning",
    title: "定位過於分散",
    description: "同時服務太多完全不同的客群，內容與服務流程被迫「一套說法打天下」，稀釋轉換效果。"
  },
  {
    id: "offer_value_gap",
    dimension: "offer",
    title: "價值主張與價格認知有落差",
    description: "客戶覺得貴，不是價格本身的問題，而是價值還沒有被具體、有說服力地說清楚。"
  },
  {
    id: "offer_no_ladder",
    dimension: "offer",
    title: "缺乏產品階梯",
    description: "沒有從入門到進階的自然路徑，客戶消費一次後沒有明確的下一步，客單價與終身價值卡住。"
  },
  {
    id: "brand_trust_deficit",
    dimension: "brand",
    title: "品牌信任不足",
    description: "客戶選擇的主要理由是價格而非信任或差異化，一旦出現更便宜的選項就會流失。"
  },
  {
    id: "brand_no_proof",
    dimension: "brand",
    title: "缺乏信任證明素材",
    description: "沒有案例、評價、實績等能讓陌生客戶快速產生信任的素材，拉長決策時間。"
  },
  {
    id: "channel_platform_dependency",
    dimension: "traffic",
    title: "過度依賴單一平台",
    description: "流量與客戶關係高度集中在第三方平台，資產不在自己手上，平台規則一變就直接受影響。"
  },
  {
    id: "traffic_wrong_audience",
    dimension: "traffic",
    title: "觸及族群並非目標客群",
    description: "曝光、互動數字看起來不錯，但吸引到的人跟真正會付費的目標客群不一致。"
  },
  {
    id: "traffic_not_converting",
    dimension: "conversion",
    title: "流量足夠但轉換設計不足",
    description: "不是缺曝光，而是現有流量沒有被引導到下一步；加大曝光只會讓更多人停在同一個沒有出口的地方。"
  },
  {
    id: "conversion_process_broken",
    dimension: "conversion",
    title: "銷售流程本身卡關",
    description: "報價、回覆速度、疑慮處理、流程斷點等環節出問題，導致詢問無法順利推進到成交。"
  },
  {
    id: "conversion_low_close_despite_inquiry",
    dimension: "conversion",
    title: "詢問量足夠但成交率低",
    description: "不缺詢問，缺的是把詢問變成成交的能力，問題出在轉換流程而不是流量。"
  },
  {
    id: "online_to_offline_gap",
    dimension: "conversion",
    title: "線上聲量佳但沒有轉換成實際上門／成交",
    description: "評價、追蹤數等線上訊號良好，卻沒有反映在實際客流或成交上——代表線上關注沒有被引導到具體行動。"
  },
  {
    id: "retention_no_system",
    dimension: "retention",
    title: "沒有回購／會員系統",
    description: "回購與否完全交給客戶自己記得，沒有名單、沒有提醒、沒有誘因，回購率長期偏低。"
  },
  {
    id: "acquisition_stalled_despite_retention",
    dimension: "traffic",
    title: "回購穩定但新客開發停滯",
    description: "既有客戶關係經營得不錯，但新客獲取管道薄弱或停滯，整體成長被新客數量卡住。"
  },
  {
    id: "data_blindness",
    dimension: "system",
    title: "數據可視性不足",
    description: "沒有基礎追蹤或不看數據，任何行銷判斷都只能憑感覺，也無法分辨問題出在流量、轉換還是回購。"
  },
  {
    id: "ads_no_tracking",
    dimension: "system",
    title: "廣告花費與成效脫鉤",
    description: "有投放廣告但沒有設定轉換追蹤，無法判斷廣告是否真的帶來詢問或成交。"
  },
  {
    id: "ads_dependency",
    dimension: "traffic",
    title: "業績過度依賴持續投放廣告",
    description: "沒有廣告幾乎沒有流量，成長沒有累積任何長期資產，只是租來的流量。"
  },
  {
    id: "capacity_ceiling",
    dimension: "system",
    title: "產能／人力上限",
    description: "行銷或業務高度依賴單一人力，一旦時間被占滿，成長就直接卡在產能天花板。"
  },
  {
    id: "demand_unvalidated",
    dimension: "market",
    title: "需求尚未驗證",
    description: "還沒有透過真實客戶對話確認這個需求存在，後續投入建立在未驗證的假設上。"
  },
  {
    id: "premature_investment",
    dimension: "brand",
    title: "過早投入品牌與廣告",
    description: "在需求還沒驗證之前，優先把資源花在品牌識別、網站、廣告等「看起來像正式營業」的項目。"
  },
  {
    id: "referral_dependency",
    dimension: "brand",
    title: "過度依賴口碑轉介紹",
    description: "業績穩定度取決於別人願不願意主動幫忙介紹，而不是可以自己掌握的獲客管道。"
  },
  {
    id: "productization_gap",
    dimension: "offer",
    title: "服務尚未產品化",
    description: "每次客製化報價、沒有標準方案，導致收入不穩定、也難以規模化超越「用時間換錢」。"
  },
  {
    id: "activation_gap",
    dimension: "conversion",
    title: "啟用率不足",
    description: "使用者註冊或到店之後，沒有完成能體驗到核心價值的關鍵行動，導致後續轉換與續用都偏低。"
  },
  {
    id: "feature_or_traffic_distraction",
    dimension: "system",
    title: "在核心問題解決前分散資源",
    description: "核心的啟用／轉換問題還沒解決，卻優先投入更多新功能開發或加大廣告曝光，等於放大同一個漏洞。"
  },
  {
    id: "weekday_demand_gap",
    dimension: "market",
    title: "離峰需求缺口",
    description: "假日或尖峰時段表現正常，但平日或離峰時段明顯不足，是特定時段的需求或行銷缺口，而非整體流量不足。"
  }
];

/** @param {string} id @returns {Hypothesis|undefined} */
export function getHypothesisById(id) {
  return hypotheses.find((h) => h.id === id);
}
