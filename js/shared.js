/* =========================================================
   Funciones compartidas: tarjetas, escape de HTML, navegación
   ========================================================= */

// Deja ver la página con un fundido suave al cargar (evita el "flash" en blanco)
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
  setupCompactHeader();
  setupMoreSections();
});

function setupMoreSections() {
  const wrap = document.querySelector(".more-sections-wrap");
  if (!wrap) return;

  const button = wrap.querySelector(".more-sections");
  const menu = wrap.querySelector(".more-sections-menu");
  if (!button || !menu) return;

  const closeMenu = () => {
    wrap.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !wrap.classList.contains("is-open");
    wrap.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (event) => {
    if (!wrap.contains(event.target)) closeMenu();
  });
}

function setupCompactHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-compact", window.scrollY > 40);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Aplica la misma transición de desvanecido a links normales (logo, "Inicio", etc.)
// que apuntan a otra página del sitio, sin tocar los enlaces de solo #ancla.
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || link.target === "_blank") return;
  if (!href.endsWith(".html") && !href.includes(".html#")) return;

  if (link.classList.contains("no-transition")) return;

  e.preventDefault();
  document.body.classList.add("is-leaving");
  setTimeout(() => { window.location.href = href; }, 180);
});

function renderCard(item) {
  return `
    <article class="card" data-id="${item.id}">
      <div class="card-media"><img src="${item.image}" alt="${escapeHtml(item.title)}"></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || "")}</p>
      <div class="source">${escapeHtml(item.source || "")}</div>
    </article>
  `;
}

function attachCardHandlers(container) {
  container.querySelectorAll("[data-id]").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => goToArticle(el.dataset.id));
  });
}

// Transición suave: se desvanece la página actual antes de navegar
function goToArticle(id) {
  document.body.classList.add("is-leaving");
  setTimeout(() => {
    window.location.href = `articulo.html?id=${encodeURIComponent(id)}`;
  }, 180);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
