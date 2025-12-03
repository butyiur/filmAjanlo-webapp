import axios from "axios";

export const auth = {
    getToken() {
        return localStorage.getItem("token") || "";
    },

    getUser() {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    },

    getUserRole() {
        const u = this.getUser();
        return u ? u.role : null;
    },

    setLogin(token, user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Token automatikus hozzáadása
api.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
export const getUserRole = () => auth.getUserRole();