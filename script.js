const profile = {
  nameEn: "Eric Chen",
  nameZh: "陳昱華",
  brand: "詠真堂",
  brandEn: "YONG ZHEN TANG",
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
    eyebrow: "BRAND & MARKETING",
    title: "品牌與行銷顧問",
    text: "品牌定位、內容策略、數位行銷與專案規劃，將模糊的想法轉化為能被市場理解的價值。"
  },
  {
    number: "02",
    eyebrow: "TAROT & I CHING",
    title: "塔羅與易經",
    text: "不替你決定人生，而是協助你重新理解問題、局勢與選項，找到真正適合自己的方向。"
  },
  {
    number: "03",
    eyebrow: "JEWELRY & MINERALS",
    title: "珠寶與礦石",
    text: "依個人氣質、需求與象徵意義，提供礦石搭配、客製手串與珠寶選品建議。"
  },
  {
    number: "04",
    eyebrow: "PERSONAL INSIGHT",
    title: "個人探索",
    text: "透過對話、象徵與潛意識探索，重新看見反覆出現的問題，以及下一步可以改變的地方。"
  }
];

const contactItems = [
  { key: "phone", label: "電話", getHref: (value) => `tel:${value}` },
  { key: "email", label: "Email", getHref: (value) => `mailto:${value}` },
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
      <div class="service-number" aria-hidden="true">${service.number}</div>
      <div>
        <p class="eyebrow">${service.eyebrow}</p>
        <h3>${service.title}</h3>
        <p>${service.text}</p>
      </div>
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
    text: "看見本質，做出更好的選擇。",
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
