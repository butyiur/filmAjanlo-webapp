import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { auth } from "../api/client";

export default function Login() {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErr("");

        const token = btoa(`${u}:${p}`);

        try {
            // Valódi login a backend felé
            await api.post("/auth/login", {
                username: u,
                password: p
            });

            // Ha sikeres → token mentése
            auth.set(token);

            navigate("/");
        } catch (error) {
            auth.logout();
            setErr("Hibás felhasználónév vagy jelszó.");
        }
    };

    return (
        <form onSubmit={submit} style={{ padding: 20, display: "grid", gap: 8, maxWidth: 320 }}>
            <h2>Bejelentkezés</h2>
            {err && <div style={{ color: "red" }}>{err}</div>}

            <input
                placeholder="Felhasználónév"
                value={u}
                onChange={(e) => setU(e.target.value)}
            />

            <input
                placeholder="Jelszó"
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
            />

            <button type="submit">Belépés</button>
        </form>
    );
}