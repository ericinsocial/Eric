const profile = {
  nameEn: "Eric Chen",
  nameZh: "陳昱華",
  brand: "詠真堂",
  phone: "",
  email: "",
  lineUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  websiteUrl: "",
  bookingUrl: ""
};

const services = [
  {
    number: "01",
    title: "品牌與行銷",
    lines: ["從定位、內容到數位體驗", "讓品牌被看見也被理解"]
  },
  {
    number: "02",
    title: "塔羅與易經",
    lines: ["看清局勢與選項", "找到更適合自己的下一步"]
  },
  {
    number: "03",
    title: "珠寶與礦石",
    lines: ["依照個人需求與風格", "提供礦石與飾品搭配建議"]
  },
  {
    number: "04",
    title: "個人探索",
    lines: ["透過對話與象徵理解問題", "重新整理方向與行動"]
  }
];

const contactItems = [
  { key: "phone", label: "電話", getHref: (value) => `tel:${value}` },
  { key: "email", label: "電子郵件", getHref: (value) => `mailto:${value}` },
  { key: "lineUrl", label: "LINE", getHref: (value) => value },
  { key: "instagramUrl", label: "Instagram", getHref: (value) => value },
  { key: "facebookUrl", label: "Facebook", getHref: (value) => value },
  { key: "websiteUrl", label: "個人網站", getHref: (value) => value },
  { key: "bookingUrl", label: "預約連結", getHref: (value) => value }
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
      <a class="service-link" href="#contact" aria-label="聯絡 Eric 了解${service.title}">聯絡了解 →</a>
    </article>
  `).join("");
}

function renderContactActions() {
  const container = document.querySelector("#contact-actions");
  const available = contactItems.filter((item) => profile[item.key]);
  container.innerHTML = available.map((item) => {
    const value = profile[item.key];
    return `<a class="contact-action" href="${item.getHref(value)}" target="${item.key.endsWith("Url") ? "_blank" : "_self"}" rel="noopener">${item.label}</a>`;
  }).join("");

  const primary = document.querySelector("#primary-contact");
  const first = available[0];
  if (first) {
    primary.href = first.getHref(profile[first.key]);
    if (first.key.endsWith("Url")) {
      primary.target = "_blank";
      primary.rel = "noopener";
    }
  } else {
    primary.href = "#";
    primary.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("請先在 script.js 填入聯絡資訊");
    }, { once: false });
  }
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
    profile.email ? `EMAIL:${profile.email}` : "",
    profile.websiteUrl ? `URL:${profile.websiteUrl}` : window.location.href,
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
  ["#header-share", "#hero-share", "#share-card"].forEach((selector) => {
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
  renderContactActions();
  setupShareButtons();
  setupServiceWorker();
  setupReveal();
  document.querySelector("#save-vcard").addEventListener("click", downloadVCard);
}

document.addEventListener("DOMContentLoaded", init);
