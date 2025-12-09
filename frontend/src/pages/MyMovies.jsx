import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function MyMovies() {
    const navigate = useNavigate();

    // --- állapotok ---
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [director, setDirector] = useState("");
    const [category, setCategory] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    const loaded = useRef(false);

    // --- filmek betöltése ---
    const loadMovies = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (director) params.director = director;
            if (category) params.category = category;
            if (yearFrom) params.yearFrom = yearFrom;
            if (yearTo) params.yearTo = yearTo;
            params.page = page - 1;
            params.size = pageSize;

            const res = await api.get("/user/movies", { params });

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.content || [];

            setMovies(data);
            setTotalPages(res.data.totalPages ?? 1);
        } catch (err) {
            console.error("❌ Error while loading own movie list...:", err);
        }
    };

    // --- kategóriák ---
    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("❌ Error while loading categories...:", err);
        }
    };

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        loadCategories();
        loadMovies();
    }, []);

    useEffect(() => {
        loadMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, director, category, yearFrom, yearTo, page]);

    // --- törlés ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure about deleting this film?")) return;
        try {
            await api.delete(`/user/movies/${id}`);
            loadMovies();
        } catch (err) {
            console.error("❌ Deleting own movie was not successfull:", err);
        }
    };

    return (
        <div className="page page-movie-list">

            {/* ---------------- SZŰRŐK ---------------- */}
            <div className="filter-bar">

                <input
                    className="filter-input"
                    placeholder="Searching title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <input
                    className="filter-input"
                    placeholder="Director"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                />

                <select
                    className="filter-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">(mind)</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>

                <input
                    className="filter-input"
                    placeholder="Year from"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                />

                <input
                    className="filter-input"
                    placeholder="Year to"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                />

                <button
                    className="neo-btn add"
                    onClick={() => navigate("/my-movies/new")}
                >
                    + New Movie
                </button>

            </div>

            {/* ---------------- FILM LISTA ---------------- */}
            <div className="movie-grid">

                {movies.length === 0 && (
                    <div className="no-results">
                        <span className="no-results-glow">No results in this category.</span>
                    </div>
                )}

                {movies.map((m) => (
                    <div className="movie-card" key={m.id}>
                        <img
                            src={m.posterUrl || "/react.svg"}
                            alt={m.title}
                        />

                        <div className="movie-title">{m.title}</div>

                        <div className="movie-meta">{m.director || "Unknown director"}</div>

                        <div className="movie-meta">
                            {m.releaseYear} • {m.genre}
                        </div>

                        <div className="movie-meta">
                            Rating: {m.rating ?? "N/A"}
                        </div>

                        {m.category && (
                            <div className="movie-meta" style={{ opacity: 0.7 }}>
                                {m.category.name}
                            </div>
                        )}

                        <div className="movie-actions">
                            <button
                                className="action-btn action-edit"
                                onClick={() => navigate(`/my-movies/${m.id}/edit`)}                            >
                                ✏️ Edit
                            </button>

                            <button
                                className="action-btn action-delete"
                                onClick={() => handleDelete(m.id)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* ---------------- LAPOZÁS ---------------- */}
            <div className="neo-pagination">
                <button
                    className="neo-page-btn"
                    onClick={() => page > 1 && setPage(page - 1)}
                >
                    ‹
                </button>

                <span className="neo-page-btn" style={{ cursor: "default" }}>
                    {page} / {totalPages}
                </span>

                <button
                    className="neo-page-btn"
                    onClick={() => page < totalPages && setPage(page + 1)}
                >
                    ›
                </button>
            </div>
        </div>
    );
}