import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/cg",
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err || {};
    if (response?.status === 401) {
      return Promise.reject(err);
    }
    if (response?.status === 429 && config) {
      const retries = (config as any).__retries ?? 0;
      if (retries < 3) {
        (config as any).__retries = retries + 1;
        const delay = 500 * Math.pow(2, retries);
        await new Promise((r) => setTimeout(r, delay));
        return axiosInstance(config);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
