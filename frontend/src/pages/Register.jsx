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

            setSuccess(typeof res.data === "string" ? res.data : "Registration was successfull!");

            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data || "Username already exists!");
            } else {
                setError("An error occured while registrating.");
            }
        }
    };

    return (
        <div className="register-page">
            <div className="neo-card auth-card">
                <div className="neo-card-inner">

                    <h2 className="auth-title">🆕 Registration</h2>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <form onSubmit={submit} className="auth-form">
                        <input
                            className="neo-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            className="neo-input"
                            type="Password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit" className="reg-btn primary">
                            Registration
                        </button>

                        <button type="button" className="reg-btn secondary" onClick={() => navigate("/login")}>
                            I already have an account
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}