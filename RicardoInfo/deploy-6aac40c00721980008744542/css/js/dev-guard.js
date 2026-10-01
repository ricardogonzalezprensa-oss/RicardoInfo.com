// Incluir en toda página de edición (agregar-noticia.html, editar.html,
// editar-seccion.html). Requiere que supabase-client.js y auth.js ya
// estén cargados. Si el usuario no es developer, lo saca de la página
// antes de que pueda ver o tocar el formulario.
(async () => {
  const allowed = await isDeveloper();
  if (!allowed) {
    window.location.href = "index.html";
  }
})();
