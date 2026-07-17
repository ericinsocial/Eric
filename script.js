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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function renderServices() {
  const list = document.querySelector("#service-list");
  list.innerHTML = services.map((service) => `
    <article class="service-card reveal" tabindex="0">
      <div class="service-card-inner">
        <div class="service-card-front">
          <p class="service-index" aria-hidden="true">${service.number}</p>
          <h3>${service.title}</h3>
        </div>
        <div class="service-card-back">
          <p>${service.lines[0]}<br>${service.lines[1]}</p>
          <div class="service-tags">${service.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          <a class="service-link" href="#contact" aria-label="聯絡 Eric 了解${service.title}">聯絡了解 →</a>
        </div>
      </div>
    </article>
  `).join("");
}

function setupServiceFlip() {
  const cards = Array.from(document.querySelectorAll(".service-card"));
  if (!cards.length) return;
  const hoverCapable = () => window.matchMedia("(hover: hover)").matches;

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (hoverCapable()) return;
      if (event.target.closest(".service-link")) return;
      cards.forEach((other) => {
        if (other !== card) other.classList.remove("is-flipped");
      });
      card.classList.toggle("is-flipped");
    });
  });

  document.addEventListener("click", (event) => {
    if (hoverCapable()) return;
    if (event.target.closest(".service-card")) return;
    cards.forEach((card) => card.classList.remove("is-flipped"));
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

function setupNavScrollSpy() {
  const navGroups = Array.from(document.querySelectorAll(".site-nav, .bottom-nav"));
  if (!navGroups.length) return;

  const moveIndicator = (nav, link) => {
    const indicator = nav.querySelector(".nav-indicator");
    if (!indicator || !link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  const setActive = (name) => {
    navGroups.forEach((nav) => {
      const link = nav.querySelector(`[data-nav="${name}"]`);
      nav.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
      if (link) {
        link.classList.add("active");
        moveIndicator(nav, link);
      }
    });
  };

  const sections = ["top", "services", "about", "contact"]
    .map((name) => ({ name, el: document.getElementById(name) }))
    .filter((entry) => entry.el);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find((s) => s.el === entry.target);
          if (match) setActive(match.name);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach((s) => observer.observe(s.el));
  }

  window.addEventListener("resize", () => {
    navGroups.forEach((nav) => {
      const active = nav.querySelector("a.active");
      if (active) moveIndicator(nav, active);
    });
  });

  navGroups.forEach((nav) => {
    const active = nav.querySelector("a.active");
    if (active) moveIndicator(nav, active);
  });
}

function setupHeroParallax() {
  if (prefersReducedMotion.matches) return;
  const portraits = document.querySelectorAll(".hero-portrait");
  if (!portraits.length) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const offset = window.scrollY * 0.08;
      portraits.forEach((portrait) => {
        portrait.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

function init() {
  document.querySelector("#year").textContent = new Date().getFullYear();
  renderServices();
  setupServiceFlip();
  setupServiceWorker();
  setupReveal();
  setupNavScrollSpy();
  setupHeroParallax();
}

document.addEventListener("DOMContentLoaded", init);
