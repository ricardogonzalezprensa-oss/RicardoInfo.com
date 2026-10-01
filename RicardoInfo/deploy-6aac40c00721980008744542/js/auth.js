const USER_STORAGE_KEY = "ricardoinfo.com-users";
const SESSION_STORAGE_KEY = "ricardoinfo.com-session";

function getMigratedStorageValue(storage, key, legacyKey) {
  const value = storage.getItem(key);
  if (value !== null) {
    storage.removeItem(legacyKey);
    return value;
  }

  const legacyValue = storage.getItem(legacyKey);
  if (legacyValue !== null) {
    storage.setItem(key, legacyValue);
    storage.removeItem(legacyKey);
  }
  return legacyValue;
}

function readUsers() {
  try {
    return JSON.parse(getMigratedStorageValue(localStorage, USER_STORAGE_KEY, "ricardoinfotv-users") || "[]");
  } catch (error) {
    return [];
  }
}

function writeUsers(users) {
  getMigratedStorageValue(localStorage, USER_STORAGE_KEY, "ricardoinfotv-users");
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function setSession(user) {
  getMigratedStorageValue(sessionStorage, SESSION_STORAGE_KEY, "ricardoinfotv-session");
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    startedAt: new Date().toISOString()
  }));
}

function readSession() {
  try {
    return JSON.parse(getMigratedStorageValue(sessionStorage, SESSION_STORAGE_KEY, "ricardoinfotv-session") || "null");
  } catch (error) {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem("ricardoinfotv-session");
}

function showAuthMessage(message, type = "error") {
  const element = document.getElementById("auth-message");
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = normalizeEmail(formData.get("email"));
      const password = String(formData.get("password"));
      const user = readUsers().find(item => item.email === email);

      if (!user || user.passwordHash !== await hashPassword(password)) {
        showAuthMessage("Correo o contraseña incorrectos.");
        return;
      }
      setSession(user);
      window.location.href = "index.html";
    });
  }
});
