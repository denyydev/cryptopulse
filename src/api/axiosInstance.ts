import axios from "axios";
import { useAppStore } from "../store/useAppStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/cg",
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err || {};
    if (response?.status === 401) return Promise.reject(err);
    if (response?.status === 429 && config) {
      const retries = (config as any).__retries ?? 0;
      if (retries < 3) {
        (config as any).__retries = retries + 1;
        const delay = 500 * Math.pow(2, retries);
        await new Promise((r) => setTimeout(r, delay));
        return axiosInstance(config);
      }
    }
    if (err.code === "ERR_NETWORK" || err.message?.includes("CORS")) {
      throw new Error("network");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
