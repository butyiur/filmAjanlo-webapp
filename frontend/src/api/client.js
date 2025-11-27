import axios from "axios";

export const auth = {
    get() { return localStorage.getItem("basicAuth") || ""; },
    set(token) { token ? localStorage.setItem("basicAuth", token) : localStorage.removeItem("basicAuth"); }
};

const api = axios.create({ baseURL: "http://localhost:8080/api" });

api.interceptors.request.use((config) => {
    const token = auth.get();
    if (token) config.headers.Authorization = `Basic ${token}`;
    return config;
});

export default api;