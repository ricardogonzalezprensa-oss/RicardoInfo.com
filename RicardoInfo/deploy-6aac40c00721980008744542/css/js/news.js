// Noticias: viven en la tabla "news" de Supabase.
// Lectura: pública. Escritura: solo perfiles con role = "developer"
// (esto lo aplica la base de datos, no este archivo — ver supabase-schema.sql).

async function getCard(id) {
  if (!id) return null;
  const { data, error } = await sb.from("news").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}

// Crea una noticia nueva. Devuelve su id.
async function addCustomCard(data) {
  const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const { error } = await sb.from("news").insert({ id, ...data });
  if (error) throw error;
  return id;
}

// Guarda cambios sobre una noticia existente.
async function saveCardEdit(id, data) {
  const { error } = await sb.from("news").update(data).eq("id", id);
  return !error;
}

// Ids de las noticias de una sección, más recientes primero.
async function getSectionCardIds(sectionId) {
  const { data, error } = await sb
    .from("news")
    .select("id")
    .eq("section", sectionId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => row.id);
}

// Ids de las noticias más recientes que no estén ya mostradas (para la portada).
async function getRecentCardIds(excludeIds = [], limit = 6) {
  const { data, error } = await sb
    .from("news")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(limit + excludeIds.length);
  if (error || !data) return [];
  return data.map((row) => row.id).filter((id) => !excludeIds.includes(id)).slice(0, limit);
}
