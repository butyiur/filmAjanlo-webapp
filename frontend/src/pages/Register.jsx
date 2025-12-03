import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

        if (!username.trim() || !password.trim()) {
            setError("Töltsd ki az összes mezőt!");
            return;
        }

        try {
            const res = await api.post("/auth/register", { username, password });

            setSuccess(typeof res.data === "string" ? res.data : "Sikeres regisztráció!");

            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data || "A felhasználónév már foglalt!");
            } else {
                setError("Hiba történt a regisztráció során.");
            }
        }
    };

    return (
        <div className="page auth-page">
            <div className="neo-card auth-card">
                <div className="neo-card-inner">

                    <h2 className="auth-title">🆕 Regisztráció</h2>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <form onSubmit={submit} className="auth-form">
                        <input
                            className="neo-input"
                            placeholder="Felhasználónév"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            className="neo-input"
                            type="password"
                            placeholder="Jelszó"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit" className="neo-btn save">
                            Regisztráció
                        </button>

                        <button type="button" className="neo-btn cancel" onClick={() => navigate("/login")}>
                            Már van fiókom
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}