/* =========================================================
   API de noticias
   - Si hay API key configurada, intenta traer noticias reales.
   - Si falla o no hay key, usa MOCK_ARTICLES para que el sitio
     nunca se vea vacío mientras desarrollas.
   ========================================================= */

const MOCK_ARTICLES = [
  {
    id: "m1",
    title: "Trump arremete con aranceles",
    description: "El anuncio reabre la disputa comercial con varios socios estratégicos y genera reacciones inmediatas en los mercados.",
    content: "El anuncio reabre la disputa comercial con varios socios estratégicos y genera reacciones inmediatas en los mercados. Analistas señalan que la medida busca presionar en negociaciones paralelas sobre seguridad y tecnología.\n\nLos países afectados ya evalúan medidas de represalia, mientras las bolsas de valores registran caídas moderadas en los sectores más expuestos al comercio exterior.\n\nEl trasfondo político de la decisión se vincula con la agenda electoral interna, según distintos analistas consultados.",
    image: "https://images.unsplash.com/photo-1391189863430-ab87e120f312?q=80&w=1200&auto=format&fit=crop",
    source: "Reuters",
    category: "analisis",
    publishedAt: "2026-09-10"
  },
  {
    id: "m2",
    title: "Delcy Rodríguez, en el centro del tablero",
    description: "Su papel en las negociaciones recientes vuelve a poner el foco en el equilibrio de poder regional.",
    content: "Su papel en las negociaciones recientes vuelve a poner el foco en el equilibrio de poder regional. Distintas cancillerías siguen de cerca los movimientos diplomáticos de las últimas semanas.\n\nFuentes cercanas al proceso indican que las conversaciones podrían extenderse en los próximos meses.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop",
    source: "AFP",
    category: "analisis",
    publishedAt: "2026-09-09"
  },
  {
    id: "m3",
    title: "Banco Central fija nueva tasa",
    description: "La decisión busca contener la inflación sin frenar de golpe la actividad económica.",
    content: "La decisión busca contener la inflación sin frenar de golpe la actividad económica. El ajuste era anticipado por buena parte de los analistas del mercado.\n\nSe espera que el impacto se sienta primero en el crédito hipotecario y de consumo.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    source: "Bloomberg",
    category: "analisis",
    publishedAt: "2026-09-08"
  },
  {
    id: "m4",
    title: "Bono de pensionados activos",
    description: "Se amplía el alcance del beneficio para incluir a nuevos grupos de jubilados.",
    content: "Se amplía el alcance del beneficio para incluir a nuevos grupos de jubilados. El monto se ajustará trimestralmente según indicadores oficiales.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    source: "El Nacional",
    category: "bono_banca",
    publishedAt: "2026-09-07"
  },
  {
    id: "m5",
    title: "China Incrementa IA en la banca",
    description: "Trabajadores públicos recibirán un ajuste salarial en las próximas semanas.",
    content: "Trabajadores públicos recibirán un ajuste salarial en las próximas semanas, según fuentes del ministerio.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
    source: "Reuters",
    category: "bono_banca",
    publishedAt: "2026-09-06"
  },
  {
    id: "m6",
    title: "Asi funciona el calendario de pagos del próximo año fiscal",
    description: "El gobierno adelanta lineamientos generales sobre el calendario de pagos.",
    content: "El gobierno adelanta lineamientos generales sobre el calendario de pagos del próximo año fiscal.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    source: "AP",
    category: "Informacion Bancaria",
    publishedAt: "2026-09-05"
  }
];

/**
 * Trae noticias para una sección. Si hay API key, intenta la API real;
 * si no, o si falla, devuelve datos de ejemplo filtrados por categoría.
 */
async function fetchNews(sectionKey) {
  const query = CONFIG.SECTIONS[sectionKey] || CONFIG.SECTIONS.portada;
  return fetchNewsQuery(query, sectionKey);
}

async function fetchNewsQuery(query, sectionKey = "busqueda") {

  if (!CONFIG.GNEWS_API_KEY) {
    return mockBySection(sectionKey);
  }

  const url = `${CONFIG.GNEWS_BASE_URL}?q=${encodeURIComponent(query)}` +
              `&lang=${CONFIG.LANG}&max=${CONFIG.MAX_RESULTS}` +
              `&token=${CONFIG.GNEWS_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API respondió ${res.status}`);
    const data = await res.json();

    if (!data.articles || !data.articles.length) throw new Error("Sin artículos");

    return data.articles.map((a, i) => ({
      id: `api-${sectionKey}-${Date.now()}-${i}`,
      title: a.title,
      description: a.description,
      content: a.content || a.description,
      url: a.url || "",
      image: a.image,
      source: a.source?.name || "Fuente",
      category: sectionKey,
      publishedAt: a.publishedAt
    }));
  } catch (err) {
    console.warn(`[fetchNews] Falló la API (${err.message}); usando datos de ejemplo.`);
    return mockBySection(sectionKey);
  }
}

function mockBySection(sectionKey) {
  if (sectionKey === "portada") return MOCK_ARTICLES;
  return MOCK_ARTICLES.filter(a => a.category === sectionKey);
}

/** Guarda los artículos ya cargados para poder abrirlos en la página de artículo */
function cacheArticles(articles) {
  const existing = JSON.parse(sessionStorage.getItem("articleCache") || "{}");
  articles.forEach(a => { existing[a.id] = a; });
  sessionStorage.setItem("articleCache", JSON.stringify(existing));
}

function getCachedArticle(id) {
  const existing = JSON.parse(sessionStorage.getItem("articleCache") || "{}");
  return existing[id] || null;
}

function getCachedArticles() {
  return Object.values(JSON.parse(sessionStorage.getItem("articleCache") || "{}"));
}
