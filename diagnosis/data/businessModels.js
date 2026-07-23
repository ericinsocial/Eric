/**
 * ===== 商業模式資料 =====
 * @typedef {import('../types/diagnosis.js').BusinessModel} BusinessModel
 *
 * 使用者在第二層可複選商業模式，但必須指定一個 primaryBusinessModel。
 * id 會被 industries.js 的 businessModels 欄位引用，也會被
 * commonQuestions.js／industryQuestions.js 的 conditions 用來判斷是否要
 * 追問（例如 subscription 模式才問 churn／MRR）。
 *
 * @type {BusinessModel[]}
 */
export const businessModels = [
  { id: "offline", nameZh: "實體門市", nameEn: "Physical Storefront", description: "客戶主要到實體地點消費或體驗" },
  { id: "reservation", nameZh: "預約制服務", nameEn: "Appointment-based", description: "服務需要事先預約時段" },
  { id: "houseCall", nameZh: "到府服務", nameEn: "On-site / House Call", description: "服務人員到客戶所在地提供服務" },
  { id: "oneTime", nameZh: "單次交易", nameEn: "One-off Purchase", description: "每筆交易獨立，沒有預期的持續關係" },
  { id: "longContract", nameZh: "長期合約", nameEn: "Long-term Contract", description: "與客戶簽訂較長期的服務或供應合約" },
  { id: "subscription", nameZh: "訂閱制", nameEn: "Subscription", description: "客戶定期付費持續使用產品或服務" },
  { id: "membership", nameZh: "會員制", nameEn: "Membership", description: "客戶付費或累積成為會員，享有差異化權益" },
  { id: "ecommerce", nameZh: "電商", nameEn: "E-commerce", description: "透過線上商店銷售商品" },
  { id: "platformCommission", nameZh: "平台抽成", nameEn: "Platform / Marketplace", description: "透過第三方平台交易，平台抽取分潤" },
  { id: "project", nameZh: "專案制", nameEn: "Project-based", description: "依個別專案報價與交付" },
  { id: "wholesale", nameZh: "批發／代理", nameEn: "Wholesale / Distribution", description: "透過經銷商或批發通路銷售" },
  { id: "b2bSales", nameZh: "B2B 業務開發", nameEn: "B2B Sales", description: "透過業務團隊主動開發企業客戶" },
  { id: "adsSponsorship", nameZh: "廣告／贊助", nameEn: "Ads / Sponsorship", description: "主要收入來自廣告版位或品牌贊助" },
  { id: "contentMonetization", nameZh: "內容變現", nameEn: "Content Monetization", description: "透過內容創作衍生收入（業配、抖內、平台分潤等）" },
  { id: "courses", nameZh: "課程／知識產品", nameEn: "Courses / Knowledge Product", description: "銷售課程、教材或知識型產品" },
  { id: "consulting", nameZh: "顧問服務", nameEn: "Consulting", description: "以專業建議或陪伴執行收費" },
  { id: "freemium", nameZh: "免費服務帶動其他收入", nameEn: "Freemium / Loss Leader", description: "以免費服務吸引使用者，透過其他項目變現" },
  { id: "undecided", nameZh: "尚未確定", nameEn: "Not Decided Yet", description: "商業模式尚在評估中" }
];

/** @param {string} id @returns {BusinessModel|undefined} */
export function getBusinessModelById(id) {
  return businessModels.find((m) => m.id === id);
}
