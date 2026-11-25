import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ka_access_token");
    const activeChildId = localStorage.getItem("ka_active_child_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (activeChildId) {
      config.headers["X-Child-Profile-ID"] = activeChildId;
    }
  }
  return config;
});

export default api;