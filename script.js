const services = [
  {
    title: "品牌行銷",
    desc: "整合線上與線下資源，把策略真正執行出來",
    href: "services/marketing/"
  },
  {
    title: "占卜預測",
    desc: "論運不論命，透過推演看清局勢與未來走向",
    href: "services/divination/"
  },
  {
    title: "珠寶礦石",
    desc: "從需求、風格與日常配戴，找到真正適合的作品",
    href: "services/jewelry/"
  },
  {
    title: "潛意識探索",
    desc: "看見反覆出現的模式，重新理解自己的選擇",
    href: "services/subconscious/"
  }
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function renderServices() {
  const list = document.querySelector("#service-list");
  if (!list) return;
  list.innerHTML = services.map((service) => `
    <a class="service-card reveal" href="${service.href}">
      <h3 class="service-title">${service.title}</h3>
      <p class="service-preview">${service.desc}</p>
      <span class="service-more-link">了解更多 →</span>
    </a>
  `).join("");
}

function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => undefined);
    });
  }
}

function setupRevealGroup(selector, visibleClass, threshold) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add(visibleClass));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(visibleClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  elements.forEach((element) => observer.observe(element));
}

function setupReveal() {
  setupRevealGroup(".reveal", "visible", 0.12);
  setupRevealGroup(".reveal-block", "is-visible", 0.15);
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

function setupBottomNavReveal() {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  let ticking = false;
  const update = () => {
    nav.classList.toggle("is-visible", window.scrollY > 120);
    ticking = false;
  };
  update();
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
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

function renderInsightCard(mountId, { lede, body, result }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("card", "insight-card");
  mount.innerHTML = `
    ${lede ? `<p class="card-lede">${lede}</p>` : ""}
    ${body ? `<p class="body-text">${body}</p>` : ""}
    ${result ? `<p class="card-result">${result}</p>` : ""}
  `;
}

function renderTagList(mountId, items) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("tag-list");
  mount.innerHTML = items.map((item) => `<span>${item}</span>`).join("");
}

function renderTwinCards(mountId, items) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("compare-grid");
  mount.innerHTML = items.map((text) => `<div class="compare-card"><p class="compare-text">${text}</p></div>`).join("");
}

function renderNoticeBox(mountId, html) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("notice-box");
  mount.innerHTML = `<p>${html}</p>`;
}

function renderServiceCTA(mountId, { title, desc, buttons }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("cta-block");
  mount.innerHTML = `
    <div>
      <p class="cta-title">${title}</p>
      <p class="cta-desc">${desc}</p>
    </div>
    <div class="cta-actions">
      ${buttons.map((b) => `<a class="cta-button${b.secondary ? " is-secondary" : ""}" href="${b.href}"${b.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${b.label}</a>`).join("")}
    </div>
  `;
}

function renderAccordion(mountId, sections) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("accordion");
  mount.innerHTML = sections.map((section, index) => `
    <div class="accordion-item">
      <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="${mountId}-panel-${index}">${section.title}</button>
      <div class="accordion-panel" id="${mountId}-panel-${index}">
        <div class="accordion-panel-inner">${section.items.join("<br>")}</div>
      </div>
    </div>
  `).join("");
  mount.querySelectorAll(".accordion-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.nextElementSibling.classList.toggle("is-open");
    });
  });
}

function renderFlowDiagram(mountId, steps) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("flow-diagram");
  mount.innerHTML = steps.map((step, index) => `
    ${index > 0 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""}
    <span class="flow-step">${step}</span>
  `).join("");
}

function renderPriceCard(mountId, { name, meta, amount, includes, button }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("price-card");
  mount.innerHTML = `
    <p class="price-name">${name}</p>
    <p class="price-meta">${meta}</p>
    <p class="price-amount">${amount}</p>
    <ul class="price-includes">${includes.map((item) => `<li>${item}</li>`).join("")}</ul>
    <a class="cta-button" href="${button.href}"${button.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${button.label}</a>
  `;
}

function renderPlaceholder(mountId, { label, ratio, desktop, mobile, alt }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("image-placeholder");
  if (ratio) mount.classList.add(ratio);
  mount.innerHTML = `${label}<br>建議比例：${desktop}<br>手機版裁切：${mobile}<br>alt：${alt}`;
}

function renderPlaceholderGrid(mountId, items, colsClass) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("placeholder-grid");
  if (colsClass) mount.classList.add(colsClass);
  mount.innerHTML = items.map(({ label, ratio, desktop, mobile, alt }) => `
    <div class="image-placeholder${ratio ? ` ${ratio}` : ""}">${label}<br>建議比例：${desktop}<br>手機版裁切：${mobile}<br>alt：${alt}</div>
  `).join("");
}

function init() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderServices();
  setupServiceWorker();
  setupReveal();
  setupNavScrollSpy();
  setupBottomNavReveal();
  setupHeroParallax();
}

document.addEventListener("DOMContentLoaded", init);
