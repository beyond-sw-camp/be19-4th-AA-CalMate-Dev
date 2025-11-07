import axios from "axios";
import { useUserStore } from "@/stores/user";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const user = useUserStore();
  const token = user.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let waitQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            "/api/auth/refresh",
            {},
            {
              withCredentials: true,
              headers: { "X-Device-Fp": navigator.userAgent },
            }
          );
          const newAccessToken = refreshRes.data.accessToken;
          const user = useUserStore();
          user.setToken(newAccessToken);
          waitQueue.forEach((resume) => resume(newAccessToken));
          waitQueue = [];
        } catch (e) {
          waitQueue = [];
          const user = useUserStore();
          user.logOut();
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        waitQueue.push((newToken) => {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
