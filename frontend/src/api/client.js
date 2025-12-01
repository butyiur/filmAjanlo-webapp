import axios from "axios";

// Basic Auth token tárolása (base64)
export const auth = {
    get() {
        return localStorage.getItem("basicAuth") || "";
    },
    set(token) {
        if (token) localStorage.setItem("basicAuth", token);
        else localStorage.removeItem("basicAuth");
    },
    logout() {
        localStorage.removeItem("basicAuth");
    }
};

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Minden kérés előtt hozzáadjuk az Authorization-t
api.interceptors.request.use((config) => {
    const token = auth.get();
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});

export default api;