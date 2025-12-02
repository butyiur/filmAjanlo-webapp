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

        try {
            // 1) backend login (felhasználó/jelszó ellenőrzés)
            await api.post("/auth/login", {
                username: u,
                password: p
            });

            // 2) ideiglenesen beállítjuk a Tokent,
            //    hogy a /auth/me hívás már Auth-tal menjen
            const tempToken = btoa(`${u}:${p}`);
            localStorage.setItem("basicAuth", tempToken);

            // 3) lekérdezzük ki vagyunk
            const me = await api.get("/auth/me");

            const role = me.data.role; // "ADMIN" vagy "USER"

            // 4) most már normálisan elmentjük mindent
            auth.setLogin(u, p, role);

            navigate("/");
        } catch (error) {
            console.error(error);
            auth.logout();
            setErr("Hibás felhasználónév vagy jelszó.");
        }
    };

    return (
        <form
            onSubmit={submit}
            style={{ padding: 20, display: "grid", gap: 8, maxWidth: 320 }}
        >
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

            {/* Később ide jöhet egy "Regisztráció" link is */}
        </form>
    );
}