function showAuthMessage(message, type = "error") {
  const element = document.getElementById("auth-message");
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

// Sesión activa de Supabase (o null si no hay nadie logueado).
async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

// Perfil (con su rol) del usuario logueado, o null.
async function getCurrentProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("id, email, role")
    .eq("id", session.user.id)
    .single();
  if (error) return null;
  return data;
}

// true solo si hay sesión activa y su rol es "developer".
async function isDeveloper() {
  const profile = await getCurrentProfile();
  return profile?.role === "developer";
}

async function logout() {
  await sb.auth.signOut();
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password"));

    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthMessage("Correo o contraseña incorrectos.");
      return;
    }
    window.location.href = "index.html";
  });
});
