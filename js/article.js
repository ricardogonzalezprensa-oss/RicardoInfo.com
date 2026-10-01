/* =========================================================
   Página de artículo — lee el id de la URL y pinta el contenido
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let article = id ? getCachedArticle(id) : null;

  // Si alguien entra directo al link sin pasar por el home, no hay caché:
  // cargamos portada y tomamos la primera como respaldo.
  if (!article) {
    const fallback = await fetchNews("portada");
    cacheArticles(fallback);
    article = fallback[0];
  }

  if (!article) {
    document.getElementById("article-root").innerHTML =
      `<div class="wrap status-msg error">No se encontró el artículo.</div>`;
    return;
  }

  renderArticle(article);
  loadRelated(article);
  setupReadProgress();
});

function setupReadProgress() {
  const bar = document.getElementById("read-progress");
  if (!bar) return;
  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function renderArticle(a) {
  document.title = `${a.title} — ricardoinfo.com`;

  document.getElementById("art-eyebrow").textContent = sectionLabel(a.category);
  document.getElementById("art-title").textContent = a.title;
  document.getElementById("art-sub").textContent = a.description || "";
  document.getElementById("art-source").textContent = a.source || "";
  document.getElementById("art-date").textContent = formatDate(a.publishedAt);

  const sourceLink = document.getElementById("art-source-link");
  if (sourceLink && a.url) {
    sourceLink.href = a.url;
    sourceLink.hidden = false;
  }

  const media = document.getElementById("art-media");
  media.innerHTML = `<img src="${a.image}" alt="${escapeHtml(a.title)}">`;

  const body = document.getElementById("art-body");
  const content = a.content && !/\.\.\.\s*\[\d+\s*chars?\]/i.test(a.content)
    ? a.content
    : a.description;
  const paragraphs = (content || "")
    .split("\n")
    .filter(p => p.trim().length);
  body.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("");
}

async function loadRelated(current) {
  const grid = document.getElementById("related-grid");
  try {
    let items = getCachedArticles();
    let others = items
      .filter(i => i.id !== current.id && i.category === current.category)
      .slice(0, 3);

    if (others.length < 3) {
      const fresh = await fetchNews(current.category || "portada");
      cacheArticles(fresh);
      items = getCachedArticles();
      others = items
        .filter(i => i.id !== current.id && i.category === current.category)
        .slice(0, 3);
    }

    if (others.length < 3) {
      others = items
        .filter(i => i.id !== current.id && !others.some(related => related.id === i.id))
        .slice(0, 3);
    }

    grid.innerHTML = others.map(renderCard).join("");
    attachCardHandlers(grid);
  } catch (e) {
    grid.innerHTML = "";
  }
}

function sectionLabel(cat) {
  return "Geopolítica";
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}
