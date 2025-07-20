import axios from "axios";
import { toast } from "sonner";

// Base URL for your backend server
const BASE_URL = "http://localhost:5000/api"; // Update this when deploying

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Optional: depends on cookie-based auth
});

// Automatically attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or sessionStorage if preferred
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong!";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
