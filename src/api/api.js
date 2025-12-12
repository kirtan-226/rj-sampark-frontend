// Central place to tweak the backend base URL while migrating endpoints.
// Use env override when available (e.g., VITE_API_BASE_URL=https://your-api.com/api/)
const configured = (import.meta.env.VITE_API_BASE_URL || "").trim();
const fallback = "http://localhost:4000/api/";

// Always keep a single trailing slash for easy concatenation
export const BACKEND_ENDPOINT = `${configured || fallback}`.replace(/\/+$/, "/");
