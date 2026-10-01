// Conexión a Supabase (base de datos + autenticación).
// La "anon key" es pública a propósito: los permisos reales
// se aplican del lado del servidor con Row Level Security.
const SUPABASE_URL = "https://hknentetpqmsvysoeyow.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jbOZaz4PBf1SXAJdLED6aQ_b5UU70iy";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
