const profile = {
  nameEn: "Eric Chen",
  nameZh: "陳昱華",
  brand: "詠真堂",
  phone: "0920148119"
};

const services = [
  {
    number: "01",
    title: "品牌與行銷",
    lines: ["從品牌定位、內容企劃到網站與數位體驗", "協助企業把複雜的產品價值轉化成市場能理解的訊息"],
    tags: ["品牌定位", "行銷策略", "網站與內容企劃", "簡報與視覺溝通", "數位廣告與社群內容"]
  },
  {
    number: "02",
    title: "塔羅與易經",
    lines: ["占卜不是替你做決定", "而是看清局勢、可能的發展與每個選擇背後的代價"],
    tags: ["感情與關係", "工作與事業", "財務與選擇", "人生方向", "易經卜卦與塔羅占卜"]
  },
  {
    number: "03",
    title: "珠寶與礦石",
    lines: ["依照個人需求、配戴習慣與風格", "提供礦石選擇、手串搭配與客製化建議"],
    tags: ["天然礦石", "客製手串", "日常配戴", "送禮選擇", "礦石與五行搭配"]
  },
  {
    number: "04",
    title: "潛意識探索",
    lines: ["透過對話、象徵與問題整理", "看見反覆出現的模式，以及真正影響選擇的原因"],
    tags: ["問題釐清", "關係模式", "內在衝突", "選擇與行動", "臼井靈氣"]
  }
];

const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderServices() {
  const list = document.querySelector("#service-list");
  list.innerHTML = services.map((service) => `
    <article class="service-card reveal" tabindex="0">
      <p class="service-index" aria-hidden="true">${service.number}</p>
      <h3>${service.title}</h3>
      <p>${service.lines[0]}<br>${service.lines[1]}</p>
      <div class="service-tags">${service.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <a class="service-link" href="#contact" aria-label="聯絡 Eric 了解${service.title}">聯絡了解 →</a>
    </article>
  `).join("");
}

function downloadVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.nameEn.split(" ").slice(-1)[0] || "Chen"};${profile.nameEn.split(" ")[0] || "Eric"};;;`,
    `FN:${profile.nameEn}（${profile.nameZh}）`,
    `ORG:${profile.brand}`,
    `TITLE:Brand Consultant / Insight Advisor`,
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
    `URL:${window.location.href}`,
    "NOTE:詠真堂｜洞察、判斷、策略、選擇",
    "END:VCARD"
  ].filter(Boolean);
  const blob = new Blob([lines.join("\n")], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${profile.nameEn.replace(/\s+/g, "-")}.vcf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("已產生 vCard 聯絡人");
}

async function shareCard() {
  const shareData = {
    title: `${profile.nameEn}｜${profile.brand}`,
    text: "看見本質，做出更好的選擇",
    url: window.location.href
  };
  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }
  await navigator.clipboard.writeText(window.location.href);
  showToast("已複製電子名片網址");
}

function setupShareButtons() {
  ["#header-share", "#share-card"].forEach((selector) => {
    const button = document.querySelector(selector);
    if (button) {
      button.addEventListener("click", () => {
        shareCard().catch(() => showToast("分享失敗，請稍後再試"));
      });
    }
  });
}

function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => undefined);
    });
  }
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function init() {
  document.querySelector("#year").textContent = new Date().getFullYear();
  document.querySelector("#footer-brand").textContent = profile.brand;
  renderServices();
  setupShareButtons();
  setupServiceWorker();
  setupReveal();
  document.querySelector("#save-vcard").addEventListener("click", downloadVCard);
}

document.addEventListener("DOMContentLoaded", init);
