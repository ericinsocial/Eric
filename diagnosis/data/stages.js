/**
 * ===== 發展階段資料 =====
 * @typedef {import('../types/diagnosis.js').Stage} Stage
 *
 * order 用於 bottleneckEngine 判斷「現階段是否合理」，數字越小代表越早期。
 * deprioritizeDimensions 用於 questionEngine：這個階段不該優先深入詢問／
 * 評分的維度（例如尚未創業階段不該一直被問 retention／system 的細節數據，
 * 對應規格五「尚未開始的使用者，不應一直被問 GA4、廣告 ROAS 或會員回購率」）。
 *
 * @type {Stage[]}
 */
export const stages = [
  {
    id: "idea",
    nameZh: "只有想法，尚未開始",
    nameEn: "Idea Stage",
    description: "還沒有正式對外銷售，處於構想階段",
    order: 0,
    deprioritizeDimensions: ["traffic", "conversion", "retention", "system"]
  },
  {
    id: "preparing",
    nameZh: "正在籌備產品或服務",
    nameEn: "Preparing",
    description: "產品或服務正在開發、測試，尚未正式上市",
    order: 1,
    deprioritizeDimensions: ["retention", "system"]
  },
  {
    id: "earlyFewCustomers",
    nameZh: "已開始營業，但客戶很少",
    nameEn: "Early / Few Customers",
    description: "已經開始銷售，但客戶數量還不穩定",
    order: 2,
    deprioritizeDimensions: ["retention", "system"]
  },
  {
    id: "stableWantGrowth",
    nameZh: "已有穩定客戶，想增加營收",
    nameEn: "Stable, Seeking Growth",
    description: "已有基本客源，目標是提升營收規模",
    order: 3,
    deprioritizeDimensions: []
  },
  {
    id: "scalingSystem",
    nameZh: "已有一定規模，想建立系統",
    nameEn: "Scaling & Systemizing",
    description: "業務量已成長，需要建立可複製的流程與系統",
    order: 4,
    deprioritizeDimensions: []
  },
  {
    id: "rapidGrowth",
    nameZh: "正在快速成長",
    nameEn: "Rapid Growth",
    description: "營收或客戶數快速增加中",
    order: 5,
    deprioritizeDimensions: []
  },
  {
    id: "stagnant",
    nameZh: "成長停滯",
    nameEn: "Stagnant",
    description: "營收或客戶數維持平盤，難以突破",
    order: 4,
    deprioritizeDimensions: []
  },
  {
    id: "declining",
    nameZh: "營收下降",
    nameEn: "Declining",
    description: "營收或客戶數呈現下滑趨勢",
    order: 4,
    deprioritizeDimensions: []
  },
  {
    id: "transforming",
    nameZh: "正在轉型",
    nameEn: "Transforming",
    description: "正在調整商業模式、產品線或目標客群",
    order: 4,
    deprioritizeDimensions: []
  },
  {
    id: "unsure",
    nameZh: "不確定自己的階段",
    nameEn: "Not Sure",
    description: "還沒有明確判斷目前所處的發展階段",
    order: 3,
    deprioritizeDimensions: []
  }
];

/** @param {string} id @returns {Stage|undefined} */
export function getStageById(id) {
  return stages.find((s) => s.id === id);
}
