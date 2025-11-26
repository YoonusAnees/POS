// Simple axios instance with interceptor for token
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Optional: response interceptor to handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Optionally: logout on 401
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;