import axios from "axios";

/**
 * Determine the active API Base URL:
 * 1. process.env.REACT_APP_API_URL (configured via .env or deploy environment)
 * 2. localStorage override 'API_BASE_URL' (dynamic runtime switching during demos)
 * 3. Fallback to default local backend (http://localhost:5000/api)
 */
export const getBaseURL = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }

  const customUrl = localStorage.getItem("API_BASE_URL");
  if (customUrl && customUrl.trim() !== "") {
    return customUrl.replace(/\/+$/, "");
  }

  return "http://localhost:5000/api";
};

export const API_BASE_URL = getBaseURL();

/**
 * Convert relative /uploads/ media paths to fully qualified URLs
 * using the currently configured API host.
 */
export const getMediaUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const root = API_BASE_URL.replace(/\/api\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${root}${cleanPath}`;
};

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    // Bypass ngrok free-tier browser warning page for API requests
    "ngrok-skip-browser-warning": "true",
  },
});

// Add token automatically to every request and enforce ngrok bypass header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always ensure ngrok-skip-browser-warning is present
    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API errors gracefully
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Network / Ngrok Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;