import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function MovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: "",
        director: "",
        releaseYear: 2020,
        genre: "",
        rating: 7.0,
        description: "",
        posterUrl: "",
        categoryId: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/categories").then(r => setCategories(r.data));

        if (id) {
            api.get(`/movies/${id}`).then(r => {
                const m = r.data;
                setForm({
                    title: m.title ?? "",
                    director: m.director ?? "",
                    releaseYear: m.releaseYear ?? 2020,
                    genre: m.genre ?? "",
                    rating: m.rating ?? 7.0,
                    description: m.description ?? "",
                    posterUrl: m.posterUrl ?? "",
                    categoryId: m.category?.id ?? ""
                });
            });
        }
    }, [id]);

    const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.posterUrl && !/^https?:\/\//i.test(form.posterUrl)) {
            setError("A plakát URL-nek http:// vagy https:// kezdetűnek kell lennie.");
            return;
        }

        const payload = {
            title: form.title,
            director: form.director,
            releaseYear: Number(form.releaseYear),
            genre: form.genre,
            rating: Number(form.rating),
            description: form.description,
            posterUrl: form.posterUrl,
            category: form.categoryId ? { id: Number(form.categoryId) } : null
        };

        try {
            if (id) {
                await api.put(`/movies/${id}`, payload);
            } else {
                await api.post("/movies", payload);
            }
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Mentés sikertelen.");
        }
    };

    return (
        <div className="neo-container">
            <div className="neo-card">

                <h2 className="neo-title">
                    {id ? "🎬 Film szerkesztése" : "🎬 Új film hozzáadása"}
                </h2>

                {error && (
                    <div className="neo-error">{error}</div>
                )}

                <form onSubmit={submit} className="neo-form">

                    <input
                        className="neo-input"
                        placeholder="Cím *"
                        value={form.title}
                        onChange={(e) => change("title", e.target.value)}
                        required
                    />

                    <input
                        className="neo-input"
                        placeholder="Rendező"
                        value={form.director}
                        onChange={(e) => change("director", e.target.value)}
                    />

                    <div className="neo-row">
                        <input
                            className="neo-input"
                            type="number"
                            placeholder="Megjelenés éve"
                            value={form.releaseYear}
                            onChange={(e) => change("releaseYear", e.target.value)}
                        />

                        <input
                            className="neo-input"
                            placeholder="Műfaj"
                            value={form.genre}
                            onChange={(e) => change("genre", e.target.value)}
                        />
                    </div>

                    <input
                        className="neo-input"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="Értékelés (1-10)"
                        value={form.rating}
                        onChange={(e) => change("rating", e.target.value)}
                    />

                    <textarea
                        className="neo-textarea"
                        placeholder="Leírás"
                        value={form.description}
                        onChange={(e) => change("description", e.target.value)}
                    ></textarea>

                    <input
                        className="neo-input"
                        placeholder="Plakát URL (http/https)"
                        value={form.posterUrl}
                        onChange={(e) => change("posterUrl", e.target.value)}
                    />

                    {form.posterUrl && (
                        <img
                            src={form.posterUrl}
                            alt="preview"
                            className="neo-preview"
                            onError={(e) => e.currentTarget.style.display = "none"}
                        />
                    )}

                    <select
                        className="neo-select"
                        value={form.categoryId}
                        onChange={(e) => change("categoryId", e.target.value)}
                    >
                        <option value="">-- nincs kategória --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <div className="neo-button-row">
                        <button
                            type="button"
                            className="neo-btn cancel"
                            onClick={() => navigate("/")}
                        >
                            <CancelIcon /> Mégse
                        </button>

                        <button type="submit" className="neo-btn save">
                            <SaveIcon /> {id ? "Mentés" : "Hozzáadás"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}