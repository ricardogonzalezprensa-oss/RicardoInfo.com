function addEditLink(card, id) {
  const link = document.createElement("a");
  link.className = "edit-card-link";
  link.href = `editar.html?id=${encodeURIComponent(id)}`;
  link.textContent = "Editar";
  link.setAttribute("aria-label", `Editar ${card.title}`);
  card.appendChild(link);
}

function addReadMoreLink(element, id) {
  const body = element.classList.contains("main-story")
    ? element.querySelector(".main-story-overlay")
    : element.querySelector("[class$='-body']");
  if (!body || body.querySelector(".read-more-link")) return;
  const link = document.createElement("a");
  link.className = "read-more-link";
  link.href = `articulo.html?id=${encodeURIComponent(id)}`;
  link.textContent = "Leer noticia completa →";
  body.appendChild(link);
}

function fillCardElement(element, id, data, canEdit) {
  const title = element.querySelector("h1, h3");
  const tag = element.querySelector(".tag");
  const meta = element.querySelector(".meta");
  if (title) {
    title.textContent = "";
    const titleLink = document.createElement("a");
    titleLink.className = "card-title-link";
    titleLink.href = `articulo.html?id=${encodeURIComponent(id)}`;
    titleLink.textContent = data.title;
    title.appendChild(titleLink);
  }
  if (tag) tag.textContent = data.category;
  if (meta) meta.textContent = [data.author, data.time].filter(Boolean).join(" · ");
  if (element.classList.contains("main-story")) {
    element.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.75) 20%, rgba(0,0,0,0) 65%), url("${data.image}")`;
  } else {
    const media = element.querySelector("[class$='-media']");
    if (media) media.style.backgroundImage = `url("${data.image}")`;
  }
  if (canEdit) addEditLink(element, id);
  addReadMoreLink(element, id);
}

// Crea el marcado de una tarjeta de noticia nueva para agregarla a la
// grilla de "Últimas noticias" en portada.
function buildNewsCardElement(id) {
  const article = document.createElement("article");
  article.className = "news-card";
  article.dataset.cardId = id;
  article.innerHTML = `
    <div class="news-card-media"></div>
    <div class="news-card-body">
      <span class="tag"></span>
      <h3></h3>
    </div>`;
  return article;
}

async function renderCards() {
  const canEdit = await isDeveloper();
  const fixedElements = Array.from(document.querySelectorAll("[data-card-id]"));
  const shownIds = [];

  for (const element of fixedElements) {
    const id = element.dataset.cardId;
    shownIds.push(id);
    const data = await getCard(id);
    if (!data) continue;
    fillCardElement(element, id, data, canEdit);
  }

  const newsGrid = document.getElementById("news-grid");
  if (newsGrid) {
    const extraIds = await getRecentCardIds(shownIds, 6);
    for (const id of extraIds) {
      if (newsGrid.querySelector(`[data-card-id="${id}"]`)) continue;
      const data = await getCard(id);
      if (!data) continue;
      const article = buildNewsCardElement(id);
      newsGrid.appendChild(article);
      fillCardElement(article, id, data, canEdit);
    }
  }

  // Botones/enlaces que solo deben verse si el usuario es developer
  // (ej. "+ Agregar noticia", "Editar sección", "Editar esta noticia").
  document.querySelectorAll(".dev-only").forEach((el) => { el.hidden = !canEdit; });

  return canEdit;
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderCards();
  await updateAuthNavigation();

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.style.display === "flex";
    nav.style.display = isOpen ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "60px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#111216";
    nav.style.padding = "16px 24px";
    nav.style.gap = "14px";
  });
});

async function updateAuthNavigation() {
  const session = await getSession();
  const loginLink = document.querySelector('a[href="login.html"]');
  const accountLink = document.querySelector('a[href="cuenta.html"]');
  if (!loginLink || !accountLink) return;

  const isLoggedIn = Boolean(session);
  loginLink.hidden = isLoggedIn;
  accountLink.hidden = !isLoggedIn;
}
