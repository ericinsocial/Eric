/**
 * ===== 產業分類資料 =====
 * @typedef {import('../types/diagnosis.js').Industry} Industry
 *
 * questionModule 對應 Phase 3 的 industryQuestions.js。目前（Phase 1）
 * 五個測試案例產業（餐飲／電商／顧問／SaaS／尚未創業，見規格二十一）會在
 * Phase 3 建立完整專屬題庫；其餘產業的 questionModule 先指向自己的 id，
 * Phase 3 若尚未填入專屬題庫，questionEngine 會 fallback 使用
 * "generic"（純共通題庫 + 依 keyMetrics/commonBottlenecks 動態產生的追問），
 * 不會因為缺少模組而報錯或給空白題目。
 *
 * @type {Industry[]}
 */
export const industries = [
  {
    id: "retail",
    nameZh: "實體零售",
    nameEn: "Retail",
    description: "依靠來客數、商圈條件與商品組合成長的實體零售業態。",
    icon: "🏬",
    businessModels: ["offline", "membership", "wholesale"],
    keyMetrics: ["來客數", "客單價", "商圈與地點條件", "Google 地圖曝光", "會員回訪率"],
    commonBottlenecks: [
      "過度依賴路過客",
      "平日與假日來客落差大",
      "商品組合與陳列缺乏策略",
      "缺乏會員與回訪機制",
      "線上聲量未能導流到店"
    ],
    questionModule: "retail"
  },
  {
    id: "restaurant",
    nameZh: "餐飲／酒吧／咖啡廳",
    nameEn: "Food & Beverage",
    description: "依靠來客數、回訪率、客單價與在地曝光成長的實體服務業。",
    icon: "🍽️",
    businessModels: ["offline", "reservation", "platformCommission"],
    keyMetrics: ["訂位轉換率", "翻桌率", "客單價", "Google 評論數與評分", "平日來客數", "回訪率"],
    commonBottlenecks: [
      "平日來客不足",
      "過度依賴熟客",
      "Google 地圖曝光不足",
      "社群有流量但沒有到店",
      "缺乏會員與回訪機制",
      "外送平台抽成侵蝕毛利"
    ],
    questionModule: "restaurant"
  },
  {
    id: "beauty",
    nameZh: "美容／美髮／美甲／按摩／SPA",
    nameEn: "Beauty & Wellness",
    description: "依靠預約率、到店率與回購週期成長的預約制服務業。",
    icon: "💆",
    businessModels: ["reservation", "membership", "houseCall"],
    keyMetrics: ["預約率", "到店率", "爽約率", "回購週期", "指定率", "客單價"],
    commonBottlenecks: [
      "過度依賴折扣促銷",
      "客戶只認技師不認品牌",
      "缺乏舊客喚回機制",
      "套票銷售但續購率低",
      "Google 地圖與評論經營不足"
    ],
    questionModule: "beauty"
  },
  {
    id: "medical",
    nameZh: "醫療／診所／健康照護",
    nameEn: "Medical & Healthcare",
    description: "在合規限制下依靠信任建立與轉診轉化成長的健康照護服務。",
    icon: "🩺",
    businessModels: ["reservation", "longContract"],
    keyMetrics: ["初診轉換率", "到診率", "回診率", "Google 搜尋與地圖曝光", "評價與信任指標"],
    commonBottlenecks: [
      "初診名單流失率高",
      "衛教內容不足導致信任建立慢",
      "醫師個人品牌與診所品牌未整合",
      "缺乏療程後的持續關係經營",
      "高價療程諮詢流程不完整"
    ],
    questionModule: "medical"
  },
  {
    id: "professional",
    nameZh: "專業服務",
    nameEn: "Professional Services",
    description: "法律、會計、設計、工程、翻譯、攝影、代辦等以專業與案例建立信任的服務。",
    icon: "📁",
    businessModels: ["project", "oneTime", "longContract"],
    keyMetrics: ["案源穩定度", "成交週期", "轉介紹比例", "報價轉換率"],
    commonBottlenecks: [
      "過度依賴時間換收入",
      "缺乏標準化方案",
      "客製化報價流程冗長",
      "案例與口碑未被系統化運用",
      "個人品牌與公司品牌混淆"
    ],
    questionModule: "professional"
  },
  {
    id: "education",
    nameZh: "教育／課程／補習／培訓",
    nameEn: "Education & Training",
    description: "依靠招生轉換、完課率與續課率成長的教育培訓服務。",
    icon: "🎓",
    businessModels: ["courses", "subscription", "oneTime"],
    keyMetrics: ["招生轉換率", "試聽到報名轉換率", "完課率", "續課率", "學員轉介紹率"],
    commonBottlenecks: [
      "免費內容無法轉換為報名",
      "課程差異化不足",
      "缺乏課程階梯與客單價成長路徑",
      "決策者與使用者溝通斷層",
      "名單養成機制薄弱"
    ],
    questionModule: "education"
  },
  {
    id: "ecommerce",
    nameZh: "電商／網路零售",
    nameEn: "E-commerce",
    description: "依靠流量、轉換率與回購率驅動成長的線上零售業態。",
    icon: "🛒",
    businessModels: ["ecommerce", "subscription", "platformCommission"],
    keyMetrics: ["商品頁轉換率", "加入購物車率", "棄單率", "客單價", "毛利率", "CAC", "ROAS", "回購率"],
    commonBottlenecks: [
      "廣告流量大但轉換率低",
      "過度依賴促銷驅動業績",
      "回購率未被追蹤",
      "商品數量過多導致決策困難",
      "平台依賴度過高"
    ],
    questionModule: "ecommerce"
  },
  {
    id: "brandManufacturer",
    nameZh: "品牌商／產品製造",
    nameEn: "Brand & Manufacturing",
    description: "透過通路與經銷網絡銷售產品的品牌商與製造商。",
    icon: "🏭",
    businessModels: ["wholesale", "ecommerce", "b2bSales"],
    keyMetrics: ["經銷商數量與產出", "終端市占", "新品上市轉換", "官網詢問量"],
    commonBottlenecks: [
      "只講產品規格缺乏價值敘事",
      "通路庫存與價格控制失衡",
      "B2B 與 B2C 通路互相衝突",
      "經銷商缺乏教育與行銷支援",
      "品牌認知度不足"
    ],
    questionModule: "brandManufacturer"
  },
  {
    id: "b2bService",
    nameZh: "B2B 企業服務",
    nameEn: "B2B Services",
    description: "依靠理想客戶輪廓與長銷售週期成長的企業對企業服務。",
    icon: "🤝",
    businessModels: ["b2bSales", "project", "longContract"],
    keyMetrics: ["合格名單數（MQL）", "提案轉換率", "採購週期長度", "續約率"],
    commonBottlenecks: [
      "過度依賴人脈與單一業務",
      "缺乏系統化的售前內容",
      "CRM 與業務追蹤流程鬆散",
      "決策鏈複雜但缺乏對應內容",
      "客戶成功與續約流程不完整"
    ],
    questionModule: "b2bService"
  },
  {
    id: "saas",
    nameZh: "SaaS／軟體／科技服務",
    nameEn: "SaaS & Software",
    description: "以註冊、啟用、付費轉換與留存驅動成長的軟體服務。",
    icon: "💻",
    businessModels: ["subscription", "freemium"],
    keyMetrics: ["註冊率", "啟用率", "Trial-to-paid 轉換率", "MRR／ARR", "Churn 流失率", "LTV／CAC 比"],
    commonBottlenecks: [
      "註冊多但未完成核心操作",
      "功能很多但價值不明確",
      "不知道流失原因",
      "Onboarding 流程缺乏引導",
      "過度投入新功能而非解決啟用問題"
    ],
    questionModule: "saas"
  },
  {
    id: "creator",
    nameZh: "內容創作者／KOL／個人品牌",
    nameEn: "Content Creator",
    description: "依靠內容流量與私域名單變現的個人品牌經營者。",
    icon: "🎥",
    businessModels: ["contentMonetization", "courses", "adsSponsorship"],
    keyMetrics: ["追蹤成長率", "平均觸及率", "私域名單數", "業配／商品轉換率"],
    commonBottlenecks: [
      "流量無法轉為穩定收入",
      "有人設但沒有明確商品",
      "商品存在但無法穩定成交",
      "過度依賴單一平台演算法",
      "個人品牌方向過度分散"
    ],
    questionModule: "creator"
  },
  {
    id: "consultant",
    nameZh: "顧問／教練／講師／自由工作者",
    nameEn: "Consultant & Coach",
    description: "以專業知識與一對一服務為主要產出的自由工作者。",
    icon: "🧑‍🏫",
    businessModels: ["consulting", "project", "oneTime"],
    keyMetrics: ["案源轉介紹比例", "諮詢到成交轉換率", "客單價", "服務產能上限"],
    commonBottlenecks: [
      "過度依賴熟人介紹",
      "缺乏明確服務方案與定價",
      "每次客製報價導致收入不穩定",
      "只能一對一服務難以擴張",
      "免費諮詢耗費大量時間"
    ],
    questionModule: "consultant"
  },
  {
    id: "realEstate",
    nameZh: "房地產／仲介／高單價服務",
    nameEn: "Real Estate & High-ticket",
    description: "依靠長決策週期、信任建立與持續追蹤成交的高單價服務。",
    icon: "🏠",
    businessModels: ["project", "oneTime"],
    keyMetrics: ["名單開發量", "委託成交率", "追蹤頻率", "案件庫存週轉"],
    commonBottlenecks: [
      "過度依賴平台名單",
      "缺乏長期名單養成與追蹤機制",
      "個人品牌與地區專業度不足",
      "決策週期長但缺乏持續內容經營",
      "CRM 與客戶關係管理鬆散"
    ],
    questionModule: "realEstate"
  },
  {
    id: "events",
    nameZh: "活動／展覽／娛樂／體驗服務",
    nameEn: "Events & Experiences",
    description: "以檔期、報名與現場體驗為核心的活動型服務。",
    icon: "🎪",
    businessModels: ["oneTime", "project", "adsSponsorship"],
    keyMetrics: ["早鳥轉換率", "售票轉換率", "合作夥伴導流比例", "活動後名單留存率"],
    commonBottlenecks: [
      "每次活動都重新開始找人",
      "缺乏活動後的名單沉澱與再行銷",
      "過度依賴單一通路",
      "現場體驗未轉化為長期內容資產"
    ],
    questionModule: "events"
  },
  {
    id: "nonprofit",
    nameZh: "非營利組織／協會／社群",
    nameEn: "Nonprofit & Community",
    description: "以理念溝通與會員／捐款轉換為核心的組織型單位。",
    icon: "🤲",
    businessModels: ["adsSponsorship", "membership", "oneTime"],
    keyMetrics: ["會員續會率", "活動報名轉換率", "捐款轉換率", "志工參與度"],
    commonBottlenecks: [
      "只傳達理念但缺乏明確行動呼籲",
      "缺乏轉換流程將認同轉為實際支持",
      "名單未被系統化管理",
      "影響力缺乏具體證明素材"
    ],
    questionModule: "nonprofit"
  },
  {
    id: "prelaunch",
    nameZh: "尚未創業／正在規劃",
    nameEn: "Pre-launch",
    description: "還在構想或籌備階段，尚未正式對外銷售。",
    icon: "🌱",
    businessModels: ["undecided"],
    keyMetrics: ["需求驗證訪談數", "第一批意向客戶數", "可投入預算與時間"],
    commonBottlenecks: [
      "尚未驗證需求就投入品牌與網站",
      "沒有清楚描述目標客群",
      "過早投入廣告與大量開發",
      "不知道第一批客戶從哪裡來"
    ],
    questionModule: "prelaunch"
  },
  {
    id: "other",
    nameZh: "其他",
    nameEn: "Other",
    description: "不屬於以上分類，或跨足多種產業型態。",
    icon: "✨",
    businessModels: ["undecided"],
    keyMetrics: ["視實際情況而定，由共通問題釐清"],
    commonBottlenecks: ["尚待透過共通問題進一步釐清"],
    questionModule: "generic"
  }
];

/** @param {string} id @returns {Industry|undefined} */
export function getIndustryById(id) {
  return industries.find((i) => i.id === id);
}
