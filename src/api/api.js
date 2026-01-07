// Central place to tweak the backend base URL while migrating endpoints.
// Use env override when available (e.g., VITE_API_BASE_URL=https://your-api.com/api/)
const configured = (import.meta.env.VITE_API_BASE_URL || "").trim();
const fallback = "https://rj-sampark.vercel.app/api/";
// const fallback = "http://localhost:4000/api/";

// Always keep a single trailing slash for easy concatenation
export const BACKEND_ENDPOINT = `${configured || fallback}`.replace(/\/+$/, "/");

const SESSION_DURATION_MS = 10* 60 * 1000;
const AUTH_TOKEN_KEY = "authToken";
const AUTH_EXPIRES_AT_KEY = "authExpiresAt";
const SEVAK_DETAILS_KEY = "sevakDetails";

export const setAuthSession = (basicToken) => {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  localStorage.setItem(AUTH_TOKEN_KEY, basicToken);
  localStorage.setItem(AUTH_EXPIRES_AT_KEY, String(expiresAt));
  return expiresAt;
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
  localStorage.removeItem(SEVAK_DETAILS_KEY);
};

export const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  const expiresAtRaw = localStorage.getItem(AUTH_EXPIRES_AT_KEY);
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    clearAuthSession();
    return null;
  }
  return token;
};
