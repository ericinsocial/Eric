const services = [
  {
    number: "01",
    title: "品牌行銷",
    preview: "先看懂要對誰說話,再談執行方向",
    href: "services/marketing/"
  },
  {
    number: "02",
    title: "占卜預測",
    preview: "看清局勢與選項,而不是替你做決定",
    href: "services/divination/"
  },
  {
    number: "03",
    title: "珠寶礦石",
    preview: "依需求與風格,客製真正想戴的礦石",
    href: "services/jewelry/"
  },
  {
    number: "04",
    title: "潛意識探索",
    preview: "整理反覆出現的模式,而不只是給答案",
    href: "services/subconscious/"
  }
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function renderServices() {
  const list = document.querySelector("#service-list");
  if (!list) return;
  list.innerHTML = services.map((service) => `
    <article class="service-card reveal" tabindex="0">
      <div class="service-card-inner">
        <div class="service-card-front">
          <p class="service-index" aria-hidden="true">${service.number}</p>
          <h3 class="service-title">${service.title}</h3>
        </div>
        <div class="service-card-back">
          <p class="service-preview">${service.preview}</p>
          <a class="service-more-link" href="${service.href}">了解${service.title} →</a>
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
      if (event.target.closest(".service-more-link")) return;
      if (hoverCapable()) return;
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

function renderQuestionList(mountId, { items, numbered }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("question-list");
  mount.innerHTML = items.map((item, index) => `
    <li class="question-item">${numbered ? `<span class="q-index">${String(index + 1).padStart(2, "0")}</span>` : ""}${item}</li>
  `).join("");
}

function renderCompareCards(mountId, pairs) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("compare-grid");
  mount.innerHTML = pairs.map(({ worse, better }) => `
    <div class="compare-card"><p class="compare-label">不要只問</p><p class="compare-text">${worse}</p></div>
    <div class="compare-card is-better"><p class="compare-label">更值得問</p><p class="compare-text">${better}</p></div>
  `).join("");
}

function renderTwinCards(mountId, items) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.classList.add("compare-grid", "twin-grid");
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

function init() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderServices();
  setupServiceFlip();
  setupServiceWorker();
  setupReveal();
  setupNavScrollSpy();
  setupHeroParallax();
}

document.addEventListener("DOMContentLoaded", init);
