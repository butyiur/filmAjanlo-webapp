import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/auth/register", {
                username,
                passwordHash: password,
            });
            setSuccess("Sikeres regisztráció!");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError("A felhasználónév már foglalt!");
        }
    };

    return (
        <form onSubmit={submit} style={{ padding: 20, display: "grid", gap: 8, maxWidth: 320 }}>
            <h2>Regisztráció</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && <div style={{ color: "green" }}>{success}</div>}
            <input placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Jelszó" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Regisztráció</button>
        </form>
    );
}