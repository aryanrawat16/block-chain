import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the JWT (if we have one) to every outgoing request automatically,
// so individual pages never have to remember to do this themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
