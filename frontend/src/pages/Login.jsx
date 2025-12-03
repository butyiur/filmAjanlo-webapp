import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { auth } from "../api/client";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // 1️⃣ Belépés → JWT token vissza
            const res = await api.post("/auth/login", { username, password });
            const token = res.data;

            // 2️⃣ Lekérdezzük ki vagyunk (me)
            const me = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 3️⃣ Token és user mentése
            auth.setLogin(token, me.data);

            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Hibás felhasználónév vagy jelszó.");
            auth.logout();
        }
    };

    return (
        <form onSubmit={submit} style={{ padding: 20, display: "grid", gap: 8, maxWidth: 320 }}>
            <h2>Bejelentkezés</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <input placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Jelszó" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Belépés</button>
        </form>
    );
}