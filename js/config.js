/* =========================================================
   CONFIGURACIÓN
   ---------------------------------------------------------
   1. Regístrate gratis en https://gnews.io (u otra API) y
      copia tu API key aquí abajo.
   2. Mientras no tengas una key, el sitio funciona igual
      pero con noticias de ejemplo (MOCK), para que puedas
      trabajar en el diseño sin depender de la API.
   ========================================================= */

const CONFIG = {
  // Pega tu API key de GNews.io aquí (deja vacío para usar datos de ejemplo)
  GNEWS_API_KEY: "921789ac54a3945c8e6e4546b0e6c312",

  // Endpoint base de GNews
  GNEWS_BASE_URL: "https://gnews.io/api/v4/search",

  // Idioma y país de las noticias
  LANG: "es",
  COUNTRY: "VE",

  // Términos de búsqueda por sección de tu sitio
  SECTIONS: {
    portada:        "geopolítica OR relaciones internacionales",
    analisis:       "análisis geopolítico OR opinión internacional",
    bono_banca:      "banco central OR bonos OR política monetaria",
    cultura_economia: "cultura OR economía global",
    internacional:  "internacional OR conflictos internacionales OR geopolítica global",
    economia:       "economía mundial OR mercados internacionales OR política económica",
    sociedad:       "sociedad OR cultura social OR educación y salud",
   tecnologia:     "tecnología OR inteligencia artificial OR innovación",
   venezuela:      "Venezuela OR política venezolana OR actualidad nacional",
   politica:       "política venezolana OR gobierno Venezuela OR Asamblea Nacional",
   energia:         "petróleo Venezuela OR energía OR acuerdos energéticos",
   cultura:         "cultura venezolana OR arte OR patrimonio cultural",
   opinion:         "opinión política OR análisis Venezuela OR editorial"
  },

   // Cuántos artículos pedir por sección
   MAX_RESULTS: 6
};
