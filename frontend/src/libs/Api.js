import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}`,
  withCredentials: true
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("JWT");
    console.log("Token from localStorage:", token ? "exists" : "missing"); // Debug
    console.log("Token preview:", token?.substring(0, 20) + "..."); // Debug
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization?.substring(0, 30) + "..."); // Debug
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;