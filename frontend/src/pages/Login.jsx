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

        // Basic token előállítása: base64(username:password)
        const token = btoa(`${u}:${p}`);
        auth.set(token);
        navigate("/"); // elég, a védett műveletek (POST/PUT/DELETE) majd működni fognak

        try {
            // próbahívás védett végpontra (pl. POST /movies egy üres teszttel – inkább HEAD)
            await api.get("/movies"); // elég, hogy kiderüljön jó-e a header
            navigate("/");
        } catch {
            auth.set("");
            setErr("Hibás felhasználónév vagy jelszó.");
        }
    };

    return (
        <form onSubmit={submit} style={{ padding: 20, display: "grid", gap: 8, maxWidth: 320 }}>
            <h2>Bejelentkezés</h2>
            {err && <div style={{ color: "red" }}>{err}</div>}
            <input placeholder="Felhasználónév" value={u} onChange={e=>setU(e.target.value)} />
            <input placeholder="Jelszó" type="password" value={p} onChange={e=>setP(e.target.value)} />
            <button type="submit">Belépés</button>
        </form>
    );
}