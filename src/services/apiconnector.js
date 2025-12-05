import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "",
  timeout: 300000,
  headers: { "Content-Type": "application/json", Accept: "application/json" }
});

axiosInstance.interceptors.request.use(cfg => {
  try {
    const raw = localStorage.getItem("token");
    const token = raw ? JSON.parse(raw) : null;
    if (token) cfg.headers.Authorization = ` Bearer ${token}`;
  } catch (e) { }
  return cfg;
})

async function requestWithRetry(config, retries = 2, backoff = 300) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await axiosInstance.request(config);
    } catch (err) {
      lastError = err;
      // Retry only on network errors (no response) and if we have retries left
      const shouldRetry = !err.response && i < retries;
      if (!shouldRetry) break;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
    }
  }
  throw lastError;
}


export async function apiConnector(method, url, bodyData = null, headers = {}, params = null) {
  try {
    const cfg = { method: method.toLowerCase(), url, headers: { ...headers } };
    if (params) cfg.params = params;
    if (["post", "put", "patch", "delete"].includes(cfg.method)) cfg.data = bodyData;
    if (cfg.method === "get" && bodyData && !params) cfg.params = bodyData;

    const res = await requestWithRetry(cfg, 2, 300);
    return { ok: true, status: res.status, data: res.data, raw: res };

  } catch (err) {
    if (err.response) return { ok: false, status: err.response.status, data: err.response.data, message: err.response.data?.message || err.message };
    return { ok: false, status: null, data: null, message: err.message || "Network error" };
  }
}