/**
 * ===== 診斷洞察文字模板 =====
 * @typedef {import('../types/diagnosis.js').Insight} Insight
 *
 * 每一筆對應 commonQuestions.js（及未來 industryQuestions.js）scoring 規則裡
 * 引用的 insightId。bottleneckEngine／recommendationEngine（Phase 3）會依照
 * 觸發的 insightId 挑選對應模板，組成結果頁（Phase 4）的「為什麼」「證據」
 * 「風險」「不要做的事」文字——不是由 AI 自由生成，AI（Phase 5）只能在這些
 * 已經定案的判斷基礎上潤飾語氣，不能改變判斷本身（見規格十三）。
 *
 * template 可包含簡單佔位符（例如 {{industry}}），由呼叫端自行替換；
 * 目前 Phase 1 先不做佔位符替換邏輯，模板本身維持可獨立閱讀的完整句子。
 *
 * @type {Insight[]}
 */
export const insights = [
  {
    id: "offer_too_scattered",
    type: "bottleneck",
    dimension: "offer",
    title: "產品或服務組合過於分散",
    template: "你目前提供的產品或服務項目較為分散，客戶不容易一眼看懂該從哪裡開始，也增加了你自己在說明與銷售時的難度。"
  },
  {
    id: "risk_revenue_declining",
    type: "risk",
    dimension: "market",
    title: "營收呈現下滑趨勢",
    template: "營收目前處於下滑趨勢，代表某個環節已經出問題一段時間，建議優先釐清是流量、轉換還是回購出現變化，而不是急著擴大投入。"
  },
  {
    id: "system_no_visibility",
    type: "bottleneck",
    dimension: "system",
    title: "缺乏數據可視性，難以判斷問題出在哪個環節",
    template: "你目前沒有穩定在看數據，這代表任何行銷判斷都只能憑感覺，也無法分辨問題究竟出在流量不夠、轉換不好，還是回購太低。"
  },
  {
    id: "positioning_unclear",
    type: "bottleneck",
    dimension: "positioning",
    title: "目標客群輪廓不清楚",
    template: "你目前還沒有一個明確、具體的主要客群描述，這會讓後續的內容、廣告與銷售說法都很難聚焦。"
  },
  {
    id: "brand_price_only",
    type: "bottleneck",
    dimension: "brand",
    title: "客戶只因價格選擇，缺乏品牌信任",
    template: "客戶目前選擇你的主要原因是價格，而不是信任或差異化，這代表一旦有更便宜的選擇出現，你很容易流失客戶。"
  },
  {
    id: "positioning_hard_to_grasp",
    type: "bottleneck",
    dimension: "positioning",
    title: "客戶難以快速理解你的服務",
    template: "陌生客戶沒辦法在短時間內理解你在做什麼、適合誰，這通常會直接拉低廣告與內容的轉換效果。"
  },
  {
    id: "positioning_too_scattered",
    type: "bottleneck",
    dimension: "positioning",
    title: "同時服務過多不同客群，定位分散",
    template: "你同時服務好幾種需求完全不同的客群，這會讓行銷內容、定價與服務流程都很難統一，也讓每一種客群都覺得你不是「為他而做」。"
  },
  {
    id: "offer_no_ladder",
    type: "bottleneck",
    dimension: "offer",
    title: "缺乏產品階梯，難以提升客單價",
    template: "你目前沒有從入門到進階的產品或服務階梯，客戶消費完一次之後，沒有自然的下一步可以走，客單價與終身價值都容易卡住。"
  },
  {
    id: "offer_value_gap",
    type: "bottleneck",
    dimension: "offer",
    title: "價值主張與價格認知有落差",
    template: "客戶對你的價格反應顯示，他們還沒有真正理解這個價格背後對應的價值，問題通常不在價格本身，而在價值有沒有被說清楚。"
  },
  {
    id: "traffic_no_website",
    type: "bottleneck",
    dimension: "traffic",
    title: "缺乏官網，過度依賴平台",
    template: "你目前沒有自己的官網，客戶認識你、了解你、聯絡你的管道完全建立在第三方平台上，長期會限制你能做的行銷動作。"
  },
  {
    id: "risk_platform_dependency",
    type: "risk",
    dimension: "traffic",
    title: "過度依賴單一平台",
    template: "你的曝光與名單來源高度集中在單一平台，一旦該平台規則改變、觸及下降或帳號被限制，你的業績會直接受到影響。"
  },
  {
    id: "conversion_low_close_rate",
    type: "bottleneck",
    dimension: "conversion",
    title: "詢問量足夠但成交率偏低",
    template: "你其實不缺詢問，缺的是把詢問變成成交的流程——報價、回覆速度或銷售說法中，可能有某個環節正在流失客戶。"
  },
  {
    id: "conversion_no_cta",
    type: "bottleneck",
    dimension: "conversion",
    title: "內容或流量缺乏明確行動呼籲",
    template: "你的內容或流量有一定觸及，但沒有明確引導對方下一步該做什麼，等於把已經願意注意你的人留在原地。"
  },
  {
    id: "brand_no_proof",
    type: "bottleneck",
    dimension: "brand",
    title: "缺乏信任證明素材",
    template: "你目前缺乏能讓陌生客戶快速產生信任的證明素材（例如評價、案例、實績），這會拉長決策時間、降低轉換率。"
  },
  {
    id: "retention_low_repurchase",
    type: "bottleneck",
    dimension: "retention",
    title: "回購率偏低",
    template: "客戶消費一次之後很少再回來，代表你目前的獲客成本必須靠不斷開發新客戶來攤提，成長會比同業更辛苦。"
  },
  {
    id: "system_no_crm",
    type: "bottleneck",
    dimension: "system",
    title: "缺乏客戶資料管理機制",
    template: "你目前沒有系統化保存客戶資料，這代表就算有機會做回購喚回、會員經營或精準行銷，也缺乏可以執行的名單基礎。"
  },
  {
    id: "system_key_person_risk",
    type: "risk",
    dimension: "system",
    title: "過度依賴單一人力",
    template: "目前業務高度依賴你一個人（或單一關鍵人力），一旦時間或精力被占滿，成長就會直接卡在產能上限。"
  },
  {
    id: "market_unvalidated",
    type: "bottleneck",
    dimension: "market",
    title: "需求尚未經過驗證",
    template: "目前還沒有透過真實客戶的回饋驗證這個需求是否存在，在需求確定之前投入品牌與行銷，風險會比想像中高。"
  },
  {
    id: "prelaunch_premature_branding",
    type: "wasteWarning",
    dimension: "brand",
    title: "過早投入品牌設計",
    template: "在還沒有跟真實潛在客戶對話、確認需求之前，先花錢做完整的品牌識別與網站，很可能之後還要因為方向調整而重做。"
  },
  {
    id: "prelaunch_premature_ads",
    type: "wasteWarning",
    dimension: "traffic",
    title: "過早投入廣告預算",
    template: "在還沒有驗證誰會買、為什麼買之前投放廣告，只會用更快的速度燒錢驗證一個還不確定的假設。"
  },
  {
    id: "system_ads_no_tracking",
    type: "bottleneck",
    dimension: "system",
    title: "廣告缺乏轉換追蹤",
    template: "你目前有投放廣告，但沒有設定轉換追蹤，這代表你其實無法判斷廣告花費是否真的帶來詢問或成交，很容易憑感覺加碼或砍預算。"
  },
  {
    id: "conversion_traffic_not_converting",
    type: "bottleneck",
    dimension: "conversion",
    title: "流量足夠但轉換設計不足",
    template: "你目前不是缺少曝光，而是缺少能讓現有流量採取行動的轉換設計，繼續加大曝光只會讓更多人停在同一個沒有出口的地方。"
  },
  {
    id: "risk_ads_dependency",
    type: "risk",
    dimension: "traffic",
    title: "營收過度依賴持續投放廣告",
    template: "目前的業績高度依賴持續投放廣告來維持，一旦停止投放，還沒有證據顯示自然流量能撐住現有的業績水準。"
  },
  {
    id: "traffic_wrong_audience",
    type: "bottleneck",
    dimension: "traffic",
    title: "觸及的族群並非目標客群",
    template: "你目前觸及、互動的對象，跟真正會付費的目標客群不完全一致，這會讓流量數字看起來不錯，但很難轉換成詢問或訂單。"
  },
  {
    id: "retention_no_reminder",
    type: "bottleneck",
    dimension: "retention",
    title: "缺乏主動喚回舊客機制",
    template: "你目前沒有主動提醒或喚回舊客的機制，回購與否完全交給客戶自己記得，這會讓原本可以穩定累積的回購流失掉。"
  },
  {
    id: "risk_referral_dependency",
    type: "risk",
    dimension: "brand",
    title: "過度依賴口碑轉介紹",
    template: "你目前的客源高度依賴熟客介紹，這代表業績穩定度取決於別人願不願意主動幫你說話，而不是你自己能掌握的獲客管道。"
  }
];

/** @param {string} id @returns {Insight|undefined} */
export function getInsightById(id) {
  return insights.find((i) => i.id === id);
}
