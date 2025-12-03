import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { auth } from "../api/client";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Kérlek tölts ki minden mezőt!");
            return;
        }

        try {
            const res = await api.post("/auth/login", { username, password });

            const token = res.data;
            localStorage.setItem("token", token);

            const me = await api.get("/auth/me");
            auth.setLogin(token, me.data);

            navigate("/");
        } catch {
            setError("Hibás felhasználónév vagy jelszó!");
        }
    };

    return (
        <div className="page auth-page">
            <div className="neo-card auth-card">
                <div className="neo-card-inner">

                    <h2 className="auth-title">🔐 Bejelentkezés</h2>

                    {error && <div className="auth-error">{error}</div>}

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
                            Bejelentkezés
                        </button>
                    </form>

                    <div className="auth-link-row">
                        <span>Nincs még fiókod?</span>
                        <Link to="/register" className="auth-link">Regisztráció</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}