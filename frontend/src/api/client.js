import axios from "axios";

export const auth = {
    getToken() {
        return localStorage.getItem("basicAuth") || "";
    },

    getUser() {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;   // { username, role }
    },

    getUserRole() {
        const u = this.getUser();
        return u ? u.role : null;
    },

    // login mentése
    setLogin(username, password, role) {
        if (!username || !password) {
            this.logout();
            return;
        }
        const token = btoa(`${username}:${password}`);
        localStorage.setItem("basicAuth", token);
        localStorage.setItem("user", JSON.stringify({ username, role }));
    },

    logout() {
        localStorage.removeItem("basicAuth");
        localStorage.removeItem("user");
    }
};

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Minden kéréshez Basic Auth header
api.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});

export default api;

// külön export – erre volt szükséged
export const getUserRole = () => auth.getUserRole();