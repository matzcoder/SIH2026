import axios from "axios";

/**
 * Determine active API Base URL:
 * 1. localStorage override 'API_BASE_URL' (dynamic runtime switching)
 * 2. process.env.REACT_APP_API_URL
 * 3. Fallback to default local FastAPI backend (http://localhost:5000/api)
 */
export const getBaseUrl = () => {
  const customUrl = localStorage.getItem("API_BASE_URL");
  if (customUrl && customUrl.trim() !== "") {
    return customUrl.replace(/\/+$/, "");
  }

  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }

  return "http://localhost:5000/api";
};

export const getBaseURL = getBaseUrl;
export const API_BASE_URL = getBaseUrl();

/**
 * Convert relative /uploads/ media paths to fully qualified URLs
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
  const root = getBaseUrl().replace(/\/api\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${root}${cleanPath}`;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseUrl();
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn("API Response Error:", error.response.status, error.response.data);
    } else {
      console.warn("Network / Ngrok Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Offline Queue Management
export const saveOfflineScan = (scanData) => {
  try {
    const existing = JSON.parse(localStorage.getItem("offline_scans") || "[]");
    existing.push({ ...scanData, queuedAt: new Date().toISOString() });
    localStorage.setItem("offline_scans", JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save offline scan:", e);
  }
};

export const getOfflineScans = () => {
  try {
    return JSON.parse(localStorage.getItem("offline_scans") || "[]");
  } catch {
    return [];
  }
};

export const clearOfflineScans = () => {
  localStorage.removeItem("offline_scans");
};

// API Specification Endpoints
export const scanProductImage = async (formData) => {
  try {
    return await apiClient.post("/products/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    // Fallback if backend mounts /scan directly
    return await apiClient.post("/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
};

export const fetchRules = async () => {
  return apiClient.get("/rules");
};

export const updateRule = async (ruleId, payload) => {
  return apiClient.put(`/rules/${ruleId}`, payload);
};

export const testRuleSandbox = async (testPayload) => {
  try {
    return await apiClient.post("/rules/test-sandbox", testPayload);
  } catch (err) {
    // Return simulated sandbox response if endpoint not implemented on server
    const { pattern, sampleText, flags = "i" } = testPayload || {};
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      const matches = Array.from((sampleText || "").matchAll(regex)).map((m) => m[0]);
      return { data: { matches, matched: matches.length > 0, error: null } };
    } catch (e) {
      return { data: { matches: [], matched: false, error: e.message } };
    }
  }
};

export const fetchAnalyticsData = async () => {
  try {
    return await apiClient.get("/inspections/analytics");
  } catch {
    return apiClient.get("/analytics/overview");
  }
};

export const fetchAuditLogs = async (params) => {
  return apiClient.get("/inspections", { params });
};

export const submitInspectionReport = async (reportData) => {
  try {
    return await apiClient.post("/inspections/submit", reportData);
  } catch {
    return apiClient.post("/inspections", reportData);
  }
};

export const API = apiClient;
export default apiClient;