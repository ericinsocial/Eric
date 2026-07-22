/* ===== 廣告結果回推試算器 =====
   Interactive Marketing Funnel Calculator
   全部使用 Vanilla JS，不依賴任何第三方套件。
   包在 IIFE 內，避免與共用 script.js 的全域變數／函式衝突。 */
(function () {
  "use strict";

  /* ---------- 漏斗參數三組預設值 ---------- */
  const FUNNEL_PRESETS = {
    conservative: { ctr: .008, landingLoad: .70, engaged: .40, cta: .08, contact: .55, qualified: .50, booking: .35, attendance: .65, close: .18, cpc: 15, cpm: 220 },
    reasonable: { ctr: .015, landingLoad: .85, engaged: .55, cta: .12, contact: .70, qualified: .65, booking: .50, attendance: .80, close: .30, cpc: 10, cpm: 150 },
    ideal: { ctr: .025, landingLoad: .95, engaged: .70, cta: .18, contact: .85, qualified: .80, booking: .65, attendance: .90, close: .45, cpc: 6, cpm: 100 }
  };
  const MODE_LABELS = { conservative: "保守", reasonable: "合理", ideal: "理想" };

  const RATE_KEYS = ["ctr", "landingLoad", "engaged", "cta", "contact", "qualified", "booking", "attendance", "close"];

  const RATE_META = {
    ctr: { label: "CTR（點擊率）", min: .002, max: .06, step: .001, isPercent: true },
    landingLoad: { label: "網站到達率", min: .3, max: 1, step: .01, isPercent: true },
    engaged: { label: "有效閱讀率", min: .1, max: 1, step: .01, isPercent: true },
    cta: { label: "CTA 點擊率", min: .02, max: .5, step: .01, isPercent: true },
    contact: { label: "聯絡完成率", min: .1, max: 1, step: .01, isPercent: true },
    qualified: { label: "有效名單率", min: .1, max: 1, step: .01, isPercent: true },
    booking: { label: "預約率", min: .1, max: 1, step: .01, isPercent: true },
    attendance: { label: "到場率", min: .1, max: 1, step: .01, isPercent: true },
    close: { label: "成交率", min: .02, max: .8, step: .01, isPercent: true },
    cpc: { label: "CPC（每次點擊成本）", min: 1, max: 60, step: 1, isPercent: false },
    cpm: { label: "CPM（每千次曝光成本）", min: 20, max: 500, step: 5, isPercent: false }
  };

  const STAGE_LABELS = {
    exposure: "廣告曝光",
    clicks: "廣告點擊",
    view: "網站瀏覽",
    read: "有效閱讀",
    cta: "CTA 點擊",
    contact: "完成聯絡",
    qualified: "有效名單",
    booking: "預約",
    attendance: "到場",
    close: "成交（新客戶）"
  };

  /* ---------- 漏斗結構：依成交方式／廣告目的決定要包含哪些階段 ---------- */
  const CHAIN_DIRECT = { stages: ["exposure", "clicks", "view", "read", "cta", "close"], rates: ["ctr", "landingLoad", "engaged", "cta", "close"] };
  const CHAIN_LEAD = { stages: ["exposure", "clicks", "view", "read", "cta", "contact", "qualified", "close"], rates: ["ctr", "landingLoad", "engaged", "cta", "contact", "qualified", "close"] };
  const CHAIN_BOOKING = { stages: ["exposure", "clicks", "view", "read", "cta", "contact", "qualified", "booking", "attendance", "close"], rates: ["ctr", "landingLoad", "engaged", "cta", "contact", "qualified", "booking", "attendance", "close"] };

  function chainForCloseMethod(method) {
    if (method === "direct") return CHAIN_DIRECT;
    if (method === "booking_store" || method === "booking_consult") return CHAIN_BOOKING;
    return CHAIN_LEAD; // line / form / quote / other
  }
  function chainForAdGoal(goal) {
    if (goal === "direct_close") return CHAIN_DIRECT;
    if (goal === "booking") return CHAIN_BOOKING;
    return CHAIN_LEAD; // line / leadform / awareness
  }

  /* ---------- 問題定義 ---------- */
  const STEP_SPECS = {
    path_select: {
      question: "你目前想從哪裡開始？",
      type: "select",
      singleCol: true,
      answerKey: "path",
      options: [
        { value: "A", title: "① 我知道想增加多少客戶", desc: "我想知道需要多少廣告預算" },
        { value: "B", title: "② 我知道每月可以投入多少預算", desc: "我想知道可以得到多少客戶" },
        { value: "C", title: "③ 我還不確定", desc: "想先做完整評估" }
      ]
    },
    a1_customers: {
      question: "每個月希望增加多少新客戶？",
      type: "quick+custom",
      answerKey: "targetCustomers",
      suffix: "位",
      quickOptions: [5, 10, 20, 30, 50, 100]
    },
    a2_dealsize: {
      question: "平均每位新客戶第一次成交金額",
      type: "range+custom",
      answerKey: "dealSize",
      suffix: "元",
      quickOptions: [
        { value: 500, label: "1,000 以下" },
        { value: 3000, label: "1,000～5,000" },
        { value: 12500, label: "5,000～20,000" },
        { value: 35000, label: "20,000～50,000" },
        { value: 75000, label: "50,000 以上" }
      ]
    },
    a3_closemethod: {
      question: "客戶通常如何成交？",
      hint: "不同的成交方式，後面的漏斗計算會不一樣",
      type: "select",
      answerKey: "closeMethod",
      options: [
        { value: "direct", title: "直接購買" },
        { value: "line", title: "加入 LINE 後成交" },
        { value: "form", title: "填表後成交" },
        { value: "booking_store", title: "預約到店" },
        { value: "booking_consult", title: "預約諮詢" },
        { value: "quote", title: "業務報價" },
        { value: "other", title: "其他" }
      ]
    },
    a4_closerate: {
      question: "10 位詢問的人，最後通常會成交幾位？",
      type: "select",
      answerKey: "closeRateOverride",
      options: [
        { value: .05, title: "不到 1 位" },
        { value: .1, title: "約 1 位" },
        { value: .2, title: "約 2 位" },
        { value: .3, title: "約 3 位" },
        { value: .5, title: "約 5 位" },
        { value: null, title: "不知道" }
      ]
    },
    b1_budget: {
      question: "每月廣告媒體預算",
      hint: "只包含平台媒體費，不包含拍攝、設計、網站、代操",
      type: "quick+custom",
      answerKey: "budget",
      suffix: "元",
      quickOptions: [5000, 10000, 20000, 30000, 50000, 100000]
    },
    b2_adgoal: {
      question: "希望廣告帶來什麼？",
      type: "select",
      answerKey: "adGoal",
      options: [
        { value: "line", title: "加入 LINE" },
        { value: "leadform", title: "留下資料" },
        { value: "booking", title: "預約" },
        { value: "direct_close", title: "直接成交" },
        { value: "awareness", title: "品牌曝光" }
      ]
    },
    c1_viewer: {
      question: "真正看到廣告的人是誰？",
      type: "select",
      answerKey: "viewer",
      options: [
        { value: "buyer", title: "購買者" },
        { value: "boss", title: "老闆" },
        { value: "manager", title: "主管" },
        { value: "purchasing", title: "採購" },
        { value: "family", title: "家人" },
        { value: "other", title: "其他" }
      ]
    },
    c2_decider: {
      question: "真正決定的人是誰？",
      type: "select",
      answerKey: "decider",
      options: [
        { value: "self", title: "本人" },
        { value: "boss", title: "老闆" },
        { value: "manager", title: "主管" },
        { value: "group", title: "多人共同決定" }
      ]
    },
    c3_assets: {
      question: "目前有哪些？",
      hint: "可複選",
      type: "multi",
      answerKey: "assets",
      options: [
        { value: "website", title: "官方網站" },
        { value: "landing", title: "Landing Page" },
        { value: "video", title: "影片" },
        { value: "cases", title: "案例" },
        { value: "reviews", title: "Google 評論" },
        { value: "line", title: "LINE" },
        { value: "booking_system", title: "預約系統" },
        { value: "none", title: "都沒有" }
      ]
    },
    c4_tracking: {
      question: "目前有追蹤哪些數據？",
      hint: "可複選",
      type: "multi",
      answerKey: "tracking",
      options: [
        { value: "impressions", title: "曝光" },
        { value: "clicks", title: "點擊" },
        { value: "views", title: "瀏覽" },
        { value: "line", title: "LINE" },
        { value: "form", title: "表單" },
        { value: "leads", title: "名單" },
        { value: "deals", title: "成交" },
        { value: "cac", title: "CAC" },
        { value: "none", title: "都沒有" }
      ]
    },
    c5_painpoint: {
      question: "目前最大的困擾？",
      type: "select",
      answerKey: "painPoint",
      options: [
        { value: "no_clicks", title: "沒人點" },
        { value: "no_inquiry", title: "沒人詢問" },
        { value: "bad_quality", title: "詢問品質不好" },
        { value: "low_close", title: "成交率低" },
        { value: "no_tracking", title: "不知道怎麼追蹤" },
        { value: "no_content_idea", title: "不知道拍什麼" }
      ]
    }
  };

  /* ---------- 洞察／建議文字庫 ---------- */
  const RATE_INSIGHT_TEXT = {
    ctr: "你的<strong>廣告點擊率（CTR）偏低</strong>，可能是素材或受眾設定沒有抓住注意力",
    landingLoad: "你的<strong>網站到達率不足</strong>，可能是網站速度太慢，或廣告內容與到達頁不一致",
    engaged: "你的<strong>有效閱讀率偏低</strong>，訪客到頁後沒有被內容留住",
    cta: "你的<strong>CTA 不足</strong>，頁面缺乏清楚且吸引人的下一步行動",
    contact: "你的<strong>聯絡完成率偏低</strong>，可能是流程太複雜，或回應速度不夠快",
    qualified: "你的<strong>名單品質不足</strong>，進來的詢問中，真正有效的比例偏低",
    booking: "你的<strong>預約轉換率偏低</strong>，從聯絡到願意預約之間流失過多",
    attendance: "你的<strong>到場率偏低</strong>，預約後實際出現的比例不夠高",
    close: "你的<strong>成交率偏低</strong>，名單或到場之後，最後成交的比例不足"
  };

  const PAIN_POINT_INSIGHTS = {
    no_clicks: "你目前的困擾是<strong>沒有人點擊廣告</strong>，問題很可能出在受眾設定或素材吸引力，而不是到達頁",
    no_inquiry: "你目前的困擾是<strong>沒有人詢問</strong>，流量進來後，內容或 CTA 可能沒有讓人想進一步聯絡",
    bad_quality: "你目前的困擾是<strong>詢問品質不好</strong>，問題可能出在受眾精準度，而不是流量多寡",
    low_close: "你目前的困擾是<strong>成交率偏低</strong>，名單進來後，銷售流程或話術可能需要重新檢視",
    no_tracking: "你目前<strong>不知道怎麼追蹤數據</strong>，很難判斷問題出在流量、名單還是成交",
    no_content_idea: "你目前<strong>不知道該拍什麼內容</strong>，建議先釐清受眾在意的問題，再回頭決定內容方向"
  };

  const ROADMAP_ACTIONS = {
    ctr: { title: "優化廣告素材與受眾", desc: "先確保素材與受眾夠精準，才有本錢往下投資" },
    landingLoad: { title: "確保到達頁穩定與一致", desc: "檢查網站速度、跳出情形，讓廣告訊息與到達頁承諾一致" },
    engaged: { title: "重整到達頁內容架構", desc: "用清楚的結構留住訪客，而不是丟一堆資訊" },
    cta: { title: "強化 CTA 文案與版位", desc: "讓下一步行動清楚、明確、隨處可見" },
    contact: { title: "簡化聯絡與詢問流程", desc: "降低完成聯絡的門檻，加快回應速度" },
    qualified: { title: "建立名單篩選與追蹤機制", desc: "先分辨名單品質，才知道問題出在流量還是銷售" },
    booking: { title: "優化預約流程與誘因", desc: "降低預約門檻，並提供明確的預約誘因" },
    attendance: { title: "強化預約後的提醒與跟進", desc: "用提醒與價值溝通，降低到場前的流失" },
    close: { title: "優化銷售流程與成交話術", desc: "檢視最後一哩路，找出成交卡關的原因" }
  };

  const SERVICE_SUGGESTIONS = {
    ctr: { title: "Meta 廣告", desc: "重新設定受眾與素材策略，提高廣告點擊表現", href: "../services/marketing/" },
    landingLoad: { title: "Landing Page", desc: "打造轉換導向的到達頁，銜接廣告與內容", href: "../services/marketing/" },
    engaged: { title: "短影音", desc: "用更有說服力的內容留住訪客的注意力", href: "../services/marketing/" },
    cta: { title: "Landing Page", desc: "重新設計版位與文案，讓下一步行動更清楚", href: "../services/marketing/" },
    contact: { title: "AI 自動化", desc: "自動化詢問回覆與提醒，加快聯絡完成速度", href: "../services/marketing/" },
    qualified: { title: "SEO", desc: "從源頭優化流量品質，帶進更精準的名單", href: "../services/marketing/" },
    booking: { title: "AI 自動化", desc: "自動化預約流程與提醒，降低流失", href: "../services/marketing/" },
    attendance: { title: "AI 自動化", desc: "自動化到場前提醒與價值溝通", href: "../services/marketing/" },
    close: { title: "品牌行銷顧問", desc: "重新檢視銷售流程與成交話術", href: "../services/marketing/" }
  };

  /* ---------- 狀態 ---------- */
  const state = {
    mode: "reasonable",
    rates: Object.assign({}, FUNNEL_PRESETS.reasonable),
    userCloseRateOverride: null,
    answers: {},
    answeredKeys: new Set(),
    stepIds: [],
    stepIndex: 0,
    advancedOpen: false,
    lastResults: null
  };

  /* ---------- 工具函式 ---------- */
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function formatInt(n) { return Math.round(n).toLocaleString("zh-TW"); }
  function formatMoney(n) { return "NT$" + Math.round(n).toLocaleString("zh-TW"); }
  function formatPercent(n) {
    const v = n * 100;
    return (Number.isInteger(v) ? v : v.toFixed(1)) + "%";
  }
  function stripHtml(html) { return html.replace(/<[^>]+>/g, ""); }

  function animateCountUp(el, from, to, duration, formatter) {
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatter(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function animateCountUps(root) {
    const reduced = reducedMotion();
    root.querySelectorAll("[data-countup]").forEach((el) => {
      const to = Number(el.dataset.to);
      if (Number.isNaN(to)) return;
      const formatter = el.dataset.money === "1" ? formatMoney : formatInt;
      if (reduced) { el.textContent = formatter(to); return; }
      animateCountUp(el, 0, to, 800, formatter);
    });
  }
  function animateBarFills(root) {
    root.querySelectorAll("[data-barfill]").forEach((el) => {
      const pct = el.dataset.pct;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = pct + "%"; }));
    });
  }

  /* ---------- 漏斗計算 ---------- */
  function computeChainCounts(chain, rates, targetClose) {
    const n = chain.stages.length;
    const counts = new Array(n);
    counts[n - 1] = targetClose;
    for (let i = n - 2; i >= 0; i--) {
      counts[i] = counts[i + 1] / rates[chain.rates[i]];
    }
    return counts;
  }
  function computeChainForward(chain, rates, exposureCount) {
    const n = chain.stages.length;
    const counts = new Array(n);
    counts[0] = exposureCount;
    for (let i = 1; i < n; i++) {
      counts[i] = counts[i - 1] * rates[chain.rates[i - 1]];
    }
    return counts;
  }
  function getActiveChain() {
    if (state.answers.path === "B") return chainForAdGoal(state.answers.adGoal);
    return chainForCloseMethod(state.answers.closeMethod);
  }
  function computeResults() {
    const chain = getActiveChain();
    const rates = state.rates;
    const clicksIdx = chain.stages.indexOf("clicks");
    let counts, targetCustomers, budgetCPC, budgetCPM, budgetComparisonCustomers = null;

    if (state.answers.path === "B") {
      const budget = state.answers.budget;
      const exposure = (budget / rates.cpm) * 1000;
      counts = computeChainForward(chain, rates, exposure);
      targetCustomers = counts[counts.length - 1];
      budgetCPM = budget;
      budgetCPC = counts[clicksIdx] * rates.cpc;
    } else {
      targetCustomers = state.answers.targetCustomers;
      counts = computeChainCounts(chain, rates, targetCustomers);
      budgetCPC = counts[clicksIdx] * rates.cpc;
      budgetCPM = (counts[0] / 1000) * rates.cpm;
    }

    if (state.answers.path === "C" && state.answers.budget) {
      const exposureFromBudget = (state.answers.budget / rates.cpm) * 1000;
      const forwardCounts = computeChainForward(chain, rates, exposureFromBudget);
      budgetComparisonCustomers = forwardCounts[forwardCounts.length - 1];
    }

    const dealSize = state.answers.dealSize || null;
    const revenue = dealSize ? targetCustomers * dealSize : null;
    const cac = budgetCPC / targetCustomers;
    const roas = revenue ? revenue / budgetCPC : null;

    return { chain, counts, targetCustomers, budgetCPC, budgetCPM, budgetComparisonCustomers, dealSize, revenue, cac, roas };
  }
  function applyCloseRateOverride() {
    const override = state.answers.closeRateOverride;
    if (typeof override === "number") {
      state.userCloseRateOverride = override;
      state.rates.close = override;
    }
  }
  function rankWeakStages(results) {
    const benchmark = FUNNEL_PRESETS.reasonable;
    return results.chain.rates
      .map((key) => ({ key, gap: (benchmark[key] - state.rates[key]) / benchmark[key] }))
      .filter((r) => r.gap > .1)
      .sort((a, b) => b.gap - a.gap);
  }
  function generateInsights(results) {
    const candidates = [];
    rankWeakStages(results).forEach((r) => {
      if (RATE_INSIGHT_TEXT[r.key]) candidates.push({ priority: r.gap, text: RATE_INSIGHT_TEXT[r.key] });
    });
    if (state.answers.painPoint) candidates.push({ priority: 1.3, text: PAIN_POINT_INSIGHTS[state.answers.painPoint] });
    const assets = state.answers.assets || [];
    if (assets.length === 0 || assets.includes("none") || !assets.includes("landing")) {
      candidates.push({ priority: 1.15, text: "你目前沒有專屬的 <strong>Landing Page</strong>，廣告流量可能落在資訊分散的頁面，拉低有效閱讀與 CTA 表現" });
    }
    const tracking = state.answers.tracking || [];
    if (tracking.length === 0 || tracking.includes("none")) {
      candidates.push({ priority: 1.1, text: "你目前<strong>沒有追蹤關鍵數據</strong>，很難判斷問題出在流量、名單還是成交，建議先建立基礎追蹤" });
    }
    if (state.answers.decider && state.answers.decider !== "self") {
      candidates.push({ priority: .95, text: "真正<strong>看到廣告的人</strong>與<strong>做決定的人</strong>不是同一人，內容可能需要同時說服兩種對象" });
    }
    if (candidates.length === 0) {
      candidates.push({ priority: 1, text: "你目前的漏斗表現接近健康水準，可以優先把預算放大測試，觀察規模化後的變化" });
    }
    const seen = new Set();
    const deduped = candidates.filter((c) => {
      if (seen.has(c.text)) return false;
      seen.add(c.text);
      return true;
    });
    deduped.sort((a, b) => b.priority - a.priority);
    return deduped.slice(0, 3).map((c) => c.text);
  }
  function buildRoadmapSteps(results) {
    const weak = rankWeakStages(results);
    const steps = weak.slice(0, 4).map((r) => ROADMAP_ACTIONS[r.key]).filter(Boolean);
    if (steps.length === 0) {
      steps.push({ title: "放大預算測試", desc: "目前各階段表現接近健康水準，可以優先測試提高預算後的規模化效果" });
    }
    if (steps.length < 2 && (!(state.answers.tracking || []).length || (state.answers.tracking || []).includes("none"))) {
      steps.push({ title: "建立基礎數據追蹤", desc: "先看得見問題，才能對症下藥" });
    }
    return steps;
  }

  /* ---------- 導覽序列 ---------- */
  function buildStepSequence() {
    const seq = ["path_select"];
    const path = state.answers.path;
    if (path === "A") {
      seq.push("a1_customers", "a2_dealsize", "a3_closemethod", "a4_closerate");
    } else if (path === "B") {
      seq.push("b1_budget", "b2_adgoal");
    } else if (path === "C") {
      seq.push("a1_customers", "a2_dealsize", "a3_closemethod", "a4_closerate", "b1_budget");
    }
    seq.push("c1_viewer", "c2_decider", "c3_assets", "c4_tracking", "c5_painpoint");
    return seq;
  }
  function isStepAnswered(stepId) {
    return state.answeredKeys.has(STEP_SPECS[stepId].answerKey);
  }

  /* ---------- 卡片渲染 ---------- */
  function buildCardHTML(spec) {
    const n = state.stepIndex + 1;
    const total = state.stepIds.length;
    let body = "";
    if (spec.type === "select" || spec.type === "multi") {
      body = `<div class="calc-options ${spec.singleCol ? "is-single-col" : ""}">${spec.options.map((opt, i) => `
        <button type="button" class="calc-option" data-index="${i}">
          <span class="calc-option-check">✓</span>
          <span class="calc-option-title">${opt.title}</span>
          ${opt.desc ? `<span class="calc-option-desc">${opt.desc}</span>` : ""}
        </button>
      `).join("")}</div>`;
    } else if (spec.type === "quick+custom" || spec.type === "range+custom") {
      body = `
        <div class="calc-quick-row">${spec.quickOptions.map((opt) => {
          const val = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.label : `${opt.toLocaleString("zh-TW")} ${spec.suffix || ""}`;
          return `<button type="button" class="calc-quick-btn" data-value="${val}">${label}</button>`;
        }).join("")}</div>
        <div class="calc-input-row">
          <label class="calc-input-label" for="calc-custom-input">或自行輸入${spec.suffix ? "（" + spec.suffix + "）" : ""}</label>
          <input type="number" inputmode="decimal" class="calc-input" id="calc-custom-input" placeholder="輸入數字" min="0">
        </div>
      `;
    }
    return `
      <div class="calc-card">
        <p class="calc-card-eyebrow">STEP ${n} / ${total}</p>
        <h2 class="calc-question">${spec.question}</h2>
        ${spec.hint ? `<p class="calc-hint">${spec.hint}</p>` : ""}
        ${body}
        <div class="calc-nav">
          <button type="button" class="secondary-action calc-back-btn" id="calc-back">← 上一步</button>
          <p class="calc-key-hint">按 <kbd>Enter</kbd> 繼續，<kbd>Esc</kbd> 返回</p>
          <button type="button" class="primary-action calc-next-btn" id="calc-next" disabled>下一步 →</button>
        </div>
      </div>
    `;
  }

  function bindCardEvents(spec) {
    const card = document.querySelector("#calc-wizard .calc-card");
    document.getElementById("calc-back").addEventListener("click", goBack);
    document.getElementById("calc-next").addEventListener("click", goNext);

    if (spec.type === "select") {
      card.querySelectorAll(".calc-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const opt = spec.options[Number(btn.dataset.index)];
          card.querySelectorAll(".calc-option").forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          state.answers[spec.answerKey] = opt.value;
          state.answeredKeys.add(spec.answerKey);
          updateNextButtonState();
        });
      });
    } else if (spec.type === "multi") {
      card.querySelectorAll(".calc-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = spec.options[Number(btn.dataset.index)].value;
          let arr = (state.answers[spec.answerKey] || []).slice();
          if (val === "none") {
            arr = arr.includes("none") ? [] : ["none"];
          } else {
            arr = arr.filter((v) => v !== "none");
            const pos = arr.indexOf(val);
            if (pos >= 0) arr.splice(pos, 1); else arr.push(val);
          }
          state.answers[spec.answerKey] = arr;
          if (arr.length > 0) state.answeredKeys.add(spec.answerKey);
          else state.answeredKeys.delete(spec.answerKey);
          card.querySelectorAll(".calc-option").forEach((b, i) => {
            b.classList.toggle("is-selected", arr.includes(spec.options[i].value));
          });
          updateNextButtonState();
        });
      });
    } else if (spec.type === "quick+custom" || spec.type === "range+custom") {
      const input = card.querySelector(".calc-input");
      card.querySelectorAll(".calc-quick-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          card.querySelectorAll(".calc-quick-btn").forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          const val = Number(btn.dataset.value);
          input.value = val;
          state.answers[spec.answerKey] = val;
          state.answeredKeys.add(spec.answerKey);
          updateNextButtonState();
        });
      });
      input.addEventListener("input", () => {
        card.querySelectorAll(".calc-quick-btn").forEach((b) => b.classList.remove("is-selected"));
        const val = Number(input.value);
        if (input.value !== "" && val > 0) {
          state.answers[spec.answerKey] = val;
          state.answeredKeys.add(spec.answerKey);
        } else {
          state.answeredKeys.delete(spec.answerKey);
        }
        updateNextButtonState();
      });
    }
  }

  function restoreExistingAnswer(spec) {
    const card = document.querySelector("#calc-wizard .calc-card");
    if (spec.type === "select") {
      if (state.answeredKeys.has(spec.answerKey)) {
        const val = state.answers[spec.answerKey];
        const idx = spec.options.findIndex((o) => o.value === val);
        if (idx >= 0) card.querySelectorAll(".calc-option")[idx].classList.add("is-selected");
      }
    } else if (spec.type === "multi") {
      const arr = state.answers[spec.answerKey] || [];
      card.querySelectorAll(".calc-option").forEach((btn, i) => {
        if (arr.includes(spec.options[i].value)) btn.classList.add("is-selected");
      });
    } else if (spec.type === "quick+custom" || spec.type === "range+custom") {
      const val = state.answers[spec.answerKey];
      if (val !== undefined) {
        card.querySelector(".calc-input").value = val;
        const match = [...card.querySelectorAll(".calc-quick-btn")].find((b) => Number(b.dataset.value) === val);
        if (match) match.classList.add("is-selected");
      }
    }
  }

  function updateNextButtonState() {
    const btn = document.getElementById("calc-next");
    if (btn) btn.disabled = !isStepAnswered(state.stepIds[state.stepIndex]);
  }
  function updateProgress() {
    const fill = document.getElementById("calc-progress-fill");
    const total = state.stepIds.length || 1;
    fill.style.width = (((state.stepIndex + 1) / total) * 100) + "%";
  }

  function renderStep(stepId) {
    const spec = STEP_SPECS[stepId];
    const wizard = document.getElementById("calc-wizard");
    wizard.innerHTML = buildCardHTML(spec);
    bindCardEvents(spec);
    restoreExistingAnswer(spec);
    updateNextButtonState();
    updateProgress();
    const card = wizard.querySelector(".calc-card");
    if (reducedMotion()) { card.classList.add("is-active"); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-active")));
  }
  function renderStepAtIndex(index) {
    state.stepIndex = index;
    renderStep(state.stepIds[index]);
  }
  function transitionToStep(newIndex) {
    const wizard = document.getElementById("calc-wizard");
    const oldCard = wizard.querySelector(".calc-card");
    if (!oldCard || reducedMotion()) { renderStepAtIndex(newIndex); return; }
    oldCard.classList.add("is-leaving");
    oldCard.classList.remove("is-active");
    setTimeout(() => renderStepAtIndex(newIndex), 180);
  }

  function goNext() {
    const stepId = state.stepIds[state.stepIndex];
    if (!isStepAnswered(stepId)) return;
    if (stepId === "path_select") state.stepIds = buildStepSequence();
    if (state.stepIndex >= state.stepIds.length - 1) finishWizard();
    else transitionToStep(state.stepIndex + 1);
  }
  function goBack() {
    if (state.stepIndex === 0) {
      document.getElementById("calc-wizard").hidden = true;
      document.getElementById("calc-progress").hidden = true;
      document.getElementById("calc-hero").hidden = false;
      return;
    }
    transitionToStep(state.stepIndex - 1);
  }
  function startWizard() {
    document.getElementById("calc-hero").hidden = true;
    document.getElementById("calc-wizard").hidden = false;
    document.getElementById("calc-progress").hidden = false;
    state.stepIds = ["path_select"];
    renderStepAtIndex(0);
  }
  function finishWizard() {
    applyCloseRateOverride();
    document.getElementById("calc-wizard").hidden = true;
    document.getElementById("calc-progress").hidden = true;
    document.getElementById("calc-results").hidden = false;
    renderResults();
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }
  function restart() {
    state.mode = "reasonable";
    state.rates = Object.assign({}, FUNNEL_PRESETS.reasonable);
    state.userCloseRateOverride = null;
    state.answers = {};
    state.answeredKeys = new Set();
    state.stepIds = [];
    state.stepIndex = 0;
    state.advancedOpen = false;
    state.lastResults = null;
    document.getElementById("calc-results").hidden = true;
    document.getElementById("calc-wizard").hidden = true;
    document.getElementById("calc-progress").hidden = true;
    document.getElementById("calc-hero").hidden = false;
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }

  /* ---------- 結果頁渲染 ---------- */
  function buildGoalHTML(results) {
    const items = [];
    items.push(`<div class="calc-goal-item"><span class="calc-goal-value" data-countup data-to="${results.targetCustomers}">0</span><span class="calc-goal-caption">${state.answers.path === "B" ? "預估每月可得新客戶" : "每月新增新客戶"}</span></div>`);
    if (results.dealSize) {
      items.push(`<div class="calc-goal-item"><span class="calc-goal-value">${formatMoney(results.dealSize)}</span><span class="calc-goal-caption">平均每位客戶成交金額</span></div>`);
      items.push(`<div class="calc-goal-item"><span class="calc-goal-value" data-countup data-money="1" data-to="${results.revenue}">NT$0</span><span class="calc-goal-caption">預估每月新增營收</span></div>`);
    } else {
      items.push(`<div class="calc-goal-item"><span class="calc-goal-value">${formatMoney(state.answers.budget)}</span><span class="calc-goal-caption">每月廣告預算</span></div>`);
    }
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">你的目標</p>
        <div class="calc-goal-card">${items.join("")}</div>
      </div>
    `;
  }
  function buildModeSwitchHTML() {
    return `
      <div class="calc-mode-switch" role="tablist" aria-label="漏斗模式">
        ${["conservative", "reasonable", "ideal"].map((key) => `<button type="button" class="calc-mode-btn ${state.mode === key ? "is-active" : ""}" data-mode="${key}">${MODE_LABELS[key]}</button>`).join("")}
      </div>
    `;
  }
  function buildFunnelHTML(results) {
    const { chain, counts } = results;
    const maxCount = counts[0];
    const parts = [];
    chain.stages.forEach((stage, i) => {
      const count = counts[i];
      const pct = maxCount > 0 ? Math.max(2, (count / maxCount) * 100) : 0;
      const isFinal = i === chain.stages.length - 1;
      if (i > 0) parts.push(`<div class="calc-funnel-connector" aria-hidden="true">↓</div>`);
      let metaHtml;
      if (i > 0) {
        const rateVal = state.rates[chain.rates[i - 1]];
        const lossCount = Math.max(0, counts[i - 1] - count);
        metaHtml = `
          <div class="calc-funnel-meta">
            <span>轉換率 <span class="calc-rate">${formatPercent(rateVal)}</span></span>
            <span>流失 <span class="calc-loss" data-countup data-to="${lossCount}">0</span> 人</span>
          </div>
        `;
      } else {
        metaHtml = `<div class="calc-funnel-meta"><span>漏斗起點</span></div>`;
      }
      parts.push(`
        <div class="calc-funnel-stage${isFinal ? " is-final" : ""}">
          <div class="calc-funnel-primary">
            <div class="calc-funnel-top">
              <span class="calc-funnel-name">${STAGE_LABELS[stage]}</span>
              <span class="calc-funnel-count" data-countup data-to="${count}">0</span>
            </div>
            <div class="calc-funnel-bar-track"><div class="calc-funnel-bar-fill" data-barfill data-pct="${pct}"></div></div>
          </div>
          ${metaHtml}
        </div>
      `);
    });
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">完整漏斗</p>
        <h2 class="calc-results-heading">從曝光到成交，每一步都算給你看</h2>
        ${buildModeSwitchHTML()}
        <div class="calc-funnel">${parts.join("")}</div>
      </div>
    `;
  }
  function buildBudgetHTML(results) {
    const tiles = [
      { label: "預估預算（依 CPC）", value: formatMoney(results.budgetCPC), note: `以 CPC ${formatMoney(state.rates.cpc)} 估算` },
      { label: "預估預算（依 CPM）", value: formatMoney(results.budgetCPM), note: `以 CPM ${formatMoney(state.rates.cpm)} 估算` },
      { label: "CAC 客戶取得成本", value: formatMoney(results.cac), note: "以 CPC 預算計算" },
      { label: "ROAS 廣告投報率", value: results.roas ? (results.roas.toFixed(1) + "×") : "—", note: results.roas ? "營收 ÷ 廣告預算" : "需提供客單價" }
    ];
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">預估廣告預算</p>
        <h2 class="calc-results-heading">投入多少，才能達成目標</h2>
        <div class="calc-budget-grid">
          ${tiles.map((t) => `
            <div class="calc-stat-tile">
              <span class="calc-stat-label">${t.label}</span>
              <span class="calc-stat-value">${t.value}</span>
              <span class="calc-stat-note">${t.note}</span>
            </div>
          `).join("")}
        </div>
        ${results.budgetComparisonCustomers != null ? `<p class="calc-hint" style="margin-top:16px;">以你目前每月 ${formatMoney(state.answers.budget)} 預算估算，大約可以帶來 <strong style="color:var(--accent)">${formatInt(results.budgetComparisonCustomers)}</strong> 位新客戶</p>` : ""}
      </div>
    `;
  }
  function buildInsightsHTML(results) {
    const insights = generateInsights(results);
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">瓶頸分析</p>
        <h2 class="calc-results-heading">你的漏斗，卡在哪裡</h2>
        <div class="calc-insights">
          ${insights.map((text, i) => `
            <div class="calc-insight-item">
              <span class="calc-insight-index">0${i + 1}</span>
              <p class="calc-insight-text">${text}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  function buildRoadmapHTML(results) {
    const steps = buildRoadmapSteps(results);
    const labels = ["第一步", "第二步", "第三步", "第四步"];
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">建議改善順序</p>
        <h2 class="calc-results-heading">先改善這裡，投廣告才有效果</h2>
        <div class="calc-roadmap">
          ${steps.map((s, i) => `
            <div class="calc-roadmap-step">
              <span class="calc-roadmap-num">${i + 1}</span>
              <div class="calc-roadmap-body">
                <p class="calc-roadmap-title">${labels[i] || ""}．${s.title}</p>
                <p class="calc-roadmap-desc">${s.desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  function buildServicesHTML(results) {
    const weak = rankWeakStages(results);
    const picked = [];
    const seen = new Set();
    weak.forEach((r) => {
      const svc = SERVICE_SUGGESTIONS[r.key];
      if (svc && !seen.has(svc.title)) { picked.push(svc); seen.add(svc.title); }
    });
    if (picked.length === 0) picked.push(SERVICE_SUGGESTIONS.ctr, SERVICE_SUGGESTIONS.landingLoad);
    const top = picked.slice(0, 3);
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">適合我的服務</p>
        <h2 class="calc-results-heading">根據你的漏斗，這些是優先選項</h2>
        <div class="calc-services-grid">
          ${top.map((s) => `
            <a class="calc-service-card" href="${s.href}">
              <span class="calc-service-title">${s.title}</span>
              <span class="calc-service-desc">${s.desc}</span>
              <span class="calc-service-link">了解更多 →</span>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }
  function buildSliderRow(key) {
    const meta = RATE_META[key];
    const val = state.rates[key];
    const display = meta.isPercent ? formatPercent(val) : formatMoney(val);
    return `
      <div class="calc-slider-row">
        <div class="calc-slider-top">
          <span class="calc-slider-label">${meta.label}</span>
          <span class="calc-slider-value" data-slider-value="${key}">${display}</span>
        </div>
        <input type="range" class="calc-slider" data-rate-key="${key}" min="${meta.min}" max="${meta.max}" step="${meta.step}" value="${val}">
      </div>
    `;
  }
  function buildAdvancedHTML() {
    return `
      <div class="calc-results-section">
        <div class="calc-advanced">
          <button type="button" class="calc-advanced-toggle" id="calc-advanced-toggle" aria-expanded="false" aria-controls="calc-advanced-panel">
            <span>調整我的轉換率</span>
          </button>
          <div class="calc-advanced-panel" id="calc-advanced-panel">
            <div class="calc-advanced-body">
              ${RATE_KEYS.concat(["cpc", "cpm"]).map(buildSliderRow).join("")}
            </div>
            <div class="calc-advanced-body" style="padding-top:0;grid-template-columns:1fr;">
              <button type="button" class="secondary-action calc-advanced-reset" id="calc-advanced-reset">重設為「${MODE_LABELS[state.mode]}」預設值</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  function buildActionsHTML() {
    return `
      <div class="calc-results-section">
        <p class="calc-results-label">下一步</p>
        <h2 class="calc-results-heading">想知道你的目標與預算是否合理？</h2>
        <p class="calc-hint">複製完整試算結果，再到 LINE 與 Eric 討論</p>
        <div class="calc-actions">
          <a class="primary-action" href="https://line.me/ti/p/x0qtal5f5A" target="_blank" rel="noopener noreferrer">加入 LINE 詢問 Eric</a>
          <button type="button" class="secondary-action" id="calc-copy-btn">複製完整分析</button>
          <button type="button" class="secondary-action calc-restart-btn" id="calc-restart-btn">重新開始試算</button>
        </div>
      </div>
    `;
  }

  function recalcAndRenderDynamic() {
    const results = computeResults();
    state.lastResults = results;
    const dyn = document.getElementById("calc-results-dynamic");
    dyn.innerHTML = [
      buildGoalHTML(results),
      buildFunnelHTML(results),
      buildBudgetHTML(results),
      buildInsightsHTML(results),
      buildRoadmapHTML(results),
      buildServicesHTML(results)
    ].join("");
    dyn.querySelectorAll(".calc-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });
    requestAnimationFrame(() => {
      animateCountUps(dyn);
      animateBarFills(dyn);
    });
  }
  function buildStaticShell() {
    const staticEl = document.getElementById("calc-results-static");
    staticEl.innerHTML = buildAdvancedHTML() + buildActionsHTML();
    staticEl.querySelectorAll("[data-rate-key]").forEach((slider) => {
      slider.addEventListener("input", () => {
        const key = slider.dataset.rateKey;
        const val = Number(slider.value);
        state.rates[key] = val;
        if (key === "close") state.userCloseRateOverride = val;
        const meta = RATE_META[key];
        staticEl.querySelector(`[data-slider-value="${key}"]`).textContent = meta.isPercent ? formatPercent(val) : formatMoney(val);
        recalcAndRenderDynamic();
      });
    });
    const advToggle = staticEl.querySelector("#calc-advanced-toggle");
    const advPanel = staticEl.querySelector("#calc-advanced-panel");
    if (state.advancedOpen) {
      advToggle.setAttribute("aria-expanded", "true");
      advPanel.classList.add("is-open");
    }
    advToggle.addEventListener("click", () => {
      const open = advToggle.getAttribute("aria-expanded") === "true";
      advToggle.setAttribute("aria-expanded", String(!open));
      advPanel.classList.toggle("is-open", !open);
      state.advancedOpen = !open;
    });
    staticEl.querySelector("#calc-advanced-reset").addEventListener("click", () => {
      state.rates = Object.assign({}, FUNNEL_PRESETS[state.mode]);
      if (typeof state.userCloseRateOverride === "number") state.rates.close = state.userCloseRateOverride;
      state.advancedOpen = true;
      renderResults();
    });
    staticEl.querySelector("#calc-copy-btn").addEventListener("click", copyResults);
    staticEl.querySelector("#calc-restart-btn").addEventListener("click", restart);
  }
  function renderResults() {
    const root = document.getElementById("calc-results");
    root.innerHTML = `<div id="calc-results-dynamic"></div><div id="calc-results-static"></div>`;
    buildStaticShell();
    recalcAndRenderDynamic();
  }
  function setMode(mode) {
    state.mode = mode;
    state.rates = Object.assign({}, FUNNEL_PRESETS[mode]);
    if (typeof state.userCloseRateOverride === "number") state.rates.close = state.userCloseRateOverride;
    renderResults();
  }

  /* ---------- 複製到 LINE ---------- */
  function buildCopyText(results) {
    const lines = [];
    lines.push("【詠真堂｜廣告結果回推試算】");
    lines.push("");
    lines.push("你的目標");
    lines.push(`每月新增 ${formatInt(results.targetCustomers)} 位新客戶`);
    if (results.dealSize) {
      lines.push(`每位客戶約 ${formatMoney(results.dealSize)}`);
      lines.push(`預估每月新增營收 ${formatMoney(results.revenue)}`);
    }
    lines.push("");
    lines.push("完整漏斗");
    results.chain.stages.forEach((stage, i) => lines.push(`${STAGE_LABELS[stage]}：${formatInt(results.counts[i])}`));
    lines.push("");
    lines.push("預估廣告預算");
    lines.push(`依 CPC 估算：約 ${formatMoney(results.budgetCPC)} / 月`);
    lines.push(`依 CPM 估算：約 ${formatMoney(results.budgetCPM)} / 月`);
    lines.push(`CAC 客戶取得成本：約 ${formatMoney(results.cac)}`);
    if (results.roas) lines.push(`ROAS：約 ${results.roas.toFixed(1)} 倍`);
    lines.push("");
    lines.push("瓶頸分析");
    generateInsights(results).forEach((text, i) => lines.push(`${i + 1}. ${stripHtml(text)}`));
    lines.push("");
    lines.push("建議改善順序");
    buildRoadmapSteps(results).forEach((step, i) => lines.push(`${i + 1}. ${step.title}：${step.desc}`));
    lines.push("");
    lines.push("—— 由詠真堂互動式廣告試算器產生");
    lines.push("https://ericinsocial.github.io/Eric/calculator/");
    return lines.join("\n");
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("已複製，加入 LINE 後直接貼上即可");
    } catch (err) {
      showToast("複製失敗，請手動選取文字");
    }
    document.body.removeChild(ta);
  }
  function copyResults() {
    if (!state.lastResults) return;
    const text = buildCopyText(state.lastResults);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast("已複製，加入 LINE 後直接貼上即可"),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }
  function showToast(message) {
    const toast = document.getElementById("calc-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ---------- 鍵盤操作 ---------- */
  function setupKeyboardNav() {
    document.addEventListener("keydown", (e) => {
      const wizard = document.getElementById("calc-wizard");
      if (wizard.hidden) return;
      const isInput = document.activeElement && document.activeElement.tagName === "INPUT";
      if (e.key === "Enter") { e.preventDefault(); goNext(); }
      else if (e.key === "Escape") { e.preventDefault(); goBack(); }
      else if (e.key === "ArrowRight" && !isInput) { goNext(); }
      else if (e.key === "ArrowLeft" && !isInput) { goBack(); }
    });
  }

  /* ---------- 啟動 ---------- */
  function initCalculator() {
    document.getElementById("calc-start-btn").addEventListener("click", startWizard);
    setupKeyboardNav();
  }

  document.addEventListener("DOMContentLoaded", initCalculator);
})();
