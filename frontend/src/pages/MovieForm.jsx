import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

export default function MovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

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

    const change = (key, value) =>
        setForm(prev => ({ ...prev, [key]: value }));

    // Load categories + movie (edit mode)
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

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.posterUrl && !/^https?:\/\//i.test(form.posterUrl)) {
            setError("The poster URL should start with http:// or https://");
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
            if (id) await api.put(`/movies/${id}`, payload);
            else await api.post("/movies", payload);

            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Saving did not completed!");
        }
    };

    return (
        <div className="page-user-form">
            <div className="form-card">

                <h2 className="form-title">
                    {id ? "🎬 Edit Movie" : "🎬 Add new movie"}
                </h2>

                {error && <div className="neo-error">{error}</div>}

                <form onSubmit={submit}>

                    <input
                        className="form-input"
                        placeholder="Title *"
                        required
                        value={form.title}
                        onChange={(e) => change("title", e.target.value)}
                    />

                    <input
                        className="form-input"
                        placeholder="Director"
                        value={form.director}
                        onChange={(e) => change("director", e.target.value)}
                    />

                    <div className="form-row">
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Release Year"
                            value={form.releaseYear}
                            onChange={(e) => change("releaseYear", e.target.value)}
                        />

                        <input
                            className="form-input"
                            type="number"
                            placeholder="Rating (0-10)"
                            min="0" max="10" step="0.1"
                            value={form.rating}
                            onChange={(e) => change("rating", e.target.value)}
                        />
                    </div>

                    <input
                        className="form-input"
                        placeholder="Genre"
                        value={form.genre}
                        onChange={(e) => change("genre", e.target.value)}
                    />

                    <textarea
                        className="form-input"
                        placeholder="Description"
                        rows="4"
                        value={form.description}
                        onChange={(e) => change("description", e.target.value)}
                    />

                    <input
                        className="form-input"
                        placeholder="Poster URL (http/https)"
                        value={form.posterUrl}
                        onChange={(e) => change("posterUrl", e.target.value)}
                    />

                    {form.posterUrl && (
                        <img
                            src={form.posterUrl}
                            className="form-preview"
                            alt="Preview"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    )}

                    <select
                        className="form-input"
                        value={form.categoryId}
                        onChange={(e) => change("categoryId", e.target.value)}
                    >
                        <option value="">-- nincs kategória --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <div className="form-btn-row">
                        <button
                            type="button"
                            className="action-btn action-delete form-action"
                            onClick={() => navigate("/")}
                        >
                            ❌ Back
                        </button>

                        <button
                            type="submit"
                            className="action-btn action-edit form-action"
                        >
                            💾 {id ? "Save" : "Add"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}