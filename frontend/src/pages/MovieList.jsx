import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { auth } from "../api/client";

export default function MovieList() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = auth.getUser();
    const isAdmin = user?.role === "ADMIN";

    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [director, setDirector] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    const params = new URLSearchParams(location.search);
    const categoryFilterFromUrl = params.get("categoryId");

    // --------------------------------------------------------------------
    // ADATOK BETÖLTÉSE
    // --------------------------------------------------------------------
    const loadMovies = async () => {
        try {
            let res;

            if (categoryFilterFromUrl) {
                res = await api.get(`/movies/category/${categoryFilterFromUrl}`);
                setMovies(res.data);
                setTotalPages(1);
            } else {
                res = await api.get("/movies/search", {
                    params: {
                        title: search || null,
                        director: director || null,
                        categoryId: categoryId || null,
                        yearFrom: yearFrom || null,
                        yearTo: yearTo || null,
                        page: page - 1,
                        size: pageSize,
                    },
                });

                setMovies(res.data.content);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (err) {
            console.error("❌ Movies are not able to be loaded.", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch {
            console.error("❌ Error while loading categories.");
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, director, categoryId, yearFrom, yearTo, categoryFilterFromUrl]);

    // --------------------------------------------------------------------
    // TÖRLÉS
    // --------------------------------------------------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure about deleting this film?")) return;

        try {
            await api.delete(`/movies/${id}`);
            loadMovies();
        } catch (err) {
            console.error("❌ Error while deleting this movie:", err);
        }
    };

    // --------------------------------------------------------------------
    // RENDER
    // --------------------------------------------------------------------
    return (
        <div className="page page-movie-list">

            {/* ---------------- SZŰRŐK ---------------- */}
            {!categoryFilterFromUrl && (
                <div className="filter-bar">

                    <input
                        className="filter-input"
                        placeholder="Search title"
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
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">(Genre)</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
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

                    {isAdmin && (
                        <button
                            className="neo-btn add"
                            onClick={() => navigate("/movies/new")}
                        >
                            + New Movie
                        </button>
                    )}

                    {/* Oldal méret */}
                    <select
                        className="page-size-select"
                        value={pageSize}
                        onChange={(e) => { setPageSize(e.target.value); setPage(1); }}
                    >
                        <option value={6}>6 / oldal</option>
                        <option value={12}>12 / oldal</option>
                        <option value={20}>20 / oldal</option>
                        <option value={50}>50 / oldal</option>
                    </select>
                </div>
            )}

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

                        <div className="movie-meta">
                            {m.director || "Unknown Director"}
                        </div>

                        <div className="movie-meta">
                            {m.releaseYear} • {m.genre || "N/A"}
                        </div>

                        <div className="movie-meta">
                            Értékelés: {m.rating ?? "N/A"}
                        </div>

                        {m.category && (
                            <div className="movie-meta" style={{ fontSize: "13px", opacity: 0.7 }}>
                                {m.category.name}
                            </div>
                        )}

                        {isAdmin && (
                            <div className="movie-actions">

                                <button
                                    className="action-btn action-edit"
                                    onClick={() => navigate(`/movies/${m.id}/edit`)}
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    className="action-btn action-delete"
                                    onClick={() => handleDelete(m.id)}
                                >
                                    🗑️ Deletef
                                </button>

                            </div>
                        )}
                    </div>
                ))}

            </div>

            {/* ---------------- LAPOZÁS ---------------- */}
            {!categoryFilterFromUrl && totalPages > 1 && (
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
            )}
        </div>
    );
}