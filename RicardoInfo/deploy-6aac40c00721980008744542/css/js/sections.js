// Secciones: viven en la tabla "sections" de Supabase.
// Lectura: pública. Escritura: solo perfiles con role = "developer"
// (esto lo aplica la base de datos, no este archivo — ver supabase-schema.sql).

async function getSections() {
  const { data, error } = await sb.from("sections").select("*");
  if (error || !data) return {};
  const sections = {};
  data.forEach((row) => { sections[row.id] = row; });
  return sections;
}

async function saveSection(sectionId, section) {
  const { error } = await sb
    .from("sections")
    .update({
      title: section.title,
      description: section.description,
      color: section.color
    })
    .eq("id", sectionId);
  return !error;
}
